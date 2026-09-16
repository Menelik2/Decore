"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Flower2, ExternalLink } from "lucide-react"
import { adminNavItems } from "./nav-items"
import { cn } from "@/lib/utils"

const groups = [
  { key: "main", label: "Overview" },
  { key: "commerce", label: "Commerce" },
  { key: "catalog", label: "Catalog" },
  { key: "system", label: "System" },
] as const

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex w-60 flex-col border-r border-border bg-white min-h-screen sticky top-0 shrink-0">
      <div className="p-5 border-b border-border">
        <Link href="/admin" className="flex items-center gap-2">
          <Flower2 className="h-6 w-6 text-primary" />
          <div>
            <p className="font-serif font-semibold text-deep-burgundy leading-none">
              Decore
            </p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
              Admin
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto space-y-4">
        {groups.map((g) => {
          const items = adminNavItems.filter((i) => i.group === g.key)
          if (!items.length) return null
          return (
            <div key={g.key}>
              <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
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
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          View storefront
        </Link>
      </div>
    </aside>
  )
}
