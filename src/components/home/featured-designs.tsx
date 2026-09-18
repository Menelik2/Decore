"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { DesignCard } from "@/components/gallery/design-card"
import { designs } from "@/lib/data/designs"

const featured = designs.filter((d) => d.isFeatured).slice(0, 6)

export function FeaturedDesigns() {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[#f5f5f7]" />
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(232,196,204,0.35) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[13px] font-semibold text-primary tracking-wide mb-2">
              Featured
            </p>
            <h2 className="text-[28px] md:text-[34px] font-bold tracking-tight text-label leading-[1.15]">
              Our Beautiful Designs
            </h2>
            <p className="mt-2 text-[15px] text-label-secondary max-w-md">
              Handpicked looks with 3D glass cards — tilt on hover.
            </p>
          </motion.div>
          <Link
            href="/designs"
            className="inline-flex items-center gap-1.5 h-11 px-5 rounded-full glass text-[14px] font-semibold text-label active:scale-[0.97] transition-transform shrink-0 self-start sm:self-auto"
          >
            View All
            <ArrowRight className="h-4 w-4" />
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
