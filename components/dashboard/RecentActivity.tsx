"use client";

import Link from "next/link";
import { Activity, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import type { ActivityItem } from "./types";

interface RecentActivityProps {
  items: ActivityItem[];
}

function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  if (Number.isNaN(diffMs) || diffMs < 0) return "Just now";

  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} ${minutes === 1 ? "min" : "mins"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getDotClasses(tone: ActivityItem["tone"]): string {
  switch (tone) {
    case "info":
      return "bg-info-medium ring-info-light";
    case "success":
      return "bg-success ring-success-light";
    case "accent":
    default:
      return "bg-accent ring-accent-light";
  }
}

export function RecentActivity({ items }: RecentActivityProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col rounded-xl border border-border bg-surface shadow-card">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-base font-semibold text-text-primary">{t("dashboard.recentActivity")}</h2>
      </div>

      {items.length === 0 ? (
        <div className="flex grow flex-col items-center justify-center px-6 py-12 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-surface-secondary text-text-muted">
            <Activity className="size-5" />
          </div>
          <p className="mt-3 text-sm font-medium text-text-primary">{t("dashboard.noActivity")}</p>
          <Link
            href="/find-jobs"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-xs font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            {t("dashboard.goFindJobs")}
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-transparent px-6 py-5">
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={item.id} className="relative flex gap-4 pb-5 last:pb-0">
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="absolute top-3.5 left-1.25 h-[calc(100%-0.5rem)] w-px bg-border"
                  />
                )}
                <span
                  aria-hidden="true"
                  className={`relative z-10 mt-1.5 size-2.5 shrink-0 rounded-full ring-4 ${getDotClasses(item.tone)}`}
                />
                <div className="min-w-0 grow">
                  <p className="truncate text-sm font-medium text-text-primary">{item.title}</p>
                  <p className="mt-0.5 text-xs text-text-muted">{formatRelativeTime(item.timestamp)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
