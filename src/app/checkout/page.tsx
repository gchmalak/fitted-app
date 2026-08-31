"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/hooks";
import { createOrder } from "@/services/order.service";
import { checkoutSchema } from "@/lib/validation/checkout";
import Image from "next/image";

export default function CheckoutPage() {
  // states______________________________________________________________________________________________
  const router = useRouter();
  const { items, totalPrice, clear } = useCart();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    wilaya: "",
    postalCode: "",
    deliveryNotes: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // handle change___________________________________________________________________________________________
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  // handel submit______________________________________________________________________________________________
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const result = checkoutSchema.safeParse(form);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errors[issue.path[0] as string] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await createOrder({
        ...result.data,
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      });
      clear();
      router.push("/orders/confirmation");
    } catch {
      setError("Something went wrong placing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <p className="p-16 text-center text-gray">
        Your cart is empty. Nothing to check out.
      </p>
    );
  }

  const inputClass =
    "rounded-md border border-beige bg-white px-4 py-2 text-black focus:border-gold outline-none";
  const fieldErrorClass = "mt-1 text-xs text-gold-dark";

  return (
    <section className="bg-cream px-6 pb-16 pt-28 md:px-16 md:pt-32">
      {/* Breadcrumb */}
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray">
        <button
          onClick={() => router.back()}
          className="text-sm text-gold-dark transition-colors hover:text-gold"
        >
          Back
        </button>

        <span>/</span>

        <span className="text-gray">Checkout</span>
      </nav>
      <h1 className="mb-10 font-serif text-4xl text-black">Checkout</h1>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-12 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray">Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className={inputClass}
            />
            {fieldErrors.fullName && (
              <p className={fieldErrorClass}>{fieldErrors.fullName}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray">
              Phone Number
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={inputClass}
            />
            {fieldErrors.phone && (
              <p className={fieldErrorClass}>{fieldErrors.phone}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray">
              Street Address
            </label>
            <input
              name="street"
              value={form.street}
              onChange={handleChange}
              className={inputClass}
            />
            {fieldErrors.street && (
              <p className={fieldErrorClass}>{fieldErrors.street}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray">City</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className={inputClass}
              />
              {fieldErrors.city && (
                <p className={fieldErrorClass}>{fieldErrors.city}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray">Wilaya</label>
              <input
                name="wilaya"
                value={form.wilaya}
                onChange={handleChange}
                className={inputClass}
              />
              {fieldErrors.wilaya && (
                <p className={fieldErrorClass}>{fieldErrors.wilaya}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray">
              Postal Code (optional)
            </label>
            <input
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray">
              Delivery Notes (optional)
            </label>
            <textarea
              name="deliveryNotes"
              value={form.deliveryNotes}
              onChange={handleChange}
              rows={3}
              className={inputClass}
            />
          </div>

          {error && <p className="text-sm text-gold-dark">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 bg-gold py-3 text-center text-sm uppercase tracking-wide text-white transition-colors hover:bg-gold-dark disabled:opacity-60"
          >
            {isSubmitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <div className="flex flex-col gap-4">
          <h2 className="font-serif text-2xl text-black">Order Summary</h2>
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variantId}`}
              className="flex items-center gap-4 border-b border-beige pb-4"
            >
              {/* Product Image */}
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md bg-white">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>

              {/* Product Info */}
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="truncate text-sm font-medium text-black">
                  {item.name}
                </span>

                <span className="text-xs text-gray">
                  Quantity: {item.quantity}
                </span>

                <span className="text-sm text-gray">{item.price} DA</span>
              </div>

              {/* Item Total */}
              <span className="shrink-0 text-sm font-medium text-black">
                {item.price * item.quantity} DA
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
