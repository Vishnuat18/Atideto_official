import React from 'react';
import { motion } from 'framer-motion';
import { Puzzle, Search, Lightbulb, ShieldCheck, Target, LucideIcon } from 'lucide-react';

interface Principle {
  id: string;
  title: string;
  icon: LucideIcon;
  direction: 'left' | 'right';
  description: string;
  nodeX: string;
  nodeY: string;
}

const PRINCIPLES: Principle[] = [
  {
    id: '01',
    title: 'PROBLEM SOLVER',
    icon: Puzzle,
    direction: 'left',
    description: 'We love solving real-world problems with practical and scalable technology.',
    nodeX: '46.5%',
    nodeY: '10%'
  },
  {
    id: '02',
    title: 'CURIOSITY',
    icon: Search,
    direction: 'right',
    description: 'We love questioning, learning and exploring new possibilities.',
    nodeX: '53.5%',
    nodeY: '30%'
  },
  {
    id: '03',
    title: 'INNOVATION',
    icon: Lightbulb,
    direction: 'left',
    description: 'We build smart, future-ready and impactful solutions that create a difference.',
    nodeX: '46.5%',
    nodeY: '50%'
  },
  {
    id: '04',
    title: 'OWNERSHIP',
    icon: ShieldCheck,
    direction: 'right',
    description: 'We take complete ownership of our work and our commitments.',
    nodeX: '53.5%',
    nodeY: '70%'
  },
  {
    id: '05',
    title: 'IMPACT FIRST',
    icon: Target,
    direction: 'left',
    description: 'We measure success by the impact we create for people and businesses.',
    nodeX: '46.5%',
    nodeY: '90%'
  },
];

export default function OurDNA() {
  return (
    <section id="our-dna" className="relative w-full py-20 md:py-28 bg-[#05070B] overflow-hidden text-white">
      {/* ── Background Ambience Glow ── */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] md:w-[950px] h-[450px] bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-indigo-600/10 blur-[140px] rounded-full pointer-events-none -z-10" 
        aria-hidden="true"
      />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-18">
          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Our DNA
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] mb-5 font-montserrat"
          >
            The Principles That{' '}
            <span className="bg-gradient-to-r from-[#0052FF] via-[#00F0FF] to-[#38BDF8] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,240,255,0.45)]">
              Drive Us
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-light"
          >
            The foundational ethos underpinning every engineering standard, creative exploration, and high-stakes partnership we forge.
          </motion.p>
        </div>

        {/* ── 2. Rounded Container Stack (Matching Attached Image 2) ── */}
        <div className="relative rounded-[28px] sm:rounded-[36px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#070D1D] shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-2xl overflow-hidden divide-y divide-slate-100 dark:divide-white/10">
          
          {/* ── Desktop Continuous Zig-Zag Connecting Line (md+ only) ── */}
          <svg
            className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-10"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <polyline
              points="48.5,0 46.5,10 53.5,30 46.5,50 53.5,70 46.5,90 48.5,100"
              fill="none"
              stroke="currentColor"
              className="text-slate-700 dark:text-slate-400"
              strokeWidth="0.35"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* ── Desktop Center Circular Nodes at Zig-Zag Apexes (md+ only) ── */}
          {PRINCIPLES.map((principle) => {
            const Icon = principle.icon;
            return (
              <div
                key={`node-${principle.id}`}
                style={{
                  top: principle.nodeY,
                  left: principle.nodeX,
                }}
                className="hidden md:flex absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
              >
                <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-full bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-white/20 shadow-md ring-4 ring-white dark:ring-[#070D1D] flex items-center justify-center text-[#2563EB] dark:text-[#38BDF8]">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                </div>
              </div>
            );
          })}

          {/* ── 5 Rows Content ── */}
          {PRINCIPLES.map((principle) => {
            const isLeftTitle = principle.direction === 'left';
            const Icon = principle.icon;

            return (
              <div
                key={principle.id}
                className="relative z-10 transition-colors duration-200 hover:bg-slate-50/70 dark:hover:bg-white/[0.02]"
              >
                {/* ── Desktop View (md+) ── */}
                <div className="hidden md:grid md:grid-cols-12 items-center py-7 sm:py-8 px-8 sm:px-12">
                  {isLeftTitle ? (
                    <>
                      {/* Left: Number + Title (e.g. 01 PROBLEM SOLVER) */}
                      <div className="col-span-5 flex items-center gap-3.5 pr-4">
                        <span className="text-3xl sm:text-4xl font-extrabold text-[#0B1528] dark:text-white font-montserrat tracking-tight">
                          {principle.id}
                        </span>
                        <span className="text-sm sm:text-base font-extrabold tracking-wider text-[#0B1528] dark:text-white uppercase font-montserrat">
                          {principle.title}
                        </span>
                      </div>

                      {/* Middle Spacer for Node */}
                      <div className="col-span-2" />

                      {/* Right: Italicized Description */}
                      <div className="col-span-5 text-right pl-4">
                        <p className="italic text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                          "{principle.description}"
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Left: Italicized Description */}
                      <div className="col-span-5 text-left pr-4">
                        <p className="italic text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                          "{principle.description}"
                        </p>
                      </div>

                      {/* Middle Spacer for Node */}
                      <div className="col-span-2" />

                      {/* Right: Title + Number (e.g. CURIOSITY 02) */}
                      <div className="col-span-5 flex items-center justify-end gap-3.5 pl-4">
                        <span className="text-sm sm:text-base font-extrabold tracking-wider text-[#0B1528] dark:text-white uppercase font-montserrat">
                          {principle.title}
                        </span>
                        <span className="text-3xl sm:text-4xl font-extrabold text-[#0B1528] dark:text-white font-montserrat tracking-tight">
                          {principle.id}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* ── Mobile View (< md) ── */}
                <div className="md:hidden py-5 px-5 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl font-extrabold text-[#0B1528] dark:text-white font-montserrat">
                        {principle.id}
                      </span>
                      <span className="text-xs font-extrabold tracking-wider text-[#0B1528] dark:text-white uppercase font-montserrat">
                        {principle.title}
                      </span>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-[#2563EB] dark:text-[#38BDF8] shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <p className="italic text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                    "{principle.description}"
                  </p>
                </div>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
