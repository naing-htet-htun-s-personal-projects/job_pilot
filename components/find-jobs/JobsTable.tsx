"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Briefcase, Building2 } from "lucide-react"
import { useLanguage } from "@/components/LanguageProvider"
import type { Job } from "@/types/job"

interface JobsTableProps {
  jobs: Job[]
  isLoading?: boolean
  hasFilters?: boolean
  onClearFilters?: () => void
}

function getScoreBarClass(score: number | null): string {
  if (score === null) return "bg-border"
  if (score >= 80) return "bg-success"
  if (score >= 60) return "bg-info"
  return "bg-warning"
}

function formatRelativeDate(dateString: string): string {
  const parsed = new Date(dateString)
  if (Number.isNaN(parsed.getTime())) return "—"

  const diffMs = Date.now() - parsed.getTime()
  const diffMinutes = Math.floor(diffMs / 60_000)
  if (diffMinutes < 1) return "Just now"
  if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? "min" : "mins"} ago`
  }
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`
  }
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 30) return `${diffDays} days ago`

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function JobsTable({
  jobs,
  isLoading = false,
  hasFilters = false,
  onClearFilters,
}: JobsTableProps) {
  const router = useRouter()
  const { t } = useLanguage()

  if (!isLoading && jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-12 text-center shadow-card">
        <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-xl border border-border bg-surface-secondary text-text-muted">
          <Briefcase className="size-5" />
        </div>
        <p className="text-sm font-medium text-text-primary">
          {hasFilters ? t("findJobs.emptyTitle") : t("findJobs.emptyTitle")}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          {t("findJobs.emptyDesc")}
        </p>
        {hasFilters && onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-4 rounded-lg border border-border bg-surface px-4 py-2 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary"
          >
            Clear filters
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      className={`overflow-x-auto transition-opacity ${
        isLoading ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <table className="w-full min-w-160 border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-surface-secondary/50 text-xs font-medium uppercase tracking-wider text-text-secondary">
            <th className="px-6 py-3.5">{t("findJobs.col.company")}</th>
            <th className="px-6 py-3.5">{t("findJobs.col.role")}</th>
            <th className="px-6 py-3.5">{t("findJobs.col.matchScore")}</th>
            <th className="px-6 py-3.5">{t("findJobs.col.salary")}</th>
            <th className="px-6 py-3.5">{t("findJobs.col.dateFound")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-surface text-sm">
          {jobs.map((job) => {
            const score = job.match_score
            const clampedScore = score !== null ? Math.max(0, Math.min(100, score)) : 0

            return (
              <tr
                key={job.id}
                onClick={() => router.push(`/find-jobs/${job.id}`)}
                className="cursor-pointer transition-colors hover:bg-surface-secondary"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-secondary text-text-secondary">
                      <Building2 className="size-4" />
                    </div>
                    <span className="font-medium text-text-primary">
                      {job.company}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <Link
                    href={`/find-jobs/${job.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="font-medium text-text-primary hover:text-accent"
                  >
                    {job.title}
                  </Link>
                </td>

                <td className="px-6 py-4">
                  {score !== null ? (
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-border">
                        <div
                          className={`h-full rounded-full ${getScoreBarClass(score)}`}
                          style={{ width: `${clampedScore}%` }}
                        />
                      </div>
                      <span className="font-medium text-text-primary tabular-nums">
                        {score}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-text-muted">—</span>
                  )}
                </td>

                <td className="px-6 py-4 text-text-primary tabular-nums">
                  {job.salary || "—"}
                </td>

                <td className="px-6 py-4 text-text-secondary">
                  {formatRelativeDate(job.found_at)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
