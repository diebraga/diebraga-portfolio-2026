"use client";

import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

export function TypewriterOverlay({ onComplete }: { onComplete: () => void }) {
  const isMobile = useIsMobile();
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [activeLine, setActiveLine] = useState(1);

  useEffect(() => {
    const textLine1 = "Hello Stranger...";
    const textLine2 = isMobile ? "(Tap anywhere to start)" : "(Click anywhere to start)";

    let index1 = 0;
    let index2 = 0;
    let currentLine1 = "";
    let currentLine2 = "";

    // Typewriter sound intentionally disabled — no suitable per-character audio asset
    const playTypewriterSound = () => {};

    // Step 1: Type out Line 1
    const timer1 = setInterval(() => {
      if (index1 < textLine1.length) {
        currentLine1 += textLine1[index1];
        setLine1(currentLine1);

        if (textLine1[index1] !== " ") {
          playTypewriterSound();
        }

        index1++;
      } else {
        clearInterval(timer1);
        setTimeout(() => {
          setActiveLine(2);
          startLine2();
        }, 500);
      }
    }, 80);

    // Step 2: Type out Line 2
    const startLine2 = () => {
      const timer2 = setInterval(() => {
        if (index2 < textLine2.length) {
          currentLine2 += textLine2[index2];
          setLine2(currentLine2);

          if (textLine2[index2] !== " ") {
            playTypewriterSound();
          }

          index2++;
        } else {
          clearInterval(timer2);
          setActiveLine(3);
          onComplete(); // Unlock everything here
        }
      }, 60);
    };

    return () => {
      clearInterval(timer1);
    };
  }, [onComplete]);

  return (
    <div className="absolute inset-x-0 top-12 z-30 pointer-events-none select-none flex flex-col items-center justify-start gap-3 text-center px-4">
      {/* Line 1 */}
      <h2 className="text-2xl md:text-3xl font-mono font-bold tracking-widest text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
        {line1}
        {activeLine === 1 && (
          <span className="animate-[pulse_0.8s_infinite] ml-1 text-[#b350b5]">
            █
          </span>
        )}
      </h2>

      {/* Line 2 */}
      <h3
        className="text-sm md:text-base font-mono font-medium tracking-wide text-white h-6"
        style={{ textShadow: "0 0 12px rgba(168,85,247,0.8), 0 0 24px rgba(168,85,247,0.4)" }}
      >
        {line2}
        {(activeLine === 2 || activeLine === 3) && (
          <span className="animate-[pulse_0.8s_infinite] ml-1 text-purple-400">█</span>
        )}
      </h3>
    </div>
  );
}
