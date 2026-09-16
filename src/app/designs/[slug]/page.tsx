"use client"

import { use, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DesignCard } from "@/components/gallery/design-card"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import {
  getDesignBySlug,
  getRelatedDesigns,
} from "@/lib/data/designs"

export default function DesignDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const [activeImage, setActiveImage] = useState(0)
  const [liked, setLiked] = useState(false)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const design = getDesignBySlug(slug)

  if (!design) {
    notFound()
  }

  const related = getRelatedDesigns(design)

  const imageCount = design.images.length || 1
  const nextImage = () =>
    setActiveImage((i) => (i + 1) % imageCount)
  const prevImage = () =>
    setActiveImage((i) => (i - 1 + imageCount) % imageCount)

  const handleAddToCart = () => {
    addItem({
      id: design.id,
      design_id: design.id,
      name: design.title,
      price: design.startingPrice,
      image: design.images[0]?.url,
      slug: design.slug,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="min-h-screen pt-20 pb-20">
      {/* Back */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
        <Link
          href="/designs"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Gallery
        </Link>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
              <img
                src={design.images[activeImage]?.url}
                alt={design.images[activeImage]?.alt || design.title}
                className="h-full w-full object-cover"
              />

              {design.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-1.5">
                {design.isNew && (
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                    New
                  </span>
                )}
                {design.isTrending && (
                  <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-white">
                    Trending
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {design.images.length > 1 && (
              <div className="flex gap-3">
                {design.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative h-20 w-20 rounded-xl overflow-hidden border-2 transition-all ${
                      i === activeImage
                        ? "border-primary shadow-md"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
              {design.category}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-deep-burgundy leading-tight mb-3">
              {design.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-4 w-4 fill-gold text-gold" />
              ))}
              <span className="text-sm text-muted-foreground ml-1">
                4.9 (24 reviews)
              </span>
            </div>

            <p className="text-2xl font-semibold text-foreground mb-6">
              From {formatPrice(design.startingPrice)}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ETB
              </span>
            </p>

            <p className="text-muted-foreground leading-relaxed mb-8">
              {design.description}
            </p>

            {/* Meta details */}
            <div className="space-y-5 mb-8">
              {/* Color palette */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2.5">
                  Color Palette
                </h3>
                <div className="flex gap-2">
                  {design.colorPalette.map((color) => (
                    <div
                      key={color}
                      className="h-8 w-8 rounded-full border border-border shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2.5">
                  Materials & Flowers
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[...design.materials, ...design.flowerTypes].map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Size & Occasion */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div>
                  <span className="text-muted-foreground">Size:</span>{" "}
                  <span className="font-medium">{design.size}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Occasion:</span>{" "}
                  <span className="font-medium capitalize">
                    {design.occasion.replace(/_/g, " ").toLowerCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <Button size="lg" className="flex-1 w-full" onClick={handleAddToCart}>
                {added ? "Added to Cart ✓" : "Add to Cart"}
              </Button>
              <Link href={`/booking?design=${design.slug}`} className="flex-1">
                <Button size="lg" variant="outline" className="w-full">
                  Book as Event
                </Button>
              </Link>
              <Button
                size="lg"
                variant="ghost"
                className="shrink-0"
                onClick={() => setLiked(!liked)}
                aria-label="Add to favorites"
              >
                <Heart
                  className={`h-5 w-5 ${liked ? "fill-primary text-primary" : ""}`}
                />
              </Button>
              <Button size="lg" variant="ghost" className="shrink-0" aria-label="Share">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Trust note */}
            <p className="mt-6 text-xs text-muted-foreground">
              🇪🇹 Designed & crafted in Ethiopia · Free consultation · Customization available
            </p>
          </motion.div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-deep-burgundy mb-8">
              Related Designs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((d, i) => (
                <DesignCard key={d.id} design={d} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
