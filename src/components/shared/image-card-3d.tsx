"use client"

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
  type MouseEvent,
  type TouchEvent,
} from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useAnimationFrame,
} from "framer-motion"
import { cn } from "@/lib/utils"

type ImageCard3DProps = {
  children: ReactNode
  className?: string
  tiltMax?: number
  glare?: boolean
  depthShadow?: boolean
  float?: boolean
  translateIdle?: boolean
  phase?: number
}

export function ImageCard3D({
  children,
  className,
  tiltMax = 16,
  glare = true,
  depthShadow = true,
  float = true,
  translateIdle = true,
  phase = 0,
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
  const spring = { stiffness: 200, damping: 24, mass: 0.55 }

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

  const idleTx = useMotionValue(0)
  const idleTy = useMotionValue(0)
  const springTx = useSpring(idleTx, { stiffness: 40, damping: 18 })
  const springTy = useSpring(idleTy, { stiffness: 40, damping: 18 })

  useAnimationFrame((t) => {
    if (reducedMotion || !translateIdle || isHovering) return
    const s = t * 0.001 + phase * Math.PI * 2
    idleTx.set(Math.sin(s * 0.55) * 6)
    idleTy.set(Math.cos(s * 0.42) * 8)
  })

  const glareX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), spring)
  const glareY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), spring)
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.18) 28%, transparent 58%)`

  const ambientX = useSpring(useTransform(x, [-0.5, 0.5], [20, 80]), spring)
  const ambientY = useSpring(useTransform(y, [-0.5, 0.5], [15, 75]), spring)
  const ambientGlow = useMotionTemplate`radial-gradient(circle at ${ambientX}% ${ambientY}%, rgba(201,168,108,0.35) 0%, rgba(92,26,46,0.12) 40%, transparent 70%)`

  const setFromPoint = useCallback(
    (clientX: number, clientY: number) => {
      if (reducedMotion || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const px = (clientX - rect.left) / rect.width - 0.5
      const py = (clientY - rect.top) / rect.height - 0.5
      x.set(px)
      y.set(py)
    },
    [reducedMotion, x, y]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      setFromPoint(e.clientX, e.clientY)
    },
    [setFromPoint]
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      const touch = e.touches[0]
      if (!touch) return
      setFromPoint(touch.clientX, touch.clientY)
    },
    [setFromPoint]
  )

  const handleEnter = () => {
    setIsHovering(true)
    if (!reducedMotion) {
      scale.set(1.04)
      if (float) liftZ.set(24)
      idleTx.set(0)
      idleTy.set(0)
    }
  }

  const handleLeave = () => {
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
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onTouchStart={handleEnter}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleLeave}
    >
      {depthShadow && (
        <motion.div
          className="pointer-events-none absolute -inset-4 rounded-[2rem] opacity-0 blur-2xl transition-opacity duration-500"
          style={{
            opacity: isHovering ? 0.5 : 0,
            background:
              "radial-gradient(ellipse at center, rgba(92,26,46,0.28) 0%, rgba(201,168,108,0.15) 45%, transparent 70%)",
          }}
          aria-hidden
        />
      )}

      <motion.div
        className={cn(
          "relative w-full h-full rounded-2xl [transform-style:preserve-3d] transition-shadow duration-400 will-change-transform",
          depthShadow &&
            (isHovering
              ? "shadow-[0_32px_64px_-16px_rgba(92,26,46,0.45),0_18px_36px_-12px_rgba(0,0,0,0.32)]"
              : "shadow-[0_14px_36px_-14px_rgba(92,26,46,0.2),0_8px_18px_-8px_rgba(0,0,0,0.14)]")
        )}
        style={{
          rotateX,
          rotateY,
          scale,
          z: liftZ,
          x: springTx,
          y: springTy,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="relative w-full h-full rounded-2xl overflow-hidden"
          style={{ transform: "translateZ(28px)" }}
        >
          {children}

          {glare && (
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-2xl mix-blend-soft-light"
              style={{
                background: glareBackground,
                opacity: isHovering ? 0.7 : 0,
              }}
              aria-hidden
            />
          )}

          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl mix-blend-overlay"
            style={{
              background: ambientGlow,
              opacity: isHovering ? 0.45 : 0.12,
            }}
            aria-hidden
          />

          <div
            className={cn(
              "pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset transition-all duration-300",
              isHovering ? "ring-white/45" : "ring-white/25"
            )}
            aria-hidden
          />

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/35 via-black/8 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent opacity-60"
            aria-hidden
          />
        </div>
      </motion.div>
    </div>
  )
}
