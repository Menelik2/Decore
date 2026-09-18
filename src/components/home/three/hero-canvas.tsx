"use client"

import { Suspense, useState, useEffect, Component, type ReactNode } from "react"
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

function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)")
    setMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])
  return mobile
}

function useQuality(): "high" | "low" {
  const [q, setQ] = useState<"high" | "low">("high")
  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 4
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
    const saveData = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection?.saveData
    const mobile =
      /iPhone|iPad|Android/i.test(navigator.userAgent) || window.innerWidth < 768
    if (cores <= 4 || (mem !== undefined && mem <= 4) || saveData || mobile) {
      setQ("low")
    }
  }, [])
  return q
}

function FallbackImages() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <div
        className="absolute left-[2%] top-[18%] w-[32%] max-w-[140px] aspect-[4/5] rounded-2xl overflow-hidden shadow-xl opacity-85 rotate-[-8deg] animate-float-y"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=70)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        className="absolute right-[2%] top-[24%] w-[30%] max-w-[130px] aspect-[4/5] rounded-2xl overflow-hidden shadow-xl opacity-80 rotate-[7deg] animate-float-y"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=70)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          animationDelay: "0.6s",
          animationDuration: "8s",
        }}
      />
      <div
        className="absolute left-[6%] bottom-[22%] w-[26%] max-w-[110px] aspect-[4/5] rounded-2xl overflow-hidden shadow-xl opacity-70 rotate-[4deg] animate-float-y"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=70)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          animationDelay: "1.2s",
          animationDuration: "9s",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f5f5f7]/35 to-[#f5f5f7]" />
    </div>
  )
}

class SceneErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

export function HeroCanvas() {
  const reduced = usePrefersReducedMotion()
  const quality = useQuality()
  const mobile = useIsMobile()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted || reduced) {
    return <FallbackImages />
  }

  return (
    <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
      <SceneErrorBoundary fallback={<FallbackImages />}>
        <Canvas
          dpr={quality === "low" ? [1, 1.35] : [1, 1.75]}
          camera={{
            position: [0, 0, mobile ? 7.2 : 6.4],
            fov: mobile ? 42 : 40,
            near: 0.1,
            far: 40,
          }}
          gl={{
            antialias: quality === "high",
            alpha: true,
            powerPreference: mobile ? "low-power" : "high-performance",
            stencil: false,
            depth: true,
          }}
          style={{ background: "transparent", pointerEvents: "none" }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0)
          }}
          frameloop="always"
        >
          <Suspense fallback={null}>
            <FlowerScene quality={quality} />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  )
}
