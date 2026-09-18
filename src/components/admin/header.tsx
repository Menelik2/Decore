"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Flower2, ExternalLink } from "lucide-react"
import { adminNavItems } from "./nav-items"
import { cn } from "@/lib/utils"

const groups = [
  { key: "main", label: "Overview" },
  { key: "commerce", label: "Commerce" },
  { key: "catalog", label: "Catalog" },
  { key: "system", label: "System" },
] as const

export function AdminHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

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
      <header
        className="lg:hidden sticky top-0 z-40 border-b border-black/[0.06] bg-white/90 backdrop-blur-[20px] backdrop-saturate-180"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="flex items-center justify-between h-12 px-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="h-11 w-11 flex items-center justify-center rounded-full active:bg-fill-secondary -ml-1 touch-manipulation"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-label" strokeWidth={1.75} />
          </button>
          <div className="flex items-center gap-1.5">
            <Flower2 className="h-4 w-4 text-primary" />
            <span className="text-[15px] font-semibold tracking-tight text-label">
              {title}
            </span>
          </div>
          <Link
            href="/"
            className="h-11 w-11 flex items-center justify-center rounded-full active:bg-fill-secondary -mr-1 touch-manipulation"
            aria-label="View store"
          >
            <ExternalLink className="h-4 w-4 text-label-secondary" strokeWidth={1.75} />
          </Link>
        </div>
      </header>

      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50 bg-black/40 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
      />

      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 z-50 h-full w-[min(100%,300px)] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-black/[0.06]">
          <Link
            href="/admin"
            className="flex items-center gap-2"
            onClick={() => setOpen(false)}
          >
            <Flower2 className="h-6 w-6 text-primary" />
            <div>
              <p className="text-[15px] font-semibold text-label leading-none">
                Decore
              </p>
              <p className="text-[10px] text-label-secondary uppercase tracking-wider mt-0.5">
                Admin
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="h-10 w-10 flex items-center justify-center rounded-full active:bg-fill-secondary"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-label-secondary" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overscroll-contain p-3 space-y-4 pb-8">
          {groups.map((g) => {
            const items = adminNavItems.filter((i) => i.group === g.key)
            if (!items.length) return null
            return (
              <div key={g.key}>
                <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-label-tertiary">
                  {g.label}
                </p>
                <div className="space-y-0.5">
                  {items.map((item) => {
                    const active =
                      item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium transition-colors min-h-[48px] touch-manipulation",
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-label active:bg-fill-secondary"
                        )}
                      >
                        <item.icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </nav>

        <div
          className="p-3 border-t border-black/[0.06]"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium text-label-secondary active:bg-fill-secondary min-h-[48px]"
          >
            <ExternalLink className="h-5 w-5" strokeWidth={1.75} />
            View storefront
          </Link>
        </div>
      </aside>
    </>
  )
}
