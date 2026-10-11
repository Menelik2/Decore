"use client"

import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"
import { useTranslations } from "@/lib/i18n/locale-context"

export default function RegisterPage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-deep-burgundy via-primary to-rose items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-16 left-16 text-8xl">🌸</div>
          <div className="absolute bottom-20 right-16 text-7xl">💐</div>
        </div>
        <div className="relative z-10 text-white max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 mb-10">
            <span className="text-3xl">🌸</span>
            <span className="font-serif text-3xl font-semibold tracking-tight">ዲኮር</span>
          </Link>
          <h1 className="font-serif text-4xl font-semibold leading-tight mb-4">
            {t("Auth.sideTitle")}
          </h1>
          <p className="text-white/80 text-lg leading-relaxed">
            {t("Auth.registerSideSubtitle")}
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-12 pt-24 lg:pt-12">
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-2xl">🌸</span>
              <span className="font-serif text-2xl font-semibold text-deep-burgundy">ዲኮር</span>
            </Link>
          </div>
          <h2 className="font-serif text-3xl font-semibold text-deep-burgundy mb-2">
            {t("Auth.createAccount")}
          </h2>
          <p className="text-muted-foreground mb-8">{t("Auth.registerSideSubtitle")}</p>
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
