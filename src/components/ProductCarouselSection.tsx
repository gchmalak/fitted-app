"use client";

import { getProductsByDepartments } from "@/services/product.service";
import { ProductDepartment } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import Link from "next/link";
import ProductCard from "./ProductCard";

type ProductCarouselSectionProps = {
  id?: string;
  title: string;
  departments: ProductDepartment[];
  limit?: number;
  shopLabel: string;
};

export default function ProductCarouselSection({
  id,
  title,
  departments,
  limit = 12,
  shopLabel,
}: ProductCarouselSectionProps) {
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", "carousel", departments, limit],
    queryFn: () => getProductsByDepartments(departments, limit),
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

  //   build the products page url auto
  const shopHref =
    departments.length === 1
      ? `/products?department=${departments[0]}`
      : `/products?departments=${departments.join(",")}`;
  if (isLoading) {
    return (
      <section className="bg-cream px-6 py-16 md:px-16">
        <p className="text-center text-gray">
          Loading {title?.toLowerCase() ?? "products"}
        </p>
      </section>
    );
  }
  if (isError || !products?.length) {
    return null;
  }
  return (
    <section
      id={id}
      data-navtheme="light"
      className="relative bg-cream px-6 py-16 md:px-16"
    >
      {/* heading + shop link */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-serif text-3xl text-black md:text-4xl">{title}</h2>

        <Link
          href={shopHref}
          className="text-sm uppercase tracking-wide text-gold-dark transition hover:text-gold"
        >
          {shopLabel} →
        </Link>
      </div>
      {/* products carousel */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="min-w-0 flex-[0_0_80%] sm:flex-[0_0_45%] md:flex-[0_0_32%] lg:flex-[0_0_25%] "
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
      </div>
    </section>
  );
}
