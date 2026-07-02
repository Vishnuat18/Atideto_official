import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Cpu, Cloud, Code, BarChart, Palette } from 'lucide-react';
import atidetoLogo from '@/assets/atideto-logo.png';

interface FloatingCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  desc: string;
  position: string;
  parallaxFactor: number;
  mouseOffset: { x: number; y: number };
  onClick: () => void;
}

const FloatingCard: React.FC<FloatingCardProps> = ({
  icon: Icon,
  title,
  desc,
  position,
  parallaxFactor,
  mouseOffset,
  onClick}) => {
  const tx = mouseOffset.x * parallaxFactor * 25;
  const ty = mouseOffset.y * parallaxFactor * 25;

  return (
    <div
      onClick={onClick}
      className={`absolute ${position} pointer-events-auto glass-card-premium rounded-[18px] p-5 w-[215px] hidden md:block cursor-pointer transition-all duration-300 hover:scale-[1.04] hover:border-[#2EA8FF]/30 hover:shadow-[0_0_20px_rgba(46,168,255,0.15)]`}
      style={{
        transform: `translate3d(${tx}px, ${ty}px, 0)`}}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-[#005DFF]/15 border border-[#2EA8FF]/20 flex items-center justify-center text-[#2EA8FF]">
          <Icon size={16} />
        </div>
        <h5 className="font-bold text-[14px] text-white tracking-wide uppercase font-space">{title}</h5>
      </div>
      <p className="text-[#A7B3C7] text-[11px] leading-relaxed mb-3">{desc}</p>
      <div className="text-[#2EA8FF] text-[10px] font-bold tracking-wide uppercase flex items-center gap-1">
        Learn More <span>→</span>
      </div>
    </div>
  );
};

export default function WhatWeBuildVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = canvas.width = canvas.parentElement?.clientWidth || 700;
    let height = canvas.height = canvas.parentElement?.clientHeight || 650;
    let angle = 0;
    let floatY = 0;

    const resize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 700;
      height = canvas.height = canvas.parentElement?.clientHeight || 650;
    };
    window.addEventListener('resize', resize);

    // (Removed 3D Crystal vertices and faces)

    // Wave Mesh configuration
    const waveCols = 24;
    const waveRows = 16;
    const waveSpacingX = width / (waveCols - 1);
    const waveSpacingY = 220 / (waveRows - 1);

    const draw = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, width, height);
      angle += 0.006;
      floatY = Math.sin(angle * 2.5) * 12;

      const centerX = width / 2;
      const centerY = height / 2 - 20;

      // 1. DRAW WAVE MESH (Neural Network representation at the back)
      ctx.save();
      ctx.translate(0, height - 250);
      for (let r = 0; r < waveRows; r++) {
        for (let c = 0; c < waveCols; c++) {
          const x = c * waveSpacingX;
          const baseZ = Math.sin(c * 0.3 + angle * 1.5) * Math.cos(r * 0.4 + angle * 1.2);
          const y = baseZ * 22 + (r * waveSpacingY * 0.4);

          // Connect horizontally
          if (c < waveCols - 1) {
            const nextBaseZ = Math.sin((c + 1) * 0.3 + angle * 1.5) * Math.cos(r * 0.4 + angle * 1.2);
            const nextX = (c + 1) * waveSpacingX;
            const nextY = nextBaseZ * 22 + (r * waveSpacingY * 0.4);

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(nextX, nextY);
            const alpha = Math.max(0.01, 0.18 - (r * 0.012));
            ctx.strokeStyle = `rgba(0, 93, 255, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }

          // Connect vertically
          if (r < waveRows - 1) {
            const nextBaseZ = Math.sin(c * 0.3 + angle * 1.5) * Math.cos((r + 1) * 0.4 + angle * 1.2);
            const nextY = nextBaseZ * 22 + ((r + 1) * waveSpacingY * 0.4);

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, nextY);
            const alpha = Math.max(0.01, 0.18 - (r * 0.012));
            ctx.strokeStyle = `rgba(95, 212, 255, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // 3. DRAW PARTICLES
      ctx.save();
      for (let i = 0; i < 15; i++) {
        const pAngle = angle * 0.6 + i * (Math.PI * 2 / 15);
        const px = centerX + Math.cos(pAngle) * (140 + Math.sin(angle + i) * 20);
        const py = centerY + floatY + Math.sin(pAngle * 2) * 50 + Math.cos(angle * 1.5 + i) * 15;
        
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.5, 1 + Math.sin(angle + i) * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(95, 212, 255, ${0.3 + Math.sin(angle * 2 + i) * 0.2})`;
        ctx.shadowColor = '#5FD4FF';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.restore();

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const cardsData = [
    {
      id: 'ai-agents',
      icon: Bot,
      title: 'AI Automation',
      desc: 'Intelligent workflows, LLM agents, and automated processes.',
      position: 'top-[8%] left-[8%]',
      parallaxFactor: -0.6},
    {
      id: 'custom-software',
      icon: Cpu,
      title: 'Custom Systems',
      desc: 'Tailored CRM, enterprise ERP platforms, and API integrations.',
      position: 'top-[2%] left-1/2 -translate-x-1/2',
      parallaxFactor: 0.4},
    {
      id: 'web-dev',
      icon: Code,
      title: 'Development',
      desc: 'High-performance custom web apps and mobile solutions.',
      position: 'top-[25%] right-[8%]',
      parallaxFactor: 0.5},
    {
      id: 'cloud',
      icon: Cloud,
      title: 'Cloud Solutions',
      desc: 'DevOps pipelines and scalable enterprise server hosting.',
      position: 'top-[55%] left-[6%]',
      parallaxFactor: -0.45},
    {
      id: 'ui-ux',
      icon: Palette,
      title: 'UI/UX Design',
      desc: 'Research-driven layouts and pixel-perfect interactive design.',
      position: 'bottom-[5%] left-[28%]',
      parallaxFactor: -0.3},
    {
      id: 'data-analytics',
      icon: BarChart,
      title: 'Data Analytics',
      desc: 'Extract business insights via predictive models & dashboards.',
      position: 'bottom-[12%] right-[10%]',
      parallaxFactor: 0.65},
  ];

  return (
    <div className="relative w-full overflow-visible">
      {/* Desktop View with 3D Crystal Centerpiece & absolute floating cards */}
      <div
        ref={containerRef}
        className="relative w-full h-[500px] lg:h-[650px] flex items-center justify-center overflow-visible pointer-events-none select-none"
      >
        <div className="absolute top-[25%] left-[25%] -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full aurora-bloom-1 blur-[90px] -z-10" />
        <div className="absolute top-[50%] right-[15%] w-[300px] h-[300px] rounded-full aurora-bloom-2 blur-[90px] -z-10" />

        <canvas ref={canvasRef} className="w-full h-full block" />

        {cardsData.map((c) => (
          <FloatingCard
            key={c.id}
            icon={c.icon}
            title={c.title}
            desc={c.desc}
            position={c.position}
            parallaxFactor={c.parallaxFactor}
            mouseOffset={mouseOffset}
            onClick={() => navigate(`/requirement-gathering?service=${c.id}`)}
          />
        ))}
      </div>

      {/* Mobile View with vertical cards layout */}
      <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 px-4 mt-8">
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
