"use client";

import { useRef, useState } from "react";
import RequireAdmin from "@/components/RequireAdmin";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "@/services/product.service";
import { getCategories } from "@/services/category.service";
import { uploadImage } from "@/services/upload.service";
import { useRouter } from "next/navigation";
import { CreateProductRequest, ProductDepartment } from "@/types/product";

type ProductFormValues = CreateProductRequest;

const DRAFT_KEY = "new-product-draft";

function getSavedDraft(): ProductFormValues | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(DRAFT_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function NewProductForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const categories = categoriesData?.data ?? [];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lastFileName, setLastFileName] = useState<string | null>(null);

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      localStorage.removeItem(DRAFT_KEY);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push("/admin/products");
    },
  });

  const defaultValues: ProductFormValues = getSavedDraft() ?? {
    name: "",
    description: "",
    brand: "",
    department: "Clothing",
    categoryId: "",
    subcategory: "",
    price: 0,
    images: [],
    variants: [{ size: "", color: "", shade: "", stock: 0, sku: "" }],
  };

  const form = useForm({
    defaultValues,
    listeners: {
      onChange: ({ formApi }) => {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formApi.state.values));
      },
    },
    onSubmit: async ({ value }) => {
      if (value.images.length === 0) {
        alert("Please upload at least one image.");
        return;
      }
      if (!value.categoryId) {
        alert("Please select a category .");
        return;
      }
      if (value.variants.some((v) => !v.sku.trim())) {
        alert("Every variant needs an sku");
      }
      mutate({
        ...value,
        variants: value.variants.map((v) => ({
          sku: v.sku,
          stock: v.stock,
          size: v.size || undefined,
          color: v.color || undefined,
          shade: v.shade || undefined,
        })),
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="mx-auto flex max-w-xl flex-col gap-5 rounded-2xl border border-beige bg-cream p-8 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-black">Add Product</h1>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem(DRAFT_KEY);
            window.location.reload();
          }}
          className="text-xs text-gray hover:text-red-500"
        >
          Clear draft
        </button>
      </div>

      <form.Field name="name">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-black">Name</label>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Product name"
              required
              className="rounded-md border border-beige bg-white px-4 py-2 text-black placeholder:text-gray focus:border-gold outline-none"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-black">
              Description
            </label>
            <textarea
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Description"
              required
              className="rounded-md border border-beige bg-white px-4 py-2 text-black placeholder:text-gray focus:border-gold outline-none"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="brand">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-black">Brand</label>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Brand"
              required
              className="rounded-md border border-beige bg-white px-4 py-2 text-black placeholder:text-gray focus:border-gold outline-none"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="department">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-black">Department</label>
            <select
              value={field.state.value}
              onChange={(e) => {
                field.handleChange(e.target.value as ProductDepartment);
                form.setFieldValue("categoryId", "");
                form.setFieldValue("subcategory", "");
              }}
              className="rounded-md border border-beige bg-white px-4 py-2 text-black"
            >
              <option value="Clothing">Clothing</option>
              <option value="Shoes">Shoes</option>
              <option value="Makeup">Makeup</option>
              <option value="Skincare">Skincare</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Perfume">Perfume</option>
            </select>
          </div>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => state.values.department}>
        {(department) => {
          const filteredCategories = categories.filter(
            (c) => c.department === department,
          );

          return (
            <form.Field name="categoryId">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-black">
                    Category
                  </label>
                  <select
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      form.setFieldValue("subcategory", "");
                    }}
                    required
                    className="rounded-md border border-beige bg-white px-4 py-2 text-black"
                  >
                    <option value="" disabled>
                      {filteredCategories.length === 0
                        ? "No categories for this department"
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
          const selectedCategory = categories.find((c) => c._id === categoryId);
          const subcategories = selectedCategory?.subcategories ?? [];

          return (
            <form.Field name="subcategory">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-black">
                    Subcategory
                  </label>
                  <select
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={!categoryId}
                    className="rounded-md border border-beige bg-white px-4 py-2 text-black disabled:opacity-50"
                  >
                    <option value="" disabled>
                      {!categoryId
                        ? "Select a category first"
                        : "Select a subcategory(optional)"}
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

      <form.Field name="price">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-black">Price</label>
            <input
              type="number"
              value={field.state.value === 0 ? "" : field.state.value}
              onChange={(e) =>
                field.handleChange(
                  e.target.value === "" ? 0 : Number(e.target.value),
                )
              }
              placeholder="Price"
              required
              className="rounded-md border border-beige bg-white px-4 py-2 text-black placeholder:text-gray focus:border-gold outline-none"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="variants" mode="array">
        {(variantsField) => (
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-black">Variants</label>

            {variantsField.state.value.map((_, index) => (
              <div
                key={index}
                className="rounded-lg border border-beige bg-white p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-medium text-gray">
                    Variant {index + 1}
                  </p>
                  {variantsField.state.value.length > 1 && (
                    <button
                      type="button"
                      onClick={() => variantsField.removeValue(index)}
                      className="text-xs text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <form.Field name={`variants[${index}].size`}>
                    {(field) => (
                      <input
                        value={field.state.value ?? ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Size (e.g. M)"
                        className="rounded-md border border-beige bg-cream px-3 py-2 text-sm text-black"
                      />
                    )}
                  </form.Field>

                  <form.Field name={`variants[${index}].color`}>
                    {(field) => (
                      <input
                        value={field.state.value ?? ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Color"
                        className="rounded-md border border-beige bg-cream px-3 py-2 text-sm text-black"
                      />
                    )}
                  </form.Field>

                  <form.Field name={`variants[${index}].shade`}>
                    {(field) => (
                      <input
                        value={field.state.value ?? ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Shade (makeup)"
                        className="rounded-md border border-beige bg-cream px-3 py-2 text-sm text-black"
                      />
                    )}
                  </form.Field>

                  <form.Field name={`variants[${index}].sku`}>
                    {(field) => (
                      <input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="SKU"
                        required
                        className="rounded-md border border-beige bg-cream px-3 py-2 text-sm text-black"
                      />
                    )}
                  </form.Field>

                  <form.Field name={`variants[${index}].stock`}>
                    {(field) => (
                      <input
                        type="number"
                        value={field.state.value === 0 ? "" : field.state.value}
                        onChange={(e) =>
                          field.handleChange(
                            e.target.value === "" ? 0 : Number(e.target.value),
                          )
                        }
                        placeholder="Stock"
                        required
                        className="rounded-md border border-beige bg-cream px-3 py-2 text-sm text-black"
                      />
                    )}
                  </form.Field>
                </div>
              </div>
            ))}

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
              className="self-start rounded-md border border-gold px-4 py-2 text-sm text-gold-dark hover:bg-beige"
            >
              + Add Variant
            </button>
          </div>
        )}
      </form.Field>

      <form.Field name="images">
        {(field) => (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black">
              Product Image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setLastFileName(file.name);
                try {
                  setIsUploading(true);
                  const res = await uploadImage(file);
                  field.handleChange([...field.state.value, res.data.url]);
                } catch (err) {
                  alert("Failed to upload image to Cloudinary.");
                } finally {
                  setIsUploading(false);
                }
              }}
              className="hidden"
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="rounded-md border border-gold px-4 py-2 text-sm font-medium text-gold-dark hover:bg-beige disabled:opacity-50"
              >
                Choose image
              </button>
              <span className="max-w-55 truncate text-sm text-gray">
                {lastFileName ?? "No file chosen"}
              </span>
            </div>
            {isUploading && (
              <p className="text-xs text-gold">Uploading to Cloudinary...</p>
            )}

            {field.state.value.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {field.state.value.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative h-16 w-16 overflow-hidden rounded-md border border-beige"
                  >
                    <img
                      src={url}
                      alt={`Upload ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </form.Field>

      {isError && <p className="text-sm text-gold">{error.message}</p>}

      <button
        type="submit"
        disabled={isPending || isUploading}
        className="rounded-md bg-gold px-6 py-3 font-medium text-white hover:bg-gold-dark disabled:opacity-60"
      >
        {isPending ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
}

export default function NewProductPage() {
  return (
    <RequireAdmin>
      <NewProductForm />
    </RequireAdmin>
  );
}
