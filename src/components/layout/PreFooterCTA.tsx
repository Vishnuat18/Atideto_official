import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function LightweightParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let isVisible = false;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // 50 lightweight particles
    const count = 50;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * (canvas.width || 800),
      y: Math.random() * (canvas.height || 300),
      vx: (Math.random() * 0.4 + 0.2), // slow drift right
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.8 + 0.8,
      alpha: Math.random() * 0.6 + 0.2
    }));

    let time = 0;
    const render = () => {
      if (!isVisible) return;
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < count; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy + Math.sin(time + i) * 0.15;

        // Wrap around seamlessly
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.fillStyle = `rgba(46, 168, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles with faint electric lines
        for (let j = i + 1; j < count; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.strokeStyle = `rgba(46, 168, 255, ${0.15 * (1 - dist / 80)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    // Only run animation when in viewport (0% CPU when off-screen)
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animId);
      }
    }, { threshold: 0.05 });

    observer.observe(canvas);

    return () => {
      window.removeEventListener('resize', resize);
      observer.disconnect();
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}

export default function PreFooterCTA() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Omit on pages that do not need CTA
  if (
    location.pathname === '/login' ||
    location.pathname === '/dashboard' ||
    location.pathname === '/profile' ||
    location.pathname === '/services'
  ) {
    return null;
  }

  return (
    <div id="pre-footer-cta" className="w-full bg-[#050505] pt-8 pb-8 sm:pt-12 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="relative rounded-[20px] sm:rounded-[24px] overflow-hidden border border-[#005DFF]/20 bg-[#020617] shadow-[0_0_40px_rgba(0,93,255,0.08)]">
          
          {/* Lightweight Zero-Overhead Background Canvas */}
          <div className="absolute inset-0 w-full h-full pointer-events-none opacity-80">
            <LightweightParticleField />
          </div>
          
          {/* Ambient Glow Accents */}
          <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-[#005DFF]/20 to-transparent blur-[80px] pointer-events-none" />
          <div className="absolute right-0 bottom-0 w-1/3 h-full bg-gradient-to-l from-[#2EA8FF]/10 to-transparent blur-[60px] pointer-events-none" />
          
          {/* Content */}
          <div className="relative z-10 px-6 py-8 sm:py-12 md:py-14 sm:px-10 md:px-16 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-10">
            
            {/* Left Text */}
            <div className="flex-1 max-w-md text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold text-white leading-tight">
                Ready to Start Your <br className="hidden md:block" /> Next Big Project?
              </h2>
            </div>
            
            {/* Middle Text */}
            <div className="flex-1 max-w-sm text-center lg:text-left">
              <p className="text-[#8e9bb0] text-sm sm:text-[15px] leading-relaxed">
                Let's work together to build something amazing and create digital experiences that make a difference.
              </p>
            </div>
            
            {/* Right Button */}
            <div className="shrink-0 w-full sm:w-auto flex justify-center">
              <button 
                onClick={() => navigate('/client-connect')}
                className="btn-liquid-slide w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 font-semibold text-xs sm:text-[13px] tracking-wider uppercase shadow-[0_0_20px_rgba(0,93,255,0.3)] hover:scale-[1.02]"
              >
                <span>Let's discuss your project</span>
                <ArrowRight size={16} />
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
