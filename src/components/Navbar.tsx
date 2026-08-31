"use client";

import Link from "next/link";
import { useState } from "react";
import NavLinks from "./NavLinks";
import { Menu, User, X } from "lucide-react";
import CartIcon from "./CartIcon";
import MobileMenu from "./MobileMenu";
import { useNavTheme } from "@/hooks/useNavTheme";
import { Playfair_Display } from "next/font/google";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
});

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const navTheme = useNavTheme();
  const currentUser = useSelector((state: RootState) => state.auth.user);
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

  return (
    <div className="fixed top-0 left-0 z-50 w-full bg-transparent">
      <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-4">
        <Link
          href="/"
          className={`${playfair.className} text-2xl font-black tracking-wide transition-colors duration-300 ${textColor} ${hoverColor}`}
        >
          FITTED
        </Link>

        <NavLinks
          className={`hidden md:flex md:gap-8 transition-colors duration-300 ${textColor}`}
        />

        <div
          className={`flex items-center gap-4 transition-colors duration-300 ${textColor}`}
        >
          {/* Account */}
          <div className="relative hidden sm:block">
            <Link
              href={currentUser ? "/account" : "/login"}
              aria-label="Account"
              className={hoverColor}
            >
              {currentUser?.avatarUrl ? (
                <Image
                  src={currentUser.avatarUrl}
                  alt="Profile"
                  width={24}
                  height={24}
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5" />
              )}
            </Link>
          </div>

          <CartIcon />

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

      {mobileMenuOpen && (
        <MobileMenu onLinkClickAction={() => setMobileMenuOpen(false)} />
      )}
    </div>
  );
}
