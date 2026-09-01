import { api } from "@/lib/axios";
import { Product } from "@/types/product";

export interface WishlistResponse {
  success: boolean;
  message: string;
  data: Product[];
}

// Get the logged-in user's wishlist
export async function getWishlist(): Promise<WishlistResponse> {
  const response = await api.get<WishlistResponse>("/wishlist");

  return response.data;
}

// Add a product to the wishlist
export async function addToWishlist(
  productId: string,
): Promise<WishlistResponse> {
  const response = await api.post<WishlistResponse>(
    `/wishlist/${productId}`,
  );

  return response.data;
}

// Remove a product from the wishlist
export async function removeFromWishlist(
  productId: string,
): Promise<WishlistResponse> {
  const response = await api.delete<WishlistResponse>(
    `/wishlist/${productId}`,
  );

  return response.data;
}