import React from 'react';
import {
  Zap,
  Bot,
  Layers,
  Code,
  Smartphone,
  Sparkles,
  Server,
  Database,
  Rocket,
  Wand2,
  Cloud,
  Monitor,
  ArrowRight
} from 'lucide-react';
import InteractiveGlobeHero from './InteractiveGlobeHero';

// Row 1 Services
const ROW1_SERVICES = [
  { title: 'AI Automation', icon: Zap },
  { title: 'AI Agents', icon: Bot },
  { title: 'Custom Software', icon: Layers },
  { title: 'Web Development', icon: Code },
  { title: 'Mobile Apps', icon: Smartphone },
  { title: 'UI / UX Design', icon: Sparkles },
];

// Row 2 Services
const ROW2_SERVICES = [
  { title: 'API Development', icon: Server },
  { title: 'Database Solutions', icon: Database },
  { title: 'DevOps & Deployment', icon: Rocket },
  { title: 'Digital Transformation', icon: Wand2 },
  { title: 'Cloud Solutions', icon: Cloud },
  { title: 'Desktop Applications', icon: Monitor },
];

export default function ServiceHero() {
  const scrollToSolutions = () => {
    const el = document.getElementById('solutions-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: 700, behavior: 'smooth' });
    }
  };

  const handleServiceClick = (_serviceTitle: string) => {
    scrollToSolutions();
  };

  return (
    <div className="w-full relative bg-[#050B17]">
      {/* ── 3D Interactive Digital Globe Hero (Matching Reference Image 2) ── */}
      <InteractiveGlobeHero />

      {/* ── Services Dual-Row Running Marquee Ticker (No BG lines) ── */}
      <div className="w-full relative bg-[#050B17] py-2 sm:py-3">
        <div className="w-full relative overflow-hidden bg-transparent">
          {/* Left & Right Gradient Fade Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 z-20 pointer-events-none bg-gradient-to-r from-[#050B17] via-[#050B17]/80 to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-20 pointer-events-none bg-gradient-to-l from-[#050B17] via-[#050B17]/80 to-transparent" />

          {/* ── ROW 1 (Running Left: AI Automation, AI Agents, Custom Software, etc.) ── */}
          <div className="flex overflow-hidden select-none py-1 sm:py-1.5">
            <div className="animate-marquee-track-left flex items-center gap-2 sm:gap-2.5">
              {[...ROW1_SERVICES, ...ROW1_SERVICES, ...ROW1_SERVICES, ...ROW1_SERVICES].map((service, index) => {
                const Icon = service.icon;
                return (
                  <button
                    key={`row1-${service.title}-${index}`}
                    onClick={() => handleServiceClick(service.title)}
                    className="h-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#091329]/80 hover:bg-blue-600/20 text-slate-200 hover:text-white flex items-center gap-2.5 sm:gap-3 transition-all duration-200 group cursor-pointer shrink-0 text-left"
                  >
                    <Icon size={16} className="text-[#38BDF8] shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-xs sm:text-sm font-semibold tracking-tight whitespace-nowrap">
                      {service.title}
                    </span>
                    <ArrowRight
                      size={12}
                      className="text-slate-400 group-hover:text-[#38BDF8] group-hover:translate-x-0.5 transition-all ml-0.5"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── ROW 2 (Running Right: API Development, Database Solutions, DevOps, etc.) ── */}
          <div className="flex overflow-hidden select-none py-1 sm:py-1.5">
            <div className="animate-marquee-track-right flex items-center gap-2 sm:gap-2.5">
              {[...ROW2_SERVICES, ...ROW2_SERVICES, ...ROW2_SERVICES, ...ROW2_SERVICES].map((service, index) => {
                const Icon = service.icon;
                return (
                  <button
                    key={`row2-${service.title}-${index}`}
                    onClick={() => handleServiceClick(service.title)}
                    className="h-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#091329]/80 hover:bg-blue-600/20 text-slate-200 hover:text-white flex items-center gap-2.5 sm:gap-3 transition-all duration-200 group cursor-pointer shrink-0 text-left"
                  >
                    <Icon size={16} className="text-[#38BDF8] shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-xs sm:text-sm font-semibold tracking-tight whitespace-nowrap">
                      {service.title}
                    </span>
                    <ArrowRight
                      size={12}
                      className="text-slate-400 group-hover:text-[#38BDF8] group-hover:translate-x-0.5 transition-all ml-0.5"
                    />
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
