export type Language = "en" | "my"

export const LANG_COOKIE_NAME = "jobpilot-lang"

const en = {
  // Common
  "common.loading": "Loading...",
  "common.backToJobs": "Back to Jobs",

  // Navbar
  "nav.dashboard": "Dashboard",
  "nav.findJobs": "Find Jobs",
  "nav.profile": "Profile",
  "nav.logout": "Log out",
  "nav.startFree": "Start for free",

  // Auth / Login
  "login.title": "Welcome to JobPilot",
  "login.subtitle": "Sign in to discover AI-matched jobs and company insights",
  "login.google": "Continue with Google",
  "login.github": "Continue with GitHub",
  "login.backHome": "Back to home",

  // Homepage
  "hero.badge": "AI-Powered Job Search Copilot",
  "hero.title": "Land your next role faster with AI job matching & company research",
  "hero.subtitle":
    "Upload your resume once. JobPilot discovers live openings, scores your fit, researches every company, and generates tailored resumes.",
  "hero.ctaPrimary": "Get Started Free",
  "hero.ctaSecondary": "Find Your First Match",

  // Dashboard
  "dashboard.title": "Dashboard",
  "dashboard.subtitle": "Your AI job search progress and match insights at a glance",
  "dashboard.stat.totalJobs": "Total Jobs Found",
  "dashboard.stat.avgMatch": "Avg. Match Rate",
  "dashboard.stat.researched": "Companies Researched",
  "dashboard.stat.thisWeek": "Jobs This Week",
  "dashboard.stat.vsLastWeek": "vs last week",
  "dashboard.recentActivity": "Recent Activity",
  "dashboard.noActivity": "No activity yet. Start a job search to see updates here.",
  "dashboard.goFindJobs": "Find Jobs",
  "dashboard.charts.research": "Company Research Coverage",
  "dashboard.charts.overTime": "Jobs Discovered This Week",
  "dashboard.charts.matchDist": "Match Score Distribution",
  "dashboard.charts.noData": "No data available yet",

  // Find Jobs
  "findJobs.title": "Find Jobs",
  "findJobs.subtitle": "Discover live roles and score them against your profile",
  "findJobs.jobTitleLabel": "JOB TITLE",
  "findJobs.jobTitlePlaceholder": "Frontend Engineer",
  "findJobs.locationLabel": "LOCATION",
  "findJobs.locationPlaceholder": "Remote, New York...",
  "findJobs.searchBtn": "Find Jobs",
  "findJobs.searchingBtn": "Searching...",
  "findJobs.filterPlaceholder": "Filter by company or role...",
  "findJobs.tab.all": "All Matches",
  "findJobs.tab.high": "High Match (70%+)",
  "findJobs.tab.low": "Low Match (<70%)",
  "findJobs.sort.matchScore": "Match Score",
  "findJobs.sort.newest": "Newest",
  "findJobs.sort.oldest": "Oldest",
  "findJobs.col.company": "COMPANY",
  "findJobs.col.role": "ROLE",
  "findJobs.col.matchScore": "MATCH SCORE",
  "findJobs.col.salary": "SALARY EST.",
  "findJobs.col.source": "SOURCE",
  "findJobs.col.dateFound": "DATE FOUND",
  "findJobs.emptyTitle": "No jobs found yet",
  "findJobs.emptyDesc": "Enter a job title above and click Find Jobs to discover matching roles.",
  "findJobs.showing": "Showing {from} to {to} of {total} results",
  "findJobs.prev": "Previous",
  "findJobs.next": "Next",

  // Job Details
  "jobDetails.viewPost": "View Job Post",
  "jobDetails.applyNow": "Apply Now",
  "jobDetails.salary": "Salary Est.",
  "jobDetails.location": "Location",
  "jobDetails.jobType": "Job Type",
  "jobDetails.dateFound": "Date Found",
  "jobDetails.notSpecified": "Not specified",
  "jobDetails.matchReasoning": "AI Match Reasoning",
  "jobDetails.skillsTitle": "Required Skills vs Your Profile",
  "jobDetails.matchedSkills": "Matched Skills",
  "jobDetails.missingSkills": "Missing Skills",
  "jobDetails.none": "None",
  "jobDetails.descriptionTitle": "Job Description",
  "jobDetails.aboutRole": "About the Role",
  "jobDetails.responsibilities": "Responsibilities",
  "jobDetails.requirements": "Requirements",
  "jobDetails.niceToHave": "Nice to Have",
  "jobDetails.benefits": "Benefits",
  "jobDetails.researchTitle": "Company Research",
  "jobDetails.researchBtn": "Research Company",
  "jobDetails.researchingBtn": "Researching...",
  "jobDetails.researchEmpty":
    "Run AI company research to generate a tailored dossier with tech stack, culture, and interview prep.",
  "jobDetails.dossier.overview": "Company Overview",
  "jobDetails.dossier.techStack": "Tech Stack",
  "jobDetails.dossier.culture": "Culture & Values",
  "jobDetails.dossier.whyRole": "Why This Role Fits",
  "jobDetails.dossier.yourEdge": "Your Edge",
  "jobDetails.dossier.gaps": "Gaps to Address",
  "jobDetails.dossier.questions": "Smart Questions to Ask",
  "jobDetails.dossier.prep": "Interview Prep",

  // Profile
  "profile.title": "Profile",
  "profile.subtitle": "Manage your profile and resume",
  "profile.saveBtn": "Save Profile",
  "profile.savingBtn": "Saving...",
  "profile.savedToast": "Profile saved successfully",
  "profile.attentionTitle": "Profile Completion",
  "profile.attentionComplete": "Your profile is complete and ready for AI matching!",
  "profile.attentionMissing": "Complete these fields for better job matches:",
  "profile.resumeTitle": "Resume",
  "profile.resumeDrop": "Click to upload or drag and drop",
  "profile.resumePdfOnly": "PDF only (max 5MB)",
  "profile.resumeSelect": "Select Resume",
  "profile.resumeExtract": "Extract from Resume",
  "profile.resumeGenerate": "Generate Resume from Profile",
  "profile.section.personal": "Personal Info",
  "profile.section.professional": "Professional Info",
  "profile.section.experience": "Work Experience",
  "profile.section.education": "Education",
  "profile.section.preferences": "Job Preferences",
} as const

