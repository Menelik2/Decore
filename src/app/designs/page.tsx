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

    // Category
    if (category !== "all") {
      result = result.filter((d) => d.categorySlug === category)
    }

    // Featured only
    if (showFeaturedOnly) {
      result = result.filter((d) => d.isFeatured)
    }

    // Search
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

    // Sort
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
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
            Portfolio
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-deep-burgundy mb-3">
            Design Gallery
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Explore our collection of premium floral designs and event decorations.
            Filter by occasion, style, or search for exactly what you need.
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
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-7">
            {filtered.map((design, i) => (
              <DesignCard key={design.id} design={design} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
