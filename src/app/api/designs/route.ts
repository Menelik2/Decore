import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { designs as staticDesigns } from "@/lib/data/designs"

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key || url.includes("your_supabase")) {
      return NextResponse.json({ source: "static", data: staticDesigns })
    }

    const supabase = await createClient()
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
      return NextResponse.json({ source: "static", data: staticDesigns })
    }

    const mapped = data.map((row) => {
      const cat = row.categories as { name?: string; slug?: string } | null
      const imgs =
        (row.gallery_images as {
          url: string
          alt?: string
          is_before?: boolean
          sort_order?: number
        }[]) || []
      const sorted = [...imgs].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
      )
      return {
        id: String(row.id),
        title: row.title,
        slug: row.slug,
        description: row.description ?? "",
        category: cat?.name ?? "Designs",
        categorySlug: cat?.slug ?? "all",
        occasion: row.occasion ?? "OTHER",
        startingPrice: Number(row.starting_price ?? 0),
        isFeatured: Boolean(row.is_featured),
        isTrending: Boolean(row.is_trending),
        isNew: Boolean(row.is_new),
        materials: (row.materials as string[]) || [],
        flowerTypes: (row.flower_types as string[]) || [],
        colorPalette: (row.color_palette as string[]) || [],
        size: row.size ?? "Medium",
        images: sorted.map((img) => ({
          url: img.url,
          alt: img.alt || row.title,
          isBefore: img.is_before,
        })),
        tags: [] as string[],
      }
    })

    return NextResponse.json({ source: "supabase", data: mapped })
  } catch {
    return NextResponse.json({ source: "static", data: staticDesigns })
  }
}
