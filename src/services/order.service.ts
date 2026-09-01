import { api } from "@/lib/axios";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { CreateOrderRequest, Order, OrderStatus } from "@/types/order";

export async function createOrder(data: CreateOrderRequest): Promise<ApiResponse<Order>> {
  const response = await api.post<ApiResponse<Order>>("/orders", data);
  return response.data;
}

export async function getMyOrders(): Promise<ApiResponse<Order[]>> {
  const response = await api.get<ApiResponse<Order[]>>("/orders");
  return response.data;
}



export async function getAllOrders(params?: {
  page?: number;
  limit?: number;
  search?: string;
  productName?: string;
}): Promise<PaginatedResponse<Order[]>> {
  const response = await api.get<PaginatedResponse<Order[]>>(
    "/orders/all",
    { params },
  );

  return response.data;
}

export async function getOrder(id: string): Promise<ApiResponse<Order>> {
  const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
  return response.data;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<ApiResponse<Order>> {
  const response = await api.put<ApiResponse<Order>>(`/orders/${id}`, { status });
  return response.data;
}