import React from 'react';
import { motion } from 'framer-motion';

const VISION_PILLARS = [
  {
    index: '01',
    title: 'Intelligent Scale',
    description: 'Engineering resilient, scalable architectures designed to evolve seamlessly with global enterprise demands.'
  },
  {
    index: '02',
    title: 'Human-Centered',
    description: 'Transforming complex engineering into intuitive, empowering digital systems that drive measurable real-world value.'
  },
  {
    index: '03',
    title: 'Enduring Impact',
    description: 'Committed to technological rigor, zero-compromise security, and long-term partnership that stands the test of time.'
  }
];

export default function OurVision() {
  return (
    <section className="relative w-full py-20 sm:py-28 lg:py-36 bg-[#05070B] text-white overflow-hidden">
      {/* ── Luminous Ambient Center Glow ── */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] lg:w-[1100px] h-[350px] md:h-[480px] bg-gradient-to-b from-[#0052FF]/15 via-[#00F0FF]/10 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" 
        aria-hidden="true"
      />

      {/* ── Minimalist Geometric Mesh ── */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none -z-10" 
        aria-hidden="true"
      />

      {/* ── Soft Edge Fade Masks ── */}
      <div className="absolute top-0 inset-x-0 h-16 sm:h-24 bg-gradient-to-b from-[#05070B] to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-16 sm:h-24 bg-gradient-to-t from-[#05070B] to-transparent pointer-events-none z-10" />

      <div className="relative max-w-6xl mx-auto w-full px-6 sm:px-10 lg:px-12 z-10">
        
        {/* ── Vision Header & Core Manifesto ── */}
        <div className="text-left max-w-3xl mb-16 sm:mb-20 lg:mb-24">
          
          {/* Minimal Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-6 select-none"
          >
            <span className="w-8 sm:w-10 h-[1.5px] bg-[#0052FF] shrink-0" />
            <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase font-heading text-[#2EA8FF]">
              OUR VISION
            </span>
          </motion.div>

          {/* Main Vision Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[28px] sm:text-[36px] font-bold tracking-tight leading-[1.2] mb-6 text-white font-heading"
          >
            Ideas with Purpose.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#38BDF8] to-[#0052FF] drop-shadow-[0_0_30px_rgba(0,240,255,0.35)]">
              Built to Endure.
            </span>
          </motion.h2>

          {/* Focused Vision Statement */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="editorial-sub text-slate-300/90 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl text-left"
          >
            To be the trusted technology partner empowering visionary organizations to build intelligent, resilient, and human-centered software that shapes tomorrow.
          </motion.p>
        </div>

        {/* ── Mobile View (< md): Single Column Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:hidden w-full border border-white/10 rounded-2xl overflow-hidden bg-[#070C18]/75 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
        >
          <table className="w-full text-left border-collapse">
            <tbody className="divide-y divide-white/10">
              {VISION_PILLARS.map((pillar) => (
                <tr key={pillar.index} className="transition-colors active:bg-white/[0.04]">
                  <td className="p-5 sm:p-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="font-mono text-cyan-400 text-sm font-extrabold tracking-wider shrink-0">
                        {pillar.index}.
                      </span>
                      <span className="text-base sm:text-lg font-bold font-heading text-white tracking-tight">
                        {pillar.title}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light pl-6">
                      {pillar.description}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* ── Desktop View (md+): Architectural 3-Column Focus Frame ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="hidden md:block border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden bg-[#070C18]/60 backdrop-blur-md shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
        >
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {VISION_PILLARS.map((pillar) => (
              <div
                key={pillar.index}
                className="group p-8 sm:p-10 lg:p-12 flex flex-col justify-between hover:bg-white/[0.02] transition-colors duration-300"
              >
                <div>
                  {/* Monospaced Index Accent */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="font-mono text-xs font-bold tracking-widest text-cyan-400 group-hover:text-cyan-300 transition-colors">
                      {pillar.index}
                    </span>
                    <div className="w-6 h-px bg-cyan-400/40 group-hover:w-10 group-hover:bg-cyan-400 transition-all duration-300" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-heading tracking-tight group-hover:text-cyan-200 transition-colors">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 text-sm sm:text-[15px] leading-relaxed font-light">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
