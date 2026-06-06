"use client";

import dynamic from "next/dynamic";
import About from "./sections/About";
import Experience from "./sections/Experience";
import Works from "./sections/Works";

export default function MainContent() {
  return (
    <div className="relative z-0 bg-black">
      <About />
      <Experience />
      <Works />
    </div>
  );
}
