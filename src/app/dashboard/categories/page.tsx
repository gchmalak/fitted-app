"use client";

import { useState } from "react";
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
import {
  createCategoryFormSchema,
  subcategorySchema,
} from "@/lib/validation/category";
import { useAuth } from "@/hooks/useAuth";

// ADMIN CATEGORIES PAGE FUNCTION_____________________________________________________________________________________

export default function AdminCategoriesPage() {
  // isOwner____________________________________________________________________________________________________________
  const { isOwner } = useAuth();
  const queryClient = useQueryClient();
  // states___________________________________________________________________________________________________________
  const [name, setName] = useState("");
  const [department, setDepartment] = useState<ProductDepartment | "">("");
  const [subInputs, setSubInputs] = useState<Record<string, string>>({});
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({});
  const [subErrors, setSubErrors] = useState<Record<string, string>>({});
  // useQuery_________________________________________________________________________________________________________
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: filtersData } = useQuery({
    queryKey: ["filters"],
    queryFn: getFilters,
  });
  // useMutation______________________________________________________________________________________________________
  const departments = filtersData?.data.departments ?? [];

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setName("");
      setDepartment("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const addSubMutation = useMutation({
    mutationFn: ({
      category,
      subName,
    }: {
      category: Category;
      subName: string;
    }) => addSubcategory(category, subName),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setSubInputs((prev) => ({ ...prev, [variables.category._id]: "" }));
      setSubErrors((prev) => ({ ...prev, [variables.category._id]: "" }));
    },
  });

  // handle create____________________________________________________________________________________________________
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    // result_________________________________________________________________________________________________________
    const result = createCategoryFormSchema.safeParse({ name, department });
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
  // handel add subcategory____________________________________________________________________________________________
  const handleAddSubcategory = (e: React.FormEvent, category: Category) => {
    e.preventDefault();
    const subName = subInputs[category._id] ?? "";

    const result = subcategorySchema.safeParse({ name: subName });
    if (!result.success) {
      setSubErrors((prev) => ({
        ...prev,
        [category._id]: result.error.issues[0].message,
      }));
      return;
    }

    setSubErrors((prev) => ({ ...prev, [category._id]: "" }));
    addSubMutation.mutate({ category, subName: result.data.name });
  };

  const categories = data?.data ?? [];

  return (
    <div className="p-6 md:p-10">
      {/* bread crumbs */}
      <BreadCrumbs
        items={[{ label: "Categories", href: "/dashboard/categories" }]}
      />
      {/* header */}
      <h1 className="mb-8 font-serif text-3xl text-black">Categories</h1>
      {/* category form */}
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

      {isLoading ? (
        <p className="text-gray">Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="rounded-xl border border-beige bg-white py-16 text-center text-gray">
          No categories yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {categories.map((category) => (
            <div
              key={category._id}
              className="rounded-xl border border-beige bg-white p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-black">{category.name}</p>
                  <span className="inline-block rounded bg-beige px-2 py-0.5 text-xs text-gold-dark">
                    {category.department}
                  </span>
                </div>
                {/* only owner can delete category */}
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
                    className="text-xs text-red-500 hover:text-red-600 disabled:opacity-50"
                  >
                    Delete Category
                  </button>
                )}
              </div>

              <div className="mb-3 flex flex-wrap gap-2">
                {category.subcategories.map((sub) => (
                  <span
                    key={sub._id}
                    className="rounded-full bg-cream px-3 py-1 text-xs text-gray"
                  >
                    {sub.name}
                  </span>
                ))}
                {category.subcategories.length === 0 && (
                  <span className="text-xs text-gray">
                    No subcategories yet.
                  </span>
                )}
              </div>

              <form
                onSubmit={(e) => handleAddSubcategory(e, category)}
                className="flex flex-col gap-1"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={subInputs[category._id] ?? ""}
                    onChange={(e) =>
                      setSubInputs((prev) => ({
                        ...prev,
                        [category._id]: e.target.value,
                      }))
                    }
                    placeholder="New subcategory name"
                    className="flex-1 rounded-md border border-beige bg-cream px-3 py-1.5 text-sm text-black outline-none focus:border-gold"
                  />
                  <button
                    type="submit"
                    disabled={addSubMutation.isPending}
                    className="rounded-md border border-gold px-3 py-1.5 text-xs text-gold-dark hover:bg-beige disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
                {subErrors[category._id] && (
                  <p className="text-xs text-gold-dark">
                    {subErrors[category._id]}
                  </p>
                )}
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
