"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, ExternalLink, Loader2, Search } from "lucide-react"
import type { CompanyResearchDossier, Job } from "@/types/job"

interface CompanyResearchProps {
  job: Job
}

export function CompanyResearch({ job }: CompanyResearchProps) {
  const router = useRouter()
  const [dossier, setDossier] = useState<CompanyResearchDossier | null>(
    job.company_research
  )
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleResearch() {
    if (isLoading) return
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const res = await fetch("/api/agent/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id }),
      })

      const data = (await res.json().catch(() => ({}))) as {
        error?: string
        dossier?: CompanyResearchDossier
        company_research?: CompanyResearchDossier
      }

      if (!res.ok) {
        throw new Error(
          data.error || "Unable to complete company research right now."
        )
      }

      const generated = data.dossier ?? data.company_research ?? null
      if (generated) {
        setDossier(generated)
      }
      router.refresh()
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Unable to complete company research right now."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-accent-light text-accent">
            <Building2 className="size-4" />
          </div>
          <h2 className="text-base font-semibold text-text-primary">
            Company Research
          </h2>
        </div>

        <button
          type="button"
          onClick={handleResearch}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Researching...</span>
            </>
          ) : (
            <>
              <Search className="size-4" />
              <span>{dossier ? "Refresh Research" : "Research Company"}</span>
            </>
          )}
        </button>
      </div>

      {errorMessage && (
        <div className="mt-4 rounded-lg border border-error/20 bg-error/10 px-4 py-2.5 text-sm font-medium text-error">
          {errorMessage}
        </div>
      )}

      {!dossier ? (
        <div className="mt-5 rounded-xl border border-border bg-surface-secondary/50 px-6 py-10 text-center">
          <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-text-muted">
            <Building2 className="size-5" />
          </div>
          <p className="text-sm font-semibold text-text-primary">
            No research yet
          </p>
          <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-text-muted">
            Click &ldquo;Research Company&rdquo; to let the AI browse{" "}
            {job.company}&apos;s public pages and build a dossier.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-5 border-t border-border pt-5 text-sm">
          <div>
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Company Overview
            </h3>
            <p className="leading-relaxed text-text-dark">
              {dossier.companyOverview}
            </p>
          </div>

          {dossier.whyThisRole && (
            <div>
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Why This Role
              </h3>
              <p className="leading-relaxed text-text-dark">
                {dossier.whyThisRole}
              </p>
            </div>
          )}

          {dossier.techStack.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {dossier.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-border bg-surface-secondary px-3 py-1 text-xs font-medium text-text-primary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {dossier.culture.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Culture &amp; Values
              </h3>
              <ul className="list-disc space-y-1.5 pl-5 text-text-dark">
                {dossier.culture.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            {dossier.yourEdge.length > 0 && (
              <div className="rounded-xl border border-success-light bg-success-lightest/60 p-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-success-dark">
                  Your Edge
                </h3>
                <ul className="list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-text-dark">
                  {dossier.yourEdge.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {dossier.gapsToAddress.length > 0 && (
              <div className="rounded-xl border border-accent/20 bg-accent-muted p-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
                  Gaps to Address
                </h3>
                <ul className="list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-text-dark">
                  {dossier.gapsToAddress.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {dossier.smartQuestions.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Smart Questions to Ask
              </h3>
              <ul className="list-disc space-y-1.5 pl-5 text-text-dark">
                {dossier.smartQuestions.map((q, idx) => (
                  <li key={idx}>{q}</li>
                ))}
              </ul>
            </div>
          )}

          {dossier.interviewPrep.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Interview Prep
              </h3>
              <ul className="list-disc space-y-1.5 pl-5 text-text-dark">
                {dossier.interviewPrep.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {dossier.sources.length > 0 && (
            <div className="border-t border-border pt-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Sources
              </h3>
              <div className="flex flex-wrap gap-3">
                {dossier.sources.map((src) => (
                  <a
                    key={src}
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                  >
                    <ExternalLink className="size-3" />
                    <span className="max-w-60 truncate">{src}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
