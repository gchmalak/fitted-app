"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/services/product.service";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeImage, setActiveImage] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getProduct(id),
  });

  if (isLoading)
    return <p className="p-16 text-center text-gray">Loading product...</p>;
  if (isError || !data?.data)
    return <p className="p-16 text-center text-gray">Product not found.</p>;

  const product = data.data;

  const sizes = [
    ...new Set(product.variants.map((v) => v.size).filter(Boolean)),
  ];
  const colors = [
    ...new Set(product.variants.map((v) => v.color).filter(Boolean)),
  ];
  const shades = [
    ...new Set(product.variants.map((v) => v.shade).filter(Boolean)),
  ];

  return (
    <section className="bg-cream px-6 py-16 md:px-16">
      <h1 className="  flex items-center justify-center mb-6  text-4xl font-serif text-black ">
        Product's details
      </h1>
      <div className="flex flex-col">
        <Link
          href="/products"
          className="mb-6 font-medium text-gold hover:text-gold-dark"
        >
          Products page →
        </Link>
        <Link
          href="/"
          className="mb-6 font-medium text-gold hover:text-gold-dark"
        >
          Main page →
        </Link>
      </div>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="relative aspect-3/4 overflow-hidden rounded-lg border border-beige">
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative h-16 w-16 overflow-hidden rounded-md border ${
                    activeImage === idx ? "border-gold" : "border-beige"
                  }`}
                >
                  <Image
                    src={url}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs uppercase tracking-wide text-gray">
            {product.brand}
          </p>
          <h1 className="mt-1 font-serif text-4xl text-black">
            {product.name}
          </h1>
          <p className="mt-3 font-serif text-2xl text-gold-dark">
            {product.price} DA
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-beige px-3 py-1 text-xs text-gray">
              {product.department}
            </span>
            <span className="rounded-full bg-beige px-3 py-1 text-xs text-gray">
              {product.categoryId?.name ?? "Uncategorized"}
            </span>
            {product.subcategory && (
              <span className="rounded-full bg-beige px-3 py-1 text-xs text-gray">
                {product.subcategory}
              </span>
            )}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-gray">
            {product.description}
          </p>

          {sizes.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-black">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <span
                    key={size}
                    className="rounded-md border border-beige bg-white px-3 py-1.5 text-sm text-black"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {colors.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-black">Color</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <span
                    key={color}
                    className="rounded-md border border-beige bg-white px-3 py-1.5 text-sm text-black"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {shades.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-black">Shade</p>
              <div className="flex flex-wrap gap-2">
                {shades.map((shade) => (
                  <span
                    key={shade}
                    className="rounded-md border border-beige bg-white px-3 py-1.5 text-sm text-black"
                  >
                    {shade}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button className="mt-8 w-full border border-black py-3 text-center text-sm uppercase tracking-wide text-black transition-colors hover:border-gold hover:bg-gold hover:text-white sm:w-auto sm:px-12">
            Order Now
          </button>
        </div>
      </div>
    </section>
  );
}
