import {
  LayoutDashboard,
  Package,
  Image,
  ShoppingBag,
  Calendar,
  Users,
  Star,
  Tag,
  CreditCard,
  Settings,
  BarChart3,
  type LucideIcon,
} from "lucide-react"

export type AdminNavItem = {
  href: string
  label: string
  icon: LucideIcon
  group?: "main" | "catalog" | "commerce" | "system"
}

export const adminNavItems: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, group: "main" },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag, group: "commerce" },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar, group: "commerce" },
  { href: "/admin/payments", label: "Payments", icon: CreditCard, group: "commerce" },
  { href: "/admin/designs", label: "Designs", icon: Image, group: "catalog" },
  { href: "/admin/products", label: "Products", icon: Package, group: "catalog" },
  { href: "/admin/customers", label: "Customers", icon: Users, group: "main" },
  { href: "/admin/reviews", label: "Reviews", icon: Star, group: "main" },
  { href: "/admin/promotions", label: "Promotions", icon: Tag, group: "commerce" },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3, group: "system" },
  { href: "/admin/settings", label: "Settings", icon: Settings, group: "system" },
]
