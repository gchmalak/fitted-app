"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount?: number;
  limit?: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: Math.max(totalPages, 1) }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];

  pages.push(1);

  if (currentPage > 4) {
    pages.push("...");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page++) {
    pages.push(page);
  }

  if (currentPage < totalPages - 3) {
    pages.push("...");
  }

  pages.push(totalPages);

  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalCount,
  limit,
  onPageChange,
}: PaginationProps) {
  // Always show pagination when there are products.
  // If there is only one page, show page 1 with disabled arrows.
  if (totalCount !== undefined && totalCount === 0) {
    return null;
  }

  const safeTotalPages = Math.max(totalPages, 1);

  const pageNumbers = getPageNumbers(currentPage, safeTotalPages);

  const firstItem =
    totalCount !== undefined && totalCount > 0
      ? (currentPage - 1) * (limit ?? 0) + 1
      : undefined;

  const lastItem =
    totalCount !== undefined && totalCount > 0
      ? Math.min(currentPage * (limit ?? 0), totalCount)
      : undefined;

  return (
    <div className="mt-8 flex flex-col gap-4 border-t border-beige pt-6 sm:flex-row sm:items-center sm:justify-between">
      {totalCount !== undefined && firstItem && lastItem ? (
        <p className="text-sm text-gray">
          Showing{" "}
          <span className="font-medium text-black">
            {firstItem}-{lastItem}
          </span>{" "}
          of <span className="font-medium text-black">{totalCount}</span>{" "}
          products
        </p>
      ) : (
        <div />
      )}

      <div className="flex items-center justify-center gap-1.5">
        {/* Previous */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-md border border-beige bg-white px-3 py-2 text-sm text-gray transition hover:border-gold hover:text-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          ←
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2 text-sm text-gray">
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`min-w-9 rounded-md border px-3 py-2 text-sm transition ${
                page === currentPage
                  ? "border-gold bg-gold text-white"
                  : "border-beige bg-white text-gray hover:border-gold hover:text-gold-dark"
              }`}
            >
              {page}
            </button>
          ),
        )}

        {/* Next */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === safeTotalPages}
          className="rounded-md border border-beige bg-white px-3 py-2 text-sm text-gray transition hover:border-gold hover:text-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          →
        </button>
      </div>
    </div>
  );
}
