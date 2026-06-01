"use client"

import { Suspense, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Preload, useGLTF } from "@react-three/drei"
import type { Group } from "three"

function Laptop() {
  const { scene } = useGLTF("/mac-draco.glb")
  const ref = useRef<Group>(null)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.position.y = -1.2 + Math.sin(t) * 0.12
    ref.current.position.x = Math.cos(t * 0.8) * 0.08
  })

  return (
    <group ref={ref}>
      <primitive
        object={scene}
        scale={1.4}
        position={[0, -1.2, 0]}
        rotation={[0, 0, 0]}
      />
    </group>
  )
}

export default function LaptopCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 9], fov: 36 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <directionalLight position={[2, 4, 5]}  intensity={2.5} color="#ffffff" />
      <directionalLight position={[-4, 2, 2]} intensity={0.8} color="#c8d8ff" />
      <directionalLight position={[0, -2, -4]} intensity={0.4} color="#ffffff" />
      <ambientLight intensity={0.3} />

      <Suspense fallback={null}>
        <Laptop />
      </Suspense>

      <Preload all />
    </Canvas>
  )
}

useGLTF.preload("/mac-draco.glb")
