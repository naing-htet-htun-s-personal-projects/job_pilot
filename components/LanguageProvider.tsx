"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import {
  LANG_COOKIE_NAME,
  translate,
  type Language,
  type TranslationKey,
} from "@/lib/i18n"

interface LanguageContextValue {
  lang: Language
  setLang: (next: Language) => void
  toggleLang: () => void
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  toggleLang: () => {},
  t: (key, params) => translate("en", key, params),
})

export function LanguageProvider({
  initialLang = "en",
  children,
}: {
  initialLang?: Language
  children: ReactNode
}) {
  const router = useRouter()
  const [lang, setLangState] = useState<Language>(initialLang)

  const setLang = useCallback(
    (next: Language) => {
      setLangState(next)
      try {
        localStorage.setItem(LANG_COOKIE_NAME, next)
      } catch {
        // Ignore storage errors
      }
      document.cookie = `${LANG_COOKIE_NAME}=${next}; path=/; max-age=31536000; SameSite=Lax`
      document.documentElement.lang = next
      router.refresh()
    },
    [router]
  )

  const toggleLang = useCallback(() => {
    setLang(lang === "en" ? "my" : "en")
  }, [lang, setLang])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) =>
      translate(lang, key, params),
    [lang]
  )

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, toggleLang, t }),
    [lang, setLang, toggleLang, t]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext)
}
