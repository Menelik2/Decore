"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { DesignCard } from "@/components/gallery/design-card"
import { GalleryFilters } from "@/components/gallery/gallery-filters"
import { designs } from "@/lib/data/designs"

export default function DesignsPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [sort, setSort] = useState("featured")
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)

  const filtered = useMemo(() => {
    let result = [...designs]

    if (category !== "all") {
      result = result.filter((d) => d.categorySlug === category)
    }

    if (showFeaturedOnly) {
      result = result.filter((d) => d.isFeatured)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.tags.some((t) => t.includes(q)) ||
          d.flowerTypes.some((f) => f.toLowerCase().includes(q)) ||
          d.materials.some((m) => m.toLowerCase().includes(q))
      )
    }

    switch (sort) {
      case "newest":
        result = result.filter((d) => d.isNew).concat(result.filter((d) => !d.isNew))
        break
      case "price-asc":
        result.sort((a, b) => a.startingPrice - b.startingPrice)
        break
      case "price-desc":
        result.sort((a, b) => b.startingPrice - a.startingPrice)
        break
      case "name":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "featured":
      default:
        result.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1
          if (!a.isFeatured && b.isFeatured) return 1
          if (a.isTrending && !b.isTrending) return -1
          if (!a.isTrending && b.isTrending) return 1
          return 0
        })
    }

    return result
  }, [search, category, sort, showFeaturedOnly])

  return (
    <div className="min-h-screen pt-24 pb-24 relative overflow-hidden">
      {/* Soft luxury background atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[40vw] h-[30vh] rounded-full bg-gold/10 blur-3xl" />
      </div>

      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-sm font-medium text-primary uppercase tracking-[0.2em] mb-3">
            Portfolio
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-semibold text-deep-burgundy mb-4 leading-tight">
            Design Gallery
          </h1>
          <p className="text-muted-foreground max-w-xl text-base sm:text-lg leading-relaxed">
            Explore premium floral designs and event decorations — tilt, hover,
            and discover the details in three dimensions.
          </p>
        </motion.div>
      </div>

      {/* Filters + Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <GalleryFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          sort={sort}
          onSortChange={setSort}
          showFeaturedOnly={showFeaturedOnly}
          onFeaturedToggle={() => setShowFeaturedOnly((v) => !v)}
          resultCount={filtered.length}
        />

        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-5xl mb-4">🌸</p>
            <h3 className="font-serif text-xl font-medium text-deep-burgundy mb-2">
              No designs found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearch("")
                setCategory("all")
                setShowFeaturedOnly(false)
              }}
              className="text-sm font-medium text-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 md:gap-8 lg:gap-9"
          >
            {filtered.map((design, i) => (
              <DesignCard key={design.id} design={design} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
