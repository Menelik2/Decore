"use client"

import { useEffect, useMemo, useState } from "react"
import { TrendingUp, ShoppingBag, Package, Users } from "lucide-react"
import { formatPrice, cn } from "@/lib/utils"
import { designs } from "@/lib/data/designs"

type Order = {
  order_number: string
  status: string
  total: number
  created_at: string
  items: { name: string; quantity: number; total_price?: number }[]
  city?: string
}

export default function AdminAnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem("decore-orders")
      if (raw) setOrders(JSON.parse(raw))
    } catch {
      // ignore
    }
  }, [])

  const stats = useMemo(() => {
    const active = orders.filter((o) => o.status !== "CANCELLED")
    const revenue = active.reduce((s, o) => s + (o.total || 0), 0)
    const avg = active.length ? revenue / active.length : 0
    const byStatus: Record<string, number> = {}
    for (const o of orders) {
      byStatus[o.status] = (byStatus[o.status] || 0) + 1
    }
    const byCity: Record<string, number> = {}
    for (const o of active) {
      const c = o.city || "Unknown"
      byCity[c] = (byCity[c] || 0) + 1
    }
    const itemCounts: Record<string, number> = {}
    for (const o of active) {
      for (const it of o.items || []) {
        itemCounts[it.name] = (itemCounts[it.name] || 0) + (it.quantity || 1)
      }
    }
    const topItems = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
    return { revenue, avg, count: orders.length, active: active.length, byStatus, byCity, topItems }
  }, [orders])

  const maxStatus = Math.max(...Object.values(stats.byStatus), 1)

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-5">
        <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-semibold text-deep-burgundy">
          Analytics
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Sales insights from local order data
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 mb-6">
        {[
          { label: "Revenue", value: formatPrice(stats.revenue), icon: TrendingUp, color: "text-green-700 bg-green-50" },
          { label: "Orders", value: String(stats.count), icon: ShoppingBag, color: "text-primary bg-primary/10" },
          { label: "Avg order", value: formatPrice(stats.avg), icon: Package, color: "text-blue-700 bg-blue-50" },
          { label: "Designs", value: String(designs.length), icon: Users, color: "text-purple-700 bg-purple-50" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-white p-3.5 sm:p-5">
            <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center mb-2", s.color)}>
              <s.icon className="h-4 w-4" />
            </div>
            <p className="text-lg sm:text-xl font-semibold truncate">{s.value}</p>
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-white p-4 sm:p-5">
          <h2 className="font-medium text-sm mb-4">Orders by status</h2>
          {Object.keys(stats.byStatus).length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <div key={status}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="capitalize">{status.replace(/_/g, " ").toLowerCase()}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${(count / maxStatus) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-white p-4 sm:p-5">
          <h2 className="font-medium text-sm mb-4">Top items</h2>
          {stats.topItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet</p>
          ) : (
            <ul className="space-y-2.5">
              {stats.topItems.map(([name, qty], i) => (
                <li key={name} className="flex items-center gap-3 text-sm">
                  <span className="h-6 w-6 rounded-full bg-secondary text-[10px] font-bold flex items-center justify-center text-primary shrink-0">
                    {i + 1}
                  </span>
                  <span className="flex-1 truncate">{name}</span>
                  <span className="text-muted-foreground text-xs shrink-0">×{qty}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-white p-4 sm:p-5 md:col-span-2">
          <h2 className="font-medium text-sm mb-4">Orders by city</h2>
          {Object.keys(stats.byCity).length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.byCity)
                .sort((a, b) => b[1] - a[1])
                .map(([city, count]) => (
                  <span
                    key={city}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs"
                  >
                    <span className="font-medium">{city}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
