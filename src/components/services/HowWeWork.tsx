import React from 'react';
import { motion } from 'framer-motion';

interface Step {
  num: string;
  title: string;
  desc: string;
}

const STEPS: Step[] = [
  {
    num: '01',
    title: 'Planning',
    desc: 'Strategic roadmapping, architecture definition, and scope alignment.'
  },
  {
    num: '02',
    title: 'Analysis',
    desc: 'Technical feasibility, workflow requirements, and system modeling.'
  },
  {
    num: '03',
    title: 'Design',
    desc: 'Interactive prototyping, UI/UX systems, and ergonomic user journeys.'
  },
  {
    num: '04',
    title: 'Implementation',
    desc: 'Agile full-stack engineering, clean code standards, and rapid delivery.'
  },
  {
    num: '05',
    title: 'Testing & Integration',
    desc: 'Automated QA validation, security audits, and seamless API sync.'
  },
  {
    num: '06',
    title: 'Maintenance & Support',
    desc: '24/7 telemetry monitoring, proactive maintenance, and continuous optimization.'
  }
];

export default function HowWeWork() {
  return (
    <section className="relative w-full bg-black py-14 sm:py-20 px-4 sm:px-6 lg:px-12 border-t border-white/10 overflow-hidden text-white">
      
      {/* ── Soft Ambient Glow ── */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* ── Section Header (Image 1 Style) ── */}
        <div className="mb-10 sm:mb-14 text-left">
          {/* Eyebrow: ── DELIVERY PROCESS (Matching 2nd Reference Image, No Number) */}
          <div className="inline-flex items-center gap-3 mb-3.5 select-none">
            <span className="w-8 sm:w-10 h-[1.5px] bg-[#0052FF] shrink-0" />
            <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase font-heading text-[#2EA8FF]">
              DELIVERY PROCESS
            </span>
          </div>

          <h2 className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight leading-[1.2] mb-3 font-heading">
            A clear path from idea to{' '}
            <span className="text-[#0066FF] drop-shadow-[0_0_20px_rgba(0,102,255,0.4)]">
              scalable reality.
            </span>
          </h2>
          <p className="text-slate-300 text-base max-w-xl font-normal leading-relaxed font-sans">
            Structured agile execution engineered for operational reliability, velocity, and clean handoffs.
          </p>
        </div>

        {/* ── 6 Steps Layout (Matching Attached Reference Image 1) ── */}
        {/* Continuous vertical blue line separating the number column from content */}
        <div className="border-t border-white/10">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="grid grid-cols-12 border-b border-white/10 transition-colors duration-200 hover:bg-white/[0.02]"
            >
              {/* Left Column: Number with right-side continuous vertical blue divider */}
              <div className="col-span-3 sm:col-span-2 py-5 sm:py-6 pr-4 sm:pr-8 flex items-start justify-start border-r border-[#38BDF8]">
                <span className="font-mono text-base sm:text-lg lg:text-xl font-bold text-[#38BDF8] tracking-wider select-none">
                  {step.num}
                </span>
              </div>

              {/* Right Column: Title and Description */}
              <div className="col-span-9 sm:col-span-10 py-5 sm:py-6 pl-6 sm:pl-10 lg:pl-12 flex flex-col justify-center text-left">
                <h3 className="text-[20px] sm:text-[22px] font-semibold text-white font-heading tracking-tight mb-1">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm lg:text-[15px] text-slate-400 font-normal leading-relaxed max-w-2xl font-sans">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
