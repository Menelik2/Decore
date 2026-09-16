"use client"

import { Suspense, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { FlowerScene } from "./flower-scene"

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])
  return reduced
}

function useIsLowEnd() {
  const [low, setLow] = useState(false)
  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 4
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
    const mobile = /Android|iPhone|iPad/i.test(navigator.userAgent)
    setLow(cores <= 4 || (mem !== undefined && mem <= 4) || mobile)
  }, [])
  return low
}

export function HeroCanvas() {
  const reduced = usePrefersReducedMotion()
  const lowEnd = useIsLowEnd()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted || reduced) {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-rose/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-gold/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] opacity-20 select-none">
          🌸
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        dpr={lowEnd ? [1, 1.25] : [1, 1.75]}
        camera={{ position: [0, 0, 6], fov: 42 }}
        gl={{ antialias: !lowEnd, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <FlowerScene />
        </Suspense>
      </Canvas>
    </div>
  )
}
