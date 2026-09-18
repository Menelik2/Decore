"use client"

import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

const HeroCanvas = dynamic(
  () => import("./three/hero-canvas").then((m) => m.HeroCanvas),
  { ssr: false, loading: () => null }
)

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden glass-mesh">
      <HeroCanvas />

      <div className="absolute inset-0 pointer-events-none z-[1]" aria-hidden>
        <motion.div
          className="absolute top-[15%] left-[10%] h-40 w-40 rounded-full bg-blush/30 blur-3xl"
          animate={{ y: [0, 20, 0], x: [0, 12, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[20%] right-[8%] h-48 w-48 rounded-full bg-gold/20 blur-3xl"
          animate={{ y: [0, -16, 0], x: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-xl w-full px-4 sm:px-5 pt-20 pb-12 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="glass-strong rounded-[28px] p-6 sm:p-8 text-center pointer-events-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 glass-chip rounded-full px-3.5 py-1.5 mb-5 text-[12px] font-semibold text-deep-burgundy"
          >
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Premium Floral Studio
          </motion.div>

          <motion.h1
            className="text-[32px] sm:text-[40px] md:text-[44px] font-bold tracking-tight text-label leading-[1.1] mb-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.7 }}
          >
            Where Flowers
            <br />
            <span className="text-gradient">Become Memories</span>
          </motion.h1>

          <motion.p
            className="text-[15px] text-label-secondary leading-relaxed mb-7 max-w-sm mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            Elegant florals & event décor crafted in Ethiopia — delivered with care.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-2.5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <Link
              href="/designs"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-primary text-white text-[15px] font-semibold shadow-lg shadow-primary/25 active:scale-[0.97] transition-transform w-full sm:w-auto"
            >
              Explore Designs
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/booking"
              className="inline-flex items-center justify-center h-12 px-6 rounded-full glass text-[15px] font-semibold text-label active:scale-[0.97] transition-transform w-full sm:w-auto"
            >
              Book Decorations
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-5 grid grid-cols-3 gap-2 pointer-events-auto"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
        >
          {[
            { value: "500+", label: "Events" },
            { value: "4.9★", label: "Rating" },
            { value: "ET", label: "Ethiopia" },
          ].map((s) => (
            <motion.div
              key={s.label}
              className="glass rounded-2xl py-3 px-2 text-center"
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
            >
              <p className="text-[16px] font-bold text-label tracking-tight">{s.value}</p>
              <p className="text-[11px] text-label-secondary mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
