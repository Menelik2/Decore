"use client"

import { Search, X, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { categories } from "@/lib/data/designs"
import { useTranslations } from "@/lib/i18n/locale-context"

const categoryKeyMap: Record<string, string> = {
  all: "all",
  flowers: "flowers",
  bouquets: "bouquets",
  weddings: "weddings",
  birthdays: "birthdays",
  graduation: "graduation",
  engagement: "engagement",
  "baby-shower": "babyShower",
  corporate: "corporate",
  "ethiopian-traditional": "ethiopianTraditional",
  events: "events",
  "home-decor": "homeDecor",
}

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
  const t = useTranslations()

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("Gallery.searchPlaceholder")}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10 h-11 rounded-full bg-white border-border/80"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={t("Gallery.clearSearch")}
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
            <option value="featured">{t("Gallery.featured")}</option>
            <option value="newest">{t("Gallery.newest")}</option>
            <option value="price-asc">{t("Gallery.priceLowHigh")}</option>
            <option value="price-desc">{t("Gallery.priceHighLow")}</option>
            <option value="name">{t("Gallery.nameAZ")}</option>
          </select>

          <Button
            variant={showFeaturedOnly ? "default" : "outline"}
            size="default"
            onClick={onFeaturedToggle}
            className="rounded-full gap-1.5 shrink-0"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">{t("Gallery.featured")}</span>
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        {categories.map((cat) => {
          const key = categoryKeyMap[cat.slug] ?? "all"
          return (
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
              <span>{t(`Categories.${key}`)}</span>
            </button>
          )
        })}
      </div>

      <p className="text-sm text-muted-foreground">
        {t("Gallery.showing")}{" "}
        <span className="font-medium text-foreground">{resultCount}</span>{" "}
        {resultCount !== 1 ? t("Gallery.designs") : t("Gallery.design")}
      </p>
    </div>
  )
}
