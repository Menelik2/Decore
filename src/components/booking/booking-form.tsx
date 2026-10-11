"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Calendar,
  MapPin,
  Users,
  Palette,
  Sparkles,
  ClipboardList,
  User,
  Phone,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { formatPrice, cn } from "@/lib/utils"
import { ImageUploader, type UploadedImage } from "@/components/shared/image-uploader"
import { UPLOAD_BUCKETS } from "@/lib/upload"
import { ETHIOPIAN_CITIES } from "@/types"
import { useTranslations } from "@/lib/i18n/locale-context"

const EVENT_TYPES = [
  { id: "WEDDING", emoji: "💍", base: 35000 },
  { id: "ENGAGEMENT", emoji: "❤️", base: 18000 },
  { id: "BIRTHDAY", emoji: "🎂", base: 8000 },
  { id: "GRADUATION", emoji: "🎓", base: 10000 },
  { id: "ANNIVERSARY", emoji: "🥂", base: 12000 },
  { id: "BABY_SHOWER", emoji: "👶", base: 9000 },
  { id: "CORPORATE", emoji: "🏢", base: 25000 },
  { id: "ETHIOPIAN_TRADITIONAL", emoji: "🇪🇹", base: 40000 },
  { id: "OTHER", emoji: "🎉", base: 15000 },
]

const SERVICES = [
  { id: "stage", price: 15000, perGuest: false },
  { id: "entrance", price: 8000, perGuest: false },
  { id: "table", price: 500, perGuest: true },
  { id: "arrangements", price: 6000, perGuest: false },
  { id: "bridal", price: 12000, perGuest: false },
  { id: "chairs", price: 150, perGuest: true },
  { id: "lighting", price: 10000, perGuest: false },
  { id: "balloons", price: 5000, perGuest: false },
  { id: "photo", price: 9000, perGuest: false },
  { id: "full_venue", price: 45000, perGuest: false },
]

const STYLES = [
  { id: "CLASSIC" },
  { id: "MODERN" },
  { id: "LUXURY" },
  { id: "MINIMAL" },
  { id: "ETHIOPIAN_TRADITIONAL" },
]

const COLOR_THEMES = [
  { id: "white-gold", colors: ["#FFFFFF", "#C9A86C"] },
  { id: "blush-rose", colors: ["#D4A5A5", "#8B2942"] },
  { id: "ivory-sage", colors: ["#FDFBF7", "#A8B5A0"] },
  { id: "burgundy-cream", colors: ["#5C1A2E", "#F5E6E8"] },
  { id: "pastel", colors: ["#F5E6E8", "#D4A5A5", "#A8B5A0"] },
  { id: "vibrant", colors: ["#8B2942", "#C9A86C", "#6BCB77"] },
  { id: "custom", colors: ["#E8DFD8"] },
]

const STEPS = [
  { id: 1, titleKey: "stepEvent", icon: Sparkles },
  { id: 2, titleKey: "stepDetails", icon: Calendar },
  { id: 3, titleKey: "stepServices", icon: ClipboardList },
  { id: 4, titleKey: "stepStyle", icon: Palette },
  { id: 5, titleKey: "stepContact", icon: User },
  { id: 6, titleKey: "stepReview", icon: Check },
]

