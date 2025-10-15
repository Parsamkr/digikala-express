import jwt from "jsonwebtoken";
import "dotenv/config";

interface TokenPayload {
  userId: number;
  mobile: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Generate a pair of access and refresh tokens
 * @param payload - The payload to include in the tokens
 * @param accessTokenExpiry - Access token expiry time (default: "7d")
 * @param refreshTokenExpiry - Refresh token expiry time (default: "30d")
 * @returns Object containing accessToken and refreshToken
 */
export function generateTokenPair(
  payload: TokenPayload,
  accessTokenExpiry: string = "7d",
  refreshTokenExpiry: string = "30d"
): TokenPair {
  const accessTokenSecret = process.env.ACCESS_JWT_SECRET_KEY;
  const refreshTokenSecret = process.env.REFRESH_JWT_SECRET_KEY;

  if (!accessTokenSecret || !refreshTokenSecret) {
    throw new Error("JWT secret keys are not configured");
  }

  const accessToken = jwt.sign(payload, accessTokenSecret, {
    expiresIn: accessTokenExpiry,
  } as jwt.SignOptions);

  const refreshToken = jwt.sign(payload, refreshTokenSecret, {
    expiresIn: refreshTokenExpiry,
  } as jwt.SignOptions);

  return {
    accessToken,
    refreshToken,
  };
}

/**
 * Generate only an access token
 * @param payload - The payload to include in the token
 * @param expiry - Token expiry time (default: "7d")
 * @returns Access token string
 */
export function generateAccessToken(
  payload: TokenPayload,
  expiry: string = "7d"
): string {
  const accessTokenSecret = process.env.ACCESS_JWT_SECRET_KEY;

  if (!accessTokenSecret) {
    throw new Error("Access JWT secret key is not configured");
  }

  return jwt.sign(payload, accessTokenSecret, {
    expiresIn: expiry,
  } as jwt.SignOptions);
}

/**
 * Generate only a refresh token
 * @param payload - The payload to include in the token
 * @param expiry - Token expiry time (default: "30d")
 * @returns Refresh token string
 */
export function generateRefreshToken(
  payload: TokenPayload,
  expiry: string = "30d"
): string {
  const refreshTokenSecret = process.env.REFRESH_JWT_SECRET_KEY;

  if (!refreshTokenSecret) {
    throw new Error("Refresh JWT secret key is not configured");
  }

  return jwt.sign(payload, refreshTokenSecret, {
    expiresIn: expiry,
  } as jwt.SignOptions);
}

/**
 * Verify an access token
 * @param token - The access token to verify
 * @returns Decoded token payload
 */
export function verifyAccessToken(token: string): TokenPayload {
  const accessTokenSecret = process.env.ACCESS_JWT_SECRET_KEY;

  if (!accessTokenSecret) {
    throw new Error("Access JWT secret key is not configured");
  }

  return jwt.verify(token, accessTokenSecret) as TokenPayload;
}

/**
 * Verify a refresh token
 * @returns Decoded token payload
 * @throws Error if token is invalid or expired
 */
export function verifyRefreshToken(token: string): TokenPayload {
  const refreshTokenSecret = process.env.REFRESH_JWT_SECRET_KEY;
  if (!refreshTokenSecret) {
    throw new Error("Refresh JWT secret key is not configured");
  }
  return jwt.verify(token, refreshTokenSecret) as TokenPayload;
}
