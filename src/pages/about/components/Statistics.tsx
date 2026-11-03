import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { STATS } from '@/constants';

function AnimatedCounter({ value, suffix, label, delay }: { value: string, suffix: string, label: string, delay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay }}
      className="flex flex-col items-center justify-center p-10 rounded-3xl bg-[rgba(255,255,255,0.01)] border border-white/5 backdrop-blur-md relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#3B82F6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-[#94A3B8] mb-4 tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
        {isInView ? (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            {value}
          </motion.span>
        ) : (
          "0"
        )}
        <span className="text-[#3B82F6]">{suffix}</span>
      </div>
      <div className="text-[#AFAFAF] font-bold tracking-[0.2em] uppercase text-sm">{label}</div>
    </motion.div>
  );
}

export default function Statistics() {
  return (
    <section className="relative py-32 px-8 lg:px-16 z-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <AnimatedCounter 
              key={stat.label} 
              value={stat.value} 
              suffix={stat.suffix || ''} 
              label={stat.label} 
              delay={i * 0.15} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
