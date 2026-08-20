import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { Order, OrderStatus } from "@/types/order";

export async function getAllOrders(): Promise<ApiResponse<Order[]>> {
  const response = await api.get<ApiResponse<Order[]>>("/api/orders/all");
  return response.data;
}

export async function getOrder(id: string): Promise<ApiResponse<Order>> {
  const response = await api.get<ApiResponse<Order>>(`/api/orders/${id}`);
  return response.data;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<ApiResponse<Order>> {
  const response = await api.put<ApiResponse<Order>>(`/api/orders/${id}`, { status });
  return response.data;
}