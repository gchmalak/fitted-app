"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllOrders, updateOrderStatus } from "@/services/order.service";
import { Order, OrderStatus, OrderUser } from "@/types/order";

const STATUSES: OrderStatus[] = [
  "pending",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["orders", "all"],
    queryFn: getAllOrders,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });

  const orders = data?.data ?? [];
  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  if (isLoading) return <p className="p-10 text-gray">Loading orders...</p>;

  return (
    <div className="p-6 md:p-10">
      <h1 className="mb-6 font-serif text-3xl text-black">Orders</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`rounded-full px-4 py-1.5 text-sm ${statusFilter === "all" ? "bg-gold text-white" : "bg-beige text-gray hover:bg-gold/20"}`}
        >
          All
        </button>
        {STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-full px-4 py-1.5 text-sm capitalize ${statusFilter === status ? "bg-gold text-white" : "bg-beige text-gray hover:bg-gold/20"}`}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <p className="rounded-xl border border-beige bg-white py-16 text-center text-gray">
          No orders{" "}
          {statusFilter !== "all" ? `with status "${statusFilter}"` : "yet"}.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredOrders.map((order) => {
            const user = order.userId as OrderUser;
            return (
              <div
                key={order._id}
                className="rounded-xl border border-beige bg-white p-4"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-medium text-black">
                      {user?.username ?? "Unknown user"}{" "}
                      <span className="font-normal text-gray">
                        ({user?.email})
                      </span>
                    </p>
                    <p className="mt-0.5 text-sm text-gray">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""} · {order.address}
                    </p>
                    <p className="mt-0.5 text-xs text-gray">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="font-serif text-lg text-gold-dark">
                      {order.totalPrice} DA
                    </p>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        statusMutation.mutate({
                          id: order._id,
                          status: e.target.value as OrderStatus,
                        })
                      }
                      disabled={statusMutation.isPending}
                      className={`rounded-full border-0 px-3 py-1.5 text-xs font-medium capitalize outline-none ${STATUS_STYLES[order.status]}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <Link
                      href={`/admin/orders/${order._id}`}
                      className="text-xs text-gold-dark hover:text-gold"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
