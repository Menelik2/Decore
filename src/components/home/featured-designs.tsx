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
    <section className="py-16 md:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 md:mb-12">
          <div>
            <p className="text-[13px] font-semibold text-primary tracking-wide mb-2">
              Featured
            </p>
            <h2 className="text-[28px] md:text-[34px] font-bold tracking-tight text-label leading-[1.15]">
              Our Beautiful Designs
            </h2>
            <p className="mt-2 text-[15px] text-label-secondary max-w-md">
              Handpicked looks from recent weddings, parties, and private events.
            </p>
          </div>
          <Link href="/designs" className="shrink-0">
            <Button variant="secondary" className="group">
              View All
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
          {featured.map((design, index) => (
            <DesignCard key={design.id} design={design} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
