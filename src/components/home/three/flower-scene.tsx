"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import * as THREE from "three"

function Petal({
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
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * speed
    ref.current.rotation.z = Math.sin(t + offset) * 0.15
    ref.current.position.y = position[1] + Math.sin(t * 0.5 + offset) * 0.08
  })

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[0.35, 16, 16]} />
      <meshStandardMaterial
        color={color}
        roughness={0.45}
        metalness={0.05}
        transparent
        opacity={0.92}
      />
    </mesh>
  )
}

function FlowerBloom({
  position,
  colors,
  scale = 1,
}: {
  position: [number, number, number]
  colors: string[]
  scale?: number
}) {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = state.clock.elapsedTime * 0.15
  })

  const petals = useMemo(() => {
    const items: { pos: [number, number, number]; color: string; s: number }[] = []
    const count = 7
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const r = 0.45
      items.push({
        pos: [Math.cos(angle) * r, Math.sin(angle) * r * 0.3, Math.sin(angle) * r],
        color: colors[i % colors.length],
        s: 0.7 + (i % 3) * 0.1,
      })
    }
    return items
  }, [colors])

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={group} position={position} scale={scale}>
        {/* Center */}
        <mesh>
          <sphereGeometry args={[0.28, 20, 20]} />
          <meshStandardMaterial color="#C9A86C" roughness={0.35} metalness={0.2} />
        </mesh>
        {petals.map((p, i) => (
          <mesh key={i} position={p.pos} scale={p.s}>
            <sphereGeometry args={[0.32, 14, 14]} />
            <meshStandardMaterial
              color={p.color}
              roughness={0.5}
              metalness={0.05}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

function FloatingPetals() {
  const petals = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 4 - 1,
      ] as [number, number, number],
      color: ["#8B2942", "#D4A5A5", "#F5E6E8", "#C9A86C", "#FFFFFF"][i % 5],
      scale: 0.15 + Math.random() * 0.25,
      speed: 0.4 + Math.random() * 0.6,
    }))
  }, [])

  return (
    <>
      {petals.map((p) => (
        <Petal
          key={p.id}
          position={p.position}
          color={p.color}
          scale={p.scale}
          speed={p.speed}
        />
      ))}
    </>
  )
}

export function FlowerScene() {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[5, 5, 5]} intensity={0.9} color="#fff8f0" />
      <pointLight position={[-3, 2, 2]} intensity={0.4} color="#D4A5A5" />
      <pointLight position={[3, -1, 1]} intensity={0.3} color="#C9A86C" />

      <FlowerBloom
        position={[0, 0.2, 0]}
        colors={["#8B2942", "#D4A5A5", "#F5E6E8", "#FFFFFF"]}
        scale={1.15}
      />
      <FlowerBloom
        position={[-2.2, 0.8, -0.8]}
        colors={["#D4A5A5", "#FFFFFF", "#F5E6E8"]}
        scale={0.7}
      />
      <FlowerBloom
        position={[2.4, -0.3, -1]}
        colors={["#C9A86C", "#F5E6E8", "#FFFFFF"]}
        scale={0.55}
      />
      <FlowerBloom
        position={[1.6, 1.2, -1.5]}
        colors={["#8B2942", "#D4A5A5"]}
        scale={0.4}
      />

      <FloatingPetals />
    </>
  )
}
