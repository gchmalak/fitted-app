"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

import { getProduct, getProducts } from "@/services/product.service";
import {
  addToWishlist as addWishlist,
  removeFromWishlist as removeWishlist,
} from "@/services/wishlist.service";

import { addToCart } from "@/store/cartSlice";
import { openCart } from "@/store/uiSlice";
import { setWishlist } from "@/store/wishlistSlice";
import { RootState, AppDispatch } from "@/store/store";

import ProductCard from "@/components/ProductCard";

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const dispatch = useDispatch<AppDispatch>();

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const toggleAccordion = (section: string) => {
    setOpenAccordion((prev) => (prev === section ? null : section));
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getProduct(id),
  });

  const product = data?.data;

  const { data: similarProductsData } = useQuery({
    queryKey: ["products", "similar", product?.department, id],
    queryFn: () =>
      getProducts({
        department: product!.department,
        limit: 4,
        page: 1,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
    enabled: !!product,
  });

  if (isLoading) {
    return (
      <section className="min-h-screen bg-cream px-6 py-32">
        {" "}
        <p className="text-center text-gray">Loading product...</p>{" "}
      </section>
    );
  }

  if (isError || !product) {
    return (
      <section className="min-h-screen bg-cream px-6 py-32">
        {" "}
        <p className="text-center text-gray">Product not found.</p>{" "}
      </section>
    );
  }

  const similarProducts =
    similarProductsData?.data.filter((item) => item._id !== product._id) ?? [];

  const selectedVariant = product.variants[selectedVariantIndex];
  const inStock = selectedVariant ? selectedVariant.stock > 0 : false;

  const isInWishlist = wishlistItems.some((item) => item._id === product._id);

  const sizes = [
    ...new Set(product.variants.map((v) => v.size).filter(Boolean)),
  ];

  const colors = [
    ...new Set(product.variants.map((v) => v.color).filter(Boolean)),
  ];

  const shades = [
    ...new Set(product.variants.map((v) => v.shade).filter(Boolean)),
  ];

  const handleWishlistToggle = async () => {
    if (!currentUser || isWishlistLoading) return;

    try {
      setIsWishlistLoading(true);

      if (isInWishlist) {
        const response = await removeWishlist(product._id);

        dispatch(setWishlist(response.data));
      } else {
        const response = await addWishlist(product._id);

        dispatch(setWishlist(response.data));
      }
    } catch (error) {
      console.error("Wishlist update failed:", error);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant || !inStock) return;

    dispatch(
      addToCart({
        productId: product._id,
        variantId: selectedVariant._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity,
      }),
    );

    dispatch(openCart());

    setJustAdded(true);

    setTimeout(() => {
      setJustAdded(false);
    }, 2000);
  };

  return (
    <section className="min-h-screen bg-cream px-6 py-10 md:px-10 lg:px-16">
      {" "}
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}{" "}
        <nav className="mt-5 mb-8 flex flex-wrap items-center gap-2 text-sm text-gray">
          <button
            onClick={() => router.back()}
            className="text-gold-dark transition-colors hover:text-gold"
          >
            Back{" "}
          </button>
          ```
          <span>/</span>
          <Link
            href={`/products?department=${product.department}`}
            className="transition-colors hover:text-gold-dark"
          >
            {product.department}
          </Link>
          {product.categoryId && (
            <>
              <span>/</span>

              <Link
                href={`/products?department=${product.department}&categoryId=${product.categoryId._id}`}
                className="transition-colors hover:text-gold-dark"
              >
                {product.categoryId.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-black">{product.name}</span>
        </nav>
        {/* Main Product */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-10 lg:grid-cols-2 lg:gap-16">
          {/* ================= IMAGES ================= */}
          <div>
            <div className="group relative aspect-3/4 overflow-hidden rounded-xl border border-beige bg-white shadow-[0_12px_35px_rgba(0,0,0,0.08)] transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                draggable={false}
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                priority
              />
            </div>

            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {product.images.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative h-20 w-20 overflow-hidden rounded-lg border bg-white shadow-sm transition-all duration-300 ${
                      activeImage === idx
                        ? "border-gold shadow-md"
                        : "border-beige opacity-70 hover:-translate-y-0.5 hover:border-gold hover:opacity-100 hover:shadow-md"
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      draggable={false}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ================= PRODUCT INFO ================= */}
          <div className="rounded-xl border border-beige bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.06)] md:p-8 lg:p-10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray">
                {product.brand}
              </p>

              <div className="mt-2 flex items-start justify-between gap-5">
                <h1 className="font-serif text-3xl leading-tight text-black md:text-4xl">
                  {product.name}
                </h1>

                {/* Wishlist */}
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  disabled={!currentUser || isWishlistLoading}
                  aria-label={
                    isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                  }
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border shadow-sm transition-all duration-300 ${
                    isInWishlist
                      ? "border-gold bg-gold text-white shadow-md"
                      : "border-beige bg-cream text-black hover:-translate-y-0.5 hover:border-gold hover:text-gold hover:shadow-md"
                  } ${
                    !currentUser || isWishlistLoading
                      ? "cursor-not-allowed opacity-60"
                      : ""
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 transition-all ${
                      isInWishlist ? "fill-current" : ""
                    }`}
                  />
                </button>
              </div>

              <p className="mt-4 font-serif text-2xl text-gold-dark">
                {product.price} DA
              </p>

              <div className="my-7 h-px bg-beige" />

              <p className="text-sm leading-7 text-gray">
                {product.description}
              </p>

              {/* ================= VARIANTS ================= */}
              {sizes.length > 0 && (
                <div className="mt-7">
                  <p className="mb-3 text-sm font-medium text-black">Size</p>

                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => {
                      const variantIndex = product.variants.findIndex(
                        (v) => v.size === size,
                      );

                      const isSelected = selectedVariant?.size === size;

                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedVariantIndex(variantIndex)}
                          className={`rounded-md border px-4 py-2 text-sm shadow-sm transition-all duration-300 ${
                            isSelected
                              ? "border-gold bg-gold text-white shadow-md"
                              : "border-beige bg-cream text-black hover:-translate-y-0.5 hover:border-gold hover:bg-white hover:shadow-md"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {colors.length > 0 && (
                <div className="mt-5">
                  <p className="mb-3 text-sm font-medium text-black">Color</p>

                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => {
                      const variantIndex = product.variants.findIndex(
                        (v) => v.color === color,
                      );

                      const isSelected = selectedVariant?.color === color;

                      return (
                        <button
                          key={color}
                          onClick={() => setSelectedVariantIndex(variantIndex)}
                          className={`rounded-md border px-4 py-2 text-sm shadow-sm transition-all duration-300 ${
                            isSelected
                              ? "border-gold bg-gold text-white shadow-md"
                              : "border-beige bg-cream text-black hover:-translate-y-0.5 hover:border-gold hover:bg-white hover:shadow-md"
                          }`}
                        >
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {shades.length > 0 && (
                <div className="mt-5">
                  <p className="mb-3 text-sm font-medium text-black">Shade</p>

                  <div className="flex flex-wrap gap-2">
                    {shades.map((shade) => {
                      const variantIndex = product.variants.findIndex(
                        (v) => v.shade === shade,
                      );

                      const isSelected = selectedVariant?.shade === shade;

                      return (
                        <button
                          key={shade}
                          onClick={() => setSelectedVariantIndex(variantIndex)}
                          className={`rounded-md border px-4 py-2 text-sm shadow-sm transition-all duration-300 ${
                            isSelected
                              ? "border-gold bg-gold text-white shadow-md"
                              : "border-beige bg-cream text-black hover:-translate-y-0.5 hover:border-gold hover:bg-white hover:shadow-md"
                          }`}
                        >
                          {shade}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stock */}
              <div
                className={`mt-7 rounded-md border px-4 py-3 text-sm ${
                  inStock
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-600"
                }`}
              >
                {inStock
                  ? `${selectedVariant.stock} available`
                  : "Currently out of stock"}
              </div>

              {/* ================= CART ================= */}
              <div className="mt-4 flex gap-3">
                <div className="flex items-center rounded-md border border-beige bg-cream shadow-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-3 text-lg text-black transition hover:bg-beige"
                  >
                    −
                  </button>

                  <span className="w-8 text-center text-sm text-black">
                    {quantity}
                  </span>

                  <button
                    onClick={() =>
                      setQuantity((q) =>
                        Math.min(selectedVariant?.stock ?? 1, q + 1),
                      )
                    }
                    className="px-4 py-3 text-lg text-black transition hover:bg-beige"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="flex-1 rounded-md bg-gold py-3 text-sm font-medium uppercase tracking-[0.12em] text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-dark hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-md"
                >
                  {justAdded
                    ? "Added ✓"
                    : inStock
                      ? "Add to Basket"
                      : "Out of Stock"}
                </button>
              </div>
            </div>

            {/* ================= TRUST INFO ================= */}
            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-beige pt-7">
              <div className="flex flex-col items-center text-center">
                <Truck className="mb-2 h-5 w-5 text-gold-dark" />
                <span className="text-[10px] uppercase tracking-wide text-gray">
                  Fast Delivery
                </span>
              </div>

              <div className="flex flex-col items-center border-x border-beige text-center">
                <RotateCcw className="mb-2 h-5 w-5 text-gold-dark" />
                <span className="text-[10px] uppercase tracking-wide text-gray">
                  Easy Returns
                </span>
              </div>

              <div className="flex flex-col items-center text-center">
                <ShieldCheck className="mb-2 h-5 w-5 text-gold-dark" />
                <span className="text-[10px] uppercase tracking-wide text-gray">
                  Secure Checkout
                </span>
              </div>
            </div>

            {/* ================= ACCORDIONS ================= */}
            <div className="mt-8 border-t border-beige">
              <div className="border-b border-beige">
                <button
                  onClick={() => toggleAccordion("care")}
                  className="flex w-full items-center justify-between py-5 text-left font-serif text-base text-black"
                >
                  <span>Care</span>

                  {openAccordion === "care" ? (
                    <ChevronUp className="h-4 w-4 text-gray" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray" />
                  )}
                </button>

                {openAccordion === "care" && (
                  <p className="pb-5 text-xs leading-6 text-gray">
                    Wipe clean with a damp cloth. Store in a cool, dry place
                    away from direct sunlight.
                  </p>
                )}
              </div>

              <div className="border-b border-beige">
                <button
                  onClick={() => toggleAccordion("shipping")}
                  className="flex w-full items-center justify-between py-5 text-left font-serif text-base text-black"
                >
                  <span>Shipping &amp; Returns</span>

                  {openAccordion === "shipping" ? (
                    <ChevronUp className="h-4 w-4 text-gray" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray" />
                  )}
                </button>

                {openAccordion === "shipping" && (
                  <p className="pb-5 text-xs leading-6 text-gray">
                    Standard delivery within 2–4 business days. Free returns
                    within 14 days of purchase.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* ================= SIMILAR PRODUCTS ================= */}
        {similarProducts.length > 0 && (
          <div className="mx-auto mt-28 max-w-6xl border-t border-beige pt-16">
            <div className="mb-10 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-gray">
                Complete your look
              </p>

              <h2 className="mt-2 font-serif text-3xl text-black">
                You may also like
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-7">
              {similarProducts.map((similarProduct) => (
                <ProductCard
                  key={similarProduct._id}
                  product={similarProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
