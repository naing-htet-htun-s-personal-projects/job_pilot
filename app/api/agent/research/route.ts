import { NextRequest, NextResponse } from "next/server"
import { createInsforgeServer } from "@/lib/insforge-server"
import { synthesizeCompanyDossier } from "@/lib/openai"
import { captureServerEvent } from "@/lib/posthog-server"
import type { Job, Profile, ResearchCompanyRequest, ResearchCompanyResponse } from "@/types"

async function fetchPublicPageSnippet(url: string): Promise<string | null> {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null
    }

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 5000)

    try {
      const res = await fetch(parsed.toString(), {
        signal: controller.signal,
        headers: { "User-Agent": "JobPilot-ResearchBot/1.0" },
      })
      if (!res.ok) return null
      const html = await res.text()
      const text = html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
      return text.slice(0, 3000) || null
    } finally {
      clearTimeout(timer)
    }
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const insforge = await createInsforgeServer()
    const { data: authData, error: authError } = await insforge.auth.getCurrentUser()
    const user = authData?.user ?? null

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await req.json().catch(() => ({}))) as Partial<ResearchCompanyRequest>
    const jobId = (body.jobId ?? "").trim()

    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 })
    }

    const [{ data: jobData, error: jobError }, { data: profileData }] = await Promise.all([
      insforge.database
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .eq("user_id", user.id)
        .maybeSingle(),
      insforge.database.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    ])

    if (jobError || !jobData) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    const job = jobData as Job
    const profile = (profileData ?? null) as Profile | null
    const targetUrl = body.companyUrl?.trim() || job.external_apply_url || job.source_url
    const websiteSnippet = targetUrl ? await fetchPublicPageSnippet(targetUrl) : null

    const { dossier, source } = await synthesizeCompanyDossier(
      job,
      profile,
      websiteSnippet,
      targetUrl
    )

    const { error: updateError } = await insforge.database
      .from("jobs")
      .update({ company_research: dossier })
      .eq("id", job.id)
      .eq("user_id", user.id)

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || "Failed to save company research" },
        { status: 500 }
      )
    }

    await insforge.database.from("agent_logs").insert({
      user_id: user.id,
      job_id: job.id,
      level: "success",
      message: `Completed company research dossier for ${job.company} (${job.title}).`,
    })

    await captureServerEvent(user.id, "company_researched", {
      jobId: job.id,
      company: job.company,
      source,
    })

    const response: ResearchCompanyResponse = {
      jobId: job.id,
      dossier,
      source,
    }

    return NextResponse.json(response)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to research company" },
      { status: 500 }
    )
  }
}
