import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SERVICES } from '@/constants';

import WhatWeBuildVisual from '@/components/features/WhatWeBuildVisual';
import WaveBackground from '@/components/layout/WaveBackground';
import CrystallineGrid from '@/components/layout/CrystallineGrid';
import { Target, Zap, Shield, Globe, Headphones, TrendingUp } from 'lucide-react';

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
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 8}))
    );
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  // Intersection Observer for reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('revealed')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: '#050505', minHeight: '100vh' }}>
      {/* ── HERO ── */}
      <section 
        ref={heroRef} 
        className="relative min-h-screen flex flex-col overflow-hidden bg-[#050505]"
      >
        {/* Abstract blue & light violet wave background animation loop */}
        <WaveBackground />

        {/* Ambient floating dust particles (animated) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute w-1.5 h-1.5 rounded-full bg-[#2EA8FF]/40 blur-[0.5px]"
              style={{
                left: `${p.x}%`,
                bottom: '-20px',
                animation: `particleFloat ${p.duration}s ${p.delay}s linear infinite`,
                opacity: 0.3}}
            />
          ))}
        </div>

        {/* Hero Centered Layout */}
        <div className="flex-1 flex flex-col justify-center items-center w-full z-10 pt-32 pb-8">
          <div className="relative max-w-5xl mx-auto px-6 w-full flex flex-col items-center text-center animate-fadeIn font-montserrat">
            
            {/* Main Heading (Montserrat) */}
            <h1
              className="font-montserrat font-bold text-4xl md:text-5xl lg:text-[64px] leading-[1.1] tracking-tight text-white mb-6"
            >
              Building
              <br />
              <span className="animate-text-gradient font-montserrat font-black block my-1">
                Digital Experiences
              </span>
              Beyond Imagination
            </h1>

            {/* Description */}
            <p
              className="text-[#A7B3C7] text-[17px] md:text-[18px] leading-relaxed mb-10 max-w-[680px] font-montserrat mx-auto"
            >
              We build intelligent software, AI automation, premium web experiences, mobile applications, cloud solutions, and scalable digital platforms that empower businesses to innovate, automate, and grow faster.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 font-montserrat">
              <button
                onClick={() => navigate('/client-connect')}
                className="btn-electric rounded-xl text-[15px] font-semibold px-8 py-4 font-montserrat"
              >
                Get Started →
              </button>
              <button
                onClick={() => navigate('/services')}
                className="btn-outline rounded-xl text-[15px] font-semibold px-8 py-4 glass font-montserrat"
              >
                Explore Services
              </button>
            </div>

          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="relative z-10 pb-8 mt-auto flex flex-col items-center gap-2 animate-float pointer-events-none font-montserrat">
          <span className="text-[#A7B3C7] text-[10px] tracking-[0.2em] uppercase font-montserrat font-medium">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-[#005DFF] to-transparent" />
        </div>
      </section>

      {/* ── SERVICES PREVIEW ── */}
      {/* ── SERVICES PREVIEW ── */}
      <section className="py-24 relative overflow-hidden">
        {/* Layered subtle gradients & particles in background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full aurora-bloom-2 blur-[100px] opacity-70" />
          <div className="absolute bottom-[10%] left-[5%] w-[350px] h-[350px] rounded-full aurora-bloom-1 blur-[110px] opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Section Header */}
          <div className="text-center mb-16 flex flex-col items-center">
            {/* Glowing capsule badge */}
            <div className="glass-pill rounded-full px-5 py-1.5 inline-flex items-center gap-2 mb-5 border border-[#005DFF]/25 shadow-[0_0_15px_rgba(0,93,255,0.25)] animate-pulseGlow">
              <span className="text-[#2EA8FF] text-[11px] font-bold tracking-[0.2em] uppercase font-space">
                WHAT WE BUILD
              </span>
            </div>

            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-space font-bold text-white mb-6 leading-tight tracking-tight max-w-3xl"
            >
              Building Intelligent Digital Products for the Future.
            </h2>
            
            <p 
              className="text-[#A7B3C7] text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            >
              From AI-powered automation to enterprise software, we transform complex challenges into scalable, high-performance digital products.
            </p>
          </div>

          {/* Centerpiece 3D Crystal Visual with 6 Floating Cards */}
          <WhatWeBuildVisual />

          {/* Bottom CTA (Explore Our Services →) */}
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/services')}
              className="btn-outline rounded-full px-8 py-3.5 text-sm font-bold tracking-wide uppercase glass inline-flex items-center gap-2 hover:border-[#2EA8FF]/40 hover:shadow-[0_0_20px_rgba(46,168,255,0.25)] transition-all duration-300 pointer-events-auto"
            >
              Explore Our Services <span className="text-[#2EA8FF]">→</span>
            </button>
          </div>

        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="section-tag">Why ATIDETO</div>
            <h2 className="text-3xl lg:text-5xl font-bold text-white" >
              The ATIDETO Difference
            </h2>
            <p className="text-[#AFAFAF] mt-4 max-w-xl mx-auto">
              We don't just write code. We engineer solutions that scale, perform, and create lasting impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_US.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="reveal glass rounded-2xl p-6 card-hover"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#005DFF]/15 border border-[#2EA8FF]/20 flex items-center justify-center text-[#2EA8FF] mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2" >
                    {item.title}
                  </h3>
                  <p className="text-[#AFAFAF] text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      {/* <TestimonialsSection /> */}

      <section className="py-24 relative overflow-hidden">
        {/* Enormous crystalline grid background */}
        <CrystallineGrid />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="section-tag mx-auto">Ready to Begin?</div>
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-6" style={{ letterSpacing: '-0.02em' }}>
            Let's Build Something
            <br />
            <span className="gradient-text">Extraordinary</span>
          </h2>
          <p className="text-[#AFAFAF] text-lg mb-10 max-w-xl mx-auto">
            From idea to launch, we're your engineering partner for the digital future.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/client-connect')}
              className="btn-primary text-base px-10 py-4 animate-pulseGlow"
            >
              Start Your Project →
            </button>
            <button
              onClick={() => navigate('/academy')}
              className="btn-outline text-base px-10 py-4"
            >
              Join the Academy
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
