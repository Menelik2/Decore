"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { useRef } from "react"

function GlassPanel({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springX = useSpring(mx, { stiffness: 120, damping: 18 })
  const springY = useSpring(my, { stiffness: 120, damping: 18 })
  const rotateX = useTransform(springY, [-40, 40], [5, -5])
  const rotateY = useTransform(springX, [-40, 40], [-6, 6])

  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    let clientX: number
    let clientY: number
    if ("touches" in e) {
      if (!e.touches[0]) return
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }
    mx.set((clientX - cx) * 0.3)
    my.set((clientY - cy) * 0.3)
  }

  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onTouchMove={onMove}
      onTouchEnd={onLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="glass-strong rounded-[28px] p-6 sm:p-8 text-center pointer-events-auto will-change-transform"
    >
      {children}
    </motion.div>
  )
}

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden glass-mesh">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <motion.div
          className="absolute top-[18%] left-[12%] h-36 w-36 rounded-full bg-blush/25 blur-3xl"
          animate={{ y: [0, 16, 0], x: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[22%] right-[10%] h-44 w-44 rounded-full bg-gold/15 blur-3xl"
          animate={{ y: [0, -14, 0], x: [0, -8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-xl w-full px-4 sm:px-5 pt-20 pb-12">
        <GlassPanel>
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
            transition={{ delay: 0.22, duration: 0.65 }}
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
        </GlassPanel>

        <motion.div
          className="mt-5 grid grid-cols-3 gap-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.55 }}
        >
          {[
            { value: "500+", label: "Events" },
            { value: "4.9★", label: "Rating" },
            { value: "ET", label: "Ethiopia" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl py-3 px-2 text-center">
              <p className="text-[16px] font-bold text-label tracking-tight">{s.value}</p>
              <p className="text-[11px] text-label-secondary mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
