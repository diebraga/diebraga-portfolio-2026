"use client";

import { useState, useRef, useEffect, useCallback, useMemo, useLayoutEffect } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

function useTilt(active: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    const unify = (e: MouseEvent | TouchEvent) =>
      "changedTouches" in e ? e.changedTouches[0] : e;
    const state: { rect?: DOMRect } = {};

    const onEnter = () => { el.style.transition = "transform 150ms ease-out"; };
    const onMove  = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if (!state.rect) state.rect = el.getBoundingClientRect();
      const u = unify(e);
      el.style.setProperty("--px", ((u.clientX - state.rect.left) / state.rect.width).toFixed(2));
      el.style.setProperty("--py", ((u.clientY - state.rect.top)  / state.rect.height).toFixed(2));
    };
    const onLeave = () => {
      el.style.setProperty("--px", "0.5");
      el.style.setProperty("--py", "0.5");
      el.style.transition = "transform 150ms ease-in";
    };

    el.addEventListener("mouseenter",  onEnter);
    el.addEventListener("mousemove",   onMove as EventListener);
    el.addEventListener("mouseleave",  onLeave);
    el.addEventListener("touchstart",  onEnter);
    el.addEventListener("touchmove",   onMove as EventListener, { passive: false });
    el.addEventListener("touchend",    onLeave);

    return () => {
      el.removeEventListener("mouseenter",  onEnter);
      el.removeEventListener("mousemove",   onMove as EventListener);
      el.removeEventListener("mouseleave",  onLeave);
      el.removeEventListener("touchstart",  onEnter);
      el.removeEventListener("touchmove",   onMove as EventListener);
      el.removeEventListener("touchend",    onLeave);
    };
  }, [active]);

  return ref;
}

// Mounts a video and triggers play() programmatically — reliable across browsers
function ActiveVideo({ src, style }: { src: string; style: React.CSSProperties }) {
  const ref = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.currentTime = 0;
    el.play().catch(() => {});
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      style={style}
    />
  );
}

interface SlideProps { image: string; video?: string; offset: number; noTransition: boolean; }

function Slide({ image, video, offset, noTransition }: SlideProps) {
  const active  = offset === 0;
  const dir     = offset === 0 ? 0 : offset > 0 ? 1 : -1;
  const tiltRef = useTilt(active);

  return (
    <div
      data-active={active || undefined}
      style={{
        gridArea: "1 / -1",
        position: "relative",
        zIndex: active ? 2 : 1,
        pointerEvents: active ? "auto" : "none",
        ["--offset" as string]: offset,
        ["--dir"   as string]: dir,
        ["--px"    as string]: 0.5,
        ["--py"    as string]: 0.5,
      } as React.CSSProperties}
    >
      {/* image — grayscale filter here only */}
      <div
        ref={tiltRef}
        className={active ? "slideContent slideContent--active" : "slideContent"}
        style={{
          backgroundImage: `url('${image}')`,
          ...(noTransition ? { transition: "none" } : {}),
        }}
      />

      {/* AI video — outside the filter, plays in full colour when active */}
      {active && video && (
        <ActiveVideo
          src={video}
          style={{
            position: "absolute",
            inset: 0,
            width: 250,
            height: 300,
            objectFit: "cover",
            borderRadius: 15,
            zIndex: 3,
            transform: `perspective(1000px) translateX(0px)`,
          }}
        />
      )}
    </div>
  );
}

interface Carousel3DProps {
  images: string[];
  videos?: string[];
  autoPlayMs?: number;
  dragThreshold?: number;
}

export default function Carousel3D({
  images,
  videos,
  autoPlayMs = 4000,
  dragThreshold = 50,
}: Carousel3DProps) {
  const count = images.length;

  // Start in the middle third so we can go either direction infinitely
  const [index,        setIndex]        = useState(count);
  const [noTransition, setNoTransition] = useState(false);
  const hovered   = useRef(false);
  const normaliseT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const prev = useCallback(() => setIndex(i => i - 1), []);
  const next = useCallback(() => setIndex(i => i + 1), []);

  // After each move, silently reset to middle third once animation finishes
  useEffect(() => {
    if (normaliseT.current) clearTimeout(normaliseT.current);
    normaliseT.current = setTimeout(() => {
      setIndex(i => {
        const normalised = i < count ? i + count : i >= count * 2 ? i - count : i;
        if (normalised !== i) {
          setNoTransition(true);
          requestAnimationFrame(() =>
            requestAnimationFrame(() => setNoTransition(false))
          );
        }
        return normalised;
      });
    }, 550);
    return () => clearTimeout(normaliseT.current);
  }, [index, count]);

  // Auto-play
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

  // Tripled array — image at position i = images[i % count]
  const tripled = useMemo(
    () => Array.from({ length: count * 3 }, (_, i) => images[i % count]),
    [images, count]
  );

  // Active dot (index is always in [count, 2*count-1] after normalisation)
  const dotIdx = index - count;

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
          transform-style: preserve-3d;
          transition: transform 0.5s ease-in-out, opacity 0.5s, filter 0.5s, box-shadow 0.5s;
          transform: perspective(1000px)
            translateX(calc(100% * var(--offset)))
            rotateY(calc(-45deg * var(--dir)));
        }
        .slideContent--active {
          opacity: 1;
          filter: grayscale(100%) brightness(1.05);
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
        <button onClick={prev} style={{ position: "absolute", left: "5%", top: "40%", transform: "translateY(-50%)", zIndex: 10, background: "transparent", border: "none", color: "white", fontSize: "2rem", cursor: "pointer", opacity: 0.8 }} aria-label="Previous">
          <IoChevronBack />
        </button>

        <div style={{ display: "grid" }}>
          {tripled.map((img, i) => {
            const offset = index - i;
            const vidSrc = videos ? videos[i % count] : undefined;
            return <Slide key={i} image={img} video={vidSrc} offset={offset} noTransition={noTransition} />;
          })}
        </div>

        <button onClick={next} style={{ position: "absolute", right: "5%", top: "40%", transform: "translateY(-50%)", zIndex: 10, background: "transparent", border: "none", color: "white", fontSize: "2rem", cursor: "pointer", opacity: 0.8 }} aria-label="Next">
          <IoChevronForward />
        </button>

        {/* Dots */}
        <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(count + i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: 8, height: 8, borderRadius: "50%",
                border: "none", cursor: "pointer", padding: 0,
                background: i === dotIdx ? "#a855f7" : "rgba(255,255,255,0.3)",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>
      </section>
    </>
  );
}
