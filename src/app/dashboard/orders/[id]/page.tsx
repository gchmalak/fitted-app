"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RequireAdmin from "@/components/RequireAdmin";
import { getOrder, updateOrderStatus } from "@/services/order.service";
import { OrderStatus, OrderUser } from "@/types/order";
import BreadCrumbs from "@/components/BreadCrumbs";
// status_______________________________________________________________________________________________
const STATUSES: OrderStatus[] = [
  "pending",
  "shipped",
  "delivered",
  "cancelled",
];
// status styles___________________________________________________________________________________________
const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  shipped: "bg-blue-100 text-blue-800 border-blue-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};
// ADMIN ORDER DETAIL FUNCTION___________________________________________________________________________
function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  // use Query____________________________________________________________________________________________
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrder(id!),
    enabled: !!id,
  });
  // useMutation______________________________________________________________________________________________
  const statusMutation = useMutation({
    mutationFn: (status: OrderStatus) => updateOrderStatus(id!, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
  // loading message
  if (isLoading) return <p className="p-10 text-gray">Loading order...</p>;
  // error message
  if (isError || !data?.data)
    return <p className="p-10 text-gray">Order not found.</p>;

  const order = data.data;
  const user = order.userId as OrderUser;

  return (
    <div className="p-6 md:p-10">
      {/* bread crumbs */}
      <BreadCrumbs
        items={[
          {
            label: "Orders",
            href: "/dashboard/orders",
          },
          {
            label: "Order Details",
            href: "/dashboard/orders/details",
          },
        ]}
      />
      <div className="mb-6 flex items-center justify-between">
        {/* heading */}
        <h1 className="font-serif text-3xl text-black">Order Details</h1>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          {/* order drop down */}
          <span className="text-sm text-gray">Status:</span>
          <select
            value={order.status}
            onChange={(e) =>
              statusMutation.mutate(e.target.value as OrderStatus)
            }
            disabled={statusMutation.isPending}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize outline-none cursor-pointer ${
              STATUS_STYLES[order.status]
            }`}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-beige bg-white p-6">
        <p className="text-sm text-gray">Order ID</p>
        <p className="mb-4 font-mono text-sm text-black">#{order.orderId}</p>

        <p className="text-sm text-gray">Customer Account</p>
        <p className="mb-4 text-black">
          {user?.username ?? "Unknown"} ({user?.email ?? "No email"})
        </p>

        <p className="text-sm text-gray">Recipient Name</p>
        <p className="mb-4 text-black">{order.fullName}</p>

        <p className="text-sm text-gray">Phone Number</p>
        <p className="mb-4 text-black">{order.phone}</p>

        <p className="text-sm text-gray">Shipping Address</p>
        <p className="mb-4 text-black">
          {order.street}, {order.city}, {order.wilaya}
          {order.postalCode ? ` (${order.postalCode})` : ""}
        </p>

        {order.deliveryNotes && (
          <>
            <p className="text-sm text-gray">Delivery Notes</p>
            <p className="mb-4 italic text-black">{order.deliveryNotes}</p>
          </>
        )}

        <p className="mb-2 text-sm font-medium text-black">Items</p>
        <div className="flex flex-col gap-2">
          {order.items.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between rounded-md bg-cream px-3 py-2 text-sm"
            >
              <span className="text-black">Qty: {item.quantity}</span>
              <span className="text-gray">{item.priceAtPurchase} DA each</span>
              <span className="font-medium text-black">
                {item.priceAtPurchase * item.quantity} DA
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end border-t border-beige pt-4">
          <p className="font-serif text-xl text-gold-dark">
            Total: {order.totalPrice} DA
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrderDetailPage() {
  return <AdminOrderDetail />;
}
