"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { navLinks } from "../../constants";

// All section ids in order (hero first)
const allSections = [
  { id: "hero", title: "Home" },
  ...navLinks.map((n) => ({ id: n.id, title: n.title })),
];

const Navbar = () => {
  const [active,    setActive]    = useState("Home");
  const [toggle,    setToggle]    = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const isScrollingRef  = useRef(false);
  const prevScrollTop   = useRef(0);
  const intentionalHide = useRef(false);
  const isNearBottom    = useRef(false);

  // Collapse near bottom, restore on scroll-up or back to top
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const { scrollTop } = (e as CustomEvent).detail as { scrollTop: number };
      const scroller = document.querySelector(".overflow-y-auto") as HTMLElement | null;

      setScrolled(scrollTop > 100);

      if (scroller) {
        const nearBottom = scrollTop + scroller.clientHeight >= scroller.scrollHeight - 300;
        const scrollingUp = scrollTop < prevScrollTop.current - 5;

        isNearBottom.current = nearBottom;

        if (nearBottom)                     setCollapsed(true);
        if (scrollingUp || scrollTop < 120) {
          intentionalHide.current = false;
          isNearBottom.current = false;
          setCollapsed(false);
        }
      }

      prevScrollTop.current = scrollTop;
    };

    window.addEventListener("portfolio-scroll", handleScroll);
    return () => window.removeEventListener("portfolio-scroll", handleScroll);
  }, []);

  // Show when hovering top 80px, re-hide when moving away if still near bottom
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (e.clientY < 80) {
        intentionalHide.current = false;
        setCollapsed(false);
      } else if (isNearBottom.current) {
        setCollapsed(true);
      }
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
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

    isScrollingRef.current = true;
    setTimeout(() => { isScrollingRef.current = false; }, 1000);

    // Contact → collapse immediately and scroll to bottom
    if (id === "contact") {
      intentionalHide.current = true;
      setCollapsed(true);
      const scroller = document.querySelector(".overflow-y-auto") as HTMLElement;
      if (scroller) {
        scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
      }
      return;
    }

    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <nav
      className={`sm:px-16 px-6 w-full flex items-center py-5 fixed top-0 z-20 backdrop-blur-sm transition-colors duration-300 ${
        scrolled ? "bg-black/90" : "bg-transparent"
      }`}
      style={{
        transform: collapsed ? "translateY(-110%)" : "translateY(0)",
        transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s",
      }}
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
            } p-6 bg-gradient-to-b from-black to-[#0a0015] absolute top-20 right-0 mx-4 my-2 min-w-[160px] z-10 rounded-xl border border-purple-800/40`}
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
