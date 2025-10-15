import { z } from "zod";
import { commonSchemas } from "../../utils/validation.utils";
const sendOtpSchema = z.object({
  mobile: commonSchemas.phone,
});

const verifyOtpSchema = z.object({
  code: z.number().int().min(100000).max(999999), // 6-digit OTP
  mobile: commonSchemas.phone,
});

const verifyRefreshTokenSchema = z.object({
  refreshToken: z
    .string("please login to your account")
    .min(1, "please login to your account"),
});

export { sendOtpSchema, verifyOtpSchema, verifyRefreshTokenSchema };
