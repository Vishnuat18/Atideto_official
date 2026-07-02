import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Globe, Smartphone, Palette, Cloud, BarChart } from 'lucide-react';
import atidetoLogo from '@/assets/atideto-logo.png';

interface CardData {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  badge: string;
  desc: string[];
  x: number; // SVG center coordinate X (out of 1000)
  y: number; // SVG center coordinate Y (out of 1000)
  positionClass: string;
  parallaxFactor: number;
}

export default function EcosystemHub() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) - 0.5;
      const y = ((e.clientY - rect.top) / rect.height) - 0.5;
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const cards: CardData[] = [
    {
      id: 'ai-automation',
      icon: Bot,
      title: 'AI Automation',
      badge: '🤖',
      desc: ['Smart AI Agents', 'Workflow Automation', 'LLMs & RAG Systems', 'Intelligent Chatbots'],
      x: 500,
      y: 100,
      positionClass: 'top-[4%] left-1/2 -translate-x-1/2',
      parallaxFactor: -0.4},
    {
      id: 'web-dev',
      icon: Globe,
      title: 'Web Development',
      badge: '🌐',
      desc: ['Next.js & React', 'Node.js Systems', 'Enterprise Sites', 'API Development'],
      x: 180,
      y: 380,
      positionClass: 'top-[34%] left-[6%]',
      parallaxFactor: -0.25},
    {
      id: 'mobile-dev',
      icon: Smartphone,
      title: 'Mobile Apps',
      badge: '📱',
      desc: ['Android & iOS Apps', 'React Native Apps', 'Flutter Solutions', 'Store Publishing'],
      x: 820,
      y: 380,
      positionClass: 'top-[34%] right-[6%]',
      parallaxFactor: 0.25},
    {
      id: 'ui-ux',
      icon: Palette,
      title: 'UI / UX Design',
      badge: '🎨',
      desc: ['User Research', 'Wireframing', 'Interactive Prototypes', 'Design Systems'],
      x: 220,
      y: 800,
      positionClass: 'bottom-[18%] left-[10%]',
      parallaxFactor: -0.3},
    {
      id: 'cloud',
      icon: Cloud,
      title: 'Cloud Solutions',
      badge: '☁️',
      desc: ['AWS & GCP Cloud', 'Docker / K8s', 'CI/CD Pipelines', 'DevOps Systems'],
      x: 780,
      y: 800,
      positionClass: 'bottom-[18%] right-[10%]',
      parallaxFactor: 0.3},
    {
      id: 'data-analytics',
      icon: BarChart,
      title: 'Data Analytics',
      badge: '📊',
      desc: ['Power BI Dashboards', 'Business Intelligence', 'Real-time Insights', 'Database Analytics'],
      x: 500,
      y: 880,
      positionClass: 'bottom-[4%] left-1/2 -translate-x-1/2',
      parallaxFactor: 0.4},
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-visible py-16"
    >
      {/* 1. DESKTOP VIEW: INTERACTIVE HUB (hidden on mobile) */}
      <div 
        className="hidden md:block relative w-full h-[650px] lg:h-[750px] ecosystem-container"
        style={{
          transform: `translate3d(${mouseOffset.x * 12}px, ${mouseOffset.y * 12}px, 0)`,
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'}}
      >
        {/* Background Mesh Gradient behind hub */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-radial from-[#005DFF]/15 to-transparent blur-[80px] -z-20 pointer-events-none" />

        {/* SVG Network Connections Overlay */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none -z-10" 
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="glow-filter" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Draw connecting lines from (500, 500) center to cards */}
          {cards.map((c) => {
            const isHovered = hoveredCardId === c.id;
            const linePath = `M 500 500 Q ${(500 + c.x) / 2} ${(500 + c.y) / 2 - 30} ${c.x} ${c.y}`;

            return (
              <g key={c.id}>
                {/* Background base path line */}
                <path
                  d={linePath}
                  fill="none"
                  stroke={isHovered ? 'rgba(95, 212, 255, 0.35)' : 'rgba(0, 93, 255, 0.15)'}
                  strokeWidth={isHovered ? '3.5' : '2'}
                  className="transition-all duration-300"
                />

                {/* Dashed animated flow line */}
                <path
                  d={linePath}
                  fill="none"
                  stroke={isHovered ? '#5FD4FF' : '#005DFF'}
                  strokeWidth="1.5"
                  className="animated-svg-path opacity-80"
                />

                {/* Traveling Particle dot */}
                <circle r={isHovered ? '5' : '3.5'} fill={isHovered ? '#5FD4FF' : '#2EA8FF'} filter="url(#glow-filter)">
                  <animateMotion 
                    dur={isHovered ? '2.2s' : '3.5s'} 
                    repeatCount="indefinite" 
                    path={linePath} 
                  />
                </circle>
              </g>
            );
          })}
        </svg>

        {/* Central Crystal Sphere */}
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full glass border border-white/10 flex items-center justify-center -z-10 animate-ecosystem-center transition-all duration-300 ${
            hoveredCardId ? 'scale-[1.08] border-[#2EA8FF]/40 shadow-[0_0_35px_rgba(46,168,255,0.4)]' : ''
          }`}
        >
          {/* Logo container */}
          <div className="relative w-16 h-16 rounded-full bg-[#050505] border border-white/5 flex items-center justify-center shadow-[inset_0_0_15px_rgba(0,93,255,0.4)]">
            <img 
              src={atidetoLogo} 
              alt="ATIDETO Logo" 
              className={`w-10 h-10 object-contain filter drop-shadow-[0_0_8px_rgba(46,168,255,0.5)] transition-transform duration-300 ${
                hoveredCardId ? 'scale-110 rotate-6' : ''
              }`} 
            />
            {/* Spinning holographic ring */}
            <div className="absolute inset-0 rounded-full border border-dashed border-[#2EA8FF]/30 animate-spin-slow pointer-events-none" />
          </div>
        </div>

        {/* 6 Floating Glass Cards */}
        {cards.map((c) => {
          const Icon = c.icon;
          const isHovered = hoveredCardId === c.id;
          const cx = mouseOffset.x * c.parallaxFactor * 15;
          const cy = mouseOffset.y * c.parallaxFactor * 15;

          return (
            <div
              key={c.id}
              className={`absolute ${c.positionClass} pointer-events-auto`}
              style={{
                transform: `translate3d(${cx}px, ${cy}px, 0)`,
                transition: 'transform 0.2s ease-out'}}
              onMouseEnter={() => setHoveredCardId(c.id)}
              onMouseLeave={() => setHoveredCardId(null)}
            >
              <div 
                onClick={() => navigate(`/requirement-gathering?service=${c.id}`)}
                className={`ecosystem-card glass-card-premium rounded-[22px] p-6 w-[230px] border border-white/5 cursor-pointer text-left ${
                  isHovered ? 'scale-[1.04]' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#005DFF]/15 border border-[#2EA8FF]/25 flex items-center justify-center text-[#2EA8FF] shadow-[0_0_15px_rgba(0,93,255,0.1)]">
                    <Icon size={18} />
                  </div>
                </div>
                <h4 className="font-space font-bold text-[16px] text-white tracking-wide uppercase mb-3">{c.title}</h4>
                <ul className="space-y-1.5 mb-5 pointer-events-none">
                  {c.desc.map((d, index) => (
                    <li key={index} className="text-[#A7B3C7] text-[11px] leading-relaxed flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#2EA8FF]" />
                      {d}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-1 text-[#2EA8FF] text-[11px] font-bold tracking-wide uppercase transition-colors duration-200 group-hover:text-white">
                  Learn More <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. MOBILE VIEW: RESPONSIVE GRID LAYOUT (hidden on desktop) */}
      <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 px-4 relative z-10">
        
        {/* Holographic Logo Header for mobile list */}
        <div className="col-span-full flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full glass border border-[#2EA8FF]/20 flex items-center justify-center animate-ecosystem-center mb-4">
            <img src={atidetoLogo} alt="ATIDETO Logo" className="w-12 h-12 object-contain" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2EA8FF] font-space"> Ecosytem Center</span>
        </div>

        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.id}
              onClick={() => navigate(`/requirement-gathering?service=${c.id}`)}
              className="glass rounded-[20px] p-6 border border-white/5 shadow-md active:scale-95 transition-transform duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#005DFF]/15 border border-[#2EA8FF]/20 flex items-center justify-center text-[#2EA8FF]">
                  <Icon size={18} />
                </div>
              </div>
              <h4 className="font-space font-bold text-[15px] text-white tracking-wide uppercase mb-2">{c.title}</h4>
              <ul className="space-y-1 mb-4">
                {c.desc.map((d, index) => (
                  <li key={index} className="text-[#A7B3C7] text-[11px] leading-relaxed flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#2EA8FF]" />
                    {d}
                  </li>
                ))}
              </ul>
              <div className="text-[#2EA8FF] text-[11px] font-bold tracking-wide uppercase flex items-center gap-1">
                Learn More <span>→</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
