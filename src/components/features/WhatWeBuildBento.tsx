import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  Smartphone,
  Globe,
  Cloud,
  TrendingUp,
  Palette,
  ArrowRight,
  ArrowUpRight
} from 'lucide-react';

export default function WhatWeBuildBento() {
  const navigate = useNavigate();

  return (
    <div className="w-full my-8">
      <div className="grid grid-cols-2 md:grid-cols-12 gap-3 sm:gap-4 md:gap-6">
        
        {/* ── 1. CUSTOM SYSTEMS (Col-Span 7) ── */}
        <div
          onClick={() => navigate('/services')}
          className="col-span-1 md:col-span-7 group cursor-pointer relative overflow-hidden rounded-2xl p-3.5 sm:p-5 md:p-9 border border-white/10 bg-[#080D1A]/60 hover:bg-[#080D1A]/90 backdrop-blur-md transition-all duration-400 hover:border-[#2EA8FF]/40 hover:shadow-[0_0_30px_rgba(46,168,255,0.12)] flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#005DFF]/10 rounded-full blur-3xl group-hover:bg-[#005DFF]/20 transition-all duration-500 pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-4 mb-2 md:mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#2EA8FF] group-hover:border-[#2EA8FF]/40 group-hover:bg-[#005DFF]/15 transition-all duration-300 shrink-0">
                  <Cpu className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="hidden md:inline text-[11px] font-bold tracking-[0.2em] text-[#2EA8FF] uppercase font-montserrat">
                  ENTERPRISE CORE
                </span>
              </div>
              <span className="hidden md:inline text-xs text-slate-500 font-mono">01</span>
            </div>

            <h3 className="text-sm sm:text-base md:text-2xl lg:text-3xl font-extrabold text-white mb-2 md:mb-3 font-montserrat tracking-tight leading-snug">
              Custom Systems
            </h3>
            <p className="hidden md:block text-[#A7B3C7] text-sm sm:text-base leading-relaxed max-w-lg mb-6">
              Tailored ERP platforms, CRM systems, and automated internal workflows built to unify operations with enterprise security and speed.
            </p>
          </div>

          <div className="pt-2 md:pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 mt-auto">
            <div className="hidden md:flex flex-wrap gap-2">
              {['CRM & ERP', 'Workflows', 'Custom APIs'].map((pill) => (
                <span key={pill} className="text-xs font-medium text-slate-400">
                  • {pill}
                </span>
              ))}
            </div>

            {/* Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/services');
              }}
              className="group/btn relative overflow-hidden w-fit md:w-auto px-3.5 py-1.5 md:px-5 md:py-2.5 rounded-full border border-white/20 bg-white/[0.03] text-[11px] md:text-xs font-semibold text-white transition-all duration-300 group-hover:border-[#2EA8FF]/60 group-hover:bg-[#2EA8FF]/10 flex items-center justify-center gap-1.5 md:gap-2 shadow-sm"
            >
              <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
              <span>Explore</span>
              <ArrowRight size={13} className="text-[#2EA8FF] transition-transform duration-300 group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>

        {/* ── 2. MOBILE APP DEVELOPMENT (Col-Span 5) ── */}
        <div
          onClick={() => navigate('/services')}
          className="col-span-1 md:col-span-5 group cursor-pointer relative overflow-hidden rounded-2xl p-3.5 sm:p-5 md:p-9 border border-white/10 bg-[#080D1A]/60 hover:bg-[#080D1A]/90 backdrop-blur-md transition-all duration-400 hover:border-[#2EA8FF]/40 hover:shadow-[0_0_30px_rgba(46,168,255,0.12)] flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-52 h-52 bg-[#2EA8FF]/10 rounded-full blur-3xl group-hover:bg-[#2EA8FF]/20 transition-all duration-500 pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-4 mb-2 md:mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#2EA8FF] group-hover:border-[#2EA8FF]/40 group-hover:bg-[#005DFF]/15 transition-all duration-300 shrink-0">
                  <Smartphone className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="hidden md:inline text-[11px] font-bold tracking-[0.2em] text-[#2EA8FF] uppercase font-montserrat">
                  IOS & ANDROID
                </span>
              </div>
              <span className="hidden md:inline text-xs text-slate-500 font-mono">02</span>
            </div>

            <h3 className="text-sm sm:text-base md:text-2xl lg:text-3xl font-extrabold text-white mb-2 md:mb-3 font-montserrat tracking-tight leading-snug">
              Mobile App Dev
            </h3>
            <p className="hidden md:block text-[#A7B3C7] text-sm sm:text-base leading-relaxed mb-6">
              High-performance iOS and Android applications built with React Native and Flutter for 120fps fluidity and offline sync.
            </p>
          </div>

          <div className="pt-2 md:pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 mt-auto">
            <div className="hidden md:flex flex-wrap gap-2">
              {['React Native', 'Flutter', 'Offline Sync'].map((pill) => (
                <span key={pill} className="text-xs font-medium text-slate-400">
                  • {pill}
                </span>
              ))}
            </div>

            {/* Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/services');
              }}
              className="group/btn relative overflow-hidden w-fit md:w-auto px-3.5 py-1.5 md:px-5 md:py-2.5 rounded-full border border-white/20 bg-white/[0.03] text-[11px] md:text-xs font-semibold text-white transition-all duration-300 group-hover:border-[#2EA8FF]/60 group-hover:bg-[#2EA8FF]/10 flex items-center justify-center gap-1.5 md:gap-2 shadow-sm"
            >
              <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
              <span>Build</span>
              <ArrowRight size={13} className="text-[#2EA8FF] transition-transform duration-300 group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>

        {/* ── 3. WEB DEVELOPMENT (Col-Span 5) ── */}
        <div
          onClick={() => navigate('/services')}
          className="col-span-1 md:col-span-5 group cursor-pointer relative overflow-hidden rounded-2xl p-3.5 sm:p-5 md:p-9 border border-white/10 bg-[#080D1A]/60 hover:bg-[#080D1A]/90 backdrop-blur-md transition-all duration-400 hover:border-[#2EA8FF]/40 hover:shadow-[0_0_30px_rgba(46,168,255,0.12)] flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-52 h-52 bg-[#005DFF]/10 rounded-full blur-3xl group-hover:bg-[#005DFF]/20 transition-all duration-500 pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-4 mb-2 md:mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#2EA8FF] group-hover:border-[#2EA8FF]/40 group-hover:bg-[#005DFF]/15 transition-all duration-300 shrink-0">
                  <Globe className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="hidden md:inline text-[11px] font-bold tracking-[0.2em] text-[#2EA8FF] uppercase font-montserrat">
                  MODERN FULL-STACK
                </span>
              </div>
              <span className="hidden md:inline text-xs text-slate-500 font-mono">03</span>
            </div>

            <h3 className="text-sm sm:text-base md:text-2xl lg:text-3xl font-extrabold text-white mb-2 md:mb-3 font-montserrat tracking-tight leading-snug">
              Web Development
            </h3>
            <p className="hidden md:block text-[#A7B3C7] text-sm sm:text-base leading-relaxed mb-6">
              Ultra-fast web platforms, SaaS dashboards, and modern web apps engineered with Next.js, React, and TypeScript for 100/100 performance.
            </p>
          </div>

          <div className="pt-2 md:pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 mt-auto">
            <div className="hidden md:flex flex-wrap gap-2">
              {['Next.js', 'React', 'TypeScript'].map((pill) => (
                <span key={pill} className="text-xs font-medium text-slate-400">
                  • {pill}
                </span>
              ))}
            </div>

            {/* Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/services');
              }}
              className="group/btn relative overflow-hidden w-fit md:w-auto px-3.5 py-1.5 md:px-5 md:py-2.5 rounded-full border border-white/20 bg-white/[0.03] text-[11px] md:text-xs font-semibold text-white transition-all duration-300 group-hover:border-transparent flex items-center justify-center gap-1.5 md:gap-2 shadow-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#005DFF] to-[#2EA8FF] -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10">Launch</span>
              <ArrowUpRight size={13} className="relative z-10 text-[#2EA8FF] group-hover/btn:text-white transition-transform duration-300 group-hover/btn:rotate-45" />
            </button>
          </div>
        </div>

        {/* ── 4. CLOUD SOLUTIONS (Col-Span 7) ── */}
        <div
          onClick={() => navigate('/services')}
          className="col-span-1 md:col-span-7 group cursor-pointer relative overflow-hidden rounded-2xl p-3.5 sm:p-5 md:p-9 border border-white/10 bg-[#080D1A]/60 hover:bg-[#080D1A]/90 backdrop-blur-md transition-all duration-400 hover:border-[#2EA8FF]/40 hover:shadow-[0_0_30px_rgba(46,168,255,0.12)] flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#005DFF]/10 rounded-full blur-3xl group-hover:bg-[#005DFF]/20 transition-all duration-500 pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-4 mb-2 md:mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#2EA8FF] group-hover:border-[#2EA8FF]/40 group-hover:bg-[#005DFF]/15 transition-all duration-300 shrink-0">
                  <Cloud className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="hidden md:inline text-[11px] font-bold tracking-[0.2em] text-[#2EA8FF] uppercase font-montserrat">
                  DEVOPS & INFRASTRUCTURE
                </span>
              </div>
              <span className="hidden md:inline text-xs text-slate-500 font-mono">04</span>
            </div>

            <h3 className="text-sm sm:text-base md:text-2xl lg:text-3xl font-extrabold text-white mb-2 md:mb-3 font-montserrat tracking-tight leading-snug">
              Cloud Solutions
            </h3>
            <p className="hidden md:block text-[#A7B3C7] text-sm sm:text-base leading-relaxed max-w-lg mb-6">
              Scalable multi-cloud deployments on AWS and GCP with containerized Kubernetes workflows, automated CI/CD, and zero-downtime architecture.
            </p>
          </div>

          <div className="pt-2 md:pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 mt-auto">
            <div className="hidden md:flex flex-wrap gap-2">
              {['AWS & GCP', 'Kubernetes', 'CI/CD Pipelines'].map((pill) => (
                <span key={pill} className="text-xs font-medium text-slate-400">
                  • {pill}
                </span>
              ))}
            </div>

            {/* Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/services');
              }}
              className="group/btn relative overflow-hidden w-fit md:w-auto px-3.5 py-1.5 md:px-5 md:py-2.5 rounded-full border border-white/20 bg-white/[0.03] text-[11px] md:text-xs font-semibold text-white transition-all duration-300 group-hover:border-transparent flex items-center justify-center gap-1.5 md:gap-2 shadow-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#005DFF] to-[#2EA8FF] -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10">Scale</span>
              <ArrowUpRight size={13} className="relative z-10 text-[#2EA8FF] group-hover/btn:text-white transition-transform duration-300 group-hover/btn:rotate-45" />
            </button>
          </div>
        </div>

        {/* ── 5. DIGITAL MARKETING (Col-Span 6) ── */}
        <div
          onClick={() => navigate('/services')}
          className="col-span-1 md:col-span-6 group cursor-pointer relative overflow-hidden rounded-2xl p-3.5 sm:p-5 md:p-9 border border-white/10 bg-[#080D1A]/60 hover:bg-[#080D1A]/90 backdrop-blur-md transition-all duration-400 hover:border-[#2EA8FF]/40 hover:shadow-[0_0_30px_rgba(46,168,255,0.12)] flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-56 h-56 bg-[#2EA8FF]/10 rounded-full blur-3xl group-hover:bg-[#2EA8FF]/20 transition-all duration-500 pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-4 mb-2 md:mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#2EA8FF] group-hover:border-[#2EA8FF]/40 group-hover:bg-[#005DFF]/15 transition-all duration-300 shrink-0">
                  <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="hidden md:inline text-[11px] font-bold tracking-[0.2em] text-[#2EA8FF] uppercase font-montserrat">
                  GROWTH & ACQUISITION
                </span>
              </div>
              <span className="hidden md:inline text-xs text-slate-500 font-mono">05</span>
            </div>

            <h3 className="text-sm sm:text-base md:text-2xl lg:text-3xl font-extrabold text-white mb-2 md:mb-3 font-montserrat tracking-tight leading-snug">
              Digital Marketing
            </h3>
            <p className="hidden md:block text-[#A7B3C7] text-sm sm:text-base leading-relaxed mb-6">
              Data-driven technical SEO, conversion rate optimization (CRO), and targeted performance campaigns designed to accelerate measurable customer acquisition.
            </p>
          </div>

          <div className="pt-2 md:pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 mt-auto">
            <div className="hidden md:flex flex-wrap gap-2">
              {['Technical SEO', 'Performance Ads', 'CRO Funnels'].map((pill) => (
                <span key={pill} className="text-xs font-medium text-slate-400">
                  • {pill}
                </span>
              ))}
            </div>

            {/* Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/services');
              }}
              className="group/btn relative overflow-hidden w-fit md:w-auto px-3.5 py-1.5 md:px-5 md:py-2.5 rounded-full border border-white/20 bg-white/[0.03] text-[11px] md:text-xs font-semibold text-white transition-all duration-300 group-hover:border-[#2EA8FF]/60 group-hover:bg-[#2EA8FF]/10 flex items-center justify-center gap-1.5 md:gap-2 shadow-sm"
            >
              <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
              <span>Grow</span>
              <ArrowRight size={13} className="text-[#2EA8FF] transition-transform duration-300 group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>

        {/* ── 6. DESIGNING (Col-Span 6) ── */}
        <div
          onClick={() => navigate('/services')}
          className="col-span-1 md:col-span-6 group cursor-pointer relative overflow-hidden rounded-2xl p-3.5 sm:p-5 md:p-9 border border-white/10 bg-[#080D1A]/60 hover:bg-[#080D1A]/90 backdrop-blur-md transition-all duration-400 hover:border-[#2EA8FF]/40 hover:shadow-[0_0_30px_rgba(46,168,255,0.12)] flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-56 h-56 bg-[#005DFF]/10 rounded-full blur-3xl group-hover:bg-[#005DFF]/20 transition-all duration-500 pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-4 mb-2 md:mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#2EA8FF] group-hover:border-[#2EA8FF]/40 group-hover:bg-[#005DFF]/15 transition-all duration-300 shrink-0">
                  <Palette className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="hidden md:inline text-[11px] font-bold tracking-[0.2em] text-[#2EA8FF] uppercase font-montserrat">
                  UI/UX & IDENTITY
                </span>
              </div>
              <span className="hidden md:inline text-xs text-slate-500 font-mono">06</span>
            </div>

            <h3 className="text-sm sm:text-base md:text-2xl lg:text-3xl font-extrabold text-white mb-2 md:mb-3 font-montserrat tracking-tight leading-snug">
              Designing
            </h3>
            <p className="hidden md:block text-[#A7B3C7] text-sm sm:text-base leading-relaxed mb-6">
              World-class UI/UX interfaces, scalable Figma design systems, and distinctive brand identities crafted for effortless usability and conversion.
            </p>
          </div>

          <div className="pt-2 md:pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 mt-auto">
            <div className="hidden md:flex flex-wrap gap-2">
              {['UI/UX Design', 'Figma Systems', 'Brand Identity'].map((pill) => (
                <span key={pill} className="text-xs font-medium text-slate-400">
                  • {pill}
                </span>
              ))}
            </div>

            {/* Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/services');
              }}
              className="group/btn relative overflow-hidden w-fit md:w-auto px-3.5 py-1.5 md:px-5 md:py-2.5 rounded-full border border-white/20 bg-white/[0.03] text-[11px] md:text-xs font-semibold text-white transition-all duration-300 group-hover:border-transparent flex items-center justify-center gap-1.5 md:gap-2 shadow-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#005DFF] to-[#2EA8FF] -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10">Design</span>
              <ArrowUpRight size={13} className="relative z-10 text-[#2EA8FF] group-hover/btn:text-white transition-transform duration-300 group-hover/btn:rotate-45" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
