"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const LaptopCanvas = dynamic(() => import("./canvas/LaptopCanvas"), {
  ssr: false,
});
const IPhoneCanvas = dynamic(() => import("./canvas/IPhoneCanvas"), {
  ssr: false,
});

function useIsMobile() {
  // FIXED: Initialize the state using a lazy evaluation function checking window safety bounds.
  // This removes the need to call setState synchronously inside the effect hook below.
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(max-width: 768px)").matches;
    }
    return false; // Server-side render default value fallback
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

  return (
    <div className="w-full h-screen bg-[#050816]">
      {isMobile ? <IPhoneCanvas /> : <LaptopCanvas />}
    </div>
  );
}
