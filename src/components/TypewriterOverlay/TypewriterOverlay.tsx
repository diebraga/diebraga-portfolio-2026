"use client";

import { useEffect, useState } from "react";

export function TypewriterOverlay({ onComplete }: { onComplete: () => void }) {
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [activeLine, setActiveLine] = useState(1);

  useEffect(() => {
    const textLine1 = "Hello Stranger...";
    const textLine2 = "(Click anywhere to start)";

    let index1 = 0;
    let index2 = 0;
    let currentLine1 = "";
    let currentLine2 = "";

    const playTypewriterSound = () => {
      const audio = new Audio("/typewriter.mp3");
      audio.volume = 0.25; // Keep it clean and atmospheric, not deafening
      audio.currentTime = 0; // Reset tracking pointer for quick successive triggers

      audio.play().catch((err) => {
        // Silently handles browser autoplay block policy without killing the animation script
        console.debug("Audio play deferred until user gesture:", err.message);
      });
    };

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
      <h3 className="text-sm md:text-base font-mono font-light tracking-wide text-gray-400 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] h-6">
        {line2}
        {(activeLine === 2 || activeLine === 3) && (
          <span className="animate-[pulse_0.8s_infinite] ml-1 text-[#b350b5]">
            █
          </span>
        )}
      </h3>
    </div>
  );
}
