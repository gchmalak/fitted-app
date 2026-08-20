"use client";

import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/services/product.service";
import { getCategories } from "@/services/category.service";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const DEPARTMENTS = [
  "Clothing",
  "Shoes",
  "Makeup",
  "Skincare",
  "Jewelry",
  "Perfume",
];
const SORT_OPTIONS = [
  { label: "Newest", sortBy: "createdAt", sortOrder: "desc" },
  { label: "Price: Low to High", sortBy: "price", sortOrder: "asc" },
  { label: "Price: High to Low", sortBy: "price", sortOrder: "desc" },
  { label: "Top Rated", sortBy: "averageRating", sortOrder: "desc" },
] as const;
export default function AllProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // _____________________________________________________________________
  const department = searchParams.get("department") || undefined;
  const categoryId = searchParams.get("categoryId") || undefined;
  // _________________________________________________________
  const search = searchParams.get("search") || undefined;
  const sortBy =
    (searchParams.get("sortBy") as "createdAt" | "price" | "averageRating") ||
    "createdAt";

  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
  // local input state, debounced before hitting the URL/query
  const [searchInput, setSearchInput] = useState(search ?? "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateFilter("search", searchInput || null);
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);
  const { data, isLoading } = useQuery({
    queryKey: ["products", "all", department, categoryId, search],
    queryFn: () =>
      getProducts({ page: 1, limit: 24, department, categoryId, search }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categoriesForDepartment = (categoriesData?.data ?? []).filter(
    (c) => c.department === department,
  );

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    // switching department invalidates whatever category was selected
    if (key === "department") params.delete("categoryId");
    router.push(`/products?${params.toString()}`);
  };
  const handleSortChange = (value: string) => {
    const option = SORT_OPTIONS.find(
      (o) => `${o.sortBy}-${o.sortOrder}` === value,
    );
    if (!option) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", option.sortBy);
    params.set("sortOrder", option.sortOrder);
    router.push(`/products?${params.toString()}`);
  };
  return (
    <section className="bg-cream px-6 py-16 md:px-16">
      <div className="flex justify-between">
        <h1 className="mb-6 font-serif text-4xl text-black">All Products</h1>
        <Link
          href="/"
          className="mb-6 font-medium text-gold hover:text-gold-dark"
        >
          Main page →
        </Link>
      </div>
      {/* Search + sort row */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-md border border-beige bg-white px-4 py-2.5 text-sm text-black outline-none focus:border-gold sm:max-w-sm"
        />
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => handleSortChange(e.target.value)}
          className="rounded-md border border-beige bg-white px-4 py-2.5 text-sm text-black outline-none focus:border-gold"
        >
          {SORT_OPTIONS.map((option) => (
            <option
              key={option.label}
              value={`${option.sortBy}-${option.sortOrder}`}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {/* Department pills */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => updateFilter("department", null)}
          className={`rounded-full px-4 py-1.5 text-sm ${!department ? "bg-gold text-white" : "bg-beige text-gray hover:bg-gold/20"}`}
        >
          All
        </button>
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept}
            onClick={() => updateFilter("department", dept)}
            className={`rounded-full px-4 py-1.5 text-sm ${department === dept ? "bg-gold text-white" : "bg-beige text-gray hover:bg-gold/20"}`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Category pills — only shown once a department is picked */}
      {department && categoriesForDepartment.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2 border-t border-beige pt-4">
          <button
            onClick={() => updateFilter("categoryId", null)}
            className={`rounded-full px-3 py-1 text-xs ${!categoryId ? "bg-gold-dark text-white" : "bg-white text-gray hover:bg-gold/10"}`}
          >
            All {department}
          </button>
          {categoriesForDepartment.map((cat) => (
            <button
              key={cat._id}
              onClick={() => updateFilter("categoryId", cat._id)}
              className={`rounded-full px-3 py-1 text-xs ${categoryId === cat._id ? "bg-gold-dark text-white" : "bg-white text-gray hover:bg-gold/10"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <p>Loading products...</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {data?.data.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
      {data?.data.length === 0 && (
        <p className="py-16 text-center text-gray">No products found</p>
      )}
    </section>
  );
}
