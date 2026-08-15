import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion';

interface Chapter {
  year: string;
  title: string;
  subtitle: string;
  label: string;
  icon: string;
  story: string;
  highlight: string;
}

const CHAPTERS: Chapter[] = [
  {
    year: '2024',
    title: 'Where It All Began',
    subtitle: 'Every great journey starts with a single idea.',
    label: 'Chapter 01',
    icon: '✨',
    story:
      'Atideto was founded with a simple vision—to build technology that solves real-world problems through thoughtful engineering. What started as a small idea quickly became a mission to create reliable, scalable, and impactful digital solutions.',
    highlight: 'Turning Ideas Into Intelligent Solutions',
  },
  {
    year: '2024',
    title: 'Building Trust',
    subtitle: 'Every project became a stepping stone.',
    label: 'Chapter 02',
    icon: '🤝',
    story:
      'Our earliest projects helped us understand client needs, refine our development process, and build long-term relationships. We focused on delivering quality, consistency, and solutions that created measurable business value.',
    highlight: 'Quality Creates Trust',
  },
  {
    year: '2025',
    title: 'Empowering Future Talent',
    subtitle: 'Learning beyond the classroom.',
    label: 'Chapter 03',
    icon: '🎓',
    story:
      'Technology grows when knowledge is shared. Through Atideto Academy, we began helping students gain practical industry experience, work on real projects, and prepare themselves for successful careers in software engineering.',
    highlight: 'Learning By Building',
  },
  {
    year: '2025',
    title: 'Engineering Innovation',
    subtitle: 'Expanding beyond traditional software.',
    label: 'Chapter 04',
    icon: '⚙️',
    story:
      'As industries evolved, so did we. Our expertise expanded into AI, intelligent automation, cloud platforms, enterprise applications, and modern web technologies to build future-ready digital ecosystems.',
    highlight: 'Innovation Through Engineering',
  },
  {
    year: 'Today',
    title: 'Creating Impact',
    subtitle: 'Growing with every solution we deliver.',
    label: 'Chapter 05',
    icon: '📈',
    story:
      'Today, Atideto continues to help businesses transform ideas into digital products through modern engineering, scalable architecture, and user-focused design. Every challenge becomes another opportunity to innovate and grow.',
    highlight: 'Building Digital Possibilities',
  },
  {
    year: 'Future',
    title: 'The Journey Continues',
    subtitle: 'This is only the beginning.',
    label: 'Chapter 06',
    icon: '🚀',
    story:
      'Our vision is to build technology that reaches beyond boundaries—creating intelligent products, empowering businesses, inspiring future engineers, and delivering solutions that make a lasting impact across industries worldwide.',
    highlight: 'The Best Is Yet To Come',
  },
];

const SPACING = 80;
const TOTAL_TRAVEL = SPACING * (CHAPTERS.length - 1);
const centerX = (i: number) => `${SPACING * i + 50}vw`;

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const C = 'currentColor';

function Header() {
  return (
    <div className="journey-header">
      <div className="journey-eyebrow">Our Journey</div>
      <h2 className="journey-heading">
        Building Tomorrow, <span>One Milestone</span> At A Time.
      </h2>
      <p className="journey-subtitle">
        From a single idea to intelligent software, every milestone shaped who we are today.
      </p>
    </div>
  );
}

