"use client"

import { Suspense, useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Preload, useGLTF } from "@react-three/drei"
import * as THREE from "three"

function Laptop() {
  const { scene } = useGLTF("/mac-draco.glb")
  const groupRef   = useRef<THREE.Group>(null)
  const [isOpen, setIsOpen]   = useState(true)
  const openAngle  = useRef(0)          // read from model on mount
  const targetAngle = useRef(0)

  // Read the lid's resting "open" angle from the model itself
  useEffect(() => {
    const screenflip = scene.getObjectByName("screenflip")
    if (screenflip) {
      openAngle.current  = screenflip.rotation.x
      targetAngle.current = screenflip.rotation.x
    }
  }, [scene])

  // Toggle on click anywhere on the canvas
  useEffect(() => {
    const handleClick = () => {
      setIsOpen((prev) => {
        const next = !prev
        const screenflip = scene.getObjectByName("screenflip")
        if (screenflip) {
          // Closed = lid flat (rotation.x ≈ 0); open = original angle
          targetAngle.current = next ? openAngle.current : Math.PI * 0.5
        }
        return next
      })
    }
    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [scene])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Float animation
    if (groupRef.current) {
      groupRef.current.position.y = -1.2 + Math.sin(t) * 0.12
      groupRef.current.position.x = Math.cos(t * 0.8) * 0.08
    }

    // Smooth lid close/open
    const screenflip = scene.getObjectByName("screenflip")
    if (screenflip) {
      screenflip.rotation.x = THREE.MathUtils.lerp(
        screenflip.rotation.x,
        targetAngle.current,
        0.07,
      )
    }
  })

  return (
    <group ref={groupRef}>
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
