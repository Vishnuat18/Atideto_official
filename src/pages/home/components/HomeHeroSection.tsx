import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sparkles
} from 'lucide-react';
import ProfessionalHeroBg from '@/components/ui/ProfessionalHeroBg';

// ── 2D DESIGN SAMPLE PNG ASSETS ──
import homeHeroImg from '@/assets/hero/home.png';
import aboutHeroImg from '@/assets/hero/about.png';
import serviceHeroImg from '@/assets/hero/service.png';
import academyHeroImg from '@/assets/hero/academy.png';
import courseHeroImg from '@/assets/section/image.png';

// ── SLIDE DEFINITIONS ──
interface HeroSlide {
  id: string;
  tabTitle: string;
  badge: string;
  headingPrefix: string;
  headingHighlight: string;
  headingSuffix: string;
  description: string;
  primaryCta: { label: string; path: string };
  secondaryCta: { label: string; path: string };
  image: string;
  imageAlt: string;
  imageTag: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'solutions',
    tabTitle: 'Solutions',
    badge: 'WHAT CAN WE SOLVE FOR YOU?',
    headingPrefix: 'Your Business Has Problems.',
    headingHighlight: 'Technology',
    headingSuffix: 'to Solve Them.',
    description: 'We build intelligent software, AI automation, premium web experiences, mobile applications, cloud solutions, and scalable digital platforms that empower businesses to innovate, automate, and grow faster.',
    primaryCta: { label: 'Explore Our Solutions', path: '/services' },
    secondaryCta: { label: 'Get Started', path: '/client-connect' },
    image: homeHeroImg,
    imageAlt: 'Enterprise Solutions & Technology Design Sample',
    imageTag: 'ENTERPRISE ARCHITECTURE'
  },
  {
    id: 'careers',
    tabTitle: 'Careers',
    badge: 'WE ARE HIRING · 3 OPEN ROLES',
    headingPrefix: 'Grab Your Opportunities.',
    headingHighlight: 'Careers',
    headingSuffix: 'at Atideto.',
    description: 'Join our high-impact collective. Open positions across Designing Team, Marketing Team, and Graphic Designing Team. Build visionary digital products with true autonomy and category-defining craft.',
    primaryCta: { label: 'View Open Roles', path: '/careers' },
    secondaryCta: { label: 'About Our Culture', path: '/about' },
    image: aboutHeroImg,
    imageAlt: 'Creative Design & Engineering Team Sample',
    imageTag: 'CAREERS & COLLECTIVE'
  },
  {
    id: 'product-team',
    tabTitle: 'Product Team',
    badge: 'ENGINEERING THAT SCALES',
    headingPrefix: 'Join Our Product Team.',
    headingHighlight: 'Build Systems',
    headingSuffix: 'That Endure.',
    description: 'Collaborate with senior software architects to engineer distributed cloud systems, AI automation engines, and high-performance digital infrastructure with zero tech debt and bank-grade security.',
    primaryCta: { label: 'Explore Tech Stack', path: '/services' },
    secondaryCta: { label: 'Start A Project', path: '/client-connect' },
    image: serviceHeroImg,
    imageAlt: 'Product Engineering & Systems Architecture Sample',
    imageTag: 'SYSTEMS ARCHITECTURE'
  },
  {
    id: 'internships',
    tabTitle: 'Internships',
    badge: 'INDUSTRY-GRADE INTERNSHIPS',
    headingPrefix: 'Accelerate Your Future.',
    headingHighlight: 'Live Project',
    headingSuffix: 'Internships.',
    description: 'Gain hands-on engineering mastery with real code reviews, production client deployments, modern frameworks, and verifiable portfolio credentials that fast-track your tech career.',
    primaryCta: { label: 'Explore Internships', path: '/upskill' },
    secondaryCta: { label: 'View Career Tracks', path: '/academy' },
    image: academyHeroImg,
    imageAlt: 'Industry Live Project Internships Sample',
    imageTag: 'TALENT ACCELERATOR'
  },
  {
    id: 'courses',
    tabTitle: 'Courses',
    badge: '100% FREE TO LEARN',
    headingPrefix: 'Master Modern Tech.',
    headingHighlight: 'Free Courses',
    headingSuffix: '& Masterclasses.',
    description: 'Comprehensive curriculums covering modern web development, full-stack Java architectures, and generative AI workflows. 100% free curriculum crafted by experienced engineers.',
    primaryCta: { label: 'Start Learning Free', path: '/courses' },
    secondaryCta: { label: 'Browse Academy', path: '/academy' },
    image: courseHeroImg,
    imageAlt: 'Free Developer Masterclasses Design Sample',
    imageTag: 'FREE MASTERCLASSES'
  }
];

