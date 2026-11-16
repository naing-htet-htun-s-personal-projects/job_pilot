import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { JobHeader } from "@/components/job-details/JobHeader"
import { JobInfo } from "@/components/job-details/JobInfo"
import { MatchScore } from "@/components/job-details/MatchScore"
import { JobDescription } from "@/components/job-details/JobDescription"
import { CompanyResearch } from "@/components/job-details/CompanyResearch"
import { createInsforgeServer, requireUser } from "@/lib/insforge-server"
import type { Job } from "@/types/job"

interface JobDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params
  const { user } = await requireUser()
  const insforge = await createInsforgeServer()

  const { data, error } = await insforge.database
    .from("jobs")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle()

  if (error || !data) {
    notFound()
  }

  const job = data as Job
  const applyUrl = job.external_apply_url || job.source_url

  return (
    <main className="min-h-screen bg-background text-text-primary">
      <Navbar isAuthenticated />

      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        <Link
          href="/find-jobs"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <ChevronLeft className="size-4" />
          <span>Back to Jobs</span>
        </Link>

        <div className="space-y-6">
          <JobHeader job={job} />
          <JobInfo job={job} />
          <MatchScore job={job} />
          <JobDescription job={job} />
          <CompanyResearch job={job} />

          {applyUrl && (
            <a
              href={applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-xl bg-accent py-3.5 text-center text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
            >
              Apply Now at {job.company}
            </a>
          )}
        </div>
      </div>
    </main>
  )
}
