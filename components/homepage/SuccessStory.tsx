"use client";

import Image from "next/image";
import { useLanguage } from "@/components/LanguageProvider";

export function SuccessStory() {
  const { lang } = useLanguage();
  const isMy = lang === "my";

  return (
    <section className="border-b border-border px-6 py-20 text-center sm:px-12 lg:py-24">
      <p className="text-xs font-semibold tracking-[0.22em] text-accent uppercase">
        {isMy ? "အသုံးပြုသူ အတွေ့အကြုံ" : "Success Stories"}
      </p>
      <blockquote
        className={`mx-auto mt-7 max-w-190 font-medium text-text-slate-medium ${
          isMy
            ? "text-[clamp(1.15rem,2vw,1.55rem)] leading-[1.6] tracking-normal"
            : "text-[clamp(1.4rem,2.8vw,2.2rem)] leading-[1.3] tracking-[-0.03em]"
        }`}
      >
        {isMy
          ? "“အရင်က ညနေတိုင်း Resume ပြင်လိုက် အလုပ်လျှောက်လိုက်နဲ့ အချိန်ကုန်နေခဲ့တာ။ အခုတော့ JobPilot က ကိုယ်နဲ့ကိုက်တဲ့ နိုင်ငံခြားအလုပ်တွေနဲ့ ကုမ္ပဏီအချက်အလက်တွေပါ စုပေးလို့ အင်တာဗျူးတွေ တန်းစီဝင်လာတယ်။”"
          : "“I used to spend my evenings copy-pasting resumes. Now I open my dashboard to see high-match international roles and research waiting. Had 3 offers on the table simultaneously.”"}
      </blockquote>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Image
          src="/images/user-icon.png"
          alt="Tom Wilson"
          width={48}
          height={48}
          className="size-12 rounded-full"
        />
        <div className="text-left">
          <p className="text-sm font-semibold text-text-primary">Tom Wilson</p>
          <p className="text-xs font-medium text-text-secondary">
            {isMy ? "Software Developer" : "Junior Developer"}
          </p>
        </div>
      </div>
    </section>
  );
}
