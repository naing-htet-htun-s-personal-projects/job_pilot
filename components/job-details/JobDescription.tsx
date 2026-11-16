import { ExternalLink, FileText } from "lucide-react"
import type { Job } from "@/types/job"

interface JobDescriptionProps {
  job: Job
}

export function JobDescription({ job }: JobDescriptionProps) {
  const description = job.about_role?.trim() ?? ""
  const isTruncatedPreview =
    description.endsWith("...") || description.endsWith("…")
  const postUrl = job.source_url || job.external_apply_url

  const sections = [
    { title: "Responsibilities", items: job.responsibilities },
    { title: "Requirements", items: job.requirements },
    { title: "Nice to Have", items: job.nice_to_have },
    { title: "Benefits", items: job.benefits },
  ].filter((section) => section.items.length > 0)

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-lg border border-border bg-surface-secondary text-text-secondary">
          <FileText className="size-4" />
        </div>
        <h2 className="text-base font-semibold text-text-primary">
          Job Description
        </h2>
      </div>

      {description ? (
        <p className="whitespace-pre-line text-sm leading-relaxed text-text-dark">
          {description}
        </p>
      ) : (
        <p className="text-sm text-text-muted">
          No description was provided for this posting.
        </p>
      )}

      {isTruncatedPreview && postUrl && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-secondary px-4 py-3 text-xs text-text-secondary">
          <span>This listing shows a truncated preview from the job board.</span>
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 font-medium text-accent hover:underline"
          >
            <span>View Full Job Post</span>
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      )}

      {sections.length > 0 && (
        <div className="mt-6 space-y-5 border-t border-border pt-5">
          {sections.map((section) => (
            <div key={section.title} className="space-y-2">
              <h3 className="text-sm font-semibold text-text-primary">
                {section.title}
              </h3>
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-text-dark">
                {section.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
