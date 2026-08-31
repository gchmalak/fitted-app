"use client";

import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";

import { Product } from "@/types/product";
import { RootState, AppDispatch } from "@/store/store";
import { addToWishlist, removeFromWishlist } from "@/store/wishlistSlice";
import {
  addToWishlist as addToWishlistApi,
  removeFromWishlist as removeFromWishlistApi,
} from "@/services/wishlist.service";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const hasMultipleImages = product.images.length > 1;
  const isSoldOut = product.variants.every((v) => v.stock === 0);

  const dispatch = useDispatch<AppDispatch>();

  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const isInWishlist = wishlistItems.some((item) => item._id === product._id);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = (index: number) => {
    emblaApi?.scrollTo(index);
  };

  const handleWishlist = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (wishlistLoading) return;

    try {
      setWishlistLoading(true);

      if (isInWishlist) {
        await removeFromWishlistApi(product._id);

        dispatch(removeFromWishlist(product._id));
      } else {
        await addToWishlistApi(product._id);

        dispatch(addToWishlist(product));
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className="group flex flex-col">
      <Link href={`/products/${product._id}`} className="block">
        {/* Product Image */}{" "}
        <div
          className="
         relative aspect-3/4 overflow-hidden rounded-md
         bg-beige
         shadow-[0_2px_8px_rgba(0,0,0,0.06)]
         transition-all duration-500 ease-out
         group-hover:-translate-y-1
         group-hover:shadow-[0_18px_40px_-15px_rgba(0,0,0,0.18)]
       "
        >
          {isSoldOut && (
            <span className="absolute left-0 top-4 z-20 bg-red-600 px-4 py-1 text-xs font-medium uppercase tracking-wide text-white">
              Sold Out{" "}
            </span>
          )}
          ```
          {/* Wishlist button */}
          <button
            type="button"
            onClick={handleWishlist}
            disabled={wishlistLoading}
            aria-label={
              isInWishlist ? "Remove from wishlist" : "Add to wishlist"
            }
            className="
          absolute right-3 top-3 z-20
          flex h-9 w-9 items-center justify-center
          rounded-full bg-white/90
          shadow-sm backdrop-blur-sm
          transition-all duration-300
          hover:scale-105 hover:bg-white
          disabled:cursor-not-allowed disabled:opacity-60
        "
          >
            <Heart
              className={`h-5 w-5 transition-all duration-300 ${
                isInWishlist ? "fill-gold text-gold" : "text-black"
              }`}
            />
          </button>
          {/* Images */}
          {hasMultipleImages ? (
            <div
              className={`h-full w-full overflow-hidden ${
                isSoldOut ? "opacity-60" : ""
              }`}
              ref={emblaRef}
            >
              <div className="flex h-full">
                {product.images.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative h-full min-w-0 flex-[0_0_100%]"
                  >
                    <Image
                      src={url}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      draggable={false}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              draggable={false}
              className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] ${
                isSoldOut ? "opacity-60" : ""
              }`}
            />
          )}
          {/* Image indicators */}
          {hasMultipleImages && (
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    scrollTo(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    selectedIndex === idx ? "w-4 bg-white" : "w-1.5 bg-white/60"
                  }`}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        {/* Product information */}
        <div className="mt-4 flex flex-col gap-1 px-0.5">
          <h3 className="font-serif text-base text-black transition-colors duration-300 group-hover:text-gold-dark">
            {product.name}
          </h3>

          <p className="text-sm tracking-wide text-gray">{product.price} DA</p>
        </div>
      </Link>

      {/* Order button */}
      <Link
        href={`/products/${product._id}`}
        className="
      mt-3 border border-black py-2.5
      text-center text-sm uppercase tracking-wide text-black
      transition-all duration-300
      hover:-translate-y-0.5
      hover:border-gold
      hover:bg-gold
      hover:text-white
      hover:shadow-[0_6px_16px_rgba(184,155,94,0.25)]
    "
      >
        Order Now
      </Link>
    </div>
  );
}
