import { z } from "zod";
import { ProductTypes } from "../../common/constant/product.const";

const createProductSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(Object.values(ProductTypes)),
  price: z.number().optional().nullable(),
  discount: z.number().optional().nullable(),
  active_discount: z.boolean().optional().nullable(),
  count: z.number().optional().nullable(),
  details: z
    .array(
      z.object({
        key: z.string().min(1, "Detail key is required"),
        value: z.string().min(1, "Detail value is required"),
      })
    )
    .optional()
    .nullable(),
  colors: z
    .array(
      z.object({
        color_name: z.string().min(1, "Color name is required"),
        color_code: z.string().min(1, "Color code is required"),
        count: z.number().min(0, "Color count must be non-negative"),
        price: z.number().min(0, "Color price must be non-negative"),
        discount: z.number().optional().nullable(),
        active_discount: z.boolean().optional().nullable(),
      })
    )
    .optional()
    .nullable(),
  sizes: z
    .array(
      z.object({
        size: z.string().min(1, "Size is required"),
        count: z.number().min(0, "Size count must be non-negative"),
        price: z.number().min(0, "Size price must be non-negative"),
        discount: z.number().optional().nullable(),
        active_discount: z.boolean().optional().nullable(),
      })
    )
    .optional()
    .nullable(),
});

export { createProductSchema };
