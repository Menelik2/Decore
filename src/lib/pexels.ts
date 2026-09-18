/**
 * Pexels stock photo integration.
 * API key must stay server-side (PEXELS_API_KEY).
 * Docs: https://www.pexels.com/api/documentation/
 */

export type PexelsPhoto = {
  id: number
  width: number
  height: number
  url: string
  photographer: string
  photographer_url: string
  alt: string | null
  src: {
    original: string
    large2x: string
    large: string
    medium: string
    small: string
    portrait: string
    landscape: string
    tiny: string
  }
}

export type PexelsSearchResult = {
  total_results: number
  page: number
  per_page: number
  photos: PexelsPhoto[]
  next_page?: string
}

const PEXELS_BASE = "https://api.pexels.com/v1"

export function getPexelsApiKey(): string | null {
  const key = process.env.PEXELS_API_KEY
  if (!key || key.includes("your_")) return null
  return key
}

export async function searchPexels(
  query: string,
  opts?: { page?: number; perPage?: number; orientation?: "landscape" | "portrait" | "square" }
): Promise<PexelsSearchResult | { error: string }> {
  const key = getPexelsApiKey()
  if (!key) {
    return { error: "Pexels API key not configured. Set PEXELS_API_KEY in .env" }
  }

  const q = query.trim() || "flowers"
  const page = opts?.page ?? 1
  const perPage = Math.min(opts?.perPage ?? 15, 30)

  const params = new URLSearchParams({
    query: q,
    page: String(page),
    per_page: String(perPage),
  })
  if (opts?.orientation) params.set("orientation", opts.orientation)

  const res = await fetch(`${PEXELS_BASE}/search?${params}`, {
    headers: { Authorization: key },
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    return { error: `Pexels error ${res.status}: ${text.slice(0, 120)}` }
  }

  return (await res.json()) as PexelsSearchResult
}

export function pexelsCardUrl(photo: PexelsPhoto): string {
  return photo.src.large || photo.src.medium || photo.src.original
}
