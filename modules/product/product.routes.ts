import { Router } from "express";
import {
  createProductHandler,
  getProductsHandler,
  getProductByIdHandler,
  deleteProductByIdHandler,
} from "./product.service";
import { validateData } from "../../middleware/validation.middleware";
import { createProductSchema } from "./product.validation";

const router = Router();
router.post("/", validateData(createProductSchema), createProductHandler);
router.get("/", getProductsHandler);
router.get("/:id", getProductByIdHandler);
router.delete("/:id", deleteProductByIdHandler);

export { router as productRouter };
