"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Search } from "lucide-react";
import { getAllOrders, updateOrderStatus } from "@/services/order.service";
import { OrderStatus } from "@/types/order";
import BreadCrumbs from "@/components/BreadCrumbs";

// order status
const STATUSES: OrderStatus[] = [
  "pending",
  "shipped",
  "delivered",
  "cancelled",
];

// status style(red,blue,green,yellow)
const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  shipped: "bg-blue-100 text-blue-800 border-blue-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

type SearchType = "orderId" | "productName";

// ADMIN ORDER LIST FUNCTION____________________________________________________________________________
function AdminOrdersList() {
  //states:_____________________________________________________________________________________________
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("orderId");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [page, setPage] = useState(1);

  // useQueryClient_____________________________________________________________________________________
  const queryClient = useQueryClient();

  // useQuery_____________________________________________________________________________________________
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", "all", searchTerm, searchType, page],
    queryFn: () =>
      getAllOrders({
        page,
        limit: 20,
        ...(searchType === "orderId"
          ? { search: searchTerm || undefined }
          : { productName: searchTerm || undefined }),
      }),
  });

  // useMutation__________________________________________________________________________________________
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  // loading message
  if (isLoading) return <p className="p-10 text-gray">Loading orders...</p>;

  // error message
  if (isError || !data?.data)
    return <p className="p-10 text-gray">Failed to load orders.</p>;

  const allOrders = data.data;

  // Filter orders by status filter
  const filteredOrders = allOrders.filter((order) => {
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;

    return matchesStatus;
  });

  function handleSearchChange(value: string) {
    setSearchTerm(value);
    setPage(1);
  }

  function handleSearchTypeChange(type: SearchType) {
    setSearchType(type);
    setSearchTerm("");
    setPage(1);
  }

  return (
    <div className="p-6 md:p-10">
      {/* Bread crumbs */}
      <BreadCrumbs
        items={[
          {
            label: "Orders",
          },
        ]}
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-3xl text-black">Orders</h1>

        {/* Search Bar */}
        <div className="flex w-full max-w-lg">
          {/* Search Type */}
          <select
            value={searchType}
            onChange={(e) =>
              handleSearchTypeChange(e.target.value as SearchType)
            }
            className="rounded-l-md border border-r-0 border-beige bg-cream px-3 py-2 text-xs text-gray outline-none focus:border-gold-dark"
          >
            <option value="orderId">Order ID</option>
            <option value="productName">Product Name</option>
          </select>

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray" />

            <input
              type="text"
              placeholder={
                searchType === "orderId"
                  ? "Search by Order ID..."
                  : "Search by product name..."
              }
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-r-md border border-beige bg-white py-2 pl-9 pr-4 text-sm text-black placeholder:text-gray focus:border-gold-dark focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Status Filter Buttons */}
      {/* all orders button */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedStatus("all")}
          className={`rounded-full border px-4 py-1.5 text-xs font-medium capitalize transition ${
            selectedStatus === "all"
              ? "bg-black text-white border-black"
              : "bg-white text-gray border-beige hover:border-gold-dark"
          }`}
        >
          All
        </button>

        {STATUSES.map((status) => (
          //orders per status
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium capitalize transition ${
              selectedStatus === status
                ? STATUS_STYLES[status]
                : "bg-white text-gray border-beige hover:border-gold-dark"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-lg border border-beige bg-white">
        <table className="w-full text-left text-sm text-black">
          <thead className="border-b border-beige bg-cream text-xs uppercase text-gray">
            <tr>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-beige last:border-0 hover:bg-cream/50"
                >
                  <td className="px-6 py-4 font-medium">#{order.orderId}</td>

                  <td className="px-6 py-4">{order.fullName}</td>

                  <td className="px-6 py-4">{order.totalPrice} DA</td>

                  <td className="px-6 py-4">
                    {/* Inline Status Dropdown */}
                    <select
                      value={order.status}
                      onChange={(e) =>
                        statusMutation.mutate({
                          id: order._id,
                          status: e.target.value as OrderStatus,
                        })
                      }
                      disabled={statusMutation.isPending}
                      className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium capitalize outline-none ${
                        STATUS_STYLES[order.status]
                      }`}
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-6 py-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    {/* view details link */}
                    <Link
                      href={`/dashboard/orders/${order._id}`}
                      className="text-gold-dark hover:underline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                {/* no orders found */}
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-sm text-gray"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      {data.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-md border border-beige px-4 py-2 text-xs text-gray transition hover:border-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-xs text-gray">
            Page {data.currentPage} of {data.totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
            className="rounded-md border border-beige px-4 py-2 text-xs text-gray transition hover:border-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return <AdminOrdersList />;
}
