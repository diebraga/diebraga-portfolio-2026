"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { navLinks } from "../../constants";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sm:px-16 px-6 w-full flex items-center py-5 fixed top-0 z-20 ${
        scrolled ? "bg-[#0b0013]/90 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        {/* Hero / home link on the left */}
        <Link
          href="/"
          className="text-[#aaa6c3] hover:text-white text-[18px] font-medium transition-colors"
          onClick={() => setActive("")}
        >
          ← Hero
        </Link>

        {/* Section links on the right — desktop */}
        <ul className="list-none hidden sm:flex flex-row gap-10">
          {navLinks.map((nav) => (
            <li
              key={nav.id}
              className={`${
                active === nav.title ? "text-white" : "text-[#aaa6c3]"
              } hover:text-white text-[18px] font-medium cursor-pointer`}
              onClick={() => setActive(nav.title)}
            >
              <a href={`#${nav.id}`}>{nav.title}</a>
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
            <span className={`block h-0.5 bg-white transition-all ${toggle ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 bg-white transition-all ${toggle ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 bg-white transition-all ${toggle ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>

          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 bg-gradient-to-b from-[#0b0013] to-[#1a0030] absolute top-20 right-0 mx-4 my-2 min-w-[160px] z-10 rounded-xl border border-purple-800/40`}
          >
            <ul className="list-none flex justify-end items-start flex-1 flex-col gap-4">
              {/* Hero back-link in mobile menu */}
              <li className="font-medium text-[16px] text-[#aaa6c3]">
                <Link href="/" onClick={() => setToggle(false)}>
                  ← Hero
                </Link>
              </li>
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`font-medium cursor-pointer text-[16px] ${
                    active === nav.title ? "text-white" : "text-[#aaa6c3]"
                  }`}
                  onClick={() => {
                    setToggle(false);
                    setActive(nav.title);
                  }}
                >
                  <a href={`#${nav.id}`}>{nav.title}</a>
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
