import { getCurrentUser } from "@/services/auth.service"
import { useQuery } from "@tanstack/react-query"

export function useAuth(){
    const hasToken = typeof window !== "undefined" && !!localStorage.getItem("token")

    const {data, isLoading} = useQuery({
        queryKey:["me"],
        queryFn:getCurrentUser,
        enabled:hasToken,
        retry:false,

    })
    return{
        user:data?.data,
        isAdmin:data?.data?.role==="admin",
        isLoading:hasToken? isLoading : false,
    }
}