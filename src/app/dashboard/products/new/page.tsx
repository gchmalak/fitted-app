"use client";

import { useRouter, usePathname } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useState, useEffect, useRef } from "react";
import { createProduct } from "@/services/product.service";
import { getCategories } from "@/services/category.service";
import { uploadImage } from "@/services/upload.service";
import { CreateProductRequest } from "@/types/product";
import { Category } from "@/types/category";
import { DEFAULT_PRODUCT_TEXTS } from "@/constants/TextDefaults";
import BreadCrumbs from "@/components/BreadCrumbs";

const DRAFT_KEY = "add-product-draft";

function getInitialDraft(): CreateProductRequest | null {
  if (typeof window === "undefined") return null;

  try {
    const saved = sessionStorage.getItem(DRAFT_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export default function NewProductForm() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const currentPathRef = useRef(pathname);
  const [isUploading, setIsUploading] = useState(false);
  // useEffect____________________________________________________________________________________________
  useEffect(() => {
    currentPathRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (window.location.pathname !== currentPathRef.current) {
        sessionStorage.removeItem(DRAFT_KEY); //sessionStorage: so that when loading the form info doesnt get deleted but when leaving the page it does
      }
    };
  }, []);
  // useQuery___________________________________________________________________________________________
  const { data: categoriesData } = useQuery<{ data: Category[] }>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categories = categoriesData?.data ?? [];
  // useMutation_________________________________________________________________________________________
  const {
    mutate,
    isPending,
    error,
    isError: isMutationError,
  } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      sessionStorage.removeItem(DRAFT_KEY);

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      router.push("/dashboard/products");
    },
  });

  const draft = getInitialDraft();
  // default values__________________________________________________________________________________
  const defaultValues: CreateProductRequest = draft ?? {
    name: "",
    description: "",
    brand: "",
    department: "Clothing",
    categoryId: "",
    subcategory: "",
    price: 0,
    images: [],
    care: DEFAULT_PRODUCT_TEXTS.care,
    shipping: DEFAULT_PRODUCT_TEXTS.shipping,
    variants: [
      {
        size: "",
        color: "",
        shade: "",
        stock: 0,
        sku: "",
      },
    ],
  };

  // Type inferred directly from defaultValues
  const form = useForm({
    defaultValues,

    listeners: {
      onChange: ({ formApi }) => {
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(formApi.state.values));
      },
    },

    onSubmit: async ({ value }) => {
      if (value.images.length === 0) {
        alert("Please upload at least one image.");
        return;
      }

      if (!value.categoryId) {
        alert("Please select a category.");
        return;
      }

      if (value.variants.some((v) => !v.sku.trim())) {
        alert("Every variant needs an SKU.");
        return;
      }
      // cleaned variants_____________________________________________________________________________
      const cleanedVariants = value.variants.map((v) => ({
        ...v,
        size: v.size || undefined,
        color: v.color || undefined,
        shade: v.shade || undefined,
      }));

      mutate({
        ...value,
        variants: cleanedVariants,
      });
    },
  });

  return (
    <div className="mt-4">
      {/* Bread crumbs */}
      <BreadCrumbs
        items={[
          {
            label: "Products",
            href: "/dashboard/products",
          },

          {
            label: " Add Product",
          },
        ]}
      />
      {/* form */}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="mx-auto flex max-w-xl flex-col gap-5 rounded-2xl border border-beige bg-white p-8 shadow-sm"
      >
        {/* heading */}
        <h1 className="font-serif text-3xl text-black">Add New Product</h1>
        {/* name  field */}
        <form.Field name="name">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray">
                Product Name
              </label>

              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                required
                className="rounded-md border border-beige bg-cream px-4 py-2 text-black outline-none focus:border-gold"
              />
            </div>
          )}
        </form.Field>
        {/* Description field */}
        <form.Field name="description">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray">
                Description
              </label>

              <textarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                required
                className="rounded-md border border-beige bg-cream px-4 py-2 text-black outline-none focus:border-gold"
              />
            </div>
          )}
        </form.Field>
        {/* Care field */}
        <form.Field name="care">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray">
                Care Instructions
              </label>

              <textarea
                rows={3}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                className="rounded-md border border-beige bg-cream px-4 py-2 text-black outline-none focus:border-gold"
              />
            </div>
          )}
        </form.Field>
        {/* shipping field */}
        <form.Field name="shipping">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray">
                Shipping & Returns
              </label>

              <textarea
                rows={3}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                className="rounded-md border border-beige bg-cream px-4 py-2 text-black outline-none focus:border-gold"
              />
            </div>
          )}
        </form.Field>
        {/* Brand field */}
        <form.Field name="brand">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray">Brand</label>

              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                required
                className="rounded-md border border-beige bg-cream px-4 py-2 text-black outline-none focus:border-gold"
              />
            </div>
          )}
        </form.Field>
        {/* Department field */}
        <form.Field name="department">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray">
                Department
              </label>

              <select
                value={field.state.value}
                onChange={(e) => {
                  field.handleChange(
                    e.target.value as CreateProductRequest["department"],
                  );

                  form.setFieldValue("categoryId", "");
                  form.setFieldValue("subcategory", "");
                }}
                className="rounded-md border border-beige bg-cream px-4 py-2 text-black outline-none focus:border-gold"
              >
                {/* departments drop down */}
                <option value="Clothing">Clothing</option>
                <option value="Makeup">Makeup</option>
                <option value="Skincare">Skincare</option>
                <option value="Accessories">Accessories</option>
                <option value="Perfume">Perfume</option>
              </select>
            </div>
          )}
        </form.Field>
        {/* subscribe */}
        <form.Subscribe selector={(state) => state.values.department}>
          {(department) => {
            const filteredCategories = categories.filter((c) => {
              if (!c.department || !department) return false;
              return (
                c.department.trim().toLowerCase() ===
                department.trim().toLowerCase()
              );
            });

            return (
              //category field
              <form.Field name="categoryId">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray">
                      Category
                    </label>

                    <select
                      value={field.state.value}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        form.setFieldValue("subcategory", "");
                      }}
                      required
                      className="rounded-md border border-beige bg-cream px-4 py-2 text-black outline-none focus:border-gold"
                    >
                      <option value="" disabled>
                        {filteredCategories.length === 0
                          ? "No categories for this department — add one first"
                          : "Select a category"}
                      </option>

                      {filteredCategories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </form.Field>
            );
          }}
        </form.Subscribe>

        <form.Subscribe selector={(state) => state.values.categoryId}>
          {(categoryId) => {
            const selectedCategory = categories.find(
              (c) => c._id === categoryId,
            );
            const subcategories = selectedCategory?.subcategories ?? [];
            //subcategory,variants,price form:
            return (
              // subcategory field
              <form.Field name="subcategory">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray">
                      Subcategory (optional)
                    </label>

                    <select
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={!categoryId}
                      className="rounded-md border border-beige bg-cream px-4 py-2 text-black outline-none focus:border-gold disabled:opacity-50"
                    >
                      <option value="">
                        {!categoryId ? "Select a category first" : "None"}
                      </option>

                      {subcategories.map((sub) => (
                        <option key={sub._id} value={sub.name}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </form.Field>
            );
          }}
        </form.Subscribe>
        {/* price field */}
        <form.Field name="price">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray">
                Price (DA)
              </label>

              <input
                type="number"
                value={field.state.value === 0 ? "" : field.state.value}
                onChange={(e) =>
                  field.handleChange(
                    e.target.value === "" ? 0 : Number(e.target.value),
                  )
                }
                required
                className="rounded-md border border-beige bg-cream px-4 py-2 text-black outline-none focus:border-gold"
              />
            </div>
          )}
        </form.Field>
        {/* images field */}
        <form.Field name="images">
          {(field) => (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray">
                Product Images
              </label>

              <input
                type="file"
                accept="image/*"
                multiple
                disabled={isUploading}
                onChange={async (e) => {
                  const files = e.target.files;

                  if (!files || files.length === 0) return;

                  try {
                    setIsUploading(true);

                    const uploadedUrls: string[] = [];

                    for (const file of Array.from(files)) {
                      const res = await uploadImage(file);
                      uploadedUrls.push(res.data.url);
                    }

                    field.handleChange([...field.state.value, ...uploadedUrls]);
                  } catch {
                    alert("Failed to upload image.");
                  } finally {
                    setIsUploading(false);
                    e.target.value = "";
                  }
                }}
                className="rounded-md border border-beige bg-cream px-4 py-2 text-sm text-gray"
              />
              {/* uploading message */}
              {isUploading && <p className="text-xs text-gold">Uploading...</p>}

              {field.state.value.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {field.state.value.map((url, idx) => (
                    <div
                      key={idx}
                      className="group relative h-16 w-16 overflow-hidden rounded-md border border-beige"
                    >
                      <img
                        src={url}
                        alt={`Upload ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          field.handleChange(
                            field.state.value.filter((_, i) => i !== idx),
                          )
                        }
                        className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </form.Field>
        {/* variants field */}
        <form.Field name="variants" mode="array">
          {(variantsField) => (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray">
                  Variants (Size / Color / Shade / Stock)
                </label>

                <button
                  type="button"
                  onClick={() =>
                    variantsField.pushValue({
                      size: "",
                      color: "",
                      shade: "",
                      stock: 0,
                      sku: "",
                    })
                  }
                  className="text-xs uppercase tracking-wide text-gold-dark hover:text-gold"
                >
                  + Add Variant
                </button>
              </div>

              {variantsField.state.value.map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-2 rounded-md border border-beige bg-cream p-4 sm:grid-cols-5"
                >
                  <form.Field name={`variants[${index}].size`}>
                    {(f) => (
                      <input
                        value={f.state.value ?? ""}
                        onChange={(e) => f.handleChange(e.target.value)}
                        placeholder="Size"
                        className="rounded-md border border-beige bg-white px-3 py-2 text-sm text-black outline-none focus:border-gold"
                      />
                    )}
                  </form.Field>
                  {/* variants:color */}
                  <form.Field name={`variants[${index}].color`}>
                    {(f) => (
                      <input
                        value={f.state.value ?? ""}
                        onChange={(e) => f.handleChange(e.target.value)}
                        placeholder="Color"
                        className="rounded-md border border-beige bg-white px-3 py-2 text-sm text-black outline-none focus:border-gold"
                      />
                    )}
                  </form.Field>
                  {/* variants:shade */}
                  <form.Field name={`variants[${index}].shade`}>
                    {(f) => (
                      <input
                        value={f.state.value ?? ""}
                        onChange={(e) => f.handleChange(e.target.value)}
                        placeholder="Shade"
                        className="rounded-md border border-beige bg-white px-3 py-2 text-sm text-black outline-none focus:border-gold"
                      />
                    )}
                  </form.Field>
                  {/* variants:stock */}
                  <form.Field name={`variants[${index}].stock`}>
                    {(f) => (
                      <input
                        type="number"
                        value={f.state.value === 0 ? "" : f.state.value}
                        onChange={(e) =>
                          f.handleChange(
                            e.target.value === "" ? 0 : Number(e.target.value),
                          )
                        }
                        placeholder="Stock"
                        required
                        className="rounded-md border border-beige bg-white px-3 py-2 text-sm text-black outline-none focus:border-gold"
                      />
                    )}
                  </form.Field>
                  {/* variants :sku */}
                  <div className="flex gap-2">
                    <form.Field name={`variants[${index}].sku`}>
                      {(f) => (
                        <input
                          value={f.state.value}
                          onChange={(e) => f.handleChange(e.target.value)}
                          placeholder="SKU"
                          required
                          className="w-full rounded-md border border-beige bg-white px-3 py-2 text-sm text-black outline-none focus:border-gold"
                        />
                      )}
                    </form.Field>

                    {variantsField.state.value.length > 1 && (
                      <button
                        type="button"
                        onClick={() => variantsField.removeValue(index)}
                        className="text-gold-dark hover:text-gold"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </form.Field>
        {/* error message */}
        {isMutationError && (
          <p className="text-sm text-gold-dark">{error.message}</p>
        )}
        {/* submit button */}
        <button
          type="submit"
          disabled={isPending || isUploading}
          className="rounded-md bg-gold px-6 py-3 font-medium text-white hover:bg-gold-dark disabled:opacity-60"
        >
          {isPending ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
