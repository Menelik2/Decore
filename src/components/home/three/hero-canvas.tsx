"use client"

import {
  Suspense,
  useState,
  useEffect,
  useRef,
  Component,
  type ReactNode,
} from "react"
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

function useQuality(): "high" | "low" | "ultralow" {
  const [q, setQ] = useState<"high" | "low" | "ultralow">("low")
  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 4
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string }
      }
    ).connection
    const mobile =
      /iPhone|iPad|Android/i.test(navigator.userAgent) || window.innerWidth < 768
    const slowNet =
      conn?.saveData ||
      conn?.effectiveType === "2g" ||
      conn?.effectiveType === "slow-2g" ||
      conn?.effectiveType === "3g"

    if (cores <= 2 || (mem !== undefined && mem <= 2) || slowNet) {
      setQ("ultralow")
    } else if (mobile || cores <= 4 || (mem !== undefined && mem <= 4)) {
      setQ("low")
    } else {
      setQ("high")
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
            "url(https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=320&q=60)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        className="absolute right-[2%] top-[24%] w-[30%] max-w-[130px] aspect-[4/5] rounded-2xl overflow-hidden shadow-xl opacity-80 rotate-[7deg] animate-float-y"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=320&q=60)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          animationDelay: "0.6s",
          animationDuration: "8s",
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
  const [visible, setVisible] = useState(true)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const el = wrapRef.current
    if (!el || typeof IntersectionObserver === "undefined") return
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "80px", threshold: 0.05 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [mounted])

  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === "visible")
    document.addEventListener("visibilitychange", onVis)
    return () => document.removeEventListener("visibilitychange", onVis)
  }, [])

  if (!mounted || reduced || quality === "ultralow") {
    return <FallbackImages />
  }

  const dprMax = quality === "low" ? 1.25 : 1.5

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden
    >
      <SceneErrorBoundary fallback={<FallbackImages />}>
        <Canvas
          dpr={[1, dprMax]}
          camera={{
            position: [0, 0, mobile ? 7.2 : 6.4],
            fov: mobile ? 42 : 40,
            near: 0.5,
            far: 24,
          }}
          gl={{
            antialias: quality === "high",
            alpha: true,
            powerPreference: "low-power",
            stencil: false,
            depth: true,
            logarithmicDepthBuffer: false,
            preserveDrawingBuffer: false,
          }}
          style={{ background: "transparent", pointerEvents: "none" }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0)
            const pr = Math.min(window.devicePixelRatio || 1, dprMax)
            gl.setPixelRatio(pr)
          }}
          frameloop={visible ? "always" : "never"}
          performance={{ min: 0.5 }}
        >
          <Suspense fallback={null}>
            <FlowerScene quality={quality === "high" ? "high" : "low"} />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  )
}
