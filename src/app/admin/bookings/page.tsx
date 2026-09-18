"use client"

import { useEffect, useState } from "react"
import { Calendar, Search, Phone, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatPrice, formatDate, cn } from "@/lib/utils"
import { bookingStore } from "@/lib/admin-store"

type Booking = {
  id: string
  event_type: string
  event_date: string
  venue: string
  city?: string
  guest_count: number
  customer_name?: string
  customer_phone?: string
  estimated_cost?: number
  status: string
  created_at: string
  services?: string[]
}

const STATUSES = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-800 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-800 border-blue-200",
  IN_PROGRESS: "bg-purple-50 text-purple-800 border-purple-200",
  COMPLETED: "bg-green-50 text-green-800 border-green-200",
  CANCELLED: "bg-red-50 text-red-800 border-red-200",
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("ALL")
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem("decore-bookings")
      if (raw) setBookings(JSON.parse(raw))
    } catch {
      // ignore
    }
  }, [])

  const updateStatus = (id: string, status: string) => {
    const next = bookings.map((b) => (b.id === id ? { ...b, status } : b))
    setBookings(next)
    localStorage.setItem("decore-bookings", JSON.stringify(next))
  }

  const removeBooking = (id: string) => {
    if (!confirm("Delete this booking?")) return
    bookingStore.remove(id)
    setBookings((prev) => prev.filter((b) => b.id !== id))
    setExpanded(null)
  }

  const filtered = bookings.filter((b) => {
    if (filter !== "ALL" && b.status !== filter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        b.event_type?.toLowerCase().includes(q) ||
        b.venue?.toLowerCase().includes(q) ||
        b.customer_name?.toLowerCase().includes(q) ||
        b.customer_phone?.includes(q)
      )
    }
    return true
  })

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-5">
        <h1 className="text-[22px] sm:text-[28px] font-bold tracking-tight text-label">
          Event Bookings
        </h1>
        <p className="text-[13px] text-label-secondary mt-1">
          Decoration project requests
        </p>
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-label-secondary" />
          <Input
            placeholder="Search venue, name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 text-[16px] rounded-xl bg-white"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-12 rounded-xl border border-input bg-white px-3 text-[16px] w-full sm:w-auto"
        >
          <option value="ALL">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-black/[0.04] bg-white p-10 text-center">
          <Calendar className="h-12 w-12 mx-auto text-label-tertiary mb-3" />
          <p className="text-sm text-label-secondary">
            No bookings yet. They appear when customers submit the booking form.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl border border-black/[0.04] bg-white overflow-hidden shadow-sm"
            >
              <button
                type="button"
                onClick={() => setExpanded(expanded === b.id ? null : b.id)}
                className="w-full flex items-start gap-3 p-4 text-left min-h-[72px] touch-manipulation active:bg-fill-secondary"
              >
                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-[15px] capitalize text-label">
                      {b.event_type?.replace(/_/g, " ").toLowerCase()}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border",
                        STATUS_STYLES[b.status] || STATUS_STYLES.PENDING
                      )}
                    >
                      {b.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-[13px] text-label-secondary mt-0.5 truncate">
                    {b.venue}
                    {b.event_date ? ` · ${b.event_date}` : ""} · {b.guest_count} guests
                  </p>
                </div>
                {b.estimated_cost != null && (
                  <span className="text-[15px] font-semibold shrink-0 text-label">
                    {formatPrice(b.estimated_cost)}
                  </span>
                )}
              </button>

              {expanded === b.id && (
                <div className="px-4 pb-4 border-t border-black/[0.06] pt-3 space-y-3">
                  {(b.customer_name || b.customer_phone) && (
                    <div className="text-sm">
                      <p className="font-medium text-label">{b.customer_name}</p>
                      {b.customer_phone && (
                        <a
                          href={`tel:${b.customer_phone}`}
                          className="inline-flex items-center gap-1.5 text-primary text-[13px] mt-1 min-h-[44px]"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          {b.customer_phone}
                        </a>
                      )}
                    </div>
                  )}
                  {b.services && b.services.length > 0 && (
                    <p className="text-[13px] text-label-secondary">
                      Services: {b.services.join(", ")}
                    </p>
                  )}
                  <p className="text-[11px] text-label-secondary">
                    Submitted {formatDate(b.created_at)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant={b.status === s ? "default" : "outline"}
                        onClick={() => updateStatus(b.id, s)}
                        className="text-xs min-h-[40px]"
                      >
                        {s.replace(/_/g, " ")}
                      </Button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeBooking(b.id)}
                    className="w-full h-11 rounded-xl border border-red-200 text-red-600 text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
