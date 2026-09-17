import React from 'react';
import { motion } from 'framer-motion';
import valuesBg from '@/assets/section/image.png';

export default function OurValues() {
  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden border-y border-white/10 bg-[#05070B]">
      {/* Full Background Image */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          backgroundImage: `url(${valuesBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Subtle overlay gradient on mobile & tablet so text is crisp */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#05070B] via-[#05070B]/85 to-transparent md:via-[#05070B]/40 lg:opacity-40 pointer-events-none" />

      {/* Content Container (Left-aligned, concise content with hero-like stature) */}
      <div className="relative max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-16 py-24 sm:py-32 lg:py-40 z-10">
        <div className="max-w-lg lg:max-w-xl text-left">
          
          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-6 bg-blue-500/10 text-[#38BDF8] border border-blue-500/20 shadow-[0_0_20px_rgba(56,189,248,0.2)]"
          >
            <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
            OUR VALUES
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight font-montserrat leading-[1.12] mb-6"
          >
            Driven by Principle.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] via-[#2563EB] to-[#0052FF]">
              Built for Impact.
            </span>
          </motion.h2>

          {/* Minimal, concise subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-300/90 text-base sm:text-lg lg:text-xl leading-relaxed font-normal max-w-md lg:max-w-lg"
          >
            We hold ourselves to the highest standards of engineering rigor, absolute transparency, and long-term commitment in every solution we engineer.
          </motion.p>

        </div>
      </div>
    </section>
  );
}
