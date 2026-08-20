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

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [department, setDepartment] = useState<ProductDepartment | "">("");
  const [subInputs, setSubInputs] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: filtersData } = useQuery({
    queryKey: ["filters"],
    queryFn: getFilters,
  });

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
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !department) return;
    createMutation.mutate({ name, department, subcategories: [] });
  };

  const categories = data?.data ?? [];

  return (
    <div className="p-6 md:p-10">
      <h1 className="mb-8 font-serif text-3xl text-black">Categories</h1>

      <form
        onSubmit={handleCreate}
        className="mb-8 flex flex-col gap-4 rounded-xl border border-beige bg-white p-6 md:flex-row md:items-end"
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
            required
            className="w-full rounded-md border border-beige bg-cream px-3 py-2 text-sm text-black outline-none focus:border-gold"
          />
        </div>

        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-gray">
            Department
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value as ProductDepartment)}
            required
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
        </div>

        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-md bg-gold px-5 py-2.5 text-sm font-medium text-white hover:bg-gold-dark disabled:opacity-50"
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
                onSubmit={(e) => {
                  e.preventDefault();
                  const subName = subInputs[category._id]?.trim();
                  if (!subName) return;
                  addSubMutation.mutate({ category, subName });
                }}
                className="flex gap-2"
              >
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
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
