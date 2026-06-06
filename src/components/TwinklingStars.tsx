"use client";

import { useMemo } from "react";

interface Star {
  top: string;
  left: string;
  duration: string;
  delay: string;
  size: number;
  opacity: number;
}

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    top:      `${Math.random() * 100}%`,
    left:     `${Math.random() * 100}%`,
    duration: `${(Math.random() * 2 + 1).toFixed(2)}s`,
    delay:    `${(Math.random() * 3).toFixed(2)}s`,
    size:     Math.random() < 0.15 ? 2 : 1,
    opacity:  Math.random() * 0.5 + 0.5,
  }));
}

export default function TwinklingStars({ count = 200 }: { count?: number }) {
  const stars = useMemo(() => generateStars(count), [count]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "transparent",
        pointerEvents: "none",
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.08; transform: scale(0.6); }
        }
      `}</style>

      {stars.map((s, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: s.top,
            left: s.left,
            width:  s.size,
            height: s.size,
            borderRadius: "50%",
            backgroundColor: "#fff",
            boxShadow: `0 0 ${s.size * 3}px ${s.size * 2}px rgba(255,255,255,0.9),
                        0 0 ${s.size * 7}px ${s.size * 4}px rgba(200,180,255,0.55),
                        0 0 ${s.size * 14}px ${s.size * 6}px rgba(168,85,247,0.25)`,
            ["--star-op" as string]: s.opacity,
            animation: `twinkle ${s.duration} ${s.delay} ease-in-out infinite`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
