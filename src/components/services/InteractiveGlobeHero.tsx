import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Zap,
  TrendingUp,
  Briefcase,
  ShoppingBag
} from 'lucide-react';

// Real-world continent boundaries for digital globe mapping
function isLandmass(lat: number, lon: number): boolean {
  // North America
  if (lat >= 15 && lat <= 72 && lon >= -168 && lon <= -52) {
    if (lat < 28 && lon < -105) return false;
    return true;
  }
  // Central America
  if (lat >= 8 && lat <= 20 && lon >= -105 && lon <= -75) return true;
  // South America
  if (lat >= -55 && lat <= 12 && lon >= -82 && lon <= -34) {
    if (lat < -20 && lon > -45) return false;
    return true;
  }
  // Europe
  if (lat >= 36 && lat <= 71 && lon >= -10 && lon <= 45) return true;
  // Scandinavia
  if (lat >= 55 && lat <= 71 && lon >= 5 && lon <= 32) return true;
  // Africa
  if (lat >= -35 && lat <= 37 && lon >= -18 && lon <= 52) {
    if (lat > 20 && lon < -15) return false;
    return true;
  }
  // Asia (including India, China, SE Asia, Japan)
  if (lat >= 5 && lat <= 75 && lon >= 45 && lon <= 170) {
    if (lat < 10 && lon < 95) return false;
    return true;
  }
  // Australia & New Zealand
  if (lat >= -45 && lat <= -10 && lon >= 113 && lon <= 175) return true;
  // UK & Ireland
  if (lat >= 50 && lat <= 59 && lon >= -10 && lon <= 2) return true;
  // Greenland
  if (lat >= 60 && lat <= 83 && lon >= -73 && lon <= -18) return true;

  return false;
}

interface Point3D {
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
  isLand: boolean;
  alpha: number;
}

