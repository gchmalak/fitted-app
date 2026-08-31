"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/hooks";
import BreadCrumbs from "@/components/BreadCrumbs";

export default function CartPage() {
  const { items, totalPrice, removeItem, updateItemQuantity } = useCart();

  if (items.length === 0) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-cream px-6 text-center">
        <p className="font-serif text-2xl text-black">Your cart is empty.</p>
        <Link
          href="/products"
          className="text-sm uppercase tracking-wide text-gold-dark hover:text-gold"
        >
          Browse Products →
        </Link>
      </section>
    );
  }

  return (
    <section className="bg-cream px-6 py-16 md:px-16">
      {/* bread crumbs */}
      <BreadCrumbs
        baseHref="/"
        baseLabel="Home"
        items={[{ label: "Cart", href: "/cart" }]}
      />
      {/* heading */}
      <h1 className="mb-10 font-serif text-4xl text-black">Your Cart</h1>

      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variantId}`}
            className="flex items-center gap-4 border-b border-beige pb-6"
          >
            <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-beige">
              <Image
                src={item.image}
                alt={item.name}
                fill
                draggable={false}
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <p className="font-serif text-lg text-black">{item.name}</p>
              <p className="text-sm text-gray">{item.price} DA</p>

              <div className="mt-2 flex w-fit items-center rounded-md border border-beige">
                <button
                  onClick={() =>
                    updateItemQuantity(
                      item.productId,
                      item.variantId,
                      Math.max(1, item.quantity - 1),
                    )
                  }
                  className="px-3 py-1 text-black hover:text-gold-dark"
                >
                  −
                </button>
                <span className="px-3 text-black">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateItemQuantity(
                      item.productId,
                      item.variantId,
                      item.quantity + 1,
                    )
                  }
                  className="px-3 py-1 text-black hover:text-gold-dark"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <p className="font-medium text-black">
                {item.price * item.quantity} DA
              </p>
              <button
                onClick={() => removeItem(item.productId, item.variantId)}
                className="text-xs uppercase tracking-wide text-gray hover:text-gold-dark"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between pt-4">
          <p className="font-serif text-2xl text-black">
            Total: {totalPrice} DA
          </p>
          {/* proceed to checkout link */}
          <Link
            href="/checkout"
            className="bg-gold px-10 py-3 text-center text-sm uppercase tracking-wide text-white transition-colors hover:bg-gold-dark"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </section>
  );
}