export type TranslationKey = keyof typeof en

const my: Record<TranslationKey, string> = {
  // Common
  "common.loading": "ခဏစောင့်ပါ...",
  "common.backToJobs": "အလုပ်စာရင်းသို့ ပြန်သွားရန်",

  // Navbar
  "nav.dashboard": "ဒက်ရှ်ဘုတ်",
  "nav.findJobs": "အလုပ်ရှာရန်",
  "nav.profile": "ပရိုဖိုင်",
  "nav.logout": "ထွက်မည်",
  "nav.startFree": "အခမဲ့ စတင်မည်",

  // Auth / Login
  "login.title": "JobPilot မှ ကြိုဆိုပါတယ်",
  "login.subtitle": "AI အလုပ်ရှာဖွေရေးနဲ့ ကုမ္ပဏီသုတေသနများ သုံးရန် ဝင်ရောက်ပါ",
  "login.google": "Google ဖြင့် ဝင်မည်",
  "login.github": "GitHub ဖြင့် ဝင်မည်",
  "login.backHome": "ပင်မစာမျက်နှာသို့",

  // Homepage
  "hero.badge": "AI အလုပ်ရှာဖွေရေး လက်ထောက်",
  "hero.title": "AI Job Matching နဲ့ ကုမ္ပဏီသုတေသနတွေနဲ့ အလုပ်သစ်ကို မြန်မြန်ရယူလိုက်ပါ",
  "hero.subtitle":
    "Resume ကို တစ်ခါတည်းတင်ထားရုံပါပဲ။ JobPilot က အလုပ်ခေါ်စာတွေရှာပေးပြီး ကိုက်ညီမှုရာခိုင်နှုန်းတွက်ပေးကာ ကုမ္ပဏီအချက်အလက်တွေပါ စုစည်းပေးပါတယ်။",
  "hero.ctaPrimary": "အခမဲ့ စတင်မည်",
  "hero.ctaSecondary": "ပထမဆုံး အလုပ်ရှာမည်",

  // Dashboard
  "dashboard.title": "ဒက်ရှ်ဘုတ်",
  "dashboard.subtitle": "သင့် AI အလုပ်ရှာဖွေမှု တိုးတက်မှုနှင့် ကိုက်ညီမှုအခြေအနေများ",
  "dashboard.stat.totalJobs": "တွေ့ရှိထားသော အလုပ်များ",
  "dashboard.stat.avgMatch": "ပျမ်းမျှ ကိုက်ညီမှု",
  "dashboard.stat.researched": "လေ့လာပြီးသော ကုမ္ပဏီများ",
  "dashboard.stat.thisWeek": "ယခုအပတ် အလုပ်သစ်များ",
  "dashboard.stat.vsLastWeek": "ပြီးခဲ့သည့်အပတ်ထက်",
  "dashboard.recentActivity": "လတ်တလော လှုပ်ရှားမှုများ",
  "dashboard.noActivity": "လှုပ်ရှားမှု မရှိသေးပါ။ အလုပ်ရှာဖွေမှု စတင်လိုက်ပါ။",
  "dashboard.goFindJobs": "အလုပ်ရှာရန်",
  "dashboard.charts.research": "ကုမ္ပဏီ သုတေသန လွှမ်းခြုံမှု",
  "dashboard.charts.overTime": "ယခုအပတ် တွေ့ရှိသော အလုပ်များ",
  "dashboard.charts.matchDist": "Match Score ခွဲခြမ်းစိတ်ဖြာမှု",
  "dashboard.charts.noData": "ဒေတာ မရှိသေးပါ",

  // Find Jobs
  "findJobs.title": "အလုပ်ရှာရန်",
  "findJobs.subtitle": "အလုပ်အကိုင်အသစ်များ ရှာဖွေပြီး သင့်ပရိုဖိုင်နှင့် ကိုက်ညီမှုကို စစ်ဆေးပါ",
  "findJobs.jobTitleLabel": "အလုပ်ရာထူး",
  "findJobs.jobTitlePlaceholder": "Frontend Engineer",
  "findJobs.locationLabel": "တည်နေရာ",
  "findJobs.locationPlaceholder": "Remote, New York...",
  "findJobs.searchBtn": "အလုပ်ရှာမည်",
  "findJobs.searchingBtn": "ရှာဖွေနေသည်...",
  "findJobs.filterPlaceholder": "ကုမ္ပဏီ သို့မဟုတ် ရာထူးဖြင့် စစ်ထုတ်ရန်...",
  "findJobs.tab.all": "အားလုံး",
  "findJobs.tab.high": "ကိုက်ညီမှုမြင့် (70%+)",
  "findJobs.tab.low": "ကိုက်ညီမှုနည်း (<70%)",
  "findJobs.sort.matchScore": "ကိုက်ညီမှုအမှတ်",
  "findJobs.sort.newest": "အသစ်ဆုံး",
  "findJobs.sort.oldest": "အဟောင်းဆုံး",
  "findJobs.col.company": "ကုမ္ပဏီ",
  "findJobs.col.role": "ရာထူး",
  "findJobs.col.matchScore": "ကိုက်ညီမှု",
  "findJobs.col.salary": "ခန့်မှန်းလစာ",
  "findJobs.col.source": "ရင်းမြစ်",
  "findJobs.col.dateFound": "တွေ့ရှိသည့်ရက်",
  "findJobs.emptyTitle": "အလုပ်စာရင်း မရှိသေးပါ",
  "findJobs.emptyDesc": "အထက်တွင် အလုပ်ရာထူးရိုက်ထည့်ပြီး အလုပ်ရှာမည် ကို နှိပ်ပါ။",
  "findJobs.showing": "စုစုပေါင်း {total} ခုမှ {from} မှ {to} အထိ ပြသနေသည်",
  "findJobs.prev": "ရှေ့သို့",
  "findJobs.next": "နောက်သို့",

  // Job Details
  "jobDetails.viewPost": "မူရင်းကြော်ငြာကြည့်ရန်",
  "jobDetails.applyNow": "ယခုလျှောက်ထားမည်",
  "jobDetails.salary": "ခန့်မှန်းလစာ",
  "jobDetails.location": "တည်နေရာ",
  "jobDetails.jobType": "အလုပ်အမျိုးအစား",
  "jobDetails.dateFound": "တွေ့ရှိသည့်ရက်",
  "jobDetails.notSpecified": "ဖော်ပြမထားပါ",
  "jobDetails.matchReasoning": "AI ကိုက်ညီမှု သုံးသပ်ချက်",
  "jobDetails.skillsTitle": "လိုအပ်သော Skill များနှင့် သင့်ပရိုဖိုင်",
  "jobDetails.matchedSkills": "ကိုက်ညီသော Skill များ",
  "jobDetails.missingSkills": "ဖြည့်စွက်ရန် Skill များ",
  "jobDetails.none": "မရှိပါ",
  "jobDetails.descriptionTitle": "အလုပ်အကြောင်းအရာ",
  "jobDetails.aboutRole": "ရာထူးအကြောင်း",
  "jobDetails.responsibilities": "တာဝန်ဝတ္တရားများ",
  "jobDetails.requirements": "လိုအပ်ချက်များ",
  "jobDetails.niceToHave": "အပိုဆောင်း အားသာချက်များ",
  "jobDetails.benefits": "ခံစားခွင့်များ",
  "jobDetails.researchTitle": "ကုမ္ပဏီ သုတေသန",
  "jobDetails.researchBtn": "ကုမ္ပဏီအကြောင်း ရှာမည်",
  "jobDetails.researchingBtn": "သုတေသနပြုနေသည်...",
  "jobDetails.researchEmpty":
    "ကုမ္ပဏီ၏ Tech Stack၊ ယဉ်ကျေးမှုနှင့် အင်တာဗျူးပြင်ဆင်မှုများ ရယူရန် AI သုတေသနကို နှိပ်ပါ။",
  "jobDetails.dossier.overview": "ကုမ္ပဏီ အကျဉ်းချုပ်",
  "jobDetails.dossier.techStack": "နည်းပညာများ (Tech Stack)",
  "jobDetails.dossier.culture": "လုပ်ငန်းခွင် ယဉ်ကျေးမှု",
  "jobDetails.dossier.whyRole": "ဒီရာထူးနဲ့ ကိုက်ညီရတဲ့အကြောင်း",
  "jobDetails.dossier.yourEdge": "သင့်အားသာချက်များ",
  "jobDetails.dossier.gaps": "ပြင်ဆင်ထားသင့်သည့် အပိုင်းများ",
  "jobDetails.dossier.questions": "အင်တာဗျူးတွင် မေးသင့်သော မေးခွန်းများ",
  "jobDetails.dossier.prep": "အင်တာဗျူး ပြင်ဆင်ရန်",

  // Profile
  "profile.title": "ပရိုဖိုင်",
  "profile.subtitle": "သင့်ကိုယ်ရေးအချက်အလက်နှင့် Resume ကို စီမံခန့်ခွဲပါ",
  "profile.saveBtn": "ပရိုဖိုင် သိမ်းမည်",
  "profile.savingBtn": "သိမ်းနေသည်...",
  "profile.savedToast": "ပရိုဖိုင် သိမ်းဆည်းပြီးပါပြီ",
  "profile.attentionTitle": "ပရိုဖိုင် ပြည့်စုံမှု",
  "profile.attentionComplete": "သင့်ပရိုဖိုင် ပြည့်စုံပြီး AI Matching အတွက် အဆင်သင့်ဖြစ်ပါပြီ!",
  "profile.attentionMissing": "ပိုမိုတိကျသော Match ရရန် အောက်ပါအချက်များ ဖြည့်ပေးပါ:",
  "profile.resumeTitle": "Resume (ကိုယ်ရေးရာဇဝင်)",
  "profile.resumeDrop": "ဖိုင်ရွေးရန် နှိပ်ပါ သို့မဟုတ် ဆွဲထည့်ပါ",
  "profile.resumePdfOnly": "PDF ဖိုင်သာ (အများဆုံး 5MB)",
  "profile.resumeSelect": "Resume ရွေးမည်",
  "profile.resumeExtract": "Resume မှ အချက်အလက် ထုတ်ယူမည်",
  "profile.resumeGenerate": "ပရိုဖိုင်မှ Resume PDF ထုတ်မည်",
  "profile.section.personal": "ကိုယ်ရေးအချက်အလက်",
  "profile.section.professional": "လုပ်ငန်းဆိုင်ရာ အချက်အလက်",
  "profile.section.experience": "လုပ်ငန်းအတွေ့အကြုံ",
  "profile.section.education": "ပညာရေး",
  "profile.section.preferences": "အလုပ်အကိုင် ရွေးချယ်မှု",
}

export function translate(
  lang: Language,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  const dict = lang === "my" ? my : en
  let text = dict[key] ?? en[key] ?? key
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replaceAll(`{${k}}`, String(v))
    }
  }
  return text
}
