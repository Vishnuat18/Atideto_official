import React, { useEffect, useRef, useState } from 'react';
import { Bot, Cpu, Cloud, Code, BarChart, Palette } from 'lucide-react';

interface FloatingCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  desc: string;
  position: string;
  parallaxFactor: number;
  mouseOffset: { x: number; y: number };
}

const FloatingCard: React.FC<FloatingCardProps> = ({
  icon: Icon,
  title,
  desc,
  position,
  parallaxFactor,
  mouseOffset}) => {
  // Combine mouse parallax offset with standard floating CSS
  const tx = mouseOffset.x * parallaxFactor * 25;
  const ty = mouseOffset.y * parallaxFactor * 25;

  return (
    <div
      className={`absolute ${position} pointer-events-auto glass-card-premium rounded-[18px] p-5 w-[210px] hidden md:block transition-transform duration-300 ease-out`}
      style={{
        transform: `translate3d(${tx}px, ${ty}px, 0)`}}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-[#005DFF]/15 border border-[#2EA8FF]/20 flex items-center justify-center text-[#2EA8FF]">
          <Icon size={16} />
        </div>
        <h5 className="font-bold text-[14px] text-white tracking-wide uppercase">{title}</h5>
      </div>
      <p className="text-[#A7B3C7] text-[11px] leading-relaxed">{desc}</p>
    </div>
  );
};

export default function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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
      width = canvas.width = canvas.parentElement?.clientWidth || 700;
      height = canvas.height = canvas.parentElement?.clientHeight || 650;
    };
    window.addEventListener('resize', resize);

    // 3D Crystal vertices (Octahedron / Diamond shape)
    const vertices = [
      { x: 0, y: -130, z: 0 },  // Top
      { x: 75, y: 0, z: 75 },   // Middle points
      { x: -75, y: 0, z: 75 },
      { x: -75, y: 0, z: -75 },
      { x: 75, y: 0, z: -75 },
      { x: 0, y: 130, z: 0 }    // Bottom
    ];

    // Face structures connecting vertices
    const faces = [
      [0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 1], // Top pyramid
      [5, 2, 1], [5, 3, 2], [5, 4, 3], [5, 1, 4]  // Bottom pyramid
    ];

    // Wave Mesh configuration
    const waveCols = 24;
    const waveRows = 16;
    const waveSpacingX = width / (waveCols - 1);
    const waveSpacingY = 220 / (waveRows - 1);

    const draw = () => {
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

      // 2. DRAW ROTATING HOLOGRAPHIC PLATFORM
      ctx.save();
      ctx.translate(centerX, centerY + 170);
      ctx.scale(1, 0.28); // Flatten to create 3D perspective

      // Outer energy ring
      ctx.beginPath();
      ctx.arc(0, 0, 180, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 93, 255, 0.15)';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Segmented rotating ring
      ctx.save();
      ctx.rotate(-angle * 1.8);
      ctx.beginPath();
      ctx.arc(0, 0, 150, 0, Math.PI * 2);
      ctx.setLineDash([40, 30, 10, 30]);
      ctx.strokeStyle = 'rgba(46, 168, 255, 0.4)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();

      // Center glowing pulse ring
      ctx.save();
      ctx.rotate(angle * 1.2);
      ctx.beginPath();
      ctx.arc(0, 0, 110, 0, Math.PI * 2);
      ctx.setLineDash([8, 12]);
      ctx.strokeStyle = 'rgba(95, 212, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Platform grid pattern overlay
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

      // 4. DRAW 3D FLOATING CRYSTAL LOGO
      ctx.save();
      ctx.translate(centerX, centerY + floatY);

      // Rotate points in 3D space
      const cosY = Math.cos(angle);
      const sinY = Math.sin(angle);
      const cosX = Math.cos(0.25); // Tilt slightly on X axis
      const sinX = Math.sin(0.25);

      const rotated: { x: number; y: number; depth: number }[] = vertices.map(v => {
        // Rotate around Y axis
        let x1 = v.x * cosY - v.z * sinY;
        let z1 = v.z * cosY + v.x * sinY;

        // Rotate around X axis
        let y2 = v.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + v.y * sinX;

        // Perspective scale factor
        const perspective = 300 / (300 + z2);
        return {
          x: x1 * perspective,
          y: y2 * perspective,
          depth: z2
        };
      });

      // Render faces sorted by depth (back to front)
      const sortedFaces = faces
        .map((face, index) => {
          const avgDepth = (rotated[face[0]].depth + rotated[face[1]].depth + rotated[face[2]].depth) / 3;
          return { face, avgDepth, index };
        })
        .sort((a, b) => b.avgDepth - a.avgDepth);

      sortedFaces.forEach(({ face }) => {
        const p1 = rotated[face[0]];
        const p2 = rotated[face[1]];
        const p3 = rotated[face[2]];

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();

        // Calculate shading based on depth and rotation angle to simulate crystal reflections
        const baseColor = 'rgba(0, 93, 255, 0.12)';
        const glowColor = 'rgba(95, 212, 255, 0.28)';
        
        const grad = ctx.createLinearGradient(p1.x, p1.y, p3.x, p3.y);
        grad.addColorStop(0, baseColor);
        grad.addColorStop(0.5, 'rgba(46, 168, 255, 0.22)');
        grad.addColorStop(1, glowColor);

        ctx.fillStyle = grad;
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Neon outline/wire overlay on the edges
        ctx.strokeStyle = 'rgba(46, 168, 255, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      ctx.restore();

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] lg:h-[650px] flex items-center justify-center overflow-visible pointer-events-none select-none"
    >
      {/* Background Volumetric Glows */}
      <div className="absolute top-[25%] left-[25%] -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full aurora-bloom-1 blur-[90px] -z-10" />
      <div className="absolute top-[50%] right-[15%] w-[300px] h-[300px] rounded-full aurora-bloom-2 blur-[90px] -z-10" />

      {/* Main Canvas Engine */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />

      {/* 6 Absolute Overlay Glass Cards with Cursor Parallax */}
      <FloatingCard
        icon={Bot}
        title="AI Automation"
        desc="Intelligent workflows, LLM agents, and automated processes."
        position="top-[12%] left-[4%]"
        parallaxFactor={-0.6}
        mouseOffset={mouseOffset}
      />

      <FloatingCard
        icon={Code}
        title="Development"
        desc="High-performance custom web apps and mobile solutions."
        position="top-[25%] right-[2%]"
        parallaxFactor={0.5}
        mouseOffset={mouseOffset}
      />

      <FloatingCard
        icon={Cloud}
        title="Cloud Solutions"
        desc="DevOps pipelines and scalable enterprise server hosting."
        position="top-[52%] left-[2%]"
        parallaxFactor={-0.45}
        mouseOffset={mouseOffset}
      />

      <FloatingCard
        icon={BarChart}
        title="Data Analytics"
        desc="Extract business insights via predictive models & dashboards."
        position="bottom-[18%] right-[4%]"
        parallaxFactor={0.65}
        mouseOffset={mouseOffset}
      />

      <FloatingCard
        icon={Palette}
        title="UI/UX Design"
        desc="Research-driven layouts and pixel-perfect interactive design."
        position="bottom-[8%] left-[22%]"
        parallaxFactor={-0.3}
        mouseOffset={mouseOffset}
      />

      <FloatingCard
        icon={Cpu}
        title="Custom Systems"
        desc="Tailored CRM, enterprise ERP platforms, and API integrations."
        position="top-[5%] right-[25%]"
        parallaxFactor={0.4}
        mouseOffset={mouseOffset}
      />
    </div>
  );
}
