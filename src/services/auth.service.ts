
import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { LoginRequest, RegisterRequest } from "@/types/auth";
import { User } from "@/types/user";

export async function login(
  credentials: LoginRequest,
): Promise<ApiResponse<User>> {
  const response = await api.post<ApiResponse<User>>(
    "/api/auth/login",
    credentials,
  );

  return response.data;
}

export async function register(
  credentials: RegisterRequest,
): Promise<ApiResponse<User>> {
  const response = await api.post<ApiResponse<User>>(
    "/api/auth/register",
    credentials,
  );

  return response.data;
}

// Upload profile picture to Cloudinary
export async function uploadProfilePicture(file: File) {
  const formData = new FormData();

  formData.append("image", file);

  const response = await api.post("/api/upload", formData);

  return response.data;
}

// Get currently logged-in user
export async function getCurrentUser(): Promise<ApiResponse<User>> {
  const response = await api.get<ApiResponse<User>>("/api/auth");

  return response.data;
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<ApiResponse<null>> {
  const response = await api.put<ApiResponse<null>>(
    "/api/auth/password",
    data,
  );

  return response.data;
}

export async function forgotPassword(
  email: string,
): Promise<ApiResponse<null>> {
  const response = await api.post<ApiResponse<null>>(
    "/api/auth/forgot-password",
    { email },
  );

  return response.data;
}

export async function resetPassword(data: {
  token: string;
  newPassword: string;
}): Promise<ApiResponse<null>> {
  const response = await api.post<ApiResponse<null>>(
    "/api/auth/reset-password",
    data,
  );

  return response.data;
}
export async function updateProfilePicture(
  avatarUrl: string,
): Promise<ApiResponse<User>> {
  const response = await api.put<ApiResponse<User>>(
    "/api/auth/profile-picture",
    { avatarUrl },
  );

  return response.data;
}


export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

