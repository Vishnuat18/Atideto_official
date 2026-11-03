import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Cpu } from 'lucide-react';
import heroBg from '@/assets/section/hero.png';

export default function HeroSection() {
  return (
    <section 
      className="relative min-h-screen w-full flex items-center overflow-hidden z-10 border-b border-[#3B82F6]/20 bg-[#030611]"
      style={{ 
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dynamic dark gradient overlays to ensure text clarity against the glowing artwork */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-[#030611] via-[#030611]/85 to-transparent md:via-[#030611]/60 lg:to-transparent pointer-events-none" 
        aria-hidden="true"
      />
      <div 
        className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#05070B] via-[#05070B]/60 to-transparent pointer-events-none" 
        aria-hidden="true"
      />

      {/* Main Left-Aligned Content Container */}
      <div className="relative max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 pt-32 pb-20 z-10">
        <div className="max-w-2xl text-left flex flex-col items-start">
          
          {/* Eyebrow Tagline (Matching 2nd Reference Image) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-4 select-none"
          >
            <span className="w-8 sm:w-10 h-[1.5px] bg-[#0052FF] shrink-0" />
            <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase font-heading text-[#2EA8FF]">
              ABOUT ATIDETO
            </span>
          </motion.div>

          {/* Main Headline (Max 44px Desktop, 30px Mobile, Weight 700, Line-Height 1.18) */}
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[30px] sm:text-[36px] lg:text-[44px] font-bold mb-6 tracking-tight text-white drop-shadow-2xl leading-[1.18] font-heading max-w-2xl"
          >
            Pioneering The{' '}
            <span className="italic text-[#38BDF8] drop-shadow-[0_0_35px_rgba(56,189,248,0.45)]">
              Next Frontier
            </span>{' '}
            of Technology
          </motion.h1>

          {/* Subtitle Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-slate-300/90 text-base sm:text-lg lg:text-xl max-w-xl leading-relaxed font-normal mb-10 font-inter"
          >
            Atideto is an elite software engineering studio and technology academy. We build resilient enterprise architectures, intelligent automation pipelines, and high-impact digital products calibrated for explosive growth.
          </motion.p>

          {/* Key Metric Highlights */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid grid-cols-3 gap-4 sm:gap-8 pt-6 border-t border-white/10 w-full max-w-lg mb-8"
          >
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
                100<span className="text-cyan-400">+</span>
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium font-sans">Projects Delivered</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
                99.9<span className="text-cyan-400">%</span>
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium font-sans">Uptime SLA</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
                10x<span className="text-cyan-400">+</span>
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium font-sans">Efficiency ROI</div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4"
          >
            <a 
              href="#our-dna" 
              className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300 flex items-center gap-2 group"
            >
              <span>Explore Our DNA</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a 
              href="/contact" 
              className="px-6 py-3 rounded-full border border-white/20 hover:border-cyan-400/60 bg-white/5 hover:bg-white/10 text-white font-medium text-sm tracking-wide backdrop-blur-md transition-all duration-300"
            >
              Partner With Us
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

