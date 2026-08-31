"use client";

import Link from "next/link";

export default function OrderConfirmationPage() {
  return (
    <section className="min-h-[70vh] bg-cream px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-12 flex items-center gap-2 text-sm text-gray">
        <Link href="/" className="transition-colors hover:text-gold">
          Home
        </Link>

        <span>/</span>

        <Link href="/orders" className="transition-colors hover:text-gold">
          Orders
        </Link>

        <span>/</span>

        <span className="text-black">Order Confirmation</span>
      </nav>

      {/* Confirmation */}
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold text-3xl text-gold">
          ✓
        </span>

        <h1 className="font-serif text-3xl text-black">Order Placed</h1>

        <p className="max-w-md text-sm text-gray">
          Thank you for shopping with FITTED. Your order has been received and
          is now being processed.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/orders"
            className="border border-black px-8 py-3 text-sm uppercase tracking-wide text-black transition-colors hover:border-gold hover:bg-gold hover:text-white"
          >
            View My Orders
          </Link>

          <Link
            href="/products"
            className="bg-gold px-8 py-3 text-sm uppercase tracking-wide text-white transition-colors hover:bg-gold-dark"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
