import { useCallback, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BlurFade } from '@/components/ui/blur-fade';
import { Building2, GraduationCap, Rocket } from 'lucide-react';

const AUDIENCES = [
  {
    num: '01',
    icon: Building2,
    title: 'Businesses',
    desc: 'Helping businesses automate operations, scale efficiently, and build reliable digital solutions that accelerate long-term growth.',
    tags: ['Automation', 'Cloud', 'AI', 'Enterprise'],
    featured: true,
  },
  {
    num: '02',
    icon: GraduationCap,
    title: 'Students',
    desc: 'Bridging education and industry through practical learning, mentorship, internships, and real-world software development experience.',
    tags: ['Learn', 'Build', 'Grow'],
    featured: false,
  },
  {
    num: '03',
    icon: Rocket,
    title: 'Innovators',
    desc: 'Helping founders, creators, and problem solvers transform ambitious ideas into scalable digital products that create lasting impact.',
    tags: ['Prototype', 'Launch', 'Scale'],
    featured: false,
  },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* --- Background illustrations (rendered at ~5% opacity) ------------------ */

function CardIllustration({ index }: { index: number }) {
  const C = 'currentColor';
  if (index === 0) {
    return (
      <svg viewBox="0 0 560 480" fill="none" aria-hidden>
        <g stroke={C} strokeWidth="1.5">
          <circle cx="280" cy="240" r="188" strokeDasharray="3 8" />
          <circle cx="280" cy="240" r="150" />
          <circle cx="280" cy="240" r="86" strokeDasharray="4 10" />
        </g>
        {[
          [280, 240],
          [120, 120],
          [430, 120],
          [120, 360],
          [430, 360],
          [280, 90],
          [280, 390],
        ].map(([x, y], i) => (
          <g key={i}>
            <line x1={280} y1={240} x2={x} y2={y} stroke={C} strokeWidth="1" opacity="0.7" strokeDasharray="2 6" />
            <rect x={x - 10} y={y - 10} width="20" height="20" rx="6" stroke={C} strokeWidth="1.25" />
          </g>
        ))}
        <path d="M90 210 h90 M110 190 h60 M100 230 h80 M420 150 h60 M90 320 h70 M150 340 h50" stroke={C} strokeWidth="1" opacity="0.6" strokeDasharray="2 5" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 460 460" fill="none" aria-hidden>
        <g stroke={C} strokeWidth="1.25">
          {[90, 160, 230, 300].map((y) => (
            <line key={y} x1={90} y1={y} x2={370} y2={y} />
          ))}
          {[90, 170, 250, 330].map((x) => (
            <line key={x} x1={x} y1={70} x2={x} y2={390} />
          ))}
        </g>
        <circle cx="320" cy="110" r="26" stroke={C} strokeWidth="1.5" />
        <path d="M308 110 l9 9 l15 -15" stroke={C} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M90 200 h130 M110 240 h100 M90 280 h70" stroke={C} strokeWidth="1.5" />
        <circle cx="370" cy="360" r="10" fill={C} />
        <path d="M90 340 C 180 300, 260 380, 370 360" stroke={C} strokeWidth="1.25" strokeDasharray="3 6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 460 460" fill="none" aria-hidden>
      <g className="about-empower-rocket">
        <path d="M230 120 c -22 34 -26 70 -14 92 l 14 26 14 -26 c 12 -22 8 -58 -14 -92 z" stroke={C} strokeWidth="1.5" />
        <path d="M230 170 v70" stroke={C} strokeWidth="1.25" />
        <path d="M230 238 l -18 34 M230 238 l 18 34" stroke={C} strokeWidth="1.25" />
        <path d="M212 154 c -14 14 -20 30 -22 46 M248 154 c 14 14 20 30 22 46" stroke={C} strokeWidth="1" opacity="0.8" />
        <path d="M176 300 h108 M200 300 v60 M260 300 v60" stroke={C} strokeWidth="1.25" strokeDasharray="3 6" />
      </g>
      <circle cx="230" cy="230" r="150" stroke={C} strokeWidth="1" opacity="0.5" strokeDasharray="3 9" />
      <circle cx="230" cy="230" r="186" stroke={C} strokeWidth="1" opacity="0.35" strokeDasharray="2 10" />
      <path d="M300 120 l24 -24 M320 100 l-6 30" stroke={C} strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}



/* --- Single panel card ---------------------------------------------------- */

interface PanelProps {
  index: number;
  delay: number;
}

function EmpowerPanel({ index, delay }: PanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const seg = AUDIENCES[index];
  const IconComp = seg.icon;

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  }, []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className={`about-empower-card group ${seg.featured ? 'about-empower-card--featured' : 'about-empower-card--compact'}`}
    >
      <span className="about-empower-num" aria-hidden>
        {seg.num}
      </span>

      <div className="about-empower-art" aria-hidden>
        <div className="about-empower-art-inner">
          <CardIllustration index={index} />
        </div>
      </div>

      <div className="about-empower-spotlight" />

      <div className="about-empower-body">
        <div className="about-empower-card-top">
          <span className="about-empower-icon">
            <IconComp className="h-5 w-5" />
          </span>
        </div>

        <h3 className="about-empower-title">{seg.title}</h3>
        <p className="about-empower-desc">{seg.desc}</p>
      </div>

      <div className="about-empower-tags">
        {seg.tags.map((tag) => (
          <span key={tag} className="about-empower-tag">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* --- Background ----------------------------------------------------------- */

const PARTICLES = [
  { left: '6%', top: '18%', size: 5, dur: '11s', delay: '0s' },
  { left: '14%', top: '68%', size: 3, dur: '14s', delay: '1s' },
  { left: '24%', top: '30%', size: 4, dur: '12s', delay: '0.4s' },
  { left: '38%', top: '74%', size: 3, dur: '15s', delay: '2s' },
  { left: '52%', top: '22%', size: 5, dur: '13s', delay: '0.8s' },
  { left: '66%', top: '64%', size: 3, dur: '16s', delay: '1.4s' },
  { left: '78%', top: '26%', size: 4, dur: '12s', delay: '2.6s' },
  { left: '88%', top: '60%', size: 3, dur: '14s', delay: '0.2s' },
  { left: '44%', top: '12%', size: 3, dur: '17s', delay: '1.8s' },
  { left: '92%', top: '34%', size: 4, dur: '13s', delay: '3s' },
];

function EmpowerBackground() {
  return (
    <div className="about-empower-bg" aria-hidden>
      <div className="about-empower-bg-base" />
      <div className="about-empower-bg-grad" />
      <div className="about-empower-grid" />
      <svg className="about-empower-lines" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <path d="M-40 300 C 300 240, 480 420, 760 330 S 1180 200, 1500 260" />
        <path d="M-40 620 C 260 560, 520 700, 880 640 S 1260 560, 1500 610" />
        <path d="M-40 820 C 340 780, 620 880, 1000 810 S 1320 760, 1500 800" />
      </svg>
      <div className="about-empower-circles">
        <span className="about-empower-circle about-empower-circle--a" />
        <span className="about-empower-circle about-empower-circle--b" />
      </div>
      <div className="about-empower-glow" />
      <div className="about-empower-particles">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="about-empower-particle"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size, animationDuration: p.dur, animationDelay: p.delay }}
          />
        ))}
      </div>
    </div>
  );
}

/* --- Section -------------------------------------------------------------- */

export default function WhoWeServe() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start 0.55'],
  });

  return (
    <section id="who-we-empower" ref={sectionRef} className="about-empower relative py-24 md:py-32 px-6 lg:px-16 overflow-hidden">
      <EmpowerBackground />

      <div className="max-w-[1240px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <BlurFade delay={0} inView>
            <span className="about-empower-eyebrow">Who We Empower</span>
          </BlurFade>
          <BlurFade delay={0.1} inView>
            <h2 className="about-empower-heading">
              Engineering <span className="about-heading-grad">Solutions</span> For{' '}
              <span className="about-heading-grad">Every Vision</span>
            </h2>
          </BlurFade>
          <BlurFade delay={0.2} inView>
            <p className="about-empower-intro">
              From startups and enterprises to students and future innovators, we create technology
              that helps people build, grow, and transform ideas into reality.
            </p>
          </BlurFade>
        </div>

        {/* 60 / 40 composition */}
        <div className="relative mt-16 md:mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-stretch">
            <div className="lg:col-span-3 lg:row-span-1">
              <EmpowerPanel index={0} delay={0.25} />
            </div>
            <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">
              <EmpowerPanel index={1} delay={0.4} />
              <EmpowerPanel index={2} delay={0.55} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
