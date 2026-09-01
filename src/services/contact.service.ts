

import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";

export type ContactChatMessageSender = "customer" | "admin";

export interface ContactChatMessage {
  _id: string;
  sender: ContactChatMessageSender;
  message: string;
  createdAt: string;
}

export interface ContactMessageRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  isRead: boolean;
  messages: ContactChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// Customer creates a new conversation
export async function sendContactMessage(
  data: ContactMessageRequest,
): Promise<ApiResponse<ContactMessage>> {
  const response = await api.post<ApiResponse<ContactMessage>>(
    "/contact",
    data,
  );

  return response.data;
}

// Admin/Owner gets all conversations
export async function getAllContactMessages(): Promise<
  ApiResponse<ContactMessage[]>
> {
  const response = await api.get<ApiResponse<ContactMessage[]>>("/contact");

  return response.data;
}

// Customer gets their own conversations
export async function getMyContactMessages(): Promise<
  ApiResponse<ContactMessage[]>
> {
  const response = await api.get<ApiResponse<ContactMessage[]>>(
    "/contact/my",
  );

  return response.data;
}

// Admin/Owner marks a conversation as read
export async function markContactMessageRead(
  id: string,
): Promise<ApiResponse<ContactMessage>> {
  const response = await api.put<ApiResponse<ContactMessage>>(
    `/contact/${id}/read`,
  );

  return response.data;
}

// Admin/Owner replies to a customer
export async function replyToMessage(
  id: string,
  reply: string,
): Promise<ApiResponse<ContactMessage>> {
  const response = await api.post<ApiResponse<ContactMessage>>(
    `/contact/${id}/reply`,
    {
      reply,
    },
  );

  return response.data;
}

// Customer replies to an existing conversation
export async function customerReplyToMessage(
  id: string,
  reply: string,
): Promise<ApiResponse<ContactMessage>> {
  const response = await api.post<ApiResponse<ContactMessage>>(
    `/contact/${id}/customer-reply`,
    {
      reply,
    },
  );

  return response.data;
}

