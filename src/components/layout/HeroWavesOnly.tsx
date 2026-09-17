import React, { useEffect, useRef } from 'react';

export default function HeroWavesOnly() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      ctx.translate(0, height - 280);
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
            const alpha = Math.max(0.01, 0.2 - (r * 0.012));
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
            const alpha = Math.max(0.01, 0.2 - (r * 0.012));
            ctx.strokeStyle = `rgba(95, 212, 255, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // 2. DRAW SWIRLING NEURAL PARTICLES
      ctx.save();
      for (let i = 0; i < 25; i++) {
        const pAngle = angle * 0.6 + i * (Math.PI * 2 / 25);
        const px = centerX + Math.cos(pAngle) * (150 + Math.sin(angle + i) * 30);
        const py = centerY + floatY + Math.sin(pAngle * 2) * 60 + Math.cos(angle * 1.5 + i) * 20;
        
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.5, 1.2 + Math.sin(angle + i) * 0.6), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(95, 212, 255, ${0.4 + Math.sin(angle * 2 + i) * 0.2})`;
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

  return (
    <div className="relative w-full h-[500px] lg:h-[650px] flex items-center justify-center overflow-visible pointer-events-none select-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
