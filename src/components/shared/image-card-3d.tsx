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
  /** Max tilt degrees (default 14) */
  tiltMax?: number
  /** Specular glare on hover */
  glare?: boolean
  /** Depth shadow */
  depthShadow?: boolean
}

export function ImageCard3D({
  children,
  className,
  tiltMax = 14,
  glare = true,
  depthShadow = true,
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
  const spring = { stiffness: 280, damping: 26, mass: 0.55 }

  const rotateX = useSpring(
    useTransform(y, [-0.5, 0.5], [tiltMax, -tiltMax]),
    spring
  )
  const rotateY = useSpring(
    useTransform(x, [-0.5, 0.5], [-tiltMax, tiltMax]),
    spring
  )
  const scale = useSpring(1, spring)

  const glareX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), spring)
  const glareY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), spring)
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.1) 35%, transparent 65%)`

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
    if (!reducedMotion) scale.set(1.045)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    x.set(0)
    y.set(0)
    scale.set(1)
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
      className={cn("relative [perspective:1200px]", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className={cn(
          "relative w-full h-full rounded-2xl [transform-style:preserve-3d] transition-shadow duration-300",
          depthShadow &&
            (isHovering
              ? "shadow-[0_28px_55px_-14px_rgba(92,26,46,0.4),0_14px_28px_-10px_rgba(0,0,0,0.28)]"
              : "shadow-[0_12px_32px_-12px_rgba(92,26,46,0.18),0_6px_14px_-6px_rgba(0,0,0,0.12)]")
        )}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="relative w-full h-full rounded-2xl overflow-hidden"
          style={{ transform: "translateZ(24px)" }}
        >
          {children}

          {/* Specular glare following cursor */}
          {glare && (
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-2xl mix-blend-overlay"
              style={{
                background: glareBackground,
                opacity: isHovering ? 0.55 : 0,
              }}
              aria-hidden
            />
          )}

          {/* Rim light */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/30"
            aria-hidden
          />

          {/* Depth gradient at bottom */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/30 via-black/5 to-transparent"
            aria-hidden
          />
        </div>
      </motion.div>
    </div>
  )
}
