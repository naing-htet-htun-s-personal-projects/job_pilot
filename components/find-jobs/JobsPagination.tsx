"use client"

interface JobsPaginationProps {
  page: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
}

function buildPageNumbers(current: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: (number | "ellipsis")[] = [1]

  if (current > 3) {
    pages.push("ellipsis")
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(totalPages - 1, current + 1)
  for (let p = start; p <= end; p++) {
    pages.push(p)
  }

  if (current < totalPages - 2) {
    pages.push("ellipsis")
  }

  pages.push(totalPages)
  return pages
}

export function JobsPagination({
  page,
  pageSize,
  totalCount,
  onPageChange,
}: JobsPaginationProps) {
  if (totalCount === 0) return null

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const startItem = (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, totalCount)
  const pageNumbers = buildPageNumbers(page, totalPages)

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-border bg-surface px-6 py-4 sm:flex-row">
      <p className="text-xs text-text-secondary">
        Showing <span className="font-medium text-text-primary">{startItem}</span> to{" "}
        <span className="font-medium text-text-primary">{endItem}</span> of{" "}
        <span className="font-medium text-text-primary">{totalCount}</span> results
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        {pageNumbers.map((item, idx) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${idx}`} className="px-1.5 text-xs text-text-muted">
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className={`min-w-8 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                item === page
                  ? "border-accent/30 bg-accent-light text-accent"
                  : "border-border bg-surface text-text-primary hover:bg-surface-secondary"
              }`}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
