"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, deleteProduct } from "@/services/product.service";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useAuth } from "@/hooks/useAuth";
import { LayoutGrid, List } from "lucide-react";

// Limit per page
const PRODUCTS_PER_PAGE = 10;

// ______________PRODUCTS TABLE / CARD PAGE________________________________________________________________
function ProductsTable() {
  const { isOwner } = useAuth();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // View mode: table by default
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // ______________USE QUERY________________________________________________________________________________
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", "admin", page, search],
    queryFn: () =>
      getProducts({
        page,
        limit: PRODUCTS_PER_PAGE,
        search: search || undefined,
      }),
    placeholderData: (previousData) => previousData,
  });

  // ______________DELETE MUTATION__________________________________________________________________________
  const { mutate: removeProduct, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteProduct(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      // If deleting the last product on a page,
      // go back one page if necessary.
      if (data && data.data.length === 1 && page > 1) {
        setPage((current) => current - 1);
      }
    },
  });

  const products = data?.data ?? [];

  // ______________SEARCH___________________________________________________________________________________
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="p-6 md:p-10">
      {/* Breadcrumbs */}
      <BreadCrumbs
        items={[
          {
            label: "Products",
            href: "/dashboard/products",
          },
        ]}
      />

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-3xl text-black">Products</h1>

        <Link
          href="/dashboard/products/new"
          className="rounded-md bg-gold px-5 py-2.5 text-center text-sm font-medium text-white transition hover:bg-gold-dark"
        >
          Add Product
        </Link>
      </div>

      {/* Search + View Switcher */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by name, brand, description, or product ID (PRD-00001)..."
          className="w-full rounded-md border border-beige bg-white px-4 py-2.5 text-sm text-black outline-none focus:border-gold sm:max-w-md"
        />

        {/* View Switcher */}
        <div className="flex w-fit items-center rounded-md border border-beige bg-white p-1 shadow-sm">
          {/* Table */}
          <button
            type="button"
            onClick={() => setViewMode("table")}
            aria-label="Table view"
            className={`flex items-center gap-2 rounded px-3 py-2 text-sm transition ${
              viewMode === "table"
                ? "bg-gold text-white"
                : "text-gray hover:bg-beige hover:text-black"
            }`}
          >
            <List className="h-4 w-4" />
            <span>Table</span>
          </button>

          {/* Cards */}
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            aria-label="Card view"
            className={`flex items-center gap-2 rounded px-3 py-2 text-sm transition ${
              viewMode === "cards"
                ? "bg-gold text-white"
                : "text-gray hover:bg-beige hover:text-black"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span>Cards</span>
          </button>
        </div>
      </div>

      {/* Loading / Error / Empty */}
      {isLoading ? (
        <p className="p-16 text-center text-gray">Loading products...</p>
      ) : isError ? (
        <p className="p-16 text-center text-gray">Failed to load products.</p>
      ) : products.length === 0 ? (
        <p className="rounded-xl border border-beige bg-white py-16 text-center text-gray">
          {search ? `No products match "${search}".` : "No products yet."}
        </p>
      ) : (
        <>
          {/* ================================================================================= */}
          {/* TABLE VIEW */}
          {/* ================================================================================= */}

          {viewMode === "table" && (
            <>
              {/* ----------------------------------------------------------------------------- */}
              {/* MOBILE TABLE/LIST */}
              {/* ----------------------------------------------------------------------------- */}

              <div className="flex flex-col gap-3 md:hidden">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="flex gap-4 rounded-xl border border-beige bg-white p-4"
                  >
                    {/* Image */}
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-beige">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product info */}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray">{product.productId}</p>

                      <p className="truncate font-medium text-black">
                        {product.name}
                      </p>

                      <p className="mt-0.5 text-sm text-gray">
                        {product.department} ·{" "}
                        {product.categoryId?.name ?? "Uncategorized"}
                      </p>

                      <p className="mt-1 font-serif text-gold-dark">
                        {product.price} DA
                      </p>

                      {/* Actions */}
                      <div className="mt-3 flex flex-wrap gap-2 text-sm">
                        {/* Details */}
                        <Link
                          href={`/dashboard/products/${product._id}`}
                          className="rounded-md border border-beige px-3 py-1 text-gray transition hover:bg-beige hover:text-black"
                        >
                          Details
                        </Link>

                        {/* Edit */}
                        <Link
                          href={`/dashboard/products/${product._id}/edit`}
                          className="rounded-md border border-gold px-3 py-1 text-gold-dark transition hover:bg-beige"
                        >
                          Edit
                        </Link>

                        {/* Delete - Owner only */}
                        {isOwner && (
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${product.name}"?`)) {
                                removeProduct(product._id);
                              }
                            }}
                            disabled={isDeleting}
                            className="rounded-md border border-red-300 px-3 py-1 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ----------------------------------------------------------------------------- */}
              {/* DESKTOP TABLE */}
              {/* ----------------------------------------------------------------------------- */}

              <div className="hidden overflow-x-auto rounded-xl border border-beige bg-white md:block">
                <table className="w-full min-w-[800px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-beige bg-beige/50 text-left text-xs uppercase tracking-wide text-gray">
                      <th className="px-4 py-3">Image</th>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product._id}
                        className="border-b border-beige last:border-0 transition hover:bg-beige/30"
                      >
                        {/* Image */}
                        <td className="px-4 py-3">
                          <div className="relative h-12 w-12 overflow-hidden rounded-md border border-beige">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </td>

                        {/* ID */}
                        <td className="px-4 py-3 text-xs text-gray">
                          {product.productId}
                        </td>

                        {/* Name */}
                        <td className="px-4 py-3 font-medium text-black">
                          {product.name}
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-beige px-2.5 py-1 text-xs text-gray">
                            {product.categoryId?.name ?? "Uncategorized"}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3 font-serif text-gold-dark">
                          {product.price} DA
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            {/* Details */}
                            <Link
                              href={`/dashboard/products/${product._id}`}
                              className="rounded-md border border-beige px-3 py-1.5 text-xs text-gray transition hover:bg-beige hover:text-black"
                            >
                              Details
                            </Link>

                            {/* Edit */}
                            <Link
                              href={`/dashboard/products/${product._id}/edit`}
                              className="rounded-md border border-gold px-3 py-1.5 text-xs text-gold-dark transition hover:bg-beige"
                            >
                              Edit
                            </Link>

                            {/* Delete - Owner only */}
                            {isOwner && (
                              <button
                                onClick={() => {
                                  if (confirm(`Delete "${product.name}"?`)) {
                                    removeProduct(product._id);
                                  }
                                }}
                                disabled={isDeleting}
                                className="rounded-md border border-red-300 px-3 py-1.5 text-xs text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ================================================================================= */}
          {/* CARD VIEW */}
          {/* ================================================================================= */}

          {viewMode === "cards" && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="overflow-hidden rounded-xl border border-beige bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Product image */}
                  <div className="relative aspect-[4/5] w-full bg-beige">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product information */}
                  <div className="p-4">
                    <p className="text-xs text-gray">{product.productId}</p>

                    <h2 className="mt-1 truncate font-medium text-black">
                      {product.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray">
                      {product.department}
                    </p>

                    <p className="mt-1 text-sm text-gray">
                      {product.categoryId?.name ?? "Uncategorized"}
                    </p>

                    <p className="mt-3 font-serif text-xl text-gold-dark">
                      {product.price} DA
                    </p>

                    {/* Actions */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {/* Details */}
                      <Link
                        href={`/dashboard/products/${product._id}`}
                        className="flex-1 rounded-md border border-beige px-3 py-2 text-center text-xs font-medium text-gray transition hover:bg-beige hover:text-black"
                      >
                        Details
                      </Link>

                      {/* Edit */}
                      <Link
                        href={`/dashboard/products/${product._id}/edit`}
                        className="flex-1 rounded-md border border-gold px-3 py-2 text-center text-xs font-medium text-gold-dark transition hover:bg-beige"
                      >
                        Edit
                      </Link>

                      {/* Delete - Owner only */}
                      {isOwner && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${product.name}"?`)) {
                              removeProduct(product._id);
                            }
                          }}
                          disabled={isDeleting}
                          className="flex-1 rounded-md border border-red-300 px-3 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================================================================================= */}
          {/* PAGINATION */}
          {/* ================================================================================= */}

          {data && (
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

export default function AdminProductsPage() {
  return <ProductsTable />;
}
