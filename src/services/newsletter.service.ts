import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";

export interface NewsletterSubscriber {
  _id: string;
  email: string;
  createdAt: string;
}
export interface BroadcastResult {
  sent: number;
  failed: number;
  total: number;
}

export async function subscribeToNewsletter(email: string): Promise<ApiResponse<NewsletterSubscriber>> {
  const response = await api.post<ApiResponse<NewsletterSubscriber>>("/newsletter/subscribe", { email });
  return response.data;
}

export async function sendBroadcast(subject: string, message: string): Promise<ApiResponse<BroadcastResult>> {
  const response = await api.post<ApiResponse<BroadcastResult>>("/newsletter/broadcast", {
    subject,
    message,
  });
  return response.data;
}
export async function getAllSubscribers(): Promise<ApiResponse<NewsletterSubscriber[]>> {
  const response = await api.get<ApiResponse<NewsletterSubscriber[]>>("/newsletter");
  return response.data;
}