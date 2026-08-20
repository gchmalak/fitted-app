import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";

export interface DashboardStats {
  totalProducts: number;
  orders: {
    pending: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    thisWeek: number;
  };
  totalRevenue: number;
}
export async function getDashboardStats():Promise<ApiResponse<DashboardStats>>{
    const response = await api.get<ApiResponse<DashboardStats>>("/api/dashboard/stats")
    return response.data
}