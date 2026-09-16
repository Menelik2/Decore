"use client"

import { useState } from "react"
import { Search, Package, ShoppingBag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { products, productCategories } from "@/lib/data/products"
import { useCart } from "@/lib/cart-context"
import { formatPrice, cn } from "@/lib/utils"

export default function AdminProductsPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const { addItem } = useCart()

  const filtered = products.filter((p) => {
    if (category !== "All" && p.category !== category) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="mb-5">
        <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-semibold text-deep-burgundy">
          Products
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Flower products ({products.length}) — manage via Supabase when connected
        </p>
      </div>

      <div className="flex flex-col gap-2.5 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          {productCategories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-2 text-xs font-medium min-h-[40px] touch-manipulation",
                category === c
                  ? "bg-primary text-white"
                  : "bg-white border border-border text-foreground/80"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-border bg-white overflow-hidden flex sm:flex-col"
          >
            <div className="w-24 sm:w-full aspect-square sm:aspect-[4/3] shrink-0 bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="p-3 sm:p-4 flex-1 flex flex-col min-w-0">
              <p className="text-[10px] font-medium text-primary uppercase tracking-wide">
                {p.category}
              </p>
              <h3 className="font-medium text-sm leading-snug truncate">{p.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 hidden sm:block">
                {p.description}
              </p>
              <div className="mt-auto pt-2 flex items-center justify-between gap-2">
                <span className="font-semibold text-sm">{formatPrice(p.price)}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs gap-1 min-h-[36px]"
                  onClick={() =>
                    addItem({
                      id: p.id,
                      product_id: p.id,
                      name: p.name,
                      price: p.price,
                      image: p.image,
                      slug: p.slug,
                    })
                  }
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Test add
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-border bg-white p-10 text-center">
          <Package className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">No products match</p>
        </div>
      )}
    </div>
  )
}
