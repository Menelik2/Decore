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
import { defaultLocale, type Locale, locales } from "./config"
import { createT, getMessages, type Messages } from "./messages"

const STORAGE_KEY = "decore-locale"

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  messages: Messages
  isAmharic: boolean
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function isValidLocale(value: string | null): value is Locale {
  return !!value && locales.includes(value as Locale)
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isValidLocale(stored)) {
      setLocaleState(stored)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.lang = locale
    // Improve Amharic typography
    document.documentElement.dataset.locale = locale
  }, [locale, mounted])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const messages = useMemo(() => getMessages(locale), [locale])
  const t = useMemo(() => createT(messages), [messages])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      messages,
      isAmharic: locale === "am",
    }),
    [locale, setLocale, t, messages]
  )

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider")
  }
  return ctx
}

/** Convenience hook — returns the t() function */
export function useTranslations() {
  return useLocale().t
}
