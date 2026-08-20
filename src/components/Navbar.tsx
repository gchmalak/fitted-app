"use client"; //runs on the browser

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NavLinks from "./NavLinks";
import { Menu, Search, User, X } from "lucide-react";
import CartIcon from "./CartIcon";
import MobileMenu from "./MobileMenu";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"], // bold and black weights
});
export default function Navbar() {
  const [showNavbar, setShowNavbar] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    // on pages without the hero always show navbar
    if (!hero) {
      setShowNavbar(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowNavbar(!entry.isIntersecting);
      },
      {
        threshold: 0.1,
      },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      className={`fixed top-0 left-0 z-50 w-full border-b border-beige bg-cream transition-all duration-300  ${
        showNavbar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      {/* // z: so that the sections dont render on top of the navbar after it */}

      <div className="absolute top-0 left-0 z-50 w-full bg-transparent">
        <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-4">
          {/* logo */}
          <Link
            href="#home"
            className={` ${playfair.className} text-2xl font-black tracking-wide text-black hover:text-gold`}
          >
            {" "}
            FITTED
          </Link>
          {/* desktop navlinks */}
          {/* hidden so it is hidden in mobile,
      and visible from md and up */}
          <NavLinks className="hidden md:flex md:gap-8"></NavLinks>
          {/* icons */}
          <div className="flex items-center gap-4">
            {/* button with search icon */}
            <button aria-label="Search" className="text-black hover:text-gold">
              <Search className="w-5 h-5" />
            </button>
            {/* account icon hidden for smaller screens */}
            <div className="relative hidden sm:block">
              <Link
                href="/login"
                aria-label="Account"
                className=" text-black hover:text-gold "
              >
                <User className="w-5 h-5" />
              </Link>
              <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-gold text-[8px] text-gold">
                •
              </span>
            </div>
            {/* the cart icon is a component  */}
            <CartIcon />
            <button
              aria-label="Toggle menu"
              className="md:hidden text-black"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        {/* if mobileMenuOpen is false the whole thing is false and it renders nothing,
    if its true js needs to check the right side too . 
    then onLinkClick=>set......: if it were wrong it immediatly calls set...(false)  */}
        {mobileMenuOpen && (
          <MobileMenu onLinkClick={() => setMobileMenuOpen(false)} />
        )}
      </div>
    </div>
  );
}
