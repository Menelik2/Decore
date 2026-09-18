"use client"

import { useCallback, useState } from "react"
import { Search, Loader2, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Photo = {
  id: number
  photographer: string
  alt: string | null
  src: {
    medium: string
    large: string
    original: string
  }
}

type Props = {
  onSelect: (url: string, meta?: { photographer: string; alt: string }) => void
  defaultQuery?: string
  className?: string
}

export function PexelsPicker({
  onSelect,
  defaultQuery = "flowers bouquet",
  className,
}: Props) {
  const [query, setQuery] = useState(defaultQuery)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const search = useCallback(async (q: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/pexels/search?q=${encodeURIComponent(q)}&per_page=12&orientation=portrait`
      )
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error || "Search failed")
        setPhotos([])
        return
      }
      setPhotos(data.photos || [])
    } catch {
      setError("Could not reach Pexels. Check your network and API key.")
      setPhotos([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSelect = (p: Photo) => {
    setSelectedId(p.id)
    const url = p.src.large || p.src.medium || p.src.original
    onSelect(url, {
      photographer: p.photographer,
      alt: p.alt || query,
    })
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-label-secondary" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                search(query)
              }
            }}
            placeholder="Search Pexels (flowers, wedding…)"
            className="pl-10 h-11 text-[16px]"
          />
        </div>
        <Button
          type="button"
          onClick={() => search(query)}
          disabled={loading}
          className="h-11 shrink-0"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </div>

      {error && (
        <p className="text-[13px] text-red-600 bg-red-50 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[280px] overflow-y-auto rounded-xl">
          {photos.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelect(p)}
              className={cn(
                "relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all touch-manipulation",
                selectedId === p.id
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-transparent active:scale-[0.97]"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src.medium}
                alt={p.alt || ""}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              {selectedId === p.id && (
                <span className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center">
                  <Check className="h-3.5 w-3.5" />
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <p className="text-[11px] text-label-secondary">
        Photos from{" "}
        <a
          href="https://www.pexels.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Pexels
        </a>
        . Credit the photographer when required.
      </p>
    </div>
  )
}
