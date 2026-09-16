"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Package, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice, formatDate, cn } from "@/lib/utils"

type StoredOrder = {
  id: string
  order_number: string
  status: string
  customer_name: string
  total: number
  created_at: string
  items: { name: string; quantity: number }[]
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-800 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-800 border-blue-200",
  PREPARING: "bg-purple-50 text-purple-800 border-purple-200",
  READY: "bg-teal-50 text-teal-800 border-teal-200",
  OUT_FOR_DELIVERY: "bg-indigo-50 text-indigo-800 border-indigo-200",
  COMPLETED: "bg-green-50 text-green-800 border-green-200",
  CANCELLED: "bg-red-50 text-red-800 border-red-200",
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<StoredOrder[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem("decore-orders")
      if (raw) setOrders(JSON.parse(raw))
    } catch {
      // ignore
    }
    setLoaded(true)
  }, [])

  if (!loaded) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-24">
        <p className="text-muted-foreground animate-pulse">Loading orders...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 pt-24 pb-16">
        <Package className="h-16 w-16 text-muted-foreground/40 mb-4" />
        <h1 className="font-serif text-2xl font-semibold text-deep-burgundy mb-2">
          No orders yet
        </h1>
        <p className="text-muted-foreground mb-8 text-center max-w-sm">
          When you place an order, it will appear here for tracking.
        </p>
        <Link href="/designs">
          <Button>Browse Designs</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-semibold text-deep-burgundy mb-2">
          My Orders
        </h1>
        <p className="text-muted-foreground mb-8 text-sm">
          Track your flower and decoration orders
        </p>

        <div className="space-y-3">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                href={`/orders/${order.order_number}`}
                className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-white hover:border-primary/30 hover:shadow-sm transition-all group"
              >
                <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm text-foreground">
                      #{order.order_number}
                    </p>
                    <span
                      className={cn(
                        "text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border",
                        STATUS_STYLES[order.status] || STATUS_STYLES.PENDING
                      )}
                    >
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {order.items?.map((it) => `${it.name} ×${it.quantity}`).join(", ") ||
                      "Order items"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(order.created_at)} · {formatPrice(order.total)}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
