# Diego Braga Portfolio 2026

Personal portfolio — immersive React/Next.js app with 3D intro, scroll-driven content, and heavy animations.

## Tech Stack

- **Framework:** Next.js 16.2.6 (App Router), React 19.2.4, TypeScript 5
- **Styling:** Tailwind CSS v4, `globals.css` uses `@theme inline` (v4 syntax)
- **Animations:** Framer Motion
- **3D:** React Three Fiber (`@react-three/fiber` + `@react-three/drei`), Three.js
- **UI components:** shadcn/ui (registry: `base-nova` style, aliases in `components.json`)
- **Particles:** tsparticles (@tsparticles/react + @tsparticles/slim)
- **Carousel:** embla-carousel-react
- **Icons:** lucide-react, react-icons
- **Fonts:** Geist Sans + Geist Mono (Next.js font API)
- **Package manager:** pnpm
- **CI/CD:** Vercel (see `vercel.json`)

## Architecture

### File layout
```
src/
  app/
    page.tsx              # Thin wrapper → <Home />
    layout.tsx            # Root layout, AudioProvider, MusicToggle
    globals.css           # Tailwind v4 theme + custom keyframes + gradient utils
  components/
    Home.tsx              # 3-phase intro orchestrator (see below)
    MainContent.tsx       # About → Experience → Works sections
    HeroPage.tsx          # Hero video section (full-screen)
    ParallaxSceneSection.tsx  # Bottom parallax scene
    Hero.tsx, TwinklingStars.tsx, Carousel3D.tsx  # Legacy/reuseable
    TerminalModal.tsx, MusicToggle.tsx            # UI controls
    sections/
      Navbar.tsx          # Fixed nav
      About.tsx, Experience.tsx, Works.tsx, Contact.tsx, BentoGrid.tsx
      Tech.tsx            # Tech stack marquee (desktop) / grouped rows (mobile)
    sections/
      Navbar.tsx          # Fixed nav
      About.tsx, Experience.tsx, Works.tsx, Contact.tsx, BentoGrid.tsx
      Tech.tsx            # Tech stack marquee (desktop) / grouped rows (mobile)
    canvas/
      LaptopCanvas.tsx    # MacBook 3D intro scene (desktop)
      IPhoneCanvas.tsx    # iPhone 3D intro scene (mobile)
      EarthCanvas.tsx     # Globe 3D
      StarsCanvas.tsx     # Star field background
      StarField.tsx
    blocks/
      tech-orbit-display.tsx  # Orbiting tech stack icons, mouse-influenced rotation
      PurpleSun.tsx           # Glowing center element for orbit
    ui/
      sparkles.tsx, dialog.tsx, badge.tsx, button.tsx, carousel.tsx  # shadcn/ui
  context/
    AudioContext.tsx      # Global background music context + `useAudio` hook
  constants/
    index.ts            # Portfolio data: jobs, techs, projects, education
  hooks/
    useIsMobile.ts      # Responsive breakpoint hook
  utils/
    motion.ts           # Framer Motion reusable variants
    lib/
      utils.ts          # cn() helper
```

### Intro Flow (`Home.tsx`)
Three phases managed by local state:
1. **intro** — 3D canvas (MacBook on desktop, iPhone on mobile). Typewriter overlay with click-to-proceed. Finger tap/click plays `transition.mp3`.
2. **static** — Full-screen `static_tv.mp4` video transition
3. **portfolio** — Scrollable content: HeroPage → MainContent (About, Experience, Works) → ParallaxSceneSection

### Key Conventions

- **3D canvas components** are imported with `next/dynamic` `ssr: false` (see `LaptopCanvas`, `IPhoneCanvas`)
- **Scroll container** is a `div` with `overflow-y-auto`, not the native `<body>` scroll — section scroll offsets must be read from the `portfolio-scroll` CustomEvent
- **Audio** is context-managed, background track starts on static phase end
- **Images** come from `public/` and external GitHub raw URLs (see `next.config.ts` `images.remotePatterns`)
- **Tech stack data** is in `constants/index.ts` (`technologiesByRole`)
- **shadcn/ui** components use `@/components/ui/*` aliases; helpers are in `@/lib/utils`
- **Custom CSS classes** for gradients: `.violet-gradient`, `.green-pink-gradient`, `.orange-text-gradient`, etc. — defined in `globals.css`

### Dev commands
```bash
pnpm dev     # starts Next.js dev server
pnpm build   # production build
pnpm lint    # ESLint via next/core-web-vitals
```

### Next.js specific notes
- `next.config.ts` does NOT have `output: 'export'` — this is a server-rendered Next.js app
- Tailwind v4 uses `@import "tailwindcss"` and `@theme inline` — no `tailwind.config.ts`
- `tsconfig.tsbuildinfo` checked in (unintentional, or for speed)

## Design System

- **Dark theme** (`bg-[#050816]`, `bg-black`) — space/indigo aesthetic
- **Primary accent:** `#804dee` (violet/purple)
- **Section headings:** White gradient text with purple sparkles + glowing line underline (see `SectionHeading.tsx`)
- **Typography:** Geist Sans for body, Geist Mono for monospace
- **Animations:** Framer Motion spring-based, damped. Orbit animations via CSS keyframes for perf

## Graphify

Query the codebase graph for deep questions (cross-file deps, component usage, etc.):
```
/graphify query "how does the intro flow work?"
```
Interactive graph: `graphify-out/graph.html`
