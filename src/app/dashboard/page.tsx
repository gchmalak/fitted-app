"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { getDashboardStats } from "@/services/dashboard.service";
import { getAllOrders } from "@/services/order.service";
import { useAuth } from "@/hooks/useAuth";
import BreadCrumbs from "@/components/BreadCrumbs";

export default function AdminDashboardPage() {
  const { isOwner } = useAuth();

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getDashboardStats,
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders", "recent"],
    queryFn: () => getAllOrders({ page: 1, limit: 5 }),
  });

  if (statsLoading) {
    return (
      <div className="p-6 md:p-10">
        <p className="text-sm text-gray">Loading dashboard...</p>
      </div>
    );
  }

  const stats = statsData?.data;

  if (!stats) {
    return (
      <div className="p-6 md:p-10">
        <p className="text-sm text-gray">
          Unable to load dashboard statistics.
        </p>
      </div>
    );
  }

  const recentOrders = ordersData?.data ?? [];

  const totalOrders =
    stats.orders.pending +
    stats.orders.shipped +
    stats.orders.delivered +
    stats.orders.cancelled;

  return (
    <div className="min-h-screen bg-[#faf9f6] p-6 md:p-10">
      {/* BREADCRUMBS */}

      <BreadCrumbs
        baseHref="/"
        baseLabel="Home"
        items={[{ label: "Dashboard" }]}
      />

      {/* HEADER */}

      <div className="mb-10 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gold-dark">
            FITD Administration
          </p>

          <h1 className="font-serif text-4xl text-black">Dashboard</h1>

          <p className="mt-2 max-w-xl text-sm text-gray">
            Here&apos;s an overview of what&apos;s happening in your store.
          </p>
        </div>

        <Link
          href="/"
          className="text-sm text-gold-dark transition hover:text-gold"
        >
          View storefront →
        </Link>
      </div>

      {/* MAIN STATISTICS */}

      <div
        className={`grid gap-4 ${
          isOwner ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {isOwner && (
          <div className="rounded-2xl border border-beige bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-gray">
              Total Revenue
            </p>

            <p className="mt-3 font-serif text-3xl text-gold-dark">
              {stats.totalRevenue.toLocaleString()} DA
            </p>

            <p className="mt-2 text-xs text-gray">
              All completed store revenue
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-beige bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-gray">
            Total Products
          </p>

          <p className="mt-3 font-serif text-3xl text-black">
            {stats.totalProducts}
          </p>

          <Link
            href="/dashboard/products"
            className="mt-2 inline-block text-xs text-gold-dark hover:text-gold"
          >
            Manage products →
          </Link>
        </div>

        <div className="rounded-2xl border border-beige bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-gray">
            Orders This Week
          </p>

          <p className="mt-3 font-serif text-3xl text-black">
            {stats.orders.thisWeek}
          </p>

          <p className="mt-2 text-xs text-gray">New orders received</p>
        </div>

        <div className="rounded-2xl border border-beige bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-gray">
            Pending Orders
          </p>

          <p className="mt-3 font-serif text-3xl text-gold-dark">
            {stats.orders.pending}
          </p>

          <Link
            href="/dashboard/orders"
            className="mt-2 inline-block text-xs text-gold-dark hover:text-gold"
          >
            Review orders →
          </Link>
        </div>
      </div>

      {/* MIDDLE SECTION */}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* ORDER OVERVIEW */}

        <div className="rounded-2xl border border-beige bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="font-serif text-2xl text-black">Order Overview</h2>

              <p className="mt-1 text-sm text-gray">
                Current order distribution
              </p>
            </div>

            <Link
              href="/dashboard/orders"
              className="text-sm text-gold-dark hover:text-gold"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-[#faf9f6] p-5">
              <div className="mb-3 h-2 w-2 rounded-full bg-yellow-400" />

              <p className="text-xs uppercase tracking-wide text-gray">
                Pending
              </p>

              <p className="mt-2 font-serif text-2xl text-black">
                {stats.orders.pending}
              </p>
            </div>

            <div className="rounded-xl bg-[#faf9f6] p-5">
              <div className="mb-3 h-2 w-2 rounded-full bg-blue-400" />

              <p className="text-xs uppercase tracking-wide text-gray">
                Shipped
              </p>

              <p className="mt-2 font-serif text-2xl text-black">
                {stats.orders.shipped}
              </p>
            </div>

            <div className="rounded-xl bg-[#faf9f6] p-5">
              <div className="mb-3 h-2 w-2 rounded-full bg-green-500" />

              <p className="text-xs uppercase tracking-wide text-gray">
                Delivered
              </p>

              <p className="mt-2 font-serif text-2xl text-black">
                {stats.orders.delivered}
              </p>
            </div>

            <div className="rounded-xl bg-[#faf9f6] p-5">
              <div className="mb-3 h-2 w-2 rounded-full bg-red-400" />

              <p className="text-xs uppercase tracking-wide text-gray">
                Cancelled
              </p>

              <p className="mt-2 font-serif text-2xl text-black">
                {stats.orders.cancelled}
              </p>
            </div>
          </div>

          {/* SIMPLE PROGRESS BAR */}

          <div className="mt-7">
            <div className="mb-2 flex justify-between text-xs text-gray">
              <span>Order activity</span>
              <span>{totalOrders} total orders</span>
            </div>

            <div className="flex h-2 overflow-hidden rounded-full bg-beige">
              {totalOrders > 0 && (
                <>
                  <div
                    className="bg-yellow-400"
                    style={{
                      width: `${(stats.orders.pending / totalOrders) * 100}%`,
                    }}
                  />

                  <div
                    className="bg-blue-400"
                    style={{
                      width: `${(stats.orders.shipped / totalOrders) * 100}%`,
                    }}
                  />

                  <div
                    className="bg-green-500"
                    style={{
                      width: `${(stats.orders.delivered / totalOrders) * 100}%`,
                    }}
                  />

                  <div
                    className="bg-red-400"
                    style={{
                      width: `${(stats.orders.cancelled / totalOrders) * 100}%`,
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}

        <div className="rounded-2xl border border-beige bg-white p-6 shadow-sm">
          <h2 className="font-serif text-2xl text-black">Quick Actions</h2>

          <p className="mt-1 text-sm text-gray">Manage your store</p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/dashboard/products"
              className="rounded-lg bg-gold px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-gold-dark"
            >
              Manage Products
            </Link>

            <Link
              href="/dashboard/orders"
              className="rounded-lg border border-beige px-4 py-3 text-center text-sm font-medium text-black transition hover:bg-beige/40"
            >
              Manage Orders
            </Link>

            <Link
              href="/dashboard/categories"
              className="rounded-lg border border-beige px-4 py-3 text-center text-sm font-medium text-black transition hover:bg-beige/40"
            >
              Manage Categories
            </Link>

            {isOwner && (
              <Link
                href="/dashboard/users"
                className="rounded-lg border border-beige px-4 py-3 text-center text-sm font-medium text-black transition hover:bg-beige/40"
              >
                Manage Users
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* STORE AT A GLANCE */}

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-beige bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-gray">
            Total Orders
          </p>

          <p className="mt-3 font-serif text-3xl text-black">{totalOrders}</p>

          <p className="mt-2 text-sm text-gray">Orders across all statuses</p>
        </div>

        <div className="rounded-2xl border border-beige bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-gray">
            Delivered Orders
          </p>

          <p className="mt-3 font-serif text-3xl text-black">
            {stats.orders.delivered}
          </p>

          <p className="mt-2 text-sm text-gray">
            Successfully completed deliveries
          </p>
        </div>

        <div className="rounded-2xl border border-beige bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-gray">
            Needs Attention
          </p>

          <p className="mt-3 font-serif text-3xl text-gold-dark">
            {stats.orders.pending}
          </p>

          <p className="mt-2 text-sm text-gray">
            Orders waiting to be processed
          </p>
        </div>
      </div>

      {/* RECENT ORDERS */}

      <div className="mt-6 rounded-2xl border border-beige bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-beige p-6">
          <div>
            <h2 className="font-serif text-2xl text-black">Recent Orders</h2>

            <p className="mt-1 text-sm text-gray">
              Your latest customer orders
            </p>
          </div>

          <Link
            href="/dashboard/orders"
            className="text-sm text-gold-dark hover:text-gold"
          >
            View all →
          </Link>
        </div>

        {ordersLoading ? (
          <div className="p-8 text-center text-sm text-gray">
            Loading orders...
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-serif text-lg text-black">No orders yet</p>

            <p className="mt-1 text-sm text-gray">
              Customer orders will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-beige">
            {recentOrders.map((order) => {
              const customerName =
                typeof order.userId === "string"
                  ? order.fullName
                  : order.userId.username;

              return (
                <div
                  key={order._id}
                  className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-black">#{order.orderId}</p>

                    <p className="mt-1 text-sm text-gray">{customerName}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 md:gap-8">
                    <p className="text-sm text-gray">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </p>

                    <p className="font-medium text-black">
                      {order.totalPrice.toLocaleString()} DA
                    </p>

                    <span
                      className={`rounded-full px-3 py-1 text-xs capitalize ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "shipped"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "delivered"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                      }`}
                    >
                      {order.status}
                    </span>

                    <p className="text-xs text-gray">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
