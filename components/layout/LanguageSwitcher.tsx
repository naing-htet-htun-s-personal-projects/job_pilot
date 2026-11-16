"use client"

import { Languages } from "lucide-react"
import { useLanguage } from "@/components/LanguageProvider"

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

  return (
    <div
      className="inline-flex items-center rounded-md border border-border bg-background p-0.5 text-xs font-medium"
      role="group"
      aria-label="Language switcher"
    >
      <Languages className="mx-1.5 h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`rounded px-2 py-1 transition-colors ${
          lang === "en"
            ? "bg-overlay text-accent-foreground"
            : "text-text-muted hover:text-text-primary"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("my")}
        className={`rounded px-2 py-1 transition-colors ${
          lang === "my"
            ? "bg-overlay text-accent-foreground"
            : "text-text-muted hover:text-text-primary"
        }`}
      >
        MM
      </button>
    </div>
  )
}
