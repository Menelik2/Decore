"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { DesignCard } from "@/components/gallery/design-card"
import { designs } from "@/lib/data/designs"

const featured = designs.filter((d) => d.isFeatured).slice(0, 6)

export function FeaturedDesigns() {
  return (
    <section className="section-padding bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
              Featured
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-deep-burgundy">
              Our Beautiful Designs
            </h2>
          </div>
          <Link href="/designs">
            <Button variant="outline" className="group">
              View All Designs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featured.map((design, index) => (
            <DesignCard key={design.id} design={design} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
