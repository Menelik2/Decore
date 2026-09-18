"use client"

import { useRef, useMemo, useState } from "react"
import { useFrame, useThree, useLoader } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import * as THREE from "three"

/** Curated floral / event photos for the hero */
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
  "https://images.unsplash.com/photo-1487530811176-3780da8804eb?w=800&q=80",
  "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=800&q=80",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
]

type CardSpec = {
  url: string
  position: [number, number, number]
  scale: number
  speed: number
  phase: number
  tilt: number
}

function PhotoCard({
  url,
  position,
  scale = 1,
  speed = 1,
  phase = 0,
  tilt = 0.12,
}: CardSpec) {
  const group = useRef<THREE.Group>(null)
  const texture = useLoader(THREE.TextureLoader, url)
  const [hovered, setHovered] = useState(false)

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
  }, [texture])

  const base = useMemo(() => new THREE.Vector3(...position), [position])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime * speed + phase
    group.current.position.x = base.x + Math.sin(t * 0.55) * 0.22
    group.current.position.y = base.y + Math.cos(t * 0.4) * 0.18
    group.current.position.z = base.z + Math.sin(t * 0.3) * 0.1
    group.current.rotation.y = Math.sin(t * 0.35) * tilt + (hovered ? 0.08 : 0)
    group.current.rotation.x = Math.cos(t * 0.28) * tilt * 0.6
    group.current.rotation.z = Math.sin(t * 0.2) * 0.04
    const target = hovered ? 1.06 : 1
    group.current.scale.lerp(
      new THREE.Vector3(scale * target, scale * target, scale * target),
      0.08
    )
  })

  const w = 1.1
  const h = 1.35

  return (
    <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.25}>
      <group
        ref={group}
        position={position}
        scale={scale}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh position={[0.04, -0.06, -0.04]} scale={[1.02, 1.02, 1]}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.12} />
        </mesh>

        <mesh>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial
            map={texture}
            roughness={0.55}
            metalness={0.05}
            side={THREE.FrontSide}
          />
        </mesh>

        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[w + 0.04, h + 0.04]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.12}
            side={THREE.BackSide}
          />
        </mesh>
      </group>
    </Float>
  )
}

function SoftGlowOrb({
  position,
  color,
  scale = 1,
  speed = 1,
}: {
  position: [number, number, number]
  color: string
  scale?: number
  speed?: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])
  const base = useMemo(() => new THREE.Vector3(...position), [position])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * speed
    ref.current.position.x = base.x + Math.sin(t * 0.6 + phase) * 0.3
    ref.current.position.y = base.y + Math.cos(t * 0.5 + phase) * 0.25
  })

  return (
    <mesh ref={ref} scale={scale}>
      <sphereGeometry args={[0.45, 24, 24]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.22}
        roughness={0.8}
        metalness={0}
        depthWrite={false}
      />
    </mesh>
  )
}

function ParallaxRig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null)
  const { pointer } = useThree()
  const target = useRef({ x: 0, y: 0 })

  useFrame(() => {
    if (!group.current) return
    target.current.x += (pointer.x * 0.4 - target.current.x) * 0.045
    target.current.y += (pointer.y * 0.28 - target.current.y) * 0.045
    group.current.rotation.y = target.current.x * 0.35
    group.current.rotation.x = -target.current.y * 0.22
    group.current.position.x = target.current.x * 0.25
    group.current.position.y = target.current.y * 0.12
  })

  return <group ref={group}>{children}</group>
}

export function FlowerScene({ quality = "high" }: { quality?: "high" | "low" }) {
  const cards = useMemo((): CardSpec[] => {
    const layout: Omit<CardSpec, "url">[] = [
      { position: [-2.55, 0.85, -0.4], scale: 1.05, speed: 0.85, phase: 0.2, tilt: 0.14 },
      { position: [-2.35, -0.95, -0.9], scale: 0.78, speed: 1.05, phase: 1.4, tilt: 0.12 },
      { position: [2.5, 0.55, -0.5], scale: 1.0, speed: 0.9, phase: 0.8, tilt: 0.13 },
      { position: [2.7, -1.05, -1.0], scale: 0.72, speed: 1.1, phase: 2.1, tilt: 0.11 },
      { position: [-1.6, 1.55, -1.8], scale: 0.55, speed: 0.7, phase: 0.5, tilt: 0.1 },
      { position: [1.5, 1.65, -2.0], scale: 0.5, speed: 0.75, phase: 1.8, tilt: 0.1 },
    ]

    const urls =
      quality === "low" ? HERO_IMAGES.slice(0, 4) : HERO_IMAGES.slice(0, 6)
    const specs = quality === "low" ? layout.slice(0, 4) : layout

    return specs.map((s, i) => ({
      ...s,
      url: urls[i % urls.length],
    }))
  }, [quality])

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} color="#fff8f0" />
      <pointLight position={[-3, 2, 2]} intensity={0.35} color="#D4A5A5" />
      <pointLight position={[3, -1, 2]} intensity={0.3} color="#C9A86C" />

      <ParallaxRig>
        {cards.map((c, i) => (
          <PhotoCard key={`${c.url}-${i}`} {...c} />
        ))}

        <SoftGlowOrb position={[-0.8, -1.4, -2.2]} color="#D4A5A5" scale={1.4} speed={0.5} />
        <SoftGlowOrb position={[1.2, 1.8, -2.5]} color="#C9A86C" scale={1.1} speed={0.6} />
        <SoftGlowOrb position={[0, -0.2, -3]} color="#F5E6E8" scale={1.8} speed={0.35} />
      </ParallaxRig>
    </>
  )
}
