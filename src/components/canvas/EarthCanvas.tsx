"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import * as THREE from "three";

// Same 4 K textures from the mrdoob/three.js webgpu_tsl_earth example
const URLS = {
  day:      "/textures/earth_day_4096.jpg",
  night:    "/textures/earth_night_4096.jpg",
  combined: "/textures/earth_bump_roughness_clouds_4096.jpg",
};

// ─── vertex shader ──────────────────────────────────────────────────────────
const vert = /* glsl */`
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  vUv     = uv;
  vec4 mvPos  = modelViewMatrix * vec4(position, 1.0);
  vViewDir    = normalize(-mvPos.xyz);
  vNormal     = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * mvPos;
}`;

// ─── globe fragment shader ───────────────────────────────────────────────────
// Replicates the TSL logic from webgpu_tsl_earth.html in plain GLSL:
//   • combined.b = clouds strength (smoothstepped 0.2 → 1)
//   • combined.r = bump elevation (drives bump-mapped normal offset)
//   • combined.g = roughness  (remapped 0.25 → 0.35, unused visually here)
//   • day / night blend driven by sunOrientation (NdotSun)
//   • atmosphere colour: mix(twilight "#bc490b", day "#4db2ff") vs sunOrientation
//   • atmosphere overlay: atmosphereDayStrength * fresnel²  (same clamp 0→1)
const globeFrag = /* glsl */`
uniform sampler2D uDay;
uniform sampler2D uNight;
uniform sampler2D uCombined;   // r=bump  g=roughness  b=clouds
uniform vec3 uSunDir;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;

// Simple bump offset using screen-space derivatives (no tangent needed)
vec3 bumpNormal(vec3 N, float elevation) {
  float bumpScale = 0.08;
  vec3 dpdx = dFdx(vec3(vUv, 0.0));
  vec3 dpdy = dFdy(vec3(vUv, 0.0));
  float ex   = dFdx(elevation);
  float ey   = dFdy(elevation);
  return normalize(N - bumpScale * (ex * dpdx + ey * dpdy));
}

void main() {
  // ── textures ─────────────────────────────────────────────────────────────
  vec4 combined    = texture2D(uCombined, vUv);
  float cloudRaw   = combined.b;
  float clouds     = smoothstep(0.2, 1.0, cloudRaw);   // same as TSL
  float bump       = max(combined.r, clouds);            // bumpMap(max(r, clouds))

  vec3 N           = bumpNormal(normalize(vNormal), bump);
  vec3 sun         = normalize(uSunDir);

  // ── sun orientation (same variable name as the example) ──────────────────
  float sunOrientation = dot(N, sun);                    // normalWorldGeometry.dot(sun)

  // ── atmosphere colour ─────────────────────────────────────────────────────
  vec3 atmoDayColor      = vec3(0.302, 0.698, 1.000);   // #4db2ff
  vec3 atmoTwilightColor = vec3(0.737, 0.286, 0.043);   // #bc490b
  float atmoMix          = smoothstep(-0.25, 0.75, sunOrientation);
  vec3 atmosphereColor   = mix(atmoTwilightColor, atmoDayColor, atmoMix);

  // ── day texture + cloud overlay (mix(day, white, clouds*2).clamp) ─────────
  vec3 dayColor  = texture2D(uDay, vUv).rgb;
  vec3 dayFinal  = mix(dayColor, vec3(1.0), clamp(clouds * 2.0, 0.0, 1.0));

  // ── night lights ──────────────────────────────────────────────────────────
  vec3 nightColor = texture2D(uNight, vUv).rgb;

  // ── day / night blend  (smoothstep(-0.25, 0.5) from the example) ─────────
  float dayStrength  = smoothstep(-0.25, 0.5, sunOrientation);

  // ── atmosphere overlay ────────────────────────────────────────────────────
  float fresnel          = 1.0 - abs(dot(vViewDir, normalize(vNormal)));
  float atmoDayStrength  = smoothstep(-0.5, 1.0, sunOrientation);
  float atmosphereMix    = clamp(atmoDayStrength * pow(fresnel, 2.0), 0.0, 1.0);

  // ── compose (matches outputNode in the example) ───────────────────────────
  // "output.rgb" in the example is the PBR-lit day surface.
  // Here we approximate it: ambient + directional diffuse on dayFinal.
  float ambient  = 0.5;
  float diffuse  = max(0.0, sunOrientation);
  float light    = ambient + diffuse * (1.0 - ambient);
  vec3  litDay   = dayFinal * light;

  vec3 color = mix(nightColor, litDay, dayStrength);
  color      = mix(color, atmosphereColor, atmosphereMix);

  gl_FragColor = vec4(color, 1.0);
}`;

