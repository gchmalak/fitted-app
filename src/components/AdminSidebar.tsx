"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Browse Products", href: "/admin/products/browse" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Carousel", href: "/admin/carousel" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Users", href: "/admin/users" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex w-64 flex-col gap-1 border-r border-beige bg-white p-6 ">
      <h2 className="mb-6 font-serif text-2xl text-black">FITTED Admin</h2>
      {LINKS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}

            href={link.href}
            className={`rounded-md px-4 py-2 text-sm transtion ${isActive ? "bg-gold text-white font-medium" : "text-gray hover:bg-beige hover:text-black"}`}
          >
            {link.label}
          </Link>
        );
      })}
    </aside>
  );
}
