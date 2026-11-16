"use client";

import { BarChart3, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLanguage } from "@/components/LanguageProvider";
import type { DailyCountPoint, MatchBucketPoint } from "./types";

interface CompanyResearchChartProps {
  data: DailyCountPoint[];
}

interface JobsOverTimeChartProps {
  data: DailyCountPoint[];
}

interface MatchDistributionChartProps {
  data: MatchBucketPoint[];
}

function ChartEmptyState({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: typeof BarChart3;
}) {
  return (
    <div className="flex h-64 flex-col items-center justify-center text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-surface-secondary text-text-muted">
        <Icon className="size-5" />
      </div>
      <p className="mt-3 text-sm font-medium text-text-primary">{title}</p>
      <p className="mt-1 max-w-xs text-xs text-text-muted">{description}</p>
    </div>
  );
}

const tooltipContentStyle = {
  backgroundColor: "var(--color-surface)",
  borderColor: "var(--color-border)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "var(--color-text-primary)",
  boxShadow: "var(--shadow-card)",
};

export function CompanyResearchChart({ data }: CompanyResearchChartProps) {
  const { t } = useLanguage();
  const hasData = data.some((d) => d.count > 0);

  return (
    <div className="flex flex-col rounded-xl border border-border bg-surface p-6 shadow-card">
      <h2 className="text-base font-semibold text-text-primary">{t("dashboard.charts.research")}</h2>

      {!hasData ? (
        <ChartEmptyState
          icon={BarChart3}
          title={t("dashboard.charts.noData")}
          description={t("dashboard.noActivity")}
        />
      ) : (
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                dy={8}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "var(--color-surface-secondary)" }}
                contentStyle={tooltipContentStyle}
                formatter={(value) => [Number(value ?? 0), "Companies"]}
              />
              <Bar
                dataKey="count"
                fill="var(--color-info-medium)"
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export function JobsOverTimeChart({ data }: JobsOverTimeChartProps) {
  const { t } = useLanguage();
  const hasData = data.some((d) => d.count > 0);

  return (
    <div className="flex flex-col rounded-xl border border-border bg-surface p-6 shadow-card">
      <h2 className="text-base font-semibold text-text-primary">{t("dashboard.charts.overTime")}</h2>

      {!hasData ? (
        <ChartEmptyState
          icon={TrendingUp}
          title={t("dashboard.charts.noData")}
          description={t("dashboard.noActivity")}
        />
      ) : (
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="jobsFoundGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                dy={8}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={tooltipContentStyle}
                formatter={(value) => [Number(value ?? 0), "Jobs Found"]}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="var(--color-accent)"
                strokeWidth={2.5}
                fill="url(#jobsFoundGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export function MatchDistributionChart({ data }: MatchDistributionChartProps) {
  const { t } = useLanguage();
  const hasData = data.some((d) => d.count > 0);

  return (
    <div className="flex flex-col rounded-xl border border-border bg-surface p-6 shadow-card">
      <h2 className="text-base font-semibold text-text-primary">{t("dashboard.charts.matchDist")}</h2>

      {!hasData ? (
        <ChartEmptyState
          icon={BarChart3}
          title={t("dashboard.charts.noData")}
          description={t("dashboard.noActivity")}
        />
      ) : (
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
              <XAxis
                dataKey="range"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
                dy={8}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "var(--color-surface-secondary)" }}
                contentStyle={tooltipContentStyle}
                formatter={(value) => [Number(value ?? 0), "Jobs"]}
              />
              <Bar
                dataKey="count"
                fill="var(--color-success-alt)"
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
