"use client"

import { useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=70",
  "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&q=70",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=70",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&q=70",
  "https://images.unsplash.com/photo-1487530811176-3780da8804eb?w=500&q=70",
  "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=500&q=70",
]

const cardVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vNormal = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

const cardFragment = /* glsl */ `
  precision mediump float;
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uShine;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec2 uv = vUv;
    vec2 p = abs(uv - 0.5) * 2.0;
    float edge = 1.0 - max(p.x, p.y);
    float alpha = smoothstep(0.0, 0.08, edge);
    float border = smoothstep(0.0, 0.12, edge) * (1.0 - smoothstep(0.08, 0.18, edge));

    vec4 tex = texture2D(uMap, uv);
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0), 3.0);
    float sheen = sin((uv.x + uv.y) * 6.0 - uTime * 1.8) * 0.5 + 0.5;
    sheen = pow(sheen, 8.0) * uShine * 0.35;

    vec3 col = tex.rgb;
    col += vec3(1.0) * sheen;
    col += vec3(0.95, 0.9, 0.92) * fresnel * 0.45;
    col += vec3(1.0) * border * 0.25;

    gl_FragColor = vec4(col, alpha * 0.96);
  }
`

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
  tilt = 0.16,
  orbit = 0.4,
}: CardSpec) {
  const group = useRef<THREE.Group>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const base = useMemo(() => new THREE.Vector3(...position), [position])

  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uTime: { value: 0 },
      uShine: { value: 1 },
    }),
    [texture]
  )

  useFrame((state) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime
    if (!group.current) return
    const t = state.clock.elapsedTime * speed + phase
    const ox = Math.sin(t * 0.7) * orbit
    const oy = Math.cos(t * 0.52) * orbit * 0.85
    const oz = Math.sin(t * 0.38 + phase) * orbit * 0.65
    group.current.position.set(base.x + ox, base.y + oy, base.z + oz)
    group.current.rotation.y = Math.sin(t * 0.42) * tilt + ox * 0.18
    group.current.rotation.x = Math.cos(t * 0.35) * tilt * 0.75 - oy * 0.1
    group.current.rotation.z = Math.sin(t * 0.25) * 0.07
  })

  const w = 1.2
  const h = 1.48

  return (
    <group ref={group} position={position} scale={scale}>
      <mesh position={[0.06, -0.08, -0.06]}>
        <planeGeometry args={[w * 1.02, h * 1.02]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.16} depthWrite={false} />
      </mesh>
      <mesh>
        <planeGeometry args={[w, h]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={cardVertex}
          fragmentShader={cardFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
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
    ref.current.position.x = base.x + Math.sin(t * 0.5 + phase) * 0.6
    ref.current.position.y = base.y + Math.cos(t * 0.42 + phase) * 0.45
    ref.current.position.z = base.z + Math.sin(t * 0.32 + phase) * 0.4
  })

  return (
    <mesh ref={ref} scale={scale}>
      <sphereGeometry args={[0.55, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.2} depthWrite={false} />
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
    const i = intensity
    target.current.x += (pointer.x * 0.6 * i - target.current.x) * 0.06
    target.current.y += (pointer.y * 0.4 * i - target.current.y) * 0.06
    const autoAmp = isNarrow ? 0.22 : 0.14
    const autoX = Math.sin(t * 0.22) * autoAmp
    const autoY = Math.cos(t * 0.17) * autoAmp * 0.7
    const autoZ = Math.sin(t * 0.19) * 0.12
    group.current.position.x = target.current.x * 0.5 + autoX
    group.current.position.y = target.current.y * 0.32 + autoY
    group.current.position.z = autoZ
    group.current.rotation.y = target.current.x * 0.35 + Math.sin(t * 0.16) * 0.06
    group.current.rotation.x = -target.current.y * 0.25 + Math.cos(t * 0.13) * 0.03
    camera.position.z = camBaseZ + Math.sin(t * 0.28) * (isNarrow ? 0.22 : 0.12)
    camera.lookAt(0, 0.05, 0)
  })

  return <group ref={group}>{children}</group>
}

function SceneContent({ quality }: { quality: "high" | "low" }) {
  const urls = quality === "low" ? HERO_IMAGES.slice(0, 3) : HERO_IMAGES.slice(0, 5)
  const textures = useTexture(urls)
  const list = Array.isArray(textures) ? textures : [textures]
  list.forEach((tex) => {
    tex.colorSpace = THREE.SRGBColorSpace
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
  })

  const cards = useMemo((): CardSpec[] => {
    const layout: Omit<CardSpec, "texture">[] =
      quality === "low"
        ? [
            { position: [-2.35, 0.75, -0.2], scale: 1.05, speed: 0.95, phase: 0.2, tilt: 0.18, orbit: 0.48 },
            { position: [2.35, 0.55, -0.35], scale: 0.98, speed: 1.05, phase: 1.1, tilt: 0.16, orbit: 0.45 },
            { position: [-2.2, -1.05, -0.9], scale: 0.78, speed: 1.15, phase: 2.0, tilt: 0.14, orbit: 0.4 },
          ]
        : [
            { position: [-2.55, 0.85, -0.15], scale: 1.08, speed: 0.9, phase: 0.15, tilt: 0.18, orbit: 0.5 },
            { position: [-2.35, -1.05, -0.75], scale: 0.8, speed: 1.12, phase: 1.3, tilt: 0.15, orbit: 0.42 },
            { position: [2.5, 0.65, -0.3], scale: 1.02, speed: 0.98, phase: 0.9, tilt: 0.17, orbit: 0.48 },
            { position: [2.65, -1.15, -0.85], scale: 0.72, speed: 1.18, phase: 2.2, tilt: 0.14, orbit: 0.4 },
            { position: [-1.4, 1.55, -1.55], scale: 0.55, speed: 0.78, phase: 0.6, tilt: 0.12, orbit: 0.35 },
          ]
    return layout.map((s, i) => ({
      ...s,
      texture: list[i % list.length],
    }))
  }, [quality, list])

  return (
    <ParallaxRig intensity={quality === "low" ? 0.75 : 1}>
      {cards.map((c, i) => (
        <PhotoCard key={i} {...c} />
      ))}
      <SoftGlowOrb position={[-1.0, -1.4, -2.0]} color="#D4A5A5" scale={1.4} speed={0.5} />
      <SoftGlowOrb position={[1.2, 1.7, -2.2]} color="#C9A86C" scale={1.15} speed={0.6} />
      <SoftGlowOrb position={[0, 0, -2.8]} color="#F5E6E8" scale={1.7} speed={0.38} />
    </ParallaxRig>
  )
}

export function FlowerScene({ quality = "high" }: { quality?: "high" | "low" }) {
  return (
    <>
      <ambientLight intensity={1.05} />
      <SceneContent quality={quality} />
    </>
  )
}
