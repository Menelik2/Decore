"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Settings = {
  businessName: string
  phone: string
  email: string
  whatsapp: string
  address: string
  freeDeliveryMin: string
  currency: string
}

const DEFAULTS: Settings = {
  businessName: "Decore",
  phone: "+251 9XX XXX XXX",
  email: "hello@decore.et",
  whatsapp: "2519XXXXXXXX",
  address: "Addis Ababa, Ethiopia",
  freeDeliveryMin: "3000",
  currency: "ETB",
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem("decore-settings")
      if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) })
    } catch {
      // ignore
    }
  }, [])

  const update = (key: keyof Settings, value: string) => {
    setSettings((s) => ({ ...s, [key]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    localStorage.setItem("decore-settings", JSON.stringify(settings))
    setSaved(true)
  }

  return (
    <div className="max-w-xl mx-auto w-full">
      <div className="mb-5">
        <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-semibold text-deep-burgundy">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Business details (saved locally until Supabase is connected)
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-white p-4 sm:p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business name</Label>
          <Input
            id="businessName"
            value={settings.businessName}
            onChange={(e) => update("businessName", e.target.value)}
            className="h-11"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={settings.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp number</Label>
            <Input
              id="whatsapp"
              value={settings.whatsapp}
              onChange={(e) => update("whatsapp", e.target.value)}
              className="h-11"
              placeholder="2519XXXXXXXX"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={settings.email}
            onChange={(e) => update("email", e.target.value)}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={settings.address}
            onChange={(e) => update("address", e.target.value)}
            rows={2}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="freeDeliveryMin">Free delivery above (ETB)</Label>
            <Input
              id="freeDeliveryMin"
              type="number"
              value={settings.freeDeliveryMin}
              onChange={(e) => update("freeDeliveryMin", e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              value={settings.currency}
              onChange={(e) => update("currency", e.target.value)}
              className="h-11"
            />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full sm:w-auto min-h-[44px]">
          {saved ? "Saved ✓" : "Save settings"}
        </Button>
      </div>
    </div>
  )
}
