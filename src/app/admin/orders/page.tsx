"use client"

import { useEffect, useState } from "react"
import { Package, Search } from "lucide-react"
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

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-deep-burgundy">
          Orders
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and update customer order status
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search order #, name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-11 rounded-xl border border-input bg-white px-4 text-sm"
        >
          <option value="ALL">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground text-sm">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div
              key={order.order_number}
              className="rounded-2xl border border-border bg-white overflow-hidden"
            >
              <button
                type="button"
                onClick={() =>
                  setExpanded(
                    expanded === order.order_number ? null : order.order_number
                  )
                }
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-sm">
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
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {order.customer_name} · {order.customer_phone} ·{" "}
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <span className="font-semibold text-sm shrink-0">
                  {formatPrice(order.total)}
                </span>
              </button>

              {expanded === order.order_number && (
                <div className="px-4 pb-4 border-t border-border pt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Delivery</p>
                      <p>
                        {order.delivery_address}, {order.city}
                      </p>
                      <p className="text-muted-foreground capitalize mt-1">
                        Payment: {order.payment_method?.replace(/_/g, " ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Items</p>
                      <ul className="space-y-1">
                        {order.items?.map((it, i) => (
                          <li key={i}>
                            {it.name} × {it.quantity} —{" "}
                            {formatPrice(it.total_price)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Update status
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {STATUSES.map((s) => (
                        <Button
                          key={s}
                          size="sm"
                          variant={order.status === s ? "default" : "outline"}
                          onClick={() => updateStatus(order.order_number, s)}
                          className="text-xs"
                        >
                          {s.replace(/_/g, " ")}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
