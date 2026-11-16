"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export function Footer() {
  const { lang } = useLanguage();
  const isMy = lang === "my";

  return (
    <footer className="flex flex-col items-center justify-between gap-8 px-8 py-14 sm:flex-row">
      <Link href="/" className="flex items-center gap-2.5">
        <Image
          src="/logo.png"
          alt="JobPilot"
          width={118}
          height={40}
          className="h-8 w-auto"
        />
      </Link>
      <nav className="flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-text-secondary">
        <Link href="/dashboard" className="hover:text-text-primary">
          {isMy ? "ဒက်ရှ်ဘုတ်" : "Dashboard"}
        </Link>
        <Link href="/privacy-policy" className="hover:text-text-primary">
          {isMy ? "ကိုယ်ရေးအချက်အလက် မူဝါဒ" : "Privacy Policy"}
        </Link>
        <Link href="/terms" className="hover:text-text-primary">
          {isMy ? "စည်းကမ်းသတ်မှတ်ချက်များ" : "Terms & Conditions"}
        </Link>
      </nav>
    </footer>
  );
}
