import { useState } from 'react';
import { ChevronRight, LucideIcon } from 'lucide-react';
import GradientWaves from '@/components/ui/GradientWaves';

export interface CareerWaveCardProps {
  id: string;
  title: string;
  department: string;
  description: string;
  icon: LucideIcon;
  onJDClick?: () => void;
  onLearnMoreClick?: () => void;
  className?: string;
}

export default function CareerWaveCard({
  title,
  department,
  description,
  icon: Icon,
  onJDClick,
  onLearnMoreClick,
  className = ''
}: CareerWaveCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-[28px] overflow-hidden min-h-[460px] sm:min-h-[490px] border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_24px_60px_rgba(0,82,255,0.3)] transition-all duration-300 flex flex-col justify-between group bg-[#070913] text-white ${className}`}
    >
      {/* ── 1. Full Card Wave Animation Background (Electric Blue tones) ── */}
      <div className="absolute inset-0 z-0">
        <GradientWaves
          horizonColor="#001845"
          waveColor="#0052FF"
          crestColor="#38BDF8"
          backgroundColor="#070913"
          speed={isHovered ? 0.6 : 0.05}
          amplitude={isHovered ? 2.8 : 1.4}
          relief={1}
          lightAngle={120}
          mouseInteraction={true}
          paused={!isHovered}
          quality="medium"
        />
      </div>

      {/* ── 2. Top-Left Floating Icon Badge (Reference Image Style) ── */}
      <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between">
        <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white shadow-md group-hover:scale-105 group-hover:bg-[#0052FF] transition-all duration-300">
          <Icon size={20} className="text-white" />
        </div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-300/80 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
          {department}
        </span>
      </div>

      {/* ── 3. Bottom Text (Pure blur overlay without dark div container, matching 2nd ref image) ── */}
      <div className="relative z-10 p-6 sm:p-7 backdrop-blur-md flex flex-col justify-between">
        <div>
          {/* Heading (Cyan as per 2nd reference image) */}
          <h3
            className="text-xl sm:text-[23px] font-bold text-[#67E8F9] tracking-tight leading-snug mb-2 font-heading group-hover:text-cyan-200 transition-colors"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {title}
          </h3>

          {/* Description */}
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-sans mb-6 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Buttons Row (Matching Reference Image) */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onJDClick}
            className="px-6 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer font-heading"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            JD
          </button>

          <button
            type="button"
            onClick={onLearnMoreClick}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white/95 hover:text-cyan-300 transition-colors cursor-pointer font-heading group/link"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <span>Learn more</span>
            <ChevronRight size={15} className="group-hover/link:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
