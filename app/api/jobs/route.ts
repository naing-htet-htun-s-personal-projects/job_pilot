import { NextRequest, NextResponse } from "next/server"
import { createInsforgeServer } from "@/lib/insforge-server"
import type { Job, JobMatchFilter, JobSortBy, JobsListResponse } from "@/types"

export async function GET(req: NextRequest) {
  try {
    const insforge = await createInsforgeServer()
    const { data: authData, error: authError } = await insforge.auth.getCurrentUser()
    const user = authData?.user ?? null

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1)
    const pageSize = Math.min(
      50,
      Math.max(1, Number.parseInt(searchParams.get("pageSize") ?? "20", 10) || 20)
    )
    const search = (searchParams.get("search") ?? "").trim()
    const match = (searchParams.get("match") ?? "all") as JobMatchFilter
    const sort = (searchParams.get("sort") ?? "match_score") as JobSortBy

    let query = insforge.database
      .from("jobs")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)

    if (match === "high") {
      query = query.gte("match_score", 70)
    } else if (match === "low") {
      query = query.lt("match_score", 70)
    }

    if (search) {
      const safeSearch = search.replace(/[%_,()]/g, " ").trim()
      if (safeSearch) {
        query = query.or(`title.ilike.%${safeSearch}%,company.ilike.%${safeSearch}%`)
      }
    }

    if (sort === "newest") {
      query = query.order("found_at", { ascending: false })
    } else if (sort === "oldest") {
      query = query.order("found_at", { ascending: true })
    } else {
      query = query
        .order("match_score", { ascending: false, nullsFirst: false })
        .order("found_at", { ascending: false })
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data, count, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message || "Failed to fetch jobs" }, { status: 500 })
    }

    const total = count ?? (data?.length ?? 0)
    const totalPages = Math.max(1, Math.ceil(total / pageSize))

    const response: JobsListResponse = {
      jobs: (data ?? []) as Job[],
      total,
      page,
      pageSize,
      totalPages,
    }

    return NextResponse.json(response)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    )
  }
}
