import type { Metadata, Viewport } from "next"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminMobileNav } from "@/components/admin/mobile-nav"
import { AdminHeader } from "@/components/admin/header"

export const metadata: Metadata = {
  title: "Admin — Decore",
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#ffffff",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-[100dvh] bg-[#f5f5f7]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 max-w-full">
        <AdminHeader />
        <main className="flex-1 px-3 sm:px-5 lg:px-8 pt-3 sm:pt-5 lg:pt-8 pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-8 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
        <AdminMobileNav />
      </div>
    </div>
  )
}
