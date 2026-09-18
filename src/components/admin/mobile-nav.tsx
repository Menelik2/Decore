"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ShoppingBag,
  Image,
  Calendar,
  MoreHorizontal,
  X,
  Package,
  Users,
  Star,
  Tag,
  CreditCard,
  Settings,
  BarChart3,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"

const primary = [
  { href: "/admin", label: "Home", icon: LayoutDashboard, match: "exact" as const },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag, match: "prefix" as const },
  { href: "/admin/designs", label: "Designs", icon: Image, match: "prefix" as const },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar, match: "prefix" as const },
]

const moreLinks = [
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/promotions", label: "Promotions", icon: Tag },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminMobileNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  useEffect(() => {
    setMoreOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = moreOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [moreOpen])

  const moreActive = moreLinks.some((l) => pathname.startsWith(l.href))

  return (
    <>
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-black/[0.08] bg-white/90 backdrop-blur-[20px] backdrop-saturate-180"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex items-stretch justify-around px-1 pt-1">
          {primary.map((item) => {
            const active =
              item.match === "exact"
                ? pathname === item.href
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-0.5 min-h-[52px] max-w-[72px] text-[10px] font-semibold tracking-tight touch-manipulation active:opacity-70",
                  active ? "text-primary" : "text-label-secondary"
                )}
              >
                <item.icon
                  className={cn("h-5 w-5", active && "stroke-[2.25]")}
                  strokeWidth={active ? 2.25 : 1.75}
                />
                {item.label}
              </Link>
            )
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 min-h-[52px] max-w-[72px] text-[10px] font-semibold tracking-tight touch-manipulation active:opacity-70",
              moreActive || moreOpen ? "text-primary" : "text-label-secondary"
            )}
            aria-label="More admin sections"
          >
            <MoreHorizontal
              className="h-5 w-5"
              strokeWidth={moreActive || moreOpen ? 2.25 : 1.75}
            />
            More
          </button>
        </div>
      </nav>

      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50 bg-black/40 transition-opacity duration-200",
          moreOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMoreOpen(false)}
        aria-hidden={!moreOpen}
      />

      <div
        className={cn(
          "lg:hidden fixed left-0 right-0 bottom-0 z-50 transition-transform duration-300 ease-out",
          moreOpen ? "translate-y-0" : "translate-y-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="More admin menu"
      >
        <div
          className="mx-2 mb-2 rounded-[16px] bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden"
          style={{ marginBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.06]">
            <p className="text-[15px] font-semibold text-label">Admin menu</p>
            <button
              type="button"
              onClick={() => setMoreOpen(false)}
              className="h-9 w-9 flex items-center justify-center rounded-full bg-fill-secondary active:scale-95"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-label-secondary" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1 p-3">
            {moreLinks.map((item) => {
              const active = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-2xl min-h-[88px] justify-center touch-manipulation active:scale-[0.97] transition-transform",
                    active ? "bg-primary/10" : "hover:bg-fill-secondary"
                  )}
                >
                  <div
                    className={cn(
                      "h-11 w-11 rounded-[14px] flex items-center justify-center",
                      active ? "bg-primary text-white" : "bg-fill-secondary text-label"
                    )}
                  >
                    <item.icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <span
                    className={cn(
                      "text-[12px] font-medium text-center leading-tight",
                      active ? "text-primary" : "text-label"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
          <div className="px-3 pb-3">
            <Link
              href="/"
              onClick={() => setMoreOpen(false)}
              className="flex items-center justify-center gap-2 h-12 rounded-xl bg-fill-secondary text-[15px] font-medium text-label active:scale-[0.98]"
            >
              <ExternalLink className="h-4 w-4" />
              View storefront
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
