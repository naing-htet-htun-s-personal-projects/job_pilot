"use client"

import { useState, type FormEvent } from "react"
import { Loader2, MapPin, Search, Sparkles } from "lucide-react"
import { useLanguage } from "@/components/LanguageProvider"

interface SearchControlsProps {
  onSearch: (jobTitle: string, location: string) => Promise<void>
  isSearching: boolean
  bannerMessage?: string | null
  errorMessage?: string | null
}

export function SearchControls({
  onSearch,
  isSearching,
  bannerMessage,
  errorMessage,
}: SearchControlsProps) {
  const { t } = useLanguage()
  const [jobTitle, setJobTitle] = useState("")
  const [location, setLocation] = useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!jobTitle.trim() || isSearching) return
    await onSearch(jobTitle.trim(), location.trim())
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 md:flex-row md:items-end"
      >
        <div className="flex-1 space-y-1.5">
          <label
            htmlFor="find-job-title"
            className="block text-xs font-medium uppercase tracking-wide text-text-secondary"
          >
            {t("findJobs.jobTitleLabel")}
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
            <input
              id="find-job-title"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder={t("findJobs.jobTitlePlaceholder")}
              required
              className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <div className="flex-1 space-y-1.5">
          <label
            htmlFor="find-job-location"
            className="block text-xs font-medium uppercase tracking-wide text-text-secondary"
          >
            {t("findJobs.locationLabel")}
          </label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
            <input
              id="find-job-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t("findJobs.locationPlaceholder")}
              className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSearching || !jobTitle.trim()}
          className="inline-flex h-10.5 shrink-0 items-center justify-center gap-2 rounded-lg bg-accent px-5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSearching ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>{t("findJobs.searchingBtn")}</span>
            </>
          ) : (
            <>
              <Search className="size-4" />
              <span>{t("findJobs.searchBtn")}</span>
            </>
          )}
        </button>
      </form>

      {bannerMessage && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-success-light bg-success-lightest px-4 py-2.5 text-sm font-medium text-success-dark">
          <Sparkles className="size-4 shrink-0 text-success" />
          <span>{bannerMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 rounded-lg border border-error/20 bg-error/10 px-4 py-2.5 text-sm font-medium text-error">
          {errorMessage}
        </div>
      )}
    </div>
  )
}