export default function HomeHeroSection() {
  const navigate = useNavigate();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const SLIDE_DURATION = 5000; // 5 seconds
  const slideStartTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<number | null>(null);

  const currentSlide = HERO_SLIDES[currentSlideIndex];

  // Auto-slide every 5 seconds with live progress tracking
  useEffect(() => {
    slideStartTimeRef.current = Date.now();
    setProgress(0);

    const interval = 50; // update progress every 50ms
    const timer = window.setInterval(() => {
      if (!isPaused) {
        const elapsed = Date.now() - slideStartTimeRef.current;
        const currentProgress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
        setProgress(currentProgress);

        if (elapsed >= SLIDE_DURATION) {
          setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
          slideStartTimeRef.current = Date.now();
          setProgress(0);
        }
      } else {
        // adjust start time when paused so progress doesn't jump
        slideStartTimeRef.current = Date.now() - (progress / 100) * SLIDE_DURATION;
      }
    }, interval);

    timerRef.current = timer;
    return () => clearInterval(timer);
  }, [currentSlideIndex, isPaused]);

  const handleSelectSlide = (idx: number) => {
    setCurrentSlideIndex(idx);
    slideStartTimeRef.current = Date.now();
    setProgress(0);
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="hero-fullscreen relative w-full flex flex-col justify-between pt-20 sm:pt-24 pb-8 sm:pb-10 bg-[#050505] text-white border-b border-white/5 overflow-hidden"
    >
      {/* ── Professional Animated Hero Tech Background ── */}
      <ProfessionalHeroBg />

      {/* ── Main Dynamic Hero Body (2-Column Grid) ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full my-auto py-3 sm:py-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          
          {/* ── Left Content Column ── */}
          <div className="flex flex-col items-start text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex flex-col items-start"
              >
                {/* Tagline (Matching 2nd Reference Image) */}
                <div className="flex items-center gap-3 mb-4 select-none">
                  <span className="w-8 sm:w-10 h-[1.5px] bg-[#0052FF] shrink-0" />
                  <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase font-heading text-[#2EA8FF]">
                    {currentSlide.badge}
                  </span>
                </div>

                {/* Main Heading with Pure Solid White Text (No Highlight Colors) */}
                <h1
                  className="font-heading font-bold text-[30px] sm:text-[36px] lg:text-[44px] max-w-2xl leading-[1.18] tracking-tight mb-4 sm:mb-6 text-white"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {currentSlide.headingPrefix}{' '}
                  <br className="hidden sm:block" />
                  <span className="text-white">{currentSlide.headingHighlight}</span>{' '}
                  {currentSlide.headingSuffix}
                </h1>

                {/* Description */}
                <p
                  className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed mb-6 sm:mb-8 font-normal font-sans"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {currentSlide.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-0">
                  <button
                    onClick={() => navigate(currentSlide.primaryCta.path)}
                    className="px-7 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm md:text-[15px] font-semibold text-white bg-[#0052FF] hover:bg-[#0042D0] rounded-full shadow-[0_4px_22px_rgba(0,82,255,0.38)] hover:shadow-[0_6px_28px_rgba(0,82,255,0.55)] transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center gap-2 cursor-pointer font-heading"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <span>{currentSlide.primaryCta.label}</span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    onClick={() => navigate(currentSlide.secondaryCta.path)}
                    className="px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm md:text-[15px] font-semibold text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/15 hover:border-cyan-400/40 shadow-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center gap-2 cursor-pointer font-heading"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <span>{currentSlide.secondaryCta.label}</span>
                    <ArrowRight size={14} className="text-[#38BDF8]" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Right Column: Neat & Professional 2D Design PNG Showcase ── */}
          <div className="relative w-full h-[300px] sm:h-[360px] lg:h-[410px] flex items-center justify-center">
            {/* Ambient cyber glow behind the sample frame */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0052FF]/25 via-[#00F0FF]/15 to-transparent blur-3xl pointer-events-none rounded-3xl" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-lg lg:max-w-xl aspect-[16/10] rounded-2xl sm:rounded-3xl border border-white/15 bg-[#0A0E1A]/90 shadow-[0_24px_70px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col group backdrop-blur-md"
              >
                {/* Top Window Accent Header */}
                <div className="h-9 px-4 bg-white/[0.04] border-b border-white/10 flex items-center justify-between shrink-0 select-none">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-300 font-semibold">
                      {currentSlide.imageTag}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  </div>
                </div>

                {/* 2D Design PNG Sample Image */}
                <div className="relative flex-1 w-full overflow-hidden bg-[#05070E]">
                  <img
                    src={currentSlide.image}
                    alt={currentSlide.imageAlt}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="eager"
                  />

                  {/* Soft bottom gradient overlay for cinematic contrast */}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0A0E1A] via-[#0A0E1A]/60 to-transparent pointer-events-none" />

                  {/* Floating Bottom Status Pill */}
                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono text-slate-200 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Atideto 2D Design Showcase</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* ── Bottom Segmented Progress Bar (Matching 2nd Reference Image) ── */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full pt-2 pb-5 sm:pb-6">
        <div className="grid grid-cols-5 gap-3 sm:gap-6 lg:gap-8 w-full items-start">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentSlideIndex;
            const fillWidth = isActive ? progress : idx < currentSlideIndex ? 100 : 0;
            return (
              <button
                key={slide.id}
                onClick={() => handleSelectSlide(idx)}
                className="group flex flex-col text-left cursor-pointer transition-all duration-200 focus:outline-none py-1.5"
              >
                {/* Horizontal Progress Line Segment */}
                <div className="h-[2px] sm:h-[2.5px] w-full rounded-full bg-white/20 overflow-hidden mb-2 sm:mb-2.5">
                  <div
                    className={`h-full transition-all duration-75 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#0052FF] to-[#00F0FF]'
                        : idx < currentSlideIndex
                        ? 'bg-[#0052FF]/60'
                        : 'bg-transparent'
                    }`}
                    style={{ width: `${fillWidth}%` }}
                  />
                </div>

                {/* Title Below Line (Solid White When Active, Muted When Inactive) */}
                <span
                  className={`text-[12px] sm:text-xs md:text-sm tracking-tight sm:tracking-wide font-heading transition-colors block leading-normal pb-0.5 whitespace-normal ${
                    isActive
                      ? 'text-white font-bold'
                      : 'text-white/50 group-hover:text-white/80 font-normal'
                  }`}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {slide.tabTitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
