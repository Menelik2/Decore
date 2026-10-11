"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/lib/i18n/locale-context"

export default function AboutPage() {
  const t = useTranslations()

  const values = [
    { emoji: "🌸", title: t("About.beauty"), text: t("About.beautyText") },
    { emoji: "❤️", title: t("About.love"), text: t("About.loveText") },
    { emoji: "🎉", title: t("About.celebration"), text: t("About.celebrationText") },
    { emoji: "💎", title: t("About.luxury"), text: t("About.luxuryText") },
  ]

  return (
    <div className="min-h-screen pt-24 pb-20">
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center mb-16">
        <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
          {t("About.label")}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-deep-burgundy leading-tight mb-6">
          {t("About.title")}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          {t("About.intro")}
        </p>
      </section>

      <section className="bg-muted/40 py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-deep-burgundy text-center mb-12">
            {t("About.valuesTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl bg-white border border-border p-6 text-center">
                <span className="text-3xl mb-3 block">{v.emoji}</span>
                <h3 className="font-medium text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-4xl mb-4 block">🇪🇹</span>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-deep-burgundy mb-4">
            {t("About.rootedTitle")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            {t("About.rootedText")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/designs">
              <Button size="lg">{t("About.exploreDesigns")}</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">{t("About.getInTouch")}</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
