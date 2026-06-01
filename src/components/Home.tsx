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
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
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
