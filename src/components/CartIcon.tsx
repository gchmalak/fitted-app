"use client";
import { RootState } from "@/store/store";
import { ShoppingBag } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { openCart } from "@/store/uiSlice";

export default function CartIcon() {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button
      onClick={() => dispatch(openCart())}
      aria-label="Cart"
      className="relative text-current transition-opacity hover:opacity-60"
    >
      <ShoppingBag className="h-5 w-5" />
      {totalCount > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-medium text-black">
          {totalCount}
        </span>
      )}
    </button>
  );
}
