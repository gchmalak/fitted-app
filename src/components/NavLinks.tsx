"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const SECTIONS = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/products" },

  {
    label: "Clothing",
    href: "/products?department=Clothing",
  },

  {
    label: "Care Essentials",
    href: "/products?departments=Makeup,Skincare,Perfume",
  },

  {
    label: "Accessories",
    href: "/products?department=Accessories",
  },

  { label: "My Orders", href: "/orders" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

type NavLinksProps = {
  className?: string;
  onLinkClickAction?: () => void;
};

export default function NavLinks({
  className,
  onLinkClickAction,
}: NavLinksProps) {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className={className}>
      {SECTIONS.map((section) => {
        if (section.label === "My Orders" && !user) {
          return null;
        }

        return (
          <Link
            key={section.label}
            href={section.href}
            onClick={onLinkClickAction}
            className="whitespace-nowrap text-sm text-current transition-colors hover:text-gold-dark"
          >
            {section.label}
          </Link>
        );
      })}
    </div>
  );
}
