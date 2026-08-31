"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { OrderStatus } from "@/types/order";
import { getOrder } from "@/services/order.service";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useRouter } from "next/navigation";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-beige text-gray",
  shipped: "bg-gold-light text-gold-dark",
  delivered: "bg-gold text-white",
  cancelled: "bg-white border border-gray text-gray",
};

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrder(id),
  });

  const router = useRouter();
  if (isLoading)
    return (
      <p className="p-16 text-center text-gray">Loading order details...</p>
    );
  if (isError || !data?.data)
    return <p className="p-16 text-center text-gray">Order not found.</p>;

  const order = data.data;

  return (
    <section className="bg-cream px-6 py-16 md:px-16">
      <div className="mx-auto max-w-4xl">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray">
          <button
            onClick={() => router.back()}
            className="text-sm text-gold-dark transition-colors hover:text-gold"
          >
            Back
          </button>

          <span>/</span>

          <span className="text-gray">Order</span>
        </nav>

        <div className="rounded-lg border border-beige bg-white p-6 md:p-8">
          <div className="flex items-center justify-between border-b border-beige pb-6">
            <div>
              <h1 className="font-serif text-3xl text-black">
                Order #{order.orderId || order._id}
              </h1>
              <p className="mt-1 text-sm text-gray">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                STATUS_STYLES[order.status as OrderStatus]
              }`}
            >
              {order.status}
            </span>
          </div>

          {/* Items breakdown */}
          <div className="mt-6 flex flex-col gap-4">
            <h2 className="font-serif text-lg text-black">Items</h2>
            {order.items?.map((item: any, idx: number) => (
              <div
                key={idx}
                className="flex justify-between border-b border-beige/50 pb-3 text-sm text-black"
              >
                <div>
                  <p className="font-medium">{item.name || `Product Item`}</p>
                  <p className="text-xs text-gray">Qty: {item.quantity || 1}</p>
                </div>
                <span>{item.price} DA</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between pt-4 font-serif text-xl font-medium text-black">
            <span>Total</span>
            <span>{order.totalPrice} DA</span>
          </div>
        </div>
      </div>
    </section>
  );
}
