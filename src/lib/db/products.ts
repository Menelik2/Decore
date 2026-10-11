import { createClient } from "@/lib/supabase/client"
import {
  products as staticProducts,
  productCategories as staticProductCategories,
  type Product,
} from "@/lib/data/products"

function mapProduct(row: Record<string, unknown>): Product {
  const cat = row.categories as { name?: string; slug?: string } | null
  const imgs =
    (row.product_images as { url: string; alt?: string; sort_order?: number }[]) ||
    []
  const sorted = [...imgs].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  const first = sorted[0]

  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    slug: String(row.slug ?? ""),
    description: String(row.description ?? ""),
    price: Number(row.price ?? 0),
    category: cat?.name ?? String(row.category ?? "Bouquets"),
    image:
      first?.url ||
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80",
    isFeatured: Boolean(row.is_featured),
  }
}

function hasSupabase() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your_supabase")
  )
}

export async function fetchProducts(): Promise<Product[]> {
  if (!hasSupabase()) return staticProducts

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        id, name, slug, description, price, is_featured, is_published,
        categories ( name, slug ),
        product_images ( url, alt, sort_order )
      `
      )
      .eq("is_published", true)
      .order("created_at", { ascending: false })

    if (error || !data?.length) {
      console.warn("[db] products fallback to static:", error?.message)
      return staticProducts
    }
    return data.map((row) => mapProduct(row as Record<string, unknown>))
  } catch (e) {
    console.warn("[db] products error, using static:", e)
    return staticProducts
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (!hasSupabase()) {
    return staticProducts.find((p) => p.slug === slug) ?? null
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        id, name, slug, description, price, is_featured,
        categories ( name, slug ),
        product_images ( url, alt, sort_order )
      `
      )
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle()

    if (error || !data) {
      return staticProducts.find((p) => p.slug === slug) ?? null
    }
    return mapProduct(data as Record<string, unknown>)
  } catch {
    return staticProducts.find((p) => p.slug === slug) ?? null
  }
}

export { staticProducts as products, staticProductCategories as productCategories }
