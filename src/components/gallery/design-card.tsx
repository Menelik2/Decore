"use client"

import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { motion } from "framer-motion"
import { Heart, Eye, ShoppingBag, Sparkles } from "lucide-react"
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
      initial={{ opacity: 0, y: 36, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.55,
        delay: Math.min(index * 0.07, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative [perspective:1000px]"
    >
      <ImageCard3D tiltMax={18} glare depthShadow float className="w-full">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={design.images[0]?.url}
            alt={design.images[0]?.alt || design.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.12]"
            loading="lazy"
          />

          {/* Diagonal light streak */}
          <div
            className="pointer-events-none absolute -inset-full bg-gradient-to-br from-white/0 via-white/25 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rotate-12 translate-x-[-20%]"
            aria-hidden
          />

          {/* Badges — float in 3D space */}
          <div
            className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10"
            style={{ transform: "translateZ(48px)" }}
          >
            {design.isNew && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/95 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-lg shadow-primary/30">
                <Sparkles className="h-3 w-3" />
                New
              </span>
            )}
            {design.isTrending && (
              <span className="rounded-full bg-gold/95 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-lg shadow-gold/30">
                Trending
              </span>
            )}
            {design.isFeatured && !design.isNew && !design.isTrending && (
              <span className="rounded-full bg-deep-burgundy/95 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-lg">
                Featured
              </span>
            )}
          </div>

          {/* Favorite */}
          <button
            className="absolute top-3 right-3 h-10 w-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg z-10"
            aria-label="Add to favorites"
            style={{ transform: "translateZ(48px)" }}
          >
            <Heart className="h-4 w-4 text-primary" />
          </button>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

          {/* Color dots preview */}
          <div
            className="absolute bottom-16 left-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10"
            style={{ transform: "translateZ(40px)" }}
          >
            {design.colorPalette.slice(0, 4).map((c) => (
              <span
                key={c}
                className="h-3.5 w-3.5 rounded-full border border-white/50 shadow-sm"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div
            className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-4 group-hover:translate-y-0 z-10"
            style={{ transform: "translateZ(56px)" }}
          >
            <Link href={`/designs/${design.slug}`} className="flex-1">
              <Button
                size="sm"
                className="w-full text-xs gap-1.5 shadow-xl shadow-black/20 backdrop-blur-sm"
              >
                <Eye className="h-3.5 w-3.5" />
                View
              </Button>
            </Link>
            <Button
              size="sm"
              variant="secondary"
              className="flex-1 w-full text-xs gap-1 shadow-xl shadow-black/20 backdrop-blur-sm bg-white/95 hover:bg-white"
              onClick={handleAdd}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Add
            </Button>
          </div>
        </div>
      </ImageCard3D>

      {/* Meta under card */}
      <div className="mt-4 px-0.5">
        <p className="text-[11px] font-medium text-primary uppercase tracking-wider mb-1">
          {design.category}
        </p>
        <h3 className="font-medium text-[15px] text-foreground leading-snug group-hover:text-primary transition-colors duration-300">
          <Link href={`/designs/${design.slug}`}>{design.title}</Link>
        </h3>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-foreground/90">
            From {formatPrice(design.startingPrice)}
          </p>
          <span className="text-[10px] text-muted-foreground truncate max-w-[40%]">
            {design.size}
          </span>
        </div>
      </div>
    </motion.article>
  )
}
