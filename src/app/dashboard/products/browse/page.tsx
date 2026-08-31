"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/product.service";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import BreadCrumbs from "@/components/BreadCrumbs";
// limit of products per gape_________________________________________________________________________________
const PRODUCTS_PER_PAGE = 20;
// aADMIN BROWSE PAGE FUNCTION________________________________________________________________________________
export default function AdminBrowseProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", "browse", page, search],
    queryFn: () =>
      getProducts({
        page,
        limit: PRODUCTS_PER_PAGE,
        search: search || undefined,
      }),
    placeholderData: (previousData) => previousData,
  });

  const products = data?.data ?? [];

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

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
        ]}
      />
      {/* heading */}
      <h1 className="mb-6 font-serif text-3xl text-black">Browse Products</h1>
      {/* Search bar */}
      <input
        type="text"
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="Search by name, brand, description, or product ID (PRD-00001)..."
        className="mb-6 w-full rounded-md border border-beige bg-white px-4 py-2.5 text-sm text-black outline-none focus:border-gold sm:max-w-md"
      />
      {/* is loading message */}
      {isLoading ? (
        <p className="p-10 text-gray">Loading products...</p>
      ) : // error message
      isError ? (
        <p className="p-10 text-gray">Failed to load products.</p>
      ) : (
        <>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/dashboard/products/browse/${product._id}`}
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
          ) : (
            <p className="rounded-xl border border-beige bg-white py-16 text-center text-gray">
              {search ? `No products match "${search}".` : "No products yet."}
            </p>
          )}
          {/* pagination */}
          {data && products.length > 0 && (
            <Pagination
              currentPage={data.currentPage}
              totalPages={data.totalPages}
              totalCount={data.totalCount}
              limit={PRODUCTS_PER_PAGE}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
