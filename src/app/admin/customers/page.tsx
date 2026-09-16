"use client"

import { useEffect, useMemo, useState } from "react"
import { Users, Search, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { formatPrice, formatDate } from "@/lib/utils"

type Order = {
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email?: string | null
  total: number
  status: string
  created_at: string
  city?: string
}

type CustomerRow = {
  key: string
  name: string
  phone: string
  email?: string
  orders: number
  spent: number
  lastOrder: string
  city?: string
}

export default function AdminCustomersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    try {
      const raw = localStorage.getItem("decore-orders")
      if (raw) setOrders(JSON.parse(raw))
    } catch {
      // ignore
    }
  }, [])

  const customers = useMemo(() => {
    const map = new Map<string, CustomerRow>()
    for (const o of orders) {
      const key = (o.customer_phone || o.customer_name || "").trim()
      if (!key) continue
      const existing = map.get(key)
      if (existing) {
        existing.orders += 1
        existing.spent += o.total || 0
        if (new Date(o.created_at) > new Date(existing.lastOrder)) {
          existing.lastOrder = o.created_at
        }
      } else {
        map.set(key, {
          key,
          name: o.customer_name,
          phone: o.customer_phone,
          email: o.customer_email || undefined,
          orders: 1,
          spent: o.total || 0,
          lastOrder: o.created_at,
          city: o.city,
        })
      }
    }
    return Array.from(map.values()).sort((a, b) => b.spent - a.spent)
  }, [orders])

  const filtered = customers.filter((c) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.email?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-5">
        <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-semibold text-deep-burgundy">
          Customers
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Derived from orders · {customers.length} unique
        </p>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search name, phone, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-10 text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">
            No customers yet. They appear after checkout.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((c) => (
            <div
              key={c.key}
              className="rounded-2xl border border-border bg-white p-4 flex items-start gap-3"
            >
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0 text-sm font-semibold text-primary">
                {c.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{c.name}</p>
                <a
                  href={`tel:${c.phone}`}
                  className="inline-flex items-center gap-1 text-xs text-primary mt-0.5 min-h-[36px]"
                >
                  <Phone className="h-3 w-3" />
                  {c.phone}
                </a>
                <p className="text-[11px] text-muted-foreground">
                  {c.orders} order{c.orders > 1 ? "s" : ""} · Last{" "}
                  {formatDate(c.lastOrder)}
                  {c.city ? ` · ${c.city}` : ""}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold">{formatPrice(c.spent)}</p>
                <p className="text-[10px] text-muted-foreground">lifetime</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
