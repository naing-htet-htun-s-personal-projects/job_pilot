export type { Profile, WorkExperience, Education } from "./profile"
export type { AgentRun } from "./agent-run"
export type { Job, CompanyResearchDossier } from "./job"
export type { AgentLog } from "./agent-log"
export type { MissingField } from "./missing-field"

import type { CompanyResearchDossier, Job } from "./job"

export type JobMatchFilter = "all" | "high" | "low"
export type JobSortBy = "match_score" | "newest" | "oldest"

export interface JobsListResponse {
  jobs: Job[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface FindJobsRequest {
  jobTitle: string
  location?: string
  country?: string
}

export interface FindJobsResponse {
  runId: string
  jobsFound: number
  strongMatches: number
  jobs: Job[]
  source: "adzuna" | "fallback"
  message: string
}

export interface ResearchCompanyRequest {
  jobId: string
  companyUrl?: string
}

export interface ResearchCompanyResponse {
  jobId: string
  dossier: CompanyResearchDossier
  source: "openai" | "fallback"
}

export interface ResumeGenerateResponse {
  url: string
  fileName: string
  generatedAt: string
  source: "openai" | "fallback"
}
