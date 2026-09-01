"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, User, X, ChevronDown, LogOut } from "lucide-react";
import { useNavTheme } from "@/hooks/useNavTheme";
import { Playfair_Display } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { logout } from "@/store/authSlice";
import NavLinks from "@/components/NavLinks";
import CartIcon from "@/components/CartIcon";
import MobileMenu from "@/components/MobileMenu";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
});

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const currentUser = useSelector((state: RootState) => state.auth.user);

  const navTheme = useNavTheme();

  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Hide Navbar completely on dashboard routes
  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  const isHomePage = pathname === "/";

  const textColor = isHomePage
    ? navTheme === "dark"
      ? "text-white"
      : "text-black"
    : "text-black";

  const hoverColor = "hover:text-gold";

  const isAdmin =
    currentUser?.role === "admin" || currentUser?.role === "owner";

  // Close account dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setAccountMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    dispatch(logout());

    setAccountMenuOpen(false);

    router.push("/");
  }

  return (
    <div className="fixed left-0 top-0 z-50 w-full bg-transparent">
      <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-4">
        {/* Logo */}
        <Link
          href="/"
          className={`${playfair.className} text-2xl font-black tracking-wide transition-colors duration-300 ${textColor} ${hoverColor}`}
        >
          FITTED
        </Link>

        {/* Desktop Navigation */}
        <NavLinks
          className={`hidden md:flex md:gap-8 transition-colors duration-300 ${textColor}`}
        />

        {/* Right side */}
        <div
          className={`flex items-center gap-4 transition-colors duration-300 ${textColor}`}
        >
          {/* Account */}
          <div ref={accountMenuRef} className="relative hidden sm:block">
            {currentUser ? (
              <>
                {/* Account button */}
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen((prev) => !prev)}
                  aria-label="Account menu"
                  aria-expanded={accountMenuOpen}
                  className={`flex items-center gap-1 ${hoverColor}`}
                >
                  {currentUser.avatarUrl ? (
                    <Image
                      src={currentUser.avatarUrl}
                      alt="Profile"
                      width={28}
                      height={28}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}

                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      accountMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Account dropdown */}
                {accountMenuOpen && (
                  <div className="absolute right-0 top-10 w-52 overflow-hidden rounded-lg border border-beige bg-white shadow-lg">
                    {/* User information */}
                    <div className="border-b border-beige px-4 py-3">
                      <p className="text-sm font-medium text-black">
                        {currentUser.username}
                      </p>

                      <p className="mt-1 truncate text-xs text-gray">
                        {currentUser.email}
                      </p>
                    </div>

                    {/* My Account */}
                    <Link
                      href="/account"
                      onClick={() => setAccountMenuOpen(false)}
                      className="block px-4 py-3 text-sm text-black transition hover:bg-cream hover:text-gold-dark"
                    >
                      My Account
                    </Link>

                    {/* My Orders */}
                    <Link
                      href="/orders"
                      onClick={() => setAccountMenuOpen(false)}
                      className="block px-4 py-3 text-sm text-black transition hover:bg-cream hover:text-gold-dark"
                    >
                      My Orders
                    </Link>

                    {/* Dashboard - Admin / Owner only */}
                    {isAdmin && (
                      <Link
                        href="/dashboard"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block border-t border-beige px-4 py-3 text-sm font-medium text-black transition hover:bg-cream hover:text-gold-dark"
                      >
                        Dashboard
                      </Link>
                    )}

                    {/* Logout */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 border-t border-beige px-4 py-3 text-left text-sm text-gray transition hover:bg-cream hover:text-red-500"
                    >
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Guest */
              <Link href="/login" aria-label="Account" className={hoverColor}>
                <User className="h-5 w-5" />
              </Link>
            )}
          </div>

          {/* Cart */}
          <CartIcon />

          {/* Mobile menu button */}
          <button
            aria-label="Toggle menu"
            className="md:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <MobileMenu onLinkClickAction={() => setMobileMenuOpen(false)} />
      )}
    </div>
  );
}
