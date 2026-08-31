// reusable component so that every dashboard/site page has its own breadcrumbs
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadCrumbsProps {
  items?: BreadcrumbItem[];
  baseHref?: string;
  baseLabel?: string;
}

export default function BreadCrumbs({
  items = [],
  baseHref = "/dashboard",
  baseLabel = "Dashboard",
}: BreadCrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex items-center gap-2 text-sm"
    >
      <Link
        href={baseHref}
        className="text-gray transition-colors hover:text-gold"
      >
        {baseLabel}
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div
            key={`${item.label}-${index}`}
            className="flex items-center gap-2"
          >
            <span className="text-gray">/</span>

            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-gray transition-colors hover:text-gold"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-black">{item.label}</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
