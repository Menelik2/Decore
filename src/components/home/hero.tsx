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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Soft gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-champagne/50 to-blush/25" />

      {/* 3D flower scene */}
      <HeroCanvas />

      {/* Extra soft glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-sm border border-border/50 px-4 py-1.5 mb-8 text-sm text-deep-burgundy shadow-sm">
            <Sparkles className="h-4 w-4 text-gold" />
            <span>Premium Floral Design Studio</span>
          </div>
        </motion.div>

        <motion.h1
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-deep-burgundy leading-[1.15] mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
        >
          Where Flowers
          <br />
          <span className="text-gradient">Become Memories</span>
        </motion.h1>

        <motion.p
          className="mx-auto max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Beautiful flowers, elegant decorations, and unforgettable event
          experiences crafted with love in Ethiopia.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          <Link href="/designs">
            <Button size="xl" className="min-w-[200px] group">
              Explore Our Designs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/booking">
            <Button size="xl" variant="outline" className="min-w-[200px]">
              Order Decorations
            </Button>
          </Link>
        </motion.div>

        <motion.div
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇪🇹</span>
            <span>Made in Ethiopia</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">500+</span>
            <span>Events Styled</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">4.9★</span>
            <span>Customer Rating</span>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
