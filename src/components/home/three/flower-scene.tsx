"use client"

import { useRef, useMemo, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=360&q=55",
  "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=360&q=55",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=360&q=55",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=360&q=55",
]

const cardVertex = /* glsl */ `
  varying vec2 vUv;
  varying float vFresnel;

  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * normal);
    vec3 viewDir = normalize(-mv.xyz);
    vFresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 2.5);
    gl_Position = projectionMatrix * mv;
  }
`

const cardFragment = /* glsl */ `
  precision mediump float;
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uShine;
  varying vec2 vUv;
  varying float vFresnel;

  void main() {
    vec2 p = abs(vUv - 0.5) * 2.0;
    float edge = 1.0 - max(p.x, p.y);
    float alpha = smoothstep(0.0, 0.1, edge);
    vec3 col = texture2D(uMap, vUv).rgb;
    col += vec3(0.95, 0.92, 0.94) * vFresnel * 0.4;
    if (uShine > 0.5) {
      float sheen = sin((vUv.x + vUv.y) * 5.0 - uTime * 1.4);
      sheen = sheen * sheen * sheen * sheen * 0.12;
      col += sheen;
    }
    gl_FragColor = vec4(col, alpha * 0.95);
  }
`

const sharedGeo = new THREE.PlaneGeometry(1.15, 1.42)

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
  useShader,
}: CardSpec & { useShader: boolean }) {
  const group = useRef<THREE.Group>(null)
  const matRef = useRef<THREE.ShaderMaterial | THREE.MeshBasicMaterial>(null)
  const base = useMemo(() => new THREE.Vector3(...position), [position])
  const frame = useRef(0)

  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uTime: { value: 0 },
      uShine: { value: useShader ? 1 : 0 },
    }),
    [texture, useShader]
  )

  useFrame((state) => {
    if (!group.current) return
    frame.current++
    if (useShader && matRef.current && "uniforms" in matRef.current && frame.current % 2 === 0) {
      ;(matRef.current as THREE.ShaderMaterial).uniforms.uTime.value =
        state.clock.elapsedTime
    }
    const t = state.clock.elapsedTime * speed + phase
    const ox = Math.sin(t * 0.55) * orbit
    const oy = Math.cos(t * 0.42) * orbit * 0.75
    const oz = Math.sin(t * 0.32 + phase) * orbit * 0.45
    group.current.position.set(base.x + ox, base.y + oy, base.z + oz)
    group.current.rotation.y = Math.sin(t * 0.35) * tilt + ox * 0.12
    group.current.rotation.x = Math.cos(t * 0.28) * tilt * 0.6
  })

  return (
    <group ref={group} position={position} scale={scale}>
      <mesh geometry={sharedGeo}>
        {useShader ? (
          <shaderMaterial
            ref={matRef as React.RefObject<THREE.ShaderMaterial>}
            vertexShader={cardVertex}
            fragmentShader={cardFragment}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            side={THREE.FrontSide}
          />
        ) : (
          <meshBasicMaterial
            ref={matRef as React.RefObject<THREE.MeshBasicMaterial>}
            map={texture}
            transparent
            opacity={0.95}
            depthWrite={false}
            side={THREE.FrontSide}
          />
        )}
      </mesh>
    </group>
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
    ref.current.position.x = base.x + Math.sin(t * 0.4 + phase) * 0.4
    ref.current.position.y = base.y + Math.cos(t * 0.35 + phase) * 0.3
  })

  return (
    <mesh ref={ref} scale={scale}>
      <sphereGeometry args={[0.45, 12, 12]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} depthWrite={false} />
    </mesh>
  )
}

function ParallaxRig({
  children,
  intensity = 1,
}: {
  children: React.ReactNode
  intensity?: number
}) {
  const group = useRef<THREE.Group>(null)
  const { pointer, camera, size } = useThree()
  const target = useRef({ x: 0, y: 0 })
  const camBaseZ = useMemo(() => camera.position.z, [camera])
  const isNarrow = size.width < 640

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    target.current.x += (pointer.x * 0.45 * intensity - target.current.x) * 0.04
    target.current.y += (pointer.y * 0.3 * intensity - target.current.y) * 0.04
    const amp = isNarrow ? 0.16 : 0.1
    group.current.position.x = target.current.x * 0.4 + Math.sin(t * 0.18) * amp
    group.current.position.y = target.current.y * 0.25 + Math.cos(t * 0.14) * amp * 0.6
    group.current.rotation.y = target.current.x * 0.28
    group.current.rotation.x = -target.current.y * 0.18
    camera.position.z = camBaseZ + Math.sin(t * 0.2) * 0.08
    camera.lookAt(0, 0.05, 0)
  })

  return <group ref={group}>{children}</group>
}

function SceneContent({ quality }: { quality: "high" | "low" }) {
  const count = quality === "low" ? 2 : 3
  const urls = HERO_IMAGES.slice(0, count)
  const textures = useTexture(urls)
  const list = Array.isArray(textures) ? textures : [textures]

  useEffect(() => {
    list.forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.generateMipmaps = false
      tex.anisotropy = 1
    })
    return () => {
      list.forEach((tex) => tex.dispose())
    }
  }, [list])

  const cards = useMemo((): CardSpec[] => {
    const layout: Omit<CardSpec, "texture">[] =
      quality === "low"
        ? [
            { position: [-2.3, 0.7, -0.2], scale: 1.0, speed: 0.85, phase: 0.2, tilt: 0.14, orbit: 0.38 },
            { position: [2.3, 0.5, -0.35], scale: 0.92, speed: 0.95, phase: 1.1, tilt: 0.12, orbit: 0.36 },
          ]
        : [
            { position: [-2.5, 0.8, -0.15], scale: 1.05, speed: 0.85, phase: 0.15, tilt: 0.15, orbit: 0.42 },
            { position: [2.45, 0.55, -0.3], scale: 0.98, speed: 0.95, phase: 0.9, tilt: 0.14, orbit: 0.4 },
            { position: [-2.2, -1.0, -0.8], scale: 0.72, speed: 1.05, phase: 1.8, tilt: 0.12, orbit: 0.32 },
          ]
    return layout.map((s, i) => ({
      ...s,
      texture: list[i % list.length],
    }))
  }, [quality, list])

  const useShader = quality === "high"

  return (
    <ParallaxRig intensity={quality === "low" ? 0.6 : 1}>
      {cards.map((c, i) => (
        <PhotoCard key={i} {...c} useShader={useShader} />
      ))}
      {quality === "high" && (
        <>
          <SoftGlowOrb position={[-1.0, -1.3, -2.0]} color="#D4A5A5" scale={1.2} speed={0.45} />
          <SoftGlowOrb position={[1.1, 1.5, -2.1]} color="#C9A86C" scale={1.0} speed={0.55} />
        </>
      )}
    </ParallaxRig>
  )
}

export function FlowerScene({ quality = "low" }: { quality?: "high" | "low" }) {
  return (
    <>
      <ambientLight intensity={1} />
      <SceneContent quality={quality} />
    </>
  )
}
