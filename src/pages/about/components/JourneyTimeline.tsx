import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const MILESTONES = [
  { year: '2018', title: 'Founded', desc: 'ATIDETO is born with a vision to redefine digital experiences.' },
  { year: '2019', title: 'First Enterprise Client', desc: 'Delivered our first major scalable architecture project.' },
  { year: '2021', title: '100 Projects', desc: 'Successfully deployed 100+ platforms globally.' },
  { year: '2023', title: 'AI Expansion', desc: 'Integrated advanced machine learning into our core offering.' },
  { year: '2024', title: 'Global Growth', desc: 'Opened offices in 3 new countries.' },
  { year: '2026', title: 'Future Vision', desc: 'Building the next generation of spatial computing UI.' },
];

export default function JourneyTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="relative py-32 px-8 lg:px-16 z-10 hidden md:block">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#3B82F6] text-xs font-bold tracking-[0.2em] uppercase mb-6"
          >
            Our Journey
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-black text-white"
          >
            THE <span className="text-[#3B82F6]">TIMELINE</span>
          </motion.h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Track background */}
          <div className="absolute left-[50%] top-0 bottom-0 w-[2px] bg-white/5 -translate-x-1/2" />
          
          {/* Animated Glow Line */}
          <motion.div 
            style={{ height: lineHeight }}
            className="absolute left-[50%] top-0 w-[2px] bg-gradient-to-b from-[#00C6FF] to-[#3B82F6] -translate-x-1/2 origin-top shadow-[0_0_15px_#3B82F6]"
          />

          <div className="flex flex-col gap-24 relative">
            {MILESTONES.map((item, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={item.year} className={`flex w-full ${isEven ? 'justify-start' : 'justify-end'} relative group`}>
                  
                  {/* Glowing Dot on the timeline */}
                  <div className="absolute left-[50%] top-1/2 w-4 h-4 rounded-full bg-[#050505] border-2 border-[#3B82F6] -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-500 group-hover:bg-[#3B82F6] group-hover:scale-150 group-hover:shadow-[0_0_20px_#3B82F6]" />

                  {/* Content Card */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className={`w-[calc(50%-4rem)] p-8 rounded-3xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] backdrop-blur-md transition-all duration-500 hover:border-[#3B82F6]/40 hover:-translate-y-2 hover:bg-[rgba(59,130,246,0.05)] ${isEven ? 'text-right' : 'text-left'}`}
                  >
                    <div className="text-[#00C6FF] font-black text-4xl mb-2 font-space tracking-tighter opacity-80">{item.year}</div>
                    <h3 className="text-white font-bold text-xl mb-3">{item.title}</h3>
                    <p className="text-[#94A3B8] leading-relaxed">{item.desc}</p>
                  </motion.div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
