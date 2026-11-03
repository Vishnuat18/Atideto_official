import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Plus, 
  Minus, 
  X, 
  Send, 
  MapPin, 
  Briefcase, 
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import MagicRings from '@/components/ui/MagicRings';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  experience: string;
  overview: string;
  responsibilities: string[];
  requirements: string[];
  tools: string[];
}

const OPEN_POSITIONS: JobPosition[] = [
  {
    id: 'designing-team',
    title: 'Designing Team (Product & UI/UX Design)',
    department: 'Design & Product',
    type: 'Full-time / Hybrid',
    location: 'Salem, TN · Hybrid / Remote',
    experience: '1 - 3 Years / Strong Portfolio',
    overview: 'Lead the visual craft and user experience for our flagship digital products, web applications, and enterprise client platforms. You will bridge complex engineering architecture with breathtaking, human-centric design.',
    responsibilities: [
      'Design end-to-end user flows, interactive prototypes, and production-ready UI in Figma.',
      'Establish and maintain cohesive design systems, component libraries, and design tokens.',
      'Collaborate directly with frontend engineers to ensure pixel-perfect design implementation.',
      'Conduct user testing, design critiques, and translate feedback into iterative UX improvements.'
    ],
    requirements: [
      'Demonstrated portfolio showcasing web, mobile, and digital product interface craft.',
      'Deep expertise in Figma, modern typography, responsive layout systems, and micro-interactions.',
      'Strong understanding of design engineering principles and frontend capabilities (HTML/CSS/Tailwind).',
      'High ownership mindset with the ability to articulate design rationale clearly.'
    ],
    tools: ['Figma', 'Prototyping', 'Design Systems', 'Tailwind tokens', 'Framer']
  },
  {
    id: 'marketing-team',
    title: 'Marketing Team (Growth & Digital Strategy)',
    department: 'Growth & Marketing',
    type: 'Full-time / Hybrid',
    location: 'Salem, TN · Hybrid / Remote',
    experience: '1 - 3 Years / Track Record',
    overview: 'Drive brand momentum, customer acquisition, and organic growth across Atideto’s enterprise services, academy programs, and software platforms. You will architect high-converting campaigns and position Atideto as an industry leader.',
    responsibilities: [
      'Plan and execute multi-channel growth campaigns across LinkedIn, search, content, and tech communities.',
      'Develop compelling product narratives, case studies, and customer-facing collateral.',
      'Analyze campaign telemetry, funnel conversion rates, and optimize inbound client lead generation.',
      'Collaborate with the design and engineering teams to launch targeted landing pages and growth experiments.'
    ],
    requirements: [
      'Proven experience in B2B tech marketing, digital marketing, or growth strategy.',
      'Exceptional analytical mindset with practical experience in SEO, analytics, and content distribution.',
      'Strong storytelling and copywriting capability tailored for founders and tech executives.',
      'Self-driven execution with a passion for measurable ROI and rapid experiment iteration.'
    ],
    tools: ['Growth Analytics', 'SEO Strategy', 'Content Marketing', 'LinkedIn Campaigns', 'CRM Automation']
  },
  {
    id: 'graphic-designing-team',
    title: 'Graphic Designing Team (Brand & Visual Identity)',
    department: 'Creative & Brand',
    type: 'Full-time / Hybrid',
    location: 'Salem, TN · Hybrid / Remote',
    experience: '1 - 3 Years / Creative Portfolio',
    overview: 'Define the iconic visual identity of Atideto and our partner clients. From 3D brand assets and digital graphics to product launch visuals and marketing collateral, you will elevate our visual language into a category-defining brand.',
    responsibilities: [
      'Create high-fidelity digital graphics, brand illustrations, social content, and launch media.',
      'Craft visual assets, icons, typography guidelines, and brand kits for new client projects.',
      'Produce eye-catching motion graphics and animated visual snippets for web platforms.',
      'Ensure absolute brand visual consistency across all digital touchpoints and presentations.'
    ],
    requirements: [
      'Outstanding visual portfolio showcasing brand identity, digital graphics, and aesthetic excellence.',
      'Mastery of Adobe Creative Suite (Photoshop, Illustrator, After Effects) and modern digital design tools.',
      'Keen eye for lighting, color harmony, typography hierarchies, and modern cyber-minimalist aesthetics.',
      'Ability to thrive in a fast-paced environment and deliver polished assets on schedule.'
    ],
    tools: ['Adobe Illustrator', 'Photoshop', 'After Effects', 'Figma', 'Brand Guidelines']
  }
];

