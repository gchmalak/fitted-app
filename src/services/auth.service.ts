import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { LoginRequest, RegisterRequest } from "@/types/auth";
import { User } from "@/types/user";

export async function login(credentials:LoginRequest):Promise<ApiResponse<User>>{
    const response = await api.post<ApiResponse<User>>("/api/auth/login",credentials)
    return response.data
}


export async function register(credentials:RegisterRequest):Promise<ApiResponse<User>>{
    const response = await api.post<ApiResponse<User>>("/api/auth/register",credentials)
    return response.data
}

// to know who is logged in:fom checkuser function
export async function getCurrentUser(): Promise<ApiResponse<User>> {
  const response = await api.get<ApiResponse<User>>("/api/auth");
  return response.data;
}