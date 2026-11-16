import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createInsforgeServer } from "@/lib/insforge-server";
import { getServerLanguage } from "@/lib/i18n-server";

export default async function TermsPage() {
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
          {isMy ? "စည်းကမ်းသတ်မှတ်ချက်များ (Terms & Conditions)" : "Terms & Conditions"}
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          {isMy ? "နောက်ဆုံးပြင်ဆင်သည့်ရက်: ၂၀၂၆ ခုနှစ်" : "Last updated: 2026"}
        </p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-text-secondary">
          <section>
            <h2 className="text-base font-semibold text-text-primary">
              {isMy ? "၁။ ဝန်ဆောင်မှု ရည်ရွယ်ချက်" : "1. Purpose of Service"}
            </h2>
            <p className="mt-2">
              {isMy
                ? "JobPilot သည် နိုင်ငံခြားအလုပ်အကိုင်များနှင့် Remote အလုပ်များ ရှာဖွေရာတွင် AI ဖြင့် ကူညီပေးသော Career Copilot Tool ဖြစ်ပါသည်။ ကျွန်ုပ်တို့သည် အလုပ်အကိုင်ရှာဖွေရေး အေဂျင်စီ (Recruitment Agency) သို့မဟုတ် ဗီဇာ/အလုပ်ခန့်ထားမှု အာမခံပေးသူ မဟုတ်ပါ။"
                : "JobPilot is an AI-powered job discovery and career research assistant designed to help you find international and remote roles. JobPilot is not a recruitment agency, employer, or visa sponsor, and does not guarantee job placement."}
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-primary">
              {isMy ? "၂။ AI ရလဒ်များနှင့် တာဝန်ယူမှု" : "2. AI Insights & External Listings"}
            </h2>
            <p className="mt-2">
              {isMy
                ? "Match Score နှင့် Company Research အချက်အလက်များသည် AI ဖြင့် တွက်ချက်ပေးသော အကြံပြုချက်များသာ ဖြစ်ပါသည်။ အလုပ်လျှောက်ထားခြင်းမပြုမီ မူရင်းကုမ္ပဏီ၏ အလုပ်ခေါ်စာနှင့် စည်းကမ်းချက်များကို ကိုယ်တိုင်စစ်ဆေးရန် လိုအပ်ပါသည်။"
                : "Match scores, skill breakdowns, and company research dossiers are AI-generated guidance. External job listings link to third-party sites, and you should verify role details and eligibility directly with the employer before applying."}
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-primary">
              {isMy ? "၃။ အသုံးပြုသူ တာဝန်ဝတ္တရားများ" : "3. User Responsibilities"}
            </h2>
            <p className="mt-2">
              {isMy
                ? "အကောင့်လုံခြုံရေးကို ထိန်းသိမ်းရန်နှင့် မှန်ကန်သော ကိုယ်ရေးအချက်အလက်များသာ ထည့်သွင်းအသုံးပြုရန် အသုံးပြုသူတွင် တာဝန်ရှိပါသည်။"
                : "You are responsible for maintaining the security of your account and ensuring that information you upload or include in your resume is accurate."}
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
