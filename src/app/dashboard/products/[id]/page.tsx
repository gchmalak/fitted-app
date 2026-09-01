// read only details page
"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { getProduct } from "@/services/product.service";
import BreadCrumbs from "@/components/BreadCrumbs";
import { Product } from "@/types/product";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, isError } = useQuery<{ data: Product }>({
    queryKey: ["products", id],
    queryFn: () => getProduct(id),
  });

  const product = data?.data;

  if (isLoading) {
    return <p className="p-16 text-center text-gray">Loading product...</p>;
  }

  if (isError || !product) {
    return (
      <div className="p-16 text-center">
        <p className="text-gray">Product not found.</p>

        <button
          onClick={() => router.push("/dashboard/products")}
          className="mt-4 rounded-md bg-gold px-4 py-2 text-sm text-white hover:bg-gold-dark"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const categoryName =
    typeof product.categoryId === "object"
      ? product.categoryId?.name
      : "Uncategorized";

  return (
    <div className="p-6 md:p-10">
      {/* Breadcrumbs */}
      <BreadCrumbs
        items={[
          {
            label: "Products",
            href: "/dashboard/products",
          },
          {
            label: product.name,
          },
        ]}
      />

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-gray">{product.productId}</p>

          <h1 className="mt-1 font-serif text-3xl text-black">
            {product.name}
          </h1>
        </div>

        <Link
          href={`/dashboard/products/${product._id}/edit`}
          className="rounded-md bg-gold px-5 py-2.5 text-center text-sm font-medium text-white transition hover:bg-gold-dark"
        >
          Edit Product
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="grid grid-cols-2 gap-3">
            {product.images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-[4/5] overflow-hidden rounded-xl border border-beige bg-beige"
              >
                <Image
                  src={image}
                  alt={`${product.name} image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product information */}
        <div className="flex flex-col gap-6">
          {/* Basic information */}
          <section className="rounded-xl border border-beige bg-white p-6">
            <h2 className="mb-4 font-serif text-xl text-black">
              Product Information
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray">
                  Product ID
                </p>
                <p className="mt-1 text-sm text-black">{product.productId}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray">
                  Brand
                </p>
                <p className="mt-1 text-sm text-black">{product.brand}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray">
                  Department
                </p>
                <p className="mt-1 text-sm text-black">{product.department}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray">
                  Category
                </p>
                <p className="mt-1 text-sm text-black">
                  {categoryName || "Uncategorized"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray">
                  Subcategory
                </p>
                <p className="mt-1 text-sm text-black">
                  {product.subcategory || "None"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray">
                  Price
                </p>
                <p className="mt-1 font-serif text-lg text-gold-dark">
                  {product.price} DA
                </p>
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="rounded-xl border border-beige bg-white p-6">
            <h2 className="mb-3 font-serif text-xl text-black">Description</h2>

            <p className="whitespace-pre-line text-sm leading-6 text-gray">
              {product.description}
            </p>
          </section>

          {/* Variants */}
          <section className="rounded-xl border border-beige bg-white p-6">
            <h2 className="mb-4 font-serif text-xl text-black">Variants</h2>

            {product.variants.length === 0 ? (
              <p className="text-sm text-gray">No variants available.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {product.variants.map((variant, index) => (
                  <div
                    key={variant._id ?? index}
                    className="rounded-lg border border-beige bg-cream p-4"
                  >
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <div>
                        <p className="text-xs text-gray">Size</p>
                        <p className="mt-1 text-sm text-black">
                          {variant.size || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray">Color</p>
                        <p className="mt-1 text-sm text-black">
                          {variant.color || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray">Shade</p>
                        <p className="mt-1 text-sm text-black">
                          {variant.shade || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray">Stock</p>
                        <p className="mt-1 text-sm font-medium text-black">
                          {variant.stock}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 border-t border-beige pt-3">
                      <p className="text-xs text-gray">SKU</p>
                      <p className="mt-1 text-sm text-black">{variant.sku}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Care */}
          <section className="rounded-xl border border-beige bg-white p-6">
            <h2 className="mb-3 font-serif text-xl text-black">
              Care Instructions
            </h2>

            <p className="whitespace-pre-line text-sm leading-6 text-gray">
              {product.care || "No care instructions provided."}
            </p>
          </section>

          {/* Shipping */}
          <section className="rounded-xl border border-beige bg-white p-6">
            <h2 className="mb-3 font-serif text-xl text-black">
              Shipping & Returns
            </h2>

            <p className="whitespace-pre-line text-sm leading-6 text-gray">
              {product.shipping || "No shipping information provided."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
