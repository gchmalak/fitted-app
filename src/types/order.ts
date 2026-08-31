export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

export interface OrderItemProduct {
  _id: string;
  name: string;
  images: string[];
}

export interface OrderItem {
  _id: string;
  product: OrderItemProduct; // now populated
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
  orderId:string
  userId: string | OrderUser;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  wilaya: string;
  postalCode?: string;
  deliveryNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderItem{
  productId:string;
  variantId:string;
  quantity:number
}

export interface CreateOrderRequest {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  wilaya: string;
  postalCode?: string;
  deliveryNotes?: string;
  items: CreateOrderItem[];
}