// ─── atmosphere fragment shader ──────────────────────────────────────────────
const atmoFrag = /* glsl */`
uniform vec3 uSunDir;

varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  vec3 N   = normalize(vNormal);
  vec3 sun = normalize(uSunDir);

  float fresnel = 1.0 - abs(dot(vViewDir, N));
  float sunOrientation = dot(N, sun);

  vec3 atmoDayColor      = vec3(0.302, 0.698, 1.000);
  vec3 atmoTwilightColor = vec3(0.737, 0.286, 0.043);
  vec3 atmosphereColor   = mix(atmoTwilightColor, atmoDayColor,
                               smoothstep(-0.25, 0.75, sunOrientation));

  // alpha: remap(0.73,1 → 1,0).pow(3)  *  sunOrientation.smoothstep(-0.5,1)
  float a   = clamp((fresnel - 0.73) / (1.0 - 0.73), 0.0, 1.0);
  a         = 1.0 - a;                    // remap output 1→0
  float alpha = pow(a, 3.0) * smoothstep(-0.5, 1.0, sunOrientation);

  gl_FragColor = vec4(atmosphereColor, alpha);
}`;

// Simple vert for atmosphere (same outputs as globe)
const atmoVert = /* glsl */`
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
  vec4 mvPos  = modelViewMatrix * vec4(position, 1.0);
  vViewDir    = normalize(-mvPos.xyz);
  vNormal     = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * mvPos;
}`;

// ─── Globe component ─────────────────────────────────────────────────────────
function Globe() {
  const meshRef = useRef<THREE.Mesh>(null!);

  const [dayTex, nightTex, combinedTex] = useLoader(THREE.TextureLoader, [
    URLS.day, URLS.night, URLS.combined,
  ]);

  // Anisotropic filtering — same as the example
  dayTex.anisotropy = nightTex.anisotropy = combinedTex.anisotropy = 8;
  dayTex.colorSpace  = THREE.SRGBColorSpace;
  nightTex.colorSpace = THREE.SRGBColorSpace;

  const SUN = useMemo(() => new THREE.Vector3(0, 0, 3).normalize(), []);

  const globeUniforms = useMemo(() => ({
    uDay:      { value: dayTex },
    uNight:    { value: nightTex },
    uCombined: { value: combinedTex },
    uSunDir:   { value: SUN },
  }), [dayTex, nightTex, combinedTex, SUN]);

  const atmoUniforms = useMemo(() => ({
    uSunDir: { value: SUN },
  }), [SUN]);

  useFrame((_, delta) => {
    meshRef.current.rotation.y -= delta * 0.08;
  });

  return (
    <group>
      <mesh ref={meshRef} rotation-y={-Math.PI / 4}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          vertexShader={vert}
          fragmentShader={globeFrag}
          uniforms={globeUniforms}
          // @ts-expect-error derivatives is a valid WebGL extension
          extensions={{ derivatives: true }}
        />
      </mesh>

      {/* Atmosphere — BackSide, 1.04× scale, additive-ish blend */}
      <mesh scale={1.04}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          vertexShader={atmoVert}
          fragmentShader={atmoFrag}
          uniforms={atmoUniforms}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// ─── Canvas ──────────────────────────────────────────────────────────────────
export default function EarthCanvas() {
  return (
    <Canvas
      camera={{ position: [4.5, 2, 3], fov: 25 }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
    >
      <directionalLight color="#ffffff" intensity={2} position={[0, 0, 3]} />

      <Suspense fallback={null}>
        <Globe />
      </Suspense>

      <OrbitControls
        enableDamping
        minDistance={1.5}
        maxDistance={10}
      />
      <Preload all />
    </Canvas>
  );
}
