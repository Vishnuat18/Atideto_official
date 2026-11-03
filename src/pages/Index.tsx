import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '@/components/seo/SEO';
import { SERVICES } from '@/constants';

import WhatWeBuildBento from '@/components/features/WhatWeBuildBento';
import SectionHeader from '@/components/ui/SectionHeader';
import CrystallineGrid from '@/components/layout/CrystallineGrid';
import { Target, Zap, Shield, Globe, Headphones, TrendingUp, ArrowRight } from 'lucide-react';
import CareersSpotlightSection from './home/components/CareersSpotlightSection';
import HomeHeroSection from './home/components/HomeHeroSection';

const WHY_US = [
  { icon: Target, title: 'Precision Engineering', desc: 'Every line of code crafted with intention, tested with rigor.' },
  { icon: Zap, title: 'Lightning Fast Delivery', desc: 'Agile sprints, transparent timelines, on-time delivery every time.' },
  { icon: Shield, title: 'Enterprise Security', desc: 'Bank-grade security protocols across all our applications.' },
  { icon: Globe, title: 'Global Expertise', desc: 'Serving clients across 15+ countries with cultural intelligence.' },
  { icon: Headphones, title: '24/7 Support', desc: 'Dedicated support team ensuring zero downtime for your business.' },
  { icon: TrendingUp, title: 'Scalable Architecture', desc: 'Systems built to grow from startup to enterprise without re-architecture.' },
];


