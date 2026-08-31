"use client";

import { useState, useEffect, Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/services/product.service";
import { getCategories } from "@/services/category.service";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import BreadCrumbs from "@/components/BreadCrumbs";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

const PRODUCTS_PER_PAGE = 6;

const DEPARTMENTS = [
  "Clothing",
  "Makeup",
  "Skincare",
  "Accessories",
  "Perfume",
];

const SORT_OPTIONS = [
  {
    label: "Newest",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  {
    label: "Price: Low to High",
    sortBy: "price",
    sortOrder: "asc",
  },
  {
    label: "Price: High to Low",
    sortBy: "price",
    sortOrder: "desc",
  },
  {
    label: "Top Rated",
    sortBy: "averageRating",
    sortOrder: "desc",
  },
] as const;

function AllProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filtersOpen, setFiltersOpen] = useState(false);

  const departmentsParam = searchParams.get("departments");
  const departmentParam = searchParams.get("department") || undefined;

  const departmentList = departmentsParam
    ? departmentsParam.split(",")
    : undefined;

  const categoryId = searchParams.get("categoryId") || undefined;
  const search = searchParams.get("search") || undefined;

  const sortBy =
    (searchParams.get("sortBy") as "createdAt" | "price" | "averageRating") ||
    "createdAt";

  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [searchInput, setSearchInput] = useState(search ?? "");

  useEffect(() => {
    setSearchInput(search ?? "");
  }, [search]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput !== (search ?? "")) {
        updateFilter("search", searchInput || null);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: [
      "products",
      "all",
      departmentParam,
      departmentList,
      categoryId,
      search,
      sortBy,
      sortOrder,
      page,
    ],

    queryFn: () =>
      getProducts({
        page,
        limit: PRODUCTS_PER_PAGE,
        department: departmentParam,
        departments: departmentList,
        categoryId,
        search,
        sortBy,
        sortOrder,
      }),

    placeholderData: (previousData) => previousData,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categoriesForDepartments = (categoriesData?.data ?? []).filter((c) =>
    departmentList
      ? departmentList.includes(c.department)
      : c.department === departmentParam,
  );

  const activeDepartmentLabel = departmentList
    ? departmentList.join(" + ")
    : departmentParam;

  const hasActiveFilters =
    !!departmentParam || !!departmentList || !!categoryId || !!search;

  function updateFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set("page", "1");

    if (key === "department" || key === "departments") {
      params.delete("categoryId");

      if (key === "department") {
        params.delete("departments");
      }

      if (key === "departments") {
        params.delete("department");
      }
    }

    router.push(`/products?${params.toString()}`);
  }

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(newPage));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    router.push(`/products?${params.toString()}`);
  }

  function handleSortChange(value: string) {
    const option = SORT_OPTIONS.find(
      (o) => `${o.sortBy}-${o.sortOrder}` === value,
    );

    if (!option) return;

    const params = new URLSearchParams(searchParams.toString());

    params.set("sortBy", option.sortBy);
    params.set("sortOrder", option.sortOrder);
    params.set("page", "1");

    router.push(`/products?${params.toString()}`);
  }

  function handleAllDepartments() {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("department");
    params.delete("departments");
    params.delete("categoryId");
    params.delete("search");

    params.set("page", "1");

    setSearchInput("");

    router.push(`/products?${params.toString()}`);
  }

  return (
    <section className="min-h-screen bg-cream px-6 pb-16 pt-28 md:px-10 md:pt-32 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumbs */}
        <BreadCrumbs
          baseHref="/"
          baseLabel="Home"
          items={[{ label: "Products", href: "/products" }]}
        />

        {/* Header */}
        <div className="mt-6 flex items-end justify-between rounded-xl border border-beige bg-white px-5 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] md:px-6">
          <div>
            <h1 className="font-serif text-4xl text-black">
              {activeDepartmentLabel || "All Products"}
            </h1>

            <p className="mt-2 text-sm text-gray">
              {data?.totalCount ?? 0} products
            </p>
          </div>

          {/* Filters button */}
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="group flex items-center gap-2 rounded-md border border-beige bg-cream px-4 py-2.5 text-sm uppercase tracking-wider text-black shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-white hover:text-gold-dark hover:shadow-md"
          >
            <SlidersHorizontal className="h-4 w-4 transition-transform group-hover:rotate-90" />

            <span>Filters</span>

            {hasActiveFilters && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-medium text-white shadow-sm">
                !
              </span>
            )}
          </button>
        </div>

        {/* Products */}
        <div className="mt-10">
          {isLoading ? (
            <p className="text-gray">Loading products...</p>
          ) : data?.data.length === 0 ? (
            <div className="rounded-xl border border-beige bg-white px-6 py-16 text-center shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <p className="text-gray">No products found</p>
            </div>
          ) : (
            <>
              <div
                className={`grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-14 ${
                  isPlaceholderData ? "opacity-60" : ""
                }`}
              >
                {data?.data.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {data && (
                <Pagination
                  currentPage={data.currentPage ?? page}
                  totalPages={Math.max(data.totalPages ?? 1, 1)}
                  totalCount={data.totalCount ?? 0}
                  limit={PRODUCTS_PER_PAGE}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Overlay */}
      {filtersOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/30 backdrop-blur-[2px]"
          onClick={() => setFiltersOpen(false)}
        />
      )}

      {/* Filter Sidebar */}
      <aside
        className={`fixed right-0 top-0 z-70 flex h-full w-full max-w-md flex-col border-l border-beige bg-cream shadow-[-15px_0_40px_rgba(0,0,0,0.12)] transition-transform duration-300 ${
          filtersOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-beige px-6 py-5 shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray">
              Refine
            </p>

            <h2 className="mt-1 font-serif text-2xl text-black">Filters</h2>
          </div>

          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            aria-label="Close filters"
            className="rounded-full p-2 text-gray transition-all duration-300 hover:bg-beige hover:text-black hover:shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto px-6 py-7">
          {/* Search */}
          <div className="border-b border-beige pb-7">
            <label className="mb-3 block text-xs font-medium uppercase tracking-[0.15em] text-gray">
              Search
            </label>

            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-md border border-beige bg-white px-4 py-3 text-sm text-black shadow-sm outline-none transition-all duration-300 focus:border-gold focus:shadow-[0_0_0_3px_rgba(184,155,94,0.12)]"
            />
          </div>

          {/* Department */}
          <div className="border-b border-beige py-7">
            <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-gray">
              Department
            </h3>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleAllDepartments}
                className={`rounded-full border px-4 py-2 text-sm shadow-sm transition-all duration-300 ${
                  !departmentParam && !departmentList
                    ? "border-gold bg-gold text-white shadow-md"
                    : "border-beige bg-white text-black hover:-translate-y-0.5 hover:border-gold hover:text-gold-dark hover:shadow-md"
                }`}
              >
                All
              </button>

              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept}
                  onClick={() => updateFilter("department", dept)}
                  className={`rounded-full border px-4 py-2 text-sm shadow-sm transition-all duration-300 ${
                    departmentParam === dept
                      ? "border-gold bg-gold text-white shadow-md"
                      : "border-beige bg-white text-black hover:-translate-y-0.5 hover:border-gold hover:text-gold-dark hover:shadow-md"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          {(departmentParam || departmentList) &&
            categoriesForDepartments.length > 0 && (
              <div className="border-b border-beige py-7">
                <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-gray">
                  Category
                </h3>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => updateFilter("categoryId", null)}
                    className={`flex items-center justify-between rounded-md border-b border-beige px-2 py-2 text-left text-sm transition-all ${
                      !categoryId
                        ? "font-medium text-gold-dark"
                        : "text-black hover:bg-white hover:text-gold-dark"
                    }`}
                  >
                    <span>All {activeDepartmentLabel}</span>

                    {!categoryId && <span className="text-gold">✓</span>}
                  </button>

                  {categoriesForDepartments.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => updateFilter("categoryId", cat._id)}
                      className={`flex items-center justify-between rounded-md border-b border-beige px-2 py-2 text-left text-sm transition-all ${
                        categoryId === cat._id
                          ? "font-medium text-gold-dark"
                          : "text-black hover:bg-white hover:text-gold-dark"
                      }`}
                    >
                      <span>{cat.name}</span>

                      {categoryId === cat._id && (
                        <span className="text-gold">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

          {/* Sort */}
          <div className="py-7">
            <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-gray">
              Sort By
            </h3>

            <div className="relative">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full appearance-none rounded-md border border-beige bg-white px-4 py-3 text-sm text-black shadow-sm outline-none transition-all duration-300 focus:border-gold focus:shadow-[0_0_0_3px_rgba(184,155,94,0.12)]"
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

              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray" />
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-beige bg-white px-6 py-5 shadow-[0_-6px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleAllDepartments}
              disabled={!hasActiveFilters}
              className="flex-1 rounded-md border border-beige px-5 py-3 text-sm font-medium uppercase tracking-wide text-black shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:text-gold-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
            >
              Clear All
            </button>

            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="flex-1 rounded-md bg-gold px-5 py-3 text-sm font-medium uppercase tracking-wide text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-dark hover:shadow-lg"
            >
              View Results
            </button>
          </div>
        </div>
      </aside>
    </section>
  );
}
export default function AllProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
      <AllProductsContent />
    </Suspense>
  );
}
