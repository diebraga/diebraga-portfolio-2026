"use client"

import dynamic from "next/dynamic"
import ScrollIndicator from "./ScrollIndicator"

// Three.js canvas must be client-only — ssr: false only works in Client Components
const LaptopCanvas = dynamic(() => import("./canvas/LaptopCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-white/40 text-sm font-mono">loading…</span>
    </div>
  ),
})

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen mx-auto bg-[#050816] overflow-hidden">
      {/* Hero text */}
      <div className="absolute inset-0 top-[120px] max-w-7xl mx-auto px-6 sm:px-16 flex flex-row items-start gap-5 z-10 pointer-events-none">
        <div>
          <h1 className="text-white font-black text-[40px] xs:text-[50px] sm:text-[60px] lg:text-[80px] leading-tight mt-2">
            Hi, I&apos;m{" "}
            <span className="bg-gradient-to-r from-blue-500 to-pink-500 text-transparent bg-clip-text">
              Diego
            </span>
          </h1>
          <p className="text-[#dfd9ff] font-medium text-[16px] xs:text-[20px] sm:text-[26px] lg:text-[30px] mt-2">
            I create awesome mobile applications
            <br className="sm:block hidden" />
            and build cool things for the web. ✨
          </p>
        </div>
      </div>

      {/* 3D Laptop — fills the full hero */}
      <div className="absolute inset-0">
        <LaptopCanvas />
      </div>

      {/* Animated scroll indicator */}
      <ScrollIndicator />
    </section>
  )
}
