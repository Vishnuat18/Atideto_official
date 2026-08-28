import { memo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { interpolate, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Service } from './services-data';

const line = {
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  fill: 'none',
} as const;

const dot = { fill: 'currentColor', stroke: 'none' } as const;

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 240 170" fill="none" role="img" aria-hidden="true">
      {children}
    </svg>
  );
}

type ArtProps = { active: boolean; index: number };

const loop = (duration: number, reduce: boolean) =>
  ({ duration, ease: 'easeInOut', repeat: reduce ? 0 : Infinity } as const);

const scaleIn = (active: boolean, reduce: boolean) =>
  active
    ? reduce
      ? { opacity: 1 }
      : { scale: 1, opacity: 1 }
    : reduce
      ? { opacity: 0.5 }
      : { scale: 0.92, opacity: 0.4 };

function ServiceArt({ active, index }: ArtProps) {
  const reduce = useReducedMotion();
  switch (index) {
    case 0:
      return (
        <Frame>
          <rect x={20} y={28} width={46} height={28} rx={6} {...line} opacity={0.5} />
          <rect x={20} y={70} width={46} height={28} rx={6} {...line} opacity={0.35} />
          <rect x={20} y={112} width={46} height={28} rx={6} {...line} opacity={0.55} />
          <path d="M66 42h30M66 84h30M66 126h30" {...line} strokeDasharray="3 5" opacity={0.5} />
          <rect x={104} y={38} width={112} height={92} rx={12} {...line} opacity={0.85} />
          <motion.g
            animate={active ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.55 }}
            transition={loop(2.4, reduce)}
          >
            <circle cx={96} cy={42} r={4} {...dot} />
            <circle cx={96} cy={84} r={4} {...dot} opacity={0.7} />
            <circle cx={96} cy={126} r={4} {...dot} opacity={0.85} />
          </motion.g>
          <motion.g
            initial={reduce ? false : { opacity: 0.3, scale: 0.94 }}
            animate={scaleIn(active, reduce)}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ transformOrigin: '160px 84px' }}
          >
            <rect x={118} y={52} width={84} height={12} rx={6} {...dot} opacity={0.5} />
            <rect x={118} y={72} width={84} height={12} rx={6} {...dot} opacity={0.7} />
            <rect x={118} y={92} width={56} height={12} rx={6} {...dot} opacity={0.4} />
          </motion.g>
        </Frame>
      );
    case 1:
      return (
        <Frame>
          <motion.rect
            x={34}
            y={34}
            width={150}
            height={102}
            rx={12}
            {...line}
            initial={false}
            animate={active ? { opacity: 1 } : { opacity: 0.7 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
          <rect x={48} y={46} width={54} height={8} rx={4} {...dot} opacity={0.5} />
          <circle cx={46} cy={50} r={3} {...dot} opacity={0.6} />
          <motion.g
            initial={reduce ? false : { opacity: 0, x: -12 }}
            animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          >
            <rect x={48} y={64} width={122} height={10} rx={5} {...dot} opacity={0.75} />
            <rect x={48} y={82} width={92} height={10} rx={5} {...dot} opacity={0.5} />
            <rect x={48} y={100} width={104} height={10} rx={5} {...dot} opacity={0.65} />
          </motion.g>
          <motion.circle
            cx={204}
            cy={60}
            r={4}
            {...dot}
            animate={active ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.5 }}
            transition={loop(2.2, reduce)}
          />
          <path d="M192 40v8l7-4z" {...dot} opacity={0.4} />
        </Frame>
      );
    case 2:
      return (
        <Frame>
          <rect x={86} y={18} width={72} height={134} rx={16} {...line} />
          <rect x={94} y={28} width={56} height={22} rx={5} {...dot} opacity={0.35} />
          <motion.g
            initial={reduce ? false : { opacity: 0.4 }}
            animate={active ? { opacity: [0.35, 1, 0.35] } : { opacity: 0.5 }}
            transition={loop(3, reduce)}
          >
            <rect x={94} y={58} width={56} height={12} rx={6} {...dot} opacity={0.7} />
            <rect x={94} y={76} width={44} height={12} rx={6} {...dot} opacity={0.45} />
            <rect x={94} y={94} width={50} height={12} rx={6} {...dot} opacity={0.6} />
            <rect x={94} y={112} width={34} height={12} rx={6} {...dot} opacity={0.35} />
          </motion.g>
          <motion.g
            initial={reduce ? false : { opacity: 0, x: 20 }}
            animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
          >
            <rect x={38} y={58} width={30} height={14} rx={7} {...line} />
            <path d="M28 64h-8M24 58v12" {...line} opacity={0.6} />
          </motion.g>
          <motion.g
            initial={reduce ? false : { opacity: 0, x: -20 }}
            animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.9, delay: 0.5, ease: 'easeOut' }}
          >
            <rect x={172} y={96} width={30} height={14} rx={7} {...line} />
            <path d="M212 102h-8M204 96v12" {...line} opacity={0.6} />
          </motion.g>
        </Frame>
      );
    case 3:
      return (
        <Frame>
          <motion.g
            animate={active ? { opacity: 0, y: -10 } : { opacity: 0.7, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{ transformOrigin: '60px 80px' }}
          >
            <rect x={28} y={38} width={34} height={34} rx={8} {...line} />
            <circle cx={80} cy={52} r={13} {...line} />
            <rect x={34} y={96} width={36} height={26} rx={6} {...line} transform="rotate(10 34 96)" />
          </motion.g>
          <motion.g
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.9, delay: 0.35, ease: 'easeOut' }}
            style={{ transformOrigin: '160px 84px' }}
          >
            <rect x={108} y={40} width={40} height={40} rx={10} {...line} />
            <rect x={154} y={40} width={40} height={40} rx={10} {...line} opacity={0.7} />
            <rect x={108} y={86} width={40} height={40} rx={10} {...line} opacity={0.7} />
            <rect x={154} y={86} width={40} height={40} rx={10} {...line} opacity={0.45} />
            <rect x={118} y={50} width={20} height={5} rx={2.5} {...dot} opacity={0.7} />
            <rect x={164} y={50} width={20} height={5} rx={2.5} {...dot} opacity={0.5} />
          </motion.g>
          <motion.path
            d="M62 122c14 0 16-12 30-12"
            {...line}
            strokeDasharray="3 5"
            animate={active ? { opacity: 1, pathLength: 1 } : { opacity: 0.3, pathLength: 0.3 }}
            transition={{ duration: 0.9, delay: 0.5, ease: 'easeInOut' }}
          />
        </Frame>
      );
    case 4:
      return (
        <Frame>
          <rect x={20} y={48} width={40} height={20} rx={10} {...line} />
          <rect x={20} y={76} width={40} height={20} rx={10} {...line} opacity={0.6} />
          <rect x={20} y={104} width={40} height={20} rx={10} {...line} opacity={0.4} />
          <path d="M60 58h58M60 86h58M60 114h58" {...line} strokeDasharray="2 6" opacity={0.5} />
          <motion.g
            animate={
              active
                ? { opacity: [0, 1, 1, 0], x: [0, 30, 62] }
                : { opacity: 0.4, x: 0 }
            }
            transition={{ duration: 2.8, times: [0, 0.35, 1], repeat: reduce ? 0 : Infinity, repeatDelay: 0.8, ease: 'easeInOut' }}
          >
            <circle cx={66} cy={58} r={5} {...dot} />
          </motion.g>
          <motion.g
            animate={
              active
                ? { opacity: [0, 1, 1, 0], x: [0, 30, 62] }
                : { opacity: 0.4, x: 0 }
            }
            transition={{ duration: 2.8, times: [0, 0.35, 1], repeat: reduce ? 0 : Infinity, repeatDelay: 0.8, delay: 0.9, ease: 'easeInOut' }}
          >
            <circle cx={66} cy={86} r={5} {...dot} />
          </motion.g>
          <motion.circle
            cx={162}
            cy={84}
            r={18}
            {...line}
            animate={active ? { scale: [1, 1.14, 1] } : { scale: 1 }}
            transition={loop(1.8, reduce)}
            style={{ transformOrigin: '162px 84px' }}
          />
          <motion.path
            d="M154 84l6 6 12-14"
            {...line}
            animate={active ? { pathLength: 1, opacity: 1 } : { pathLength: 0.3, opacity: 0.4 }}
            transition={{ duration: 0.9, delay: 0.4, ease: 'easeInOut' }}
          />
        </Frame>
      );
    case 5:
      return (
        <Frame>
          <motion.g
            initial={reduce ? false : { opacity: 0.5, scale: 0.9 }}
            animate={scaleIn(active, reduce)}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ transformOrigin: '120px 84px' }}
          >
            <path
              d="M104 96c0-9 7-15 16-15 2-8 9-13 18-13 11 0 19 8 19 18 8 1 13 6 13 13 0 8-6 13-14 13h-38c-8 0-14-6-14-16z"
              {...line}
            />
          </motion.g>
          <circle cx={44} cy={48} r={9} {...line} opacity={0.7} />
          <circle cx={196} cy={48} r={9} {...line} opacity={0.7} />
          <circle cx={44} cy={124} r={9} {...line} opacity={0.7} />
          <circle cx={196} cy={124} r={9} {...line} opacity={0.7} />
          <path d="M52 54h40M52 118h40M188 54h-40M188 118h-40" {...line} strokeDasharray="3 4" opacity={0.5} />
          <motion.g
            animate={active ? { opacity: [0, 1, 0] } : { opacity: 0.4 }}
            transition={loop(2.4, reduce)}
          >
            <circle cx={96} cy={58} r={3.5} {...dot} />
          </motion.g>
          <motion.g
            animate={active ? { opacity: [0, 1, 0] } : { opacity: 0.4 }}
            transition={{ duration: 2.4, delay: 0.6, repeat: reduce ? 0 : Infinity, ease: 'easeInOut' }}
          >
            <circle cx={144} cy={58} r={3.5} {...dot} />
          </motion.g>
          <motion.g
            animate={active ? { opacity: [0, 1, 0] } : { opacity: 0.4 }}
            transition={{ duration: 2.4, delay: 1.2, repeat: reduce ? 0 : Infinity, ease: 'easeInOut' }}
          >
            <circle cx={144} cy={110} r={3.5} {...dot} />
          </motion.g>
        </Frame>
      );
    case 6:
      return (
        <Frame>
          <rect x={46} y={30} width={110} height={62} rx={10} {...line} />
          <path d="M64 112h74M74 100h54l-6 12h-42z" {...line} opacity={0.8} />
          <motion.rect
            x={60}
            y={56}
            width={62}
            height={8}
            rx={4}
            {...dot}
            opacity={0.7}
            animate={active ? { width: [62, 78, 62] } : { width: 62 }}
            transition={loop(2.4, reduce)}
          />
          <motion.rect
            x={60}
            y={72}
            width={48}
            height={8}
            rx={4}
            {...dot}
            opacity={0.5}
            animate={active ? { width: [48, 68, 48] } : { width: 48 }}
            transition={{ duration: 2.4, delay: 0.3, repeat: reduce ? 0 : Infinity, ease: 'easeInOut' }}
          />
          <motion.g
            animate={active ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.5 }}
            transition={loop(2, reduce)}
          >
            <circle cx={176} cy={40} r={4} {...dot} />
            <circle cx={188} cy={56} r={4} {...dot} opacity={0.6} />
            <circle cx={182} cy={72} r={4} {...dot} opacity={0.8} />
          </motion.g>
          <motion.path
            d="M156 34h14M156 40h14M156 46h14"
            {...line}
            strokeDasharray="2 4"
            animate={active ? { opacity: 1 } : { opacity: 0.4 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </Frame>
      );
    case 7:
      return (
        <Frame>
          <rect x={26} y={30} width={46} height={34} rx={7} {...line} />
          <rect x={26} y={106} width={46} height={34} rx={7} {...line} />
          <rect x={168} y={52} width={46} height={34} rx={7} {...line} />
          <motion.path
            d="M72 47h44"
            {...line}
            animate={active ? { pathLength: 1, opacity: 1 } : { pathLength: 0.25, opacity: 0.4 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
          <motion.path
            d="M72 123h44"
            {...line}
            animate={active ? { pathLength: 1, opacity: 1 } : { pathLength: 0.25, opacity: 0.4 }}
            transition={{ duration: 1, delay: 0.14, ease: 'easeInOut' }}
          />
          <motion.path
            d="M168 69h-44"
            {...line}
            animate={active ? { pathLength: 1, opacity: 1 } : { pathLength: 0.25, opacity: 0.4 }}
            transition={{ duration: 1, delay: 0.28, ease: 'easeInOut' }}
          />
          <motion.rect
            x={112}
            y={52}
            width={18}
            height={38}
            rx={9}
            {...line}
            animate={active ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.6 }}
            transition={loop(2, reduce)}
          />
          <rect x={34} y={40} width={30} height={6} rx={3} {...dot} opacity={0.5} />
          <rect x={176} y={62} width={30} height={6} rx={3} {...dot} opacity={0.5} />
        </Frame>
      );
    case 8:
      return (
        <Frame>
          <rect x={22} y={44} width={46} height={34} rx={8} {...line} />
          <rect x={30} y={54} width={22} height={5} rx={2.5} {...dot} opacity={0.5} />
          <rect x={172} y={44} width={46} height={34} rx={8} {...line} />
          <rect x={180} y={54} width={22} height={5} rx={2.5} {...dot} opacity={0.5} />
          <motion.path
            d="M68 61h104"
            {...line}
            strokeDasharray="3 5"
            animate={active ? { pathLength: 1, opacity: 1 } : { pathLength: 0.3, opacity: 0.4 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
          <motion.g
            animate={active ? { x: [0, 104], opacity: [1, 1, 0] } : { x: 0, opacity: 0.5 }}
            transition={{ duration: 2.6, times: [0, 0.85, 1], repeat: reduce ? 0 : Infinity, repeatDelay: 0.7, ease: 'easeInOut' }}
          >
            <circle cx={74} cy={61} r={4} {...dot} />
          </motion.g>
          <motion.g
            animate={active ? { x: [0, 104], opacity: [1, 1, 0] } : { x: 0, opacity: 0.5 }}
            transition={{ duration: 2.6, times: [0, 0.85, 1], repeat: reduce ? 0 : Infinity, repeatDelay: 0.7, delay: 1.1, ease: 'easeInOut' }}
          >
            <circle cx={74} cy={61} r={4} {...dot} opacity={0.8} />
          </motion.g>
          <circle cx={172} cy={96} r={4} {...dot} opacity={0.5} />
          <circle cx={60} cy={104} r={3} {...dot} opacity={0.4} />
        </Frame>
      );
    case 9:
      return (
        <Frame>
          <motion.g
            animate={active ? { x: [0, 40], opacity: [1, 0] } : { x: 0, opacity: 0.5 }}
            transition={{ duration: 1.6, repeat: reduce ? 0 : Infinity, repeatDelay: 1, ease: 'easeInOut' }}
          >
            <circle cx={34} cy={44} r={4} {...dot} />
            <circle cx={50} cy={60} r={4} {...dot} />
            <circle cx={30} cy={78} r={4} {...dot} />
            <circle cx={52} cy={96} r={4} {...dot} />
            <circle cx={36} cy={114} r={4} {...dot} />
          </motion.g>
          <motion.g
            initial={reduce ? false : { opacity: 0.35 }}
            animate={active ? { opacity: 1 } : { opacity: 0.35 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          >
            <ellipse cx={160} cy={44} rx={44} ry={11} {...line} />
            <path d="M116 44v62a44 11 0 0044 11 44 11 0 0044-11V44" {...line} />
            <path d="M116 66a44 11 0 0044 11 44 11 0 0044-11" {...line} opacity={0.5} />
            <ellipse cx={160} cy={88} rx={44} ry={11} {...line} opacity={0.35} />
            <motion.rect
              x={132}
              y={40}
              width={24}
              height={5}
              rx={2.5}
              {...dot}
              opacity={0.7}
              animate={active ? { opacity: [0.7, 1, 0.7] } : { opacity: 0.6 }}
              transition={loop(2, reduce)}
            />
          </motion.g>
        </Frame>
      );
    case 10:
      return (
        <Frame>
          <rect x={20} y={38} width={42} height={34} rx={8} {...line} />
          <rect x={74} y={38} width={42} height={34} rx={8} {...line} />
          <rect x={128} y={38} width={42} height={34} rx={8} {...line} />
          <rect x={182} y={38} width={42} height={34} rx={8} {...line} />
          <text x={30} y={88} fill="currentColor" fontSize={7} fontWeight={700} opacity={0.55}>Build</text>
          <text x={84} y={88} fill="currentColor" fontSize={7} fontWeight={700} opacity={0.55}>Test</text>
          <text x={134} y={88} fill="currentColor" fontSize={7} fontWeight={700} opacity={0.55}>Deploy</text>
          <text x={182} y={88} fill="currentColor" fontSize={7} fontWeight={700} opacity={0.55}>Monitor</text>
          <motion.path
            d="M62 55h12M116 55h12M170 55h12"
            {...line}
            strokeDasharray="2 4"
            animate={active ? { pathLength: 1, opacity: 1 } : { pathLength: 0.3, opacity: 0.4 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
          <motion.g
            animate={active ? { x: [0, 204], opacity: [1, 1, 0] } : { x: 0, opacity: 0.5 }}
            transition={{ duration: 3, times: [0, 0.8, 1], repeat: reduce ? 0 : Infinity, repeatDelay: 0.6, ease: 'easeInOut' }}
          >
            <rect x={24} y={47} width={12} height={9} rx={3} {...dot} opacity={0.8} />
          </motion.g>
          <motion.g
            animate={active ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.5 }}
            transition={loop(2.4, reduce)}
          >
            <circle cx={148} cy={118} r={4} {...dot} />
            <circle cx={172} cy={128} r={3} {...dot} opacity={0.6} />
            <circle cx={188} cy={118} r={4} {...dot} opacity={0.8} />
          </motion.g>
        </Frame>
      );
    case 11:
      return (
        <Frame>
          <motion.g
            animate={active ? { opacity: 0, x: -14 } : { opacity: 0.7, x: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          >
            <rect x={26} y={42} width={54} height={40} rx={8} {...line} />
            <rect x={36} y={54} width={34} height={6} rx={3} {...dot} opacity={0.5} />
            <rect x={36} y={66} width={34} height={6} rx={3} {...dot} opacity={0.7} />
            <path d="M32 100h42M42 92l-10 8 10 8" {...line} opacity={0.5} />
          </motion.g>
          <motion.g
            initial={reduce ? false : { opacity: 0, scale: 0.92 }}
            animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
            transition={{ duration: 1.1, delay: 0.4, ease: 'easeOut' }}
            style={{ transformOrigin: '170px 84px' }}
          >
            <circle cx={170} cy={60} r={12} {...line} />
            <circle cx={132} cy={84} r={12} {...line} opacity={0.75} />
            <circle cx={170} cy={108} r={12} {...line} opacity={0.6} />
            <circle cx={208} cy={84} r={12} {...line} opacity={0.55} />
            <path d="M150 66l-10 10M158 108l-14 6M190 66l10 10M182 108l14 6" {...line} opacity={0.6} />
          </motion.g>
          <motion.path
            d="M80 62c16-6 22 4 34 0M80 100c16 6 24-4 36 0"
            {...line}
            strokeDasharray="3 5"
            animate={active ? { opacity: 1, pathLength: 1 } : { opacity: 0.3, pathLength: 0.3 }}
            transition={{ duration: 1, delay: 0.6, ease: 'easeInOut' }}
          />
          <motion.g
            animate={active ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.5 }}
            transition={loop(2.4, reduce)}
          >
            <circle cx={222} cy={60} r={3} {...dot} />
            <circle cx={222} cy={108} r={3} {...dot} opacity={0.7} />
          </motion.g>
        </Frame>
      );
    default:
      return null;
  }
}

const CHIPS: Record<number, { label: string; style: CSSProperties }[]> = {
  0: [
    { label: 'Workflow', style: { top: '14%', left: '9%' } },
    { label: 'Modules', style: { bottom: '13%', right: '9%' } },
  ],
  1: [
    { label: 'Performance 98', style: { top: '15%', right: '10%' } },
    { label: 'SEO Ready', style: { bottom: '15%', left: '10%' } },
  ],
  2: [
    { label: 'iOS & Android', style: { top: '16%', left: '10%' } },
    { label: 'App Store', style: { bottom: '14%', right: '10%' } },
  ],
  3: [
    { label: 'Usability', style: { top: '15%', right: '12%' } },
    { label: 'User Flow', style: { bottom: '15%', left: '10%' } },
  ],
  4: [
    { label: 'Automation', style: { top: '14%', left: '10%' } },
    { label: 'Time Saved', style: { bottom: '14%', right: '10%' } },
  ],
  5: [
    { label: 'AI Agent', style: { top: '16%', right: '10%' } },
    { label: 'Live Assistants', style: { bottom: '15%', left: '10%' } },
  ],
  6: [
    { label: 'Cloud Scale', style: { top: '14%', right: '10%' } },
    { label: '99.9% Uptime', style: { bottom: '14%', left: '10%' } },
  ],
  7: [
    { label: 'Windows', style: { top: '15%', left: '10%' } },
    { label: 'On-Premise', style: { bottom: '14%', right: '10%' } },
  ],
  8: [
    { label: 'REST API', style: { top: '15%', right: '10%' } },
    { label: 'Secure', style: { bottom: '15%', left: '10%' } },
  ],
  9: [
    { label: 'Indexed', style: { top: '14%', left: '10%' } },
    { label: 'Fast Queries', style: { bottom: '14%', right: '10%' } },
  ],
  10: [
    { label: 'CI / CD', style: { top: '15%', right: '10%' } },
    { label: 'Zero-Downtime', style: { bottom: '15%', left: '10%' } },
  ],
  11: [
    { label: 'Modernize', style: { top: '15%', left: '10%' } },
    { label: 'Connected', style: { bottom: '15%', right: '10%' } },
  ],
};

function FloatingChips({ index, active }: { index: number; active: boolean }) {
  const reduce = useReducedMotion();
  const chips = CHIPS[index] ?? [];
  return (
    <>
      {chips.map((chip, i) => (
        <motion.span
          key={chip.label}
          className="home-service-chip"
          style={chip.style}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.6, delay: 0.3 + i * 0.16, ease: 'easeOut' }}
        >
          {chip.label}
        </motion.span>
      ))}
    </>
  );
}

function ServiceVisual({ service, active, index }: { service: Service; active: boolean; index: number }) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <div className="home-service-visual">
      <span className="home-service-visual-bg" aria-hidden="true" />
      <div className="home-service-visual-art">
        <ServiceArt active={active} index={index} />
      </div>
      {imgOk ? (
        <img
          className="home-service-visual-img"
          src={service.image}
          alt={`${service.category} service visual`}
          loading="lazy"
          onError={() => setImgOk(false)}
        />
      ) : null}
      <FloatingChips index={index} active={active} />
    </div>
  );
}

export function ServiceCardShell({ service, active, className = '' }: { service: Service; active: boolean; className?: string }) {
  return (
    <article className={`home-service-card ${className}`.trim()}>
      <span className="home-service-card-ghost" aria-hidden="true">
        {service.index}
      </span>
      <div className="home-service-card-body">
        <span className="home-service-label">
          {service.index} / {service.category}
        </span>
        <p className="home-service-problem">{service.problem}</p>
        <p className="home-service-solution">{service.solution}</p>
        <Link to="/services" className="home-service-cta">
          Explore Service <ArrowRight size={15} />
        </Link>
      </div>
      <ServiceVisual service={service} active={active} index={service.number - 1} />
    </article>
  );
}

type PinnedProps = {
  service: Service;
  index: number;
  total: number;
  active: boolean;
  progress: MotionValue<number>;
};

export const PinnedServiceCard = memo(function PinnedServiceCard({ service, index, total, active, progress }: PinnedProps) {
  const slot = 1 / total;
  const enterStart = index * slot - 0.42 * slot;
  const enterEnd = index * slot;
  const leaveStart = (index + 1) * slot - 0.42 * slot;
  const leaveEnd = (index + 1) * slot;

  const opacity = useTransform(progress, interpolate([enterStart, enterEnd, leaveStart, leaveEnd], [0, 1, 1, 0]));
  const y = useTransform(progress, interpolate([enterStart, enterEnd, leaveStart, leaveEnd], [64, 0, 0, -48]));
  const scale = useTransform(progress, interpolate([enterStart, enterEnd, leaveStart, leaveEnd], [0.955, 1, 1, 0.97]));
  const blurAmount = useTransform(progress, interpolate([enterStart, enterEnd, leaveStart, leaveEnd], [10, 0, 0, 10]));
  const blur = useTransform(blurAmount, (value) => `blur(${value}px)`);

  return (
    <motion.div
      className="home-service-card-wrap"
      style={{ opacity, y, scale, filter: blur }}
      aria-hidden={!active}
    >
      <ServiceCardShell service={service} active={active} />
    </motion.div>
  );
});
