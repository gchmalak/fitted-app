"use client";

import { Provider, useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { store, RootState, AppDispatch } from "./store";
import { setCart } from "./cartSlice";
import { setWishlist } from "./wishlistSlice";

function StorePersistence({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const [hydrated, setHydrated] = useState(false);

  // Load cart and wishlist from localStorage when the app starts
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      const savedWishlist = localStorage.getItem("wishlist");

      if (savedCart) {
        dispatch(setCart(JSON.parse(savedCart)));
      }

      if (savedWishlist) {
        dispatch(setWishlist(JSON.parse(savedWishlist)));
      }
    } catch (error) {
      console.error("Failed to load persisted data:", error);
    } finally {
      setHydrated(true);
    }
  }, [dispatch]);

  // Save cart whenever it changes
  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [cartItems, hydrated]);

  // Save wishlist whenever it changes
  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    } catch (error) {
      console.error("Failed to save wishlist:", error);
    }
  }, [wishlistItems, hydrated]);

  return <>{children}</>;
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <StorePersistence>{children}</StorePersistence>
    </Provider>
  );
}
