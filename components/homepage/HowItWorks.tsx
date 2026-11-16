"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { FeatureRows } from "./FeatureRows";
import { JobsPreview } from "./JobsPreview";

export function HowItWorks() {
  const { lang } = useLanguage();
  const isMy = lang === "my";

  const featureRows = isMy
    ? [
        {
          title: "သင့် Skill နဲ့ ကိုက်ညီတဲ့ နိုင်ငံခြားအလုပ်များ",
          description:
            "ရာထူးနဲ့ နိုင်ငံ/မြို့ (US, UK, Singapore, Remote စသဖြင့်) ရိုက်ထည့်ရှာဖွေပြီး ကိုက်ညီတဲ့ အလုပ်တွေကို တန်းစီကြည့်နိုင်ပါတယ်။",
          accent: "border-accent",
        },
        {
          title: "မလျှောက်ခင် ကုမ္ပဏီအကြောင်း ကြိုတင်လေ့လာပါ",
          description:
            "JobPilot AI က ကုမ္ပဏီရဲ့ Tech Stack၊ Culture နဲ့ အင်တာဗျူးပြင်ဆင်ရမယ့် အချက်တွေကို အလိုအလျောက် စုစည်းပေးပါတယ်။",
          accent: "border-transparent",
        },
        {
          title: "အလုပ်လျှောက်ထားမှုတိုင်းကို တစ်နေရာတည်းမှာ ထိန်းသိမ်းပါ",
          description:
            "တွေ့ရှိထားတဲ့ အလုပ်များ၊ Match Score နဲ့ Research ရလဒ်အားလုံးကို Dashboard တစ်ခုတည်းမှာ ရှင်းလင်းစွာ ကြည့်ရှုနိုင်ပါတယ်။",
          accent: "border-transparent",
        },
      ]
    : [
        {
          title: "Find international jobs that actually fit",
          description:
            "Search by role and country or remote location (US, UK, Singapore, Europe, Australia) and get scored matches you can quickly scan.",
          accent: "border-accent",
        },
        {
          title: "Know the company before you apply",
          description:
            "Stop guessing what a company is about. JobPilot researches their stack, culture, and interview prep so you apply with confidence.",
          accent: "border-transparent",
        },
        {
          title: "Keep track of every opportunity",
          description:
            "Keep a clear view of every role you've discovered, your match scores, and company dossiers in one simple dashboard.",
          accent: "border-transparent",
        },
      ];

  return (
    <section className="landing-grid border-b border-border">
      <div className="border-b border-border lg:border-r lg:border-b-0">
        <div className="px-8 py-14 sm:px-14 lg:py-16">
          <h2
            className={`max-w-95 font-semibold text-text-slate ${
              isMy
                ? "text-[clamp(1.45rem,2.5vw,2rem)] leading-[1.38] tracking-normal"
                : "text-[clamp(1.85rem,3.6vw,3rem)] leading-[1.12] tracking-[-0.04em]"
            }`}
          >
            {isMy
              ? "နိုင်ငံတကာ အလုပ်ရှာဖွေမှုကို လွယ်ကူစွာ စီမံပါ"
              : "Manage Your Global Job Search With Ease"}
          </h2>
        </div>
        <FeatureRows rows={featureRows} />
      </div>
      <div className="flex items-center justify-center bg-surface-tertiary px-6 py-14 sm:px-10">
        <JobsPreview />
      </div>
    </section>
  );
}
