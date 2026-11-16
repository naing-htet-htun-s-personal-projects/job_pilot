import { cookies } from "next/headers"
import { LANG_COOKIE_NAME, translate, type Language, type TranslationKey } from "@/lib/i18n"

export async function getServerLanguage(): Promise<Language> {
  try {
    const cookieStore = await cookies()
    const value = cookieStore.get(LANG_COOKIE_NAME)?.value
    return value === "my" ? "my" : "en"
  } catch {
    return "en"
  }
}

export async function getServerTranslations() {
  const lang = await getServerLanguage()
  return {
    lang,
    t: (key: TranslationKey, params?: Record<string, string | number>) =>
      translate(lang, key, params),
  }
}
