import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { Editorial, EditorialSlot, UpdateEditorialRequest } from "@/types/editorial";

export async function getEditorials(): Promise<ApiResponse<Editorial[]>> {
  const response = await api.get<ApiResponse<Editorial[]>>("/api/editorial");
  return response.data;
}

export async function updateEditorial(
  slot: EditorialSlot,
  data: UpdateEditorialRequest,
): Promise<ApiResponse<Editorial>> {
  const response = await api.put<ApiResponse<Editorial>>(`/api/editorial/${slot}`, data);
  return response.data;
}