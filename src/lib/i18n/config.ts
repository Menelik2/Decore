export const locales = ["am", "en"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "am"

export const localeNames: Record<Locale, string> = {
  am: "አማርኛ",
  en: "English",
}

export const localeLabels: Record<Locale, string> = {
  am: "አማ",
  en: "EN",
}
