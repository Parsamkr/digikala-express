import { z } from "zod";

// Common validation patterns
export const commonSchemas = {
  // Pagination
  pagination: z.object({
    page: z.string().transform(Number).pipe(z.number().min(1)).default(1),
    limit: z
      .string()
      .transform(Number)
      .pipe(z.number().min(1).max(100))
      .default(10),
  }),

  // ID parameter
  idParam: z.object({
    id: z.string().transform(Number).pipe(z.number().positive()),
  }),

  // Email
  email: z.string().email("Invalid email format"),

  // Phone number (Iranian format)
  phone: z.string().regex(/^09\d{9}$/, "Invalid phone number format"),

  // Persian text
  persianText: z.string().min(1, "Text is required").max(500, "Text too long"),

  // Price (positive number)
  price: z.number().min(0, "Price must be positive"),

  // Percentage (0-100)
  percentage: z
    .number()
    .min(0)
    .max(100, "Percentage must be between 0 and 100"),

  // URL
  url: z.string().url("Invalid URL format"),

  // Date string
  dateString: z.string().datetime("Invalid date format"),
};

// Validation helper functions
export const validationHelpers = {
  // Transform string to number with validation
  stringToNumber: (min = 0, max?: number) =>
    z
      .string()
      .transform(Number)
      .pipe(
        z
          .number()
          .min(min)
          .max(max || Infinity)
      ),

  // Transform string to boolean
  stringToBoolean: () =>
    z.string().transform((val) => val.toLowerCase() === "true"),

  // Optional string that becomes empty string if undefined
  optionalString: () => z.string().optional().default(""),

  // Array with minimum length
  minArray: (min: number) =>
    z.array(z.any()).min(min, `At least ${min} items required`),

  // Enum from object values
  enumFromObject: <T extends Record<string, any>>(obj: T) =>
    z.enum(Object.values(obj) as [string, ...string[]]),
};

// Custom error formatter
export const formatZodError = (error: z.ZodError) => {
  return {
    message: "Validation failed",
    errors: error.issues.map((issue) => ({
      code: issue.code,
      values: (issue as any).params || undefined,
      path: issue.path.join("."),
      message: issue.message,
    })),
  };
};

// Async validation wrapper
export const asyncValidate = async <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<
  { success: true; data: T } | { success: false; error: z.ZodError }
> => {
  try {
    const result = await schema.parseAsync(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
};
