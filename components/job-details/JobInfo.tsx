"use client"

import { Briefcase, Calendar, DollarSign, MapPin } from "lucide-react"
import { useLanguage } from "@/components/LanguageProvider"
import type { Job } from "@/types/job"

interface JobInfoProps {
  job: Job
}

function formatFoundDate(dateString: string): string {
  const parsed = new Date(dateString)
  if (Number.isNaN(parsed.getTime())) return "—"

  const diffMs = Date.now() - parsed.getTime()
  const diffHours = Math.floor(diffMs / 3_600_000)
  if (diffHours < 1) return "Just now"
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 30) return `${diffDays} days ago`

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function JobInfo({ job }: JobInfoProps) {
  const { t } = useLanguage()
  const items = [
    {
      label: t("jobDetails.salary"),
      value: job.salary || "—",
      icon: DollarSign,
      iconBg: "bg-success-lightest text-success-dark",
    },
    {
      label: t("jobDetails.location"),
      value: job.location || "—",
      icon: MapPin,
      iconBg: "bg-info-lightest text-info-foreground",
    },
    {
      label: t("jobDetails.jobType"),
      value: job.job_type || "—",
      icon: Briefcase,
      iconBg: "bg-accent-light text-accent",
    },
    {
      label: t("jobDetails.dateFound"),
      value: formatFoundDate(job.found_at),
      icon: Calendar,
      iconBg: "bg-surface-tertiary text-text-secondary",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.label}
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-card"
          >
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${item.iconBg}`}
            >
              <Icon className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text-primary">
                {item.value}
              </p>
              <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
                {item.label}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
