'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const COUNT = 20000;
const SPEED_MULT = 1;

type PurpleSunProps = {
  className?: string;
  size?: number;
};

export default function PurpleSun({ className = '', size = 180 }: PurpleSunProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // SCENE
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.015);

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 2000);
    camera.position.set(0, 0, 80);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // BLOOM via manual emissive brightness (no postprocessing to keep it light)
    const geometry = new THREE.ConeGeometry(0.1, 0.5, 4);
    geometry.rotateX(Math.PI / 2);

    const material = new THREE.MeshBasicMaterial({ color: 0xc084fc });

    const instancedMesh = new THREE.InstancedMesh(geometry, material, COUNT);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(instancedMesh);

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    const target = new THREE.Vector3();

    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < COUNT; i++) {
      positions.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100
        )
      );
      instancedMesh.setColorAt(i, color.setHex(0xc084fc));
    }
    if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

    // AUTO SPIN
    let angle = 0;
    const clock = new THREE.Clock();

    function animate() {
      const rafId = requestAnimationFrame(animate);
      (animate as any)._raf = rafId;

      const delta = clock.getDelta();
      const time = clock.getElapsedTime() * SPEED_MULT;

      // Orbit camera
      angle += delta * 0.4;
      camera.position.x = Math.sin(angle) * 80;
      camera.position.z = Math.cos(angle) * 80;
      camera.lookAt(0, 0, 0);

      for (let i = 0; i < COUNT; i++) {
        const r = 22;
        const phi = Math.acos(-1 + (2 * i) / COUNT);
        const theta = Math.sqrt(COUNT * Math.PI) * phi + time * 0.3;

        // Purple palette: vary between violet and magenta
        const hue = 0.75 + 0.08 * Math.sin(time + i * 0.001);
        color.setHSL(hue, 1.0, 0.65);

        target.set(
          r * Math.cos(theta) * Math.sin(phi),
          r * Math.sin(theta) * Math.sin(phi),
          r * Math.cos(phi)
        );

        positions[i].lerp(target, 0.08);
        dummy.position.copy(positions[i]);
        dummy.lookAt(target);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
        instancedMesh.setColorAt(i, color);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame((animate as any)._raf);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [size]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden' }}
    />
  );
}
