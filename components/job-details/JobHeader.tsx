import { Building2, ExternalLink } from "lucide-react"
import type { Job } from "@/types/job"

interface JobHeaderProps {
  job: Job
}

function getMatchPillClass(score: number): string {
  if (score >= 80) return "bg-success-lightest text-success-dark"
  if (score >= 60) return "bg-info-lightest text-info-foreground"
  return "bg-accent-light text-accent"
}

export function JobHeader({ job }: JobHeaderProps) {
  const postUrl = job.source_url || job.external_apply_url

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-secondary text-text-secondary">
          <Building2 className="size-6" />
        </div>

        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-text-primary">
            {job.title}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
            <span>{job.company}</span>
            {job.match_score !== null && (
              <>
                <span aria-hidden="true">·</span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getMatchPillClass(
                    job.match_score
                  )}`}
                >
                  {job.match_score}% Match Score
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {postUrl && (
        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary"
        >
          <ExternalLink className="size-4 text-text-secondary" />
          <span>View Job Post</span>
        </a>
      )}
    </div>
  )
}
