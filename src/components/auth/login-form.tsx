"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginSchema, type LoginInput } from "@/lib/auth-schema"
import { createClient } from "@/lib/supabase/client"
import { useTranslations } from "@/lib/i18n/locale-context"

export function LoginForm() {
  const t = useTranslations()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setLoading(true)
    setServerError(null)

    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!url || !key || url.includes("your_supabase")) {
        await new Promise((r) => setTimeout(r, 800))
        setServerError(
          "Supabase is not configured yet. Add your keys to .env.local to enable real authentication. (Demo: form validated successfully)"
        )
        setLoading(false)
        return
      }

      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        setServerError(error.message)
        setLoading(false)
        return
      }

      router.push("/account")
      router.refresh()
    } catch {
      setServerError(t("Validation.somethingWrong"))
      setLoading(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {serverError && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3">
          {serverError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">{t("Auth.email")}</Label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder={t("Auth.emailPlaceholder")}
            className="pl-10"
            autoComplete="email"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">{t("Auth.password")}</Label>
          <Link
            href="/forgot-password"
            className="text-xs text-primary hover:underline"
          >
            {t("Auth.forgotPassword")}
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 pr-10"
            autoComplete="current-password"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? t("Auth.hidePassword") : t("Auth.showPassword")}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("Auth.signingIn")}
          </>
        ) : (
          t("Auth.signIn")
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t("Auth.noAccount")}{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          {t("Auth.createOne")}
        </Link>
      </p>
    </motion.form>
  )
}
