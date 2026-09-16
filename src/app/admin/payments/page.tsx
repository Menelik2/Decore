"use client"

import { Construction } from "lucide-react"

export default function AdminPaymentsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-deep-burgundy">
          Payments
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Payment methods and transaction overview</p>
      </div>

      <div className="rounded-2xl border border-border bg-white p-12 text-center">
        <Construction className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
        <h2 className="font-medium text-foreground mb-2">Coming next</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          This section is scaffolded and ready for Supabase-backed CRUD.
          Dashboard, Orders, and Designs are fully interactive today.
        </p>
      </div>
    </div>
  )
}
