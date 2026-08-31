"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { RootState, AppDispatch } from "@/store/store";
import { closeCart } from "@/store/uiSlice";
import { clearCart, removeFromCart, updateQuantity } from "@/store/cartSlice";

export default function CartDrawer() {
  const dispatch = useDispatch<AppDispatch>();

  const isCartOpen = useSelector((state: RootState) => state.ui.isCartOpen);

  const items = useSelector((state: RootState) => state.cart.items);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleDecrease = (
    productId: string,
    variantId: string,
    quantity: number,
  ) => {
    if (quantity <= 1) {
      dispatch(removeFromCart({ productId, variantId }));
      return;
    }

    dispatch(
      updateQuantity({
        productId,
        variantId,
        quantity: quantity - 1,
      }),
    );
  };

  const handleIncrease = (
    productId: string,
    variantId: string,
    quantity: number,
  ) => {
    dispatch(
      updateQuantity({
        productId,
        variantId,
        quantity: quantity + 1,
      }),
    );
  };

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <button
          type="button"
          aria-label="Close cart"
          onClick={() => dispatch(closeCart())}
          className="fixed inset-0 z-40 cursor-default bg-black/30"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-beige px-6 py-5">
          <div>
            <h2 className="font-serif text-2xl text-black">Your Cart</h2>

            {totalItems > 0 && (
              <p className="mt-1 text-xs text-gray">
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => dispatch(closeCart())}
            aria-label="Close cart"
            className="rounded-full p-2 text-black transition-colors hover:bg-beige"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Empty cart */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <ShoppingBag className="mb-4 h-10 w-10 text-gold" />

            <h3 className="font-serif text-xl text-black">
              Your cart is empty
            </h3>

            <p className="mt-2 text-sm text-gray">
              Looks like you haven't added anything yet.
            </p>

            <Link
              href="/products"
              onClick={() => dispatch(closeCart())}
              className="mt-6 rounded-md bg-gold px-6 py-3 text-sm font-medium text-white hover:bg-gold-dark"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="flex flex-col gap-5">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId}`}
                    className="flex gap-4 border-b border-beige pb-5"
                  >
                    {/* Image */}
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-md bg-white">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Information */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="min-w-0 wrap-break-word font-medium text-black">
                          {item.name}
                        </h3>

                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              removeFromCart({
                                productId: item.productId,
                                variantId: item.variantId,
                              }),
                            )
                          }
                          aria-label={`Remove ${item.name}`}
                          className="shrink-0 text-gray hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="mt-2 text-sm text-gold-dark">
                        {item.price} DA
                      </p>

                      {/* Quantity */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center rounded-md border border-beige bg-white">
                          <button
                            type="button"
                            onClick={() =>
                              handleDecrease(
                                item.productId,
                                item.variantId,
                                item.quantity,
                              )
                            }
                            className="p-1.5 text-black hover:bg-beige"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>

                          <span className="min-w-8 text-center text-sm text-black">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleIncrease(
                                item.productId,
                                item.variantId,
                                item.quantity,
                              )
                            }
                            className="p-1.5 text-black hover:bg-beige"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <p className="text-sm font-medium text-black">
                          {item.price * item.quantity} DA
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-beige bg-white px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-gray">Subtotal</span>

                <span className="font-serif text-xl text-black">
                  {total} DA
                </span>
              </div>
              <button
                type="button"
                onClick={() => dispatch(clearCart())}
                className="mb-3 w-full text-center text-sm text-gray transition-colors hover:text-red-500"
              >
                Clear Cart
              </button>
              <Link
                href="/checkout"
                onClick={() => dispatch(closeCart())}
                className="block w-full rounded-md bg-gold px-6 py-3 text-center text-sm font-medium text-white hover:bg-gold-dark"
              >
                Proceed to Checkout
              </Link>

              <button
                type="button"
                onClick={() => dispatch(closeCart())}
                className="mt-3 w-full text-center text-sm text-gray hover:text-black"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
