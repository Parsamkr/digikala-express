import { Router } from "express";
import {
  getMyOrdersHandler,
  getOrderByIdHandler,
  changeOrderStatusHandler,
} from "./order.service";
import authGuard from "../auth/auth.guard";
import { validateData } from "../../middleware/validation.middleware";
import { changeOrderStatusSchema } from "./order.validation";

const router = Router();
router.get("/", authGuard, getMyOrdersHandler);
router.get("/:id", authGuard, getOrderByIdHandler);
router.patch(
  "/:id/change-status",
  authGuard,
  validateData(changeOrderStatusSchema),
  changeOrderStatusHandler
);

export { router as orderRouter };
