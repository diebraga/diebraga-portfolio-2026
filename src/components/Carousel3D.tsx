"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

// ── tilt hook (exact port from source) ───────────────────────────────────────
function useTilt(active: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    const unify = (e: MouseEvent | TouchEvent) =>
      "changedTouches" in e ? e.changedTouches[0] : e;

    let rect: DOMRect | undefined;

    const onEnter = () => {
      el.style.transition = "transform 150ms ease-out";
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if (!rect) rect = el.getBoundingClientRect();
      const u = unify(e);
      const px = ((u.clientX - rect.left) / rect.width).toFixed(2);
      const py = ((u.clientY - rect.top) / rect.height).toFixed(2);
      el.style.setProperty("--px", px);
      el.style.setProperty("--py", py);
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

// ── Slide ─────────────────────────────────────────────────────────────────────
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
      style={{
        gridArea: "1 / -1",
        position: "relative",
        zIndex: active ? 2 : 1,
        pointerEvents: active ? "auto" : "none",
        // CSS custom props for tilt
        ["--offset" as string]: offset,
        ["--dir" as string]: dir,
        ["--px" as string]: 0.5,
        ["--py" as string]: 0.5,
      }}
    >
      {/* Active card tilt wrapper */}
      <div
        ref={active ? tiltRef : undefined}
        style={{
          width: 250,
          height: 300,
          backgroundImage: `url('${image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 15,
          opacity: active ? 1 : 0.55,
          transition: "transform 0.7s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.5s ease, box-shadow 0.5s ease, filter 0.5s ease",
          transformStyle: "preserve-3d",
          willChange: "transform",
          transform: active
            ? "perspective(1000px) translateX(calc(100% * var(--offset)))"
            : `perspective(1000px) translateX(calc(100% * ${offset})) rotateY(calc(-45deg * ${dir}))`,
          // B&W — active card slightly more vivid, side cards full grayscale
          filter: active
            ? "grayscale(100%) brightness(1.05)"
            : "grayscale(100%) brightness(0.75)",
          // Purple glow — stronger on active
          boxShadow: active
            ? "0 0 0 2px #a855f7, 0 0 25px 6px rgba(168,85,247,0.55), 0 0 60px 10px rgba(168,85,247,0.2)"
            : "0 0 0 1px #7c3aed55, 0 0 12px 2px rgba(124,58,237,0.25)",
        }}
        className={active ? "slide-active" : ""}
      />
    </div>
  );
}

// ── Carousel ──────────────────────────────────────────────────────────────────
interface Carousel3DProps {
  images: string[];
  autoPlayMs?: number;   // auto-advance interval, default 4000ms
  dragThreshold?: number; // px needed to trigger slide, default 50
}

export default function Carousel3D({
  images,
  autoPlayMs = 4000,
  dragThreshold = 50,
}: Carousel3DProps) {
  // Unbounded index — never wraps, so slides always move in the same direction
  const [index, setIndex] = useState(0);
  const hovered = useRef(false);

  const prev = useCallback(() => setIndex((i) => i - 1), []);
  const next = useCallback(() => setIndex((i) => i + 1), []);

  // Positive modulo helper
  const mod = (n: number, m: number) => ((n % m) + m) % m;

  // ── Auto-play ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      if (!hovered.current) next();
    }, autoPlayMs);
    return () => clearInterval(id);
  }, [next, autoPlayMs]);

  // ── Drag-to-slide ──────────────────────────────────────────────────────────
  const dragStart = useRef<number | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
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
  const onPointerCancel = () => { dragStart.current = null; };

  return (
    <>
      <style>{`
        .slide-active:hover {
          transition: opacity 0.5s ease, box-shadow 0.5s ease, filter 0.5s ease !important;
          transform: perspective(1000px)
            rotateY(calc((var(--px, 0.5) - 0.5) * 45deg))
            rotateX(calc((var(--py, 0.5) - 0.5) * -45deg)) !important;
        }
      `}</style>

      <section
        onMouseEnter={() => { hovered.current = true; }}
        onMouseLeave={() => { hovered.current = false; }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        style={{
          minHeight: 400,
          display: "flex",
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
        {/* Prev button */}
        <button
          onClick={prev}
          style={{
            position: "absolute",
            left: "5%",
            zIndex: 10,
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "2rem",
            cursor: "pointer",
            opacity: 0.8,
            top: "50%",
            transform: "translateY(-50%)",
          }}
          aria-label="Previous"
        >
          <IoChevronBack />
        </button>

        {/* Slides grid — 5 visible slots: -2, -1, 0, +1, +2 */}
        <div style={{ display: "grid", placeItems: "center" }}>
          {[-2, -1, 0, 1, 2].map((offset) => {
            const imgIndex = mod(index + offset, images.length);
            return <Slide key={offset} image={images[imgIndex]} offset={offset} />;
          })}
        </div>

        {/* Next button */}
        <button
          onClick={next}
          style={{
            position: "absolute",
            right: "5%",
            zIndex: 10,
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "2rem",
            cursor: "pointer",
            opacity: 0.8,
            top: "50%",
            transform: "translateY(-50%)",
          }}
          aria-label="Next"
        >
          <IoChevronForward />
        </button>
      </section>
    </>
  );
}
