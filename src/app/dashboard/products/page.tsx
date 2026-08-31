"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, deleteProduct } from "@/services/product.service";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useAuth } from "@/hooks/useAuth";

// limit per page
const PRODUCTS_PER_PAGE = 10;

// _____________PRODUCTS TABLE FUNCTION_____________________________________________________________________________________________________
function ProductsTable() {
  // isOwner___________________________________________________
  const { isOwner } = useAuth();
  // ______________________________________________________________
  const queryClient = useQueryClient();
  // ________________________________________________________________
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  //useQuery:_________________________________________________________________________________________________________________________________
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
  // useMutation:_______________________________________________________________________________________________________________________________
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
  // handle search change:____________________________________________________________________________________________________________________
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
        ]}
      />
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* heading */}
        <h1 className="font-serif text-3xl text-black">Products</h1>
        {/* add product link(button) */}
        <Link
          href="/dashboard/products/new"
          className="rounded-md bg-gold px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gold-dark"
        >
          Add Product
        </Link>
      </div>
      {/* Search bar */}
      <input
        type="text"
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="Search by name, brand, description, or product ID (PRD-00001)..."
        className="mb-6 w-full rounded-md border border-beige bg-white px-4 py-2.5 text-sm text-black outline-none focus:border-gold sm:max-w-md"
      />
      {/* Loading message */}
      {isLoading ? (
        <p className="p-16 text-center text-gray">Loading products...</p>
      ) : isError ? (
        <p className="p-16 text-center text-gray">Failed to load products.</p> //Error message
      ) : products.length === 0 ? (
        <p className="rounded-xl border border-beige bg-white py-16 text-center text-gray">
          {search ? `No products match "${search}".` : "No products yet."}
        </p> //No products found message
      ) : (
        <>
          {/* Mobile */}
          <div className="flex flex-col gap-3 md:hidden">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex gap-4 rounded-xl border border-beige bg-white p-4"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-beige">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

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

                  <div className="mt-3 flex gap-3 text-sm">
                    <Link
                      href={`/dashboard/products/${product._id}/edit`}
                      className="rounded-md border border-gold px-3 py-1 text-gold-dark hover:bg-beige"
                    >
                      Edit
                    </Link>
                    {isOwner && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${product.name}"?`)) {
                            removeProduct(product._id);
                          }
                        }}
                        disabled={isDeleting}
                        className="rounded-md border border-red-300 px-3 py-1 text-red-500 hover:bg-red-50 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden overflow-x-auto rounded-xl border border-beige bg-white md:block">
            {/* Products table */}
            <table className="w-full min-w-190 border-collapse text-sm">
              {/* table head */}
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
              {/* table body */}
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-beige last:border-0 transition hover:bg-beige/30"
                  >
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

                    <td className="px-4 py-3 text-xs text-gray">
                      {product.productId}
                    </td>

                    <td className="px-4 py-3 font-medium text-black">
                      {product.name}
                    </td>

                    <td className="px-4 py-3">
                      <span className="rounded-full bg-beige px-2.5 py-1 text-xs text-gray">
                        {product.categoryId?.name ?? "Uncategorized"}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-serif text-gold-dark">
                      {product.price} DA
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {/* Edit product link (button) */}
                        <Link
                          href={`/dashboard/products/${product._id}/edit`}
                          className="rounded-md border border-gold px-3 py-1.5 text-xs text-gold-dark transition hover:bg-beige"
                        >
                          Edit
                        </Link>
                        {/* delete product button */}
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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
