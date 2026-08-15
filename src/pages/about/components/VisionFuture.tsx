import { motion } from 'framer-motion';
import { BlurFade } from '@/components/ui/blur-fade';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VisionFuture() {
  return (
    <section className="relative py-24 md:py-32 px-6 lg:px-16 overflow-hidden">
      {/* Subtle Glow Backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--about-primary)]/20 blur-[120px]" />
      </div>

      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading & Description */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <BlurFade delay={0} inView>
              <span className="about-eyebrow">Proof in the Work</span>
            </BlurFade>

            <BlurFade delay={0.1} inView>
              <h2 className="about-section-title mb-6">
                Big enough to deliver.{' '}
                <br className="hidden sm:block" />
                <span className="about-heading-grad">
                  Close enough to care.
                </span>
              </h2>
            </BlurFade>

            <BlurFade delay={0.2} inView>
              <p className="text-[var(--about-muted)] text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                We bring a focused senior team to every engagement, so the work stays accountable, collaborative, and moving forward.
              </p>
            </BlurFade>

            <BlurFade delay={0.3} inView>
              <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
                <Link
                  to="/client-connect"
                  className="group inline-flex items-center gap-2 rounded-full bg-[var(--about-primary)] px-7 py-3.5 text-sm font-bold text-white shadow-[var(--about-shadow)] transition-colors hover:bg-[var(--about-cyan)]"
                >
                  Meet ATIDETO
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </BlurFade>
          </div>

          {/* Right Column: CTA Card */}
          <div className="lg:col-span-5">
            <BlurFade delay={0.15} inView>
              <div className="about-card relative p-8 md:p-10">
                <div className="about-icon-chip h-12 w-12 mb-6">
                  <ArrowRight className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--about-text)] tracking-tight mb-3">
                  Let's build what's next.
                </h3>
                <p className="text-sm text-[var(--about-muted)] leading-relaxed mb-6">
                  From a single idea to a full digital product, we're ready to help you create something that lasts.
                </p>
                <div className="text-[var(--about-primary)] text-xs font-bold tracking-[0.15em] uppercase">
                  Start a conversation
                </div>
              </div>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  );
}