function ChapterArt({ index }: { index: number }) {
  switch (index) {
    case 0:
      return (
        <svg viewBox="0 0 480 360" fill="none">
          <g stroke={C} strokeWidth="1" opacity={0.5}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line key={`v${i}`} x1={80 * i} y1={0} x2={80 * i} y2={360} strokeDasharray="3 7" />
            ))}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line key={`h${i}`} x1={0} y1={60 * i} x2={480} y2={60 * i} strokeDasharray="3 7" />
            ))}
          </g>
          <circle cx={240} cy={180} r={118} stroke={C} strokeWidth="1.5" />
          <circle cx={240} cy={180} r={158} stroke={C} strokeWidth="1" strokeDasharray="4 8" />
          <line x1={240} y1={34} x2={240} y2={326} stroke={C} strokeWidth="1.25" />
          <line x1={92} y1={180} x2={388} y2={180} stroke={C} strokeWidth="1.25" />
          <line x1={132} y1={56} x2={362} y2={304} stroke={C} strokeWidth="1" strokeDasharray="6 9" />
          <line x1={362} y1={66} x2={152} y2={292} stroke={C} strokeWidth="1" strokeDasharray="6 9" />
          <circle cx={240} cy={180} r={4} fill={C} />
        </svg>
      );
    case 1:
      return (
        <svg viewBox="0 0 480 360" fill="none">
          <rect x={118} y={30} width={210} height={284} rx={14} fill={C} fillOpacity={0.08} stroke={C} strokeOpacity={0.35} />
          <rect x={140} y={18} width={210} height={284} rx={14} fill={C} fillOpacity={0.12} stroke={C} strokeOpacity={0.45} />
          <rect x={162} y={54} width={188} height={246} rx={10} fill={C} fillOpacity={0.08} stroke={C} strokeOpacity={0.6} />
          <rect x={188} y={86} width={120} height={8} rx={4} fill={C} opacity={0.6} />
          <rect x={188} y={112} width={92} height={8} rx={4} fill={C} opacity={0.45} />
          <rect x={188} y={138} width={130} height={8} rx={4} fill={C} opacity={0.35} />
          <circle cx={376} cy={92} r={27} fill={C} fillOpacity={0.9} />
          <path d="M364 92 l9 9 l17 -17" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1={150} y1={318} x2={330} y2={318} stroke={C} strokeWidth="1" strokeDasharray="2 7" />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 480 360" fill="none">
          <rect x={118} y={56} width={256} height={252} rx={16} fill={C} fillOpacity={0.08} stroke={C} strokeOpacity={0.5} transform="rotate(-4 246 182)" />
          <g stroke={C} strokeWidth="1" opacity={0.35}>
            {[140, 170, 200, 230, 260, 290, 320].map((x) => (
              <line key={`gv${x}`} x1={x} y1={66} x2={x} y2={298} />
            ))}
            {[90, 130, 170, 210, 250].map((y) => (
              <line key={`gh${y}`} x1={128} y1={y} x2={364} y2={y} />
            ))}
          </g>
          <line x1={246} y1={66} x2={246} y2={298} stroke={C} strokeWidth="1.25" />
          {[
            [160, 110],
            [200, 180],
            [292, 140],
            [250, 250],
            [330, 220],
            [170, 260],
          ].map(([cx, cy], idx) => (
            <circle key={`n${idx}`} cx={cx} cy={cy} r={5} fill={C} />
          ))}
          <path d="M160 110 L200 180 L250 250 M200 180 L292 140 L330 220 M292 140 L250 250" stroke={C} strokeWidth="1" strokeDasharray="4 6" />
        </svg>
      );
    case 3: {
      const nodes: Array<[number, number]> = [
        [120, 90],
        [360, 70],
        [380, 220],
        [110, 250],
        [240, 300],
        [250, 60],
      ];
      return (
        <svg viewBox="0 0 480 360" fill="none">
          {nodes.map(([x, y], idx) => {
            const toCenter = idx === 0 ? null : `M240 180 L${x} ${y}`;
            return (
              <g key={`net${idx}`}>
                {toCenter && <line x1={240} y1={180} x2={x} y2={y} stroke={C} strokeWidth="1" strokeDasharray="3 6" />}
                <circle cx={x} cy={y} r={idx === 0 ? 7 : 5} fill={C} />
              </g>
            );
          })}
          <circle cx={240} cy={180} r={24} stroke={C} strokeWidth="1.5" />
          <circle cx={240} cy={180} r={7} fill={C} />
          <rect x={110} y={318} width={260} height={9} rx={4.5} fill={C} fillOpacity={0.18} />
        </svg>
      );
    }
    case 4: {
      const bars = [0.45, 0.65, 0.5, 0.8, 1];
      return (
        <svg viewBox="0 0 480 360" fill="none">
          <path d="M70 250 L110 210 L150 222 L190 176 L230 196 L270 150 L310 166 L350 118 L390 132 L420 96" stroke={C} strokeWidth="2" strokeLinecap="round" />
          <circle cx={420} cy={96} r={6} fill={C} />
          {bars.map((h, idx) => (
            <rect key={`bar${idx}`} className="grow-bar" x={86 + idx * 66} y={250 - h * 150} width={38} height={h * 150} rx={5} fill={C} fillOpacity={0.25 + idx * 0.13} />
          ))}
          <line x1={70} y1={250} x2={430} y2={250} stroke={C} strokeWidth="1.25" />
        </svg>
      );
    }
    default: {
      const stars: Array<[number, number]> = [
        [90, 70],
        [150, 130],
        [220, 60],
        [300, 110],
        [340, 200],
        [260, 260],
        [150, 240],
        [110, 300],
        [360, 290],
        [400, 140],
      ];
      return (
        <svg viewBox="0 0 480 360" fill="none">
          <g className="globe-spin">
            <circle cx={240} cy={180} r={120} stroke={C} strokeWidth="1.5" />
            <ellipse cx={240} cy={180} rx={46} ry={120} stroke={C} strokeWidth="1" opacity={0.6} />
            <ellipse cx={240} cy={180} rx={120} ry={40} stroke={C} strokeWidth="1" opacity={0.6} />
            <ellipse cx={240} cy={180} rx={120} ry={82} stroke={C} strokeWidth="1" strokeDasharray="3 6" opacity={0.5} />
            <ellipse cx={240} cy={180} rx={120} ry={122} stroke={C} strokeWidth="1" strokeDasharray="3 6" opacity={0.4} />
          </g>
          {stars.map(([x, y], idx) => (
            <circle key={`star${idx}`} cx={x} cy={y} r={idx % 3 === 0 ? 4 : 2.5} fill={C} />
          ))}
          <path d="M90 70 L150 130 L220 60 M300 110 L340 200 M260 260 L150 240 L110 300 M360 290 L400 140" stroke={C} strokeWidth="1" strokeDasharray="3 6" />
        </svg>
      );
    }
  }
}

