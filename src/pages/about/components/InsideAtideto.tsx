import { motion } from 'framer-motion';
import { BlurFade } from '@/components/ui/blur-fade';
import { Users, Zap, Award, BookOpen, MessageCircle, Heart } from 'lucide-react';

const CULTURE = [
  {
    icon: Users,
    title: 'Collaborative',
    desc: 'We believe great things are built together.',
  },
  {
    icon: Zap,
    title: 'Fast & Agile',
    desc: 'We move fast and adapt quickly.',
  },
  {
    icon: Award,
    title: 'Quality First',
    desc: 'We never compromise on quality.',
  },
  {
    icon: BookOpen,
    title: 'Continuous Learning',
    desc: 'We learn, unlearn and grow every day.',
  },
  {
    icon: MessageCircle,
    title: 'Open Communication',
    desc: 'We share ideas freely and openly.',
  },
  {
    icon: Heart,
    title: 'Work With Purpose',
    desc: 'We build with intention and impact.',
  },
];

export default function InsideAtideto() {
  return (
    <section className="relative py-20 md:py-28 px-6 lg:px-16 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <BlurFade delay={0} inView>
            <span className="about-eyebrow">Our Culture</span>
          </BlurFade>
          <BlurFade delay={0.1} inView>
            <h2 className="about-section-title">
              Inside <span className="about-heading-grad">Atideto</span>
            </h2>
          </BlurFade>
        </div>

        {/* 6 Culture Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {CULTURE.map((item, i) => (
            <BlurFade key={item.title} delay={0.08 + i * 0.05} inView>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="about-card group relative flex flex-col items-center text-center p-5"
              >
                <div className="about-icon-chip h-11 w-11 mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-[var(--about-primary-soft)]">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-[var(--about-text)] mb-1.5 tracking-tight">{item.title}</h3>
                <p className="text-xs text-[var(--about-muted)] leading-relaxed">{item.desc}</p>
              </motion.div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
