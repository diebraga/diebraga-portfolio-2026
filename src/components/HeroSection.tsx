"use client"

import dynamic from "next/dynamic"

const LaptopCanvas = dynamic(() => import("./canvas/LaptopCanvas"), {
  ssr: false,
})

export default function HeroSection() {
  return (
    <div className="w-full h-screen bg-[#050816]">
      <LaptopCanvas />
    </div>
  )
}
