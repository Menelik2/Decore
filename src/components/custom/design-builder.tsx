"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Flower2,
  Palette,
  Ruler,
  Sparkles,
  Gift,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatPrice, cn } from "@/lib/utils"

const OCCASIONS = [
  { id: "WEDDING", label: "Wedding", emoji: "💍" },
  { id: "BIRTHDAY", label: "Birthday", emoji: "🎂" },
  { id: "GRADUATION", label: "Graduation", emoji: "🎓" },
  { id: "ENGAGEMENT", label: "Engagement", emoji: "❤️" },
  { id: "ANNIVERSARY", label: "Anniversary", emoji: "🥂" },
  { id: "GIFT", label: "Gift", emoji: "🎁" },
  { id: "OTHER", label: "Other", emoji: "✨" },
]

const FLOWER_TYPES = [
  { id: "ROSE", label: "Rose", emoji: "🌹", base: 800 },
  { id: "LILY", label: "Lily", emoji: "🪷", base: 900 },
  { id: "SUNFLOWER", label: "Sunflower", emoji: "🌻", base: 600 },
  { id: "ORCHID", label: "Orchid", emoji: "🌺", base: 1200 },
  { id: "TULIP", label: "Tulip", emoji: "🌷", base: 700 },
  { id: "MIXED", label: "Mixed Flowers", emoji: "💐", base: 750 },
  { id: "ETHIOPIAN_LOCAL", label: "Ethiopian / Local", emoji: "🇪🇹", base: 650 },
]

const COLORS = [
  { id: "red", label: "Red", hex: "#8B2942" },
  { id: "pink", label: "Pink", hex: "#D4A5A5" },
  { id: "white", label: "White", hex: "#FFFFFF" },
  { id: "cream", label: "Cream", hex: "#F5E6C8" },
  { id: "gold", label: "Gold", hex: "#C9A86C" },
  { id: "yellow", label: "Yellow", hex: "#FFD93D" },
  { id: "purple", label: "Purple", hex: "#9B7EBD" },
  { id: "blue", label: "Blue", hex: "#6B9AC4" },
  { id: "green", label: "Green", hex: "#A8B5A0" },
  { id: "mixed", label: "Mixed", hex: "linear-gradient(135deg,#8B2942,#C9A86C,#D4A5A5)" },
]

const SIZES = [
  { id: "SMALL", label: "Small", desc: "Intimate · 10–15 stems", multiplier: 1 },
  { id: "MEDIUM", label: "Medium", desc: "Classic · 20–30 stems", multiplier: 1.6 },
  { id: "LARGE", label: "Large", desc: "Statement · 40–50 stems", multiplier: 2.4 },
  { id: "PREMIUM", label: "Premium", desc: "Luxury · 60+ stems", multiplier: 3.5 },
]

const STYLES = [
  { id: "CLASSIC", label: "Classic", desc: "Timeless and elegant" },
  { id: "MODERN", label: "Modern", desc: "Clean and contemporary" },
  { id: "LUXURY", label: "Luxury", desc: "Opulent and refined" },
  { id: "MINIMAL", label: "Minimal", desc: "Simple and pure" },
  { id: "ETHIOPIAN_TRADITIONAL", label: "Ethiopian Traditional", desc: "Cultural heritage" },
]

const ADDONS = [
  { id: "gift_box", label: "Gift Box", price: 350 },
  { id: "chocolate", label: "Chocolate", price: 450 },
  { id: "balloon", label: "Balloon", price: 250 },
  { id: "candle", label: "Candle", price: 300 },
  { id: "greeting_card", label: "Greeting Card", price: 150 },
  { id: "custom_message", label: "Custom Message Card", price: 100 },
]

const STEPS = [
  { id: 1, title: "Occasion", icon: Sparkles },
  { id: 2, title: "Flowers", icon: Flower2 },
  { id: 3, title: "Colors", icon: Palette },
  { id: 4, title: "Size", icon: Ruler },
  { id: 5, title: "Style", icon: Sparkles },
  { id: 6, title: "Add-ons", icon: Gift },
  { id: 7, title: "Message", icon: MessageSquare },
]

