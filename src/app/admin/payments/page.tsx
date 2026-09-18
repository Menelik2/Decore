"use client"

import { useEffect, useState, useMemo } from "react"
import { CreditCard, Banknote, Smartphone, Wallet } from "lucide-react"
import { formatPrice, formatDate, cn } from "@/lib/utils"

type StoredOrder = {
  order_number: string
  status: string
  customer_name: string
  total: number
  payment_method?: string
  created_at: string
}

const METHOD_META: Record<
  string,
  { label: string; icon: typeof CreditCard; color: string }
> = {
  cash: { label: "Cash on delivery", icon: Banknote, color: "bg-green-50 text-green-800" },
  telebirr: { label: "Telebirr", icon: Smartphone, color: "bg-blue-50 text-blue-800" },
  cbe: { label: "CBE Birr", icon: Wallet, color: "bg-purple-50 text-purple-800" },
  card: { label: "Card", icon: CreditCard, color: "bg-amber-50 text-amber-800" },
}

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<StoredOrder[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem("decore-orders")
      if (raw) setOrders(JSON.parse(raw))
    } catch {
      // ignore
    }
  }, [])

  const paid = orders.filter((o) => o.status !== "CANCELLED")
  const byMethod = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {}
    for (const o of paid) {
      const key = (o.payment_method || "cash").toLowerCase()
      if (!map[key]) map[key] = { count: 0, total: 0 }
      map[key].count += 1
      map[key].total += o.total || 0
    }
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total)
  }, [paid])

  const totalRevenue = paid.reduce((s, o) => s + (o.total || 0), 0)

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-5">
        <h1 className="text-[22px] sm:text-[28px] font-bold tracking-tight text-label">
          Payments
        </h1>
        <p className="text-[13px] sm:text-[15px] text-label-secondary mt-1">
          Transaction overview from customer checkouts
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-black/[0.04] shadow-sm p-4 sm:p-5 mb-4">
        <p className="text-[12px] font-medium text-label-secondary uppercase tracking-wide">
          Total collected
        </p>
        <p className="text-[28px] sm:text-[34px] font-bold tracking-tight text-label mt-1">
          {formatPrice(totalRevenue)}
        </p>
        <p className="text-[13px] text-label-secondary mt-1">
          {paid.length} order{paid.length !== 1 ? "s" : ""} · excludes cancelled
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-5">
        {byMethod.length === 0 ? (
          <div className="col-span-2 rounded-2xl border border-black/[0.04] bg-white p-8 text-center text-sm text-label-secondary">
            No payments yet. They appear when customers complete checkout.
          </div>
        ) : (
          byMethod.map(([method, data]) => {
            const meta = METHOD_META[method] || {
              label: method,
              icon: CreditCard,
              color: "bg-muted text-foreground",
            }
            const Icon = meta.icon
            return (
              <div
                key={method}
                className="rounded-2xl border border-black/[0.04] bg-white p-3.5 sm:p-4"
              >
                <div
                  className={cn(
                    "h-9 w-9 rounded-xl flex items-center justify-center mb-2",
                    meta.color
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-[13px] font-medium text-label truncate">
                  {meta.label}
                </p>
                <p className="text-[17px] font-semibold text-label mt-0.5">
                  {formatPrice(data.total)}
                </p>
                <p className="text-[11px] text-label-secondary">
                  {data.count} payment{data.count !== 1 ? "s" : ""}
                </p>
              </div>
            )
          })
        )}
      </div>

      <div className="rounded-2xl border border-black/[0.04] bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-black/[0.06]">
          <h2 className="text-[15px] font-semibold text-label">Recent transactions</h2>
        </div>
        {paid.length === 0 ? (
          <p className="p-8 text-center text-sm text-label-secondary">No transactions</p>
        ) : (
          <ul className="divide-y divide-black/[0.06]">
            {paid.slice(0, 20).map((o) => {
              const method = (o.payment_method || "cash").toLowerCase()
              const meta = METHOD_META[method]
              return (
                <li
                  key={o.order_number}
                  className="flex items-center gap-3 px-4 py-3.5 min-h-[64px]"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-label truncate">
                      #{o.order_number} · {o.customer_name}
                    </p>
                    <p className="text-[12px] text-label-secondary mt-0.5">
                      {meta?.label || method} · {formatDate(o.created_at)}
                    </p>
                  </div>
                  <span className="text-[14px] font-semibold shrink-0">
                    {formatPrice(o.total)}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
