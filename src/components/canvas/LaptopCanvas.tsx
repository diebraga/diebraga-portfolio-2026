"use client";

import { Suspense, useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Preload, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// ↓ VERTICAL POSITION — positive = up, negative = down
const MODEL_Y = -2.6;

const CLOSED_DISTANCE = 50;
const OPENED_DISTANCE = 31;

const CLOSED_ANGLE = Math.PI * 0.5;
const LERP_SPEED = 0.06;

// Smoothly zooms camera in/out when lid opens/closes
function CameraZoom({ isOpen }: { isOpen: boolean }) {
  const { camera } = useThree();
  useFrame(() => {
    const target = isOpen ? OPENED_DISTANCE : CLOSED_DISTANCE;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, target, 0.05);
  });
  return null;
}

interface LaptopProps {
  isOpen: boolean;
  onToggle: () => void;
}

function Laptop({ isOpen, onToggle }: LaptopProps) {
  const { scene } = useGLTF("/mac-draco.glb");
  const groupRef = useRef<THREE.Group>(null);
  const openAngle = useRef<number | null>(null);
  const targetAngle = useRef(CLOSED_ANGLE);

  useEffect(() => {
    const screenflip = scene.getObjectByName("screenflip");
    if (screenflip) {
      openAngle.current = screenflip.rotation.x;
      screenflip.rotation.x = CLOSED_ANGLE;
      targetAngle.current = CLOSED_ANGLE;
    }
  }, [scene]);

  useEffect(() => {
    window.addEventListener("click", onToggle);
    return () => window.removeEventListener("click", onToggle);
  }, [onToggle]);

  useFrame(({ clock }) => {
    // Float only when closed
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      groupRef.current.position.y = isOpen
        ? THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.05)
        : Math.sin(t * 0.8) * 0.12;
    }

    targetAngle.current = isOpen
      ? (openAngle.current ?? -Math.PI * 0.425)
      : CLOSED_ANGLE;

    const screenflip = scene.getObjectByName("screenflip");
    if (screenflip) {
      screenflip.rotation.x = THREE.MathUtils.lerp(
        screenflip.rotation.x,
        targetAngle.current,
        LERP_SPEED,
      );
    }
  });

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        scale={0.9}
        position={[0, MODEL_Y, 0]}
        rotation={[0, 0, 0]}
      />
    </group>
  );
}

export default function LaptopCanvas() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen((p) => !p), []);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, CLOSED_DISTANCE], fov: 10 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <CameraZoom isOpen={isOpen} />

      <directionalLight position={[2, 4, 5]} intensity={2.5} color="#ffffff" />
      <directionalLight position={[-4, 2, 2]} intensity={0.8} color="#c8d8ff" />
      <directionalLight
        position={[0, -2, -4]}
        intensity={0.4}
        color="#ffffff"
      />
      <ambientLight intensity={0.3} />

      <Suspense fallback={null}>
        <Laptop isOpen={isOpen} onToggle={toggle} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
}

useGLTF.preload("/mac-draco.glb");
