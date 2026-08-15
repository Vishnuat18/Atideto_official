import { motion } from 'framer-motion';
import { BlurFade } from '@/components/ui/blur-fade';
import { Puzzle, Search, Lightbulb, ShieldCheck, Target } from 'lucide-react';

const PRINCIPLES = [
  {
    num: '01',
    title: 'PROBLEM SOLVER',
    desc: 'We love solving real-world problems with practical and scalable technology.',
    icon: Puzzle,
    direction: 'left',
  },
  {
    num: '02',
    title: 'CURIOSITY',
    desc: 'We love questioning, learning and exploring new possibilities.',
    icon: Search,
    direction: 'right',
  },
  {
    num: '03',
    title: 'INNOVATION',
    desc: 'We build smart, future-ready and impactful solutions that create a difference.',
    icon: Lightbulb,
    direction: 'left',
  },
  {
    num: '04',
    title: 'OWNERSHIP',
    desc: 'We take complete ownership of our work and our commitments.',
    icon: ShieldCheck,
    direction: 'right',
  },
  {
    num: '05',
    title: 'IMPACT FIRST',
    desc: 'We measure success by the impact we create for people and businesses.',
    icon: Target,
    direction: 'left',
  },
];

export default function PrinciplesDriveUs() {
  return (
    <section className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-12 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[var(--about-primary)]/10 blur-[130px]" />
      </div>

      <div className="w-full max-w-[1360px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-10">
          <BlurFade delay={0} inView>
            <span className="about-eyebrow">Our DNA</span>
          </BlurFade>
          <BlurFade delay={0.1} inView>
            <h2 className="about-section-title">
              The Principles That{' '}
              <span className="about-heading-grad">
                Drive Us
              </span>
            </h2>
          </BlurFade>
        </div>

        {/* Full-Width Compact Stacked Rows */}
        <div className="w-full rounded-2xl md:rounded-3xl border border-[var(--about-border)] bg-[var(--about-surface)] shadow-[var(--about-shadow)] backdrop-blur-xl divide-y divide-[var(--about-border)] overflow-hidden">
          {PRINCIPLES.map((item, index) => {
            const isLeft = item.direction === 'left';
            const IconComp = item.icon;

            return (
              <BlurFade key={item.num} delay={0.05 * index} inView>
                <motion.div
                  whileHover={{ backgroundColor: 'color-mix(in srgb, var(--about-primary-soft) 60%, transparent)' }}
                  transition={{ duration: 0.2 }}
                  className="relative py-4 md:py-5 px-5 md:px-8 grid grid-cols-1 md:grid-cols-12 items-center gap-4 md:gap-6 overflow-hidden group"
                >
                  {/* Diagonal Divider Line (Visible on Medium+ Screens) */}
                  <svg
                    className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-32 h-full text-[var(--about-primary)]/40 pointer-events-none transition-colors group-hover:text-[var(--about-primary)]/70"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <polyline
                      points={isLeft ? "50,0 25,50 50,100" : "50,0 75,50 50,100"}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>

                  {/* CENTER ICON (Desktop) */}
                  <div 
                    className="hidden md:flex absolute top-1/2 -translate-y-1/2 z-10 h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--about-primary)]/40 bg-[var(--about-solid)] shadow-[var(--about-shadow)] transition-transform duration-300 group-hover:scale-110"
                    style={{ left: '50%', transform: `translate(calc(-50% ${isLeft ? '-' : '+'} 32px), -50%)` }}
                  >
                    <div className="absolute -inset-1 rounded-full border border-[var(--about-border)] pointer-events-none" />
                    <IconComp className="h-6 w-6 text-[var(--about-primary)] transition-transform duration-300 group-hover:rotate-12" />
                  </div>

                  {/* LEFT COLUMN */}
                  <div className="md:col-span-6 flex items-center justify-start gap-4 md:pr-12">
                    {isLeft ? (
                      <>
                        <span className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--about-muted)]/20 font-mono select-none">{item.num}</span>
                        {/* Mobile Icon */}
                        <div className="md:hidden relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--about-primary)]/30 bg-[var(--about-surface)] shadow-[var(--about-shadow)]">
                          <IconComp className="h-5 w-5 text-[var(--about-primary)]" />
                        </div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold tracking-wide text-[var(--about-text)] uppercase whitespace-nowrap">{item.title}</h3>
                      </>
                    ) : (
                      <p className="text-sm sm:text-base md:text-lg italic text-[var(--about-muted)] leading-relaxed font-medium text-left">
                        {item.desc}
                      </p>
                    )}
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="md:col-span-6 flex items-center justify-end gap-4 md:pl-12">
                    {isLeft ? (
                      <p className="text-sm sm:text-base md:text-lg italic text-[var(--about-muted)] leading-relaxed font-medium text-right">
                        {item.desc}
                      </p>
                    ) : (
                      <>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold tracking-wide text-[var(--about-text)] uppercase whitespace-nowrap text-right">{item.title}</h3>
                        {/* Mobile Icon */}
                        <div className="md:hidden relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--about-primary)]/30 bg-[var(--about-surface)] shadow-[var(--about-shadow)]">
                          <IconComp className="h-5 w-5 text-[var(--about-primary)]" />
                        </div>
                        <span className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--about-muted)]/20 font-mono select-none">{item.num}</span>
                      </>
                    )}
                  </div>
                </motion.div>
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
}
