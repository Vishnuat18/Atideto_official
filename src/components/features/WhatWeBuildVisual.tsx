import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bot, Cpu, Cloud, Code, BarChart, Palette } from 'lucide-react';
import DigitalCoreScene from './DigitalCoreScene';

gsap.registerPlugin(ScrollTrigger);

interface FloatingCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  desc: string;
  position: string;
  index: number;
  onClick: () => void;
  onHover: (index: number | null) => void;
  isHovered: boolean;
  isPulsed: boolean;
}

const FloatingCard: React.FC<FloatingCardProps> = ({
  icon: Icon,
  title,
  desc,
  position,
  index,
  onClick,
  onHover,
  isHovered,
  isPulsed,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const el = cardRef.current;

    if (isPulsed) {
      gsap.fromTo(el,
        { boxShadow: '0 0 5px rgba(0, 191, 255, 0)' },
        {
          boxShadow: '0 0 30px rgba(0, 191, 255, 0.3), 0 0 60px rgba(47, 125, 255, 0.15)',
          borderColor: 'rgba(0, 191, 255, 0.4)',
          duration: 0.5,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
        }
      );
    }
  }, [isPulsed]);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      className={`absolute ${position} pointer-events-auto hidden md:block cursor-pointer transition-all duration-500 ease-out
        rounded-[18px] p-5 w-[215px]
        ${isHovered
          ? 'border-[#2EA8FF]/40 shadow-[0_0_30px_rgba(46,168,255,0.2),0_20px_40px_-12px_rgba(0,93,255,0.3)] scale-[1.04]'
          : 'border-white/5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]'
        }`}
      style={{
        background: isHovered
          ? 'rgba(255,255,255,0.06)'
          : 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid',
        borderColor: isHovered ? 'rgba(0, 191, 255, 0.3)' : 'rgba(255, 255, 255, 0.06)',
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500"
          style={{
            background: isHovered ? 'rgba(0, 93, 255, 0.25)' : 'rgba(0, 93, 255, 0.15)',
            border: '1px solid',
            borderColor: isHovered ? 'rgba(0, 191, 255, 0.4)' : 'rgba(46, 168, 255, 0.2)',
            transform: isHovered ? 'rotate(8deg)' : 'rotate(0deg)',
          }}
        >
          <Icon size={16} className="text-[#2EA8FF]" />
        </div>
        <h5 className="font-bold text-[14px] text-white tracking-wide uppercase font-space">{title}</h5>
      </div>
      <p className="text-[#A7B3C7] text-[11px] leading-relaxed mb-3">{desc}</p>
      <div
        className="text-[10px] font-bold tracking-wide uppercase flex items-center gap-1 transition-all duration-300"
        style={{ color: isHovered ? '#7CCBFF' : '#2EA8FF' }}
      >
        Learn More <span className="transition-transform duration-300" style={{ transform: isHovered ? 'translateX(4px)' : 'translateX(0)' }}>→</span>
      </div>
    </div>
  );
};

export default function WhatWeBuildVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [pulseTrigger, setPulseTrigger] = useState(0);
  const [pulsedCards, setPulsedCards] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  // Energy pulse every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseTrigger((p) => p + 1);

      // Pulse cards with staggered delay
      const pulseSet = new Set<number>();
      [0, 1, 2, 3, 4, 5].forEach((i) => {
        setTimeout(() => {
          pulseSet.add(i);
          setPulsedCards(new Set(pulseSet));
          setTimeout(() => {
            pulseSet.delete(i);
            setPulsedCards(new Set(pulseSet));
          }, 600);
        }, i * 80);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // GSAP entrance animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const cards = sectionRef.current.querySelectorAll('.card-entrance');
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          delay: 0.3 + i * 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    });
  }, []);

  const handleCardHover = useCallback((index: number | null) => {
    setHoveredCard(index);
  }, []);

  const cardsData = [
    {
      id: 'ai-agents',
      icon: Bot,
      title: 'AI Automation',
      desc: 'Intelligent workflows, LLM agents, and automated processes.',
      position: 'top-[8%] left-[8%]',
    },
    {
      id: 'custom-software',
      icon: Cpu,
      title: 'Custom Systems',
      desc: 'Tailored CRM, enterprise ERP platforms, and API integrations.',
      position: 'top-[2%] left-1/2 -translate-x-1/2',
    },
    {
      id: 'web-dev',
      icon: Code,
      title: 'Development',
      desc: 'High-performance custom web apps and mobile solutions.',
      position: 'top-[25%] right-[8%]',
    },
    {
      id: 'cloud',
      icon: Cloud,
      title: 'Cloud Solutions',
      desc: 'DevOps pipelines and scalable enterprise server hosting.',
      position: 'top-[55%] left-[6%]',
    },
    {
      id: 'ui-ux',
      icon: Palette,
      title: 'UI/UX Design',
      desc: 'Research-driven layouts and pixel-perfect interactive design.',
      position: 'bottom-[5%] left-[28%]',
    },
    {
      id: 'data-analytics',
      icon: BarChart,
      title: 'Data Analytics',
      desc: 'Extract business insights via predictive models & dashboards.',
      position: 'bottom-[12%] right-[10%]',
    },
  ];

  return (
    <div ref={sectionRef} className="relative w-full overflow-visible">
      {/* Desktop View */}
      <div
        ref={containerRef}
        className="relative w-full h-[500px] lg:h-[650px] flex items-center justify-center overflow-visible select-none"
      >
        {/* Background blurs */}
        <div className="absolute top-[25%] left-[25%] -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full aurora-bloom-1 blur-[90px] pointer-events-none" />
        <div className="absolute top-[50%] right-[15%] w-[300px] h-[300px] rounded-full aurora-bloom-2 blur-[90px] pointer-events-none" />

        {/* Three.js Digital Core */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <DigitalCoreScene
            hoveredCard={hoveredCard}
            pulseTrigger={pulseTrigger}
          />
        </div>

        {/* Service Cards */}
        {cardsData.map((c, i) => (
          <FloatingCard
            key={c.id}
            icon={c.icon}
            title={c.title}
            desc={c.desc}
            position={c.position}
            index={i}
            onClick={() => navigate(`/requirement-gathering?service=${c.id}`)}
            onHover={handleCardHover}
            isHovered={hoveredCard === i}
            isPulsed={pulsedCards.has(i)}
          />
        ))}
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4 px-4 mt-8">
        {/* Compact Digital Core for mobile */}
        <div className="w-full h-[300px] relative mb-4">
          <div className="absolute inset-0 pointer-events-none">
            <DigitalCoreScene
              hoveredCard={null}
              pulseTrigger={pulseTrigger}
            />
          </div>
        </div>

        {cardsData.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.id}
              onClick={() => navigate(`/requirement-gathering?service=${c.id}`)}
              className="glass rounded-[20px] p-6 border border-white/5 shadow-md active:scale-95 transition-transform duration-200 text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-[#005DFF]/15 border border-[#2EA8FF]/20 flex items-center justify-center text-[#2EA8FF]">
                  <Icon size={16} />
                </div>
                <h4 className="font-space font-bold text-[15px] text-white tracking-wide uppercase">{c.title}</h4>
              </div>
              <p className="text-[#A7B3C7] text-[11px] leading-relaxed mb-4">{c.desc}</p>
              <div className="flex items-center gap-1">
                <span className="inline-block w-6 h-px bg-[#2EA8FF]/40" />
                <span className="text-[#2EA8FF] text-[10px] font-bold tracking-wide uppercase">Learn More</span>
                <span className="text-[#2EA8FF]">→</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
