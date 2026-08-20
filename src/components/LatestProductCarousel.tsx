"use client";
import Link from "next/link";
import { getLatestProducts } from "@/services/product.service";
import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import ProductCard from "./ProductCard";

export default function LatestProductCarousel() {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "latest"],
    queryFn: getLatestProducts,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  });
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  if (isLoading)
    return <p className="text-center text-gray">Loading new arrivals...</p>;
  if (!data?.data.length) return null;

  return (
    <section className="relative bg-cream px-6 py-16 md:px-16">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-serif text-3xl text-black">New Arrivals</h2>
        <Link
          href="/products"
          className="text-sm uppercase tracking-wide text-gold-dark hover:text-gold"
        >
          Shop All →
        </Link>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {data.data.slice(0, 10).map((product) => (
            <div
              key={product._id}
              className="min-w-0 flex-[0_0_70%] sm:flex-[0_0_40%] lg:flex-[0_0_25%]"
            >
              <ProductCard product={product} />
            </div>
          ))}
          <div className="min-w-0 flex-[0_0_33.333%] lg:flex-[0_0_25%]">
            <Link
              href="/products"
              className="group flex h-full min-h-70 flex-col items-center justify-center gap-4"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold text-gold transition-transform group-hover:translate-x-1">
                →
              </span>
              <span className="font-serif text-lg text-black">
                See All Products
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
      </div>
    </section>
  );
}
