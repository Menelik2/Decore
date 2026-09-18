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
    const saveData = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection?.saveData
    if (cores <= 2 || (mem !== undefined && mem <= 2) || saveData) {
      setQ("low")
    }
  }, [])
  return q
}

function FallbackImages() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <div
        className="absolute left-[4%] top-[22%] w-[28%] max-w-[160px] aspect-[4/5] rounded-2xl overflow-hidden shadow-lg opacity-80 rotate-[-6deg]"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=70)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        className="absolute right-[5%] top-[28%] w-[26%] max-w-[150px] aspect-[4/5] rounded-2xl overflow-hidden shadow-lg opacity-75 rotate-[5deg]"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=70)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f5f5f7]/40 to-[#f5f5f7]" />
    </div>
  )
}

export function HeroCanvas() {
  const reduced = usePrefersReducedMotion()
  const quality = useQuality()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted || reduced) {
    return <FallbackImages />
  }

  return (
    <div className="absolute inset-0 z-0" style={{ touchAction: "none" }} aria-hidden>
      <Canvas
        dpr={quality === "low" ? [1, 1.25] : [1, 1.75]}
        camera={{ position: [0, 0, 6.4], fov: 40, near: 0.1, far: 40 }}
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
