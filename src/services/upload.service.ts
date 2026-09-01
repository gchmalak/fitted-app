import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";

// an upload service to send umages files via multipart/form-data this is so admins can add and modify tbe pictures in the hero section
export interface UploadResponse {
    url:string;
    public_id:string;
}
export async function uploadImage(file:File):Promise<ApiResponse<UploadResponse>>{
    const formData = new FormData()
    formData.append("image", file)

    const response = await api.post<ApiResponse<UploadResponse>>("/upload", formData)
     return response.data     
    }

