"use client"

import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { motion } from "framer-motion"
import { Heart, Eye, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageCard3D } from "@/components/shared/image-card-3d"
import { formatPrice } from "@/lib/utils"
import type { Design } from "@/lib/data/designs"

interface DesignCardProps {
  design: Design
  index?: number
}

export function DesignCard({ design, index = 0 }: DesignCardProps) {
  const { addItem } = useCart()

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: design.id,
      design_id: design.id,
      name: design.title,
      price: design.startingPrice,
      image: design.images[0]?.url,
      slug: design.slug,
    })
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.35) }}
      className="group relative"
    >
      <ImageCard3D tiltMax={14} glare depthShadow className="w-full">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={design.images[0]?.url}
            alt={design.images[0]?.alt || design.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          {/* Layered depth shine on image */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent opacity-40"
            aria-hidden
          />

          {/* Badges — float above card plane */}
          <div
            className="absolute top-3 left-3 flex flex-wrap gap-1.5"
            style={{ transform: "translateZ(40px)" }}
          >
            {design.isNew && (
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-md">
                New
              </span>
            )}
            {design.isTrending && (
              <span className="rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-md">
                Trending
              </span>
            )}
            {design.isFeatured && !design.isNew && !design.isTrending && (
              <span className="rounded-full bg-deep-burgundy/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-md">
                Featured
              </span>
            )}
          </div>

          {/* Favorite */}
          <button
            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-md"
            aria-label="Add to favorites"
            style={{ transform: "translateZ(40px)" }}
          >
            <Heart className="h-4 w-4 text-primary" />
          </button>

          {/* Hover overlay + actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div
            className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0"
            style={{ transform: "translateZ(48px)" }}
          >
            <Link href={`/designs/${design.slug}`} className="flex-1">
              <Button size="sm" className="w-full text-xs gap-1.5 shadow-lg">
                <Eye className="h-3.5 w-3.5" />
                View
              </Button>
            </Link>
            <Button
              size="sm"
              variant="secondary"
              className="flex-1 w-full text-xs gap-1 shadow-lg"
              onClick={handleAdd}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Add
            </Button>
          </div>
        </div>
      </ImageCard3D>

      <div className="mt-3.5 px-0.5">
        <p className="text-[11px] font-medium text-primary uppercase tracking-wider mb-0.5">
          {design.category}
        </p>
        <h3 className="font-medium text-[15px] text-foreground leading-snug group-hover:text-primary transition-colors">
          <Link href={`/designs/${design.slug}`}>{design.title}</Link>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          From {formatPrice(design.startingPrice)}
        </p>
      </div>
    </motion.article>
  )
}
