"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { styles } from "../../styles";
import { textVariant } from "../../utils/motion";
import { projects } from "../../constants";
import SectionWrapper from "../../hoc/SectionWrapper";

// ─── constants ────────────────────────────────────────────────────────────────
const CARD_W   = 300;   // px — card width
const CARD_H   = 380;   // px — card height
const GAP      = 20;    // px — gap between cards
const STEP     = CARD_W + GAP;
const BASE_SPD = 55;    // px / s  — auto-scroll speed

// split 10 projects into 2 rows
const ROW_A = projects.slice(0, 5);
const ROW_B = projects.slice(5);
const ROW_A_W = ROW_A.length * STEP;
const ROW_B_W = ROW_B.length * STEP;

// ─── project card ─────────────────────────────────────────────────────────────
function ProjectCard({ item }: { item: (typeof projects)[0] }) {
  return (
    <div
      className="relative flex-shrink-0 rounded-2xl overflow-hidden border border-purple-900/30 bg-black/70 backdrop-blur-sm group"
      style={{ width: CARD_W, height: CARD_H }}
    >
      {/* image */}
      <div className="h-[55%] overflow-hidden relative">
        <Image
          src={item.header}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* body */}
      <div className="p-4 flex flex-col gap-2 h-[45%]">
        <h3 className="text-white font-bold text-sm leading-snug line-clamp-1">
          {item.title}
        </h3>
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 flex-1">
          {item.description}
        </p>

        {/* tags */}
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full border border-purple-800/50 text-purple-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* links */}
        <div className="flex items-center gap-2 pt-1">
          <a
            href={item.source_code_link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/20 hover:border-white/40 transition-all min-h-[36px]"
          >
            <FaGithub size={14} />
            GitHub
          </a>
          {item.live && (
            <a
              href={item.live}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white bg-purple-600/70 hover:bg-purple-600 active:bg-purple-700 border border-purple-500/50 hover:border-purple-400 transition-all min-h-[36px]"
            >
              <span>Live</span>
              <span>↗</span>
            </a>
          )}
        </div>
      </div>

      {/* hover glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ring-1 ring-purple-500/40 shadow-[inset_0_0_30px_rgba(139,92,246,0.08)]" />
    </div>
  );
}

// ─── scrolling row ────────────────────────────────────────────────────────────
function ScrollRow({
  items,
  rowWidth,
  direction,
  tiltDeg,
}: {
  items: (typeof projects);
  rowWidth: number;
  direction: 1 | -1;
  tiltDeg: ReturnType<typeof useSpring>;
}) {
  const x          = useMotionValue(direction === -1 ? 0 : -rowWidth);
  const dirRef     = useRef(direction);
  const paused     = useRef(false);
  const touchStartX   = useRef(0);
  const touchStartMX  = useRef(0);

  useAnimationFrame((_, delta) => {
    if (paused.current) return;
    const move = dirRef.current * BASE_SPD * (delta / 1000);
    x.set(wrap(-rowWidth, 0, x.get() + move));
  });

  const rotateY = useTransform(tiltDeg, (v) => v * direction * -0.4);

  // ── touch handlers (mobile) ──────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    paused.current    = true;
    touchStartX.current  = e.touches[0].clientX;
    touchStartMX.current = x.get();
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientX - touchStartX.current;
    x.set(wrap(-rowWidth, 0, touchStartMX.current + delta));
  };
  const onTouchEnd = () => {
    paused.current = false;
  };

  return (
    <div
      className="overflow-hidden"
      style={{ perspective: "1200px" }}
      // desktop: hover to pause
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
      // mobile: drag to scrub, release to resume
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      <motion.div
        style={{
          x,
          rotateY,
          display: "flex",
          gap: GAP,
          width: rowWidth * 2,
          willChange: "transform",
        }}
      >
        {[...items, ...items].map((item, i) => (
          <ProjectCard key={`${item.title}-${i}`} item={item} />
        ))}
      </motion.div>
    </div>
  );
}

// ─── main section ─────────────────────────────────────────────────────────────
function ProjectsMarquee() {
  // feed page scroll into a MotionValue so useVelocity can track it
  const scrollY        = useMotionValue(0);
  const rawVelocity    = useVelocity(scrollY);

  // smooth + dampen the velocity  →  tilt angle in degrees
  const tiltDeg = useSpring(
    useTransform(rawVelocity, [-3000, 3000], [-12, 12], { clamp: true }),
    { damping: 40, stiffness: 200 }
  );

  // listen to portfolio-scroll custom event
  useEffect(() => {
    const handler = (e: Event) =>
      scrollY.set((e as CustomEvent).detail.scrollTop as number);
    window.addEventListener("portfolio-scroll", handler as EventListener);
    return () =>
      window.removeEventListener("portfolio-scroll", handler as EventListener);
  }, [scrollY]);

  return (
    <div className="flex flex-col gap-6 mt-10 -mx-6 sm:-mx-16">
      <ScrollRow
        items={ROW_A}
        rowWidth={ROW_A_W}
        direction={-1}
        tiltDeg={tiltDeg}
      />
      <ScrollRow
        items={ROW_B}
        rowWidth={ROW_B_W}
        direction={1}
        tiltDeg={tiltDeg}
      />
    </div>
  );
}

// ─── section ──────────────────────────────────────────────────────────────────
const Works = () => (
  <>
    <motion.div variants={textVariant()}>
      <p className={styles.sectionSubText}>My work</p>
      <h2 className={styles.sectionHeadText}>Personal Projects</h2>
    </motion.div>

    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="mt-3 text-[#aaa6c3] text-[17px] max-w-3xl leading-[30px]"
    >
      My projects highlight my technical skills, creativity, and passion for
      technology — from 3D experiences and Web3 to ML and real-time apps. ⚛️
    </motion.p>

    <ProjectsMarquee />
  </>
);

export default SectionWrapper(Works, "projects");
