import { Router } from "express";
import { addToBasketHandler, getUserBasketHandler } from "./basket.service";
import { validateData } from "../../middleware/validation.middleware";
import { addToBasketSchema } from "./basket.validation";
import authGuard from "../auth/auth.guard";

const router = Router();
router.post(
  "/add",
  authGuard,
  validateData(addToBasketSchema),
  addToBasketHandler
);
router.get("/", authGuard, getUserBasketHandler);

export { router as basketRouter };
