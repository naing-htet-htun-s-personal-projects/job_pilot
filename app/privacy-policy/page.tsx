import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createInsforgeServer } from "@/lib/insforge-server";
import { getServerLanguage } from "@/lib/i18n-server";

export default async function PrivacyPolicyPage() {
  const lang = await getServerLanguage();
  const isMy = lang === "my";

  let isAuthenticated = false;
  try {
    const insforge = await createInsforgeServer();
    const { data } = await insforge.auth.getCurrentUser();
    isAuthenticated = Boolean(data?.user);
  } catch {
    isAuthenticated = false;
  }

  return (
    <main className="min-h-screen bg-surface text-text-primary">
      <Navbar isAuthenticated={isAuthenticated} />
      <div className="mx-auto max-w-270 border-x border-border px-6 py-12 sm:px-10">
        <Link
          href="/"
          className="text-sm font-medium text-accent hover:underline"
        >
          ← {isMy ? "ပင်မစာမျက်နှာသို့" : "Back to Home"}
        </Link>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-text-primary">
          {isMy ? "ကိုယ်ရေးအချက်အလက် မူဝါဒ (Privacy Policy)" : "Privacy Policy"}
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          {isMy ? "နောက်ဆုံးပြင်ဆင်သည့်ရက်: ၂၀၂၆ ခုနှစ်" : "Last updated: 2026"}
        </p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-text-secondary">
          <section>
            <h2 className="text-base font-semibold text-text-primary">
              {isMy ? "၁။ ကျွန်ုပ်တို့ စုဆောင်းသော အချက်အလက်များ" : "1. Information We Collect"}
            </h2>
            <p className="mt-2">
              {isMy
                ? "JobPilot သည် နိုင်ငံတကာနှင့် Remote အလုပ်အကိုင်များ ရှာဖွေပေးနိုင်ရန် သင်ဖြည့်သွင်းသော အမည်၊ အီးမေးလ်၊ လုပ်ငန်းအတွေ့အလက်၊ Skill များနှင့် Upload တင်သော Resume PDF ဖိုင်တို့ကိုသာ သိမ်းဆည်းပါသည်။"
                : "JobPilot stores only the information you provide to help discover international and remote job opportunities, including your name, email (via Google/GitHub OAuth), career profile, skills, and uploaded resume PDF."}
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-primary">
              {isMy ? "၂။ အချက်အလက်များကို မည်သို့အသုံးပြုသနည်း" : "2. How We Use Your Data"}
            </h2>
            <p className="mt-2">
              {isMy
                ? "သင့်ပရိုဖိုင်နှင့် Resume အချက်အလက်များကို အလုပ်ကိုက်ညီမှု (Match Score) တွက်ချက်ခြင်း၊ ကုမ္ပဏီသုတေသန ပြုလုပ်ခြင်းနှင့် Resume PDF အသစ်ထုတ်ပေးခြင်းတို့အတွက်သာ အသုံးပြုပါသည်။ ကျွန်ုပ်တို့သည် သင့်ဒေတာကို ပြင်ပသို့ ရောင်းချခြင်း မပြုပါ။"
                : "Your profile and resume data are used strictly to compute job match scores, synthesize company research dossiers, and generate tailored resumes. We never sell your personal data to third parties."}
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-primary">
              {isMy ? "၃။ ပြင်ပဝန်ဆောင်မှုများ (Third-Party Services)" : "3. Third-Party Services"}
            </h2>
            <p className="mt-2">
              {isMy
                ? "JobPilot သည် လုံခြုံသော Database/Auth အတွက် InsForge၊ နိုင်ငံတကာအလုပ်ခေါ်စာများအတွက် Adzuna API၊ AI ခွဲခြမ်းစိတ်ဖြာမှုအတွက် OpenAI နှင့် အသုံးပြုမှုတိုင်းတာရန် PostHog တို့ကို အသုံးပြုပါသည်။"
                : "JobPilot integrates with InsForge (authentication, database, storage), Adzuna API (international job listings), OpenAI (AI matching and research), and PostHog (product analytics)."}
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-primary">
              {isMy ? "၄။ ဒေတာထိန်းချုပ်ခွင့်" : "4. Your Control & Rights"}
            </h2>
            <p className="mt-2">
              {isMy
                ? "သင်သည် Profile စာမျက်နှာမှတစ်ဆင့် ကိုယ်ရေးအချက်အလက်များနှင့် Resume ကို အချိန်မရွေး ပြင်ဆင်နိုင် သို့မဟုတ် ဖျက်ပစ်နိုင်ပါသည်။"
                : "You can update or remove your profile details and resume files at any time from your Profile page."}
            </p>
          </section>
        </div>
      </div>
      <div className="mx-auto max-w-270 border-x border-t border-border bg-surface">
        <Footer />
      </div>
    </main>
  );
}
