import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { products as staticProducts } from "@/lib/data/products"

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key || url.includes("your_supabase")) {
      return NextResponse.json({ source: "static", data: staticProducts })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        id, name, slug, description, price, is_featured,
        categories ( name, slug ),
        product_images ( url, alt, sort_order )
      `
      )
      .eq("is_published", true)
      .order("created_at", { ascending: false })

    if (error || !data?.length) {
      return NextResponse.json({ source: "static", data: staticProducts })
    }

    const mapped = data.map((row) => {
      const cat = row.categories as { name?: string } | null
      const imgs =
        (row.product_images as { url: string; sort_order?: number }[]) || []
      const sorted = [...imgs].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
      )
      return {
        id: String(row.id),
        name: row.name,
        slug: row.slug,
        description: row.description ?? "",
        price: Number(row.price ?? 0),
        category: cat?.name ?? "Bouquets",
        image:
          sorted[0]?.url ||
          "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80",
        isFeatured: Boolean(row.is_featured),
      }
    })

    return NextResponse.json({ source: "supabase", data: mapped })
  } catch {
    return NextResponse.json({ source: "static", data: staticProducts })
  }
}
