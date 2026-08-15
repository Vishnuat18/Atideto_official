import { useEffect, useState, useMemo } from 'react';
import { useTheme } from 'next-themes';
import atidetoLogo from '@/assets/atideto-logo.png';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(onComplete, 800);
          }, 400);
          return 100;
        }
        const increment = p < 50 ? Math.random() * 2 + 0.5 : Math.random() * 4 + 1;
        return p + increment;
      });
    }, 60);
    return () => clearInterval(timer);
  }, [onComplete]);

  // Generate background particles
  const { particles, dust } = useMemo(() => {
    const generate = (count: number, className: string, isDust: boolean) => 
      Array.from({ length: count }).map((_, i) => {
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const size = isDust ? Math.random() * 1 + 0.5 : Math.random() * 2 + 0.5;
        const delay = Math.random() * 10;
        const duration = Math.random() * 15 + 10;
        return (
          <div 
            key={i} 
            className={className} 
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `-${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      });
    return {
      particles: generate(25, 'particle', false),
      dust: generate(45, 'dust', true)
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundColor: isDark ? '#050505' : '#F8FAFC',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.8s cubic-bezier(0.65, 0, 0.35, 1)',
        pointerEvents: fadeOut ? 'none' : 'all',
        fontFamily: '"Inter", "Outfit", "Segoe UI", sans-serif'
      }}
    >
      {/* Background Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vh] h-[70vh] bg-[#818CF8] rounded-full blur-[160px] opacity-[0.1]" />
        
        {/* Minimal Futuristic Grid */}
        <div 
          className="absolute inset-0 opacity-[0.25]"
          style={{ 
            backgroundImage: 'linear-gradient(rgba(47, 47, 228, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(47, 47, 228, 0.12) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            transform: 'perspective(1000px) rotateX(75deg) translateY(-100px) scale(2.5)',
            transformOrigin: 'top center'
          }}
        />

        {/* Particles */}
        <div className="absolute inset-0">
          {particles}
          {dust}
        </div>
      </div>

      {/* Main HUD Loader Container */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        
        {/* Circular HUD Loader */}
        <div className="relative flex items-center justify-center w-[320px] h-[320px] md:w-[400px] md:h-[400px]">
          {/* Subtle background volumetric light */}
          <div className="absolute inset-0 rounded-full bg-[#6366F1] blur-[70px] opacity-[0.08]" />

          {/* SVG HUD Rings */}
          <svg className="absolute inset-0 w-full h-full drop-shadow-[0_0_12px_rgba(99,102,241,0.3)]" viewBox="0 0 200 200">
            <defs>
              <filter id="hud-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="primary-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2F2FE4" stopOpacity="1" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Faint Base Ring */}
            <circle cx="100" cy="100" r="96" fill="none" stroke="#6366F1" strokeWidth="0.5" strokeOpacity="0.15" />
            
            {/* Outer Segmented Rotating Ring */}
            <g className="hud-layer-1" style={{ transformOrigin: '100px 100px' }}>
              <circle cx="100" cy="100" r="96" fill="none" stroke="url(#primary-grad)" strokeWidth="1" strokeDasharray="35 15 10 25 140 20" strokeLinecap="round" filter="url(#hud-glow)" strokeOpacity="0.9" />
              {/* Radar edge dots */}
              <circle cx="100" cy="4" r="1.5" fill="#2F2FE4" filter="url(#hud-glow)" />
              <circle cx="100" cy="196" r="1" fill="#6366F1" filter="url(#hud-glow)" />
            </g>

            {/* Inner Technical Lines Rotating Counter-Clockwise */}
            <g className="hud-layer-2" style={{ transformOrigin: '100px 100px' }}>
              <circle cx="100" cy="100" r="88" fill="none" stroke="#6366F1" strokeWidth="0.5" strokeDasharray="2 6" strokeOpacity="0.6" />
              <circle cx="100" cy="100" r="88" fill="none" stroke="#2F2FE4" strokeWidth="1.5" strokeDasharray="50 180" strokeLinecap="round" filter="url(#hud-glow)" />
            </g>

            {/* Innermost Accents */}
            <g className="hud-layer-3" style={{ transformOrigin: '100px 100px' }}>
              <circle cx="100" cy="100" r="78" fill="none" stroke="#6366F1" strokeWidth="0.3" strokeDasharray="1 12" strokeOpacity="0.5" />
            </g>
          </svg>

          {/* Conic Radar Sweep */}
          <div 
            className="absolute inset-[20px] rounded-full radar-sweep pointer-events-none" 
            style={{ 
              background: 'conic-gradient(from 0deg, transparent 70%, rgba(99, 102, 241, 0.06) 90%, rgba(99, 102, 241, 0.18) 100%)',
              maskImage: 'radial-gradient(transparent 50%, black 100%)',
              WebkitMaskImage: 'radial-gradient(transparent 55%, black 100%)'
            }} 
          />

          {/* Content Inside the Circle */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
            <div className="relative group flex items-center justify-center">
              {/* Metallic glass reflection behind logo */}
              <div className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#6366F1] blur-[30px] opacity-[0.12] animate-pulse" style={{ animationDuration: '4s' }} />
              
              {/* Spinning Wrapper for Logo */}
              <div className="logo-spin relative z-10 flex items-center justify-center">
                <img 
                  src={atidetoLogo} 
                  alt="ATIDETO" 
                  className="w-28 md:w-36 object-contain" 
                  style={{
                    filter: 'drop-shadow(0 2px 8px rgba(15,23,42,0.18))',
                    animation: 'breathe 4s ease-in-out infinite'
                  }}
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center">
              <span 
                className="text-[#475569] text-[10px] md:text-xs font-light tracking-[0.6em] ml-[0.6em] uppercase"
                style={{ textShadow: '0 1px 2px rgba(99,102,241,0.25)' }}
              >
                LOADING
              </span>
              <div className="flex gap-[6px] mt-4">
                <span className="w-[4px] h-[4px] rounded-full bg-[#2F2FE4] shadow-[0_0_8px_rgba(47,47,228,0.5)] animate-pulse-dot" style={{ animationDelay: '0ms' }} />
                <span className="w-[4px] h-[4px] rounded-full bg-[#2F2FE4] shadow-[0_0_8px_rgba(47,47,228,0.5)] animate-pulse-dot" style={{ animationDelay: '200ms' }} />
                <span className="w-[4px] h-[4px] rounded-full bg-[#2F2FE4] shadow-[0_0_8px_rgba(47,47,228,0.5)] animate-pulse-dot" style={{ animationDelay: '400ms' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar Section (Below the Circle) */}
        <div className="mt-14 flex flex-col items-center gap-4 w-[280px] md:w-[340px]">
          <span 
            className="text-[#2F2FE4] text-sm md:text-base font-light tracking-wider"
            style={{ 
              textShadow: '0 1px 2px rgba(47,47,228,0.2)',
              fontVariantNumeric: 'tabular-nums'
            }}
          >
            {Math.min(Math.floor(progress), 100)}%
          </span>
          
          <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full relative overflow-hidden border border-[#C7D2FE]/60">
            <div className="absolute inset-0 bg-[#6366F1]/10" />
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#2F2FE4] to-[#6366F1] rounded-full transition-all duration-[60ms] ease-linear"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-full progress-shine blur-[2px] opacity-80 rounded-full" />
            </div>
          </div>
        </div>

      </div>

      {/* Animation Styles */}
      <style>{`
        .hud-layer-1 { animation: spin-clockwise 10s linear infinite; }
        .hud-layer-2 { animation: spin-counter 15s linear infinite; }
        .hud-layer-3 { animation: spin-clockwise 8s linear infinite; }
        .radar-sweep { animation: spin-clockwise 3s linear infinite; }
        .logo-spin { animation: spin-vertical 8s linear infinite; transform-style: preserve-3d; }

        @keyframes spin-vertical {
          from { transform: perspective(1000px) rotateY(0deg); }
          to { transform: perspective(1000px) rotateY(360deg); }
        }
        @keyframes spin-clockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-counter {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes breathe {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 2px 8px rgba(15,23,42,0.18)); }
          50% { transform: scale(1.05); filter: drop-shadow(0 4px 14px rgba(15,23,42,0.24)); }
        }
        
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); box-shadow: 0 0 10px #2F2FE4, 0 0 5px #818CF8; }
        }
        
        @keyframes float-up {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
          20% { opacity: 0.5; }
          80% { opacity: 0.25; }
          100% { transform: translateY(-150px) rotate(360deg); opacity: 0; }
        }
        
        .particle {
          position: absolute;
          background: #6366F1;
          border-radius: 50%;
          animation: float-up 10s infinite linear;
          filter: blur(0.5px);
          box-shadow: 0 0 8px 2px rgba(99, 102, 241, 0.4);
        }
        
        .dust {
          position: absolute;
          background: #A5B4FC;
          border-radius: 50%;
          animation: float-up 15s infinite linear;
          opacity: 0.25;
          filter: blur(1px);
        }
      `}</style>
    </div>
  );
}