function CardInner({ index, isActive }: { index: number; isActive: boolean }) {
  const ch = CHAPTERS[index];
  return (
    <div className={`journey-card ${isActive ? 'is-active' : ''}`}>
      <div className="journey-card-art">
        <ChapterArt index={index} />
      </div>
      <div className="journey-card-body">
        <div className="journey-card-top">
          <span className="journey-card-icon">{ch.icon}</span>
          <span className="journey-card-year">{ch.year}</span>
        </div>
        <h3 className="journey-card-title">{ch.title}</h3>
        <p className="journey-card-subtitle">{ch.subtitle}</p>
        <p className="journey-card-desc">{ch.story}</p>
        <div className="journey-card-foot">
          <span className="journey-card-highlight">“{ch.highlight}”</span>
          <span className="journey-card-index">{ch.label}</span>
          <span className="journey-card-footline" />
        </div>
      </div>
    </div>
  );
}

const DOT_POS: Array<[string, string, number, string]> = [
  ['8%', '28%', 4, '11s'],
  ['20%', '66%', 3, '14s'],
  ['34%', '20%', 5, '12s'],
  ['46%', '72%', 3, '15s'],
  ['60%', '34%', 4, '13s'],
  ['74%', '64%', 3, '16s'],
  ['86%', '24%', 5, '12s'],
  ['92%', '72%', 3, '14s'],
  ['14%', '48%', 4, '17s'],
  ['68%', '80%', 4, '13s'],
];

function DesktopBackground() {
  return (
    <div className="journey-bg" aria-hidden>
      <div className="journey-bg-base" />
      <div className="journey-bg-grad" />
      <div className="journey-grid" />
      <div className="journey-glow" />
      <div className="journey-dots">
        {DOT_POS.map(([left, top, size, dur], idx) => (
          <span
            key={idx}
            className="journey-dot"
            style={{ left, top, width: size, height: size, animationDuration: dur }}
          />
        ))}
      </div>
      <svg className="journey-lines" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <path d="M-40 700 C 300 640, 420 800, 760 720 S 1240 600, 1500 660" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.06" />
        <path d="M-40 780 C 260 740, 520 860, 900 820 S 1300 740, 1500 780" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.05" />
        <path d="M-40 500 C 340 540, 560 430, 820 470 S 1260 520, 1500 470" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.04" />
      </svg>
    </div>
  );
}

