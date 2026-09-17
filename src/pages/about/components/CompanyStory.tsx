import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Shield, Compass, Sparkles, ArrowUpRight, Cpu } from 'lucide-react';

export default function CompanyStory() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden bg-[#05070B] text-white py-20 sm:py-24 lg:py-28 px-4 sm:px-8 lg:px-16 border-y border-white/10">
      
      {/* ── Background Subtle Ambient Lighting ── */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[600px] h-[400px] bg-[#0052FF]/10 blur-[140px] pointer-events-none -z-0" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[500px] h-[350px] bg-[#00F0FF]/10 blur-[130px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-between flex-1">
        
        {/* ── TOP EDITORIAL HEADER ROW ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-12 sm:mb-16 lg:mb-20">
          
          {/* Left: Distinctive Editorial Headline with Inline Pill */}
          <div className="lg:col-span-7 text-left">
            <h2 className="font-montserrat tracking-tight leading-[1.12]">
              <span className="text-3xl sm:text-5xl lg:text-[54px] font-light text-slate-300 inline-flex flex-wrap items-center gap-3">
                Where Purposeful Code
                
                {/* Inline 3D Metallic Pill Graphic matching screenshot */}
                <span className="inline-flex items-center justify-center h-8 sm:h-10 px-3 sm:px-4 rounded-full bg-gradient-to-r from-[#1A2644] via-[#2A3E6E] to-[#1E293B] border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.3)] mx-1 select-none align-middle">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-tr from-[#00F0FF] via-[#0052FF] to-white shadow-sm flex items-center justify-center animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </span>
                </span>
              </span>
              <br />
              <span className="text-3xl sm:text-5xl lg:text-[54px] font-black text-white block mt-1">
                Shapes Digital Reality
              </span>
            </h2>
          </div>

          {/* Right: Concise Descriptive Mission Statement */}
          <div className="lg:col-span-5 text-left lg:text-right flex flex-col lg:items-end justify-end">
            <p className="text-slate-400 text-sm sm:text-base lg:text-[15px] leading-relaxed max-w-md font-normal">
              Atideto bridges the frontier between human imagination and enterprise scalability. We engineer high-velocity digital ecosystems that empower companies to automate, build, and lead.
            </p>
          </div>
        </div>

        {/* ── CORE STAGGERED 3D GRID (Matching Screenshot Layout) ── */}
        <div className="flex flex-col gap-6 sm:gap-8 w-full">
          
          {/* ── ROW 1: Wide Top Card (Mission) + Right Metric Block ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
            
            {/* Top Left Card: OUR MISSION (~64% width on desktop) */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
              onMouseEnter={() => setHoveredCard('mission')}
              onMouseLeave={() => setHoveredCard(null)}
              className="lg:col-span-8 rounded-[28px] sm:rounded-[36px] bg-[#090D1A]/90 border border-white/10 p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] group flex flex-col justify-between min-h-[340px] sm:min-h-[380px]"
            >
              {/* 3D Geometric Architectural Scene Graphic inside Card */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
                <svg className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-500" viewBox="0 0 800 400" fill="none">
                  <defs>
                    <linearGradient id="coralBlock" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0052FF" stopOpacity="0.4" />
                    </linearGradient>
                    <linearGradient id="purpleCube" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#4338CA" stopOpacity="0.3" />
                    </linearGradient>
                    <linearGradient id="neonGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>

                  {/* Inclined 3D Architectural Ramp/Block with cylindrical cutouts */}
                  <g transform="translate(180, 40) rotate(-4)">
                    <path
                      d="M 100 80 L 480 30 L 520 180 L 140 230 Z"
                      fill="url(#coralBlock)"
                      stroke="rgba(59,130,246,0.3)"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 140 230 L 520 180 L 520 220 L 140 270 Z"
                      fill="#0B132B"
                      stroke="rgba(59,130,246,0.2)"
                    />
                    {/* Cylindrical void in block */}
                    <ellipse cx="240" cy="135" rx="28" ry="18" fill="#05070B" stroke="#00F0FF" strokeWidth="1.5" />
                    <ellipse cx="240" cy="142" rx="24" ry="14" fill="#0052FF" fillOpacity="0.2" />
                  </g>

                  {/* 3D Floating Geometric Solids */}
                  {/* Purple Cube */}
                  <g transform="translate(520, 90)">
                    <path d="M 50 10 L 110 30 L 60 70 L 0 50 Z" fill="url(#purpleCube)" />
                    <path d="M 0 50 L 60 70 L 60 130 L 0 110 Z" fill="#1E1B4B" />
                    <path d="M 60 70 L 110 30 L 110 90 L 60 130 Z" fill="#312E81" />
                  </g>

                  {/* Neon Cyan Cylinder */}
                  <g transform="translate(480, 210)">
                    <path d="M 0 20 L 0 60 C 0 80, 60 80, 60 60 L 60 20 Z" fill="#0C1B33" stroke="rgba(0,240,255,0.4)" />
                    <ellipse cx="30" cy="20" rx="30" ry="15" fill="#00F0FF" fillOpacity="0.8" />
                  </g>

                  {/* Subtle Grid Floor Plane */}
                  <line x1="100" y1="320" x2="700" y2="320" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                  <line x1="150" y1="360" x2="650" y2="360" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
                </svg>
              </div>

              {/* Mission Badge & Header */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[#38BDF8] text-xs font-bold tracking-wider uppercase backdrop-blur-md">
                  <Target size={14} className="text-[#38BDF8]" />
                  <span>Our Mission</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-blue-600 transition-all">
                  <ArrowUpRight size={16} />
                </div>
              </div>

              {/* Mission Statement Content */}
              <div className="relative z-10 max-w-lg mt-auto pt-16 sm:pt-20 text-left">
                <h3 className="text-2xl sm:text-3xl font-extrabold font-montserrat tracking-tight mb-3 text-white">
                  Democratizing Elite Software & Tech Intelligence
                </h3>
                <p className="text-slate-300/90 text-sm sm:text-base leading-relaxed">
                  To deliver premium, scalable, and intelligent software solutions while democratizing quality tech education worldwide.
                </p>
              </div>
            </motion.div>

            {/* Top Right Metric Block (~36% width on desktop) */}
            <div className="lg:col-span-4 rounded-[28px] sm:rounded-[36px] bg-[#090D1A]/60 border border-white/10 p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden group hover:border-blue-500/30 transition-all">
              
              {/* Top Row: Metric */}
              <div>
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black font-montserrat tracking-tight text-white group-hover:text-[#38BDF8] transition-colors">
                  +2K
                </div>
                <div className="text-xs sm:text-[13px] font-bold tracking-[0.18em] uppercase text-slate-400 mt-2">
                  TALENT MENTORED
                </div>
              </div>

              {/* Bottom Decorative Stylized Emblem (Matching the bird/monogram in screenshot) */}
              <div className="flex items-center justify-between mt-12 sm:mt-16 pt-4 border-t border-white/5">
                <span className="text-xs text-slate-500 font-medium tracking-wide">
                  Global Alumni Network
                </span>
                <div className="text-[#38BDF8] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                  <svg className="w-8 h-6" viewBox="0 0 40 24" fill="none">
                    <path
                      d="M 2 8 C 12 18, 18 20, 20 8 C 22 20, 28 18, 38 8"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

          </div>

          {/* ── ROW 2: Left Info/Logos Strip + Staggered Right Card (Vision) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
            
            {/* Bottom Left Info / Proof Strip (~46% width on desktop) */}
            <div className="lg:col-span-5 rounded-[28px] sm:rounded-[36px] bg-[#090D1A]/60 border border-white/10 p-6 sm:p-8 flex flex-col justify-between text-left group hover:border-blue-500/30 transition-all">
              
              {/* Top Row: PRO'S CHOICE + Dial Icon */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold tracking-[0.2em] uppercase text-slate-400 mb-1">
                    ENTERPRISE GRADE
                  </div>
                  <div className="text-xl sm:text-2xl font-black font-montserrat tracking-tight text-white">
                    PRO'S CHOICE
                  </div>
                </div>

                {/* Compass / Dial Graphic matching screenshot */}
                <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-400/30 flex items-center justify-center relative">
                  <div className="w-4 h-4 rounded-full border-t-2 border-r-2 border-[#00F0FF] animate-spin" />
                  <span className="absolute text-[#38BDF8] text-[10px]">✦</span>
                </div>
              </div>

              {/* Middle / Bottom: Tech Stack Brands & Delivery Metric */}
              <div className="flex flex-wrap items-end justify-between gap-4 mt-8 pt-6 border-t border-white/5">
                {/* Tech Partners / Stack list */}
                <div className="flex items-center gap-3 sm:gap-4 text-xs font-semibold text-slate-400 tracking-wider">
                  <span className="hover:text-white transition-colors">AWS</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span className="hover:text-white transition-colors">GCP</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span className="hover:text-white transition-colors">REACT</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span className="hover:text-white transition-colors">AI</span>
                </div>

                {/* Metric: +100 Projects */}
                <div className="text-right">
                  <div className="text-3xl sm:text-4xl font-black font-montserrat text-white">
                    +100
                  </div>
                  <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                    PROJECTS
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Right Card: OUR VISION (~54% width on desktop, staggered) ── */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
              onMouseEnter={() => setHoveredCard('vision')}
              onMouseLeave={() => setHoveredCard(null)}
              className="lg:col-span-7 rounded-[28px] sm:rounded-[36px] bg-[#090D1A]/90 border border-white/10 p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] group flex flex-col justify-between min-h-[340px] sm:min-h-[380px]"
            >
              {/* 3D Geometric Architectural Scene Graphic inside Vision Card */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
                <svg className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-500" viewBox="0 0 700 400" fill="none">
                  <defs>
                    <linearGradient id="podiumGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#1E293B" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#0F172A" stopOpacity="0.4" />
                    </linearGradient>
                    <linearGradient id="neonCylinder" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#312E81" stopOpacity="0.3" />
                    </linearGradient>
                    <linearGradient id="coralCone" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0052FF" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>

                  {/* Stepped Architectural Podiums */}
                  <g transform="translate(180, 80)">
                    <path d="M 0 100 L 160 50 L 320 100 L 160 150 Z" fill="url(#podiumGrad)" stroke="rgba(255,255,255,0.1)" />
                    <path d="M 0 100 L 160 150 L 160 210 L 0 160 Z" fill="#0A0F1D" />
                    <path d="M 160 150 L 320 100 L 320 160 L 160 210 Z" fill="#070A14" />
                  </g>

                  {/* Vibrant Purple/Indigo Cylinder on Podium */}
                  <g transform="translate(300, 110)">
                    <path d="M 0 30 L 0 90 C 0 120, 70 120, 70 90 L 70 30 Z" fill="url(#neonCylinder)" stroke="rgba(99,102,241,0.5)" />
                    <ellipse cx="35" cy="30" rx="35" ry="18" fill="#818CF8" />
                  </g>

                  {/* Cyan Glowing Pyramid / Triangle Prism */}
                  <g transform="translate(240, 160)">
                    <polygon points="40,10 90,90 0,90" fill="url(#coralCone)" stroke="#00F0FF" strokeWidth="1.5" />
                  </g>

                  {/* Floating Sphere */}
                  <g transform="translate(420, 70)">
                    <circle cx="35" cy="35" r="30" fill="url(#coralCone)" />
                    <ellipse cx="26" cy="24" rx="8" ry="5" fill="white" fillOpacity="0.6" />
                  </g>
                </svg>
              </div>

              {/* Vision Badge & Header */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[#38BDF8] text-xs font-bold tracking-wider uppercase backdrop-blur-md">
                  <Shield size={14} className="text-[#38BDF8]" />
                  <span>Our Vision</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-blue-600 transition-all">
                  <ArrowUpRight size={16} />
                </div>
              </div>

              {/* Vision Statement Content */}
              <div className="relative z-10 max-w-lg mt-auto pt-16 sm:pt-20 text-left">
                <h3 className="text-2xl sm:text-3xl font-extrabold font-montserrat tracking-tight mb-3 text-white">
                  Engineering the Autonomous Digital Frontier
                </h3>
                <p className="text-slate-300/90 text-sm sm:text-base leading-relaxed">
                  Engineering the digital future by bridging the gap between cutting-edge technology and human-centric design.
                </p>
              </div>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}
