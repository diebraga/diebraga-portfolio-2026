"use client";

import dynamic from "next/dynamic";
import About from "./sections/About";
import Experience from "./sections/Experience";
import Works from "./sections/Works";
import Tech from "./sections/Tech";

export default function MainContent() {
  return (
    <div className="relative z-0" style={{ backgroundColor: "#0b0013" }}>
      <About />
      <Experience />
      <Works />
    </div>
  );
}
