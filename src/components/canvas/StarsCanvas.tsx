"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import StarField from "./StarField";

const StarsCanvas = () => (
  <div className="w-full h-auto absolute inset-0 z-[-1]">
    <Canvas camera={{ position: [0, 0, 1] }}>
      <Suspense fallback={null}>
        <StarField count={5000} radius={1.2} size={0.002} />
      </Suspense>
      <Preload all />
    </Canvas>
  </div>
);

export default StarsCanvas;
