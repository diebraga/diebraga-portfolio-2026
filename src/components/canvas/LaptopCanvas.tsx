"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload, useGLTF, Loader } from "@react-three/drei";
import { MacBook } from "../MacBook/MacBook";

// Config panel for your Laptop camera distances
export const CLOSED_DISTANCE = 20;
export const OPENED_DISTANCE = 3; // Adjusted for a nice, close-up view of the screen

export default function LaptopCanvas({
  nonTransitionComplete,
}: {
  nonTransitionComplete: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen((p) => !p), []);

  // Global window click listener to fire the transition
  useEffect(() => {
    window.addEventListener("click", toggle);
    return () => window.removeEventListener("click", toggle);
  }, [toggle]);

  return (
    <>
      <Canvas
        shadows
        dpr={[1, 2]}
        // Initial setup matching our configuration tracker
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
          {/* Passed down variables to handle the animations and triggers */}
          <MacBook
            isOpen={isOpen}
            onTransitionComplete={nonTransitionComplete}
          />
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
