import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Orbit, Globe, Zap, Sparkles, Code, Users,
  ShieldCheck, ArrowUpRight
} from 'lucide-react';

export default function AboutCompanyWindow() {
  const [ripples, setRipples] = useState<{ id: number }[]>([]);

  const handleCoreClick = () => {
    const newId = Date.now();
    setRipples((prev) => [...prev.slice(-4), { id: newId }]);
  };

  return (
    <div className="relative w-full max-w-[600px] mx-auto min-h-[480px] md:min-h-[500px] flex items-center justify-center select-none py-4">
      {/* Background Ambient Soft Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[340px] h-[340px] rounded-full bg-gradient-to-tr from-primary/12 via-sky-400/10 to-indigo-500/12 blur-[80px]" />
      </div>

      {/* Floating Wrapper */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-full h-full min-h-[480px] md:min-h-[500px] flex items-center justify-center"
      >
        {/* ================= CENTRAL ORBITAL CORE ================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 cursor-pointer"
          onClick={handleCoreClick}
        >
          {/* Ambient Staggered Lighter Spring Waves Surrounding Core */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {[0, 1.3, 2.6].map((delay, idx) => (
              <motion.div
                key={idx}
                animate={{
                  scale: [1, 1.5, 2.1],
                  opacity: [0.35, 0.12, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: delay,
                }}
                className="absolute inset-0 rounded-full border border-primary/30 dark:border-sky-400/30"
              />
            ))}
          </div>

          {/* Interactive Click Surge Ripples */}
          <AnimatePresence>
            {ripples.map((ripple) => (
              <motion.div
                key={ripple.id}
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2.6, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 rounded-full border-2 border-primary/50 dark:border-sky-400/50 shadow-[0_0_20px_rgba(47,47,228,0.3)] pointer-events-none"
              />
            ))}
          </AnimatePresence>

          {/* Outer Rotating Ring */}
          <div className="absolute -inset-5 rounded-full border border-primary/20 dark:border-white/15 animate-spin-slow pointer-events-none" />

          {/* Inner Core Circle Button */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            className="w-44 h-44 md:w-52 md:h-52 rounded-full border border-white/90 dark:border-white/15 bg-white/90 dark:bg-slate-950/90 shadow-[0_24px_50px_-15px_rgba(47,47,228,0.25)] backdrop-blur-2xl flex flex-col items-center justify-center p-4 text-center relative group"
          >
            {/* Subtle Glow Aura on Hover */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/10 to-sky-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Top Pill Tag */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-extrabold uppercase tracking-widest mb-1.5">
              <Orbit size={11} className="animate-spin-slow" />
              ATIDETO CORE
            </span>

            {/* Center Heading */}
            <h3 className="text-xl md:text-2xl font-black tracking-tight text-[#0F172A] dark:text-white leading-tight">
              Building <br />
              <span className="bg-gradient-to-r from-[#2F2FE4] via-[#0EA5E9] to-[#00D26A] bg-clip-text text-transparent">
                Possibilities
              </span>
            </h3>

            {/* Status Subtext */}
            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-[#64748B] dark:text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D26A] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D26A]" />
              </span>
              Click for Waves
            </div>
          </motion.div>
        </motion.div>

        {/* ================= FLOATING STAGGERED CAPSULES ================= */}

        {/* CAPSULE 1: Top-Left (250+ Projects) */}
        <motion.div
          initial={{ opacity: 0, x: -30, y: -30 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="absolute top-2 left-0 md:left-2 z-20"
        >
          <motion.div
            whileHover={{ scale: 1.06, y: -4 }}
            className="flex items-center gap-3 px-4 py-3 rounded-full md:rounded-2xl border border-white/80 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 shadow-[0_16px_36px_-10px_rgba(15,23,42,0.14)] backdrop-blur-xl transition-all cursor-default"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Zap size={18} />
            </div>
            <div>
              <div className="text-sm font-black text-[#0F172A] dark:text-white tracking-tight">
                250+ Projects
              </div>
              <span className="text-[11px] font-bold text-[#00D26A] block">
                99.8% client trust
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* CAPSULE 2: Top-Right (Global Impact) */}
        <motion.div
          initial={{ opacity: 0, x: 30, y: -30 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="absolute top-0 right-0 md:right-2 z-20"
        >
          <motion.div
            whileHover={{ scale: 1.06, y: -4 }}
            className="flex items-center gap-3 px-4 py-3 rounded-full md:rounded-2xl border border-white/80 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 shadow-[0_16px_36px_-10px_rgba(15,23,42,0.14)] backdrop-blur-xl transition-all cursor-default"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
              <Globe size={18} />
            </div>
            <div>
              <div className="text-sm font-black text-[#0F172A] dark:text-white tracking-tight">
                Global Impact
              </div>
              <span className="text-[11px] font-medium text-[#64748B] dark:text-slate-400 block">
                Salem, TN & Worldwide
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* CAPSULE 3: Bottom-Left (100% In-house Craft) */}
        <motion.div
          initial={{ opacity: 0, x: -30, y: 30 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="absolute bottom-3 left-0 md:left-2 z-20"
        >
          <motion.div
            whileHover={{ scale: 1.06, y: -4 }}
            className="flex items-center gap-3 px-4 py-3 rounded-full md:rounded-2xl border border-white/80 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 shadow-[0_16px_36px_-10px_rgba(15,23,42,0.14)] backdrop-blur-xl transition-all cursor-default"
          >
            {/* Avatar Stack */}
            <div className="flex -space-x-2 overflow-hidden shrink-0">
              <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#2F2FE4] text-[10px] font-extrabold text-white ring-2 ring-white dark:ring-slate-900">
                V
              </div>
              <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#0EA5E9] text-[10px] font-extrabold text-white ring-2 ring-white dark:ring-slate-900">
                N
              </div>
              <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#00D26A] text-[10px] font-extrabold text-white ring-2 ring-white dark:ring-slate-900">
                K
              </div>
            </div>
            <div>
              <div className="text-sm font-black text-[#0F172A] dark:text-white tracking-tight">
                Engineering Craft
              </div>
              <span className="text-[11px] font-bold text-[#00D26A] block">
                100% in-house execution
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* CAPSULE 4: Bottom-Right (10x Velocity with Animated Wave Line) */}
        <motion.div
          initial={{ opacity: 0, x: 30, y: 30 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="absolute bottom-1 right-0 md:right-2 z-20"
        >
          <motion.div
            whileHover={{ scale: 1.06, y: -4 }}
            className="flex items-center gap-3 px-4 py-3 rounded-full md:rounded-2xl border border-white/80 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 shadow-[0_16px_36px_-10px_rgba(15,23,42,0.14)] backdrop-blur-xl transition-all cursor-default"
          >
            <div>
              <span className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 block uppercase">
                Development Velocity
              </span>
              <div className="text-base font-black text-[#0F172A] dark:text-white tracking-tight">
                10x Faster Delivery
              </div>
            </div>

            {/* Mini Wave Graphic */}
            <div className="w-16 h-8 shrink-0">
              <svg viewBox="0 0 70 30" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="miniWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2EA8FF" />
                    <stop offset="50%" stopColor="#2F2FE4" />
                    <stop offset="100%" stopColor="#00D26A" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M 5 25 C 20 22, 30 10, 45 12 C 55 14, 60 4, 65 5"
                  fill="none"
                  stroke="url(#miniWaveGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: 'easeOut', repeat: Infinity, repeatDelay: 1 }}
                />
                <motion.circle
                  cx="65"
                  cy="5"
                  r="3"
                  fill="#00D26A"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1.2, 0.5] }}
                  transition={{ duration: 2, ease: 'easeOut', repeat: Infinity, repeatDelay: 1 }}
                />
              </svg>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