export default function Index() {
  const navigate = useNavigate();

  // Intersection Observer for reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right');
    elements.forEach((el) => {
      observer.observe(el);
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 30) {
        el.classList.add('revealed');
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] page-container transition-colors duration-300">
      <SEO 
        title="Atideto | Premium Software, Web, Mobile & AI Solutions"
        description="We build intelligent software, AI automation, premium web experiences, mobile applications, and scalable digital platforms."
        url="https://atideto.in/"
        schema={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "LocalBusiness",
              "@id": "https://atideto.in",
              "name": "Atideto",
              "url": "https://atideto.in",
              "logo": "https://atideto.in/assets/atideto-logo.png",
              "image": "https://atideto.in/assets/home.png",
              "description": "Atideto is a premium software company delivering web, mobile, AI, and cloud solutions, alongside a world-class tech academy.",
              "telephone": "+916379000598",
              "email": "mailto:contact@atideto.in",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "",
                "addressLocality": "Salem",
                "addressRegion": "Tamil Nadu",
                "postalCode": "636001",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "11.6643",
                "longitude": "78.1460"
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday"
                ],
                "opens": "09:00",
                "closes": "18:00"
              },
              "sameAs": [
                "https://www.linkedin.com/company/atideto",
                "https://github.com/Vishnuat18"
              ]
            },
            {
              "@type": "WebSite",
              "@id": "https://atideto.in/#website",
              "url": "https://atideto.in",
              "name": "Atideto",
              "publisher": {
                "@id": "https://atideto.in/#organization"
              }
            }
          ]
        }}
      />
      {/* ── HERO SECTION WITH RUNNING SOLUTIONS CAROUSEL ── */}
      <HomeHeroSection />

      {/* ── CORE PHILOSOPHY (Editorial Manifesto Left-Side Style & Background) ── */}
      <section className="relative w-full py-16 sm:py-20 lg:py-24 overflow-hidden bg-[#05070E] text-white border-b border-white/5">
        {/* Background Radial Glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 85% 50%, rgba(0, 102, 255, 0.15), transparent 55%), radial-gradient(ellipse at 15% 50%, rgba(46, 168, 255, 0.1), transparent 50%)',
          }}
        />

        {/* Sweeping Dynamic Electric Blue Lines (Matching Image 2 Reference) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50">
          <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none" preserveAspectRatio="none">
            {Array.from({ length: 32 }).map((_, i) => (
              <path
                key={i}
                d={`M -80 ${440 + i * 16} C 300 ${390 + i * 12}, 700 ${270 + i * 10}, 1300 ${160 + i * 8}`}
                stroke="#0066FF"
                strokeWidth={0.8 + (i % 4) * 0.4}
                strokeOpacity={0.1 + (i / 32) * 0.45}
              />
            ))}
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          {/* Eyebrow: ── CORE PHILOSOPHY (Matching 2nd Reference Image, No Number) */}
          <div className="reveal inline-flex items-center gap-3 mb-4 select-none">
            <span className="w-8 sm:w-10 h-[1.5px] bg-[#0052FF] shrink-0" />
            <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase font-heading text-[#2EA8FF]">
              CORE PHILOSOPHY
            </span>
          </div>

          {/* Left-Aligned Typography Block */}
          <div className="space-y-6 max-w-3xl text-left">
            <h2
              className="reveal delay-100 text-[28px] sm:text-[36px] font-bold tracking-tight text-white leading-[1.2] font-heading"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Build something{' '}
              <span className="italic font-bold text-white">
                exceptional
              </span>
              .
            </h2>

            <p
              className="reveal delay-150 text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed font-normal"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Create clean, intuitive digital experiences with{' '}
              <span className="text-white font-medium underline decoration-white/40 decoration-2 underline-offset-4">
                thoughtful design
              </span>{' '}
              and{' '}
              <span className="font-editorial-italic italic text-white font-medium">
                powerful technology
              </span>
              . Engineered for operational efficiency, enterprise security, and measurable growth.
            </p>

            <div className="pt-2 reveal delay-200">
              <Link
                to="/services"
                className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#0052FF] to-[#0066FF] hover:from-[#0066FF] hover:to-[#2EA8FF] text-white font-semibold text-sm shadow-[0_0_24px_rgba(0,102,255,0.4)] transition-all duration-300 cursor-pointer"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <span>Explore our services</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT WE BUILD (White Light Bluish Cream Theme) ── */}
      <section 
        data-nav-theme="light"
        className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-[#FAFBFD] via-[#F1F6FD] to-[#FAF8F5] text-slate-900 border-t border-b border-slate-200/80"
      >
        {/* Subtle Ambient Radial Lighting & Blueprint Grid */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 85% 20%, rgba(56, 189, 248, 0.14) 0%, transparent 60%),
              radial-gradient(ellipse at 15% 80%, rgba(254, 249, 239, 0.9) 0%, transparent 60%),
              radial-gradient(rgba(0, 102, 255, 0.035) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 24px 24px'
          }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Section Header */}
          <div className="text-center mb-16 flex flex-col items-center">
            {/* Glowing capsule badge */}
            <div className="reveal rounded-full px-5 py-1.5 inline-flex items-center gap-2 mb-5 border border-[#0052FF]/20 bg-white/90 shadow-[0_2px_12px_rgba(0,82,255,0.08)] backdrop-blur-md">
              <span className="text-[#0052FF] text-[11px] font-bold tracking-[0.2em] uppercase font-sans">
                WHAT WE BUILD
              </span>
            </div>

            <h2 
              className="reveal delay-100 text-[28px] sm:text-[38px] font-bold text-[#0F172A] mb-5 leading-[1.2] tracking-tight max-w-3xl font-heading"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Building Intelligent Digital Products for the <span className="text-[#0F172A] italic">Future</span>.
            </h2>
            
            <p 
              className="reveal delay-150 text-[#475569] text-base md:text-lg max-w-2xl mx-auto leading-relaxed editorial-sub"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              From AI-powered automation to enterprise software, we transform complex challenges into scalable, high-performance digital products.
            </p>
          </div>

          {/* Bento Grid */}
          <WhatWeBuildBento />

          {/* Bottom CTA (Explore Our Services →) */}
          <div className="mt-8 text-center reveal delay-200">
            <button
              onClick={() => navigate('/services')}
              className="rounded-full px-8 py-3.5 text-sm font-bold tracking-wide uppercase inline-flex items-center gap-2 bg-[#0F172A] hover:bg-[#0052FF] text-white shadow-[0_4px_16px_rgba(15,23,42,0.15)] hover:shadow-[0_6px_24px_rgba(0,82,255,0.3)] transition-all duration-300 pointer-events-auto cursor-pointer font-heading"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <span>Explore Our Services</span>
              <span className="text-white">→</span>
            </button>
          </div>

        </div>
      </section>

      {/* ── WHY CHOOSE US (Engineering That Scales - Button Blue Theme) ── */}
      <section 
        className="py-24 relative overflow-hidden bg-[#0052FF] text-white border-b border-white/10"
      >
        {/* Subtle radial depth lighting and tech dot grid */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.3) 0%, transparent 60%),
              radial-gradient(circle at 100% 100%, rgba(0, 240, 255, 0.25) 0%, transparent 50%),
              radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 28px 28px'
          }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader
            number="03"
            category="WHY CHOOSE US"
            title="Engineering That"
            highlight="Scales"
            subtitle="We don't just write code. We engineer high-performance systems with thoughtful design and powerful technology."
            align="center"
            theme="blue"
            className="reveal"
          />

          {/* Desktop Layout: 3 columns with icon next to name and appetizing typography */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_US.map((item, i) => {
              const Icon = item.icon;
              const delayClass = [
                'delay-75',
                'delay-150',
                'delay-200',
                'delay-250',
                'delay-300',
                'delay-400'
              ][i] || 'delay-100';

              return (
                <div
                  key={item.title}
                  className={`reveal-scale ${delayClass} rounded-2xl p-6 bg-white/[0.10] hover:bg-white/[0.16] border border-white/20 hover:border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.14)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all duration-300 card-hover text-white group`}
                >
                  {/* Icon next to Name */}
                  <div className="flex items-center gap-3.5 mb-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-white shadow-sm shrink-0 group-hover:scale-105 group-hover:bg-white/25 transition-all duration-300">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-white font-bold text-[18px] sm:text-[19px] tracking-tight leading-snug font-heading flex-1">
                      {item.title}
                    </h3>
                  </div>

                  {/* Below that Detail - Appetizing high-contrast typography */}
                  <p className="text-white text-sm sm:text-[14.5px] leading-relaxed font-sans font-normal opacity-90 pl-0.5">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mobile Layout: Sleek responsive cards with icon next to name and detail below */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-3.5">
            {WHY_US.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="reveal-scale p-4 rounded-xl border border-white/20 bg-white/[0.10] backdrop-blur-md shadow-md"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/25 flex items-center justify-center text-white shrink-0">
                      <Icon size={17} />
                    </div>
                    <span className="text-white font-bold text-sm leading-tight font-heading">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-white text-xs leading-relaxed font-sans pl-0.5 opacity-90">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      {/* <TestimonialsSection /> */}
      
      {/* ── CAREERS & COLLECTIVE SPOTLIGHT (Replaces old contact form) ── */}
      <CareersSpotlightSection />

      {/* ── FINAL CTA: Let's Build Something Extraordinary (90% View) ── */}
      <section className="min-h-[90vh] w-full flex flex-col justify-center items-center py-20 relative overflow-hidden bg-[#050505] text-white border-t border-white/5">
        {/* Enormous crystalline grid background */}
        <CrystallineGrid />

        {/* Ambient cyber lighting glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-r from-[#0052FF]/20 via-[#00F0FF]/15 to-[#0052FF]/20 blur-[140px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
          <div className="reveal flex items-center gap-3 mx-auto mb-6 select-none justify-center">
            <span className="w-8 sm:w-10 h-[1.5px] bg-[#0052FF] shrink-0" />
            <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase font-heading text-[#2EA8FF]">
              Ready to Begin?
            </span>
          </div>
          <h2
            className="reveal delay-100 text-[38px] sm:text-[56px] md:text-[68px] lg:text-[76px] font-bold text-white mb-6 leading-[1.08] font-heading tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Let's Build Something
            <br />
            <span className="text-white">Extraordinary</span>
          </h2>
          <p
            className="reveal delay-150 text-[#AFAFAF] text-base sm:text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-sans"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            From idea to launch, we're your engineering partner for the digital future.
          </p>
          <div className="reveal delay-200 flex flex-wrap justify-center gap-4 sm:gap-5">
            <button
              onClick={() => navigate('/client-connect')}
              className="btn-primary text-sm sm:text-base px-8 sm:px-10 py-3.5 sm:py-4 shadow-[0_4px_25px_rgba(0,82,255,0.45)] hover:scale-105 active:scale-95 transition-all duration-300 font-heading"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Start Your Project →
            </button>
            <button
              onClick={() => navigate('/academy')}
              className="btn-outline text-sm sm:text-base px-8 sm:px-10 py-3.5 sm:py-4 hover:border-cyan-400 hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 font-heading"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Join the Academy
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
