import type { Locale } from "./config"

import am from "../../../messages/am.json"
import en from "../../../messages/en.json"

const messagesMap = {
  am,
  en,
} as const

export type Messages = typeof am

export function getMessages(locale: Locale): Messages {
  return messagesMap[locale] ?? messagesMap.am
}

/** Nested key access, e.g. t("Hero.title1") */
export function createT(messages: Messages) {
  return function t(key: string): string {
    const parts = key.split(".")
    let current: unknown = messages
    for (const part of parts) {
      if (current && typeof current === "object" && part in current) {
        current = (current as Record<string, unknown>)[part]
      } else {
        return key
      }
    }
    return typeof current === "string" ? current : key
  }
}
