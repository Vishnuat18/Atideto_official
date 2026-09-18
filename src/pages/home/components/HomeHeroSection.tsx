import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { TECH_STACK } from '@/constants/techStack';
import { useTheme } from '@/context/ThemeContext';

export default function HomeHeroSection() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <section className={`relative min-h-[92vh] lg:min-h-screen w-full flex flex-col justify-between overflow-hidden pt-20 sm:pt-24 pb-0 transition-colors duration-300 ${
      isLight ? 'bg-[#F4F5F7] border-b border-black/10 text-black' : 'bg-[#050505] border-b border-white/10 text-white'
    }`}>
      {/* ── Blueprint Grid & Ambient Center Glow ── */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-300"
        style={{
          backgroundImage: isLight
            ? `
              radial-gradient(circle at 50% 38%, rgba(0, 93, 255, 0.06) 0%, rgba(244, 245, 247, 0) 70%),
              linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
            `
            : `
              radial-gradient(circle at 50% 38%, rgba(0, 93, 255, 0.18) 0%, rgba(5, 5, 5, 0) 70%),
              linear-gradient(to right, rgba(46, 168, 255, 0.07) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(46, 168, 255, 0.07) 1px, transparent 1px)
            `,
          backgroundSize: '100% 100%, 48px 48px, 48px 48px'
        }}
      />
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[680px] h-[360px] rounded-full blur-[140px] pointer-events-none transition-colors duration-300 ${
        isLight ? 'bg-blue-500/5' : 'bg-[#005DFF]/15'
      }`} />

      {/* ── Centered Hero Content ── */}
      <div className="relative max-w-5xl mx-auto px-6 text-center z-10 flex-1 flex flex-col items-center justify-center py-4 my-auto">
        
        {/* Top Badge */}
        <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-4 transition-all duration-300 ${
          isLight
            ? 'border border-black/15 bg-white text-black shadow-sm'
            : 'border border-[#2EA8FF]/30 bg-[#2EA8FF]/10 text-[#2EA8FF] shadow-[0_0_15px_rgba(46,168,255,0.2)]'
        }`}>
          WHAT CAN WE SOLVE FOR YOU?
        </div>

        {/* Main Heading */}
        <h1 className={`font-montserrat font-extrabold text-3xl sm:text-5xl lg:text-[50px] xl:text-[54px] leading-[1.14] tracking-tight mb-3 sm:mb-4 transition-colors duration-300 ${
          isLight ? 'text-[#0A0A0A]' : 'text-white'
        }`}>
          Your Business Has Problems.
          <br />
          <span className="animate-text-gradient font-black block my-0.5">
            We Build the Technology
          </span>
          to Solve Them.
        </h1>

        {/* Description */}
        <p className={`text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 font-normal transition-colors duration-300 ${
          isLight ? 'text-zinc-600' : 'text-[#A7B3C7]'
        }`}>
          We build intelligent software, AI automation, premium web experiences, mobile applications, cloud solutions, and scalable digital platforms that empower businesses to innovate, automate, and grow faster.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/services')}
            className="btn-liquid-slide px-7 sm:px-8 py-3.5 text-sm sm:text-[15px] font-semibold hover:scale-[1.02]"
          >
            <span>Explore Our Solutions</span>
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => navigate('/client-connect')}
            className="btn-outline px-7 sm:px-8 py-3.5 text-sm sm:text-[15px] font-semibold hover:scale-[1.02]"
          >
            <span>Get Started</span>
            <ArrowRight size={16} className={isLight ? 'text-black' : 'text-[#2EA8FF]'} />
          </button>
        </div>

      </div>

      {/* ── Fluent Across Your Stack Carousel Strip ── */}
      <div className={`w-full relative z-10 border-t border-b overflow-hidden flex items-center transition-colors duration-300 ${
        isLight
          ? 'border-black/10 bg-white/95 backdrop-blur-md'
          : 'border-white/10 bg-[#080D1A]/90 backdrop-blur-md'
      }`}>
        {/* Left Fixed Label (Hidden on Mobile) */}
        <div className={`hidden sm:flex shrink-0 pl-6 sm:pl-10 pr-6 sm:pr-8 py-3.5 sm:py-4 items-center justify-center z-20 transition-colors duration-300 ${
          isLight ? 'bg-white text-black' : 'bg-[#080D1A] text-[#2EA8FF]'
        }`}>
          <span className={`text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-left leading-[1.3] whitespace-nowrap ${
            isLight ? 'text-[#0A0A0A]' : 'text-[#2EA8FF]'
          }`}>
            FLUENT ACROSS<br className="hidden sm:block" /> YOUR STACK
          </span>
        </div>

        {/* Right Running Marquee of Tech Stack Pills */}
        <div className="relative flex-1 overflow-hidden select-none py-3 sm:py-3.5">
          {/* Left & Right edge masks */}
          <div className={`absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-10 pointer-events-none transition-all duration-300 ${
            isLight
              ? 'bg-gradient-to-r from-white via-white/90 to-transparent'
              : 'bg-gradient-to-r from-[#080D1A] via-[#080D1A]/90 to-transparent'
          }`} />
          <div className={`absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-10 pointer-events-none transition-all duration-300 ${
            isLight
              ? 'bg-gradient-to-l from-white via-white/90 to-transparent'
              : 'bg-gradient-to-l from-[#080D1A] via-[#080D1A]/90 to-transparent'
          }`} />

          <div className="animate-marquee-track-left flex items-center">
            {[...TECH_STACK, ...TECH_STACK].map((tech, index) => {
              const Icon = tech.icon;
              return (
                <div
                  key={`tech-${tech.name}-${index}`}
                  className={`mx-1.5 px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-[13px] font-semibold whitespace-nowrap shadow-sm transition-all duration-200 cursor-default flex items-center gap-2 group/tech ${
                    isLight
                      ? 'border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-black/30 text-zinc-800 hover:text-black'
                      : 'border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#2EA8FF]/50 text-slate-200 hover:text-white'
                  }`}
                >
                  <Icon
                    size={16}
                    style={{ color: tech.color }}
                    className="shrink-0 transition-transform duration-200 group-hover/tech:scale-125"
                  />
                  <span>{tech.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
