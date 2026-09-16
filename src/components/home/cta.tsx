"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-deep-burgundy via-primary to-rose" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-8xl">🌸</div>
        <div className="absolute bottom-10 right-10 text-8xl">💐</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl opacity-50">🌹</div>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        <motion.h2
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Let&apos;s Create Something Beautiful.
        </motion.h2>
        <motion.p
          className="text-white/80 text-lg mb-10 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Whether it&apos;s a single bouquet or a full venue transformation, we&apos;re here to bring your vision to life.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/designs">
            <Button size="xl" variant="secondary" className="min-w-[180px] group">
              Explore Designs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/flowers">
            <Button
              size="xl"
              variant="outline"
              className="min-w-[180px] border-white/40 text-white hover:bg-white hover:text-deep-burgundy"
            >
              Order Flowers
            </Button>
          </Link>
          <Link href="/booking">
            <Button
              size="xl"
              variant="outline"
              className="min-w-[180px] border-white/40 text-white hover:bg-white hover:text-deep-burgundy"
            >
              Book Decorations
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
