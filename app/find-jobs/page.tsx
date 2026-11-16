import { Navbar } from "@/components/layout/Navbar"
import { FindJobsClient } from "@/components/find-jobs/FindJobsClient"
import { createInsforgeServer, requireUser } from "@/lib/insforge-server"
import type { Job } from "@/types/job"

const PAGE_SIZE = 20

export default async function FindJobsPage() {
  const { user } = await requireUser()
  const insforge = await createInsforgeServer()

  const { data, count } = await insforge.database
    .from("jobs")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("match_score", { ascending: false, nullsFirst: false })
    .order("found_at", { ascending: false })
    .range(0, PAGE_SIZE - 1)

  const initialJobs = (data as Job[] | null) ?? []
  const initialTotalCount = count ?? initialJobs.length

  return (
    <main className="min-h-screen bg-background text-text-primary">
      <Navbar isAuthenticated />
      <div className="mx-auto max-w-270 px-5 py-8 sm:px-8">
        <FindJobsClient
          initialJobs={initialJobs}
          initialTotalCount={initialTotalCount}
          pageSize={PAGE_SIZE}
        />
      </div>
    </main>
  )
}
