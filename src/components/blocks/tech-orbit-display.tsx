'use client';

import { memo, ReactNode } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import PurpleSun from './PurpleSun';

// ==================== OrbitingCircles ====================

type OrbitingCirclesProps = {
  className?: string;
  children: ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  angle?: number;
};

const OrbitingCircles = memo(function OrbitingCircles({
  className,
  children,
  reverse = false,
  duration = 20,
  delay = 0,
  radius = 80,
  path = true,
  angle = 0,
}: OrbitingCirclesProps) {
  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            stroke="rgba(192,132,252,0.4)"
            strokeWidth="1.5"
            strokeDasharray="6 5"
          />
        </svg>
      )}
      <div
        style={
          {
            '--duration': duration,
            '--radius': radius,
            '--delay': -delay,
            '--angle': `${angle}deg`,
          } as React.CSSProperties
        }
        className={cn(
          'absolute flex size-full animate-orbit items-center justify-center rounded-full border-none bg-transparent',
          reverse && '[animation-direction:reverse]',
          className
        )}
      >
        {children}
      </div>
    </>
  );
});

// ==================== TechOrbitDisplay ====================

type IconConfig = {
  className?: string;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  reverse?: boolean;
  angle?: number;
  component: () => ReactNode;
};

type TechOrbitDisplayProps = {
  iconsArray: IconConfig[];
  text?: string;
};

