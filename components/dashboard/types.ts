export interface DashboardJob {
  id: string;
  title: string;
  company: string;
  match_score: number | null;
  company_research: Record<string, unknown> | null;
  found_at: string;
}

export interface DashboardAgentRun {
  id: string;
  status: "running" | "completed" | "failed";
  job_title_searched: string | null;
  location_searched: string | null;
  jobs_found: number | null;
  started_at: string;
  completed_at: string | null;
}

export interface DashboardStats {
  totalJobs: number;
  jobsDeltaPercent: number | null;
  avgMatchRate: number;
  matchDeltaPercent: number | null;
  companiesResearched: number;
  jobsThisWeek: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
  tone: "accent" | "info" | "success";
}

export interface DailyCountPoint {
  day: string;
  count: number;
}

export interface MatchBucketPoint {
  range: string;
  count: number;
}
