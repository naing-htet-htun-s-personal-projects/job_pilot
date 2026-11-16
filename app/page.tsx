import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/homepage/Hero";
import { HowItWorks } from "@/components/homepage/HowItWorks";
import { Features } from "@/components/homepage/Features";
import { SuccessStory } from "@/components/homepage/SuccessStory";
import { CTASection } from "@/components/homepage/CTASection";
import { Footer } from "@/components/layout/Footer";
import { createInsforgeServer } from "@/lib/insforge-server";

export default async function Home() {
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
      <div className="**:not-[]:border-x mx-auto max-w-270 border-border bg-surface">
        <Hero isAuthenticated={isAuthenticated} />
        <HowItWorks />
        <Features />
        <SuccessStory />
        <CTASection isAuthenticated={isAuthenticated} />
        <Footer />
      </div>
    </main>
  );
}
