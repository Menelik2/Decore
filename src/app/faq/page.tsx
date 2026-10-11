"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/lib/i18n/locale-context"

function FaqItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string
  a: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className="border border-border rounded-2xl bg-white overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="font-medium text-sm sm:text-base text-foreground">{q}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground shrink-0 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FaqPage() {
  const t = useTranslations()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    { q: t("FAQ.q1"), a: t("FAQ.a1") },
    { q: t("FAQ.q2"), a: t("FAQ.a2") },
    { q: t("FAQ.q3"), a: t("FAQ.a3") },
    { q: t("FAQ.q4"), a: t("FAQ.a4") },
    { q: t("FAQ.q5"), a: t("FAQ.a5") },
    { q: t("FAQ.q6"), a: t("FAQ.a6") },
    { q: t("FAQ.q7"), a: t("FAQ.a7") },
    { q: t("FAQ.q8"), a: t("FAQ.a8") },
  ]

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
            {t("FAQ.label")}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-deep-burgundy mb-3">
            {t("FAQ.title")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t("FAQ.subtitle")}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((item, i) => (
            <FaqItem
              key={i}
              q={item.q}
              a={item.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        <div className="mt-12 text-center rounded-2xl border border-border bg-white p-8">
          <p className="font-medium text-foreground mb-2">{t("FAQ.stillQuestions")}</p>
          <p className="text-sm text-muted-foreground mb-5">
            {t("FAQ.stillHint")}
          </p>
          <Link href="/contact">
            <Button>{t("FAQ.contactUs")}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
