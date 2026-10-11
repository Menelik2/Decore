import { createClient } from "@/lib/supabase/client"
import {
  designs as staticDesigns,
  categories as staticCategories,
  type Design,
} from "@/lib/data/designs"

function mapRow(row: Record<string, unknown>): Design {
  const cat = row.categories as { name?: string; slug?: string } | null
  const imgs =
    (row.gallery_images as {
      url: string
      alt?: string
      is_before?: boolean
      sort_order?: number
    }[]) || []
  const sorted = [...imgs].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    slug: String(row.slug ?? ""),
    description: String(row.description ?? ""),
    category: cat?.name ?? "Designs",
    categorySlug: cat?.slug ?? "all",
    occasion: String(row.occasion ?? "OTHER"),
    startingPrice: Number(row.starting_price ?? 0),
    isFeatured: Boolean(row.is_featured),
    isTrending: Boolean(row.is_trending),
    isNew: Boolean(row.is_new),
    materials: (row.materials as string[]) || [],
    flowerTypes: (row.flower_types as string[]) || [],
    colorPalette: (row.color_palette as string[]) || [],
    size: String(row.size ?? "Medium"),
    images: sorted.map((img) => ({
      url: img.url,
      alt: img.alt || String(row.title ?? ""),
      isBefore: img.is_before,
    })),
    tags: [],
  }
}

function hasSupabase() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your_supabase")
  )
}

export async function fetchDesigns(): Promise<Design[]> {
  if (!hasSupabase()) return staticDesigns

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("gallery_designs")
      .select(
        `
        id, title, slug, description, occasion, starting_price,
        is_featured, is_trending, is_new, materials, flower_types,
        color_palette, size,
        categories ( name, slug ),
        gallery_images ( url, alt, is_before, sort_order )
      `
      )
      .order("created_at", { ascending: false })

    if (error || !data?.length) {
      console.warn("[db] designs fallback to static:", error?.message)
      return staticDesigns
    }
    return data.map((row) => mapRow(row as Record<string, unknown>))
  } catch (e) {
    console.warn("[db] designs error, using static:", e)
    return staticDesigns
  }
}

export async function fetchDesignBySlug(slug: string): Promise<Design | null> {
  if (!hasSupabase()) {
    return staticDesigns.find((d) => d.slug === slug) ?? null
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("gallery_designs")
      .select(
        `
        id, title, slug, description, occasion, starting_price,
        is_featured, is_trending, is_new, materials, flower_types,
        color_palette, size,
        categories ( name, slug ),
        gallery_images ( url, alt, is_before, sort_order )
      `
      )
      .eq("slug", slug)
      .maybeSingle()

    if (error || !data) {
      return staticDesigns.find((d) => d.slug === slug) ?? null
    }
    return mapRow(data as Record<string, unknown>)
  } catch {
    return staticDesigns.find((d) => d.slug === slug) ?? null
  }
}

export async function fetchCategories() {
  if (!hasSupabase()) return staticCategories

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("categories")
      .select("name, slug")
      .order("sort_order", { ascending: true })

    if (error || !data?.length) return staticCategories

    return [
      { name: "All", slug: "all", icon: "✨" },
      ...data.map((c) => ({
        name: c.name as string,
        slug: c.slug as string,
        icon: "🌸",
      })),
    ]
  } catch {
    return staticCategories
  }
}

export { staticDesigns as designs, staticCategories as categories }
