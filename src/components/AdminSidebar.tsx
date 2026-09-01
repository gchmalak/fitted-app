"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logout } from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";

const LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Users", href: "/dashboard/users", ownerOnly: true },
  { label: "Products", href: "/dashboard/products" },
  { label: "Editorial", href: "/dashboard/editorial" },
  { label: "Categories", href: "/dashboard/categories" },
  { label: "Carousel", href: "/dashboard/carousel" },
  { label: "Orders", href: "/dashboard/orders" },
  { label: "Messages", href: "/dashboard/messages" },
  { label: "Newsletter", href: "/dashboard/newsletter" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOwner } = useAuth();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <aside className="flex w-64 flex-col border-r border-beige bg-white p-6">
      <h2 className="mb-6 font-serif text-2xl text-black">
        {isOwner ? "FITTED Owner" : "FITTED Admin"}
      </h2>

      <div className="flex flex-1 flex-col gap-1">
        {LINKS.map((link) => {
          // Only the owner can see the Users page
          if (link.ownerOnly && !isOwner) {
            return null;
          }

          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-4 py-2 text-sm transition ${
                isActive
                  ? "bg-gold font-medium text-white"
                  : "text-gray hover:bg-beige hover:text-black"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-6 flex items-center gap-3 rounded-md px-4 py-2 text-sm text-gray transition hover:bg-beige hover:text-black"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
}
