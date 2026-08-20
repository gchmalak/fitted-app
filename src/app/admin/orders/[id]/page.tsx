"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getOrder } from "@/services/order.service";
import { OrderUser } from "@/types/order";

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrder(id),
  });

  if (isLoading) return <p className="p-10 text-gray">Loading order...</p>;
  if (isError || !data?.data)
    return <p className="p-10 text-gray">Order not found.</p>;

  const order = data.data;
  const user = order.userId as OrderUser;

  return (
    <div className="p-6 md:p-10">
      <h1 className="mb-6 font-serif text-3xl text-black">Order Details</h1>

      <div className="rounded-xl border border-beige bg-white p-6">
        <p className="text-sm text-gray">Order ID</p>
        <p className="mb-4 font-mono text-sm text-black">{order._id}</p>

        <p className="text-sm text-gray">Customer</p>
        <p className="mb-4 text-black">
          {user?.username ?? "Unknown"} ({user?.email})
        </p>

        <p className="text-sm text-gray">Shipping Address</p>
        <p className="mb-4 text-black">{order.address}</p>

        <p className="text-sm text-gray">Status</p>
        <p className="mb-4 capitalize text-black">{order.status}</p>

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
