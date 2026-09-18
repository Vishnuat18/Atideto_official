import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CtaConfig {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  buttonText: string;
  buttonAction: () => void;
}

export default function PreFooterCTA() {
  const navigate = useNavigate();
  const location = useLocation();

  // Omit on pages that do not need CTA (e.g. login, dashboard, profile, services which has its own inline CTA)
  if (
    location.pathname === '/login' ||
    location.pathname === '/dashboard' ||
    location.pathname === '/profile' ||
    location.pathname === '/services'
  ) {
    return null;
  }

  const pathname = location.pathname;

  let config: CtaConfig = {
    eyebrow: 'ENTERPRISE ENGINEERING & AI SOLUTIONS',
    title: (
      <>
        You have the vision.<br />
        <span className="text-[#67E8F9]">
          Let's engineer the advantage.
        </span>
      </>
    ),
    subtitle:
      'From custom enterprise ERPs and AI automation to high-performance web and mobile platforms — partner with Atideto to engineer scalable digital systems that drive measurable business growth.',
    buttonText: 'Start Your Project',
    buttonAction: () => navigate('/client-connect')
  };

  if (pathname === '/academy') {
    config = {
      eyebrow: 'CAREER LAUNCHPAD & TECH INTERNSHIPS',
      title: (
        <>
          Master production code.<br />
          <span className="text-[#67E8F9]">
            Launch your engineering career.
          </span>
        </>
      ),
      subtitle:
        'Step beyond textbook theory. Work alongside senior software engineers on live production systems, build enterprise-grade portfolio projects, and accelerate your path to top tech roles.',
      buttonText: 'Apply for Internship',
      buttonAction: () => {
        const el = document.getElementById('internship-explorer');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 600, behavior: 'smooth' });
        }
      }
    };
  } else if (pathname === '/about') {
    config = {
      eyebrow: 'YOUR DEDICATED TECHNOLOGY SQUAD',
      title: (
        <>
          Big enough to deliver.<br />
          <span className="text-[#67E8F9]">
            Close enough to care.
          </span>
        </>
      ),
      subtitle:
        "We bring focused senior engineering teams to every engagement — combining high-velocity execution with rigorous architectural standards. Let's engineer lasting value together.",
      buttonText: 'Connect With Our Team',
      buttonAction: () => navigate('/client-connect')
    };
  } else if (pathname === '/client-connect') {
    config = {
      eyebrow: 'DIRECT ARCHITECT CONSULTATION',
      title: (
        <>
          Have a custom RFP or<br />
          <span className="text-[#67E8F9]">
            complex system architecture?
          </span>
        </>
      ),
      subtitle:
        'Prefer direct email correspondence or want to discuss enterprise requirements under a mutual NDA? Our principal architects evaluate technical feasibility and return preliminary estimates within 24 hours.',
      buttonText: 'Email Principal Architects',
      buttonAction: () => {
        window.location.href = 'mailto:contact@atideto.in?subject=Project%20Inquiry%20-%20Atideto';
      }
    };
  } else if (pathname === '/requirement-gathering') {
    config = {
      eyebrow: 'SYSTEM DISCOVERY & SCOPING WORKSHOP',
      title: (
        <>
          Need an architectural blueprint<br />
          <span className="text-[#67E8F9]">
            before writing code?
          </span>
        </>
      ),
      subtitle:
        'Skip ambiguous estimates. Let our solutions team facilitate a structured discovery session to define your system architecture, data models, sprint milestones, and exact project budget.',
      buttonText: 'Schedule Scoping Session',
      buttonAction: () => navigate('/client-connect')
    };
  }

  const { eyebrow, title, subtitle, buttonText, buttonAction } = config;

  return (
    <section id="pre-footer-cta" className="relative w-full bg-black py-14 sm:py-20 px-4 sm:px-6 lg:px-12 overflow-hidden border-t border-white/5">
      {/* ── Top Subtle Cyan/Blue Gradient Divider (Matching Services & About Page) ── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3B82F6]/25 to-transparent pointer-events-none" />

      {/* ── Soft Ambient Glow (Matching Services Page CTA) ── */}
      <div className="absolute inset-0 bg-[#3B82F6] opacity-[0.03] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ── Card Container with Service Page Signature Gradient & Layered Rings ── */}
        <div className="relative rounded-2xl sm:rounded-[32px] overflow-hidden bg-gradient-to-br from-[#2442E6] via-[#213CC9] to-[#182B96] p-8 sm:p-12 lg:p-16 shadow-[0_20px_60px_-15px_rgba(33,60,201,0.4)] border border-blue-400/20">
          
          {/* ── Background Ring Design (Exact match to Services Page Signal CTA) ── */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            {/* Outer Ring 3 */}
            <div className="absolute -top-[320px] -right-[220px] sm:-top-[420px] sm:-right-[220px] w-[950px] h-[950px] sm:w-[1300px] sm:h-[1300px] rounded-full border border-white/[0.08] bg-black/[0.05]" />
            {/* Middle Ring 2 */}
            <div className="absolute -top-[220px] -right-[140px] sm:-top-[300px] sm:-right-[140px] w-[700px] h-[700px] sm:w-[980px] sm:h-[980px] rounded-full border border-white/[0.12] bg-black/[0.09]" />
            {/* Inner Ring 1 */}
            <div className="absolute -top-[140px] -right-[60px] sm:-top-[180px] sm:-right-[60px] w-[500px] h-[500px] sm:w-[680px] sm:h-[680px] rounded-full border border-white/[0.15] bg-black/[0.07]" />
          </div>

          {/* ── Foreground Content Grid ── */}
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">
            
            {/* Left Column: Eyebrow & Headline */}
            <div className="max-w-xl">
              <p className="text-blue-200/90 text-xs sm:text-[13px] font-bold tracking-[0.18em] uppercase mb-4 sm:mb-6">
                {eyebrow}
              </p>

              <h2 className="text-white font-extrabold text-3xl sm:text-4xl lg:text-[46px] leading-[1.14] tracking-tight font-montserrat">
                {title}
              </h2>
            </div>

            {/* Right Column: Copy & Interactive Button */}
            <div className="max-w-md flex flex-col items-start">
              <p className="text-blue-100/90 text-sm sm:text-base lg:text-[16px] leading-relaxed mb-6 sm:mb-8 font-normal">
                {subtitle}
              </p>

              {/* White Pill Button with Slide-Fill Hover Effect (Matching Services Page) */}
              <button
                onClick={buttonAction}
                className="group relative w-fit px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white text-[#1A255A] font-bold text-sm sm:text-base tracking-wide overflow-hidden shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 inline-flex items-center gap-2.5 cursor-pointer"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>{buttonText}</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
