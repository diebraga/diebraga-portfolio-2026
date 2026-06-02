"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const LaptopCanvas = dynamic(() => import("./canvas/LaptopCanvas"), {
  ssr: false,
});

// We pass our new custom prop interface down into the dynamic canvas wrapper
const IPhoneCanvas = dynamic(() => import("./canvas/IPhoneCanvas"), {
  ssr: false,
});

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(max-width: 768px)").matches;
    }
    return false;
  });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile;
}

export default function Home() {
  const isMobile = useIsMobile();
  const [showHtmlPage, setShowHtmlPage] = useState(false);

  return (
    <div className="relative w-full h-screen bg-[#050816] overflow-hidden">
      {/* 3D Canvas Viewport Layer */}
      <div className="absolute inset-0 z-10">
        {isMobile ? (
          <IPhoneCanvas onTransitionComplete={() => setShowHtmlPage(true)} />
        ) : (
          <LaptopCanvas nonTransitionComplete={() => setShowHtmlPage(true)} />
        )}
      </div>

      {/* Modern, Seamless HTML Page Overlay
          - z-20 puts it over the canvas
          - pointer-events-none makes it unclickable until active so users can click the 3D phone canvas underneath
          - transition-opacity gives it a smooth premium fade
      */}
      <div
        className={`absolute inset-0 z-20 flex flex-col items-center justify-start bg-[#111111] text-white overflow-y-auto px-6 py-20 transition-opacity duration-700 ease-in-out ${
          showHtmlPage
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* --- DUMP YOUR NORMAL WEB LAYOUT AND BODY SECTIONS HERE --- */}
        <div className="max-w-3xl w-full mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[#007aff]">
            Welcome to the Full Site
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            This is your regular, production-ready HTML page running perfectly
            outside of WebGL. You can put standard text, React components,
            Tailwind grids, or scroll setups inside this div.
          </p>
        </div>
      </div>
    </div>
  );
}
