"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Package,
  Calendar,
  Heart,
  User,
  MapPin,
  LogOut,
  ChevronRight,
  ShoppingBag,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

const menuItems = [
  {
    href: "/orders",
    icon: Package,
    title: "My Orders",
    desc: "Track flower & gift orders",
  },
  {
    href: "/account/bookings",
    icon: Calendar,
    title: "Event Bookings",
    desc: "Decoration projects & status",
  },
  {
    href: "/favorites",
    icon: Heart,
    title: "Wishlist",
    desc: "Saved designs & products",
  },
  {
    href: "/account/profile",
    icon: User,
    title: "Profile",
    desc: "Name, phone, email",
  },
  {
    href: "/account/addresses",
    icon: MapPin,
    title: "Addresses",
    desc: "Delivery locations",
  },
  {
    href: "/cart",
    icon: ShoppingBag,
    title: "Cart",
    desc: "Items ready to checkout",
  },
]

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<{
    email?: string
    full_name?: string
    phone?: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    async function loadUser() {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!url || !key || url.includes("your_supabase")) {
        setDemoMode(true)
        setUser({
          email: "guest@decore.et",
          full_name: "Guest User",
          phone: "+251 9XX XXX XXX",
        })
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const { data: { user: authUser } } = await supabase.auth.getUser()

        if (!authUser) {
          router.push("/login")
          return
        }

        setUser({
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0],
          phone: authUser.user_metadata?.phone,
        })
      } catch {
        setDemoMode(true)
        setUser({
          email: "guest@decore.et",
          full_name: "Guest User",
        })
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [router])

  const handleSignOut = async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (url && !url.includes("your_supabase")) {
      const supabase = createClient()
      await supabase.auth.signOut()
    }
    router.push("/")
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-24">
        <div className="animate-pulse text-muted-foreground">Loading account...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-10">
            <div>
              <p className="text-sm font-medium text-primary uppercase tracking-wider mb-1">
                Account
              </p>
              <h1 className="font-serif text-3xl font-semibold text-deep-burgundy">
                Hello, {user?.full_name || "there"}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">{user?.email}</p>
              {demoMode && (
                <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 inline-block">
                  Demo mode — connect Supabase in .env.local for real auth
                </p>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-1.5 shrink-0">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { label: "Orders", value: "0", icon: Package },
              { label: "Bookings", value: "0", icon: Calendar },
              { label: "Saved", value: "0", icon: Heart },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-white p-4 text-center"
              >
                <stat.icon className="h-5 w-5 text-primary mx-auto mb-1.5" />
                <p className="text-xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Menu */}
          <div className="space-y-2">
            {menuItems.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-white hover:border-primary/30 hover:shadow-sm transition-all group"
                >
                  <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Notifications teaser */}
          <div className="mt-8 rounded-2xl bg-gradient-to-br from-deep-burgundy to-primary p-6 text-white">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 mt-0.5 shrink-0 opacity-80" />
              <div>
                <p className="font-medium mb-1">Stay updated</p>
                <p className="text-sm text-white/80">
                  Order status, booking confirmations, and promotions will appear here once you place your first order.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
