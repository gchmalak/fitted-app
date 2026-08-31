import { getCurrentUser } from "@/services/auth.service";
import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const { data, isLoading } = useQuery({
    queryKey: ["me", token],
    queryFn: getCurrentUser,
    enabled: !!token,
    retry: false,
  });

  const role = data?.data?.role;

  return {
    user: data?.data,
    isOwner: role === "owner",
    isAdmin: role === "admin" || role === "owner",
    isLoading: !!token && isLoading,
  };
}