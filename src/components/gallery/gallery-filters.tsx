"use client"

import { Search, X, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { categories } from "@/lib/data/designs"

interface GalleryFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  category: string
  onCategoryChange: (value: string) => void
  sort: string
  onSortChange: (value: string) => void
  showFeaturedOnly: boolean
  onFeaturedToggle: () => void
  resultCount: number
}

export function GalleryFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  showFeaturedOnly,
  onFeaturedToggle,
  resultCount,
}: GalleryFiltersProps) {
  return (
    <div className="space-y-5">
      {/* Search + Sort row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search designs, flowers, occasions..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10 h-11 rounded-full bg-white border-border/80"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="h-11 rounded-full border border-border/80 bg-white px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A–Z</option>
          </select>

          <Button
            variant={showFeaturedOnly ? "default" : "outline"}
            size="default"
            onClick={onFeaturedToggle}
            className="rounded-full gap-1.5 shrink-0"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Featured</span>
          </Button>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => onCategoryChange(cat.slug)}
            className={cn(
              "shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
              category === cat.slug
                ? "bg-primary text-white shadow-md"
                : "bg-white border border-border/80 text-foreground/80 hover:border-primary/40 hover:text-primary"
            )}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{resultCount}</span> design
        {resultCount !== 1 ? "s" : ""}
      </p>
    </div>
  )
}
