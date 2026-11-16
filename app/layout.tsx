import type { Metadata } from "next";
import { Inter, Noto_Sans_Myanmar } from "next/font/google";
import { LanguageProvider } from "@/components/LanguageProvider";
import { getServerLanguage } from "@/lib/i18n-server";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const notoSansMyanmar = Noto_Sans_Myanmar({
  subsets: ["myanmar"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-myanmar",
});

export const metadata: Metadata = {
  title: "JobPilot — AI Job Search & Career Copilot",
  description:
    "Discover live jobs, score your resume match with AI, research companies, and generate tailored resumes.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getServerLanguage();

  return (
    <html
      lang={lang}
      className={`${inter.variable} ${notoSansMyanmar.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <LanguageProvider initialLang={lang}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
