"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Flower2, ExternalLink, Bell } from "lucide-react"
import { adminNavItems } from "./nav-items"
import { cn } from "@/lib/utils"

export function AdminHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close drawer on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const title =
    adminNavItems.find((i) =>
      i.href === "/admin" ? pathname === "/admin" : pathname.startsWith(i.href)
    )?.label || "Admin"

  return (
    <>
      <header className="lg:hidden sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-md">
        <div className="flex items-center justify-between h-14 px-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-muted -ml-1"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Flower2 className="h-5 w-5 text-primary" />
            <span className="font-serif font-semibold text-deep-burgundy text-sm">
              {title}
            </span>
          </div>
          <Link
            href="/"
            className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-muted -mr-1"
            aria-label="View store"
          >
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </header>

      {/* Drawer overlay */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50 bg-black/40 transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
      />

      {/* Drawer panel */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 z-50 h-full w-[min(100%,280px)] bg-white shadow-xl transition-transform duration-300 ease-out flex flex-col",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <Flower2 className="h-6 w-6 text-primary" />
            <div>
              <p className="font-serif font-semibold text-deep-burgundy leading-none">Decore</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                Admin
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-muted"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {adminNavItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px]",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-muted"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-border safe-area-pb">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-muted-foreground hover:bg-muted min-h-[44px]"
          >
            <ExternalLink className="h-5 w-5" />
            View storefront
          </Link>
        </div>
      </aside>
    </>
  )
}
