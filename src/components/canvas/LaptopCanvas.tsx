"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Preload, useGLTF } from "@react-three/drei"

function Laptop() {
  const { scene } = useGLTF("/mac-draco.glb")

  return (
    <primitive
      object={scene}
      scale={1.2}
      position={[0, -1.2, 0]}
      rotation={[0, 0, 0]}
    />
  )
}

export default function LaptopCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 40 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      {/* Key light — warm white from the front-top */}
      <directionalLight position={[2, 4, 5]} intensity={2.5} color="#ffffff" />
      {/* Fill light — soft from the left */}
      <directionalLight position={[-4, 2, 2]} intensity={0.8} color="#c8d8ff" />
      {/* Rim light — subtle from behind */}
      <directionalLight position={[0, -2, -4]} intensity={0.4} color="#ffffff" />
      {/* Ambient so shadows don't go fully black */}
      <ambientLight intensity={0.3} />

      <Suspense fallback={null}>
        <Laptop />
      </Suspense>

      <Preload all />
    </Canvas>
  )
}

useGLTF.preload("/mac-draco.glb")
