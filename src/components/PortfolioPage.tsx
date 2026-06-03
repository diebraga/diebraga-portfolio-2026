"use client";

import { useState } from "react";
import MainContent from "./MainContent";

export default function PortfolioPage() {
  const [contracting, setContracting] = useState(true);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <MainContent />

      {/* Circle-contract reveal overlay — plays once on entry */}
      {contracting && (
        <div
          className="fixed inset-0 z-50 bg-[#0b0013] pointer-events-none"
          style={{ animation: "circleContract 0.55s cubic-bezier(0.76,0,0.24,1) forwards" }}
          onAnimationEnd={() => setContracting(false)}
        />
      )}
    </div>
  );
}
