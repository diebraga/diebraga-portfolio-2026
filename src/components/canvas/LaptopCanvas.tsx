"use client"

import { Suspense, useEffect, useState, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Preload, useGLTF, Float } from "@react-three/drei"
import * as THREE from "three"

// ── Loader fallback ────────────────────────────────────────────────────────────

function CanvasLoader() {
  return (
    <mesh>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial color="#915eff" />
    </mesh>
  )
}

// ── Laptop mesh ────────────────────────────────────────────────────────────────

interface LaptopProps {
  isMobile: boolean
}

function Laptop({ isMobile }: LaptopProps) {
  const { scene } = useGLTF("/mac-draco.glb")
  const posRef = useRef({ x: 0, y: 0 })

  useFrame(({ clock }) => {
    posRef.current.x = Math.sin(clock.getElapsedTime()) * 0.2
    posRef.current.y = Math.cos(clock.getElapsedTime()) * 0.2
  })

  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={new THREE.Vector2(1024, 1024)}
      />
      <pointLight intensity={1} />
      <primitive
        object={scene}
        scale={isMobile ? 0.7 : 0.75}
        position={[
          isMobile ? posRef.current.x / 2 : posRef.current.x,
          isMobile ? -3 : -3.25,
          isMobile ? posRef.current.y / 2 - 2.2 : posRef.current.y - 1.5,
        ]}
        rotation={[0, Math.PI / 4, 0]}
      />
    </mesh>
  )
}

// ── Canvas wrapper (exported) ──────────────────────────────────────────────────

export default function LaptopCanvas() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 500px)")
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  return (
    <Canvas
      frameloop="always"
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls makeDefault enableZoom={false} />
        <Float>
          <Laptop isMobile={isMobile} />
        </Float>
      </Suspense>
      <Preload all />
    </Canvas>
  )
}

useGLTF.preload("/mac-draco.glb")
