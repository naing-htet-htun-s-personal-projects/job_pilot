import { Check, Sparkles, X } from "lucide-react"
import type { Job } from "@/types/job"

interface MatchScoreProps {
  job: Job
}

export function MatchScore({ job }: MatchScoreProps) {
  const hasMatched = job.matched_skills.length > 0
  const hasMissing = job.missing_skills.length > 0

  return (
    <div className="space-y-4">
      {/* AI Match Reasoning */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-success-lightest text-success-dark">
            <Sparkles className="size-4" />
          </div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            AI Match Reasoning
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-text-primary">
          {job.match_reason ||
            "Match reasoning will appear here once the job has been scored against your profile."}
        </p>
      </div>

      {/* Required Skills vs Your Profile */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Required Skills vs Your Profile
        </h2>

        {!hasMatched && !hasMissing ? (
          <p className="text-sm text-text-muted">
            No skill comparison extracted for this role yet.
          </p>
        ) : (
          <div className="space-y-4">
            {hasMatched && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-text-secondary">You have</p>
                <div className="flex flex-wrap gap-2">
                  {job.matched_skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-full bg-success-lightest px-3 py-1 text-xs font-medium text-success-dark"
                    >
                      <Check className="size-3.5 shrink-0" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {hasMissing && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-text-secondary">Gap skills</p>
                <div className="flex flex-wrap gap-2">
                  {job.missing_skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-full bg-accent-light px-3 py-1 text-xs font-medium text-accent"
                    >
                      <X className="size-3.5 shrink-0" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
