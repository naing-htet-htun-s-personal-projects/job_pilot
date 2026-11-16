import { NextRequest, NextResponse } from "next/server"
import { createInsforgeServer } from "@/lib/insforge-server"
import { searchAdzunaJobs } from "@/lib/adzuna"
import { scoreJobAgainstProfile } from "@/lib/openai"
import { captureServerEvent } from "@/lib/posthog-server"
import type { FindJobsRequest, FindJobsResponse, Job, Profile } from "@/types"

export async function POST(req: NextRequest) {
  try {
    const insforge = await createInsforgeServer()
    const { data: authData, error: authError } = await insforge.auth.getCurrentUser()
    const user = authData?.user ?? null

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await req.json().catch(() => ({}))) as Partial<FindJobsRequest>
    const jobTitle = (body.jobTitle ?? "").trim()
    const location = (body.location ?? "").trim()
    const country = body.country?.trim()

    if (!jobTitle) {
      return NextResponse.json({ error: "jobTitle is required" }, { status: 400 })
    }

    await captureServerEvent(user.id, "job_search_started", {
      jobTitle,
      location: location || "any",
    })

    const { data: profileData } = await insforge.database
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()

    const profile = (profileData ?? null) as Profile | null

    const { data: runData, error: runError } = await insforge.database
      .from("agent_runs")
      .insert({
        user_id: user.id,
        status: "running",
        job_title_searched: jobTitle,
        location_searched: location || null,
        jobs_found: 0,
      })
      .select("*")
      .single()

    if (runError || !runData) {
      return NextResponse.json(
        { error: runError?.message || "Failed to start agent run" },
        { status: 500 }
      )
    }

    const runId = (runData as { id: string }).id

    try {
      const discovery = await searchAdzunaJobs({
        jobTitle,
        location,
        country,
        resultsPerPage: 8,
      })

      const scoredJobs = await Promise.all(
        discovery.jobs.map(async (listing) => {
          const match = await scoreJobAgainstProfile(listing, profile)
          return {
            run_id: runId,
            user_id: user.id,
            source: "search" as const,
            source_url: listing.source_url,
            external_apply_url: listing.external_apply_url,
            title: listing.title,
            company: listing.company,
            location: listing.location,
            salary: listing.salary,
            job_type: listing.job_type,
            about_role: listing.about_role,
            responsibilities: listing.responsibilities,
            requirements: listing.requirements,
            nice_to_have: listing.nice_to_have,
            benefits: listing.benefits,
            about_company: listing.about_company,
            match_score: match.match_score,
            match_reason: match.match_reason,
            matched_skills: match.matched_skills,
            missing_skills: match.missing_skills,
          }
        })
      )

      let insertedJobs: Job[] = []
      if (scoredJobs.length > 0) {
        const { data: savedJobs, error: insertError } = await insforge.database
          .from("jobs")
          .insert(scoredJobs)
          .select("*")

        if (insertError) {
          throw new Error(insertError.message || "Failed to save discovered jobs")
        }
        insertedJobs = (savedJobs ?? []) as Job[]
      }

      const strongMatches = insertedJobs.filter((j) => (j.match_score ?? 0) >= 70).length

      await insforge.database
        .from("agent_runs")
        .update({
          status: "completed",
          jobs_found: insertedJobs.length,
          completed_at: new Date().toISOString(),
        })
        .eq("id", runId)

      await insforge.database.from("agent_logs").insert({
        run_id: runId,
        user_id: user.id,
        level: "success",
        message: `Found ${insertedJobs.length} jobs (${strongMatches} strong matches) for "${jobTitle}" via ${discovery.source}.`,
      })

      await captureServerEvent(user.id, "job_found", {
        runId,
        jobsFound: insertedJobs.length,
        strongMatches,
        source: discovery.source,
      })

      const response: FindJobsResponse = {
        runId,
        jobsFound: insertedJobs.length,
        strongMatches,
        jobs: insertedJobs,
        source: discovery.source,
        message: `Found ${insertedJobs.length} jobs and saved ${strongMatches} strong matches.`,
      }

      return NextResponse.json(response)
    } catch (innerErr) {
      await insforge.database
        .from("agent_runs")
        .update({
          status: "failed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", runId)

      await insforge.database.from("agent_logs").insert({
        run_id: runId,
        user_id: user.id,
        level: "error",
        message: innerErr instanceof Error ? innerErr.message : "Job discovery failed",
      })

      throw innerErr
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to discover jobs" },
      { status: 500 }
    )
  }
}