export default function InteractiveGlobeHero() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const scrollToSolutions = () => {
    const el = document.getElementById('solutions-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: 700, behavior: 'smooth' });
    }
  };

  // ── Interactive 3D Dotted Canvas Globe ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rect = canvas.getBoundingClientRect();
    let width = (canvas.width = (rect.width || 480) * dpr);
    let height = (canvas.height = (rect.height || 480) * dpr);
    let radius = Math.min(width, height) * 0.4;

    const resize = () => {
      if (!canvas) return;
      rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.width = (rect.width || 480) * dpr;
      height = canvas.height = (rect.height || 480) * dpr;
      radius = Math.min(width, height) * 0.4;
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(canvas);

    // Generate Points using Fibonacci sphere with landmass detection
    const points: Point3D[] = [];
    const totalPoints = 1400;
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < totalPoints; i++) {
      const yNorm = 1 - (i / (totalPoints - 1)) * 2; // -1 to 1
      const lat = Math.asin(yNorm) * (180 / Math.PI);
      const theta = phi * i;
      const lon = (((theta % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) - Math.PI) * (180 / Math.PI);

      const isLand = isLandmass(lat, lon);

      // Keep all land points + small fraction of ocean points for spherical depth
      if (isLand || Math.random() < 0.16) {
        const radiusAtY = Math.sqrt(1 - yNorm * yNorm);
        const xNorm = Math.cos(theta) * radiusAtY;
        const zNorm = Math.sin(theta) * radiusAtY;

        points.push({
          baseX: xNorm,
          baseY: -yNorm, // negative so north is up
          baseZ: zNorm,
          size: isLand ? Math.random() * 1.5 + 1.6 : Math.random() * 0.9 + 0.8,
          isLand,
          alpha: isLand ? Math.random() * 0.35 + 0.65 : 0.22
        });
      }
    }

    // Interactive Rotation State
    let rotX = 0.22; // subtle tilt forward
    let rotY = 1.1; // initial longitude showing continents
    let targetRotY = 1.1;
    let targetRotX = 0.22;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    const autoRotateSpeed = 0.0035;

    // Pulse timer for network trajectory arcs
    let arcPulse = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - lastMouseX;
      const deltaY = e.clientY - lastMouseY;
      targetRotY += deltaX * 0.006;
      targetRotX += deltaY * 0.006;
      // Clamp vertical tilt so it doesn't flip upside down
      targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX));
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - lastMouseX;
      const deltaY = e.touches[0].clientY - lastMouseY;
      targetRotY += deltaX * 0.006;
      targetRotX += deltaY * 0.006;
      targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX));
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Animation Render Loop
    const render = () => {
      if (!isDragging) {
        targetRotY += autoRotateSpeed;
      }
      rotY += (targetRotY - rotY) * 0.08;
      rotX += (targetRotX - rotX) * 0.08;
      arcPulse = (arcPulse + 0.02) % (Math.PI * 2);

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Soft back atmospheric glow inside canvas
      const atmoGrad = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius * 1.18);
      atmoGrad.addColorStop(0, 'rgba(0, 82, 255, 0.08)');
      atmoGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.04)');
      atmoGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = atmoGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.18, 0, Math.PI * 2);
      ctx.fill();

      // Rotation matrix values
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Project all 3D points
      interface Projected {
        x2d: number;
        y2d: number;
        z: number;
        size: number;
        isLand: boolean;
        alpha: number;
      }

      const projected: Projected[] = [];
      const focalLength = radius * 3.5;

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // 3D coordinates on sphere
        const px = p.baseX * radius;
        const py = p.baseY * radius;
        const pz = p.baseZ * radius;

        // Y Rotation
        const x1 = px * cosY - pz * sinY;
        const z1 = pz * cosY + px * sinY;

        // X Rotation
        const y1 = py * cosX - z1 * sinX;
        const z2 = z1 * cosX + py * sinX;

        // Perspective
        const scale = focalLength / (focalLength + z2);
        const x2d = cx + x1 * scale;
        const y2d = cy + y1 * scale;

        projected.push({
          x2d,
          y2d,
          z: z2,
          size: p.size * scale * (dpr > 1 ? 1.2 : 1),
          isLand: p.isLand,
          alpha: p.alpha
        });
      }

      // Sort by Z for realistic depth layering
      projected.sort((a, b) => a.z - b.z);

      // Draw all points
      for (let i = 0; i < projected.length; i++) {
        const pt = projected[i];
        const isFront = pt.z > 0;
        const depthFactor = (pt.z + radius) / (radius * 2); // 0 at back, 1 at front

        ctx.beginPath();
        ctx.arc(pt.x2d, pt.y2d, Math.max(0.6, pt.size), 0, Math.PI * 2);

        if (pt.isLand) {
          if (isFront) {
            // Glowing cyan/sky on front continents
            const alpha = Math.min(1, 0.45 + depthFactor * 0.55) * pt.alpha;
            ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
            if (pt.size > 2.0 && depthFactor > 0.7) {
              ctx.shadowBlur = 8 * dpr;
              ctx.shadowColor = '#00F0FF';
            } else {
              ctx.shadowBlur = 0;
            }
          } else {
            // Dim sapphire on backside continents
            const alpha = Math.max(0.12, depthFactor * 0.35) * pt.alpha;
            ctx.fillStyle = `rgba(37, 99, 235, ${alpha})`;
            ctx.shadowBlur = 0;
          }
        } else {
          // Sparse ocean points
          const alpha = isFront ? 0.22 : 0.08;
          ctx.fillStyle = `rgba(30, 58, 138, ${alpha})`;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
      }

      ctx.shadowBlur = 0; // reset
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <section className="relative w-full bg-black text-white pt-24 sm:pt-32 lg:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-12 overflow-hidden select-none">
      
      {/* ── Ambient Background Radial Glows matching reference ── */}
      <div className="absolute top-1/4 right-1/4 w-[550px] sm:w-[680px] h-[550px] sm:h-[680px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -top-16 left-6 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        
        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* ── 1. TITLE BLOCK: Badge & Headline (Order 1 on Mobile) ── */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        <div className="order-1 lg:order-1 lg:col-span-7 lg:col-start-1 lg:row-start-1 w-full flex flex-col items-start text-left z-20">
          {/* Top Pill Badge: OUR SERVICES */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-3.5 sm:px-4 py-1.5 rounded-full bg-[#0A1A3B]/80 border border-blue-500/30 text-[#38BDF8] text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-4 sm:mb-6 shadow-[0_0_15px_rgba(56,189,248,0.15)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse mr-2" />
            OUR SERVICES
          </motion.div>

          {/* Main Title: Turn Your Business Vision Into Revenue Growth (Slightly reduced on mobile) */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-[56px] xl:text-[62px] font-extrabold text-white leading-[1.12] tracking-tight font-montserrat"
          >
            Turn Your Business<br />
            Vision Into<br />
            <span className="bg-gradient-to-r from-[#00F0FF] via-[#38BDF8] to-[#0052FF] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,240,255,0.4)]">
              Revenue Growth
            </span>
          </motion.h1>
        </div>

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* ── 2. GLOBE BLOCK: 3D Canvas & Floating Cards (Order 2 on Mobile) ── */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        <div className="order-2 lg:order-2 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:row-span-2 relative w-full h-[280px] sm:h-[380px] lg:h-[530px] flex items-center justify-center my-3 sm:my-0">
          
          {/* Globe Atmosphere Glowing Orb */}
          <div className="absolute w-60 sm:w-96 h-60 sm:h-96 rounded-full bg-gradient-to-tr from-blue-600/30 to-cyan-400/20 blur-[75px] pointer-events-none" />

          {/* ── Orbital Trajectory Rings SVG ── */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
            {/* Ring 1: Tilted forward ellipse */}
            <ellipse
              cx="250"
              cy="250"
              rx="185"
              ry="78"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1.2"
              strokeOpacity="0.4"
              strokeDasharray="4 6"
              className="transform rotate-[-25deg] origin-center"
            />
            {/* Ring 2: Tilted backward ellipse */}
            <ellipse
              cx="250"
              cy="250"
              rx="205"
              ry="90"
              fill="none"
              stroke="#0052FF"
              strokeWidth="1.2"
              strokeOpacity="0.45"
              className="transform rotate-[32deg] origin-center"
            />
          </svg>

          {/* ── Interactive 3D Dotted Canvas Globe ── */}
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
            title="Click and drag to rotate the globe"
          />

          {/* ── Floating UI Card 1: Revenue Growth +72% (Top Right) ── */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="absolute -top-1 sm:-top-2 right-0 sm:right-2 z-20 w-40 sm:w-56 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#091329]/90 backdrop-blur-xl border border-blue-400/30 shadow-[0_12px_35px_rgba(0,0,0,0.55)] scale-90 sm:scale-100 origin-top-right"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-300">Revenue Growth</span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono">×</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-2xl font-black font-montserrat text-[#00F0FF] tracking-tight">
                +72%
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-emerald-400">↗</span>
            </div>

            {/* Glowing upward SVG sparkline chart */}
            <div className="w-full h-8 sm:h-10 mt-1 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 160 40" fill="none">
                <defs>
                  <linearGradient id="globeChartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#0052FF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 5 35 Q 40 25, 75 30 T 150 8 L 150 40 L 5 40 Z"
                  fill="url(#globeChartGlow)"
                />
                <path
                  d="M 5 35 Q 40 25, 75 30 T 150 8"
                  stroke="#00F0FF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="150" cy="8" r="3.5" fill="#00F0FF" className="animate-pulse" />
              </svg>
            </div>
          </motion.div>

          {/* ── Floating UI Card 2: Ideas → Products → Profits (Middle Left) ── */}
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="absolute bottom-10 sm:bottom-24 -left-1 sm:left-2 z-20 px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#091329]/90 backdrop-blur-xl border border-blue-400/30 shadow-[0_12px_35px_rgba(0,0,0,0.55)] flex items-center gap-2 sm:gap-3 scale-90 sm:scale-100 origin-bottom-left"
          >
            <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-lg sm:rounded-xl bg-[#0052FF] text-white flex items-center justify-center shadow-[0_0_12px_rgba(0,82,255,0.4)] shrink-0">
              <ShoppingBag size={13} className="sm:w-[15px] sm:h-[15px]" />
            </div>
            <div className="text-[10px] sm:text-[11px] font-bold text-white leading-tight">
              <div>Ideas → Products</div>
              <div className="text-[#38BDF8]">→ Profits</div>
            </div>
          </motion.div>

          {/* ── Floating UI Card 3: Trusted by 100+ businesses (Bottom Right) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="absolute -bottom-2 right-0 sm:right-4 z-20 px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#091329]/90 backdrop-blur-xl border border-blue-400/30 shadow-[0_12px_35px_rgba(0,0,0,0.55)] flex items-center gap-2 sm:gap-3 scale-90 sm:scale-100 origin-bottom-right"
          >
            {/* Overlapping User Avatars */}
            <div className="flex -space-x-1.5 sm:-space-x-2 shrink-0">
              <div className="w-5 sm:w-7 h-5 sm:h-7 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 border-2 border-[#091329] flex items-center justify-center text-[8px] sm:text-[9px] font-bold text-white">
                JD
              </div>
              <div className="w-5 sm:w-7 h-5 sm:h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-400 border-2 border-[#091329] flex items-center justify-center text-[8px] sm:text-[9px] font-bold text-white">
                AK
              </div>
              <div className="w-5 sm:w-7 h-5 sm:h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 border-2 border-[#091329] flex items-center justify-center text-[8px] sm:text-[9px] font-bold text-white">
                MR
              </div>
            </div>

            <div className="text-left">
              <div className="text-[9px] sm:text-[10px] text-slate-400">Trusted by</div>
              <div className="text-[10px] sm:text-[11px] font-bold text-white">100+ businesses</div>
            </div>
          </motion.div>

          {/* ── Handwritten Annotation & Curved Arrow ("Building a smarter tomorrow") ── */}
          <div className="absolute bottom-20 right-8 sm:right-16 z-20 pointer-events-none hidden sm:flex flex-col items-center">
            <span
              className="text-xs text-slate-300/90 font-medium rotate-[-8deg] tracking-wide"
              style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive" }}
            >
              Building a<br />
              smarter tomorrow
            </span>
            {/* Curved hand-drawn arrow */}
            <svg className="w-8 h-8 -rotate-12 mt-1 text-slate-400 opacity-70" viewBox="0 0 40 40" fill="none">
              <path
                d="M 15 5 C 25 15, 30 25, 20 35"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 14 30 L 20 35 L 25 31"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

        </div>

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* ── 3. CONTENT BLOCK: Subtitle, Buttons & Badges (Order 3 on Mobile) ── */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        <div className="order-3 lg:order-3 lg:col-span-7 lg:col-start-1 lg:row-start-2 w-full flex flex-col items-start text-left z-20">
          
          {/* Subtitle matching reference */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-300 text-sm sm:text-base lg:text-[17px] leading-relaxed max-w-xl my-4 sm:my-7 font-normal"
          >
            We build enterprise software, AI automation, custom platforms, and web & mobile ecosystems that deliver measurable results — not just software, real ROI.
          </motion.p>

          {/* Action Buttons Row - w-fit for mobile content fit */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-10 w-full"
          >
            {/* Primary CTA: Book a Strategy Call - w-fit content fit */}
            <button
              onClick={() => navigate('/client-connect')}
              className="w-fit bg-[#0052FF] hover:bg-[#0048E6] text-white font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs sm:text-base inline-flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,82,255,0.45)] hover:shadow-[0_0_35px_rgba(0,82,255,0.65)] hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <span>Book a Strategy Call</span>
              <ArrowRight size={15} strokeWidth={2.5} />
            </button>

            {/* Secondary CTA: View Our Work - w-fit content fit */}
            <button
              onClick={scrollToSolutions}
              className="w-fit bg-white/5 hover:bg-white/10 text-white font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs sm:text-base border border-white/20 hover:border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer text-center inline-flex items-center justify-center"
            >
              View Our Work
            </button>
          </motion.div>

          {/* Bottom Trust Feature Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap items-center gap-2 sm:gap-4 pt-1"
          >
            {/* Faster Delivery */}
            <div className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#0B152A]/80 border border-blue-500/20 text-[11px] sm:text-xs font-medium text-slate-300">
              <div className="w-4.5 sm:w-5 h-4.5 sm:h-5 rounded-full bg-[#0052FF]/25 flex items-center justify-center text-[#38BDF8]">
                <Zap size={11} strokeWidth={2.5} />
              </div>
              <span>Faster Delivery</span>
            </div>

            {/* Scalable Solutions */}
            <div className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#0B152A]/80 border border-blue-500/20 text-[11px] sm:text-xs font-medium text-slate-300">
              <div className="w-4.5 sm:w-5 h-4.5 sm:h-5 rounded-full bg-[#0052FF]/25 flex items-center justify-center text-[#38BDF8]">
                <TrendingUp size={11} strokeWidth={2.5} />
              </div>
              <span>Scalable Solutions</span>
            </div>

            {/* Business Focused */}
            <div className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#0B152A]/80 border border-blue-500/20 text-[11px] sm:text-xs font-medium text-slate-300">
              <div className="w-4.5 sm:w-5 h-4.5 sm:h-5 rounded-full bg-[#0052FF]/25 flex items-center justify-center text-[#38BDF8]">
                <Briefcase size={11} strokeWidth={2.5} />
              </div>
              <span>Business Focused</span>
            </div>
          </motion.div>

        </div>

      </div>

    </section>
  );
}
