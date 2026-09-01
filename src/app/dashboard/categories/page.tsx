"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  createCategory,
  deleteCategory,
  addSubcategory,
} from "@/services/category.service";
import { getFilters } from "@/services/product.service";
import { Category } from "@/types/category";
import { ProductDepartment } from "@/types/product";
import BreadCrumbs from "@/components/BreadCrumbs";
import Pagination from "@/components/Pagination";
import {
  createCategoryFormSchema,
  subcategorySchema,
} from "@/lib/validation/category";
import { useAuth } from "@/hooks/useAuth";

// Number of categories displayed per page
const CATEGORIES_PER_PAGE = 10;

// ADMIN CATEGORIES PAGE
export default function AdminCategoriesPage() {
  const { isOwner } = useAuth();
  const queryClient = useQueryClient();

  // States
  const [name, setName] = useState("");
  const [department, setDepartment] = useState<ProductDepartment | "">("");

  const [subInputs, setSubInputs] = useState<Record<string, string>>({});

  const [createErrors, setCreateErrors] = useState<Record<string, string>>({});

  const [subErrors, setSubErrors] = useState<Record<string, string>>({});

  // Pagination
  const [page, setPage] = useState(1);

  // Get categories
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Get departments
  const { data: filtersData } = useQuery({
    queryKey: ["filters"],
    queryFn: getFilters,
  });

  const departments = filtersData?.data.departments ?? [];
  const categories = data?.data ?? [];

  // Pagination calculations
  const totalCount = categories.length;

  const totalPages = Math.ceil(totalCount / CATEGORIES_PER_PAGE);

  const startIndex = (page - 1) * CATEGORIES_PER_PAGE;

  const paginatedCategories = categories.slice(
    startIndex,
    startIndex + CATEGORIES_PER_PAGE,
  );

  // Keep page valid after deleting categories
  useEffect(() => {
    if (totalPages === 0) {
      setPage(1);
      return;
    }

    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // Create category
  const createMutation = useMutation({
    mutationFn: createCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      setName("");
      setDepartment("");

      // Go back to first page after creating
      setPage(1);
    },
  });

  // Delete category
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });

  // Add subcategory
  const addSubMutation = useMutation({
    mutationFn: ({
      category,
      subName,
    }: {
      category: Category;
      subName: string;
    }) => addSubcategory(category, subName),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      setSubInputs((prev) => ({
        ...prev,
        [variables.category._id]: "",
      }));

      setSubErrors((prev) => ({
        ...prev,
        [variables.category._id]: "",
      }));
    },
  });

  // Handle create category
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    const result = createCategoryFormSchema.safeParse({
      name,
      department,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        errors[issue.path[0] as string] = issue.message;
      });

      setCreateErrors(errors);
      return;
    }

    setCreateErrors({});
    createMutation.mutate(result.data);
  };

  // Handle add subcategory
  const handleAddSubcategory = (e: React.FormEvent, category: Category) => {
    e.preventDefault();

    const subName = subInputs[category._id] ?? "";

    const result = subcategorySchema.safeParse({
      name: subName,
    });

    if (!result.success) {
      setSubErrors((prev) => ({
        ...prev,
        [category._id]: result.error.issues[0].message,
      }));

      return;
    }

    setSubErrors((prev) => ({
      ...prev,
      [category._id]: "",
    }));

    addSubMutation.mutate({
      category,
      subName: result.data.name,
    });
  };

  return (
    <div className="p-6 md:p-10">
      {/* Breadcrumbs */}
      <BreadCrumbs
        items={[
          {
            label: "Categories",
            href: "/dashboard/categories",
          },
        ]}
      />

      {/* Header */}
      <h1 className="mb-8 font-serif text-3xl text-black">Categories</h1>

      {/* Create category form */}
      <form
        onSubmit={handleCreate}
        className="mb-8 flex flex-col gap-4 rounded-xl border border-beige bg-white p-6 md:flex-row md:items-start"
      >
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-gray">
            Category Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Dresses"
            className="w-full rounded-md border border-beige bg-cream px-3 py-2 text-sm text-black outline-none focus:border-gold"
          />

          {createErrors.name && (
            <p className="mt-1 text-xs text-gold-dark">{createErrors.name}</p>
          )}
        </div>

        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-gray">
            Department
          </label>

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value as ProductDepartment)}
            className="w-full rounded-md border border-beige bg-cream px-3 py-2 text-sm text-black outline-none focus:border-gold"
          >
            <option value="" disabled>
              Select a department
            </option>

            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {createErrors.department && (
            <p className="mt-1 text-xs text-gold-dark">
              {createErrors.department}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={createMutation.isPending}
          className="mt-1 rounded-md bg-gold px-5 py-2.5 text-sm font-medium text-white hover:bg-gold-dark disabled:opacity-50 md:mt-5"
        >
          {createMutation.isPending ? "Creating..." : "Add Category"}
        </button>
      </form>

      {/* Categories */}
      {isLoading ? (
        <p className="text-gray">Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="rounded-xl border border-beige bg-white py-16 text-center text-gray">
          No categories yet.
        </p>
      ) : (
        <>
          {/* Category cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedCategories.map((category) => (
              <div
                key={category._id}
                className="rounded-lg border border-beige bg-white p-4"
              >
                {/* Category header */}
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-black">
                      {category.name}
                    </p>

                    <span className="mt-1 inline-block rounded bg-beige px-2 py-0.5 text-[11px] text-gold-dark">
                      {category.department}
                    </span>
                  </div>

                  {/* Delete */}
                  {isOwner && (
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Delete "${category.name}"? This can't be undone.`,
                          )
                        ) {
                          deleteMutation.mutate(category._id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                      className="shrink-0 text-[11px] text-red-500 hover:text-red-600 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  )}
                </div>

                {/* Subcategories */}
                <div className="mb-3 flex min-h-7 flex-wrap gap-1.5">
                  {category.subcategories.map((sub) => (
                    <span
                      key={sub._id}
                      className="rounded-full bg-cream px-2 py-0.5 text-[11px] text-gray"
                    >
                      {sub.name}
                    </span>
                  ))}

                  {category.subcategories.length === 0 && (
                    <span className="text-[11px] text-gray">
                      No subcategories yet.
                    </span>
                  )}
                </div>

                {/* Add subcategory */}
                <form
                  onSubmit={(e) => handleAddSubcategory(e, category)}
                  className="flex flex-col gap-1"
                >
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={subInputs[category._id] ?? ""}
                      onChange={(e) =>
                        setSubInputs((prev) => ({
                          ...prev,
                          [category._id]: e.target.value,
                        }))
                      }
                      placeholder="New subcategory"
                      className="min-w-0 flex-1 rounded-md border border-beige bg-cream px-2.5 py-1.5 text-xs text-black outline-none focus:border-gold"
                    />

                    <button
                      type="submit"
                      disabled={addSubMutation.isPending}
                      className="rounded-md border border-gold px-2.5 py-1.5 text-[11px] text-gold-dark hover:bg-beige disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>

                  {subErrors[category._id] && (
                    <p className="text-[11px] text-gold-dark">
                      {subErrors[category._id]}
                    </p>
                  )}
                </form>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalCount={totalCount}
              limit={CATEGORIES_PER_PAGE}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
