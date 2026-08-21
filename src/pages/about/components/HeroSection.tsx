import { motion } from 'framer-motion';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';
import { DotPattern } from '@/components/ui/dot-pattern';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import AboutCompanyWindow from './AboutCompanyWindow';

export default function HeroSection() {
  return (
    <section className="relative w-full px-6 lg:px-16 pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      <div className="pointer-events-none absolute -top-32 right-[-6rem] h-[480px] w-[480px] rounded-full bg-[var(--about-primary)]/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-[8%] top-16 hidden lg:block">
        <DotPattern
          className="text-[var(--about-primary)]/25"
          width={18}
          height={18}
          cr={1.3}
          glow
        />
      </div>

      <div className="max-w-[1300px] mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col">
            <BlurFade delay={0} inView>
              <span className="about-eyebrow">About ATIDETO Technologies</span>
            </BlurFade>

            <h1 className="about-hero-title text-[var(--about-text)]">
              <TextAnimate
                as="span"
                by="word"
                animation="blurInUp"
                duration={0.9}
                delay={0.05}
                className="block"
              >
                We don't build software.
              </TextAnimate>
              <TextAnimate
                as="span"
                by="word"
                animation="blurInUp"
                duration={0.9}
                delay={0.3}
                className="block"
                segmentClassName="about-heading-grad"
              >
                We build Possibilities.
              </TextAnimate>
            </h1>

            <BlurFade delay={0.2} inView>
              <p className="about-hero-copy text-[var(--about-muted)]">
                ATIDETO Technologies is a technology and digital solutions company headquartered in Salem, Tamil Nadu. We combine innovative ideas with intelligent software engineering to build scalable web, mobile, cloud, and AI solutions that create measurable business impact.
              </p>
            </BlurFade>

            <BlurFade delay={0.3} inView>
              <Link
                to="/services"
                className="group inline-flex items-center gap-3 mt-2 text-sm font-semibold text-[var(--about-text)] hover:text-[var(--about-primary)] transition-colors"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--about-border)] bg-[var(--about-surface)] shadow-sm backdrop-blur-md transition-all group-hover:border-[var(--about-primary)]/40 group-hover:shadow-md">
                  <Play className="h-4 w-4 text-[var(--about-primary)] ml-0.5" />
                </span>
                Discover our journey
              </Link>
            </BlurFade>
          </div>

          {/* Right Visual: Interactive About Company Window */}
          <BlurFade delay={0.15} inView>
            <AboutCompanyWindow />
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
