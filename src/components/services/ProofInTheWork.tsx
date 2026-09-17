import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface ProofInTheWorkProps {
  ctaText?: string;
  ctaHref?: string;
}

export default function ProofInTheWork({
  ctaText = 'Meet Atideto',
  ctaHref = '/about'
}: ProofInTheWorkProps) {
  return (
    <section className="relative w-full bg-[#080E21] py-20 lg:py-28 px-6 lg:px-12 border-y border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column Content */}
        <div className="flex flex-col items-start">
          <span className="text-[#38BDF8] text-xs font-bold tracking-[0.2em] uppercase mb-4">
            PROOF IN THE WORK
          </span>
          <h2 className="text-white font-extrabold text-3xl sm:text-4xl lg:text-[50px] leading-[1.14] tracking-tight mb-6 font-montserrat">
            Big enough to deliver.<br />
            Close enough to care.
          </h2>
          <p className="text-slate-300/90 text-base sm:text-lg leading-relaxed max-w-lg mb-8">
            We bring a focused senior team to every engagement, so the work stays accountable, collaborative, and moving forward.
          </p>
          <Link
            to={ctaHref}
            className="text-white hover:text-[#38BDF8] font-semibold text-sm sm:text-base inline-flex items-center gap-2 transition-colors group cursor-pointer"
          >
            <span>{ctaText}</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Right Column Stats 2x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02] shadow-2xl backdrop-blur-sm">
          {/* Stat 1: 100+ Projects Delivered */}
          <div className="p-8 sm:p-10 border-b sm:border-r border-white/10 flex flex-col justify-center">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-2 font-montserrat">
              100+
            </span>
            <span className="text-slate-400 font-semibold text-xs tracking-wider uppercase">
              PROJECTS DELIVERED
            </span>
          </div>

          {/* Stat 2: 98% Client Satisfaction */}
          <div className="p-8 sm:p-10 border-b border-white/10 flex flex-col justify-center">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-2 font-montserrat">
              98%
            </span>
            <span className="text-slate-400 font-semibold text-xs tracking-wider uppercase">
              CLIENT SATISFACTION
            </span>
          </div>

          {/* Stat 3: 50+ Happy Clients (Replaced Countries Served) */}
          <div className="p-8 sm:p-10 sm:border-r border-b sm:border-b-0 border-white/10 flex flex-col justify-center">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-2 font-montserrat">
              50+
            </span>
            <span className="text-slate-400 font-semibold text-xs tracking-wider uppercase">
              HAPPY CLIENTS
            </span>
          </div>

          {/* Stat 4: 2K+ Students Trained */}
          <div className="p-8 sm:p-10 flex flex-col justify-center">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-2 font-montserrat">
              2K+
            </span>
            <span className="text-slate-400 font-semibold text-xs tracking-wider uppercase">
              STUDENTS TRAINED
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
