import { motion } from 'framer-motion';
import aboutBg from '@/assets/hero/about.png';

export default function HeroSection() {
  return (
    <section 
      className="relative min-h-screen w-full px-8 lg:px-16 pt-32 pb-8 mb-12 text-center z-10 flex flex-col items-center justify-center border-b border-[#3B82F6]/20"
      style={{ 
        backgroundImage: `linear-gradient(to bottom, rgba(5,5,5,0.1) 0%, rgba(5,5,5,0.8) 80%, #050505 100%), url(${aboutBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white drop-shadow-2xl"
      >
        About <span className="text-[#3B82F6]">Us</span>
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="text-[#AFAFAF] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium"
      >
        ATIDETO is a premium software company and technology academy,<br className="hidden md:block" /> engineering award-winning solutions powered by intelligent automation.
      </motion.p>
    </section>
  );
}
