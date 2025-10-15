import type { Request, Response, NextFunction } from "express";
import { Otp, User } from "../user/user.model";
import createHttpError from "http-errors";
import { generateTokenPair, verifyRefreshToken } from "../../utils/token.utils";
import "dotenv/config";
import { RefreshToken } from "../user/refreshToken.model";

async function sendOtpHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { mobile } = req.body;

    // Generate a more secure OTP code
    const code = Math.floor(100000 + Math.random() * 900000);

    // Find user
    const user = await User.findOne({ where: { mobile } });

    if (!user) {
      // User doesn't exist, create user and OTP directly
      const newUser = await User.create({ mobile });
      await Otp.create({
        code,
        expire_at: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
        user_id: newUser.get("id"),
      });

      return res.status(200).json({
        message: "OTP sent successfully",
        code,
      });
    }

    // User exists, check for existing OTP
    const existingOtp = await Otp.findOne({
      where: { user_id: user.get("id") },
    });

    // If OTP exists and hasn't expired, prevent sending new one
    if (existingOtp && (existingOtp.get("expire_at") as Date) > new Date()) {
      const timeLeft = Math.ceil(
        ((existingOtp.get("expire_at") as Date).getTime() - Date.now()) / 1000
      );
      throw createHttpError.BadRequest(
        `Please wait ${timeLeft} seconds before requesting a new OTP`
      );
    }

    // Update existing OTP or create new one

    if (existingOtp) {
      // Update the existing OTP
      await existingOtp.update({
        code,
        expire_at: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
        attempts: 0, // Reset attempts
      });
    } else {
      // Create new OTP
      await Otp.create({
        code,
        expire_at: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
        user_id: user.get("id"),
      });
    }

    return res.status(200).json({
      message: "OTP sent successfully",
      code,
    });
  } catch (error) {
    next(error);
  }
}

async function verifyOtpHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { code, mobile } = req.body;

    const user = await User.findOne({ where: { mobile } });
    if (!user) {
      throw createHttpError.NotFound("User not found");
    }

    const otpRecord = await Otp.findOne({
      where: { user_id: user.get("id") },
    });

    if (!otpRecord) {
      throw createHttpError.NotFound("OTP not found. Please request a new OTP");
    }

    // Check if OTP has expired
    if ((otpRecord.get("expire_at") as Date) < new Date()) {
      await otpRecord.destroy(); // Clean up expired OTP
      throw createHttpError.BadRequest(
        "OTP has expired. Please request a new one"
      );
    }

    // Check attempt limit (max 3 attempts)
    const attempts = (otpRecord.get("attempts") as number) || 0;
    if (attempts >= 3) {
      await otpRecord.destroy(); // Destroy OTP after max attempts
      throw createHttpError.BadRequest(
        "Maximum verification attempts exceeded. Please request a new OTP"
      );
    }

    // Verify the code
    if ((otpRecord.get("code") as number) !== code) {
      // Increment attempt counter
      await otpRecord.update({ attempts: attempts + 1 });
      const remainingAttempts = 3 - (attempts + 1);
      throw createHttpError.BadRequest(
        `Invalid OTP. ${remainingAttempts} attempts remaining`
      );
    }

    // OTP verified successfully - destroy it
    await otpRecord.destroy();

    const { accessToken, refreshToken } = generateTokenPair({
      userId: user.get("id") as number,
      mobile: user.get("mobile") as string,
    });

    return res.status(200).json({
      message: "OTP verified successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
}

async function verifyRefreshTokenHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { refreshToken }: { refreshToken: string } = req.body;

    const decoded = verifyRefreshToken(refreshToken);
    if (decoded.userId) {
      const user = await User.findOne({
        where: { id: decoded.userId, mobile: decoded.mobile },
      });
      if (!user) {
        throw createHttpError.Unauthorized("login to your account");
      }
      const blackListRefreshToken = await RefreshToken.findOne({
        where: { token: refreshToken, user_id: user.get("id") as number },
      });
      if (blackListRefreshToken) {
        throw createHttpError.Unauthorized("token expired");
      }

      await RefreshToken.create({
        token: refreshToken,
        user_id: user.get("id") as number,
      });

      const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(
        {
          userId: user.get("id") as number,
          mobile: user.get("mobile") as string,
        },
        "7d",
        "30d"
      );

      return res.status(200).json({
        message: "Refresh token verified successfully",
        accessToken,
        refreshToken: newRefreshToken,
      });
    }
    throw createHttpError.Unauthorized("login to your account");
  } catch (error) {
    next(error);
  }
}

async function getMeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    return res.status(200).json({
      message: "User fetched successfully",
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
}
export {
  sendOtpHandler,
  verifyOtpHandler,
  verifyRefreshTokenHandler,
  getMeHandler,
};
