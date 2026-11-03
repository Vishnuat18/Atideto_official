import React from 'react';

/**
 * ProfessionalHeroBg
 * 
 * Sleek, high-end, professional tech hero background animation.
 * Designed for modern enterprise software & AI technology platforms.
 * 
 * Features:
 * - Subtle precision engineering tech grid with radial vignette mask
 * - Ambient floating royal electric blue mesh glows (#0052FF / #0038FF)
 * - Luminous horizon light beam with gentle breathing pulse
 * - Clean 60 FPS GPU-accelerated CSS animations with zero CPU overhead
 * - Seamless bottom gradient fade into #050505
 */
export default function ProfessionalHeroBg() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0"
    >
      {/* ── 1. Subtle Precision Engineering Grid with Radial Vignette ── */}
      <div
        className="absolute inset-0 w-full h-full opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 82, 255, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 82, 255, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 75% 60% at 50% 25%, black 25%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 60% at 50% 25%, black 25%, transparent 80%)',
        }}
      />

      {/* ── 2. Top Architectural Horizon Glow Flare ── */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[85%] max-w-5xl h-[2px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(0, 82, 255, 0.4) 20%, rgba(0, 240, 255, 0.9) 50%, rgba(0, 82, 255, 0.4) 80%, transparent 100%)',
          boxShadow: '0 0 25px 3px rgba(0, 150, 255, 0.65), 0 0 50px 8px rgba(0, 82, 255, 0.35)',
          animation: 'horizonPulse 8s ease-in-out infinite alternate',
        }}
      />

      {/* ── 3. Primary Center-Upper Electric Blue Atmosphere Glow ── */}
      <div
        className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[850px] sm:w-[1100px] h-[520px] sm:h-[620px] rounded-full blur-[140px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 35%, rgba(0, 82, 255, 0.35) 0%, rgba(0, 40, 190, 0.22) 45%, rgba(5, 5, 5, 0) 75%)',
          animation: 'ambientOrbFloat 14s ease-in-out infinite alternate',
          transformOrigin: 'center center',
        }}
      />

      {/* ── 4. Secondary Drifting Luminous Accent (Top Right / Center) ── */}
      <div
        className="absolute top-[5%] right-[10%] sm:right-[18%] w-[450px] sm:w-[580px] h-[360px] sm:h-[460px] rounded-full blur-[130px] pointer-events-none opacity-60"
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 180, 255, 0.28) 0%, rgba(0, 82, 255, 0.15) 50%, transparent 75%)',
          animation: 'accentGlowDrift 16s ease-in-out infinite alternate',
        }}
      />

      {/* ── 5. Tertiary Subtle Deep Underglow (Top Left) ── */}
      <div
        className="absolute top-[8%] left-[8%] sm:left-[14%] w-[400px] sm:w-[500px] h-[320px] sm:h-[400px] rounded-full blur-[120px] pointer-events-none opacity-50"
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 60, 220, 0.30) 0%, rgba(6, 11, 31, 0.20) 60%, transparent 80%)',
          animation: 'accentGlowDriftLeft 18s ease-in-out infinite alternate',
        }}
      />

      {/* ── 6. Bottom Grounding Fade (Leaves Bottom 35% Clean for Progress Tabs) ── */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(5, 5, 5, 0.75) 60%, #050505 100%)',
        }}
      />

      {/* ── GPU-Accelerated Keyframe Styles ── */}
      <style>{`
        @keyframes horizonPulse {
          0% {
            opacity: 0.6;
            transform: translateX(-50%) scaleX(0.92);
          }
          50% {
            opacity: 0.95;
            transform: translateX(-50%) scaleX(1.04);
          }
          100% {
            opacity: 0.6;
            transform: translateX(-50%) scaleX(0.92);
          }
        }

        @keyframes ambientOrbFloat {
          0% {
            transform: translate(-50%, 0) scale(1);
            opacity: 0.85;
          }
          50% {
            transform: translate(-50%, 4%) scale(1.08);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -2%) scale(0.96);
            opacity: 0.88;
          }
        }

        @keyframes accentGlowDrift {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-6%, 5%) scale(1.12);
          }
          100% {
            transform: translate(4%, -4%) scale(0.94);
          }
        }

        @keyframes accentGlowDriftLeft {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(5%, -4%) scale(1.1);
          }
          100% {
            transform: translate(-4%, 3%) scale(0.95);
          }
        }
      `}</style>
    </div>
  );
}
