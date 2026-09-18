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

function useQuality(): "high" | "low" {
  const [q, setQ] = useState<"high" | "low">("high")
  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 4
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData
    if (cores <= 2 || (mem !== undefined && mem <= 2) || saveData) {
      setQ("low")
    }
  }, [])
  return q
}

export function HeroCanvas() {
  const reduced = usePrefersReducedMotion()
  const quality = useQuality()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted || reduced) {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-1/4 left-[10%] w-56 h-56 rounded-full bg-rose/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-[8%] w-48 h-48 rounded-full bg-gold/20 blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[100px] opacity-15 select-none">
          🌸
        </div>
      </div>
    )
  }

  return (
    <div
      className="absolute inset-0 z-0"
      style={{ touchAction: "none" }}
      aria-hidden
    >
      <Canvas
        dpr={quality === "low" ? [1, 1.25] : [1, 2]}
        camera={{ position: [0, 0, 6.2], fov: 40, near: 0.1, far: 40 }}
        gl={{
          antialias: quality === "high",
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        style={{ background: "transparent" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
      >
        <Suspense fallback={null}>
          <FlowerScene quality={quality} />
        </Suspense>
      </Canvas>
    </div>
  )
}
