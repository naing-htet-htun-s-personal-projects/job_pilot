import type { CompanyResearchDossier, Job, Profile } from "@/types"
import type { NormalizedJobListing } from "@/lib/adzuna"

export interface JobMatchResult {
  match_score: number
  match_reason: string
  matched_skills: string[]
  missing_skills: string[]
  source: "openai" | "fallback"
}

export interface GeneratedResumeContent {
  summary: string
  experienceBullets: {
    company: string
    title: string
    period: string
    bullets: string[]
  }[]
  source: "openai" | "fallback"
}

async function callOpenAIJson<T>(systemPrompt: string, userPrompt: string): Promise<T | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim()
  if (!apiKey) return null

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    })

    if (!res.ok) return null
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    const content = data.choices?.[0]?.message?.content
    if (!content) return null
    return JSON.parse(content) as T
  } catch {
    return null
  }
}

function fallbackScoreJob(job: NormalizedJobListing, profile: Profile | null): JobMatchResult {
  const profileSkills = (profile?.skills ?? []).map((s) => s.trim()).filter(Boolean)
  const jobText = `${job.title} ${job.about_role} ${job.requirements.join(" ")} ${job.nice_to_have.join(" ")}`.toLowerCase()

  const matchedSkills: string[] = []
  const missingSkills: string[] = []

  const candidateSkills = job.requirements.length > 0 ? job.requirements : profileSkills
  const lowerProfileSkills = new Set(profileSkills.map((s) => s.toLowerCase()))

  if (job.requirements.length > 0) {
    for (const req of job.requirements) {
      if (lowerProfileSkills.has(req.toLowerCase())) {
        matchedSkills.push(req)
      } else {
        missingSkills.push(req)
      }
    }
  } else {
    for (const skill of candidateSkills) {
      if (jobText.includes(skill.toLowerCase())) {
        matchedSkills.push(skill)
      }
    }
  }

  const titleMatch =
    profile?.current_title &&
    job.title.toLowerCase().includes(profile.current_title.toLowerCase().split(" ")[0] ?? "")
      ? 15
      : 0

  const baseScore = 52
  const skillBoost = matchedSkills.length * 10
  const missingPenalty = Math.min(missingSkills.length * 4, 16)
  const score = Math.max(25, Math.min(96, baseScore + titleMatch + skillBoost - missingPenalty))

  const reasonParts: string[] = []
  if (matchedSkills.length > 0) {
    reasonParts.push(`Matches your skills in ${matchedSkills.slice(0, 4).join(", ")}.`)
  } else {
    reasonParts.push(`Role aligns with your target title "${job.title}".`)
  }
  if (missingSkills.length > 0) {
    reasonParts.push(`Consider highlighting experience around ${missingSkills.slice(0, 3).join(", ")}.`)
  }

  return {
    match_score: score,
    match_reason: reasonParts.join(" "),
    matched_skills: matchedSkills,
    missing_skills: missingSkills,
    source: "fallback",
  }
}

export async function scoreJobAgainstProfile(
  job: NormalizedJobListing,
  profile: Profile | null
): Promise<JobMatchResult> {
  const aiResult = await callOpenAIJson<{
    matchScore?: number
    matchReason?: string
    matchedSkills?: string[]
    missingSkills?: string[]
  }>(
    "You are an expert technical recruiter. Return JSON with keys: matchScore (integer 0-100), matchReason (1 concise paragraph), matchedSkills (string[]), missingSkills (string[]).",
    JSON.stringify({
      candidate: {
        currentTitle: profile?.current_title ?? "",
        experienceLevel: profile?.experience_level ?? "",
        yearsExperience: profile?.years_experience ?? 0,
        skills: profile?.skills ?? [],
        industries: profile?.industries ?? [],
      },
      job: {
        title: job.title,
        company: job.company,
        location: job.location,
        aboutRole: job.about_role.slice(0, 1500),
        requirements: job.requirements,
      },
    })
  )

  if (aiResult && typeof aiResult.matchScore === "number") {
    return {
      match_score: Math.max(0, Math.min(100, Math.round(aiResult.matchScore))),
      match_reason: aiResult.matchReason || "Evaluated against your profile skills and experience.",
      matched_skills: Array.isArray(aiResult.matchedSkills) ? aiResult.matchedSkills : [],
      missing_skills: Array.isArray(aiResult.missingSkills) ? aiResult.missingSkills : [],
      source: "openai",
    }
  }

  return fallbackScoreJob(job, profile)
}

