"use client"

import { Suspense, useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Preload, useGLTF } from "@react-three/drei"
import * as THREE from "three"

const CLOSED_ANGLE = Math.PI * 0.5   // lid flat
const LERP_SPEED   = 0.06

function Laptop() {
  const { scene }   = useGLTF("/mac-draco.glb")
  const openAngle   = useRef<number | null>(null)
  const targetAngle = useRef(CLOSED_ANGLE)   // start closed
  const [isOpen, setIsOpen] = useState(false)

  // Capture the model's native open angle and immediately close it
  useEffect(() => {
    const screenflip = scene.getObjectByName("screenflip")
    if (screenflip) {
      openAngle.current     = screenflip.rotation.x
      screenflip.rotation.x = CLOSED_ANGLE
      targetAngle.current   = CLOSED_ANGLE
    }
  }, [scene])

  // Click anywhere → toggle open / closed
  useEffect(() => {
    const handleClick = () => {
      setIsOpen((prev) => {
        const next = !prev
        targetAngle.current = next
          ? (openAngle.current ?? -Math.PI * 0.425)
          : CLOSED_ANGLE
        return next
      })
    }
    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [])

  // Only animate the lid — no floating
  useFrame(() => {
    const screenflip = scene.getObjectByName("screenflip")
    if (screenflip) {
      screenflip.rotation.x = THREE.MathUtils.lerp(
        screenflip.rotation.x,
        targetAngle.current,
        LERP_SPEED,
      )
    }
  })

  return (
    <primitive object={scene} scale={0.9} position={[0, -0.6, 0]} rotation={[0, 0, 0]} />
  )
}

export default function LaptopCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      // ↓ CAMERA DISTANCE — change the last number (z) to zoom in/out
      camera={{ position: [0, 0.5, 84], fov: 42 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <directionalLight position={[2, 4, 5]}   intensity={2.5} color="#ffffff" />
      <directionalLight position={[-4, 2, 2]}  intensity={0.8} color="#c8d8ff" />
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
