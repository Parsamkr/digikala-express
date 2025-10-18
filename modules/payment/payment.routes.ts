import { Router } from "express";
import {
  paymentBasketHandler,
  paymentCallbackHandler,
} from "./payment.service";
import authGuard from "../auth/auth.guard";

const router = Router();
router.post("/", authGuard, paymentBasketHandler);
router.get("/callback", paymentCallbackHandler);

export { router as paymentRouter };
