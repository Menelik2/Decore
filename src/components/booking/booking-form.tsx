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
  Upload,
  Phone,
  Mail,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { formatPrice, cn } from "@/lib/utils"
import { ImageUploader, type UploadedImage } from "@/components/shared/image-uploader"
import { UPLOAD_BUCKETS } from "@/lib/upload"
import { ETHIOPIAN_CITIES } from "@/types"

const EVENT_TYPES = [
  { id: "WEDDING", label: "Wedding", emoji: "💍", base: 35000 },
  { id: "ENGAGEMENT", label: "Engagement", emoji: "❤️", base: 18000 },
  { id: "BIRTHDAY", label: "Birthday", emoji: "🎂", base: 8000 },
  { id: "GRADUATION", label: "Graduation", emoji: "🎓", base: 10000 },
  { id: "ANNIVERSARY", label: "Anniversary", emoji: "🥂", base: 12000 },
  { id: "BABY_SHOWER", label: "Baby Shower", emoji: "👶", base: 9000 },
  { id: "CORPORATE", label: "Corporate", emoji: "🏢", base: 25000 },
  { id: "ETHIOPIAN_TRADITIONAL", label: "Ethiopian Traditional", emoji: "🇪🇹", base: 40000 },
  { id: "OTHER", label: "Other Event", emoji: "🎉", base: 15000 },
]

const SERVICES = [
  { id: "stage", label: "Stage Decoration", price: 15000, desc: "Backdrop, floral stage design" },
  { id: "entrance", label: "Entrance Decoration", price: 8000, desc: "Arch, welcome flowers" },
  { id: "table", label: "Table Decoration", price: 500, desc: "Per table centerpiece", perGuest: true },
  { id: "arrangements", label: "Flower Arrangements", price: 6000, desc: "Statement floral pieces" },
  { id: "bridal", label: "Bridal Table", price: 12000, desc: "Premium bridal table design" },
  { id: "chairs", label: "Chair Decoration", price: 150, desc: "Per chair sash/flowers", perGuest: true },
  { id: "lighting", label: "Lighting", price: 10000, desc: "Ambient & accent lighting" },
  { id: "balloons", label: "Balloon Decoration", price: 5000, desc: "Balloon arches & clusters" },
  { id: "photo", label: "Photo Area", price: 9000, desc: "Instagram-worthy photo backdrop" },
  { id: "full_venue", label: "Full Venue Decoration", price: 45000, desc: "Complete venue transformation" },
]

const STYLES = [
  { id: "CLASSIC", label: "Classic", desc: "Timeless elegance" },
  { id: "MODERN", label: "Modern", desc: "Clean & contemporary" },
  { id: "LUXURY", label: "Luxury", desc: "Opulent & refined" },
  { id: "MINIMAL", label: "Minimal", desc: "Simple & pure" },
  { id: "ETHIOPIAN_TRADITIONAL", label: "Ethiopian Traditional", desc: "Cultural heritage" },
]

const COLOR_THEMES = [
  { id: "white-gold", label: "White & Gold", colors: ["#FFFFFF", "#C9A86C"] },
  { id: "blush-rose", label: "Blush & Rose", colors: ["#D4A5A5", "#8B2942"] },
  { id: "ivory-sage", label: "Ivory & Sage", colors: ["#FDFBF7", "#A8B5A0"] },
  { id: "burgundy-cream", label: "Burgundy & Cream", colors: ["#5C1A2E", "#F5E6E8"] },
  { id: "pastel", label: "Soft Pastels", colors: ["#F5E6E8", "#D4A5A5", "#A8B5A0"] },
  { id: "vibrant", label: "Vibrant Mix", colors: ["#8B2942", "#C9A86C", "#6BCB77"] },
  { id: "custom", label: "Custom Theme", colors: ["#E8DFD8"] },
]

const STEPS = [
  { id: 1, title: "Event", icon: Sparkles },
  { id: 2, title: "Details", icon: Calendar },
  { id: 3, title: "Services", icon: ClipboardList },
  { id: 4, title: "Style", icon: Palette },
  { id: 5, title: "Contact", icon: User },
  { id: 6, title: "Review", icon: Check },
]

