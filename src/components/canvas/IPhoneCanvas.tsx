"use client";

import { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload, Loader } from "@react-three/drei";
import * as THREE from "three";
import { IPhone } from "../IPhone/IPhone";
import StarField from "./StarField";

export const CLOSED_DISTANCE = -2;
export const OPENED_DISTANCE = -0.5;

export function CameraZoom({ isOpen }: { isOpen: boolean }) {
  useFrame((state) => {
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      isOpen ? OPENED_DISTANCE : CLOSED_DISTANCE,
      0.05,
    );
  });

  return null;
}

export default function IPhoneCanvas({
  onTransitionComplete,
}: {
  onTransitionComplete: () => void;
}) {
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
          <StarField count={4000} radius={16} size={0.06} />
          <IPhone onTransitionComplete={onTransitionComplete} />
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
