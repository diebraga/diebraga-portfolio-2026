"use client";

import React, { ReactNode } from "react";

interface HeroWithVideoProps {
  children?: ReactNode;
}

export function Hero({ children }: HeroWithVideoProps) {
  return (
    <section className="absolute top-0 left-0 w-screen h-screen min-h-screen bg-[#000000] overflow-hidden flex flex-col justify-center items-center px-6 m-0 p-0">
      {/* Background Video Layer */}
      <div className="absolute inset-0 w-full h-full min-w-full min-h-full z-0 overflow-hidden select-none pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute -top-1 left-0 w-full h-full min-w-full min-h-full object-cover transform scale-110 origin-top"
          style={{ pointerEvents: "none" }}
        >
          <source src="/blackhole.webm" type="video/webm" />
          <source src="/blackhole.mp4" type="video/mp4" />
        </video>
      </div>

      {/* =====================================================================
        💥 RESPONSIVE BRANDING HEADER
        =====================================================================
        - top-[18%]: Lifted higher toward the top ceiling on mobile devices.
        - md:top-[25%] md:left-16: Balanced default placement for laptops.
        - 2xl:top-[35%] 2xl:left-[15%]: Shipped further down/right on huge screens.
      */}
      <div className="absolute top-[18%] left-6 md:top-[25%] md:left-16 2xl:top-[35%] 2xl:left-[15%] z-30 pointer-events-none select-none flex flex-col items-start text-left gap-1">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-mono font-bold tracking-wider text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] whitespace-nowrap">
          Diego Braga
        </h1>
        <p className="text-[10px] sm:text-xs md:text-xl font-mono font-light tracking-[0.15em] text-[#007aff] uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
          Software Engineer
        </p>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center pointer-events-auto">
        {children ? (
          children
        ) : (
          <div className="space-y-6 max-w-2xl animate-fade-in"></div>
        )}
      </div>
    </section>
  );
}
