export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  _id: string;
  product: string; // populated only if you .populate("items.product") —so this stays a plain ID
  variantId: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface OrderUser {
  _id: string;
  username: string;
  email: string;
}

export interface Order {
  _id: string;
  userId: string | OrderUser; // string for getMyOrders/getOrder, populated object for getAllOrders (admin)
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  address: string;
  createdAt: string;
  updatedAt: string;
}