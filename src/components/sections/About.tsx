"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useAnimationFrame, wrap } from "framer-motion";

const MotionImage = motion.create(Image);
import { styles } from "../../styles";
import { services } from "../../constants";
import SectionWrapper from "../../hoc/SectionWrapper";
import { fadeIn, textVariant } from "../../utils/motion";
import Carousel3D from "../Carousel3D";

const ANGLE = 20;

const lerp = (start: number, end: number, amt: number) =>
  (1 - amt) * start + amt * end;

const remap = (value: number, oldMax: number, newMax: number) => {
  const v = ((value + oldMax) * (newMax * 2)) / (oldMax * 2) - newMax;
  return Math.min(Math.max(v, -newMax), newMax);
};

interface ServiceCardProps {
  index: number;
  title: string;
  icon: string;
  icon2?: string;
}

const ServiceCard = ({ index, title, icon, icon2 }: ServiceCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = (rect.left + rect.right) / 2;
      const cy = (rect.top + rect.bottom) / 2;
      target.current.x = remap(e.clientX - cx, rect.width / 2, ANGLE);
      target.current.y = -remap(e.clientY - cy, rect.height / 2, ANGLE);
    };
    const onLeave = () => {
      target.current = { x: 0, y: 0 };
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    const tick = () => {
      current.current.x = lerp(current.current.x, target.current.x, 0.07);
      current.current.y = lerp(current.current.y, target.current.y, 0.07);
      el.style.setProperty("--rotateY", `${current.current.x}deg`);
      el.style.setProperty("--rotateX", `${current.current.y}deg`);
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <motion.div
      ref={cardRef}
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className="w-[250px] cursor-pointer relative mb-8"
      style={
        {
          perspective: "50rem",
          "--rotateX": "0deg",
          "--rotateY": "0deg",
        } as React.CSSProperties
      }
    >
      {/* blurred shadow layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          borderRadius: "1.25rem",
          background: "rgba(168,85,247,0.35)",
          filter: "blur(1.5rem)",
          transform: "translate3d(0, 1.5rem, -2rem)",
          pointerEvents: "none",
        }}
      />

      {/* card face */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          transformStyle: "preserve-3d",
          transform: "rotateX(var(--rotateX)) rotateY(var(--rotateY))",
          borderRadius: "1.25rem",
          border: "2px solid rgb(216 180 254 / 0.5)",
          boxShadow: "0 10px 40px rgba(168,85,247,0.3)",
          background: "#000",
          padding: "1.25rem 3rem",
          minHeight: "280px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        {/* icons — float forward */}
        <div
          className="flex gap-2"
          style={{
            transform: "translateZ(2.5rem)",
            transformStyle: "preserve-3d",
          }}
        >
          <MotionImage
            animate={{ rotate: 360 }}
            transition={{ duration: 8, ease: "linear", repeat: Infinity }}
            src={icon}
            alt={title}
            width={64}
            height={64}
            className="object-contain"
          />
          {icon2 && (
            <MotionImage
              animate={{ rotate: 360 }}
              transition={{ duration: 8, ease: "linear", repeat: Infinity }}
              src={icon2}
              alt={title}
              width={64}
              height={64}
              className="object-contain"
            />
          )}
        </div>

        {/* title — floats at mid depth */}
        <h3
          className="text-white text-[20px] font-bold text-center"
          style={{ transform: "translateZ(1.5rem)" }}
        >
          {title}
        </h3>
      </div>
    </motion.div>
  );
};

const photoImages = ["/d1.png", "/d2.png", "/d3.png", "/d4.jpeg", "/d5.jpeg"];

function calculateYearsSince(dateString: string): number {
  const diff = new Date().getTime() - new Date(dateString).getTime();
  return Math.floor(diff / (1000 * 3600 * 24 * 365.25));
}

// ─── mobile horizontal marquee ────────────────────────────────────────────────
const CARD_W = 250;
const CARD_GAP = 20;
const STEP = CARD_W + CARD_GAP;
const SPEED = 35; // px/s

function ServiceMarquee() {
  const items = [...services, ...services]; // doubled for seamless loop
  const totalW = services.length * STEP;
  const x = useMotionValue(0);
  const paused = useRef(false);
  const touchStartX = useRef(0);
  const touchStartMX = useRef(0);

  useAnimationFrame((_, delta) => {
    if (paused.current) return;
    x.set(wrap(-totalW, 0, x.get() - (SPEED * delta) / 1000));
  });

  const onTouchStart = (e: React.TouchEvent) => {
    paused.current = true;
    touchStartX.current = e.touches[0].clientX;
    touchStartMX.current = x.get();
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientX - touchStartX.current;
    x.set(wrap(-totalW, 0, touchStartMX.current + delta));
  };
  const onTouchEnd = () => {
    paused.current = false;
  };

  return (
    <div
      className="-mx-6 py-6"
      style={{ overflowX: "clip" }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      <motion.div
        style={{
          x,
          display: "flex",
          gap: CARD_GAP,
          width: totalW * 2,
        }}
      >
        {items.map((service, i) => (
          <div
            key={`${service.title}-${i}`}
            style={{ flexShrink: 0, width: CARD_W }}
          >
            <ServiceCard index={i % services.length} {...service} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── section ──────────────────────────────────────────────────────────────────
const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>Introduction</p>
        <h2 className={`${styles.sectionHeadText} text-center`}>Overview</h2>
      </motion.div>

      <div className="flex flex-wrap mt-5 sm:flex-col justify-center items-center">
        <div className="w-full -mx-6 sm:mx-0">
          <Carousel3D images={photoImages} />
        </div>

        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="mt-4 text-gray-200 text-[17px] max-w-3xl leading-[30px] text-left"
        >
          Hi, I&apos;m Diego.{" "}
          <motion.span
            animate={{ rotate: [0, 25, -15, 25, -10, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0, ease: "easeInOut" }}
            style={{ display: "inline-block", transformOrigin: "70% 80%", fontSize: "1.4em" }}
          >
            👋
          </motion.span>
          <br /><br />
          My journey into technology started back in 2009 when I was just 14 years old, assembling my very first Windows XP machine from spare parts. By 15, just for fun, I built and launched my very first webpage. It was a time when we used jQuery to bring things to life on the screen and handled the database with PHP.
          <br /><br />
          I absolutely loved making things work, and watching how technology has evolved since then has been incredible.
          <br /><br />
          That childhood passion became my career. Since 2018, I&apos;ve been shipping applications professionally, turning creativity into amazing experiences. For me, the web is art.
          <br /><br />
          Welcome to my space.
          <br /><br />
          <span className="text-[#aaa6c3]">Languages: </span>
          <span className="text-white">Portuguese · Spanish · English · French · Italian</span>
        </motion.p>
      </div>

      {/* Mobile — horizontal scrolling strip */}
      <div className="mt-16 sm:hidden">
        <ServiceMarquee />
      </div>

      {/* Desktop — original grid */}
      <div className="hidden sm:flex mt-20 flex-wrap gap-10 justify-evenly">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>

    </>
  );
};

export default SectionWrapper(About, "about");
