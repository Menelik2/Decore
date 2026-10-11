"use client"

import { useLocale } from "@/lib/i18n/locale-context"
import { localeLabels, type Locale } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"

export function LanguageSwitcher({
  className,
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  const { locale, setLocale, t } = useLocale()

  const options: Locale[] = ["am", "en"]

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full bg-fill-secondary p-0.5",
        className
      )}
      role="group"
      aria-label={t("Language.switch")}
    >
      {options.map((code) => {
        const active = locale === code
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            className={cn(
              "min-h-[32px] min-w-[36px] px-2.5 rounded-full text-[12px] font-semibold transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
              active
                ? "bg-white text-label shadow-sm"
                : "text-label-secondary hover:text-label"
            )}
            aria-pressed={active}
            aria-label={code === "am" ? t("Language.am") : t("Language.en")}
          >
            {compact ? localeLabels[code] : code === "am" ? "አማ" : "EN"}
          </button>
        )
      })}
    </div>
  )
}
