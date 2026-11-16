export interface NormalizedJobListing {
  title: string
  company: string
  location: string
  salary: string | null
  job_type: "fulltime" | "parttime" | "contract"
  about_role: string
  responsibilities: string[]
  requirements: string[]
  nice_to_have: string[]
  benefits: string[]
  about_company: string | null
  source_url: string | null
  external_apply_url: string | null
}

export interface AdzunaSearchResult {
  jobs: NormalizedJobListing[]
  source: "adzuna" | "fallback"
}

const COUNTRY_KEYWORDS: [RegExp, string][] = [
  [/\b(uk|united kingdom|london|manchester|birmingham)\b/i, "gb"],
  [/\b(canada|toronto|vancouver|montreal)\b/i, "ca"],
  [/\b(australia|sydney|melbourne|brisbane)\b/i, "au"],
  [/\b(singapore)\b/i, "sg"],
  [/\b(germany|berlin|munich|hamburg)\b/i, "de"],
  [/\b(france|paris|lyon)\b/i, "fr"],
  [/\b(india|bangalore|bengaluru|mumbai|delhi)\b/i, "in"],
  [/\b(netherlands|amsterdam)\b/i, "nl"],
]

export function detectAdzunaCountry(location?: string, explicitCountry?: string): string {
  if (explicitCountry && /^[a-z]{2}$/i.test(explicitCountry.trim())) {
    return explicitCountry.trim().toLowerCase()
  }
  if (!location) return "us"

  for (const [pattern, code] of COUNTRY_KEYWORDS) {
    if (pattern.test(location)) {
      return code
    }
  }
  return "us"
}

function formatSalary(min?: number, max?: number): string | null {
  if (!min && !max) return null
  const fmt = (n: number) => `$${Math.round(n / 1000)}k`
  if (min && max && Math.round(min) !== Math.round(max)) {
    return `${fmt(min)} - ${fmt(max)}`
  }
  const value = min ?? max
  return value ? fmt(value) : null
}

function normalizeJobType(contractType?: string, contractTime?: string): "fulltime" | "parttime" | "contract" {
  const combined = `${contractType ?? ""} ${contractTime ?? ""}`.toLowerCase()
  if (combined.includes("contract")) return "contract"
  if (combined.includes("part")) return "parttime"
  return "fulltime"
}

function buildFallbackJobs(jobTitle: string, location?: string): NormalizedJobListing[] {
  const cleanTitle = jobTitle.trim() || "Software Engineer"
  const cleanLocation = location?.trim() || "Remote"

  return [
    {
      title: `Senior ${cleanTitle}`,
      company: "Vercel Labs Partner",
      location: cleanLocation,
      salary: "$135k - $165k",
      job_type: "fulltime",
      about_role: `We are looking for a ${cleanTitle} to architect scalable web applications, collaborate across product and design, and ship reliable user-facing features.`,
      responsibilities: [
        "Design and build production-grade frontend and full-stack features",
        "Partner with product managers and designers on technical architecture",
        "Improve application performance, observability, and test coverage",
      ],
      requirements: ["TypeScript", "React", "Next.js", "REST APIs", "Git"],
      nice_to_have: ["Tailwind CSS", "PostgreSQL", "CI/CD"],
      benefits: ["Remote flexibility", "Health coverage", "Learning stipend"],
      about_company: "Product-focused engineering team building modern developer and workflow tools.",
      source_url: "https://www.adzuna.com",
      external_apply_url: "https://www.adzuna.com",
    },
    {
      title: cleanTitle,
      company: "LinearFlow Systems",
      location: cleanLocation,
      salary: "$110k - $140k",
      job_type: "fulltime",
      about_role: `Join LinearFlow as a ${cleanTitle} to craft fast, accessible interfaces and dependable backend integrations for growing enterprise customers.`,
      responsibilities: [
        "Deliver end-to-end features with clean TypeScript and automated tests",
        "Collaborate in code reviews and architecture discussions",
        "Maintain API reliability and smooth client state synchronization",
      ],
      requirements: ["JavaScript", "TypeScript", "React", "Node.js", "SQL"],
      nice_to_have: ["GraphQL", "Docker", "AWS"],
      benefits: ["Flexible PTO", "Home office budget", "Equity"],
      about_company: "B2B SaaS platform helping distributed teams streamline operations.",
      source_url: "https://www.adzuna.com",
      external_apply_url: "https://www.adzuna.com",
    },
    {
      title: `${cleanTitle} (Product Team)`,
      company: "Northstar Cloud",
      location: cleanLocation,
      salary: "$100k - $125k",
      job_type: "fulltime",
      about_role: `Northstar Cloud is hiring a ${cleanTitle} to own key customer workflows, optimize core dashboards, and ship weekly product improvements.`,
      responsibilities: [
        "Build reusable UI components and clean data-fetching layers",
        "Work closely with customer success to resolve edge cases",
        "Contribute to design system consistency and accessibility",
      ],
      requirements: ["React", "TypeScript", "CSS", "API Integration"],
      nice_to_have: ["Next.js", "PostHog", "Playwright"],
      benefits: ["401(k) match", "Wellness stipend", "Remote-first culture"],
      about_company: "Cloud analytics and automation startup serving mid-market teams.",
      source_url: "https://www.adzuna.com",
      external_apply_url: "https://www.adzuna.com",
    },
    {
      title: `Staff ${cleanTitle}`,
      company: "Horizon Fintech",
      location: cleanLocation,
      salary: "$155k - $185k",
      job_type: "fulltime",
      about_role: `Lead technical initiatives as a Staff ${cleanTitle} at Horizon Fintech, driving architecture standards, security, and mentoring engineers.`,
      responsibilities: [
        "Set technical direction across core web platforms",
        "Lead cross-team RFCs and mentor senior engineers",
        "Ensure high reliability and compliance across financial workflows",
      ],
      requirements: ["TypeScript", "React", "Next.js", "System Design", "Security"],
      nice_to_have: ["PostgreSQL", "Redis", "Kubernetes"],
      benefits: ["Comprehensive health & dental", "Annual bonus", "Hybrid/Remote"],
      about_company: "Modern treasury and payments platform for global businesses.",
      source_url: "https://www.adzuna.com",
      external_apply_url: "https://www.adzuna.com",
    },
  ]
}

