"use client"

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
  type MouseEvent,
} from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion"
import { cn } from "@/lib/utils"

type ImageCard3DProps = {
  children: ReactNode
  className?: string
  /** Max tilt degrees (default 18) */
  tiltMax?: number
  /** Specular glare on hover */
  glare?: boolean
  /** Depth shadow */
  depthShadow?: boolean
  /** Stronger “floating” lift on hover */
  float?: boolean
}

export function ImageCard3D({
  children,
  className,
  tiltMax = 18,
  glare = true,
  depthShadow = true,
  float = true,
}: ImageCard3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const spring = { stiffness: 220, damping: 22, mass: 0.6 }

  const rotateX = useSpring(
    useTransform(y, [-0.5, 0.5], [tiltMax, -tiltMax]),
    spring
  )
  const rotateY = useSpring(
    useTransform(x, [-0.5, 0.5], [-tiltMax, tiltMax]),
    spring
  )
  const scale = useSpring(1, spring)
  const liftZ = useSpring(0, spring)

  const glareX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), spring)
  const glareY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), spring)
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.18) 28%, transparent 58%)`

  // Soft secondary ambient glow that shifts with cursor
  const ambientX = useSpring(useTransform(x, [-0.5, 0.5], [20, 80]), spring)
  const ambientY = useSpring(useTransform(y, [-0.5, 0.5], [15, 75]), spring)
  const ambientGlow = useMotionTemplate`radial-gradient(circle at ${ambientX}% ${ambientY}%, rgba(201,168,108,0.35) 0%, rgba(92,26,46,0.12) 40%, transparent 70%)`

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (reducedMotion || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      x.set(px)
      y.set(py)
    },
    [reducedMotion, x, y]
  )

  const handleMouseEnter = () => {
    setIsHovering(true)
    if (!reducedMotion) {
      scale.set(1.055)
      if (float) liftZ.set(28)
    }
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    x.set(0)
    y.set(0)
    scale.set(1)
    liftZ.set(0)
  }

  if (reducedMotion) {
    return (
      <motion.div
        className={cn("relative", className)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.25 }}
      >
        <div
          className={cn(
            "relative w-full h-full rounded-2xl overflow-hidden",
            depthShadow && "shadow-lg"
          )}
        >
          {children}
        </div>
      </motion.div>
    )
  }

  return (
    <div
      ref={ref}
      className={cn("relative [perspective:1400px]", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Soft ground reflection / ambient blob */}
      {depthShadow && (
        <motion.div
          className="pointer-events-none absolute -inset-4 rounded-[2rem] opacity-0 blur-2xl transition-opacity duration-500"
          style={{
            opacity: isHovering ? 0.55 : 0,
            background:
              "radial-gradient(ellipse at center, rgba(92,26,46,0.28) 0%, rgba(201,168,108,0.15) 45%, transparent 70%)",
          }}
          aria-hidden
        />
      )}

      <motion.div
        className={cn(
          "relative w-full h-full rounded-2xl [transform-style:preserve-3d] transition-shadow duration-400",
          depthShadow &&
            (isHovering
              ? "shadow-[0_32px_64px_-16px_rgba(92,26,46,0.45),0_18px_36px_-12px_rgba(0,0,0,0.32),0_0_0_1px_rgba(201,168,108,0.2)]"
              : "shadow-[0_14px_36px_-14px_rgba(92,26,46,0.2),0_8px_18px_-8px_rgba(0,0,0,0.14)]")
        )}
        style={{
          rotateX,
          rotateY,
          scale,
          z: liftZ,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="relative w-full h-full rounded-2xl overflow-hidden"
          style={{ transform: "translateZ(32px)" }}
        >
          {children}

          {/* Cursor-following specular glare */}
          {glare && (
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-2xl mix-blend-soft-light"
              style={{
                background: glareBackground,
                opacity: isHovering ? 0.75 : 0,
              }}
              aria-hidden
            />
          )}

          {/* Warm gold ambient tint */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl mix-blend-overlay"
            style={{
              background: ambientGlow,
              opacity: isHovering ? 0.5 : 0.15,
            }}
            aria-hidden
          />

          {/* Crisp rim light */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset transition-all duration-300",
              isHovering ? "ring-white/45" : "ring-white/25"
            )}
            aria-hidden
          />

          {/* Cinematic bottom depth */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/35 via-black/8 to-transparent"
            aria-hidden
          />

          {/* Top edge highlight */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent opacity-60"
            aria-hidden
          />
        </div>
      </motion.div>
    </div>
  )
}
