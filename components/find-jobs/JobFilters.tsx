"use client"

import { Search } from "lucide-react"

export type MatchFilter = "all" | "high" | "low"
export type SortOption = "match_score" | "newest" | "oldest"

interface JobFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  matchFilter: MatchFilter
  onMatchFilterChange: (value: MatchFilter) => void
  sortOption: SortOption
  onSortOptionChange: (value: SortOption) => void
}

export function JobFilters({
  search,
  onSearchChange,
  matchFilter,
  onMatchFilterChange,
  sortOption,
  onSortOptionChange,
}: JobFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-card sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter by company or role..."
          aria-label="Filter by company or role"
          className="w-full bg-transparent py-1.5 pl-8 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-2.5 sm:border-l sm:border-border sm:pl-3">
        <select
          value={matchFilter}
          onChange={(e) => onMatchFilterChange(e.target.value as MatchFilter)}
          aria-label="Filter by match score"
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="all">All Matches</option>
          <option value="high">Strong Match (70%+)</option>
          <option value="low">Lower Match (&lt;70%)</option>
        </select>

        <select
          value={sortOption}
          onChange={(e) => onSortOptionChange(e.target.value as SortOption)}
          aria-label="Sort jobs"
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="match_score">Match Score</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
    </div>
  )
}
