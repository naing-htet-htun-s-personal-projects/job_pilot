"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export function Hero({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const { lang } = useLanguage();
  const isMy = lang === "my";

  return (
    <section className="border-b border-border">
      <div className="landing-hero-glow border-b border-border px-6 py-16 text-center sm:px-10 sm:py-20 lg:px-16">
        <span className="mb-5 inline-flex items-center rounded-full border border-border bg-surface px-3.5 py-1 text-xs font-medium text-accent">
          {isMy
            ? "🌍 နိုင်ငံခြားအလုပ်အကိုင်နှင့် Remote အလုပ်များ ရှာဖွေရန် AI Copilot"
            : "🌍 AI Copilot for International & Remote Job Search"}
        </span>
        <h1
          className={`mx-auto max-w-180 font-semibold text-text-slate ${
            isMy
              ? "text-[clamp(1.7rem,3.5vw,2.65rem)] leading-[1.38] tracking-normal"
              : "text-[clamp(2.25rem,5.5vw,4.2rem)] leading-[1.06] tracking-[-0.04em]"
          }`}
        >
          {isMy ? (
            <>
              နိုင်ငံခြားအလုပ်ရှာဖွေခြင်းကို
              <br />
              AI နဲ့ ပိုမိုလွယ်ကူစေပါ။
            </>
          ) : (
            <>
              Job hunting abroad is hard.
              <br />
              Your tools shouldn&apos;t be.
            </>
          )}
        </h1>
        <p className="mx-auto mt-6 max-w-155 text-base leading-7 font-medium text-text-secondary">
          {isMy
            ? "နိုင်ငံတကာ (US, UK, Singapore, Europe, Australia) နဲ့ Remote အလုပ်အကိုင်တွေကို တစ်နေရာတည်းမှာ ရှာဖွေပါ။ JobPilot က သင့် Resume နဲ့ ကိုက်ညီမှုရာခိုင်နှုန်း တွက်ချက်ပေးပြီး ကုမ္ပဏီအချက်အလက်တွေကိုပါ ကြိုတင်လေ့လာပေးပါတယ်။"
            : "Built for job seekers targeting international & remote roles across the US, UK, Singapore, Europe, and beyond. JobPilot discovers live openings, scores your fit, and researches companies before you apply."}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={isAuthenticated ? "/dashboard" : "/login"}
            className="landing-button-primary"
          >
            {isAuthenticated
              ? isMy
                ? "ဒက်ရှ်ဘုတ်သို့ သွားမည်"
                : "Go to Dashboard"
              : isMy
                ? "အခမဲ့ စတင်မည်"
                : "Get Started"}{" "}
            <span aria-hidden="true">▶</span>
          </Link>
          <Link href="/find-jobs" className="landing-button-secondary">
            {isMy ? "ပထမဆုံး အလုပ်ရှာမည်" : "Find Your First Match"}
          </Link>
        </div>
      </div>
      <div className="bg-surface-tertiary px-5 py-12 sm:px-10 lg:px-14">
        <div className="landing-browser-shadow mx-auto max-w-230 overflow-hidden rounded-[26px] border border-border bg-surface">
          <div className="flex h-10 items-center justify-between border-b border-border px-5">
            <div className="flex gap-2">
              <span className="size-2 rounded-full bg-border-light" />
              <span className="size-2 rounded-full bg-border-light" />
              <span className="size-2 rounded-full bg-border-light" />
            </div>
            <div className="flex h-6 w-[38%] items-center justify-center rounded-md bg-surface-secondary text-xs font-medium text-text-muted">
              jobpilot.ai/dashboard
            </div>
            <div className="w-16" />
          </div>
          <Image
            src="/images/dashboard-demo.png"
            alt="JobPilot dashboard preview"
            width={4788}
            height={2416}
            className="h-auto w-full"
            priority
          />
        </div>
      </div>
    </section>
  );
}
