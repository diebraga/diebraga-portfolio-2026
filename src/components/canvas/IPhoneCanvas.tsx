"use client";

import { Suspense, useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Preload, useGLTF, Loader } from "@react-three/drei";
import * as THREE from "three";

const MODEL_Y = -2.6;
const CLOSED_DISTANCE = 50;
const OPENED_DISTANCE = 31;

function CameraZoom({ isOpen }: { isOpen: boolean }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      isOpen ? OPENED_DISTANCE : CLOSED_DISTANCE,
      0.05,
    );
  });
  return null;
}

function Phone() {
  const { scene } = useGLTF("/models/iphone-17-pro.glb");
  const groupRef = useRef<THREE.Group>(null);
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen((p) => !p), []);

  useEffect(() => {
    window.addEventListener("click", toggle);
    return () => window.removeEventListener("click", toggle);
  }, [toggle]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.position.y = isOpen
        ? THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.05)
        : Math.sin(t * 0.8) * 0.12;

      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        isOpen ? Math.PI : 0,
        0.05,
      );
    }
  });

  return (
    <>
      <CameraZoom isOpen={isOpen} />
      <group ref={groupRef}>
        <primitive
          object={scene}
          scale={0.9}
          position={[0, MODEL_Y, 0]}
          rotation={[0, 0, 0]}
        />
      </group>
    </>
  );
}

export default function IPhoneCanvas() {
  return (
    <>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, CLOSED_DISTANCE], fov: 10 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <directionalLight
          position={[2, 4, 5]}
          intensity={2.5}
          color="#ffffff"
        />
        <directionalLight
          position={[-4, 2, 2]}
          intensity={0.8}
          color="#c8d8ff"
        />
        <directionalLight
          position={[0, -2, -4]}
          intensity={0.4}
          color="#ffffff"
        />
        <ambientLight intensity={0.3} />

        <Suspense fallback={null}>
          <Phone />
        </Suspense>

        <Preload all />
      </Canvas>
      <Loader
        containerStyles={{ background: "#121212" }}
        innerStyles={{ background: "#333" }}
        barStyles={{ background: "#007aff" }}
        dataStyles={{ color: "#ffffff" }}
        dataInterpolation={(p) => `Loading 3D Scene... ${p.toFixed(0)}%`}
      />
    </>
  );
}

useGLTF.preload("/models/iphone-17-pro.glb");
