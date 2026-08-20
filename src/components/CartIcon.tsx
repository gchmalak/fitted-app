"use client";
import { RootState } from "@/store/store";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function CartIcon() {
  // grabbing state.cart.items with use selector
  const items = useSelector((state: RootState) => state.cart.items);

  // reducing over items to get total quantity across all lines

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      href="/cart"
      aria-label="Cart"
      className="relative text-black transition-opacity hover:opacity-60"
    >
      <ShoppingBag className="h-5 w-5" />

      {totalCount > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-medium text-black">
          {totalCount}
        </span>
      )}
    </Link>
  );
}
