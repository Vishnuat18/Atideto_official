import { motion } from 'framer-motion';
import RibbonBackground from './RibbonBackground';

export default function HeroSection() {
  return (
    <section 
      className="relative w-full min-h-[60vh] px-8 lg:px-16 py-16 text-center z-10 flex flex-col items-center justify-center border-b border-[#3B82F6]/20 overflow-hidden"
    >
      <RibbonBackground />
      
      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="inline-block px-4 py-1.5 rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#3B82F6] text-xs font-bold tracking-[0.2em] uppercase mb-6"
      >
        Who We Are
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white drop-shadow-2xl"
      >
        About <span className="text-[#3B82F6]">Us</span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="text-[#AFAFAF] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium"
      >
        ATIDETO is a premium software company and technology academy,<br className="hidden md:block" /> engineering award-winning solutions powered by intelligent automation.
      </motion.p>
      </div>
    </section>
  );
}
