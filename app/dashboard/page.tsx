import { Navbar } from "@/components/layout/Navbar";
import { PosthogIdentify } from "@/components/PosthogIdentify";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import {
  CompanyResearchChart,
  JobsOverTimeChart,
  MatchDistributionChart,
} from "@/components/dashboard/AnalyticsCharts";
import type {
  ActivityItem,
  DailyCountPoint,
  DashboardAgentRun,
  DashboardJob,
  DashboardStats,
  MatchBucketPoint,
} from "@/components/dashboard/types";
import { createInsforgeServer, requireUser } from "@/lib/insforge-server";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function getWeekdayLabel(isoDate: string): (typeof WEEK_DAYS)[number] {
  const dayIndex = new Date(isoDate).getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
  const mappedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
  return WEEK_DAYS[mappedIndex];
}

function buildDashboardData(jobs: DashboardJob[], runs: DashboardAgentRun[]) {
  const now = Date.now();
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000;

  const jobsThisWeekList = jobs.filter((j) => new Date(j.found_at).getTime() >= oneWeekAgo);
  const jobsLastWeekList = jobs.filter((j) => {
    const t = new Date(j.found_at).getTime();
    return t >= twoWeeksAgo && t < oneWeekAgo;
  });

  const jobsDeltaPercent =
    jobsLastWeekList.length > 0
      ? ((jobsThisWeekList.length - jobsLastWeekList.length) / jobsLastWeekList.length) * 100
      : null;

  const scoredJobs = jobs.filter((j): j is DashboardJob & { match_score: number } => typeof j.match_score === "number");
  const avgMatchRate =
    scoredJobs.length > 0
      ? Math.round(scoredJobs.reduce((sum, j) => sum + j.match_score, 0) / scoredJobs.length)
      : 0;

  const thisWeekScored = jobsThisWeekList.filter(
    (j): j is DashboardJob & { match_score: number } => typeof j.match_score === "number"
  );
  const lastWeekScored = jobsLastWeekList.filter(
    (j): j is DashboardJob & { match_score: number } => typeof j.match_score === "number"
  );

  const thisWeekAvg =
    thisWeekScored.length > 0
      ? thisWeekScored.reduce((sum, j) => sum + j.match_score, 0) / thisWeekScored.length
      : null;
  const lastWeekAvg =
    lastWeekScored.length > 0
      ? lastWeekScored.reduce((sum, j) => sum + j.match_score, 0) / lastWeekScored.length
      : null;

  const matchDeltaPercent =
    thisWeekAvg !== null && lastWeekAvg !== null && lastWeekAvg > 0
      ? thisWeekAvg - lastWeekAvg
      : null;

  const researchedJobs = jobs.filter((j) => j.company_research !== null);
  const uniqueResearchedCompanies = new Set(
    researchedJobs.map((j) => j.company.trim().toLowerCase()).filter(Boolean)
  );

  const stats: DashboardStats = {
    totalJobs: jobs.length,
    jobsDeltaPercent,
    avgMatchRate,
    matchDeltaPercent,
    companiesResearched: uniqueResearchedCompanies.size,
    jobsThisWeek: jobsThisWeekList.length,
  };

  // Build Recent Activity (merge agent runs + researched companies, newest first, max 5)
  const runActivities: ActivityItem[] = runs.map((run) => {
    const count = run.jobs_found ?? 0;
    const roleLabel = run.job_title_searched?.trim() || "matching roles";
    return {
      id: `run-${run.id}`,
      title: count > 0 ? `Found ${count} ${count === 1 ? "job" : "jobs"} for ${roleLabel}` : `Searched for ${roleLabel}`,
      timestamp: run.completed_at ?? run.started_at,
      tone: count >= 10 ? "success" : "accent",
    };
  });

  const researchActivities: ActivityItem[] = researchedJobs.map((job) => ({
    id: `research-${job.id}`,
    title: `Researched ${job.company}`,
    timestamp: job.found_at,
    tone: "info",
  }));

  const recentActivity = [...runActivities, ...researchActivities]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  // Build Mon-Sun datasets for this week (fallback to all jobs if none this week)
  const trendSource = jobsThisWeekList.length > 0 ? jobsThisWeekList : jobs;
  const jobsByDayMap = new Map<string, number>(WEEK_DAYS.map((d) => [d, 0]));
  for (const job of trendSource) {
    const day = getWeekdayLabel(job.found_at);
    jobsByDayMap.set(day, (jobsByDayMap.get(day) ?? 0) + 1);
  }
  const jobsOverTime: DailyCountPoint[] = WEEK_DAYS.map((day) => ({
    day,
    count: jobsByDayMap.get(day) ?? 0,
  }));

  const researchSource = researchedJobs.filter((j) => new Date(j.found_at).getTime() >= oneWeekAgo);
  const researchDataset = researchSource.length > 0 ? researchSource : researchedJobs;
  const researchByDayMap = new Map<string, number>(WEEK_DAYS.map((d) => [d, 0]));
  for (const job of researchDataset) {
    const day = getWeekdayLabel(job.found_at);
    researchByDayMap.set(day, (researchByDayMap.get(day) ?? 0) + 1);
  }
  const companyResearchOverTime: DailyCountPoint[] = WEEK_DAYS.map((day) => ({
    day,
    count: researchByDayMap.get(day) ?? 0,
  }));

  const buckets: MatchBucketPoint[] = [
    { range: "50-60%", count: 0 },
    { range: "60-70%", count: 0 },
    { range: "70-80%", count: 0 },
    { range: "80-90%", count: 0 },
    { range: "90-100%", count: 0 },
  ];

  for (const job of scoredJobs) {
    const score = job.match_score;
    if (score >= 50 && score < 60) buckets[0].count += 1;
    else if (score >= 60 && score < 70) buckets[1].count += 1;
    else if (score >= 70 && score < 80) buckets[2].count += 1;
    else if (score >= 80 && score < 90) buckets[3].count += 1;
    else if (score >= 90 && score <= 100) buckets[4].count += 1;
  }

  return {
    stats,
    recentActivity,
    companyResearchOverTime,
    jobsOverTime,
    matchDistribution: buckets,
  };
}

export default async function DashboardPage() {
  const { user } = await requireUser();
  const insforge = await createInsforgeServer();

  const [jobsRes, runsRes] = await Promise.all([
    insforge.database
      .from("jobs")
      .select("id, title, company, match_score, company_research, found_at")
      .eq("user_id", user.id)
      .order("found_at", { ascending: false }),
    insforge.database
      .from("agent_runs")
      .select("id, status, job_title_searched, location_searched, jobs_found, started_at, completed_at")
      .eq("user_id", user.id)
      .order("started_at", { ascending: false })
      .limit(10),
  ]);

  const jobs = (jobsRes.data ?? []) as DashboardJob[];
  const runs = (runsRes.data ?? []) as DashboardAgentRun[];

  const { stats, recentActivity, companyResearchOverTime, jobsOverTime, matchDistribution } =
    buildDashboardData(jobs, runs);

  return (
    <main className="min-h-screen bg-background text-text-primary">
      <PosthogIdentify userId={user.id} />
      <Navbar isAuthenticated />

      <div className="mx-auto max-w-270 space-y-5 px-5 py-8 sm:px-8">
        <StatsBar stats={stats} />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <RecentActivity items={recentActivity} />
          <CompanyResearchChart data={companyResearchOverTime} />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <JobsOverTimeChart data={jobsOverTime} />
          </div>
          <div className="lg:col-span-5">
            <MatchDistributionChart data={matchDistribution} />
          </div>
        </div>
      </div>
    </main>
  );
}
