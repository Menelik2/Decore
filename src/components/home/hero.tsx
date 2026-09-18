"use client"

import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

const HeroCanvas = dynamic(
  () => import("./three/hero-canvas").then((m) => m.HeroCanvas),
  { ssr: false, loading: () => null }
)

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Soft gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f5f5f7] via-[#fbf2f4]/80 to-[#f5e6e8]/40" />

      {/* Real 3D scene (parallax + orbit) */}
      <HeroCanvas />

      {/* Soft vignette so text stays readable over 3D */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(245,245,247,0.75) 0%, rgba(245,245,247,0.25) 45%, transparent 70%)",
        }}
      />

      {/* Content — above canvas */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center pt-16 pb-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md border border-black/[0.04] px-4 py-1.5 mb-7 text-[13px] font-medium text-deep-burgundy shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            <span>Premium Floral Design Studio</span>
          </div>
        </motion.div>

        <motion.h1
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-semibold tracking-tight text-deep-burgundy leading-[1.12] mb-5 drop-shadow-sm"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          Where Flowers
          <br />
          <span className="text-gradient">Become Memories</span>
        </motion.h1>

        <motion.p
          className="mx-auto max-w-lg text-[15px] sm:text-base text-label-secondary leading-relaxed mb-9"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22 }}
        >
          Beautiful flowers, elegant decorations, and unforgettable event
          experiences crafted with love in Ethiopia.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pointer-events-auto"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.35 }}
        >
          <Link href="/designs">
            <Button size="lg" className="min-w-[180px] group shadow-md">
              Explore Our Designs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/booking">
            <Button size="lg" variant="outline" className="min-w-[180px] bg-white/70 backdrop-blur-sm">
              Order Decorations
            </Button>
          </Link>
        </motion.div>

        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-[13px] text-label-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.55 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🇪🇹</span>
            <span>Made in Ethiopia</span>
          </div>
          <div className="hidden sm:block w-px h-3.5 bg-black/10" />
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-label">500+</span>
            <span>Events Styled</span>
          </div>
          <div className="hidden sm:block w-px h-3.5 bg-black/10" />
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-label">4.9★</span>
            <span>Customer Rating</span>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background to-transparent pointer-events-none z-[1]" />
    </section>
  )
}
