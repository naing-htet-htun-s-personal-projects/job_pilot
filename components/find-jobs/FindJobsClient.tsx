"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { Job } from "@/types/job"
import { SearchControls } from "./SearchControls"
import { JobFilters, type MatchFilter, type SortOption } from "./JobFilters"
import { JobsTable } from "./JobsTable"
import { JobsPagination } from "./JobsPagination"

interface FindJobsClientProps {
  initialJobs: Job[]
  initialTotalCount: number
  pageSize?: number
}

export function FindJobsClient({
  initialJobs,
  initialTotalCount,
  pageSize = 20,
}: FindJobsClientProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount)
  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>("")
  const [matchFilter, setMatchFilter] = useState<MatchFilter>("all")
  const [sortOption, setSortOption] = useState<SortOption>("match_score")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [bannerMessage, setBannerMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isFirstRender = useRef(true)

  const fetchJobs = useCallback(
    async (
      targetPage: number,
      targetSearch: string,
      targetMatch: MatchFilter,
      targetSort: SortOption
    ) => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          page: String(targetPage),
          matchFilter: targetMatch,
          sortOption: targetSort,
        })
        if (targetSearch.trim()) {
          params.set("search", targetSearch.trim())
        }

        const res = await fetch(`/api/jobs?${params.toString()}`)
        if (!res.ok) {
          throw new Error("Unable to load jobs right now.")
        }

        const data = (await res.json()) as {
          jobs?: Job[]
          totalCount?: number
        }
        setJobs(Array.isArray(data.jobs) ? data.jobs : [])
        setTotalCount(typeof data.totalCount === "number" ? data.totalCount : 0)
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Unable to load jobs right now."
        )
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const timer = setTimeout(() => {
      void fetchJobs(page, search, matchFilter, sortOption)
    }, 200)

    return () => clearTimeout(timer)
  }, [page, search, matchFilter, sortOption, fetchJobs])

  async function handleSearch(jobTitle: string, location: string) {
    setIsSearching(true)
    setBannerMessage(null)
    setErrorMessage(null)

    try {
      const res = await fetch("/api/agent/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, location }),
      })

      const data = (await res.json().catch(() => ({}))) as {
        error?: string
        jobsFound?: number
        totalFound?: number
        strongMatches?: number
        savedCount?: number
        jobs?: Job[]
      }

      if (!res.ok) {
        throw new Error(data.error || "Job search failed. Please try again.")
      }

      const found =
        data.jobsFound ??
        data.totalFound ??
        (Array.isArray(data.jobs) ? data.jobs.length : 0)
      const strong = data.strongMatches ?? data.savedCount ?? 0

      setBannerMessage(
        strong > 0
          ? `Found ${found} jobs and saved ${strong} strong matches.`
          : `Found and scored ${found} matching jobs.`
      )

      setPage(1)
      await fetchJobs(1, search, matchFilter, sortOption)
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Job search failed. Please try again."
      )
    } finally {
      setIsSearching(false)
    }
  }

  function handleSearchFilterChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleMatchFilterChange(value: MatchFilter) {
    setMatchFilter(value)
    setPage(1)
  }

  function handleSortOptionChange(value: SortOption) {
    setSortOption(value)
    setPage(1)
  }

  function handleClearFilters() {
    setSearch("")
    setMatchFilter("all")
    setPage(1)
  }

  const hasFilters = search.trim().length > 0 || matchFilter !== "all"

  return (
    <div className="space-y-6">
      <SearchControls
        onSearch={handleSearch}
        isSearching={isSearching}
        bannerMessage={bannerMessage}
        errorMessage={errorMessage}
      />

      <JobFilters
        search={search}
        onSearchChange={handleSearchFilterChange}
        matchFilter={matchFilter}
        onMatchFilterChange={handleMatchFilterChange}
        sortOption={sortOption}
        onSortOptionChange={handleSortOptionChange}
      />

      {jobs.length === 0 && !isLoading ? (
        <JobsTable
          jobs={[]}
          isLoading={false}
          hasFilters={hasFilters}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
          <JobsTable
            jobs={jobs}
            isLoading={isLoading}
            hasFilters={hasFilters}
            onClearFilters={handleClearFilters}
          />
          <JobsPagination
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  )
}
