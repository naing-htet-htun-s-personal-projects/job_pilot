"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export function CTASection({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const { lang } = useLanguage();
  const isMy = lang === "my";

  return (
    <section className="landing-hero-glow border-b border-border px-6 py-20 text-center sm:px-10 lg:py-24">
      <h2
        className={`mx-auto max-w-190 font-semibold text-text-slate ${
          isMy
            ? "text-[clamp(1.55rem,3vw,2.35rem)] leading-[1.38] tracking-normal"
            : "text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.08] tracking-[-0.04em]"
        }`}
      >
        {isMy ? (
          <>
            နိုင်ငံတကာ အလုပ်အကိုင်ရှာဖွေမှုကို
            <br className="hidden sm:block" /> ယုံကြည်မှုအပြည့်နဲ့ စတင်လိုက်ပါ
          </>
        ) : (
          <>
            Your international job search can feel
            <br className="hidden sm:block" /> a lot less overwhelming
          </>
        )}
      </h2>
      <p className="mx-auto mt-6 max-w-155 text-base leading-7 font-medium text-text-secondary">
        {isMy
          ? "ပရိုဖိုင်ဖြည့်ပြီး Resume တင်ရုံနဲ့ မိနစ်ပိုင်းအတွင်း သင့်အတွက် ကိုက်ညီတဲ့ နိုင်ငံခြားအလုပ်အကိုင်တွေကို စတင်ရှာဖွေနိုင်ပါပြီ။"
          : "Set up your profile, upload your resume, and start discovering global and remote matches in minutes."}
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
    </section>
  );
}
