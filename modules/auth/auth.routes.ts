import { Router } from "express";
import {
  sendOtpHandler,
  verifyOtpHandler,
  verifyRefreshTokenHandler,
  getMeHandler,
} from "./auth.service";
import { validateData } from "../../middleware/validation.middleware";
import {
  sendOtpSchema,
  verifyOtpSchema,
  verifyRefreshTokenSchema,
} from "./auth.validation";
import authGuard from "./auth.guard";

const router = Router();
router.post("/send-otp", validateData(sendOtpSchema), sendOtpHandler);
router.post("/verify-otp", validateData(verifyOtpSchema), verifyOtpHandler);
router.post(
  "/refresh-tokens",
  validateData(verifyRefreshTokenSchema),
  verifyRefreshTokenHandler
);
router.get("/me", authGuard, getMeHandler);

export { router as authRouter };
