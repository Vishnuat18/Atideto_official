import { motion } from 'framer-motion';
import { BlurFade } from '@/components/ui/blur-fade';
import { Cog, FolderSearch, Clock, Sparkles } from 'lucide-react';

const PROBLEMS = [
  {
    icon: Cog,
    title: 'Complex & Manual',
    desc: 'Replacing repetitive and manual processes.',
  },
  {
    icon: FolderSearch,
    title: 'Disorganized & Unclear',
    desc: 'Bringing clarity and structure to complex operations.',
  },
  {
    icon: Clock,
    title: 'Time Consuming',
    desc: 'Streamlining workflows to save time and resources.',
  },
  {
    icon: Sparkles,
    title: 'Ideas Unfulfilled',
    desc: 'Transforming ideas into impactful digital products.',
  },
];

export default function ChallengesToChange() {
  return (
    <section className="relative py-20 md:py-28 px-6 lg:px-16 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <BlurFade delay={0} inView>
            <span className="about-eyebrow">The Problems We Solve</span>
          </BlurFade>
          <BlurFade delay={0.1} inView>
            <h2 className="about-section-title">
              From Challenges to{' '}
              <span className="about-heading-grad">
                Change
              </span>
            </h2>
          </BlurFade>
        </div>

        {/* 4 Problem Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROBLEMS.map((prob, i) => (
            <BlurFade key={prob.title} delay={0.1 + i * 0.06} inView>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="about-card group relative flex flex-col items-center text-center p-7"
              >
                <div className="about-icon-chip h-14 w-14 mb-5 transition-all duration-300 group-hover:scale-110 group-hover:bg-[var(--about-primary-soft)]">
                  <prob.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-[var(--about-text)] mb-2 tracking-tight">{prob.title}</h3>
                <p className="text-sm text-[var(--about-muted)] leading-relaxed">{prob.desc}</p>
              </motion.div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
