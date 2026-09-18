"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageCard3D } from "@/components/shared/image-card-3d"
import { products, productCategories } from "@/lib/data/products"
import { useCart } from "@/lib/cart-context"
import { formatPrice, cn } from "@/lib/utils"

export default function FlowersPage() {
  const [category, setCategory] = useState("All")
  const { addItem } = useCart()
  const [addedId, setAddedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (category === "All") return products
    return products.filter((p) => p.category === category)
  }, [category])

  const handleAdd = (p: (typeof products)[0]) => {
    addItem({
      id: p.id,
      product_id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      slug: p.slug,
    })
    setAddedId(p.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
            Shop
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-deep-burgundy mb-3">
            Fresh Flowers
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Hand-arranged bouquets, gift boxes, and potted plants — delivered
            across Ethiopia.
          </p>
        </motion.div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 -mx-1 px-1">
          {productCategories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all",
                category === c
                  ? "bg-primary text-white shadow-md"
                  : "bg-white border border-border text-foreground/80 hover:border-primary/40"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filtered.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.35) }}
              className="group"
            >
              <ImageCard3D tiltMax={18} glare depthShadow float className="w-full">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.12]"
                    loading="lazy"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-50"
                    aria-hidden
                  />
                  {p.isFeatured && (
                    <span className="absolute top-3 left-3 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase text-white shadow-md">
                      Featured
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </ImageCard3D>

              <div className="mt-3.5 px-0.5">
                <p className="text-[11px] font-medium text-primary uppercase tracking-wider">
                  {p.category}
                </p>
                <h2 className="font-medium text-foreground mt-0.5 leading-snug group-hover:text-primary transition-colors">
                  {p.name}
                </h2>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {p.description}
                </p>
                <div className="flex items-center justify-between mt-3 gap-2">
                  <span className="font-semibold text-foreground">
                    {formatPrice(p.price)}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleAdd(p)}
                    className="gap-1.5 shadow-md"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    {addedId === p.id ? "Added" : "Add"}
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  )
}
