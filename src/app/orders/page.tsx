"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Search, Calendar, X, ChevronRight } from "lucide-react";
import { getMyOrders } from "@/services/order.service";
import { OrderStatus } from "@/types/order";
import { useRouter } from "next/navigation";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-beige text-gray",
  shipped: "bg-gold-light text-gold-dark",
  delivered: "bg-gold text-white",
  cancelled: "bg-white border border-gray text-gray",
};

export default function OrdersPage() {
  const router = useRouter();

  const [searchDate, setSearchDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", "me"],
    queryFn: getMyOrders,
  });

  if (isLoading)
    return <p className="p-16 text-center text-gray">Loading your orders...</p>;

  if (isError)
    return <p className="p-16 text-center text-gray">Failed to load orders.</p>;

  const orders = data?.data ?? [];

  if (orders.length === 0) {
    return (
      <section className="min-h-[60vh] bg-cream px-6 py-16 md:px-16">
        <div className="mx-auto max-w-4xl">
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
            <p className="font-serif text-2xl text-black">
              You haven't placed any orders yet.
            </p>

            <Link
              href="/products"
              className="text-sm uppercase tracking-wide text-gold-dark transition-colors hover:text-gold"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Filter orders by local date or order ID
  const filteredOrders = orders.filter((order) => {
    const localCreatedDate = new Date(order.createdAt).toLocaleDateString(
      "en-CA",
    );

    const matchesDate = !searchDate || localCreatedDate === searchDate;

    const query = searchTerm.toLowerCase().trim();

    const matchesTerm =
      !query ||
      order.orderId?.toLowerCase().includes(query) ||
      order._id?.toLowerCase().includes(query);

    return matchesDate && matchesTerm;
  });

  return (
    <section className="bg-cream px-6 py-16 md:px-16">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}

        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray">
          <button
            onClick={() => router.back()}
            className="text-sm text-gold-dark transition-colors hover:text-gold"
          >
            Back
          </button>

          <span>/</span>

          <span className="text-gray">My orders</span>
        </nav>

        <h1 className="mb-8 font-serif text-4xl text-black">My Orders</h1>

        {/* Controls Bar: Search & Date Filter */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Order ID Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray" />

            <input
              type="text"
              placeholder="Search by Order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-beige bg-white py-2 pl-9 pr-4 text-sm text-black placeholder:text-gray focus:border-gold-dark focus:outline-none"
            />
          </div>

          {/* Date Picker Filter */}
          <div className="relative flex items-center gap-2">
            <div className="relative w-full sm:w-auto">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray" />

              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full cursor-pointer rounded-md border border-beige bg-white py-2 pl-9 pr-4 text-sm text-black focus:border-gold-dark focus:outline-none"
              />
            </div>

            {/* Clear Filters Button */}
            {(searchDate || searchTerm) && (
              <button
                onClick={() => {
                  setSearchDate("");
                  setSearchTerm("");
                }}
                className="flex items-center gap-1 text-xs text-gray hover:text-black"
                title="Clear filters"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Orders List */}
        <div className="flex flex-col gap-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <Link
                key={order._id}
                href={`/orders/${order._id}`}
                className="group flex flex-col gap-3 rounded-lg border border-beige bg-white p-6 transition-all hover:border-gold"
              >
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray">
                    Order #{order.orderId || order._id}
                  </p>

                  <p className="mt-1 text-sm text-gray">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>

                  <p className="mt-1 text-sm text-gray">
                    {order.items?.length ?? 0} item
                    {order.items?.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      STATUS_STYLES[order.status as OrderStatus]
                    }`}
                  >
                    {order.status}
                  </span>

                  <p className="font-medium text-black">
                    {order.totalPrice} DA
                  </p>

                  <ChevronRight className="h-5 w-5 text-gray transition-transform group-hover:translate-x-1 group-hover:text-black" />
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-lg border border-beige bg-white p-12 text-center">
              <p className="text-gray">No orders match your search query.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
