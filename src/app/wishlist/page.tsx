"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ProductCard from "@/components/ProductCard";
import { getWishlist, removeFromWishlist } from "@/services/wishlist.service";

export default function WishlistPage() {
  const queryClient = useQueryClient();

  const {
    data: wishlistData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => removeFromWishlist(productId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });
    },
  });

  const wishlist = wishlistData?.data ?? [];

  if (isLoading) {
    return (
      <section className="min-h-screen bg-cream px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-gray">Loading your wishlist...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="min-h-screen bg-cream px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="py-20 text-center">
            <Heart className="mx-auto mb-5 h-10 w-10 text-gold" />

            <h1 className="font-serif text-3xl text-black">
              Something went wrong
            </h1>

            <p className="mt-3 text-sm text-gray">
              We couldn't load your wishlist.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-block rounded-md bg-gold px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-gold-dark"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-cream px-6 py-12 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gray">
            Your favourites
          </p>

          <h1 className="mt-2 font-serif text-4xl text-black md:text-5xl">
            Wishlist
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray">
            Keep the pieces you love in one place and come back to them whenever
            you're ready.
          </p>
        </div>

        {/* Empty wishlist */}
        {wishlist.length === 0 && (
          <div className="flex flex-col items-center justify-center border-t border-beige py-24 text-center">
            <Heart className="h-12 w-12 text-gold" />

            <h2 className="mt-6 font-serif text-2xl text-black">
              Your wishlist is empty
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-gray">
              You haven't saved anything yet. Explore our collection and save
              the pieces you love.
            </p>

            <Link
              href="/products"
              className="mt-7 rounded-md bg-gold px-7 py-3 text-sm font-medium uppercase tracking-[0.12em] text-white shadow-sm transition hover:bg-gold-dark hover:shadow-md"
            >
              Explore Collection
            </Link>
          </div>
        )}

        {/* Wishlist products */}
        {wishlist.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between border-b border-beige pb-4">
              <p className="text-sm text-gray">
                {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
              </p>

              <Link
                href="/products"
                className="text-sm text-gold-dark transition hover:text-gold"
              >
                Continue Shopping →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-7">
              {wishlist.map((product) => (
                <div key={product._id} className="relative">
                  <ProductCard product={product} />

                  {/* Remove from wishlist */}
                  <button
                    type="button"
                    onClick={() => removeMutation.mutate(product._id)}
                    disabled={removeMutation.isPending}
                    aria-label={`Remove ${product.name} from wishlist`}
                    className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-beige bg-white text-gold shadow-sm transition hover:border-gold hover:bg-cream"
                  >
                    <Heart className="h-4 w-4" fill="currentColor" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
