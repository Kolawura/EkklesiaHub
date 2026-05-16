import { cn } from "./utils";

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1.5 pt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 font-body text-sm text-ink-faint border border-parchment-dark rounded-lg hover:bg-parchment-deep disabled:opacity-40 transition-colors"
      >
        ←
      </button>
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        const p =
          totalPages <= 5
            ? i + 1
            : page <= 3
              ? i + 1
              : page >= totalPages - 2
                ? totalPages - 4 + i
                : page - 2 + i;
        return (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              "w-8 h-8 font-body text-sm rounded-lg transition-colors",
              p === page
                ? "bg-ink text-parchment font-medium"
                : "text-ink-faint border border-parchment-dark hover:bg-parchment-deep",
            )}
          >
            {p}
          </button>
        );
      })}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1.5 font-body text-sm text-ink-faint border border-parchment-dark rounded-lg hover:bg-parchment-deep disabled:opacity-40 transition-colors"
      >
        →
      </button>
    </div>
  );
}
