"use client";

import { getDashboardStats } from "@/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

export default function AdminDashboardPage() {
  const { isOwner } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getDashboardStats,
  });
  if (isLoading) return <p className="p-10 text-gray">Loading dashboard...</p>;

  const stats = data?.data;
  if (!stats) return null;

  const cards = [
    { label: "Total Products", value: stats.totalProducts },
    ...(isOwner
      ? [{ label: "Total Revenue", value: `${stats.totalRevenue} DA` }]
      : []),
    { label: "Orders This Week", value: stats.orders.thisWeek },
    { label: "Pending Orders", value: stats.orders.pending },
    { label: "Shipped Orders", value: stats.orders.shipped },
    { label: "Delivered Orders", value: stats.orders.delivered },
    { label: "Cancelled Orders", value: stats.orders.cancelled },
  ];

  return (
    <div className="p-6 md:p-10">
      <h1 className="mb-8 font-serif text-3xl text-black">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-beige bg-white p-5"
          >
            <p className="text-xs uppercase tracking-wide text-gray ">
              {card.label}
            </p>
            <p className="mt-2 font-serif text-3xl text-gold-dark">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
