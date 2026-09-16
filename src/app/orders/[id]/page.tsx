"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice, formatDate, cn } from "@/lib/utils"

type StoredOrder = {
  id: string
  order_number: string
  status: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  delivery_address: string
  city: string
  preferred_date: string | null
  preferred_time: string | null
  notes: string | null
  subtotal: number
  delivery_fee: number
  total: number
  payment_method: string
  payment_status: string
  items: {
    name: string
    quantity: number
    unit_price: number
    total_price: number
    image?: string
  }[]
  created_at: string
}

const STATUS_FLOW = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
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

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [order, setOrder] = useState<StoredOrder | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem("decore-orders")
      if (raw) {
        const orders = JSON.parse(raw) as StoredOrder[]
        const found = orders.find(
          (o) => o.order_number === id || o.id === id
        )
        setOrder(found || null)
      }
    } catch {
      // ignore
    }
    setLoaded(true)
  }, [id])

  if (!loaded) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-24">
        <p className="text-muted-foreground animate-pulse">Loading order...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 pt-24">
        <Package className="h-12 w-12 text-muted-foreground/40 mb-4" />
        <h1 className="font-serif text-2xl font-semibold text-deep-burgundy mb-2">
          Order not found
        </h1>
        <p className="text-muted-foreground mb-6 text-sm">
          This order may have been cleared from this device.
        </p>
        <Link href="/orders">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </div>
    )
  }

  const statusIndex = STATUS_FLOW.indexOf(order.status)

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          All orders
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-deep-burgundy">
              Order #{order.order_number}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Placed {formatDate(order.created_at)}
            </p>
          </div>
          <span
            className={cn(
              "text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full border",
              STATUS_STYLES[order.status] || STATUS_STYLES.PENDING
            )}
          >
            {order.status.replace(/_/g, " ")}
          </span>
        </div>

        {/* Status timeline */}
        {order.status !== "CANCELLED" && (
          <div className="rounded-2xl border border-border bg-white p-6 mb-6">
            <h2 className="font-medium text-sm mb-4">Order progress</h2>
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {STATUS_FLOW.map((s, i) => {
                const done = statusIndex >= i
                const current = statusIndex === i
                return (
                  <div key={s} className="flex items-center flex-1 min-w-0">
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div
                        className={cn(
                          "h-3 w-3 rounded-full shrink-0",
                          done ? "bg-primary" : "bg-border",
                          current && "ring-4 ring-primary/20"
                        )}
                      />
                      <span
                        className={cn(
                          "text-[9px] sm:text-[10px] text-center leading-tight",
                          done ? "text-foreground font-medium" : "text-muted-foreground"
                        )}
                      >
                        {s.replace(/_/g, " ")}
                      </span>
                    </div>
                    {i < STATUS_FLOW.length - 1 && (
                      <div
                        className={cn(
                          "h-0.5 flex-1 min-w-[12px] mb-4",
                          statusIndex > i ? "bg-primary" : "bg-border"
                        )}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Items */}
        <div className="rounded-2xl border border-border bg-white p-6 mb-6 space-y-4">
          <h2 className="font-medium text-sm">Items</h2>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between gap-4 text-sm">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-muted-foreground">
                  {formatPrice(item.unit_price)} × {item.quantity}
                </p>
              </div>
              <p className="font-medium shrink-0">{formatPrice(item.total_price)}</p>
            </div>
          ))}
          <div className="pt-3 border-t border-border space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span>
                {order.delivery_fee === 0
                  ? "Free"
                  : formatPrice(order.delivery_fee)}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-base pt-1">
              <span>Total</span>
              <span className="text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Delivery & payment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-white p-5 text-sm space-y-2">
            <h2 className="font-medium mb-2">Delivery</h2>
            <p className="text-foreground">{order.customer_name}</p>
            <p className="text-muted-foreground">{order.customer_phone}</p>
            <p className="text-muted-foreground">
              {order.delivery_address}, {order.city}
            </p>
            {order.preferred_date && (
              <p className="text-muted-foreground">
                Preferred: {order.preferred_date}
                {order.preferred_time ? ` · ${order.preferred_time}` : ""}
              </p>
            )}
            {order.notes && (
              <p className="text-muted-foreground pt-2 border-t border-border">
                Note: {order.notes}
              </p>
            )}
          </div>
          <div className="rounded-2xl border border-border bg-white p-5 text-sm space-y-2">
            <h2 className="font-medium mb-2">Payment</h2>
            <p className="text-foreground capitalize">
              {order.payment_method.replace(/_/g, " ")}
            </p>
            <p className="text-muted-foreground capitalize">
              Status: {order.payment_status.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
