import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../../utils/token.utils";
import { User } from "../user/user.model";
import createHttpError from "http-errors";

async function authGuard(req: Request, res: Response, next: NextFunction) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw createHttpError.Unauthorized("login to your account");
    }
    const [bearer, token] = authorization.split(" ");
    if (!bearer || bearer.toLowerCase() !== "bearer") {
      throw createHttpError.Unauthorized("login to your account");
    }
    if (!token) {
      throw createHttpError.Unauthorized("login to your account");
    }

    const decoded = verifyAccessToken(token);
    if (decoded.userId) {
      const user = await User.findOne({
        where: { id: decoded.userId, mobile: decoded.mobile },
      });
      if (!user) {
        throw createHttpError.Unauthorized("login to your account");
      }
      req.user = {
        id: user.get("id") as number,
        mobile: user.get("mobile") as string,
        fullname: user.get("fullname") as string,
      };
      return next();
    }
    throw createHttpError.Unauthorized("login to your account");
  } catch (error) {
    next(error);
  }
}

export default authGuard;
