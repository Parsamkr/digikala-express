import { z } from "zod";

const addToBasketSchema = z.object({
  product_id: z.number().min(1, "Product ID is required"),
  size_id: z.number().optional().nullable(),
  color_id: z.number().optional().nullable(),
  count: z.number().min(1, "Count must be greater than 0"),
});

export { addToBasketSchema };