export function BookingForm() {
  const t = useTranslations()
  const searchParams = useSearchParams()
  const designSlug = searchParams.get("design")

  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [eventType, setEventType] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [eventTime, setEventTime] = useState("")
  const [venue, setVenue] = useState("")
  const [city, setCity] = useState("Addis Ababa")
  const [guestCount, setGuestCount] = useState(50)
  const [services, setServices] = useState<string[]>([])
  const [style, setStyle] = useState("")
  const [colorTheme, setColorTheme] = useState("")
  const [budget, setBudget] = useState("")
  const [instructions, setInstructions] = useState("")
  const [inspirationImages, setInspirationImages] = useState<UploadedImage[]>([])
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (designSlug) {
      // design pre-select handled later
    }
  }, [designSlug])

  const estimatedCost = useMemo(() => {
    const event = EVENT_TYPES.find((e) => e.id === eventType)
    if (!event) return 0
    let total = event.base
    services.forEach((id) => {
      const svc = SERVICES.find((s) => s.id === id)
      if (!svc) return
      if (svc.perGuest) {
        if (id === "table") total += svc.price * Math.ceil(guestCount / 8)
        else if (id === "chairs") total += svc.price * guestCount
      } else {
        total += svc.price
      }
    })
    if (style === "LUXURY") total *= 1.3
    if (style === "ETHIOPIAN_TRADITIONAL") total *= 1.2
    if (style === "MINIMAL") total *= 0.9
    if (guestCount > 200) total *= 1.25
    else if (guestCount > 100) total *= 1.1
    return Math.round(total / 100) * 100
  }, [eventType, services, style, guestCount])

  const toggleService = (id: string) => {
    setServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const canNext = () => {
    switch (step) {
      case 1:
        return !!eventType
      case 2:
        return !!eventDate && !!venue && guestCount > 0
      case 3:
        return services.length > 0
      case 4:
        return !!style
      case 5:
        return name.trim().length > 1 && phone.trim().length >= 9
      case 6:
        return true
      default:
        return false
    }
  }

  const handleSubmit = () => {
    try {
      const bookings = JSON.parse(localStorage.getItem("decore-bookings") || "[]")
      bookings.unshift({
        id: `BK-${Date.now().toString(36).toUpperCase()}`,
        event_type: eventType,
        event_date: eventDate,
        event_time: eventTime || null,
        venue,
        city,
        guest_count: guestCount,
        decoration_style: style || null,
        color_theme: colorTheme || null,
        budget: budget ? Number(budget) : null,
        special_instructions: instructions || null,
        estimated_cost: estimatedCost,
        status: "PENDING",
        customer_name: name,
        customer_phone: phone,
        customer_email: email || null,
        services,
        inspiration_count: inspirationImages?.length || 0,
        created_at: new Date().toISOString(),
      })
      localStorage.setItem("decore-bookings", JSON.stringify(bookings))
    } catch {
      // ignore
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 px-4 max-w-lg mx-auto"
      >
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="font-serif text-3xl font-semibold text-deep-burgundy mb-3">
          {t("Booking.receivedTitle")}
        </h2>
        <p className="text-muted-foreground mb-2">
          {t("Checkout.placedThanks")} {name}! {t("Booking.receivedBody")}
        </p>
        <p className="text-lg font-medium text-foreground mb-2">
          {t("Booking.estimatedCost")}: {formatPrice(estimatedCost)}
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          {t("Booking.teamContact")} {phone} {t("Booking.within24")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => {
              setSubmitted(false)
              setStep(1)
              setEventType("")
              setServices([])
            }}
          >
            {t("Booking.newBooking")}
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/designs")}>
            {t("Cart.browseDesigns")}
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-[480px] sm:min-w-0">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const isActive = step === s.id
            const isDone = step > s.id
            return (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <button
                  type="button"
                  onClick={() => s.id < step && setStep(s.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 transition-colors",
                    isActive || isDone ? "text-primary" : "text-muted-foreground"
                  )}
                  disabled={s.id > step}
                >
                  <div
                    className={cn(
                      "h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                      isActive && "bg-primary text-white shadow-md",
                      isDone && "bg-primary/15 text-primary",
                      !isActive && !isDone && "bg-muted text-muted-foreground"
                    )}
                  >
                    {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium hidden sm:block">
                    {t(`Booking.${s.titleKey}`)}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-1 sm:mx-2 rounded-full transition-colors",
                      step > s.id ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
        >
          {step === 1 && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-deep-burgundy mb-2">
                {t("Booking.whatCelebrating")}
              </h2>
              <p className="text-muted-foreground mb-6">{t("Booking.selectEventType")}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {EVENT_TYPES.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => setEventType(e.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all text-center",
                      eventType === e.id
                        ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                        : "border-border bg-white hover:border-primary/40"
                    )}
                  >
                    <span className="text-3xl">{e.emoji}</span>
                    <span className="font-medium text-sm">
                      {t(`Booking.events.${e.id}`)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t("Common.from")} {formatPrice(e.base)}
                    </span>
                  </button>
                ))}
              </div>
              {designSlug && (
                <p className="mt-4 text-sm text-primary bg-primary/5 rounded-xl px-4 py-2.5">
                  ✨ {t("Booking.designInspiration")}
                </p>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-deep-burgundy mb-2">
                  {t("Booking.eventDetails")}
                </h2>
                <p className="text-muted-foreground mb-6">{t("Booking.whenWhere")}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventDate">{t("Booking.eventDate")} *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="eventDate"
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="pl-10"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventTime">{t("Booking.preferredTime")}</Label>
                  <Input
                    id="eventTime"
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="venue">{t("Booking.venue")} *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="venue"
                    placeholder={t("Booking.venuePlaceholder")}
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">{t("Checkout.city")} *</Label>
                  <select
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-input bg-white px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {ETHIOPIAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guests">{t("Booking.guestCount")} *</Label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="guests"
                      type="number"
                      min={10}
                      max={2000}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value) || 0)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-deep-burgundy mb-2">
                {t("Booking.requiredServices")}
              </h2>
              <p className="text-muted-foreground mb-6">{t("Booking.selectServices")}</p>
              <div className="space-y-3">
                {SERVICES.map((svc) => (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => toggleService(svc.id)}
                    className={cn(
                      "w-full flex items-start gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                      services.includes(svc.id)
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border bg-white hover:border-primary/40"
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0",
                        services.includes(svc.id)
                          ? "border-primary bg-primary"
                          : "border-border"
                      )}
                    >
                      {services.includes(svc.id) && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm">
                          {t(`Booking.svc.${svc.id}`)}
                        </span>
                        <span className="text-sm text-muted-foreground shrink-0">
                          {svc.perGuest
                            ? `${formatPrice(svc.price)}/unit`
                            : formatPrice(svc.price)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t(`Booking.svcDesc.${svc.id}`)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-deep-burgundy mb-2">
                  {t("Booking.styleTheme")}
                </h2>
                <p className="text-muted-foreground mb-6">{t("Booking.chooseLook")}</p>
              </div>
              <div>
                <Label className="mb-3 block">{t("Booking.decorationStyle")} *</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {STYLES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStyle(s.id)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left",
                        style === s.id
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border bg-white hover:border-primary/40"
                      )}
                    >
                      <div>
                        <p className="font-medium text-sm">{t(`Booking.styles.${s.id}`)}</p>
                        <p className="text-xs text-muted-foreground">
                          {t(`Booking.styleDesc.${s.id}`)}
                        </p>
                      </div>
                      {style === s.id && <Check className="h-5 w-5 text-primary shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="mb-3 block">{t("Booking.colorTheme")}</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {COLOR_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setColorTheme(theme.id)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                        colorTheme === theme.id
                          ? "border-primary shadow-md"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      <div className="flex gap-1">
                        {theme.colors.map((c) => (
                          <div
                            key={c}
                            className="h-6 w-6 rounded-full border border-border shadow-sm"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium">
                        {t(`Booking.themes.${theme.id}`)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">{t("Booking.budget")}</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder={t("Booking.budgetPlaceholder")}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructions">{t("Booking.specialInstructions")}</Label>
                <Textarea
                  id="instructions"
                  placeholder={t("Booking.instructionsPlaceholder")}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={4}
                />
              </div>
              <ImageUploader
                bucket={UPLOAD_BUCKETS.customer}
                folder="inspiration"
                value={inspirationImages}
                onChange={setInspirationImages}
                maxFiles={6}
                label={t("Booking.inspirationImages")}
                hint={t("Booking.inspirationHint")}
              />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-deep-burgundy mb-2">
                  {t("Booking.contactDetails")}
                </h2>
                <p className="text-muted-foreground mb-6">{t("Booking.contactHint")}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">{t("Auth.fullName")} *</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder={t("Auth.fullName")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t("Auth.phone")} *</Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+251 9XX XXX XXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">{t("Booking.phoneHint")}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("Auth.email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-deep-burgundy mb-2">
                {t("Booking.reviewTitle")}
              </h2>
              <p className="text-muted-foreground mb-6">{t("Booking.reviewHint")}</p>
              <div className="rounded-2xl border border-border bg-white p-6 space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-muted-foreground">{t("Booking.eventType")}</span>
                  <span className="font-medium">{t(`Booking.events.${eventType}`)}</span>
                  <span className="text-muted-foreground">{t("Booking.eventDate")}</span>
                  <span className="font-medium">{eventDate}</span>
                  <span className="text-muted-foreground">{t("Booking.venue")}</span>
                  <span className="font-medium">{venue}, {city}</span>
                  <span className="text-muted-foreground">{t("Booking.guests")}</span>
                  <span className="font-medium">{guestCount}</span>
                  <span className="text-muted-foreground">{t("Booking.style")}</span>
                  <span className="font-medium">{t(`Booking.styles.${style}`)}</span>
                  <span className="text-muted-foreground">{t("Booking.services")}</span>
                  <span className="font-medium">
                    {services.map((id) => t(`Booking.svc.${id}`)).join(", ")}
                  </span>
                  <span className="text-muted-foreground">{t("Booking.contact")}</span>
                  <span className="font-medium">
                    {name} · {phone}
                  </span>
                  {budget && (
                    <>
                      <span className="text-muted-foreground">{t("Booking.budgetLabel")}</span>
                      <span className="font-medium">{formatPrice(Number(budget))}</span>
                    </>
                  )}
                </div>
                {instructions && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-muted-foreground mb-1">{t("Booking.specialInstructions")}</p>
                    <p className="text-foreground">{instructions}</p>
                  </div>
                )}
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="font-medium">{t("Booking.estimatedProjectCost")}</span>
                  <span className="text-2xl font-semibold text-primary">
                    {formatPrice(estimatedCost)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{t("Booking.estimateNote")}</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 1}
          className="gap-1.5"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("Common.back")}
        </Button>
        {step < 6 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()} className="gap-1.5">
            {t("Common.next")}
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="gap-1.5" size="lg">
            {t("Booking.requestQuote")}
            <Check className="h-4 w-4" />
          </Button>
        )}
      </div>

      {estimatedCost > 0 && step < 6 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 sm:static sm:translate-x-0 sm:mt-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-deep-burgundy text-white px-5 py-2.5 shadow-lg text-sm font-medium">
            <span className="opacity-80">{t("Booking.est")}</span>
            {formatPrice(estimatedCost)}
          </div>
        </div>
      )}
    </div>
  )
}