export default function Careers() {
  const navigate = useNavigate();
  const [hoveredPosition, setHoveredPosition] = useState<string | null>(null);
  const [expandedPosition, setExpandedPosition] = useState<string | null>(null);

  // Application Modal state
  const [applyingFor, setApplyingFor] = useState<JobPosition | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPortfolio, setApplicantPortfolio] = useState('');
  const [applicantNote, setApplicantNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);



  const toggleExpand = (id: string) => {
    setExpandedPosition(prev => prev === id ? null : id);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail) {
      toast.error('Please provide your name and email address');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Application submitted for ${applyingFor?.title}! We will contact you shortly.`);
      setApplyingFor(null);
      setApplicantName('');
      setApplicantEmail('');
      setApplicantPortfolio('');
      setApplicantNote('');
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E2E8F0] selection:bg-[#0052FF] selection:text-white overflow-x-clip">
      
      {/* ── 1. Hero Section (Full Viewport Height, Extends to End of Screen) ── */}
      <section className="hero-fullscreen relative w-full flex flex-col items-center justify-between overflow-hidden bg-[#050505] text-white pt-24 sm:pt-28 pb-8 border-b border-white/5">
        
        {/* Fullscreen MagicRings Background Visual (Electric Blue, interactive=false to avoid touch animation) */}
        <div className="absolute inset-0 pointer-events-none opacity-85 z-0 flex items-center justify-center overflow-hidden">
          <MagicRings
            color="#0052FF"
            colorTwo="#00F0FF"
            motion="pulse"
            ringCount={8}
            speed={0.8}
            lineThickness={2.2}
            glow={1.4}
            hoverScale={1.0}
            hoverIntensity={0}
            clickBurst={false}
            interactive={false}
            tilt={-16}
          />
          {/* Seamless bottom fade into next section */}
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent pointer-events-none" />
        </div>

        {/* Hero Eyebrow & Content */}
        <div className="relative max-w-4xl mx-auto px-6 text-center z-10 flex flex-col items-center my-auto">
          <div className="inline-flex items-center gap-3 mb-4 select-none">
            <span className="w-8 sm:w-10 h-[1.5px] bg-[#0052FF] shrink-0" />
            <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase font-heading text-[#2EA8FF]">
              CAREERS AT ATIDETO
            </span>
          </div>

          <h1
            className="text-[32px] sm:text-[38px] lg:text-[44px] font-bold text-white tracking-tight leading-[1.18] mb-4 max-w-2xl font-heading drop-shadow-[0_4px_35px_rgba(0,82,255,0.25)]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Join Our Team
          </h1>

          <p
            className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans font-normal"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            We are looking for ambitious builders who care deeply about craft, autonomy, and shipping category-defining technology.
          </p>
        </div>

        {/* Subtle indicator hint to scroll down */}
        <div
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="relative z-10 flex flex-col items-center gap-2 text-slate-500 hover:text-white transition-colors cursor-pointer mb-2"
        >
          <span className="text-[11px] font-mono tracking-widest uppercase text-slate-400">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-cyan-400 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── 2. What We Do (Simple as Earlier) ── */}
      <section className="py-20 sm:py-24 relative bg-[#050505] border-b border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2
            className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4 font-heading"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            What we do
          </h2>
          <p
            className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            We make scaling simple. We engineer intelligent software, AI automation, enterprise cloud platforms, and immersive digital products. Developers and founders trust Atideto to deploy resilient systems that communicate seamlessly and grow without limits.
          </p>
        </div>
      </section>

      {/* ── 3. Why We Do It (Simple as Earlier) ── */}
      <section className="py-20 sm:py-24 relative bg-[#050505] border-b border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2
            className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4 font-heading"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Why we do it
          </h2>
          <p
            className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            We believe technology should feel effortless, not overwhelming. By fusing relentless engineering rigor with category-defining design, we help high-ambition teams turn complex operational friction into unfair competitive advantage.
          </p>
        </div>
      </section>

      {/* ── 4. Open Positions (Earlier Design: Minimalist Accordion List, Clean & Workable) ── */}
      <section className="py-24 sm:py-28 relative bg-[#050505]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="reveal flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-3 mb-3 select-none">
                <span className="w-8 sm:w-10 h-[1.5px] bg-[#0052FF] shrink-0" />
                <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase font-heading text-[#2EA8FF]">
                  CAREERS & OPPORTUNITIES
                </span>
              </div>
              <h2
                className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight font-heading leading-[1.2]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Open Positions
              </h2>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-3.5 py-1.5 rounded-full border border-cyan-400/20 self-start sm:self-auto">
              {OPEN_POSITIONS.length} ROLES AVAILABLE
            </span>
          </div>

          <p
            className="reveal delay-100 text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl mb-12 font-sans"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Explore high-impact positions across our product engineering, digital growth, and brand design teams.
          </p>

          {/* Minimalist Positions Accordion List (Earlier Design) */}
          <div className="divide-y divide-white/10 border-t border-b border-white/10 mb-20">
            {OPEN_POSITIONS.map((position) => {
              const isExpanded = expandedPosition === position.id;
              const isHovered = hoveredPosition === position.id;

              return (
                <div
                  key={position.id}
                  onMouseEnter={() => setHoveredPosition(position.id)}
                  onMouseLeave={() => setHoveredPosition(null)}
                  className={`transition-colors duration-200 ${
                    isExpanded ? 'bg-white/[0.04]' : isHovered ? 'bg-white/[0.02]' : 'bg-transparent'
                  }`}
                >
                  {/* Position Header Row */}
                  <div
                    onClick={() => toggleExpand(position.id)}
                    className="py-6 sm:py-7 flex items-center justify-between cursor-pointer group select-none"
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                        <span className="text-xs font-mono text-[#38BDF8] tracking-wider uppercase">
                          {position.department}
                        </span>
                        <span className="text-white/20 text-xs">•</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-sans">
                          <MapPin size={11} className="text-cyan-400" />
                          {position.location}
                        </span>
                        <span className="text-white/20 text-xs">•</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-sans">
                          <Briefcase size={11} className="text-cyan-400" />
                          {position.type}
                        </span>
                      </div>
                      
                      <h3
                        className="text-lg sm:text-xl md:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors font-heading tracking-tight"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {position.title}
                      </h3>
                    </div>

                    {/* Expand / Collapse Icon */}
                    <button
                      type="button"
                      aria-label="Toggle details"
                      className="w-10 h-10 rounded-full border border-white/15 group-hover:border-cyan-400/50 flex items-center justify-center text-slate-300 group-hover:text-white transition-all shrink-0 cursor-pointer"
                    >
                      {isExpanded ? <Minus size={16} /> : <Plus size={16} />}
                    </button>
                  </div>

                  {/* Expanded / Detailed Content */}
                  {isExpanded && (
                    <div className="pb-8 pt-2 animate-[fadeIn_0.25s_ease-out]">
                      <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-sans">
                        {position.overview}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6">
                        {/* Key Responsibilities */}
                        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                          <h4 className="text-xs font-mono uppercase tracking-widest text-cyan-300 mb-3 font-semibold">
                            What you will do
                          </h4>
                          <ul className="space-y-2.5">
                            {position.responsibilities.map((resp, idx) => (
                              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Requirements */}
                        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                          <h4 className="text-xs font-mono uppercase tracking-widest text-[#38BDF8] mb-3 font-semibold">
                            What we look for
                          </h4>
                          <ul className="space-y-2.5">
                            {position.requirements.map((req, idx) => (
                              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0052FF] mt-1.5 shrink-0" />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Tooling and Apply Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-slate-400 font-mono">CORE STACK:</span>
                          {position.tools.map((tool, tIdx) => (
                            <span key={tIdx} className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-white/5 text-slate-300 border border-white/10">
                              {tool}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => setApplyingFor(position)}
                          className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#0052FF] hover:bg-[#0042D0] shadow-[0_4px_18px_rgba(0,82,255,0.35)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer font-heading"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          <span>Apply for this Role</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Reach Out Callout (Image 2 style) ── */}
          <div className="text-center max-w-lg mx-auto mb-16">
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans mb-1">
              If you're interested, please reach out at{' '}
              <a
                href="mailto:careers@atideto.com"
                className="text-cyan-300 underline hover:text-white transition-colors font-medium"
              >
                careers@atideto.com
              </a>.
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              We are founder-backed and compensate based on high impact and craft.
            </p>
          </div>

          {/* ── Navigation Pills (Image 2 style) ── */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-6 border-t border-white/10">
            <button
              onClick={() => navigate('/about')}
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Learn More</span>
              <ArrowRight size={13} className="text-cyan-400" />
            </button>
            
            <button
              onClick={() => navigate('/about')}
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>About Us</span>
              <ArrowRight size={13} className="text-cyan-400" />
            </button>

            <button
              onClick={() => navigate('/services')}
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Services</span>
              <ArrowRight size={13} className="text-cyan-400" />
            </button>
          </div>

        </div>
      </section>

      {/* ── Quick Application Modal ── */}
      {applyingFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-lg bg-[#0A0E1A] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setApplyingFor(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest font-semibold">
                APPLYING FOR
              </span>
              <h3 className="text-xl font-bold text-white font-heading mt-1">
                {applyingFor.title}
              </h3>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 font-sans">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-[#0052FF] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 font-sans">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-[#0052FF] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 font-sans">
                  Portfolio / GitHub / LinkedIn URL *
                </label>
                <input
                  type="url"
                  required
                  value={applicantPortfolio}
                  onChange={(e) => setApplicantPortfolio(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-[#0052FF] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 font-sans">
                  Why Atideto? (Brief note)
                </label>
                <textarea
                  rows={3}
                  value={applicantNote}
                  onChange={(e) => setApplicantNote(e.target.value)}
                  placeholder="Tell us about the projects you love building..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-[#0052FF] text-sm resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setApplyingFor(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0052FF] hover:bg-[#0042D0] flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <Send size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
