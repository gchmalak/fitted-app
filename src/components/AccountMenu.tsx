"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User, LogOut } from "lucide-react";
import { getCurrentUser, logout } from "@/services/auth.service";

export default function AccountMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
  });

  const user = data?.data;

  function handleLogout() {
    logout();

    queryClient.removeQueries({
      queryKey: ["currentUser"],
    });

    setIsOpen(false);
    window.location.href = "/login";
  }

  return (
    <div className="relative hidden sm:block">
      <button
        aria-label="Account"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center"
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.username}
            className="h-6 w-6 rounded-full object-cover"
          />
        ) : (
          <User className="h-5 w-5" />
        )}
      </button>

      <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-gold text-[8px] text-gold">
        •
      </span>

      {isOpen && (
        <div className="absolute right-0 top-8 w-48 rounded-lg border border-beige bg-white p-2 shadow-lg">
          {user ? (
            <>
              <div className="flex items-center gap-3 border-b border-beige px-3 py-3">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-beige">
                    <User className="h-4 w-4 text-gray" />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-black">
                    {user.username}
                  </p>
                  <p className="truncate text-xs text-gray">{user.email}</p>
                </div>
              </div>

              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-gray hover:bg-beige hover:text-black"
              >
                My Profile
              </Link>

              <Link
                href="/orders"
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-gray hover:bg-beige hover:text-black"
              >
                My Orders
              </Link>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray hover:bg-beige hover:text-black"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-gray hover:bg-beige hover:text-black"
              >
                Log in
              </Link>

              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-gray hover:bg-beige hover:text-black"
              >
                Register
              </Link>

              <Link
                href="/forgot-password"
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-gray hover:bg-beige hover:text-black"
              >
                Forgot password
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
