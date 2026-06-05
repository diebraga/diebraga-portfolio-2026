"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

function useTilt(active: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    const unify = (e: MouseEvent | TouchEvent) =>
      "changedTouches" in e ? e.changedTouches[0] : e;

    const state: { rect?: DOMRect } = {};

    const onEnter = () => {
      el.style.transition = "transform 150ms ease-out";
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if (!state.rect) state.rect = el.getBoundingClientRect();
      const u = unify(e);
      el.style.setProperty("--px", ((u.clientX - state.rect.left) / state.rect.width).toFixed(2));
      el.style.setProperty("--py", ((u.clientY - state.rect.top) / state.rect.height).toFixed(2));
    };
    const onLeave = () => {
      el.style.setProperty("--px", "0.5");
      el.style.setProperty("--py", "0.5");
      el.style.transition = "transform 150ms ease-in";
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mousemove", onMove as EventListener);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("touchstart", onEnter);
    el.addEventListener("touchmove", onMove as EventListener, { passive: false });
    el.addEventListener("touchend", onLeave);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mousemove", onMove as EventListener);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("touchstart", onEnter);
      el.removeEventListener("touchmove", onMove as EventListener);
      el.removeEventListener("touchend", onLeave);
    };
  }, [active]);

  return ref;
}

interface SlideProps {
  image: string;
  offset: number;
}

function Slide({ image, offset }: SlideProps) {
  const active = offset === 0;
  const dir = offset === 0 ? 0 : offset > 0 ? 1 : -1;
  const tiltRef = useTilt(active);

  return (
    <div
      data-active={active || undefined}
      style={
        {
          gridArea: "1 / -1",
          position: "relative",
          zIndex: active ? 2 : 1,
          pointerEvents: active ? "auto" : "none",
          "--offset": offset,
          "--dir": dir,
          "--px": 0.5,
          "--py": 0.5,
        } as React.CSSProperties
      }
    >
      <div
        ref={tiltRef}
        className={active ? "slideContent slideContent--active" : "slideContent"}
        style={{
          backgroundImage: `url('${image}')`,
        }}
      />
    </div>
  );
}

interface Carousel3DProps {
  images: string[];
  autoPlayMs?: number;
  dragThreshold?: number;
}

export default function Carousel3D({
  images,
  autoPlayMs = 4000,
  dragThreshold = 50,
}: Carousel3DProps) {
  const [index, setIndex] = useState(0);
  const hovered = useRef(false);
  const count = images.length;

  const mod = (n: number, m: number) => ((n % m) + m) % m;
  const prev = useCallback(() => setIndex((i) => mod(i - 1, count)), [count]);
  const next = useCallback(() => setIndex((i) => mod(i + 1, count)), [count]);

  useEffect(() => {
    const id = setInterval(() => {
      if (!hovered.current) next();
    }, autoPlayMs);
    return () => clearInterval(id);
  }, [next, autoPlayMs]);

  // Drag / swipe
  const dragStart = useRef<number | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    dragStart.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const delta = dragStart.current - e.clientX;
    if (delta > dragThreshold) next();
    else if (delta < -dragThreshold) prev();
    dragStart.current = null;
  };

  // Compute offsets: tripled array so wrapping is seamless
  const tripled = [...images, ...images, ...images];

  return (
    <>
      <style>{`
        .slideContent {
          width: 250px;
          height: 300px;
          background-size: cover;
          background-position: center;
          border-radius: 15px;
          opacity: 0.55;
          filter: grayscale(100%) brightness(0.75);
          box-shadow: 0 0 0 1px #7c3aed55, 0 0 12px 2px rgba(124,58,237,0.25);
          transform-style: preserve-3d;
          transition: transform 0.5s ease-in-out, opacity 0.5s, filter 0.5s, box-shadow 0.5s;
          transform: perspective(1000px)
            translateX(calc(100% * var(--offset)))
            rotateY(calc(-45deg * var(--dir)));
        }
        .slideContent--active {
          opacity: 1;
          filter: grayscale(100%) brightness(1.05);
          box-shadow: 0 0 0 2px #a855f7,
            0 0 25px 6px rgba(168,85,247,0.55),
            0 0 60px 10px rgba(168,85,247,0.2);
          transform: perspective(1000px) translateX(calc(100% * var(--offset)));
        }
        .slideContent--active:hover {
          transition: none;
          transform: perspective(1000px)
            rotateY(calc((var(--px, 0.5) - 0.5) * 45deg))
            rotateX(calc((var(--py, 0.5) - 0.5) * -45deg));
        }
      `}</style>

      <section
        onMouseEnter={() => { hovered.current = true; }}
        onMouseLeave={() => { hovered.current = false; }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { dragStart.current = null; }}
        style={{
          minHeight: 500,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          width: "100%",
          position: "relative",
          cursor: "grab",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        <button
          onClick={prev}
          style={{
            position: "absolute", left: "5%", top: "40%",
            transform: "translateY(-50%)", zIndex: 10,
            background: "transparent", border: "none",
            color: "white", fontSize: "2rem", cursor: "pointer", opacity: 0.8,
          }}
          aria-label="Previous"
        >
          <IoChevronBack />
        </button>

        <div style={{ display: "grid" }}>
          {tripled.map((img, i) => {
            const offset = count + (index - i);
            return <Slide key={i} image={img} offset={offset} />;
          })}
        </div>

        <button
          onClick={next}
          style={{
            position: "absolute", right: "5%", top: "40%",
            transform: "translateY(-50%)", zIndex: 10,
            background: "transparent", border: "none",
            color: "white", fontSize: "2rem", cursor: "pointer", opacity: 0.8,
          }}
          aria-label="Next"
        >
          <IoChevronForward />
        </button>

        {/* Dots */}
        <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: 8, height: 8, borderRadius: "50%",
                border: "none", cursor: "pointer", padding: 0,
                background: i === index ? "#a855f7" : "rgba(255,255,255,0.3)",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>
      </section>
    </>
  );
}
