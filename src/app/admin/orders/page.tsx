"use client"

import { useEffect, useState } from "react"
import { Package, Search, ChevronDown, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatPrice, formatDate, cn } from "@/lib/utils"

type StoredOrder = {
  id: string
  order_number: string
  status: string
  customer_name: string
  customer_phone: string
  delivery_address: string
  city: string
  total: number
  payment_method: string
  created_at: string
  items: { name: string; quantity: number; unit_price: number; total_price: number }[]
  notes?: string | null
}

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
  "CANCELLED",
]

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-800 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-800 border-blue-200",
  PREPARING: "bg-purple-50 text-purple-800 border-purple-200",
  READY: "bg-teal-50 text-teal-800 border-teal-200",
  OUT_FOR_DELIVERY: "bg-indigo-50 text-indigo-800 border-indigo-200",
  COMPLETED: "bg-green-50 text-green-800 border-green-200",
  CANCELLED: "bg-red-50 text-red-800 border-red-200",
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<StoredOrder[]>([])
  const [filter, setFilter] = useState("ALL")
  const [search, setSearch] = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)

  const load = () => {
    try {
      const raw = localStorage.getItem("decore-orders")
      if (raw) setOrders(JSON.parse(raw))
      else setOrders([])
    } catch {
      setOrders([])
    }
  }

  useEffect(() => {
    load()
  }, [])

  const updateStatus = (orderNumber: string, status: string) => {
    const next = orders.map((o) =>
      o.order_number === orderNumber ? { ...o, status } : o
    )
    setOrders(next)
    localStorage.setItem("decore-orders", JSON.stringify(next))
  }

  const filtered = orders.filter((o) => {
    if (filter !== "ALL" && o.status !== filter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.includes(q)
      )
    }
    return true
  })

  const pendingCount = orders.filter((o) => o.status === "PENDING").length

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-4 sm:mb-5">
        <h1 className="text-[22px] sm:text-[28px] font-bold tracking-tight text-label">
          Orders
        </h1>
        <p className="text-[13px] sm:text-[15px] text-label-secondary mt-1">
          {orders.length} total
          {pendingCount > 0 ? ` · ${pendingCount} pending` : ""}
        </p>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-label-secondary" />
        <Input
          placeholder="Search #, name, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-12 text-[16px] rounded-xl bg-white"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-none mb-1">
        <button
          type="button"
          onClick={() => setFilter("ALL")}
          className={cn(
            "shrink-0 rounded-full px-4 py-2.5 text-[13px] font-semibold min-h-[40px] touch-manipulation border",
            filter === "ALL"
              ? "bg-primary text-white border-primary"
              : "bg-white text-label border-black/[0.08]"
          )}
        >
          All
        </button>
        {STATUSES.map((s) => {
          const count = orders.filter((o) => o.status === s).length
          return (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2.5 text-[13px] font-semibold min-h-[40px] touch-manipulation border",
                filter === s
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-label border-black/[0.08]"
              )}
            >
              {s.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
              {count > 0 ? ` (${count})` : ""}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-black/[0.04] bg-white p-10 text-center">
          <Package className="h-11 w-11 mx-auto text-label-tertiary mb-3" />
          <p className="text-sm text-label-secondary">No orders found</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((order) => {
            const open = expanded === order.order_number
            return (
              <div
                key={order.order_number}
                className="rounded-2xl border border-black/[0.04] bg-white overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setExpanded(open ? null : order.order_number)}
                  className="w-full flex items-center gap-3 p-4 text-left active:bg-fill-secondary touch-manipulation min-h-[72px]"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-[15px] text-label">
                        #{order.order_number}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border",
                          STATUS_STYLES[order.status] || STATUS_STYLES.PENDING
                        )}
                      >
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-[13px] text-label-secondary mt-1 truncate">
                      {order.customer_name} · {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-semibold text-[15px] text-label">
                      {formatPrice(order.total)}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-label-secondary transition-transform",
                        open && "rotate-180"
                      )}
                    />
                  </div>
                </button>

                {open && (
                  <div className="px-4 pb-4 border-t border-black/[0.06] pt-4 space-y-4">
                    <div className="space-y-2 text-[14px]">
                      <a
                        href={`tel:${order.customer_phone}`}
                        className="flex items-center gap-2 text-primary font-medium min-h-[44px]"
                      >
                        <Phone className="h-4 w-4" />
                        {order.customer_phone}
                      </a>
                      <p className="flex items-start gap-2 text-label">
                        <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-label-secondary" />
                        <span>
                          {order.delivery_address}
                          {order.city ? `, ${order.city}` : ""}
                        </span>
                      </p>
                      <p className="text-[13px] text-label-secondary capitalize pl-6">
                        Payment: {order.payment_method?.replace(/_/g, " ") || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[12px] font-medium text-label-secondary mb-2">
                        Items
                      </p>
                      <ul className="space-y-1.5 text-[14px]">
                        {order.items?.map((it, i) => (
                          <li key={i} className="flex justify-between gap-2">
                            <span className="text-label">
                              {it.name} × {it.quantity}
                            </span>
                            <span className="font-medium shrink-0">
                              {formatPrice(it.total_price)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-[12px] font-medium text-label-secondary mb-2">
                        Update status
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {STATUSES.map((s) => (
                          <Button
                            key={s}
                            size="sm"
                            variant={order.status === s ? "default" : "outline"}
                            onClick={() => updateStatus(order.order_number, s)}
                            className="text-[12px] min-h-[40px] touch-manipulation"
                          >
                            {s.replace(/_/g, " ")}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
