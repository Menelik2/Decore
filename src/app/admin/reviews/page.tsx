"use client"

import { useEffect, useState } from "react"
import { Star, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

type Review = {
  id: string
  author: string
  rating: number
  comment: string
  designName?: string
  createdAt: string
  published: boolean
}

const STORAGE_KEY = "decore-reviews"

const SEED: Review[] = [
  {
    id: "rev_1",
    author: "Sara M.",
    rating: 5,
    comment: "The wedding arch was breathtaking. Guests still talk about it.",
    designName: "Royal Wedding Arch",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    published: true,
  },
  {
    id: "rev_2",
    author: "Daniel T.",
    rating: 4,
    comment: "Beautiful bouquet, delivered on time for my mother's birthday.",
    designName: "Sunset Bouquet",
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    published: true,
  },
]

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setReviews(JSON.parse(raw))
      else {
        setReviews(SEED)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED))
      }
    } catch {
      setReviews(SEED)
    }
  }, [])

  const persist = (next: Review[]) => {
    setReviews(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const toggle = (id: string) => {
    persist(
      reviews.map((r) => (r.id === id ? { ...r, published: !r.published } : r))
    )
  }

  const avg =
    reviews.length === 0
      ? 0
      : reviews.reduce((s, r) => s + r.rating, 0) / reviews.length

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-5">
        <h1 className="text-[22px] sm:text-[28px] font-bold tracking-tight text-label">
          Reviews
        </h1>
        <p className="text-[13px] sm:text-[15px] text-label-secondary mt-1">
          Moderate customer feedback
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-5">
        <div className="rounded-2xl border border-black/[0.04] bg-white p-4">
          <p className="text-[12px] text-label-secondary">Average rating</p>
          <p className="text-[28px] font-bold text-label mt-0.5 flex items-center gap-1">
            {avg.toFixed(1)}
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
          </p>
        </div>
        <div className="rounded-2xl border border-black/[0.04] bg-white p-4">
          <p className="text-[12px] text-label-secondary">Total reviews</p>
          <p className="text-[28px] font-bold text-label mt-0.5">{reviews.length}</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-black/[0.04] bg-white p-10 text-center">
          <MessageSquare className="h-10 w-10 mx-auto text-label-tertiary mb-3" />
          <p className="text-sm text-label-secondary">No reviews yet</p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-black/[0.04] bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[15px] text-label">
                      {r.author}
                    </span>
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3.5 w-3.5",
                            i < r.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-label-tertiary"
                          )}
                        />
                      ))}
                    </span>
                  </div>
                  {r.designName && (
                    <p className="text-[12px] text-label-secondary mt-0.5">
                      {r.designName}
                    </p>
                  )}
                  <p className="text-[14px] text-label mt-2 leading-relaxed">
                    {r.comment}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span
                  className={cn(
                    "text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full",
                    r.published
                      ? "bg-green-50 text-green-800"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {r.published ? "Published" : "Hidden"}
                </span>
                <button
                  type="button"
                  onClick={() => toggle(r.id)}
                  className="h-10 px-4 rounded-full text-[13px] font-medium bg-fill-secondary text-label active:scale-95 touch-manipulation"
                >
                  {r.published ? "Hide" : "Publish"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
