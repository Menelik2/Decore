"use client"

import { useEffect, useState } from "react"
import { Tag, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type Promo = {
  id: string
  code: string
  discountPercent: number
  active: boolean
  createdAt: string
}

const STORAGE_KEY = "decore-promotions"

export default function AdminPromotionsPage() {
  const [promos, setPromos] = useState<Promo[]>([])
  const [code, setCode] = useState("")
  const [percent, setPercent] = useState("10")

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setPromos(JSON.parse(raw))
    } catch {
      // ignore
    }
  }, [])

  const persist = (next: Promo[]) => {
    setPromos(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const add = () => {
    const c = code.trim().toUpperCase()
    const p = Math.min(90, Math.max(1, Number(percent) || 10))
    if (!c) return
    if (promos.some((x) => x.code === c)) return
    const next: Promo[] = [
      {
        id: `promo_${Date.now()}`,
        code: c,
        discountPercent: p,
        active: true,
        createdAt: new Date().toISOString(),
      },
      ...promos,
    ]
    persist(next)
    setCode("")
    setPercent("10")
  }

  const toggle = (id: string) => {
    persist(promos.map((p) => (p.id === id ? { ...p, active: !p.active } : p)))
  }

  const remove = (id: string) => {
    persist(promos.filter((p) => p.id !== id))
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-5">
        <h1 className="text-[22px] sm:text-[28px] font-bold tracking-tight text-label">
          Promotions
        </h1>
        <p className="text-[13px] sm:text-[15px] text-label-secondary mt-1">
          Discount codes for checkout (saved on this device)
        </p>
      </div>

      <div className="rounded-2xl border border-black/[0.04] bg-white p-4 sm:p-5 space-y-3 mb-5">
        <div className="space-y-1.5">
          <Label htmlFor="code">Promo code</Label>
          <Input
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. SPRING20"
            className="h-12 text-[16px]"
            autoCapitalize="characters"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pct">Discount %</Label>
          <Input
            id="pct"
            type="number"
            min={1}
            max={90}
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
            className="h-12 text-[16px]"
            inputMode="numeric"
          />
        </div>
        <Button onClick={add} className="w-full h-12" disabled={!code.trim()}>
          <Plus className="h-4 w-4" />
          Add promotion
        </Button>
      </div>

      {promos.length === 0 ? (
        <div className="rounded-2xl border border-black/[0.04] bg-white p-10 text-center">
          <Tag className="h-10 w-10 mx-auto text-label-tertiary mb-3" />
          <p className="text-sm text-label-secondary">No promo codes yet</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {promos.map((p) => (
            <li
              key={p.id}
              className="rounded-2xl border border-black/[0.04] bg-white p-4 flex items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-[15px] text-label tracking-wide">
                    {p.code}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full",
                      p.active
                        ? "bg-green-50 text-green-800"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {p.active ? "Active" : "Off"}
                  </span>
                </div>
                <p className="text-[13px] text-label-secondary mt-0.5">
                  {p.discountPercent}% off
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggle(p.id)}
                className="h-10 px-3 rounded-full text-[13px] font-medium bg-fill-secondary text-label active:scale-95 touch-manipulation"
              >
                {p.active ? "Disable" : "Enable"}
              </button>
              <button
                type="button"
                onClick={() => remove(p.id)}
                className="h-10 w-10 flex items-center justify-center rounded-full text-red-600 active:bg-red-50 touch-manipulation"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
