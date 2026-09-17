import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function SignalCtaBanner() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full bg-[#05070B] py-16 sm:py-24 px-4 sm:px-6 lg:px-12 overflow-hidden border-t border-white/5">
      
      {/* ── Top Subtle Cyan/Blue Gradient Divider (Matching About Page) ── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3B82F6]/25 to-transparent pointer-events-none" />
      
      {/* ── Soft Ambient Glow (Matching About Page CTA) ── */}
      <div className="absolute inset-0 bg-[#3B82F6] opacity-[0.03] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="relative rounded-2xl sm:rounded-[32px] overflow-hidden bg-gradient-to-br from-[#2442E6] via-[#213CC9] to-[#182B96] p-8 sm:p-12 lg:p-16 shadow-[0_20px_60px_-15px_rgba(33,60,201,0.4)] border border-blue-400/20">
          
          {/* ── Background Ring Design (Matching Attached Reference Image) ── */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            {/* Outer Ring 3 */}
            <div className="absolute -top-[320px] -right-[220px] sm:-top-[420px] sm:-right-[220px] w-[950px] h-[950px] sm:w-[1300px] sm:h-[1300px] rounded-full border border-white/[0.08] bg-black/[0.05]" />
            {/* Middle Ring 2 */}
            <div className="absolute -top-[220px] -right-[140px] sm:-top-[300px] sm:-right-[140px] w-[700px] h-[700px] sm:w-[980px] sm:h-[980px] rounded-full border border-white/[0.12] bg-black/[0.09]" />
            {/* Inner Ring 1 */}
            <div className="absolute -top-[140px] -right-[60px] sm:-top-[180px] sm:-right-[60px] w-[500px] h-[500px] sm:w-[680px] sm:h-[680px] rounded-full border border-white/[0.15] bg-black/[0.07]" />
          </div>

          {/* ── Foreground Content Grid ── */}
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">
            
            {/* Left Column: Eyebrow & Headline */}
            <div className="max-w-xl">
              <p className="text-blue-200/90 text-xs sm:text-[13px] font-bold tracking-[0.18em] uppercase mb-4 sm:mb-6">
                START WITH THE SIGNAL
              </p>

              <h2 className="text-white font-extrabold text-3xl sm:text-4xl lg:text-[48px] leading-[1.14] tracking-tight font-montserrat">
                You have the ambition.<br />
                <span className="text-[#67E8F9]">
                  Let's build the advantage.
                </span>
              </h2>
            </div>

            {/* Right Column: Copy & Interactive Button */}
            <div className="max-w-md flex flex-col items-start">
              <p className="text-blue-100/90 text-sm sm:text-base lg:text-[17px] leading-relaxed mb-6 sm:mb-8 font-normal">
                Tell us where you're headed. We'll help define the fastest, most valuable way forward.
              </p>

              {/* White Pill Button with Slide-Fill Hover Effect */}
              <button
                onClick={() => navigate('/client-connect')}
                className="group relative w-fit px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white text-[#1A255A] font-bold text-sm sm:text-base tracking-wide overflow-hidden shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 inline-flex items-center gap-2.5 cursor-pointer"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>Talk to our team</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