export function BookingForm() {
  const searchParams = useSearchParams()
  const designSlug = searchParams.get("design")

  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)

  // Step 1
  const [eventType, setEventType] = useState("")
  // Step 2
  const [eventDate, setEventDate] = useState("")
  const [eventTime, setEventTime] = useState("")
  const [venue, setVenue] = useState("")
  const [city, setCity] = useState("Addis Ababa")
  const [guestCount, setGuestCount] = useState(50)
  // Step 3
  const [services, setServices] = useState<string[]>([])
  // Step 4
  const [style, setStyle] = useState("")
  const [colorTheme, setColorTheme] = useState("")
  const [budget, setBudget] = useState("")
  const [instructions, setInstructions] = useState("")
  const [inspirationImages, setInspirationImages] = useState<UploadedImage[]>([])
  // Step 5
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")

  // Pre-select if coming from a design
  useEffect(() => {
    if (designSlug) {
      // Could map design to event type later
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
        // Approximate tables = guests / 8, chairs = guests
        if (id === "table") total += svc.price * Math.ceil(guestCount / 8)
        else if (id === "chairs") total += svc.price * guestCount
      } else {
        total += svc.price
      }
    })

    if (style === "LUXURY") total *= 1.3
    if (style === "ETHIOPIAN_TRADITIONAL") total *= 1.2
    if (style === "MINIMAL") total *= 0.9

    // Guest scale
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
          Booking Request Received
        </h2>
        <p className="text-muted-foreground mb-2">
          Thank you, {name}! We&apos;ve received your event decoration request.
        </p>
        <p className="text-lg font-medium text-foreground mb-2">
          Estimated project cost: {formatPrice(estimatedCost)}
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Our team will contact you on {phone} within 24 hours to discuss details,
          refine the quote, and schedule a consultation.
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
            New Booking
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/designs")}>
            Browse Designs
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress */}
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
                    {s.title}
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
          {/* Step 1: Event Type */}
          {step === 1 && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-deep-burgundy mb-2">
                What are you celebrating?
              </h2>
              <p className="text-muted-foreground mb-6">
                Select the type of event you need decorations for
              </p>
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
                    <span className="font-medium text-sm">{e.label}</span>
                    <span className="text-xs text-muted-foreground">
                      from {formatPrice(e.base)}
                    </span>
                  </button>
                ))}
              </div>
              {designSlug && (
                <p className="mt-4 text-sm text-primary bg-primary/5 rounded-xl px-4 py-2.5">
                  ✨ You selected a design from the gallery — we&apos;ll use it as inspiration.
                </p>
              )}
            </div>
          )}

          {/* Step 2: Event Details */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-deep-burgundy mb-2">
                  Event details
                </h2>
                <p className="text-muted-foreground mb-6">
                  When and where is your celebration?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Event Date *</Label>
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
                  <Label htmlFor="eventTime">Preferred Time</Label>
                  <Input
                    id="eventTime"
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue">Venue / Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="venue"
                    placeholder="e.g. Sheraton Addis, Sky Light Hotel, Private residence..."
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
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
                  <Label htmlFor="guests">Guest Count *</Label>
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

          {/* Step 3: Services */}
          {step === 3 && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-deep-burgundy mb-2">
                Required services
              </h2>
              <p className="text-muted-foreground mb-6">
                Select all the decoration services you need
              </p>
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
                        "mt-0.5 h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors",
                        services.includes(svc.id)
                          ? "border-primary bg-primary"
                          : "border-border"
                      )}
                    >
                      {services.includes(svc.id) && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm">{svc.label}</span>
                        <span className="text-sm text-muted-foreground shrink-0">
                          {svc.perGuest
                            ? `${formatPrice(svc.price)}/unit`
                            : formatPrice(svc.price)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{svc.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Style & Theme */}
          {step === 4 && (
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-deep-burgundy mb-2">
                  Style & theme
                </h2>
                <p className="text-muted-foreground mb-6">
                  Choose the look and feel for your event
                </p>
              </div>

              <div>
                <Label className="mb-3 block">Decoration Style *</Label>
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
                        <p className="font-medium text-sm">{s.label}</p>
                        <p className="text-xs text-muted-foreground">{s.desc}</p>
                      </div>
                      {style === s.id && <Check className="h-5 w-5 text-primary shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Color Theme</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {COLOR_THEMES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setColorTheme(t.id)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                        colorTheme === t.id
                          ? "border-primary shadow-md"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      <div className="flex gap-1">
                        {t.colors.map((c) => (
                          <div
                            key={c}
                            className="h-6 w-6 rounded-full border border-border shadow-sm"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Approximate Budget (ETB)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="e.g. 50000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Special Instructions</Label>
                <Textarea
                  id="instructions"
                  placeholder="Any specific requests, cultural requirements, must-have flowers, inspiration notes..."
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
                label="Inspiration images (optional)"
                hint="Upload photos of styles you like · max 6 images"
              />
            </div>
          )}

          {/* Step 5: Contact */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-deep-burgundy mb-2">
                  Your contact details
                </h2>
                <p className="text-muted-foreground mb-6">
                  We&apos;ll use this to confirm your booking and send the quote
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
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
                <p className="text-xs text-muted-foreground">
                  Ethiopian mobile number preferred (Telebirr / CBE ready)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
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

          {/* Step 6: Review */}
          {step === 6 && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-deep-burgundy mb-2">
                Review your request
              </h2>
              <p className="text-muted-foreground mb-6">
                Confirm the details before submitting
              </p>

              <div className="rounded-2xl border border-border bg-white p-6 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <span className="text-muted-foreground">Event</span>
                  <span className="font-medium">
                    {EVENT_TYPES.find((e) => e.id === eventType)?.label}
                  </span>
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">
                    {eventDate}
                    {eventTime ? ` · ${eventTime}` : ""}
                  </span>
                  <span className="text-muted-foreground">Venue</span>
                  <span className="font-medium">
                    {venue}, {city}
                  </span>
                  <span className="text-muted-foreground">Guests</span>
                  <span className="font-medium">{guestCount}</span>
                  <span className="text-muted-foreground">Style</span>
                  <span className="font-medium">
                    {STYLES.find((s) => s.id === style)?.label}
                    {colorTheme
                      ? ` · ${COLOR_THEMES.find((t) => t.id === colorTheme)?.label}`
                      : ""}
                  </span>
                  <span className="text-muted-foreground">Services</span>
                  <span className="font-medium">
                    {services
                      .map((id) => SERVICES.find((s) => s.id === id)?.label)
                      .join(", ")}
                  </span>
                  <span className="text-muted-foreground">Contact</span>
                  <span className="font-medium">
                    {name} · {phone}
                  </span>
                  {budget && (
                    <>
                      <span className="text-muted-foreground">Budget</span>
                      <span className="font-medium">{formatPrice(Number(budget))}</span>
                    </>
                  )}
                </div>

                {instructions && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-muted-foreground mb-1">Special instructions</p>
                    <p className="text-foreground">{instructions}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="font-medium">Estimated Project Cost</span>
                  <span className="text-2xl font-semibold text-primary">
                    {formatPrice(estimatedCost)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  This is an estimate. Final quote will be confirmed after consultation.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 1}
          className="gap-1.5"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        {step < 6 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()} className="gap-1.5">
            Continue
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="gap-1.5" size="lg">
            Request a Quote
            <Check className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Live estimate */}
      {estimatedCost > 0 && step < 6 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 sm:static sm:translate-x-0 sm:mt-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-deep-burgundy text-white px-5 py-2.5 shadow-lg text-sm font-medium">
            <span className="opacity-80">Est.</span>
            {formatPrice(estimatedCost)}
          </div>
        </div>
      )}
    </div>
  )
}
