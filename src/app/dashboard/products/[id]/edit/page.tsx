"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useState, useEffect, useRef } from "react";
import { getProduct, updateProduct } from "@/services/product.service";
import { getCategories } from "@/services/category.service";
import { uploadImage } from "@/services/upload.service";
import {
  CreateProductRequest,
  UpdateProductRequest,
  Product,
} from "@/types/product";
import { Category } from "@/types/category";
import { DEFAULT_PRODUCT_TEXTS } from "@/constants/TextDefaults";
import BreadCrumbs from "@/components/BreadCrumbs";

function getEditDraft(productId: string): CreateProductRequest | null {
  if (typeof window === "undefined") return null;

  try {
    const saved = sessionStorage.getItem(`edit-product-draft-${productId}`);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function EditProductForm() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const draftKey = `edit-product-draft-${id}`;
  const currentPathRef = useRef(pathname);

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    currentPathRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (window.location.pathname !== currentPathRef.current) {
        sessionStorage.removeItem(draftKey);
      }
    };
  }, [draftKey]);

  const { data, isLoading, isError } = useQuery<{ data: Product }>({
    queryKey: ["products", id],
    queryFn: () => getProduct(id),
  });

  const { data: categoriesData } = useQuery<{ data: Category[] }>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categories = categoriesData?.data ?? [];

  const {
    mutate,
    isPending,
    error,
    isError: isMutationError,
  } = useMutation({
    mutationFn: (values: UpdateProductRequest) => updateProduct(id, values),

    onSuccess: () => {
      sessionStorage.removeItem(draftKey);

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      router.push("/dashboard/products");
    },
  });

  const product = data?.data;

  const defaultValues: CreateProductRequest = {
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
        sessionStorage.setItem(draftKey, JSON.stringify(formApi.state.values));
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

  useEffect(() => {
    if (!product) return;

    const draft = getEditDraft(id);

    const source = draft ?? {
      name: product.name,
      description: product.description,
      brand: product.brand,
      department: product.department,
      categoryId:
        typeof product.categoryId === "object"
          ? (product.categoryId?._id ?? "")
          : (product.categoryId ?? ""),
      subcategory: product.subcategory ?? "",
      price: product.price,
      images: product.images,
      care: product.care ?? DEFAULT_PRODUCT_TEXTS.care,
      shipping: product.shipping ?? DEFAULT_PRODUCT_TEXTS.shipping,

      variants:
        product.variants.length > 0
          ? product.variants.map((v) => ({
              size: v.size ?? "",
              color: v.color ?? "",
              shade: v.shade ?? "",
              stock: v.stock,
              sku: v.sku,
            }))
          : [
              {
                size: "",
                color: "",
                shade: "",
                stock: 0,
                sku: "",
              },
            ],
    };

    form.setFieldValue("name", source.name);
    form.setFieldValue("description", source.description);
    form.setFieldValue("care", source.care ?? DEFAULT_PRODUCT_TEXTS.care);
    form.setFieldValue(
      "shipping",
      source.shipping ?? DEFAULT_PRODUCT_TEXTS.shipping,
    );
    form.setFieldValue("brand", source.brand);
    form.setFieldValue("department", source.department);
    form.setFieldValue("categoryId", source.categoryId);
    form.setFieldValue("subcategory", source.subcategory);
    form.setFieldValue("price", source.price);
    form.setFieldValue("images", source.images);
    form.setFieldValue("variants", source.variants);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  if (isLoading) {
    return <p className="p-16 text-center text-black">Loading product...</p>;
  }

  if (isError || !product) {
    return <p className="p-16 text-center text-black">Product not found.</p>;
  }

  return (
    <div className="mt-4">
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
          {
            label: " Edit Product",
          },
        ]}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="mx-auto flex max-w-xl flex-col gap-5 rounded-2xl border border-beige bg-white p-8 shadow-sm"
      >
        <h1 className="font-serif text-3xl text-black">Edit Product</h1>

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
                <option value="Clothing">Clothing</option>
                <option value="Makeup">Makeup</option>
                <option value="Skincare">Skincare</option>
                <option value="Accessories">Accessories</option>
                <option value="Perfume">Perfume</option>
              </select>
            </div>
          )}
        </form.Field>

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

            return (
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

        {isMutationError && (
          <p className="text-sm text-gold-dark">{error.message}</p>
        )}

        <button
          type="submit"
          disabled={isPending || isUploading}
          className="rounded-md bg-gold px-6 py-3 font-medium text-white hover:bg-gold-dark disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default function EditProductPage() {
  return <EditProductForm />;
}
