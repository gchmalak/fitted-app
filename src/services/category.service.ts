import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types/category";

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  const response = await api.get<ApiResponse<Category[]>>("/categories");
  return response.data;
}

export async function createCategory(
  data: CreateCategoryRequest,
): Promise<ApiResponse<Category>> {
  const response = await api.post<ApiResponse<Category>>(
    "/categories",
    data,
  );
  return response.data;
}

export async function updateCategory(
  id: string,
  data: UpdateCategoryRequest,
): Promise<ApiResponse<Category>> {
  const response = await api.put<ApiResponse<Category>>(
    `/categories/${id}`,
    data,
  );
  return response.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/categories/${id}`);
}

// Adds one subcategory to an existing category by sending the full
// updated subcategories array (since the backend doesn't have a
// dedicated "add one subcategory" endpoint — it's a generic update).
export async function addSubcategory(
  category: Category,
  subcategoryName: string,
): Promise<ApiResponse<Category>> {
  const updatedSubcategories = [
    ...category.subcategories.map((s) => ({ name: s.name })),
    { name: subcategoryName },
  ];
  return updateCategory(category._id, { subcategories: updatedSubcategories });
}