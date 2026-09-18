"use client"

import { useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Float, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

const BRAND = {
  rose: "#8B2942",
  blush: "#D4A5A5",
  cream: "#F5E6E8",
  gold: "#C9A86C",
  white: "#FFFFFF",
  deep: "#5C1A2E",
}

/** Soft floating orb with organic motion */
function SoftOrb({
  position,
  color,
  scale = 1,
  speed = 1,
  opacity = 0.88,
  distort = 0.15,
}: {
  position: [number, number, number]
  color: string
  scale?: number
  speed?: number
  opacity?: number
  distort?: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])
  const base = useMemo(() => new THREE.Vector3(...position), [position])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * speed
    ref.current.position.x = base.x + Math.sin(t * 0.7 + phase) * 0.35
    ref.current.position.y = base.y + Math.cos(t * 0.55 + phase) * 0.28
    ref.current.position.z = base.z + Math.sin(t * 0.4 + phase * 1.3) * 0.2
    ref.current.rotation.x = t * 0.25 + phase
    ref.current.rotation.y = t * 0.35
  })

  return (
    <mesh ref={ref} scale={scale}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <MeshDistortMaterial
        color={color}
        roughness={0.35}
        metalness={0.08}
        transparent
        opacity={opacity}
        distort={distort}
        speed={speed * 1.5}
      />
    </mesh>
  )
}

/** Bloom cluster — petals orbit a gold center */
function FlowerBloom({
  position,
  colors,
  scale = 1,
  spin = 0.2,
}: {
  position: [number, number, number]
  colors: string[]
  scale?: number
  spin?: number
}) {
  const group = useRef<THREE.Group>(null)
  const petalCount = 8

  const petals = useMemo(() => {
    return Array.from({ length: petalCount }, (_, i) => {
      const angle = (i / petalCount) * Math.PI * 2
      const r = 0.55
      return {
        pos: [
          Math.cos(angle) * r,
          Math.sin(angle) * r * 0.35,
          Math.sin(angle) * r * 0.55,
        ] as [number, number, number],
        color: colors[i % colors.length],
        s: 0.65 + (i % 3) * 0.12,
        phase: angle,
      }
    })
  }, [colors])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.rotation.y = t * spin
    group.current.rotation.x = Math.sin(t * 0.3) * 0.12
    group.current.rotation.z = Math.cos(t * 0.25) * 0.08
  })

  return (
    <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.55}>
      <group ref={group} position={position} scale={scale}>
        <mesh>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshStandardMaterial
            color={BRAND.gold}
            roughness={0.25}
            metalness={0.35}
            emissive={BRAND.gold}
            emissiveIntensity={0.15}
          />
        </mesh>
        {petals.map((p, i) => (
          <mesh key={i} position={p.pos} scale={p.s}>
            <sphereGeometry args={[0.36, 20, 20]} />
            <meshStandardMaterial
              color={p.color}
              roughness={0.4}
              metalness={0.06}
              transparent
              opacity={0.92}
            />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

/** Drifting petal particles */
function DriftingPetals({ count = 22 }: { count?: number }) {
  const group = useRef<THREE.Group>(null)

  const petals = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      base: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 5 - 1.5,
      ] as [number, number, number],
      color: [BRAND.rose, BRAND.blush, BRAND.cream, BRAND.gold, BRAND.white][i % 5],
      scale: 0.12 + Math.random() * 0.22,
      speed: 0.35 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
      orbit: 0.2 + Math.random() * 0.5,
    }))
  }, [count])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.children.forEach((child, i) => {
      const p = petals[i]
      if (!p) return
      child.position.x = p.base[0] + Math.sin(t * p.speed + p.phase) * p.orbit
      child.position.y = p.base[1] + Math.cos(t * p.speed * 0.8 + p.phase) * p.orbit * 0.9
      child.position.z = p.base[2] + Math.sin(t * p.speed * 0.5 + p.phase) * 0.25
      child.rotation.x = t * p.speed * 0.6 + p.phase
      child.rotation.z = t * p.speed * 0.4
    })
  })

  return (
    <group ref={group}>
      {petals.map((p) => (
        <mesh key={p.id} scale={p.scale}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial
            color={p.color}
            roughness={0.45}
            metalness={0.05}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  )
}

/** Mouse / touch parallax on the whole scene */
function ParallaxRig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null)
  const { pointer, viewport } = useThree()
  const target = useRef({ x: 0, y: 0 })

  useFrame(() => {
    if (!group.current) return
    target.current.x += (pointer.x * 0.35 - target.current.x) * 0.05
    target.current.y += (pointer.y * 0.25 - target.current.y) * 0.05
    group.current.rotation.y = target.current.x * 0.4
    group.current.rotation.x = -target.current.y * 0.25
    group.current.position.x = target.current.x * 0.15 * viewport.width * 0.02
    group.current.position.y = target.current.y * 0.1
  })

  return <group ref={group}>{children}</group>
}

export function FlowerScene({ quality = "high" }: { quality?: "high" | "low" }) {
  const petalCount = quality === "low" ? 12 : 22

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={1.05} color="#fff8f0" />
      <pointLight position={[-4, 2, 3]} intensity={0.55} color={BRAND.blush} />
      <pointLight position={[4, -2, 2]} intensity={0.4} color={BRAND.gold} />
      <pointLight position={[0, 3, -2]} intensity={0.25} color={BRAND.white} />

      <ParallaxRig>
        <FlowerBloom
          position={[-2.6, 0.6, -0.6]}
          colors={[BRAND.rose, BRAND.blush, BRAND.cream, BRAND.white]}
          scale={1.05}
          spin={0.18}
        />
        <FlowerBloom
          position={[2.7, -0.2, -0.9]}
          colors={[BRAND.gold, BRAND.cream, BRAND.white]}
          scale={0.85}
          spin={-0.14}
        />
        <FlowerBloom
          position={[2.0, 1.4, -1.6]}
          colors={[BRAND.rose, BRAND.blush]}
          scale={0.5}
          spin={0.28}
        />
        <FlowerBloom
          position={[-2.0, -1.0, -1.2]}
          colors={[BRAND.blush, BRAND.cream, BRAND.white]}
          scale={0.55}
          spin={-0.22}
        />

        <SoftOrb position={[-1.2, 1.6, -2]} color={BRAND.blush} scale={0.7} speed={0.6} opacity={0.5} />
        <SoftOrb position={[1.4, -1.3, -1.8]} color={BRAND.gold} scale={0.55} speed={0.8} opacity={0.45} />
        <SoftOrb position={[0.3, 1.8, -2.5]} color={BRAND.cream} scale={0.9} speed={0.4} opacity={0.35} distort={0.25} />

        <DriftingPetals count={petalCount} />
      </ParallaxRig>
    </>
  )
}
