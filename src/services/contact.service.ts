import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";

export interface ContactMessageRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  reply?:string;
}

export interface ContactMessage extends ContactMessageRequest {
  _id: string;
  isRead: boolean;
  createdAt: string;
}

export async function sendContactMessage(data: ContactMessageRequest): Promise<ApiResponse<ContactMessage>> {
  const response = await api.post<ApiResponse<ContactMessage>>("/contact", data);
  return response.data;
}

export async function getAllContactMessages(): Promise<ApiResponse<ContactMessage[]>> {
  const response = await api.get<ApiResponse<ContactMessage[]>>("/contact");
  return response.data;
}

export async function markContactMessageRead(id: string): Promise<ApiResponse<ContactMessage>> {
  const response = await api.put<ApiResponse<ContactMessage>>(`/contact/${id}/read`);
  return response.data;
}
export async function replyToMessage(id: string, reply: string): Promise<ApiResponse<ContactMessage>> {
  const response = await api.post<ApiResponse<ContactMessage>>(`/contact/${id}/reply`, { reply });
  return response.data;
}