export function DesignBuilder() {
  const [step, setStep] = useState(1)
  const [occasion, setOccasion] = useState("")
  const [flowerType, setFlowerType] = useState("")
  const [colors, setColors] = useState<string[]>([])
  const [size, setSize] = useState("")
  const [style, setStyle] = useState("")
  const [addons, setAddons] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const estimatedPrice = useMemo(() => {
    const flower = FLOWER_TYPES.find((f) => f.id === flowerType)
    const sizeObj = SIZES.find((s) => s.id === size)
    if (!flower || !sizeObj) return 0

    let total = flower.base * sizeObj.multiplier
    // Color complexity
    if (colors.length > 2) total *= 1.15
    // Style premium
    if (style === "LUXURY") total *= 1.25
    if (style === "ETHIOPIAN_TRADITIONAL") total *= 1.2
    // Addons
    addons.forEach((id) => {
      const addon = ADDONS.find((a) => a.id === id)
      if (addon) total += addon.price
    })
    return Math.round(total / 50) * 50 // round to nearest 50
  }, [flowerType, size, colors, style, addons])

  const canNext = () => {
    switch (step) {
      case 1: return !!occasion
      case 2: return !!flowerType
      case 3: return colors.length > 0
      case 4: return !!size
      case 5: return !!style
      case 6: return true
      case 7: return true
      default: return false
    }
  }

  const toggleColor = (id: string) => {
    setColors((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const toggleAddon = (id: string) => {
    setAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    )
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 px-4"
      >
        <div className="text-6xl mb-6">🌸</div>
        <h2 className="font-serif text-3xl font-semibold text-deep-burgundy mb-3">
          Design Request Received
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-2">
          Thank you! We&apos;ve received your custom design request.
        </p>
        <p className="text-lg font-medium text-foreground mb-8">
          Estimated price: {formatPrice(estimatedPrice)}
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Our team will contact you within 24 hours to confirm details and finalize your order.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => { setSubmitted(false); setStep(1) }}>
            Create Another
          </Button>
          <Button variant="outline" onClick={() => window.location.href = "/designs"}>
            Browse Gallery
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const isActive = step === s.id
            const isDone = step > s.id
            return (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <button
                  onClick={() => s.id < step && setStep(s.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 transition-colors",
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

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="min-h-[320px]"
        >
          {/* Step 1: Occasion */}
          {step === 1 && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-deep-burgundy mb-2">
                What&apos;s the occasion?
              </h2>
              <p className="text-muted-foreground mb-6">Select the event or purpose</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {OCCASIONS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setOccasion(o.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5",
                      occasion === o.id
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border bg-white hover:border-primary/40"
                    )}
                  >
                    <span className="text-3xl">{o.emoji}</span>
                    <span className="text-sm font-medium">{o.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Flower Type */}
          {step === 2 && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-deep-burgundy mb-2">
                Choose your flowers
              </h2>
              <p className="text-muted-foreground mb-6">Pick the main flower type</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {FLOWER_TYPES.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFlowerType(f.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5",
                      flowerType === f.id
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border bg-white hover:border-primary/40"
                    )}
                  >
                    <span className="text-2xl">
                      {f.emoji === "lily" ? "🪷" : f.emoji === "orchid" ? "🌺" : f.emoji}
                    </span>
                    <span className="text-sm font-medium">{f.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Colors */}
          {step === 3 && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-deep-burgundy mb-2">
                Select colors
              </h2>
              <p className="text-muted-foreground mb-6">
                Choose one or more colors for your arrangement
              </p>
              <div className="grid grid-cols-5 gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => toggleColor(c.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all",
                      colors.includes(c.id)
                        ? "border-primary shadow-md scale-105"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <div
                      className="h-10 w-10 rounded-full border border-border shadow-inner"
                      style={{
                        background: c.id === "mixed" ? c.hex : c.hex,
                      }}
                    />
                    <span className="text-[11px] font-medium">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Size */}
          {step === 4 && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-deep-burgundy mb-2">
                Choose size
              </h2>
              <p className="text-muted-foreground mb-6">How large should it be?</p>
              <div className="space-y-3">
                {SIZES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSize(s.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left",
                      size === s.id
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border bg-white hover:border-primary/40"
                    )}
                  >
                    <div>
                      <p className="font-medium">{s.label}</p>
                      <p className="text-sm text-muted-foreground">{s.desc}</p>
                    </div>
                    {size === s.id && (
                      <Check className="h-5 w-5 text-primary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Style */}
          {step === 5 && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-deep-burgundy mb-2">
                Decoration style
              </h2>
              <p className="text-muted-foreground mb-6">What aesthetic are you going for?</p>
              <div className="space-y-3">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left",
                      style === s.id
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border bg-white hover:border-primary/40"
                    )}
                  >
                    <div>
                      <p className="font-medium">{s.label}</p>
                      <p className="text-sm text-muted-foreground">{s.desc}</p>
                    </div>
                    {style === s.id && (
                      <Check className="h-5 w-5 text-primary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Add-ons */}
          {step === 6 && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-deep-burgundy mb-2">
                Add-ons
              </h2>
              <p className="text-muted-foreground mb-6">
                Optional extras to make it special
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ADDONS.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => toggleAddon(a.id)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left",
                      addons.includes(a.id)
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border bg-white hover:border-primary/40"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors",
                          addons.includes(a.id)
                            ? "border-primary bg-primary"
                            : "border-border"
                        )}
                      >
                        {addons.includes(a.id) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="font-medium text-sm">{a.label}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      +{formatPrice(a.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Message + Summary */}
          {step === 7 && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-deep-burgundy mb-2">
                Personal message
              </h2>
              <p className="text-muted-foreground mb-6">
                Optional note to include with your arrangement
              </p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a short message..."
                rows={4}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none mb-8"
              />

              {/* Summary card */}
              <div className="rounded-2xl border border-border bg-muted/40 p-5 space-y-3">
                <h3 className="font-medium text-foreground">Your Design Summary</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <span className="text-muted-foreground">Occasion</span>
                  <span className="font-medium capitalize">
                    {occasion.replace(/_/g, " ").toLowerCase()}
                  </span>
                  <span className="text-muted-foreground">Flowers</span>
                  <span className="font-medium">
                    {FLOWER_TYPES.find((f) => f.id === flowerType)?.label}
                  </span>
                  <span className="text-muted-foreground">Colors</span>
                  <span className="font-medium">
                    {colors.map((c) => COLORS.find((x) => x.id === c)?.label).join(", ")}
                  </span>
                  <span className="text-muted-foreground">Size</span>
                  <span className="font-medium">
                    {SIZES.find((s) => s.id === size)?.label}
                  </span>
                  <span className="text-muted-foreground">Style</span>
                  <span className="font-medium">
                    {STYLES.find((s) => s.id === style)?.label}
                  </span>
                  {addons.length > 0 && (
                    <>
                      <span className="text-muted-foreground">Add-ons</span>
                      <span className="font-medium">
                        {addons
                          .map((id) => ADDONS.find((a) => a.id === id)?.label)
                          .join(", ")}
                      </span>
                    </>
                  )}
                </div>
                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="font-medium">Estimated Price</span>
                  <span className="text-xl font-semibold text-primary">
                    {formatPrice(estimatedPrice)}
                  </span>
                </div>
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

        {step < 7 ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext()}
            className="gap-1.5"
          >
            Continue
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="gap-1.5" size="lg">
            Submit Design Request
            <Check className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Live price */}
      {estimatedPrice > 0 && step < 7 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 sm:static sm:translate-x-0 sm:mt-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-deep-burgundy text-white px-5 py-2.5 shadow-lg text-sm font-medium">
            <span className="opacity-80">Est.</span>
            {formatPrice(estimatedPrice)}
          </div>
        </div>
      )}
    </div>
  )
}
