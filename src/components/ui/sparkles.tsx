"use client";
import { useId, useEffect } from "react";
import { tsParticles } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

// Shared init promise so loadSlim only runs once across all instances
let engineReady: Promise<void> | null = null;
function ensureEngine() {
  if (!engineReady) {
    engineReady = loadSlim(tsParticles).catch(() => {
      engineReady = null;
    });
  }
  return engineReady;
}

export const SparklesCore = (props: ParticlesProps) => {
  const {
    id,
    className,
    background,
    minSize,
    maxSize,
    speed,
    particleColor,
    particleDensity,
  } = props;

  const controls = useAnimation();
  const rawId = useId();
  const containerId = id || rawId.replace(/:/g, "sp");

  useEffect(() => {
    let container: { destroy: () => void } | undefined;
    let cancelled = false;

    ensureEngine().then(async () => {
      if (cancelled) return;
      container = await tsParticles.load({
        id: containerId,
        options: {
          background: { color: { value: background || "transparent" } },
          fullScreen: { enable: false, zIndex: 1 },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: { enable: false },
              onHover: { enable: false },
              resize: true as never,
            },
          },
          particles: {
            color: { value: particleColor || "#a855f7" },
            move: {
              direction: "none",
              enable: true,
              outModes: { default: "out" },
              speed: { min: 0.1, max: speed || 0.8 },
            },
            number: {
              density: { enable: true, width: 400, height: 400 },
              value: particleDensity || 80,
            },
            opacity: {
              value: { min: 0.1, max: 0.8 },
              animation: {
                enable: true,
                speed: speed || 2,
                sync: false,
                startValue: "random" as never,
              },
            },
            size: {
              value: { min: minSize || 0.5, max: maxSize || 2 },
            },
            shape: { type: "circle" },
          },
          detectRetina: true,
        },
      }) as { destroy: () => void } | undefined;

      if (container && !cancelled) {
        controls.start({ opacity: 1, transition: { duration: 1 } });
      }
    });

    return () => {
      cancelled = true;
      container?.destroy();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId]);

  return (
    <motion.div animate={controls} className={cn("opacity-0", className)}>
      <div id={containerId} className="h-full w-full" />
    </motion.div>
  );
};
