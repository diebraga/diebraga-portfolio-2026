"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { navLinks } from "../../constants";

// All section ids in order (hero first)
const allSections = [
  { id: "hero", title: "Hero" },
  ...navLinks.map((n) => ({ id: n.id, title: n.title })),
];

const Navbar = () => {
  const [active, setActive] = useState("Hero");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Prevent observer from overriding an in-flight programmatic scroll
  const isScrollingRef = useRef(false);

  // Opacity on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver — whichever section is most visible wins
  useEffect(() => {
    const ratios: Record<string, number> = {};

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;

        entries.forEach((entry) => {
          ratios[entry.target.id] = entry.intersectionRatio;
        });

        // Pick the section with the highest visible ratio
        let best = "";
        let bestRatio = -1;
        allSections.forEach(({ id, title }) => {
          const r = ratios[id] ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            best = title;
          }
        });

        if (best) setActive(best);
      },
      {
        threshold: [0, 0.05, 0.1, 0.2, 0.3, 0.5],
        // Top edge: just below the navbar (~80px). Bottom: cut off lower half.
        // A section becomes "active" when its top enters the upper 50% of the viewport.
        rootMargin: "-80px 0px -45% 0px",
      }
    );

    allSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((id: string, title: string) => {
    setActive(title);
    setToggle(false);

    // Lock observer briefly so it doesn't fight the programmatic scroll
    isScrollingRef.current = true;
    setTimeout(() => { isScrollingRef.current = false; }, 1000);

    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <nav
      className={`sm:px-16 px-6 w-full flex items-center py-5 fixed top-0 z-20 backdrop-blur-sm transition-colors duration-300 ${
        scrolled ? "bg-[#0b0013]/90" : "bg-[#0b0013]/40"
      }`}
    >
      <div className="w-full flex justify-end items-center max-w-7xl mx-auto">

        {/* Section links — desktop */}
        <ul className="list-none hidden sm:flex flex-row gap-10">
          {allSections.map(({ id, title }) => (
            <li
              key={id}
              className={`${
                active === title ? "text-white" : "text-[#aaa6c3]"
              } hover:text-white text-[18px] font-medium cursor-pointer transition-colors duration-200`}
              onClick={() => scrollTo(id, title)}
            >
              {title}
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <div className="sm:hidden flex flex-1 justify-end items-center">
          <button
            className="text-white w-7 h-7 flex flex-col justify-center gap-1.5"
            onClick={() => setToggle(!toggle)}
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 bg-white transition-all duration-300 ${toggle ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 bg-white transition-all duration-300 ${toggle ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 bg-white transition-all duration-300 ${toggle ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>

          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 bg-gradient-to-b from-[#0b0013] to-[#1a0030] absolute top-20 right-0 mx-4 my-2 min-w-[160px] z-10 rounded-xl border border-purple-800/40`}
          >
            <ul className="list-none flex justify-end items-start flex-1 flex-col gap-4">
              {allSections.map(({ id, title }) => (
                <li
                  key={id}
                  className={`font-medium cursor-pointer text-[16px] transition-colors duration-200 ${
                    active === title ? "text-white" : "text-[#aaa6c3]"
                  }`}
                  onClick={() => scrollTo(id, title)}
                >
                  {title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