interface AdzunaRawResult {
  title?: string
  description?: string
  redirect_url?: string
  salary_min?: number
  salary_max?: number
  contract_type?: string
  contract_time?: string
  company?: { display_name?: string }
  location?: { display_name?: string }
}

export async function searchAdzunaJobs(params: {
  jobTitle: string
  location?: string
  country?: string
  resultsPerPage?: number
}): Promise<AdzunaSearchResult> {
  const appId = process.env.ADZUNA_APP_ID?.trim()
  const appKey = process.env.ADZUNA_APP_KEY?.trim()

  if (!appId || !appKey) {
    return {
      jobs: buildFallbackJobs(params.jobTitle, params.location),
      source: "fallback",
    }
  }

  const country = detectAdzunaCountry(params.location, params.country)
  const query = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    what: params.jobTitle,
    results_per_page: String(params.resultsPerPage ?? 8),
  })

  if (params.location?.trim()) {
    query.set("where", params.location.trim())
  }

  try {
    const res = await fetch(
      `https://api.adzuna.com/v1/api/jobs/${country}/search/1?${query.toString()}`,
      { cache: "no-store" }
    )

    if (!res.ok) {
      return {
        jobs: buildFallbackJobs(params.jobTitle, params.location),
        source: "fallback",
      }
    }

    const payload = (await res.json()) as { results?: AdzunaRawResult[] }
    const results = payload.results ?? []

    if (results.length === 0) {
      return {
        jobs: buildFallbackJobs(params.jobTitle, params.location),
        source: "fallback",
      }
    }

    const jobs: NormalizedJobListing[] = results.map((item) => ({
      title: item.title?.trim() || params.jobTitle,
      company: item.company?.display_name?.trim() || "Unknown Company",
      location: item.location?.display_name?.trim() || params.location || "Remote",
      salary: formatSalary(item.salary_min, item.salary_max),
      job_type: normalizeJobType(item.contract_type, item.contract_time),
      about_role: item.description?.trim() || "",
      responsibilities: [],
      requirements: [],
      nice_to_have: [],
      benefits: [],
      about_company: null,
      source_url: item.redirect_url ?? null,
      external_apply_url: item.redirect_url ?? null,
    }))

    return { jobs, source: "adzuna" }
  } catch {
    return {
      jobs: buildFallbackJobs(params.jobTitle, params.location),
      source: "fallback",
    }
  }
}
