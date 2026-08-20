export interface ApiResponse<T>{
    success:boolean;
    message:string;
    data:T;
    token?:string
}
export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T;
  totalCount: number;
  totalPages: number;
  currentPage: number;
}