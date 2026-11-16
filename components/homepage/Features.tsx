"use client";

import Image from "next/image";
import { useLanguage } from "@/components/LanguageProvider";
import { FeatureRows } from "./FeatureRows";

export function Features() {
  const { lang } = useLanguage();
  const isMy = lang === "my";

  const confidenceRows = isMy
    ? [
        {
          title: "Match Score ကို ရှင်းရှင်းလင်းလင်း နားလည်ပါ",
          description:
            "မလျှောက်ခင် သင့်ပရိုဖိုင်နဲ့ အလုပ်လိုအပ်ချက် ဘယ်လောက်ကိုက်ညီလဲ၊ ဘာ Skill တွေ ထပ်ဖြည့်ဖို့လိုလဲ ကြည့်နိုင်ပါတယ်။",
          accent: "border-transparent",
        },
        {
          title: "AI စနစ်ဖြင့် အလုပ်ကိုက်ညီမှု တွက်ချက်ခြင်း",
          description:
            "ဘယ်အလုပ်က ကိုယ်နဲ့အသင့်တော်ဆုံးလဲ မှန်းဆနေစရာမလိုဘဲ JobPilot AI က ရာခိုင်နှုန်းနဲ့ အကြောင်းပြချက်ပါ တွက်ချက်ပေးပါတယ်။",
          accent: "border-success",
        },
        {
          title: "အသင့်တော်ဆုံး အလုပ်များကိုသာ အာရုံစိုက်ပါ",
          description:
            "ကိုက်ညီမှုမြင့်တဲ့ (70%+) အလုပ်တွေကို Filter စစ်ထုတ်ပြီး အချိန်ကုန်သက်သာစွာ လျှောက်ထားနိုင်ပါတယ်။",
          accent: "border-transparent",
        },
      ]
    : [
        {
          title: "Understand your match score",
          description:
            "See how your profile lines up with each role before you apply. Get a clear breakdown of matched skills and gaps.",
          accent: "border-transparent",
        },
        {
          title: "AI-Powered Job Matching",
          description:
            "Stop guessing which roles are worth applying to. JobPilot scores every opening against your actual skills so you focus on what matters.",
          accent: "border-success",
        },
        {
          title: "Focus on the right roles",
          description:
            "Filter out low-fit listings and stay focused on strong matches. Spend less time sorting and more time preparing.",
          accent: "border-transparent",
        },
      ];

  return (
    <section className="landing-grid border-b border-border">
      <div className="flex items-center justify-center bg-surface-tertiary px-6 py-14 sm:px-10 lg:border-r">
        <div className="landing-card-shadow overflow-hidden rounded-xl bg-overlay">
          <Image
            src="/images/agnet-log.png"
            alt="Agent log preview"
            width={2144}
            height={1656}
            className="h-auto w-full max-w-107.5"
          />
        </div>
      </div>
      <div>
        <div className="px-8 py-14 sm:px-14 lg:py-16">
          <h2
            className={`max-w-110 font-semibold text-text-slate ${
              isMy
                ? "text-[clamp(1.45rem,2.5vw,2rem)] leading-[1.38] tracking-normal"
                : "text-[clamp(1.85rem,3.6vw,3rem)] leading-[1.12] tracking-[-0.04em]"
            }`}
          >
            {isMy
              ? "အကြိမ်တိုင်း ယုံကြည်မှုအပြည့်နဲ့ လျှောက်ထားလိုက်ပါ"
              : "Apply With More Confidence, Every Time"}
          </h2>
        </div>
        <FeatureRows rows={confidenceRows} />
      </div>
    </section>
  );
}
