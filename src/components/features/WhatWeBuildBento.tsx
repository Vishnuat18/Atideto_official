import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Image as ImageIcon,
  Video,
  Volume2,
  Plus,
  Users,
  Camera,
  Layers,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export default function WhatWeBuildBento() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ALL' | 'WEB' | 'APP' | 'CLOUD'>('ALL');
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="w-full my-8 selection:bg-[#00F0FF] selection:text-black font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">

        {/* ── RIGHT COLUMN: Top Wide Card 2 + Bottom Cards 3 & 4            ── */}
        {/* ── LEFT COLUMN: Web & App development + Bottom Cards 3 & 4       ── */}
        <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6">

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* ── CARD 2: Web & App development (Top Wide Dark Canvas)          ── */}
          {/* ───────────────────────────────────────────────────────────────── */}
          <div
            onClick={() => navigate('/services/service-03')}
            className="reveal-scale delay-150 group cursor-pointer relative overflow-hidden rounded-[28px] sm:rounded-[32px] bg-[#07090E] border border-white/10 hover:border-white/20 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.5)] min-h-[300px]"
          >
            {/* Dot Matrix Canvas Pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.22) 1.2px, transparent 1.2px)',
                backgroundSize: '18px 18px'
              }}
            />

            {/* Glowing Bezier Node Wire SVG Background */}
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 700 320" fill="none" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="canvasPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00F0FF" />
                    <stop offset="45%" stopColor="#3B82F6" />
                    <stop offset="80%" stopColor="#2EA8FF" />
                    <stop offset="100%" stopColor="#0052FF" />
                  </linearGradient>
                  <filter id="canvasGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path
                  d="M 50 160 C 220 160, 260 215, 420 225 C 540 232, 590 190, 680 180"
                  stroke="url(#canvasPathGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  filter="url(#canvasGlow)"
                />
              </svg>
            </div>

            {/* Top Text Header */}
            <div className="relative z-10 max-w-xl mb-6">
              <h3
                className="text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug mb-2 font-heading"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Web & App development
              </h3>
              <p
                className="text-[#94A3B8] text-xs sm:text-sm leading-relaxed font-normal"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Every tool, ready to go. Web, mobile, cloud, APIs—thirty frameworks, no setup. Open what you need, make what you want.
              </p>
            </div>

            {/* Interactive Node Layout Elements (Matches Reference 1 Canvas) */}
            <div className="relative z-10 w-full flex items-center justify-end gap-4 mt-2">
              
              {/* Node 1: Supercar / Hero Card */}
              <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#0D121F] w-[130px] sm:w-[150px] aspect-[4/3] shadow-[0_10px_25px_rgba(0,0,0,0.6)] group-hover:scale-[1.03] transition-transform">
                {/* Node icon top-left */}
                <div className="absolute top-1.5 left-1.5 z-10 w-5 h-5 rounded-md bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                  <ImageIcon size={10} />
                </div>

                {/* Right Plus Connector Badge */}
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center text-white/80 shadow-md">
                  <Plus size={10} />
                </div>

                {/* Supercar Artwork SVG */}
                <svg viewBox="0 0 200 150" className="w-full h-full object-cover">
                  <defs>
                    <linearGradient id="carBodyBento" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e293b" />
                      <stop offset="45%" stopColor="#dc2626" />
                      <stop offset="100%" stopColor="#7f1d1d" />
                    </linearGradient>
                  </defs>
                  <rect width="200" height="150" fill="#080C14" />
                  <ellipse cx="100" cy="130" rx="80" ry="12" fill="#ef4444" opacity="0.3" />
                  <path d="M 30 110 Q 50 85 90 82 Q 130 80 170 100 Q 185 108 175 118 L 35 118 Z" fill="url(#carBodyBento)" />
                  <path d="M 75 83 Q 95 65 125 68 Q 145 70 155 83 Z" fill="#38bdf8" opacity="0.8" />
                  <ellipse cx="38" cy="108" rx="7" ry="2.5" fill="#38bdf8" />
                  <ellipse cx="170" cy="110" rx="7" ry="2.5" fill="#ef4444" />
                  <circle cx="58" cy="118" r="13" fill="#0f172a" stroke="#64748b" strokeWidth="2.5" />
                  <circle cx="150" cy="118" r="13" fill="#0f172a" stroke="#64748b" strokeWidth="2.5" />
                </svg>
              </div>

              {/* Node 2: Dynamic Cyclist / Runner Card */}
              <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#0D121F] w-[130px] sm:w-[150px] aspect-[4/3] shadow-[0_10px_25px_rgba(0,0,0,0.6)] group-hover:scale-[1.03] transition-transform">
                {/* Node video icon on the line */}
                <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-[#0052FF] border border-white/20 flex items-center justify-center text-white shadow-md">
                  <Video size={10} />
                </div>

                {/* Cyclist / Racer Artwork SVG */}
                <svg viewBox="0 0 200 150" className="w-full h-full object-cover">
                  <defs>
                    <radialGradient id="cyclistGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <rect width="200" height="150" fill="#080C14" />
                  <circle cx="100" cy="75" r="60" fill="url(#cyclistGlow)" />
                  {/* Neon bicycle wheels & racer */}
                  <circle cx="65" cy="110" r="24" fill="none" stroke="#22d3ee" strokeWidth="3" opacity="0.85" />
                  <circle cx="140" cy="110" r="24" fill="none" stroke="#f43f5e" strokeWidth="3" opacity="0.85" />
                  <circle cx="100" cy="55" r="10" fill="#10b981" />
                  <path d="M 65 110 L 95 90 L 125 90 L 140 110 L 110 110 Z" stroke="#ffffff" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                  <path d="M 95 90 L 100 55" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>

              {/* Collaborator Cursor Badges: Marina (Pink) & Paolo (Blue) */}
              <div className="absolute bottom-1 right-20 sm:right-28 flex items-center gap-1 bg-[#EC4899] text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-lg animate-bounce">
                <span className="text-[9px]">▲</span>
                <span>Marina</span>
              </div>

              <div className="absolute top-2 right-4 flex items-center gap-1 bg-[#3B82F6] text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-lg">
                <span className="text-[9px]">▲</span>
                <span>Paolo</span>
              </div>

            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* ── BOTTOM ROW: Card 3 (Digital Marketing) & Card 4 (UI Design)   ── */}
          {/* ───────────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 flex-1">

            {/* ── CARD 3: Digital Marketing (Updated as per 2nd Reference Image) ──────── */}
            <div
              onClick={() => navigate('/services/service-05')}
              className="reveal-scale delay-200 group cursor-pointer relative overflow-hidden rounded-[28px] sm:rounded-[32px] bg-[#0057FF] hover:bg-[#004FE0] border border-white/20 hover:border-white/35 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between shadow-[0_12px_36px_rgba(0,87,255,0.35)] hover:shadow-[0_16px_48px_rgba(0,87,255,0.5)] min-h-[320px]"
            >
              {/* Top-Right 9-Dot Matrix Icon (Matches 2nd Reference Image) */}
              <div className="flex justify-end w-full relative z-10">
                <div className="grid grid-cols-3 gap-1.5 p-1 select-none">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/70 shadow-sm" />
                  ))}
                </div>
              </div>

              {/* Center Visual: Floating 3D Isometric Illustration (Matches 2nd Reference Image) */}
              <div className="relative z-10 my-auto py-2 flex items-center justify-center">
                <svg
                  viewBox="0 0 320 200"
                  className="w-full max-w-[260px] h-auto select-none transition-transform duration-300 group-hover:scale-105"
                  fill="none"
                >
                  <defs>
                    {/* Shadow & Glow Gradients */}
                    <radialGradient id="cardShadowGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#002D8C" stopOpacity="0.8" />
                      <stop offset="60%" stopColor="#0035A8" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#0057FF" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="facetTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#E0EEFF" />
                    </linearGradient>
                    <linearGradient id="facetLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0044D0" />
                      <stop offset="100%" stopColor="#0032A0" />
                    </linearGradient>
                    <linearGradient id="facetRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7EBAFF" />
                      <stop offset="100%" stopColor="#4A9CFF" />
                    </linearGradient>
                  </defs>

                  {/* Ground Ellipse Shadow & Concentric Contour */}
                  <ellipse cx="160" cy="132" rx="72" ry="18" fill="url(#cardShadowGlow)" />
                  <ellipse cx="160" cy="132" rx="54" ry="13" fill="none" stroke="#003AA8" strokeWidth="2.5" strokeDasharray="6,4" opacity="0.75" />

                  {/* Connecting Data Cables (from central cube to satellite badges) */}
                  {/* To Top-Left (Cloud) */}
                  <path d="M 140 76 L 98 48" stroke="#0B132B" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 140 76 L 98 48" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.9" />

                  {/* To Top-Right (Database) */}
                  <path d="M 180 76 L 222 48" stroke="#0B132B" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 180 76 L 222 48" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.9" />

                  {/* To Mid-Left (Monitor) */}
                  <path d="M 132 94 L 78 98" stroke="#0B132B" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 132 94 L 78 98" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.9" />

                  {/* To Mid-Right (Gear) */}
                  <path d="M 188 94 L 242 98" stroke="#0B132B" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 188 94 L 242 98" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.9" />

                  {/* To Bottom-Left (Mobile Screen) */}
                  <path d="M 142 118 L 98 140" stroke="#0B132B" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 142 118 L 98 140" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.9" />

                  {/* To Bottom-Right (Globe) */}
                  <path d="M 178 118 L 222 140" stroke="#0B132B" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 178 118 L 222 140" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.9" />

                  {/* ── Central Isometric API Cube ── */}
                  {/* Energy Ticks above cube */}
                  <line x1="160" y1="42" x2="160" y2="34" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="152" y1="44" x2="146" y2="38" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="168" y1="44" x2="174" y2="38" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Left Facet */}
                  <polygon points="128,74 160,92 160,126 128,108" fill="url(#facetLeftGrad)" stroke="#0B132B" strokeWidth="2.8" strokeLinejoin="round" />

                  {/* Right Facet */}
                  <polygon points="160,92 192,74 192,108 160,126" fill="url(#facetRightGrad)" stroke="#0B132B" strokeWidth="2.8" strokeLinejoin="round" />

                  {/* Top Facet */}
                  <polygon points="160,56 192,74 160,92 128,74" fill="url(#facetTopGrad)" stroke="#0B132B" strokeWidth="2.8" strokeLinejoin="round" />

                  {/* Symbol on Top Facet: < / > code icon */}
                  <path d="M 152 70 L 147 74 L 152 78" stroke="#0052FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 168 70 L 173 74 L 168 78" stroke="#0052FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="162" y1="69" x2="158" y2="79" stroke="#0052FF" strokeWidth="1.8" strokeLinecap="round" />

                  {/* Front Left Text: "API" */}
                  <text x="144" y="104" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" transform="skewY(18)">
                    API
                  </text>

                  {/* Right Facet Connector Circle */}
                  <circle cx="178" cy="100" r="4.5" fill="#0035A8" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="178" cy="100" r="2" fill="#FFFFFF" />

                  {/* ── 6 Satellite Floating Nodes ── */}
                  {/* 1. Top-Left: Cloud Node */}
                  <g transform="translate(68, 26)">
                    <rect width="30" height="26" rx="6" fill="#FFFFFF" stroke="#0B132B" strokeWidth="2.5" />
                    <path d="M 11 17 A 4 4 0 0 1 11 11 A 5.5 5.5 0 0 1 20 10 A 4.5 4.5 0 0 1 22 17 Z" fill="#0052FF" />
                  </g>

                  {/* 2. Top-Right: Database Node */}
                  <g transform="translate(222, 26)">
                    <rect width="30" height="26" rx="6" fill="#FFFFFF" stroke="#0B132B" strokeWidth="2.5" />
                    <ellipse cx="15" cy="9" rx="7" ry="2.5" fill="#0052FF" />
                    <path d="M 8 9 L 8 13 C 8 14.5 11 15.5 15 15.5 C 19 15.5 22 14.5 22 13 L 22 9" stroke="#0052FF" strokeWidth="1.8" fill="none" />
                    <path d="M 8 13 L 8 17 C 8 18.5 11 19.5 15 19.5 C 19 19.5 22 18.5 22 17 L 22 13" stroke="#0052FF" strokeWidth="1.8" fill="none" />
                  </g>

                  {/* 3. Mid-Left: Monitor Screen Node */}
                  <g transform="translate(48, 84)">
                    <rect width="30" height="26" rx="6" fill="#FFFFFF" stroke="#0B132B" strokeWidth="2.5" />
                    <rect x="7" y="7" width="16" height="11" rx="1.5" fill="#0052FF" />
                    <line x1="12" y1="20" x2="18" y2="20" stroke="#0052FF" strokeWidth="1.8" />
                    <line x1="15" y1="18" x2="15" y2="20" stroke="#0052FF" strokeWidth="1.8" />
                  </g>

                  {/* 4. Mid-Right: Settings Gear Node */}
                  <g transform="translate(242, 84)">
                    <rect width="30" height="26" rx="6" fill="#FFFFFF" stroke="#0B132B" strokeWidth="2.5" />
                    <circle cx="15" cy="13" r="5" fill="none" stroke="#0052FF" strokeWidth="2.2" />
                    <circle cx="15" cy="13" r="2" fill="#0052FF" />
                    <line x1="15" y1="6" x2="15" y2="8" stroke="#0052FF" strokeWidth="2.2" strokeLinecap="round" />
                    <line x1="15" y1="18" x2="15" y2="20" stroke="#0052FF" strokeWidth="2.2" strokeLinecap="round" />
                    <line x1="8" y1="13" x2="10" y2="13" stroke="#0052FF" strokeWidth="2.2" strokeLinecap="round" />
                    <line x1="20" y1="13" x2="22" y2="13" stroke="#0052FF" strokeWidth="2.2" strokeLinecap="round" />
                  </g>

                  {/* 5. Bottom-Left: Device Screen Node */}
                  <g transform="translate(68, 134)">
                    <rect width="30" height="26" rx="6" fill="#FFFFFF" stroke="#0B132B" strokeWidth="2.5" />
                    <rect x="9" y="6" width="12" height="14" rx="2" fill="none" stroke="#0052FF" strokeWidth="1.8" />
                    <circle cx="15" cy="17" r="1" fill="#0052FF" />
                  </g>

                  {/* 6. Bottom-Right: Globe Network Node */}
                  <g transform="translate(222, 134)">
                    <rect width="30" height="26" rx="6" fill="#FFFFFF" stroke="#0B132B" strokeWidth="2.5" />
                    <circle cx="15" cy="13" r="6.5" fill="none" stroke="#0052FF" strokeWidth="1.8" />
                    <ellipse cx="15" cy="13" rx="3.5" ry="6.5" fill="none" stroke="#0052FF" strokeWidth="1.2" />
                    <line x1="8.5" y1="13" x2="21.5" y2="13" stroke="#0052FF" strokeWidth="1.2" />
                  </g>
                </svg>
              </div>

              {/* Bottom Text Area: Title + Subtitle (Matches 2nd Reference Image) */}
              <div className="relative z-10 mt-auto pt-2">
                <h3
                  className="text-[22px] sm:text-[24px] font-bold text-white tracking-tight leading-snug mb-1 font-heading"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Digital Marketing
                </h3>
                <p
                  className="text-white/85 text-xs sm:text-sm leading-relaxed font-normal font-sans"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Context-aware conversational workflows, multi-channel growth funnels, and automated campaign attribution.
                </p>
              </div>
            </div>

            {/* ── CARD 4: UI Design & Branding (Deep Ocean Blue with Neon Run App Button) ── */}
            <div
              onClick={() => navigate('/services/service-07')}
              className="reveal-scale delay-250 group cursor-pointer relative overflow-hidden rounded-[28px] sm:rounded-[32px] bg-[#073852] hover:bg-[#08415F] border border-[#0284C7]/30 hover:border-[#38BDF8]/40 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.5)] min-h-[300px]"
            >
              {/* Subtle Cyan ambient glow */}
              <div className="absolute top-0 right-0 w-52 h-52 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Text Header */}
              <div className="relative z-10 mb-4">
                <h3
                  className="text-[20px] sm:text-[23px] font-bold text-white tracking-tight leading-snug mb-2 font-heading"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  UI Design & Branding
                </h3>
                <p
                  className="text-[#E2E8F0]/80 text-xs sm:text-sm leading-relaxed font-normal"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Workflow in one click. Save any complex on-brand design system or workflow as an App. The next person runs it in one click.
                </p>
              </div>

              {/* Visual Area: Athlete with Basketball Silhouette + Neon "RUN APP" Button */}
              <div className="relative z-10 flex items-center justify-between mt-auto pt-2">
                
                {/* Basketball Player Silhouette SVG */}
                <div className="w-28 sm:w-32 aspect-square relative">
                  <svg viewBox="0 0 200 200" className="w-full h-full object-contain">
                    <defs>
                      <radialGradient id="bballGlow" cx="40%" cy="30%" r="50%">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.9" />
                        <stop offset="60%" stopColor="#ea580c" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#c2410c" stopOpacity="0" />
                      </radialGradient>
                      <radialGradient id="playerLight" cx="60%" cy="65%" r="55%">
                        <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#9a3412" stopOpacity="0.2" />
                      </radialGradient>
                    </defs>
                    
                    {/* Basketball */}
                    <circle cx="70" cy="50" r="24" fill="url(#bballGlow)" />
                    <circle cx="70" cy="50" r="20" fill="#ea580c" />
                    <path d="M 50 50 Q 70 30 90 50" stroke="#7c2d12" strokeWidth="2" fill="none" />
                    <path d="M 50 50 Q 70 70 90 50" stroke="#7c2d12" strokeWidth="2" fill="none" />
                    <line x1="70" y1="30" x2="70" y2="70" stroke="#7c2d12" strokeWidth="2" />

                    {/* Athlete Torso & Reaching Arm */}
                    <path
                      d="M 120 190 L 110 130 Q 100 100 80 75 Q 85 70 95 85 Q 120 115 135 140 L 155 190 Z"
                      fill="url(#playerLight)"
                    />
                    {/* Head */}
                    <circle cx="125" cy="115" r="14" fill="#7c2d12" />
                  </svg>
                </div>

                {/* Neon Magenta/Pink Pill "RUN APP" Button (Matches Reference 1) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/services/service-07');
                  }}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border-2 border-[#FF007A] bg-transparent hover:bg-[#FF007A]/20 text-white font-bold tracking-wider text-xs sm:text-sm uppercase shadow-[0_0_24px_rgba(255,0,122,0.55)] hover:shadow-[0_0_32px_rgba(255,0,122,0.8)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer font-heading"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  RUN APP
                </button>

              </div>
            </div>

          </div>

        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* ── RIGHT COLUMN: Custom software development (Tall Card, Light Theme) ── */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div
          onClick={() => navigate('/services/service-06')}
          className="lg:col-span-5 reveal-scale delay-75 group cursor-pointer relative overflow-hidden rounded-[28px] sm:rounded-[32px] bg-white hover:bg-[#FAFBFD] transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between shadow-[0_10px_35px_rgba(15,23,42,0.06)] border border-slate-200/90"
        >
          {/* Card Top Text Header */}
          <div className="mb-6">
            <h3
              className="text-[24px] sm:text-[28px] font-bold text-[#0F172A] tracking-tight leading-snug mb-2 font-heading"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Custom software development
            </h3>
            <p
              className="text-[#475569] text-xs sm:text-sm leading-relaxed max-w-sm font-normal"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              All your tools. All your workflows. One infinite, node-based canvas. Branch ideas, compare versions, work with your team, all in Spaces.
            </p>
          </div>

          {/* Card 1 Inner Visual Area (Matches Reference 1 Gray Sub-Canvas) */}
          <div className="bg-[#EDF2F7] rounded-2xl sm:rounded-[22px] p-3 sm:p-4 border border-slate-200/70">
            {/* Filter Pills Row */}
            <div className="flex items-center gap-1.5 sm:gap-2 mb-3.5 overflow-x-auto no-scrollbar">
              {(['ALL', 'WEB', 'APP', 'CLOUD'] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab(tab);
                    }}
                    className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#181B20] text-white shadow-sm'
                        : 'text-[#64748B] hover:text-[#181B20] hover:bg-black/5'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* 2x2 Grid of Preview Cards */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              
              {/* Item 1: Marble fluid swirl artwork */}
              <div className="relative rounded-xl overflow-hidden aspect-[4/3.8] bg-[#0E131F] shadow-sm group/item">
                <svg viewBox="0 0 400 350" className="w-full h-full object-cover">
                  <defs>
                    <linearGradient id="bentoFluid1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f43f5e" />
                      <stop offset="30%" stopColor="#ec4899" />
                      <stop offset="60%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                    <radialGradient id="bentoFluidGlow" cx="45%" cy="40%" r="50%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <rect width="400" height="350" fill="#0B0F19" />
                  <path d="M0,60 C130,10 240,190 400,90 L400,350 L0,350 Z" fill="url(#bentoFluid1)" opacity="0.95" />
                  <path d="M0,140 C90,80 220,290 400,150 L400,350 L0,350 Z" fill="#3b82f6" opacity="0.65" />
                  <path d="M0,210 C150,150 270,330 400,220 L400,350 L0,350 Z" fill="#e11d48" opacity="0.55" />
                  <path d="M40,30 C150,150 290,20 370,110" stroke="#fda4af" strokeWidth="16" fill="none" opacity="0.8" strokeLinecap="round" />
                  <path d="M10,100 C170,240 290,70 395,200" stroke="#a5f3fc" strokeWidth="10" fill="none" opacity="0.85" strokeLinecap="round" />
                  <circle cx="180" cy="150" r="110" fill="url(#bentoFluidGlow)" />
                </svg>

                {/* Heart Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLiked(!isLiked);
                  }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer"
                >
                  <Heart
                    size={11}
                    className={isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'}
                  />
                </button>

                {/* Bottom Pill Badge */}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md text-white text-[9px] font-medium tracking-tight flex items-center gap-1.5 shadow-sm">
                  <ImageIcon size={10} className="text-white/80" />
                  <span>IMAGE GENERATOR</span>
                </div>
              </div>

              {/* Item 2: Futuristic cyberpunk profile */}
              <div className="relative rounded-xl overflow-hidden aspect-[4/3.8] bg-[#0A0D14] shadow-sm">
                <svg viewBox="0 0 400 350" className="w-full h-full object-cover">
                  <defs>
                    <linearGradient id="cyberGradBento" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0B132B" />
                      <stop offset="100%" stopColor="#1C2541" />
                    </linearGradient>
                  </defs>
                  <rect width="400" height="350" fill="url(#cyberGradBento)" />
                  {/* Cyber Faceted Portrait Silhouette */}
                  <polygon points="200,60 280,110 260,230 180,270 140,200 150,100" fill="#0284c7" opacity="0.85" />
                  <polygon points="200,60 280,110 270,170 200,150 150,100" fill="#06b6d4" opacity="0.9" />
                  <polygon points="200,150 270,170 260,230 190,210" fill="#f97316" opacity="0.9" />
                  <polygon points="140,200 190,210 180,270 120,240" fill="#0052FF" opacity="0.8" />
                  <polygon points="200,150 190,210 140,200 150,100" fill="#14b8a6" opacity="0.9" />
                  <circle cx="210" cy="130" r="7" fill="#ffffff" />
                  <circle cx="210" cy="130" r="3.5" fill="#00f0ff" />
                  <line x1="80" y1="50" x2="300" y2="300" stroke="#f43f5e" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
                </svg>

                {/* Bottom Pill Badge */}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md text-white text-[9px] font-medium tracking-tight flex items-center gap-1.5 shadow-sm">
                  <Video size={10} className="text-white/80" />
                  <span>VIDEO GENERATOR</span>
                </div>
              </div>

              {/* Item 3: Athlete / Dynamic Fighter */}
              <div className="relative rounded-xl overflow-hidden aspect-[4/3.8] bg-[#0E1A2B] shadow-sm">
                <svg viewBox="0 0 400 350" className="w-full h-full object-cover">
                  <defs>
                    <radialGradient id="athleteGlowBento" cx="50%" cy="40%" r="55%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                      <stop offset="70%" stopColor="#0284c7" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#082f49" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <rect width="400" height="350" fill="#0c192c" />
                  <circle cx="200" cy="130" r="105" fill="url(#athleteGlowBento)" />
                  {/* Boxer silhouette with glowing pink boxing gloves */}
                  <circle cx="200" cy="95" r="26" fill="#1e293b" />
                  <path d="M165,130 Q200,115 235,130 L245,200 Q200,215 155,200 Z" fill="#0f172a" />
                  <circle cx="140" cy="120" r="20" fill="#ec4899" />
                  <circle cx="140" cy="120" r="14" fill="#f43f5e" />
                  <circle cx="260" cy="120" r="20" fill="#ec4899" />
                  <circle cx="260" cy="120" r="14" fill="#f43f5e" />
                  <path d="M140,140 L165,175" stroke="#f43f5e" strokeWidth="7" strokeLinecap="round" />
                  <path d="M260,140 L235,175" stroke="#f43f5e" strokeWidth="7" strokeLinecap="round" />
                </svg>

                {/* Bottom Pill Badge */}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md text-white text-[9px] font-medium tracking-tight flex items-center gap-1.5 shadow-sm">
                  <Video size={10} className="text-white/80" />
                  <span>VIDEO EDITOR</span>
                </div>
              </div>

              {/* Item 4: Audio Equalizer Waves */}
              <div className="relative rounded-xl overflow-hidden aspect-[4/3.8] bg-[#0A1226] shadow-sm">
                <svg viewBox="0 0 400 350" className="w-full h-full object-cover">
                  <rect width="400" height="350" fill="#0a1226" />
                  <g fill="#38BDF8" opacity="0.85">
                    <rect x="110" y="150" width="10" height="50" rx="5" />
                    <rect x="135" y="120" width="10" height="110" rx="5" />
                    <rect x="160" y="90" width="10" height="170" rx="5" />
                    <rect x="185" y="130" width="10" height="90" rx="5" fill="#0066FF" />
                    <rect x="210" y="70" width="10" height="210" rx="5" fill="#0052FF" />
                    <rect x="235" y="110" width="10" height="130" rx="5" />
                    <rect x="260" y="140" width="10" height="70" rx="5" />
                    <rect x="285" y="160" width="10" height="30" rx="5" />
                  </g>
                </svg>

                {/* Bottom Pill Badge */}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md text-white text-[9px] font-medium tracking-tight flex items-center gap-1.5 shadow-sm">
                  <Volume2 size={10} className="text-white/80" />
                  <span>AUDIO</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