function MobileBackground() {
  return (
    <div className="journey-mobile-bg" aria-hidden>
      <div className="journey-bg-base" />
      <div className="journey-bg-grad" />
      <div className="journey-grid" />
    </div>
  );
}

function DesktopJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const trackX = useTransform(scrollYProgress, [0, 1], ['0vw', `-${TOTAL_TRAVEL}vw`]);
  const springProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.4 });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(Math.round(v * (CHAPTERS.length - 1)));
  });

  return (
    <section id="journey" ref={sectionRef} className="journey-desktop journey-section" style={{ height: `${CHAPTERS.length * 48}vh` }}>
      <div className="journey-shell">
        <DesktopBackground />

        <Header />

        <motion.div className="journey-track" style={{ x: trackX }}>
          <div className="journey-line">
            <motion.div className="journey-line-fill" style={{ scaleX: springProgress }} />
          </div>

          {CHAPTERS.map((ch, i) => (
            <div
              key={`card-${i}`}
              className={`journey-card-outer ${i === active ? 'is-active' : ''}`}
              style={{ left: centerX(i), top: '27vh', height: '40vh', maxHeight: '340px' }}
            >
              <motion.div
                style={{ height: '100%' }}
                animate={{
                  opacity: i === active ? 1 : 0.45,
                  scale: i === active ? 1 : 0.93,
                  y: i === active ? -12 : 0,
                  filter: i === active ? 'blur(0px)' : 'blur(2px)',
                }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <CardInner index={i} isActive={i === active} />
              </motion.div>
            </div>
          ))}

          {CHAPTERS.map((ch, i) => (
            <div
              key={`connector-${i}`}
              className={`journey-connector ${i === active ? 'is-active' : ''}`}
              style={{ left: centerX(i), top: 'calc(27vh + min(40vh, 340px) - 14px)', bottom: '24vh' }}
            />
          ))}

          {CHAPTERS.map((ch, i) => (
            <span
              key={`node-${i}`}
              className={`journey-node ${i === active ? 'is-active' : ''} ${i > active ? 'is-future' : ''}`}
              style={{ left: centerX(i) }}
            />
          ))}
        </motion.div>

        <div className="journey-progress">
          <div className="journey-progress-bar">
            <motion.div className="journey-progress-fill" style={{ scaleX: springProgress }} />
          </div>
          <div className="journey-progress-count">
            <span className="journey-progress-current">{active + 1}</span> / {CHAPTERS.length}
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileJourney() {
  const rowRef = useRef<HTMLDivElement>(null);
  const [mActive, setMActive] = useState(0);

  const onScroll = () => {
    const el = rowRef.current;
    if (!el) return;
    const progress = el.scrollLeft / (el.scrollWidth - el.clientWidth || 1);
    setMActive(Math.min(CHAPTERS.length - 1, Math.max(0, Math.round(progress * (CHAPTERS.length - 1)))));
  };

  return (
    <section className="journey-mobile journey-section">
      <MobileBackground />
      <div className="journey-mobile-inner">
        <Header />

        <div ref={rowRef} onScroll={onScroll} className="journey-mobile-cards">
          {CHAPTERS.map((ch, i) => (
            <div key={ch.title} className="journey-mobile-card">
              <CardInner index={i} isActive />
            </div>
          ))}
        </div>

        <div className="journey-mobile-progress">
          {CHAPTERS.map((ch, i) => (
            <span key={ch.title} className={i === mActive ? 'on' : ''} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function JourneyTimeline() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <MobileJourney />;
  return (
    <>
      <DesktopJourney />
      <MobileJourney />
    </>
  );
}
