import { api } from "@/lib/axios";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { CreateProductRequest, Product, ProductDepartment, ProductQueryParams, UpdateProductRequest } from "@/types/product";
export interface FiltersResponse {
  departments: ProductDepartment[];
}

export async function getProducts(
  params?: ProductQueryParams,
): Promise<PaginatedResponse<Product[]>> {
  const queryParams = {
    ...params,
    departments: params?.departments?.join(","),
  };

  const response = await api.get<PaginatedResponse<Product[]>>(
    "/api/products",
    { params: queryParams },
  );

  return response.data;
}

export async function getLatestProducts(): Promise<PaginatedResponse<Product[]>> {
  return getProducts({ sortBy: "createdAt", sortOrder:"desc", limit: 6, page: 1 });
}

export async function getProduct(id: string): Promise<ApiResponse<Product>> {
  const response = await api.get<ApiResponse<Product>>(`/api/products/${id}`);
  return response.data;
}

export async function createProduct(data: CreateProductRequest): Promise<ApiResponse<Product>> {
  const response = await api.post<ApiResponse<Product>>("/api/products", data);
  return response.data;
}

export async function updateProduct(id: string, data: UpdateProductRequest): Promise<ApiResponse<Product>> {
  const response = await api.put<ApiResponse<Product>>(`/api/products/${id}`, data);
  return response.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/api/products/${id}`);
}
export async function getFilters(): Promise<ApiResponse<FiltersResponse>> {
  const response = await api.get<ApiResponse<FiltersResponse>>("/api/products/filters");
  return response.data;
}

// so that it fetches one department from backend then fetches it client size like care essentials:makeup+skincare
export async function getProductsByDepartments(
  departments: ProductDepartment[],
  limit: number,
): Promise<Product[]> {
  const response = await getProducts({
    departments,
    sortBy: "createdAt",
    sortOrder: "desc",
    limit,
    page: 1,
  });

  return response.data;
}
