import { z } from "zod";

export const variantSchema = z.object({
  size: z.string().optional(),
  color: z.string().optional(),
  shade: z.string().optional(),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  sku: z.string().min(1, "SKU is required"),
});

export const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  brand: z.string().min(1, "Brand is required"),
  department: z.enum(["Clothing","Bags", "Makeup", "Skincare", "Jewelry", "Perfume"]),
  categoryId: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  price: z.coerce.number().min(1000, "Price should be at least 1000 DA"),
  images: z.array(z.url()).min(1, "At least one image is required"),
  variants: z.array(variantSchema).min(1, "At least one variant is required"),
});

export type ProductInput = z.infer<typeof productSchema>;