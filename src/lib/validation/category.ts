import { z } from "zod";

export const subcategorySchema = z.object({
  name: z.string().min(2, "Subcategory name must be at least 2 characters"),
});

export const createCategoryFormSchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),

  department: z.enum(
    [
      "Clothing",
      "Accessories",
      "Makeup",
      "Skincare",
      "Perfume",
    ],
    "Please select a department",
  ),
});