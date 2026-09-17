import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Sparkles, ShieldCheck, Zap, Globe } from 'lucide-react';

export default function OurVision() {
  return (
    <section className="relative w-full py-24 md:py-32 bg-[#02050E] text-white overflow-hidden border-y border-white/10">
      {/* ── Background Glows and Abstract Grid ── */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] md:w-[1100px] h-[500px] bg-gradient-to-b from-blue-600/15 via-cyan-500/10 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" 
        aria-hidden="true"
      />
      <div 
        className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none -z-10" 
        aria-hidden="true"
      />
      {/* Subtle futuristic grid matrix overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none -z-10" 
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 z-10">
        
        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-20">
          <div className="max-w-2xl text-left">
            {/* Eyebrow Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Purpose & Aspiration
            </motion.div>

            {/* Main Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-montserrat tracking-tight leading-[1.12]"
            >
              Ideas with Purpose <br />
              <span className="bg-gradient-to-r from-[#00F0FF] via-[#38BDF8] to-[#0052FF] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,240,255,0.4)]">
                Build a Better Tomorrow
              </span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-300/80 text-base sm:text-lg max-w-md font-light leading-relaxed text-left md:text-right"
          >
            We turn ideas into meaningful solutions that create value, empower people, and shape a brighter future. Let's grow together.
          </motion.p>
        </div>

        {/* ── Mission & Vision Dual Card Stack ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          
          {/* ── CARD 01: MISSION ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group relative rounded-3xl border border-white/10 bg-[#070c18]/80 hover:bg-[#0a1224]/90 backdrop-blur-[18px] p-8 sm:p-10 transition-all duration-500 shadow-[0_16px_40px_rgba(0,0,0,0.5)] hover:border-cyan-500/40 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] flex flex-col justify-between overflow-hidden"
          >
            {/* Top Accent Gradient Border */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div>
              {/* Header inside Card */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-cyan-400/50 group-hover:text-cyan-400 transition-colors duration-300">
                    01
                  </span>
                  <div className="h-4 w-px bg-white/20" />
                  <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-slate-400 uppercase">
                    Our Mission
                  </span>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover:scale-110 group-hover:rotate-6 group-hover:border-cyan-400 transition-all duration-300">
                  <Target className="w-6 h-6" />
                </div>
              </div>

              {/* Title & Body */}
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-montserrat mb-4 group-hover:text-cyan-200 transition-colors duration-300">
                Mission
              </h3>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 font-light">
                To deliver innovative, reliable, and human-centered solutions that solve real-world problems and make an enduring impact.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/[0.06] transition-all">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                Innovative Architecture
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/[0.06] transition-all">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                Enterprise Reliability
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/[0.06] transition-all">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Measurable Impact
              </span>
            </div>
          </motion.div>

          {/* ── CARD 02: VISION ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative rounded-3xl border border-white/10 bg-[#070c18]/80 hover:bg-[#0a1224]/90 backdrop-blur-[18px] p-8 sm:p-10 transition-all duration-500 shadow-[0_16px_40px_rgba(0,0,0,0.5)] hover:border-blue-500/40 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] flex flex-col justify-between overflow-hidden"
          >
            {/* Top Accent Gradient Border */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div>
              {/* Header inside Card */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-blue-400/50 group-hover:text-blue-400 transition-colors duration-300">
                    02
                  </span>
                  <div className="h-4 w-px bg-white/20" />
                  <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-slate-400 uppercase">
                    Our Vision
                  </span>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:scale-110 group-hover:-rotate-6 group-hover:border-blue-400 transition-all duration-300">
                  <Eye className="w-6 h-6" />
                </div>
              </div>

              {/* Title & Body */}
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-montserrat mb-4 group-hover:text-blue-200 transition-colors duration-300">
                Vision
              </h3>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 font-light">
                To be a trusted technology partner building a smarter, more connected and inclusive future for generations to come.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300 group-hover:border-blue-500/30 group-hover:bg-blue-500/[0.06] transition-all">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                Global Connectivity
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300 group-hover:border-blue-500/30 group-hover:bg-blue-500/[0.06] transition-all">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Inclusive Intelligence
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300 group-hover:border-blue-500/30 group-hover:bg-blue-500/[0.06] transition-all">
                <Zap className="w-3.5 h-3.5 text-blue-400" />
                Future-Proof Scale
              </span>
            </div>
          </motion.div>

        </div>

        {/* ── Bottom Motto Strip ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-3 mt-16 text-xs tracking-[0.25em] uppercase text-slate-400 font-semibold font-mono"
        >
          <span className="h-[2px] w-8 bg-cyan-400 rounded-full" />
          <span>Ideas Today</span>
          <span className="text-slate-600 font-normal">|</span>
          <span>Impact Tomorrow</span>
          <span className="h-[2px] w-8 bg-blue-500 rounded-full" />
        </motion.div>

      </div>
    </section>
  );
}
