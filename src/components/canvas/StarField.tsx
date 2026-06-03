"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";

function generateSpherePositions(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    // Distribute evenly on the sphere surface (not volume) for better coverage
    const r = radius * (0.6 + 0.4 * Math.random());
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

interface StarFieldProps {
  count?: number;
  radius?: number;
  size?: number;
}

export default function StarField({
  count = 5000,
  radius = 1.2,
  size = 0.002,
}: StarFieldProps) {
  const ref = useRef<any>(null);
  const sphere = useMemo(
    () => generateSpherePositions(count, radius),
    [count, radius]
  );

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#f272c8"
          size={size}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
}
