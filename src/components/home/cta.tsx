"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[#1d1d1f]" />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139,41,66,0.55) 0%, transparent 55%)",
        }}
      />
      <motion.div
        className="absolute top-1/4 left-1/4 h-32 w-32 rounded-full bg-primary/30 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="relative z-10 mx-auto max-w-lg px-5">
        <motion.div
          className="glass-dark rounded-[28px] p-7 sm:p-9 text-center"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-[26px] sm:text-[32px] font-bold tracking-tight text-white leading-[1.15] mb-3">
            Let’s create something beautiful
          </h2>
          <p className="text-[15px] text-white/55 leading-relaxed mb-8 max-w-sm mx-auto">
            From a single bouquet to a full venue — tell us the occasion.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Link
              href="/designs"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-white text-[#1d1d1f] text-[15px] font-semibold active:scale-[0.97] transition-transform w-full sm:w-auto"
            >
              Explore Designs
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/booking"
              className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-white/20 text-white text-[15px] font-semibold active:scale-[0.97] transition-transform w-full sm:w-auto hover:bg-white/10"
            >
              Book Decorations
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
