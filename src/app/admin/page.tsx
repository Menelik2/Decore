"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ShoppingBag,
  Calendar,
  Image,
  Users,
  TrendingUp,
  Clock,
  ArrowRight,
  Package,
} from "lucide-react"
import { formatPrice, formatDate, cn } from "@/lib/utils"
import { designs } from "@/lib/data/designs"

type StoredOrder = {
  order_number: string
  status: string
  customer_name: string
  total: number
  created_at: string
  items: { name: string; quantity: number }[]
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-800",
  CONFIRMED: "bg-blue-50 text-blue-800",
  PREPARING: "bg-purple-50 text-purple-800",
  READY: "bg-teal-50 text-teal-800",
  OUT_FOR_DELIVERY: "bg-indigo-50 text-indigo-800",
  COMPLETED: "bg-green-50 text-green-800",
  CANCELLED: "bg-red-50 text-red-800",
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<StoredOrder[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem("decore-orders")
      if (raw) setOrders(JSON.parse(raw))
    } catch {
      // ignore
    }
  }, [])

  const pending = orders.filter((o) => o.status === "PENDING").length
  const revenue = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((s, o) => s + (o.total || 0), 0)
  const completed = orders.filter((o) => o.status === "COMPLETED").length

  const stats = [
    {
      label: "Total Orders",
      value: String(orders.length),
      icon: ShoppingBag,
      href: "/admin/orders",
      color: "text-primary bg-primary/10",
    },
    {
      label: "Pending",
      value: String(pending),
      icon: Clock,
      href: "/admin/orders",
      color: "text-amber-700 bg-amber-50",
    },
    {
      label: "Revenue",
      value: formatPrice(revenue),
      icon: TrendingUp,
      href: "/admin/analytics",
      color: "text-green-700 bg-green-50",
    },
    {
      label: "Designs",
      value: String(designs.length),
      icon: Image,
      href: "/admin/designs",
      color: "text-purple-700 bg-purple-50",
    },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-deep-burgundy">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your flower and decoration business
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-border bg-white p-4 sm:p-5 hover:shadow-sm transition-shadow"
          >
            <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center mb-3", s.color)}>
              <s.icon className="h-4 w-4" />
            </div>
            <p className="text-xl sm:text-2xl font-semibold text-foreground truncate">
              {s.value}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-white">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="font-medium text-foreground">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {orders.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
              No orders yet. They will appear here when customers checkout.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {orders.slice(0, 6).map((o) => (
                <li key={o.order_number}>
                  <Link
                    href="/admin/orders"
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">#{o.order_number}</span>
                        <span
                          className={cn(
                            "text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full",
                            STATUS_STYLES[o.status] || STATUS_STYLES.PENDING
                          )}
                        >
                          {o.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {o.customer_name} · {formatDate(o.created_at)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold shrink-0">
                      {formatPrice(o.total)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-white p-5">
            <h2 className="font-medium text-foreground mb-4">Quick actions</h2>
            <div className="space-y-2">
              {[
                { href: "/admin/orders", label: "Manage orders", icon: ShoppingBag },
                { href: "/admin/designs", label: "Manage designs", icon: Image },
                { href: "/admin/bookings", label: "Event bookings", icon: Calendar },
                { href: "/admin/customers", label: "Customers", icon: Users },
              ].map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-sm"
                >
                  <a.icon className="h-4 w-4 text-primary" />
                  <span className="font-medium">{a.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-auto text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-deep-burgundy to-primary p-5 text-white">
            <p className="text-sm font-medium mb-1">Completed orders</p>
            <p className="text-3xl font-semibold">{completed}</p>
            <p className="text-xs text-white/70 mt-1">
              Keep delivering beautiful experiences
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
