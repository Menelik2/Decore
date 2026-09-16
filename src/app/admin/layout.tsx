import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminMobileNav } from "@/components/admin/mobile-nav"
import { AdminHeader } from "@/components/admin/header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 max-w-full">
        <AdminHeader />
        <main className="flex-1 p-3 sm:p-5 lg:p-8 pb-28 lg:pb-8 overflow-x-hidden">
          {children}
        </main>
        <AdminMobileNav />
      </div>
    </div>
  )
}
