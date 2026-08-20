"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/product.service";
import Image from "next/image";

export default function AdminBrowseProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["products", "browse", page, search],
    queryFn: () =>
      getProducts({ page, limit: 20, search: search || undefined }),
  });

  const products = data?.data ?? [];

  return (
    <div className="p-6 md:p-10">
      <h1 className="mb-6 font-serif text-3xl text-black">Browse Products</h1>

      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Search by name, brand, description, or product ID (PRD-00001)..."
        className="mb-6 w-full rounded-md border border-beige bg-white px-4 py-2.5 text-sm text-black outline-none focus:border-gold sm:max-w-md"
      />

      {isLoading ? (
        <p className="p-10 text-gray">Loading products...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product._id}
                href={`/admin/products/browse/${product._id}`}
                className="flex gap-4 rounded-xl border border-beige bg-white p-4 transition hover:border-gold"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-beige">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray">{product.productId}</p>
                  <p className="truncate font-medium text-black">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray">
                    {product.categoryId?.name ?? "Uncategorized"} ·{" "}
                    {product.subcategory || "—"}
                  </p>
                  <p className="mt-1 font-serif text-gold-dark">
                    {product.price} DA
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {products.length === 0 && (
            <p className="rounded-xl border border-beige bg-white py-16 text-center text-gray">
              {search ? `No products match "${search}".` : "No products yet."}
            </p>
          )}

          {data && data.totalPages > 1 && (
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-md border border-beige px-3 py-1.5 text-xs text-gray disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-gray">
                Page {data.currentPage} of {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === data.totalPages}
                className="rounded-md border border-beige px-3 py-1.5 text-xs text-gray disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
