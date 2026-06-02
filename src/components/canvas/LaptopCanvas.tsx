"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload, useGLTF, Loader } from "@react-three/drei";
import { MacBook } from "../MacBook/MacBook";

const CLOSED_DISTANCE = 50;

export default function LaptopCanvas() {
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
          <MacBook />
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

useGLTF.preload("/mac-draco.glb");
