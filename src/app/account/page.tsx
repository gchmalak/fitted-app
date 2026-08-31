"use client";

import Image from "next/image";
import Link from "next/link";
import { User, LogOut, Camera } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  uploadProfilePicture,
  updateProfilePicture,
} from "@/services/auth.service";

import { getWishlist } from "@/services/wishlist.service";

import { RootState, AppDispatch } from "@/store/store";
import { logout, setUser } from "@/store/authSlice";
import { setWishlist, setWishlistLoading } from "@/store/wishlistSlice";

import BreadCrumbs from "@/components/BreadCrumbs";
import ProductCard from "@/components/ProductCard";

export default function AccountPage() {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // ================= WISHLIST =================

  const {
    data: wishlistData,
    isLoading: isWishlistLoading,
    isError: isWishlistError,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    enabled: !!currentUser,
  });

  // Put backend wishlist into Redux
  useEffect(() => {
    if (wishlistData?.data) {
      dispatch(setWishlist(wishlistData.data));
    }
  }, [wishlistData, dispatch]);

  useEffect(() => {
    dispatch(setWishlistLoading(isWishlistLoading));
  }, [isWishlistLoading, dispatch]);

  // ================= LOGOUT =================

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    dispatch(logout());

    router.push("/");
  }

  // ================= PROFILE PICTURE =================

  async function handleProfilePictureChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];

    if (!file || !currentUser) {
      return;
    }

    setUploadError(null);

    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be smaller than 5 MB.");
      return;
    }

    try {
      setIsUploading(true);

      const uploadResponse = await uploadProfilePicture(file);

      const avatarUrl = uploadResponse.data.url;

      const updateResponse = await updateProfilePicture(avatarUrl);

      const updatedUser = updateResponse.data;

      dispatch(setUser(updatedUser));

      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error(error);

      setUploadError(
        "Could not update your profile picture. Please try again.",
      );
    } finally {
      setIsUploading(false);

      e.target.value = "";
    }
  }

  // ================= NOT LOGGED IN =================

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-cream px-6 pb-16 pt-32">
        {" "}
        <div className="mx-auto max-w-5xl">
          <BreadCrumbs items={[{ label: "Account" }]} />
          ```
          <div className="rounded-xl border border-beige bg-white p-8 text-center">
            <h1 className="font-serif text-3xl text-black">
              Welcome to FITTED
            </h1>

            <p className="mt-3 text-gray">
              Please log in to access your account.
            </p>

            <Link
              href="/login"
              className="mt-6 inline-block rounded-md bg-gold px-8 py-3 font-medium text-white transition hover:bg-gold-light"
            >
              Log In
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream px-6 pb-16 pt-32">
      {" "}
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumbs */}
        <BreadCrumbs
          baseHref="/"
          baseLabel="Home"
          items={[{ label: "Account", href: "/account" }]}
        />
        ```
        <h1 className="font-serif text-4xl text-black">My Account</h1>
        <p className="mt-2 text-gray">
          Manage your account, wishlist, and orders.
        </p>
        {/* ================= ACCOUNT INFORMATION ================= */}
        <section className="mt-10 rounded-xl border border-beige bg-white p-8">
          <h2 className="font-serif text-2xl text-black">
            Account Information
          </h2>

          {/* Profile */}
          <div className="mt-6 flex items-center gap-5">
            <div className="relative">
              {currentUser.avatarUrl ? (
                <Image
                  src={currentUser.avatarUrl}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-full border border-beige object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-beige">
                  <User className="h-8 w-8 text-gray" />
                </div>
              )}

              <label
                htmlFor="profile-picture"
                className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-gold text-white transition hover:bg-gold-light"
                title={
                  currentUser.avatarUrl
                    ? "Change profile picture"
                    : "Add profile picture"
                }
              >
                <Camera className="h-3.5 w-3.5" />
              </label>

              <input
                id="profile-picture"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                disabled={isUploading}
                className="hidden"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-black">
                {currentUser.username}
              </h3>

              <p className="mt-1 text-sm text-gray">{currentUser.email}</p>

              <label
                htmlFor="profile-picture"
                className="mt-2 inline-block cursor-pointer text-sm text-gold transition hover:text-gold-dark"
              >
                {isUploading
                  ? "Uploading..."
                  : currentUser.avatarUrl
                    ? "Change profile picture"
                    : "Add profile picture"}
              </label>
            </div>
          </div>

          {uploadError && (
            <p className="mt-4 text-sm text-red-500">{uploadError}</p>
          )}

          <p className="mt-3 text-xs text-gray">
            JPG, PNG or other image • Maximum 5 MB
          </p>

          {/* User information */}
          <div className="mt-8 grid gap-6 border-t border-beige pt-6 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray">
                Username
              </p>

              <p className="mt-1 text-black">{currentUser.username}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-gray">Email</p>

              <p className="mt-1 text-black">{currentUser.email}</p>
            </div>
          </div>

          {/* Password + Logout */}
          <div className="mt-6 flex items-center justify-between border-t border-beige pt-6">
            <Link
              href="/account/change-password"
              className="text-sm text-gold transition hover:text-gold-dark"
            >
              Change password →
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-gray transition hover:text-red-500"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          </div>
        </section>
        {/* ================= WISHLIST ================= */}
        <section className="mt-6 rounded-xl border border-beige bg-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl text-black">My Wishlist</h2>

              <p className="mt-2 text-sm text-gray">Your saved products.</p>
            </div>

            {wishlistItems.length > 0 && (
              <span className="text-sm text-gray">
                {wishlistItems.length}{" "}
                {wishlistItems.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>

          {/* Loading */}
          {isWishlistLoading && (
            <div className="py-12 text-center">
              <p className="text-sm text-gray">Loading your wishlist...</p>
            </div>
          )}

          {/* Error */}
          {isWishlistError && !isWishlistLoading && (
            <div className="py-12 text-center">
              <p className="text-sm text-red-500">
                Could not load your wishlist.
              </p>
            </div>
          )}

          {/* Empty */}
          {!isWishlistLoading &&
            !isWishlistError &&
            wishlistItems.length === 0 && (
              <div className="py-12 text-center">
                <h3 className="font-serif text-xl text-black">
                  Your wishlist is empty
                </h3>

                <p className="mt-2 text-sm text-gray">
                  Save products you love and find them here later.
                </p>

                <Link
                  href="/products"
                  className="mt-6 inline-block rounded-md bg-gold px-6 py-3 text-sm font-medium text-white transition hover:bg-gold-dark"
                >
                  Explore Products
                </Link>
              </div>
            )}

          {/* Wishlist products */}
          {!isWishlistLoading &&
            !isWishlistError &&
            wishlistItems.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
                {wishlistItems.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
        </section>
        {/* ================= ORDERS ================= */}
        <section className="mt-6 rounded-xl border border-beige bg-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl text-black">My Orders</h2>

              <p className="mt-2 text-sm text-gray">
                View your order history and track your purchases.
              </p>
            </div>

            <Link
              href="/orders"
              className="text-sm font-medium text-gold transition hover:text-gold-dark"
            >
              View Orders →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
