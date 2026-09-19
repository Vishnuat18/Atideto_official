import React from 'react';
import { motion } from 'framer-motion';
import valuesBg from '@/assets/section/image.png';
import valuesMobileBg from '@/assets/section/image_mobile.png';

export default function OurValues() {
  return (
    <section className="relative w-full overflow-hidden bg-[#05070B]">
      {/* ── MOBILE VIEW (< md) ── */}
      <div className="relative w-full min-h-[580px] sm:min-h-[720px] flex items-center md:hidden">
        {/* Mobile Full Background Image */}
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            backgroundImage: `url(${valuesMobileBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* Mobile: Top-Left "OUR VALUES" Badge */}
        <div className="absolute top-6 left-6 z-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase border border-[#2EA8FF]/30 bg-[#05070B]/80 backdrop-blur-md text-[#2EA8FF] shadow-[0_0_15px_rgba(46,168,255,0.2)]"
          >
            OUR VALUES
          </motion.div>
        </div>
      </div>

      {/* ── DESKTOP WEB VIEW (>= md) ── */}
      <div 
        className="hidden md:flex relative w-full items-center aspect-[1862/845]"
        style={{ aspectRatio: '1862 / 845' }}
      >
        {/* Desktop Full Background Image - 100% Visible, No Cropping */}
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          style={{
            backgroundImage: `url(${valuesBg})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* Desktop Content Container (Left Side in open dark space) */}
        <div className="relative max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-16 z-10">
          <div className="max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl text-left">
            
            {/* Eyebrow Badge (Desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-[0.2em] uppercase mb-4 lg:mb-6 border border-[#2EA8FF]/30 bg-[#2EA8FF]/10 text-[#2EA8FF] shadow-[0_0_15px_rgba(46,168,255,0.2)]"
            >
              OUR VALUES
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight font-montserrat leading-[1.12] mb-4 lg:mb-6"
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
              className="text-slate-300/90 text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed font-normal"
            >
              We hold ourselves to the highest standards of engineering rigor, absolute transparency, and long-term commitment in every solution we engineer.
            </motion.p>

          </div>
        </div>
      </div>

      {/* ── SECTION TOP & BOTTOM GRADIENT EDGE FADES ── */}
      {/* Top Edge Fade: Seamlessly dissolves into the top section background */}
      <div className="absolute top-0 inset-x-0 h-16 sm:h-20 md:h-28 lg:h-36 bg-gradient-to-b from-[#05070B] via-[#05070B]/70 to-transparent pointer-events-none z-20" />
      
      {/* Bottom Edge Fade: Seamlessly dissolves into the bottom section background */}
      <div className="absolute bottom-0 inset-x-0 h-16 sm:h-20 md:h-28 lg:h-36 bg-gradient-to-t from-[#05070B] via-[#05070B]/70 to-transparent pointer-events-none z-20" />
    </section>
  );
}