export async function synthesizeCompanyDossier(
  job: Job,
  profile: Profile | null,
  websiteContent?: string | null,
  sourceUrl?: string | null
): Promise<{ dossier: CompanyResearchDossier; source: "openai" | "fallback" }> {
  const aiResult = await callOpenAIJson<CompanyResearchDossier>(
    "You are a career research analyst. Return a JSON object matching CompanyResearchDossier with keys: companyOverview (string), techStack (string[]), culture (string[]), whyThisRole (string), yourEdge (string[]), gapsToAddress (string[]), smartQuestions (string[]), interviewPrep (string[]), sources (string[]).",
    JSON.stringify({
      company: job.company,
      role: job.title,
      location: job.location,
      aboutRole: job.about_role?.slice(0, 1500) ?? "",
      matchedSkills: job.matched_skills,
      missingSkills: job.missing_skills,
      websiteSnippet: websiteContent?.slice(0, 2500) ?? "",
      candidate: {
        title: profile?.current_title ?? "",
        skills: profile?.skills ?? [],
        yearsExperience: profile?.years_experience ?? 0,
      },
    })
  )

  if (aiResult && typeof aiResult.companyOverview === "string") {
    return {
      dossier: {
        companyOverview: aiResult.companyOverview,
        techStack: Array.isArray(aiResult.techStack) ? aiResult.techStack : [],
        culture: Array.isArray(aiResult.culture) ? aiResult.culture : [],
        whyThisRole: aiResult.whyThisRole || "",
        yourEdge: Array.isArray(aiResult.yourEdge) ? aiResult.yourEdge : [],
        gapsToAddress: Array.isArray(aiResult.gapsToAddress) ? aiResult.gapsToAddress : [],
        smartQuestions: Array.isArray(aiResult.smartQuestions) ? aiResult.smartQuestions : [],
        interviewPrep: Array.isArray(aiResult.interviewPrep) ? aiResult.interviewPrep : [],
        sources:
          Array.isArray(aiResult.sources) && aiResult.sources.length > 0
            ? aiResult.sources
            : sourceUrl
              ? [sourceUrl]
              : [],
      },
      source: "openai",
    }
  }

  const matched = job.matched_skills.length > 0 ? job.matched_skills : profile?.skills.slice(0, 4) ?? []
  const missing = job.missing_skills.slice(0, 3)

  return {
    dossier: {
      companyOverview:
        job.about_company ||
        `${job.company} is hiring for ${job.title}${job.location ? ` (${job.location})` : ""}. The role focuses on building reliable product capabilities and collaborating across engineering and product teams.`,
      techStack: matched.length > 0 ? matched : ["TypeScript", "React", "Modern Web APIs"],
      culture: [
        "Product-oriented engineering collaboration",
        "Ownership of end-to-end feature delivery",
        "Continuous learning and code quality",
      ],
      whyThisRole: `This ${job.title} position aligns with your ${profile?.current_title || "engineering"} background${matched.length > 0 ? ` and leverages your strengths in ${matched.slice(0, 3).join(", ")}` : ""}.`,
      yourEdge:
        matched.length > 0
          ? matched.map((skill) => `Demonstrated experience with ${skill}`)
          : ["Strong foundational problem-solving and delivery experience"],
      gapsToAddress:
        missing.length > 0
          ? missing.map((skill) => `Prepare concrete examples or ramp-up plan for ${skill}`)
          : ["Highlight measurable impact and system ownership from past roles"],
      smartQuestions: [
        `What does success look like in the first 90 days for this ${job.title} role?`,
        "How do engineering and product teams prioritize technical debt vs new features?",
        "What is the team's deployment cadence and code review workflow?",
      ],
      interviewPrep: [
        "Prepare 2-3 STAR stories showing technical ownership and measurable outcomes",
        "Review core architecture patterns relevant to the job description",
        ...(missing.length > 0
          ? [`Brush up on ${missing.join(", ")} fundamentals before the technical screen`]
          : []),
      ],
      sources: sourceUrl ? [sourceUrl] : job.source_url ? [job.source_url] : [],
    },
    source: "fallback",
  }
}

export async function generateResumeContent(profile: Profile): Promise<GeneratedResumeContent> {
  const aiResult = await callOpenAIJson<{
    summary?: string
    experienceBullets?: {
      company: string
      title: string
      period: string
      bullets: string[]
    }[]
  }>(
    "You are an executive resume writer. Return JSON with keys: summary (concise 2-3 sentence professional summary), experienceBullets (array of {company, title, period, bullets: string[]} with 2-4 impact-driven bullet points per role).",
    JSON.stringify({
      fullName: profile.full_name,
      currentTitle: profile.current_title,
      yearsExperience: profile.years_experience,
      skills: profile.skills,
      workExperience: profile.work_experience,
      education: profile.education,
    })
  )

  if (aiResult && typeof aiResult.summary === "string" && Array.isArray(aiResult.experienceBullets)) {
    return {
      summary: aiResult.summary,
      experienceBullets: aiResult.experienceBullets,
      source: "openai",
    }
  }

  const yearsText = profile.years_experience ? `${profile.years_experience}+ years of experience` : "proven experience"
  const skillsText = profile.skills.length > 0 ? profile.skills.slice(0, 6).join(", ") : "modern software development"

  return {
    summary: `${profile.current_title || "Software Professional"} with ${yearsText} specializing in ${skillsText}. Focused on delivering clean, reliable, and user-centered solutions.`,
    experienceBullets: (profile.work_experience ?? []).slice(0, 3).map((exp) => ({
      company: exp.company,
      title: exp.title,
      period: `${exp.startDate} - ${exp.currentlyWorking ? "Present" : exp.endDate || "Present"}`,
      bullets: exp.responsibilities
        .split(/\n|•|-/)
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 4),
    })),
    source: "fallback",
  }
}
