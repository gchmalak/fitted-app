import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";

export interface CarouselSlide {
  _id: string;
  imageUrl: string;
  ctaLink: string;
  ctaText: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
}

export type CreateSlideInput = Omit<CarouselSlide, "_id" | "createdAt">;

export async function getAllSlides(): Promise<ApiResponse<CarouselSlide[]>> {
  const response = await api.get<ApiResponse<CarouselSlide[]>>("/api/carousel");
  return response.data;
}

export async function createSlide(data: CreateSlideInput): Promise<ApiResponse<CarouselSlide>> {
  const response = await api.post<ApiResponse<CarouselSlide>>("/api/carousel", data);
  return response.data;
}

export async function updateSlide(id: string, data: Partial<CreateSlideInput>): Promise<ApiResponse<CarouselSlide>> {
  const response = await api.put<ApiResponse<CarouselSlide>>(`/api/carousel/${id}`, data);
  return response.data;
}

export async function deleteSlide(id: string): Promise<ApiResponse<void>> {
  const response = await api.delete<ApiResponse<void>>(`/api/carousel/${id}`);
  return response.data;
}