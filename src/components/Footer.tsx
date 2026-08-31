"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { subscribeToNewsletter } from "@/services/newsletter.service";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");

  const { mutate, isPending, isSuccess, error, isError } = useMutation({
    mutationFn: subscribeToNewsletter,
    onSuccess: () => setEmail(""),
  });
  if (pathname === "/contact" || pathname.startsWith("/dashboard")) return null;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    mutate(email);
  };

  return (
    <footer
      data-navtheme="light"
      className="border-t border-beige bg-brown px-6 py-12 md:px-16"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-serif text-2xl text-beige">FITTED</p>
          <p className="mt-2 max-w-xs text-sm text-white">
            Modern fashion. Timeless style.
          </p>
        </div>

        <div className="flex-1 max-w-md">
          <p className="text-sm font-medium text-cream">Stay in the loop</p>
          <p className="mt-1 text-sm text-white">
            Get updates on new arrivals and exclusive offers.
          </p>

          <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              className="flex-1 rounded-md border border-beige bg-cream px-4 py-2 text-sm text-black outline-none focus:border-gold"
            />
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-gold px-5 py-2 text-sm font-medium text-white hover:bg-gold-dark disabled:opacity-50"
            >
              {isPending ? "..." : "Subscribe"}
            </button>
          </form>

          {isSuccess && (
            <p className="mt-2 text-xs text-green-600">
              Thanks for subscribing!
            </p>
          )}
          {isError && (
            <p className="mt-2 text-xs text-red-500">{error.message}</p>
          )}

          <Link
            href="/contact"
            className="mt-4 inline-block text-sm text-beige hover:text-gold"
          >
            Have a question? Contact us →
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-beige pt-6 text-xs text-white">
        © {new Date().getFullYear()} FITTED. All rights reserved.
      </div>
    </footer>
  );
}
