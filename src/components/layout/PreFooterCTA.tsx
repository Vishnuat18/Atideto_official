import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Rocket, Code2, Users, FileText, CheckCircle2 } from 'lucide-react';

/* ─────────────────────────────────────────────────────────
 * 1. HOME BG: Electric Cyan/Blue Canvas Particle Field
 * ───────────────────────────────────────────────────────── */
function HomeParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let isVisible = false;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const count = 48;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * (canvas.width || 800),
      y: Math.random() * (canvas.height || 300),
      vx: Math.random() * 0.4 + 0.2,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.8 + 0.8,
      alpha: Math.random() * 0.6 + 0.2
    }));

    let time = 0;
    const render = () => {
      if (!isVisible) return;
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < count; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy + Math.sin(time + i) * 0.15;

        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < count; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.strokeStyle = `rgba(0, 150, 255, ${0.16 * (1 - dist / 80)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          cancelAnimationFrame(animId);
          animId = requestAnimationFrame(render);
        } else {
          cancelAnimationFrame(animId);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas);

    return () => {
      window.removeEventListener('resize', resize);
      observer.disconnect();
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}

/* ─────────────────────────────────────────────────────────
 * 2. ACADEMY BG: Electric Indigo Neural Waves & Circuit Traces
 * ───────────────────────────────────────────────────────── */
function AcademyCircuitBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Radiant energy orbs */}
      <div className="absolute -top-24 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
      <div className="absolute -bottom-24 -right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-48 bg-fuchsia-600/10 rounded-full blur-[90px]" />

      {/* Cyber Circuit Trace Lines SVG */}
      <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#6366F1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.6" />
          </linearGradient>
          <pattern id="dotGrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#A855F7" fillOpacity="0.15" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotGrid)" />
        <path
          d="M 0,40 Q 200,80 400,20 T 800,60 T 1200,30 T 1600,70"
          fill="none"
          stroke="url(#circuitGrad)"
          strokeWidth="1.2"
        />
        <path
          d="M 0,160 Q 300,110 600,180 T 1100,140 T 1600,190"
          fill="none"
          stroke="url(#circuitGrad)"
          strokeWidth="1"
          strokeDasharray="6,6"
        />
        <circle cx="400" cy="20" r="3" fill="#00F0FF" />
        <circle cx="800" cy="60" r="3.5" fill="#A855F7" />
        <circle cx="600" cy="180" r="3" fill="#6366F1" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
 * 3. ABOUT BG: Sapphire Orbital Concentric Rings & Crosshairs
 * ───────────────────────────────────────────────────────── */
function AboutOrbitalBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Ambient Sapphire Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/18 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-cyan-500/12 rounded-full blur-[100px]" />

      {/* Orbital Concentric Curves SVG */}
      <svg className="w-full h-full opacity-25" viewBox="0 0 1200 400" preserveAspectRatio="none">
        <defs>
          <linearGradient id="orbitalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#0052FF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {/* Large Concentric Ellipses Centered Offscreen Right */}
        <ellipse cx="1050" cy="200" rx="900" ry="320" fill="none" stroke="url(#orbitalGrad)" strokeWidth="1" />
        <ellipse cx="1050" cy="200" rx="650" ry="240" fill="none" stroke="url(#orbitalGrad)" strokeWidth="1.2" strokeDasharray="8 6" />
        <ellipse cx="1050" cy="200" rx="400" ry="160" fill="none" stroke="url(#orbitalGrad)" strokeWidth="1" />
        <ellipse cx="1050" cy="200" rx="180" ry="80" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.4" />
        {/* Precision Crosshair Lines */}
        <line x1="150" y1="200" x2="1150" y2="200" stroke="#38BDF8" strokeOpacity="0.1" strokeWidth="0.8" />
        <line x1="1050" y1="20" x2="1050" y2="380" stroke="#38BDF8" strokeOpacity="0.1" strokeWidth="0.8" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
 * 4. CLIENT CONNECT BG: Cyber Emerald-Teal Telemetry Grid
 * ───────────────────────────────────────────────────────── */
function ClientConnectTelemetryBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Emerald and Teal Glows */}
      <div className="absolute -top-10 left-1/4 w-[480px] h-[320px] bg-emerald-500/18 rounded-full blur-[110px]" />
      <div className="absolute bottom-0 right-1/4 w-[420px] h-[300px] bg-teal-500/15 rounded-full blur-[100px]" />

      {/* High-Tech Telemetry Grid SVG */}
      <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="telemetryGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10B981" strokeWidth="0.5" strokeOpacity="0.3" />
            <circle cx="40" cy="40" r="1.5" fill="#34D399" fillOpacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#telemetryGrid)" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
 * 5. REQUIREMENT GATHERING BG: Cobalt Architectural Blueprint Grid
 * ───────────────────────────────────────────────────────── */
function RequirementBlueprintBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Cobalt & Cyan Blueprint Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[320px] bg-blue-600/18 rounded-full blur-[120px]" />
      <div className="absolute -top-12 -right-12 w-80 h-80 bg-sky-500/15 rounded-full blur-[90px]" />

      {/* Blueprint Grid & Measurement Crosshairs SVG */}
      <svg className="w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="blueprintGridMajor" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#0284C7" strokeWidth="0.8" strokeOpacity="0.4" />
            <path d="M 40 0 L 40 80 M 0 40 L 80 40" fill="none" stroke="#0284C7" strokeWidth="0.4" strokeOpacity="0.2" strokeDasharray="2,2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#blueprintGridMajor)" />
        {/* Technical Corner Brackets */}
        <path d="M 20 40 L 20 20 L 40 20" fill="none" stroke="#38BDF8" strokeWidth="2" />
        <path d="M 1180 40 L 1180 20 L 1160 20" fill="none" stroke="#38BDF8" strokeWidth="2" />
        <path d="M 20 340 L 20 360 L 40 360" fill="none" stroke="#38BDF8" strokeWidth="2" />
        <path d="M 1180 340 L 1180 360 L 1160 360" fill="none" stroke="#38BDF8" strokeWidth="2" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
 * MAIN DYNAMIC PRE-FOOTER CTA COMPONENT
 * ───────────────────────────────────────────────────────── */
export default function PreFooterCTA() {
  const navigate = useNavigate();
  const location = useLocation();

  // Exclude pages that do not need this CTA
  // (Services has its own dedicated SignalCtaBanner; auth & dashboard don't display marketing CTA)
  if (
    location.pathname === '/login' ||
    location.pathname === '/dashboard' ||
    location.pathname === '/profile' ||
    location.pathname === '/services'
  ) {
    return null;
  }

  // Determine current page configuration
  const pathname = location.pathname;

  let pageConfig = {
    badge: 'ENTERPRISE ENGINEERING & AI SOLUTIONS',
    badgeStyle: 'bg-blue-950/70 border-blue-500/40 text-[#38BDF8]',
    indicatorColor: 'bg-cyan-400',
    title: (
      <>
        Ready to Build High-Performance <br className="hidden md:block" /> Software at Scale?
      </>
    ),
    subtitle:
      'From bespoke enterprise ERPs and AI automation to modern web and mobile platforms — partner with Atideto to engineer robust digital systems that drive measurable business growth.',
    buttonText: 'Start Your Project',
    buttonAction: () => navigate('/client-connect'),
    buttonStyle:
      'bg-gradient-to-r from-[#0052FF] via-[#0072FF] to-[#00F0FF] text-white shadow-[0_0_25px_rgba(0,82,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.5)]',
    cardBorder: 'border-blue-500/25 bg-[#020617] shadow-[0_0_50px_rgba(0,82,255,0.12)]',
    highlights: [
      { label: '100+ Projects Delivered', icon: Rocket },
      { label: 'Senior Tech Leads', icon: Code2 },
      { label: '98% Client Satisfaction', icon: ShieldCheck }
    ],
    BackgroundComponent: HomeParticleField
  };

  if (pathname === '/academy') {
    pageConfig = {
      badge: 'INDUSTRY-ALIGNED CAREER LAUNCHPAD',
      badgeStyle: 'bg-purple-950/80 border-purple-500/40 text-[#C084FC]',
      indicatorColor: 'bg-fuchsia-400',
      title: (
        <>
          Build Real-World Code. <br className="hidden md:block" /> Launch Your Engineering Career.
        </>
      ),
      subtitle:
        'Step beyond textbook theory. Work alongside senior engineers on production codebases, master full-stack and AI workflows, and accelerate your path to top tech roles.',
      buttonText: 'Apply for Internship',
      buttonAction: () => {
        window.scrollTo({ top: 500, behavior: 'smooth' });
      },
      buttonStyle:
        'bg-gradient-to-r from-[#7C3AED] via-[#6366F1] to-[#38BDF8] text-white shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:shadow-[0_0_35px_rgba(99,102,241,0.5)]',
      cardBorder: 'border-purple-500/30 bg-[#060312] shadow-[0_0_50px_rgba(147,51,234,0.15)]',
      highlights: [
        { label: '2K+ Students Trained', icon: Users },
        { label: 'Live Production Code', icon: Code2 },
        { label: '1-on-1 Senior Mentorship', icon: CheckCircle2 }
      ],
      BackgroundComponent: AcademyCircuitBackground
    };
  } else if (pathname === '/about') {
    pageConfig = {
      badge: 'YOUR DEDICATED TECHNOLOGY PARTNER',
      badgeStyle: 'bg-blue-950/80 border-blue-400/40 text-[#38BDF8]',
      indicatorColor: 'bg-sky-400',
      title: (
        <>
          Empower Your Vision with <br className="hidden md:block" /> Senior Engineering Craft.
        </>
      ),
      subtitle:
        'We bring focused senior engineering squads to every engagement — combining high-velocity execution with rigorous architectural standards. Let’s engineer lasting value together.',
      buttonText: 'Connect With Our Team',
      buttonAction: () => navigate('/client-connect'),
      buttonStyle:
        'bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#38BDF8] text-white shadow-[0_0_25px_rgba(29,78,216,0.4)] hover:shadow-[0_0_35px_rgba(56,189,248,0.5)]',
      cardBorder: 'border-[#38BDF8]/25 bg-[#040817] shadow-[0_0_50px_rgba(56,189,248,0.12)]',
      highlights: [
        { label: '50+ Global Clients', icon: ShieldCheck },
        { label: 'Zero Bureaucracy', icon: Sparkles },
        { label: 'Transparent Agile Delivery', icon: Rocket }
      ],
      BackgroundComponent: AboutOrbitalBackground
    };
  } else if (pathname === '/client-connect') {
    pageConfig = {
      badge: 'DIRECT ARCHITECT ACCESS & CONFIDENTIAL REVIEW',
      badgeStyle: 'bg-emerald-950/80 border-emerald-500/40 text-[#34D399]',
      indicatorColor: 'bg-emerald-400',
      title: (
        <>
          Have a Custom RFP or <br className="hidden md:block" /> Complex System Architecture?
        </>
      ),
      subtitle:
        'Prefer direct email correspondence or want to discuss enterprise RFPs under strict NDA? Our principal architects evaluate technical feasibility and return preliminary estimates within 24 hours.',
      buttonText: 'Email Principal Architects',
      buttonAction: () => {
        window.location.href = 'mailto:contact@atideto.in?subject=Project%20Inquiry%20-%20Atideto';
      },
      buttonStyle:
        'bg-gradient-to-r from-[#059669] via-[#0D9488] to-[#06B6D4] text-white shadow-[0_0_25px_rgba(5,150,105,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)]',
      cardBorder: 'border-emerald-500/30 bg-[#02130e] shadow-[0_0_50px_rgba(16,185,129,0.14)]',
      highlights: [
        { label: '100% Strict NDA Protection', icon: ShieldCheck },
        { label: '24hr Architect Feasibility', icon: Rocket },
        { label: 'No-Obligation Review', icon: CheckCircle2 }
      ],
      BackgroundComponent: ClientConnectTelemetryBackground
    };
  } else if (pathname === '/requirement-gathering') {
    pageConfig = {
      badge: 'SYSTEM DISCOVERY & SCOPING WORKSHOP',
      badgeStyle: 'bg-sky-950/80 border-sky-500/40 text-[#38BDF8]',
      indicatorColor: 'bg-sky-400',
      title: (
        <>
          Need an Architectural Blueprint <br className="hidden md:block" /> Before Writing Code?
        </>
      ),
      subtitle:
        'Skip ambiguous estimates. Let our solutions team facilitate a structured discovery session to define your system architecture, data models, sprint milestones, and exact budget.',
      buttonText: 'Schedule Scoping Session',
      buttonAction: () => navigate('/client-connect'),
      buttonStyle:
        'bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#38BDF8] text-white shadow-[0_0_25px_rgba(2,132,199,0.4)] hover:shadow-[0_0_35px_rgba(56,189,248,0.5)]',
      cardBorder: 'border-[#0284C7]/30 bg-[#030919] shadow-[0_0_50px_rgba(2,132,199,0.15)]',
      highlights: [
        { label: 'Detailed MVP Blueprint', icon: FileText },
        { label: 'Fixed-Milestone Roadmaps', icon: Rocket },
        { label: 'Full Tech Stack Guidance', icon: Code2 }
      ],
      BackgroundComponent: RequirementBlueprintBackground
    };
  }

  const {
    badge,
    badgeStyle,
    indicatorColor,
    title,
    subtitle,
    buttonText,
    buttonAction,
    buttonStyle,
    cardBorder,
    highlights,
    BackgroundComponent
  } = pageConfig;

  return (
    <div id="pre-footer-cta" className="w-full bg-black pt-10 pb-12 sm:pt-14 sm:pb-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div
          className={`relative rounded-2xl sm:rounded-[28px] overflow-hidden border ${cardBorder} p-6 sm:p-10 lg:p-12 transition-all duration-300`}
        >
          {/* Unique Background Visual */}
          <BackgroundComponent />

          {/* Foreground CTA Content Grid */}
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">
            {/* Left Content Area */}
            <div className="max-w-2xl text-left">
              {/* Eyebrow Pill Badge */}
              <div
                className={`inline-flex items-center px-3.5 py-1 rounded-full border text-[10px] sm:text-xs font-extrabold tracking-[0.18em] uppercase mb-4 shadow-sm ${badgeStyle}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${indicatorColor} animate-pulse mr-2`} />
                {badge}
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-extrabold text-white leading-tight font-montserrat tracking-tight mb-3 sm:mb-4">
                {title}
              </h2>

              {/* Subtitle */}
              <p className="text-slate-300/90 text-xs sm:text-sm lg:text-[15px] leading-relaxed max-w-xl font-normal mb-6">
                {subtitle}
              </p>

              {/* Trust Badges Row */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                {highlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] sm:text-xs font-semibold text-slate-300"
                    >
                      <Icon size={13} className="text-cyan-400 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Action Button */}
            <div className="shrink-0 w-full sm:w-auto flex justify-start lg:justify-end">
              <button
                onClick={buttonAction}
                className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide inline-flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer hover:scale-[1.03] active:scale-[0.98] ${buttonStyle}`}
              >
                <span>{buttonText}</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
