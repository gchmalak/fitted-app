import Link from "next/link";
import { useState } from "react";

const SECTIONS = [
  { label: "Home", href: "#home" },
  { label: "Our Products", href: "#products" },
  { label: "About", href: "#about" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];
const DEPARTMENTS = [
  "Clothing",
  "Shoes",
  "Makeup",
  "Skincare",
  "Jewelry",
  "Perfume",
];

type NavLinksProps = {
  className?: string;
  onLinkClick?: () => void;
};

export default function NavLinks({ className, onLinkClick }: NavLinksProps) {
  const [iSOpen, setIsOpen] = useState(false);
  return (
    <div className={className}>
      <Link
        href="#home"
        onClick={onLinkClick}
        className="text-black hover:text-gold-dark transition-colors"
      >
        Home
      </Link>
      <div
        className="relative"
        onMouseOver={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Link
          href="/products"
          onClick={onLinkClick}
          className="text-black hover:text-gold-dark transition-colors"
        ></Link>
        {iSOpen && (
          <div className="absolute left-0 top-full z-50 mt-20 w-48 rounded-md border border-beige bg-white py-2 shadow-lg">
            {DEPARTMENTS.map((dept) => (
              <Link
                key={dept}
                href={`/products?department=${encodeURIComponent(dept)}`}
                onClick={onLinkClick}
                className="block px-4 py-2 text-sm text-black hover:bg-beige "
              >
                {dept}
              </Link>
            ))}
          </div>
        )}
      </div>
      {SECTIONS.slice(1).map((section) => (
        <Link
          key={section.label}
          href={section.href}
          onClick={onLinkClick}
          className="text-black hover:text-gold-dark transition-colors"
        >
          {section.label}
        </Link>
      ))}
    </div>
  );
}
