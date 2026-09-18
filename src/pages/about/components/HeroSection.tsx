import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Cpu } from 'lucide-react';
import heroBg from '@/assets/section/hero.png';

export default function HeroSection() {
  return (
    <section 
      className="relative min-h-[92vh] lg:min-h-screen w-full flex items-center overflow-hidden z-10 border-b border-[#3B82F6]/20 bg-[#030611]"
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
          
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-4 transition-all duration-300 border border-[#2EA8FF]/30 bg-[#2EA8FF]/10 text-[#2EA8FF] shadow-[0_0_15px_rgba(46,168,255,0.2)]"
          >
            ABOUT ATIDETO
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black mb-6 tracking-tight text-white drop-shadow-2xl leading-[1.08] font-montserrat"
          >
            Pioneering The <br />
            <span className="bg-gradient-to-r from-[#00F0FF] via-[#38BDF8] to-[#0052FF] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,240,255,0.45)]">
              Next Frontier
            </span> <br />
            of Technology
          </motion.h1>

          {/* Subtitle Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-slate-300/90 text-base sm:text-lg lg:text-xl max-w-xl leading-relaxed font-normal mb-10"
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
              <div className="text-2xl sm:text-3xl font-black text-white font-montserrat tracking-tight">
                100<span className="text-cyan-400">+</span>
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Projects Delivered</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white font-montserrat tracking-tight">
                99.9<span className="text-cyan-400">%</span>
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">System Uptime</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white font-montserrat tracking-tight">
                50<span className="text-cyan-400">+</span>
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Global Clients</div>
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

