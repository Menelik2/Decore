"use client"

import { useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Float, useTexture } from "@react-three/drei"
import * as THREE from "three"

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=75",
  "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=75",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=75",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=75",
  "https://images.unsplash.com/photo-1487530811176-3780da8804eb?w=600&q=75",
  "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=600&q=75",
]

type CardSpec = {
  texture: THREE.Texture
  position: [number, number, number]
  scale: number
  speed: number
  phase: number
  tilt: number
  orbit: number
}

function PhotoCard({
  texture,
  position,
  scale = 1,
  speed = 1,
  phase = 0,
  tilt = 0.14,
  orbit = 0.35,
}: CardSpec) {
  const group = useRef<THREE.Group>(null)
  const base = useMemo(() => new THREE.Vector3(...position), [position])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime * speed + phase
    const ox = Math.sin(t * 0.65) * orbit
    const oy = Math.cos(t * 0.48) * (orbit * 0.75)
    const oz = Math.sin(t * 0.4 + phase) * (orbit * 0.55)
    group.current.position.x = base.x + ox
    group.current.position.y = base.y + oy
    group.current.position.z = base.z + oz
    group.current.rotation.y = Math.sin(t * 0.4) * tilt + ox * 0.15
    group.current.rotation.x = Math.cos(t * 0.32) * tilt * 0.7 - oy * 0.08
    group.current.rotation.z = Math.sin(t * 0.22) * 0.06
  })

  const w = 1.15
  const h = 1.4

  return (
    <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.35}>
      <group ref={group} position={position} scale={scale}>
        <mesh position={[0.05, -0.07, -0.05]} scale={[1.03, 1.03, 1]}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.14} />
        </mesh>
        <mesh>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
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
    ref.current.position.x = base.x + Math.sin(t * 0.55 + phase) * 0.55
    ref.current.position.y = base.y + Math.cos(t * 0.45 + phase) * 0.4
    ref.current.position.z = base.z + Math.sin(t * 0.35 + phase) * 0.35
  })

  return (
    <mesh ref={ref} scale={scale}>
      <sphereGeometry args={[0.5, 20, 20]} />
      <meshBasicMaterial color={color} transparent opacity={0.22} depthWrite={false} />
    </mesh>
  )
}

function ParallaxRig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null)
  const { pointer, camera } = useThree()
  const target = useRef({ x: 0, y: 0, z: 0 })
  const camBase = useMemo(() => camera.position.clone(), [camera])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    target.current.x += (pointer.x * 0.55 - target.current.x) * 0.05
    target.current.y += (pointer.y * 0.35 - target.current.y) * 0.05
    const autoX = Math.sin(t * 0.18) * 0.12
    const autoY = Math.cos(t * 0.14) * 0.08
    group.current.position.x = target.current.x * 0.45 + autoX
    group.current.position.y = target.current.y * 0.28 + autoY
    group.current.position.z = Math.sin(t * 0.2) * 0.08
    group.current.rotation.y = target.current.x * 0.32 + Math.sin(t * 0.15) * 0.04
    group.current.rotation.x = -target.current.y * 0.22
    camera.position.z = camBase.z + Math.sin(t * 0.25) * 0.15
    camera.lookAt(0, 0, 0)
  })

  return <group ref={group}>{children}</group>
}

function SceneContent({ quality }: { quality: "high" | "low" }) {
  const urls = quality === "low" ? HERO_IMAGES.slice(0, 4) : HERO_IMAGES
  const textures = useTexture(urls)
  const list = Array.isArray(textures) ? textures : [textures]
  list.forEach((tex) => {
    tex.colorSpace = THREE.SRGBColorSpace
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
  })

  const cards = useMemo((): CardSpec[] => {
    const layout: Omit<CardSpec, "texture">[] = [
      { position: [-2.6, 0.9, -0.3], scale: 1.08, speed: 0.9, phase: 0.2, tilt: 0.16, orbit: 0.42 },
      { position: [-2.4, -1.0, -0.85], scale: 0.82, speed: 1.1, phase: 1.4, tilt: 0.14, orbit: 0.38 },
      { position: [2.55, 0.6, -0.45], scale: 1.02, speed: 0.95, phase: 0.8, tilt: 0.15, orbit: 0.4 },
      { position: [2.75, -1.1, -0.95], scale: 0.74, speed: 1.15, phase: 2.1, tilt: 0.13, orbit: 0.36 },
      { position: [-1.55, 1.6, -1.7], scale: 0.58, speed: 0.75, phase: 0.5, tilt: 0.12, orbit: 0.32 },
      { position: [1.55, 1.7, -1.9], scale: 0.52, speed: 0.8, phase: 1.8, tilt: 0.12, orbit: 0.3 },
    ]
    const specs = quality === "low" ? layout.slice(0, 4) : layout
    return specs.map((s, i) => ({
      ...s,
      texture: list[i % list.length],
    }))
  }, [quality, list])

  return (
    <ParallaxRig>
      {cards.map((c, i) => (
        <PhotoCard key={i} {...c} />
      ))}
      <SoftGlowOrb position={[-0.9, -1.5, -2.2]} color="#D4A5A5" scale={1.5} speed={0.55} />
      <SoftGlowOrb position={[1.3, 1.9, -2.4]} color="#C9A86C" scale={1.2} speed={0.65} />
      <SoftGlowOrb position={[0, -0.15, -2.9]} color="#F5E6E8" scale={1.9} speed={0.4} />
    </ParallaxRig>
  )
}

export function FlowerScene({ quality = "high" }: { quality?: "high" | "low" }) {
  return (
    <>
      <ambientLight intensity={1} />
      <SceneContent quality={quality} />
    </>
  )
}
