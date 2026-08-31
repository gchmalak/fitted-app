"use client";

import Link from "next/link";

const SECTIONS = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Clothing", href: "/#clothing" },
  { label: "Care Essentials", href: "/#care-essentials" },
  { label: "Accessories", href: "/#accessories" },
  { label: "My Orders", href: "/orders" },
  { label: "Contact", href: "/contact" },
];

type NavLinksProps = {
  className?: string;
  onLinkClickAction?: () => void;
};

export default function NavLinks({
  className,
  onLinkClickAction,
}: NavLinksProps) {
  return (
    <div className={className}>
      {SECTIONS.map((section) => (
        <Link
          key={section.label}
          href={section.href}
          onClick={onLinkClickAction}
          className="whitespace-nowrap text-sm text-current transition-colors hover:text-gold-dark"
        >
          {section.label}
        </Link>
      ))}
    </div>
  );
}
