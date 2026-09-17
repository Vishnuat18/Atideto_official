import React from 'react';
import { motion } from 'framer-motion';

interface LadoAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isInteractive?: boolean;
  className?: string;
  isFloating?: boolean;
}

export default function LadoAvatar({
  size = 'md',
  isInteractive = false,
  className = '',
  isFloating = false,
}: LadoAvatarProps) {
  const sizeMap = {
    sm: { container: 'w-8 h-8', svg: 32 },
    md: { container: 'w-11 h-11', svg: 44 },
    lg: { container: 'w-14 h-14', svg: 56 },
    xl: { container: 'w-16 h-16 sm:w-[68px] sm:h-[68px]', svg: 68 },
  };

  const { container } = sizeMap[size];

  // Mascot SVG: Bubble-gum style, glossy 3D liquid pebble, logo colors, no eyes/face
  const MascotSvg = (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,82,255,0.4)]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Main 3D Bubble Gum Base Gradient (Logo electric blues & cyan) */}
        <radialGradient
          id="ladoBubbleBody"
          cx="38%"
          cy="32%"
          r="68%"
          fx="32%"
          fy="26%"
        >
          <stop offset="0%" stopColor="#4DE5FF" />
          <stop offset="22%" stopColor="#00B4FF" />
          <stop offset="52%" stopColor="#0052FF" />
          <stop offset="85%" stopColor="#002B99" />
          <stop offset="100%" stopColor="#040D2E" />
        </radialGradient>

        {/* Ambient Outer Ring Gradient for unique border */}
        <linearGradient id="ladoRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="45%" stopColor="#0062FF" />
          <stop offset="85%" stopColor="#8A2BE2" />
          <stop offset="100%" stopColor="#00D2FF" />
        </linearGradient>

        {/* Specular Glare Gradient */}
        <linearGradient id="ladoGlare" x1="20%" y1="10%" x2="50%" y2="60%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#E0F7FF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Soft Secondary Bounce Glow */}
        <radialGradient id="ladoRimLight" cx="65%" cy="80%" r="45%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── Volumetric Bubble Gum Body ── */}
      {/* Unique organic squircle-gum silhouette */}
      <path
        d="M 50,6 
           C 74,5 93,22 93,48 
           C 93,73 76,93 50,94 
           C 22,94 6,75 6,49 
           C 6,24 23,7 50,6 Z"
        fill="url(#ladoBubbleBody)"
      />

      {/* Inner Rim Light / Bounce highlight on bottom right */}
      <path
        d="M 28,84 
           C 42,91 66,90 78,78 
           C 84,72 88,62 89,52 
           C 86,68 76,82 62,86 
           C 48,90 35,88 28,84 Z"
        fill="url(#ladoRimLight)"
      />

      {/* Deep Core Depth Shadow (enhancing the 3D gum volume) */}
      <path
        d="M 22,70 
           C 14,56 16,36 28,24 
           C 20,36 20,54 28,68 
           C 34,77 44,82 56,84 
           C 44,83 30,79 22,70 Z"
        fill="#020817"
        fillOpacity="0.35"
      />

      {/* Primary Curved Specular Glare (signature fresh glossy bubble gum shine) */}
      <path
        d="M 28,18 
           C 42,12 62,14 74,23 
           C 66,19 46,18 34,26 
           C 26,32 21,41 20,50 
           C 18,38 21,24 28,18 Z"
        fill="url(#ladoGlare)"
      />

      {/* Secondary Pinpoint Sparkle Reflection */}
      <circle cx="76" cy="32" r="3.2" fill="#FFFFFF" fillOpacity="0.85" />
      <circle cx="81" cy="40" r="1.6" fill="#FFFFFF" fillOpacity="0.65" />
    </svg>
  );

  if (!isInteractive && !isFloating) {
    return (
      <div className={`relative ${container} shrink-0 select-none ${className}`}>
        {MascotSvg}
      </div>
    );
  }

  return (
    <motion.div
      className={`relative ${container} shrink-0 select-none cursor-pointer ${className}`}
      animate={
        isFloating
          ? {
              y: [0, -5, 0],
              scale: [1, 1.025, 1],
              rotate: [0, 1.5, -1.5, 0],
            }
          : undefined
      }
      transition={
        isFloating
          ? {
              duration: 3.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }
          : undefined
      }
      whileHover={isInteractive ? { scale: 1.12, rotate: 3 } : undefined}
      whileTap={isInteractive ? { scale: 0.92, rotate: -3 } : undefined}
    >
      {MascotSvg}
    </motion.div>
  );
}
