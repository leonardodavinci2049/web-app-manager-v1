import { z } from "zod";

/**
 * Schema for validating product details page parameters
 */
export const ProductDetailsParamsSchema = z.object({
  id: z
    .string()
    .min(1, "Product ID is required")
    .transform((val) => {
      const num = Number(val);
      if (Number.isNaN(num) || num <= 0) {
        throw new Error("Product ID must be a positive number");
      }
      return num;
    }),
});

export type ProductDetailsParams = z.infer<typeof ProductDetailsParamsSchema>;
