"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 4) pages.push("…");
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (page < totalPages - 3) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-10" aria-label="Pagination">
      <PageBtn
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </PageBtn>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400 select-none">
            …
          </span>
        ) : (
          <PageBtn
            key={p}
            onClick={() => onPageChange(p as number)}
            active={p === page}
          >
            {p}
          </PageBtn>
        )
      )}

      <PageBtn
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </PageBtn>
    </nav>
  );
}

function PageBtn({
  children,
  onClick,
  disabled,
  active,
  ...rest
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  [key: string]: any;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-colors
        ${active
          ? "bg-blue-600 text-white"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}
        disabled:opacity-40 disabled:cursor-not-allowed`}
      {...rest}
    >
      {children}
    </button>
  );
}