const TechOrbitDisplay = memo(function TechOrbitDisplay({
  iconsArray,
  text = '.',
}: TechOrbitDisplayProps) {
  return (
    <section className="relative flex items-center justify-center" style={{ width: 720, height: 720 }}>
      {/* Center: PurpleSun — responsive size via hidden/block classes */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        {/* mobile */}
        <PurpleSun size={100} className="block sm:hidden" />
        {/* tablet */}
        <PurpleSun size={140} className="hidden sm:block lg:hidden" />
        {/* desktop */}
        <PurpleSun size={180} className="hidden lg:block" />
      </div>

      {iconsArray.map((icon, index) => (
        <OrbitingCircles
          key={index}
          className={icon.className}
          duration={icon.duration}
          delay={icon.delay}
          radius={icon.radius}
          path={icon.path}
          reverse={icon.reverse}
          angle={icon.angle}
        >
          {icon.component()}
        </OrbitingCircles>
      ))}
    </section>
  );
});

// ==================== Build icons array from any tech group list ====================

const ORBIT_CONFIG = [
  { radius: 110, duration: 25, reverse: false },
  { radius: 185, duration: 33, reverse: true  },
  { radius: 255, duration: 42, reverse: false },
  { radius: 325, duration: 50, reverse: true  },
] as const;

export function buildOrbitIcons(
  groups: { techs: { name: string; icon: string }[] }[]
): IconConfig[] {
  return groups.flatMap((group, gi) => {
    const orbit = ORBIT_CONFIG[gi % ORBIT_CONFIG.length];
    const numIcons = group.techs.length;
    return group.techs.map((tech, ti) => ({
      component: () => (
        <div className={`flex items-center justify-center rounded-full bg-white shadow-md ${gi < 2 ? 'size-[42px] p-2' : 'size-[54px] p-2.5'}`} title={tech.name}>
          <Image
            width={gi < 2 ? 26 : 34}
            height={gi < 2 ? 26 : 34}
            src={tech.icon}
            alt={tech.name}
            className="object-contain w-full h-full"
          />
        </div>
      ),
      className: `${gi < 2 ? 'size-[42px]' : 'size-[54px]'} border-none bg-transparent`,
      radius: orbit.radius,
      duration: orbit.duration,
      delay: (orbit.duration / numIcons) * ti,
      path: ti === 0,
      reverse: orbit.reverse,
    }));
  });
}

// ==================== Icons array using project tech stack ====================

const iconClass = 'border-none bg-transparent';

const iconsArray: IconConfig[] = [
  // Orbit 1 — radius 110 (Frontend core)
  {
    component: () => <Image width={32} height={32} src="/tech/html.png" alt="HTML5" className="object-contain" />,
    className: `size-[32px] ${iconClass}`,
    duration: 22,
    delay: 0,
    radius: 110,
    path: true,
    reverse: false,
  },
  {
    component: () => <Image width={32} height={32} src="/tech/css.png" alt="CSS3" className="object-contain" />,
    className: `size-[32px] ${iconClass}`,
    duration: 22,
    delay: 7,
    radius: 110,
    path: false,
    reverse: false,
  },
  {
    component: () => <Image width={32} height={32} src="/tech/javascript.png" alt="JavaScript" className="object-contain" />,
    className: `size-[32px] ${iconClass}`,
    duration: 22,
    delay: 14,
    radius: 110,
    path: false,
    reverse: false,
  },

  // Orbit 2 — radius 180 (Framework layer)
  {
    component: () => <Image width={38} height={38} src="/tech/reactjs.png" alt="React" className="object-contain" />,
    className: `size-[38px] ${iconClass}`,
    duration: 28,
    delay: 0,
    radius: 180,
    path: true,
    reverse: true,
  },
  {
    component: () => <Image width={38} height={38} src="/tech/next.png" alt="Next.js" className="object-contain invert" />,
    className: `size-[38px] ${iconClass}`,
    duration: 28,
    delay: 7,
    radius: 180,
    path: false,
    reverse: true,
  },
  {
    component: () => <Image width={38} height={38} src="/tech/typescript.png" alt="TypeScript" className="object-contain" />,
    className: `size-[38px] ${iconClass}`,
    duration: 28,
    delay: 14,
    radius: 180,
    path: false,
    reverse: true,
  },
  {
    component: () => <Image width={38} height={38} src="/tech/tailwind.png" alt="Tailwind" className="object-contain" />,
    className: `size-[38px] ${iconClass}`,
    duration: 28,
    delay: 21,
    radius: 180,
    path: false,
    reverse: true,
  },

  // Orbit 3 — radius 255 (Backend & data)
  {
    component: () => <Image width={42} height={42} src="/tech/nodejs.png" alt="Node.js" className="object-contain" />,
    className: `size-[42px] ${iconClass}`,
    duration: 35,
    delay: 0,
    radius: 255,
    path: true,
    reverse: false,
  },
  {
    component: () => <Image width={42} height={42} src="/tech/python.png" alt="Python" className="object-contain" />,
    className: `size-[42px] ${iconClass}`,
    duration: 35,
    delay: 7,
    radius: 255,
    path: false,
    reverse: false,
  },
  {
    component: () => <Image width={42} height={42} src="/tech/mongodb.svg" alt="MongoDB" className="object-contain" />,
    className: `size-[42px] ${iconClass}`,
    duration: 35,
    delay: 14,
    radius: 255,
    path: false,
    reverse: false,
  },
  {
    component: () => <Image width={42} height={42} src="/tech/postgresql.svg" alt="PostgreSQL" className="object-contain" />,
    className: `size-[42px] ${iconClass}`,
    duration: 35,
    delay: 21,
    radius: 255,
    path: false,
    reverse: false,
  },

  // Orbit 4 — radius 330 (Tools & specialties)
  {
    component: () => <Image width={44} height={44} src="/tech/threejs.svg" alt="Three.js" className="object-contain invert" />,
    className: `size-[44px] ${iconClass}`,
    duration: 42,
    delay: 0,
    radius: 330,
    path: true,
    reverse: true,
  },
  {
    component: () => <Image width={44} height={44} src="/tech/git.png" alt="Git" className="object-contain" />,
    className: `size-[44px] ${iconClass}`,
    duration: 42,
    delay: 7,
    radius: 330,
    path: false,
    reverse: true,
  },
  {
    component: () => <Image width={44} height={44} src="/tech/rn.png" alt="React Native" className="object-contain" />,
    className: `size-[44px] ${iconClass}`,
    duration: 42,
    delay: 14,
    radius: 330,
    path: false,
    reverse: true,
  },
  {
    component: () => <Image width={44} height={44} src="/tech/graph.png" alt="GraphQL" className="object-contain" />,
    className: `size-[44px] ${iconClass}`,
    duration: 42,
    delay: 21,
    radius: 330,
    path: false,
    reverse: true,
  },
];

// ==================== Demo ====================

export function Demo() {
  return (
    <section className="flex items-center justify-center w-full min-h-screen overflow-hidden bg-background">
      <TechOrbitDisplay iconsArray={iconsArray} text="." />
    </section>
  );
}

export { TechOrbitDisplay, OrbitingCircles };
export type { IconConfig, TechOrbitDisplayProps };
