import type { DashboardStats } from "./types";

interface StatsBarProps {
  stats: DashboardStats;
}

function formatDelta(delta: number | null): { label: string; isPositive: boolean } | null {
  if (delta === null) return null;
  const rounded = Math.round(delta);
  return {
    label: `${rounded >= 0 ? "+" : ""}${rounded}%`,
    isPositive: rounded >= 0,
  };
}

export function StatsBar({ stats }: StatsBarProps) {
  const jobsDelta = formatDelta(stats.jobsDeltaPercent);
  const matchDelta = formatDelta(stats.matchDeltaPercent);

  return (
    <section aria-label="Dashboard statistics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
        <p className="text-sm font-medium text-text-secondary">Total Jobs Found</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-text-primary tabular-nums">
          {stats.totalJobs.toLocaleString()}
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs">
          {jobsDelta ? (
            <>
              <span
                className={
                  jobsDelta.isPositive
                    ? "rounded-md bg-success-lightest px-1.5 py-0.5 font-semibold text-success-dark"
                    : "rounded-md bg-surface-secondary px-1.5 py-0.5 font-semibold text-text-secondary"
                }
              >
                {jobsDelta.label}
              </span>
              <span className="text-text-muted">vs last week</span>
            </>
          ) : (
            <span className="text-text-muted">All time total</span>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
        <p className="text-sm font-medium text-text-secondary">Avg. Match Rate</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-text-primary tabular-nums">
          {stats.avgMatchRate}%
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs">
          {matchDelta ? (
            <>
              <span
                className={
                  matchDelta.isPositive
                    ? "rounded-md bg-success-lightest px-1.5 py-0.5 font-semibold text-success-dark"
                    : "rounded-md bg-surface-secondary px-1.5 py-0.5 font-semibold text-text-secondary"
                }
              >
                {matchDelta.label}
              </span>
              <span className="text-text-muted">vs last week</span>
            </>
          ) : (
            <span className="text-text-muted">Across matched jobs</span>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
        <p className="text-sm font-medium text-text-secondary">Companies Researched</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-text-primary tabular-nums">
          {stats.companiesResearched.toLocaleString()}
        </p>
        <p className="mt-3 text-xs text-text-muted">Total researched</p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
        <p className="text-sm font-medium text-text-secondary">Jobs This Week</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-text-primary tabular-nums">
          {stats.jobsThisWeek.toLocaleString()}
        </p>
        <p className="mt-3 text-xs text-text-muted">New this week</p>
      </div>
    </section>
  );
}
