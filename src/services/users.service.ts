import { api } from "@/lib/axios";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { User } from "@/types/user";

export async function getAllUsers(params?: { page?: number; limit?: number, role?:"admin" |"user",search?:string }): Promise<PaginatedResponse<User[]>> {
  const response = await api.get<PaginatedResponse<User[]>>("/api/users", { params });
  return response.data;
}

export async function updateUserRole(id: string, role: "admin" | "user"): Promise<ApiResponse<User>> {
  const response = await api.put<ApiResponse<User>>(`/api/users/${id}/role`, { role });
  return response.data;
}

export async function deactivateUser(id: string): Promise<ApiResponse<User>> {
  const response = await api.put<ApiResponse<User>>(`/api/users/${id}/deactivate`);
  return response.data;
}

export async function reactivateUser(id: string): Promise<ApiResponse<User>> {
  const response = await api.put<ApiResponse<User>>(`/api/users/${id}/reactivate`);
  return response.data;
}