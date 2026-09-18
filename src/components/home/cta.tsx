"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="relative overflow-hidden py-20 md:py-24">
      <div className="absolute inset-0 bg-[#1d1d1f]" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,41,66,0.55) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-2xl px-5 text-center">
        <motion.h2
          className="text-[28px] sm:text-[34px] md:text-[40px] font-bold tracking-tight text-white leading-[1.15] mb-3"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Let’s create something beautiful
        </motion.h2>
        <motion.p
          className="text-[15px] sm:text-[17px] text-white/55 leading-relaxed mb-9 max-w-md mx-auto"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
        >
          From a single bouquet to a full venue — tell us the occasion, we’ll
          handle the rest.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.14 }}
        >
          <Link href="/designs">
            <Button size="lg" className="min-w-[160px] group bg-white text-[#1d1d1f] hover:bg-white/90">
              Explore Designs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <Link href="/booking">
            <Button
              size="lg"
              variant="outline"
              className="min-w-[160px] border-white/20 text-white hover:bg-white/10"
            >
              Book Decorations
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
