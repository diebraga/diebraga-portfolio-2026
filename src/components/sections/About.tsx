"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

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
  const target  = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafId   = useRef<number>(0);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = (rect.left + rect.right) / 2;
      const cy = (rect.top + rect.bottom) / 2;
      target.current.x =  remap(e.clientX - cx, rect.width  / 2, ANGLE);
      target.current.y = -remap(e.clientY - cy, rect.height / 2, ANGLE);
    };
    const onLeave = () => { target.current = { x: 0, y: 0 }; };

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
      className="w-[250px] cursor-pointer relative"
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
          style={{ transform: "translateZ(2.5rem)", transformStyle: "preserve-3d" }}
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

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>Introduction</p>
        <h2 className={`${styles.sectionHeadText} text-center`}>Overview</h2>
      </motion.div>

      <div className="flex flex-wrap mt-5 sm:flex-col justify-center items-center">
        <div className="w-full">
          <Carousel3D images={photoImages} />
        </div>

        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="mt-4 text-[#aaa6c3] text-[17px] max-w-3xl leading-[30px] text-center mx-auto"
        >
          Hi, my name is Diego Braga, and I&apos;m a passionate software
          developer based in Ireland with expertise in TypeScript, JavaScript,
          React, Next.js, and Node.js. I have over{" "}
          {calculateYearsSince("2019-10-01")} years of industry experience
          building amazing experiences ✨.
        </motion.p>
      </div>

      <div className="mt-20 flex flex-wrap gap-10 justify-evenly sm:justify-center">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
