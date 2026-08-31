"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/services/product.service";
import Image from "next/image";
import Link from "next/link";
import BreadCrumbs from "@/components/BreadCrumbs";
// ADMIN DETAIL PAGE FUNCTION______________________________________________________________________________________________________________
export default function AdminProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  // useQuery_________________________________________________________________________________________________________________________________
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getProduct(id),
  });
  // loading products message
  if (isLoading) return <p className="p-10 text-gray">Loading product...</p>;
  // error message
  if (isError || !data?.data)
    return <p className="p-10 text-gray">Product not found.</p>;

  const product = data.data;

  return (
    <div className="p-6 md:p-10">
      {/* Bread crumbs */}
      <BreadCrumbs
        items={[
          {
            label: "Products",
            href: "/dashboard/products",
          },
          {
            label: "Browse",
            href: "/dashboard/products/browse",
          },
          {
            label: product.name,
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="grid grid-cols-2 gap-3">
            {product.images.map((url, idx) => (
              <div
                key={idx}
                className="relative aspect-square overflow-hidden rounded-xl border border-beige"
              >
                <Image
                  src={url}
                  alt={`${product.name} ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-gray">{product.productId}</p>
          <h1 className="mt-1 font-serif text-3xl text-black">
            {product.name}
          </h1>
          <p className="mt-2 font-serif text-2xl text-gold-dark">
            {product.price} DA
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-beige px-3 py-1 text-xs text-gray">
              {product.department}
            </span>
            <span className="rounded-full bg-beige px-3 py-1 text-xs text-gray">
              {product.categoryId?.name ?? "Uncategorized"}
            </span>
            <span className="rounded-full bg-beige px-3 py-1 text-xs text-gray">
              {product.subcategory}
            </span>
            <span className="rounded-full bg-beige px-3 py-1 text-xs text-gray">
              {product.brand}
            </span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-gray">
            {product.description}
          </p>

          <div className="mt-6 border-t border-beige pt-4">
            <p className="mb-2 text-sm font-medium text-black">Variants</p>
            <div className="flex flex-col gap-2">
              {product.variants.map((v) => (
                <div
                  key={v._id}
                  className="flex items-center justify-between rounded-md bg-cream px-3 py-2 text-sm"
                >
                  <span className="text-black">
                    {[v.size, v.color, v.shade].filter(Boolean).join(" / ") ||
                      "Default"}
                  </span>
                  <span className="text-gray">SKU: {v.sku}</span>
                  <span
                    className={
                      v.stock < 5 ? "font-medium text-red-500" : "text-gray"
                    }
                  >
                    {v.stock} in stock
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            {/* Edit product link (button) */}
            <Link
              href={`/dashboard/products/${product._id}/edit`}
              className="rounded-md bg-gold px-5 py-2.5 text-sm font-medium text-white hover:bg-gold-dark"
            >
              Edit Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
