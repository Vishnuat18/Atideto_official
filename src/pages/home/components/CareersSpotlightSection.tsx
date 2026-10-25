import { useNavigate } from 'react-router-dom';
import { ArrowRight, Layers, TrendingUp, Palette } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import CareerWaveCard from '@/components/careers/CareerWaveCard';

interface CareerRoleCard {
  id: string;
  title: string;
  department: string;
  icon: typeof Layers;
  description: string;
}

const ROLES: CareerRoleCard[] = [
  {
    id: 'designing-team',
    title: 'Designing Team',
    department: 'UI/UX & Product Design',
    icon: Layers,
    description: 'Design intuitive interfaces, interactive prototypes, and production design systems for enterprise software and web platforms.'
  },
  {
    id: 'marketing-team',
    title: 'Marketing Team',
    department: 'Growth & Tech Strategy',
    icon: TrendingUp,
    description: 'Lead multi-channel tech campaigns, organic growth storytelling, and qualified enterprise inbound client acquisition.'
  },
  {
    id: 'graphic-designing-team',
    title: 'Graphic Designing Team',
    department: 'Brand Identity & Visuals',
    icon: Palette,
    description: 'Craft high-fidelity brand assets, 3D digital graphics, motion snippets, and visual systems that define Atideto.'
  }
];

export default function CareersSpotlightSection() {
  const navigate = useNavigate();

  return (
    <section
      data-nav-theme="light"
      className="py-24 relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F4F7FB] to-[#FAF8F5] text-slate-900 border-b border-slate-200/80"
    >
      {/* Subtle Background Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 0%, rgba(0, 82, 255, 0.08) 0%, transparent 60%),
            radial-gradient(rgba(0, 82, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 28px 28px'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header (Light Theme) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <SectionHeader
            number="04"
            category="CAREERS & COLLECTIVE"
            title="Join Our Engineering &"
            highlight="Design Team"
            subtitle="We are scaling our core teams in design, growth marketing, and visual craft. Work with true autonomy on category-defining digital products."
            align="left"
            theme="light"
            className="reveal mb-0"
          />

          <button
            onClick={() => navigate('/careers')}
            className="reveal delay-100 inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-[#0052FF] bg-[#0052FF]/10 hover:bg-[#0052FF] hover:text-white border border-[#0052FF]/20 hover:border-[#0052FF] transition-all duration-300 cursor-pointer self-start md:self-end font-heading shrink-0 shadow-sm"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <span>Explore All 3 Roles</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 3 Career Cards (Reference Image Layout with GradientWaves on Hover) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-14">
          {ROLES.map((role, idx) => {
            const delayClass = ['delay-100', 'delay-200', 'delay-300'][idx] || 'delay-100';
            return (
              <CareerWaveCard
                key={role.id}
                id={role.id}
                title={role.title}
                department={role.department}
                description={role.description}
                icon={role.icon}
                className={`reveal-scale ${delayClass}`}
                onJDClick={() => navigate('/careers')}
                onLearnMoreClick={() => navigate('/careers')}
              />
            );
          })}
        </div>

        {/* Bottom Banner Bar (Light Theme) */}
        <div className="reveal delay-150 rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <div className="text-center md:text-left">
            <h4 className="text-[#0F172A] font-bold text-lg font-heading mb-1">
              Have a visionary project or want to collaborate with our collective?
            </h4>
            <p className="text-sm text-[#475569] font-sans">
              Our engineering team consults on custom architectures, AI automation, and web platforms.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/careers')}
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all font-heading cursor-pointer"
            >
              <span>View Roles</span>
            </button>
            <button
              onClick={() => navigate('/client-connect')}
              className="px-7 py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#0052FF] hover:bg-[#0042D0] shadow-[0_4px_18px_rgba(0,82,255,0.3)] transition-all font-heading cursor-pointer"
            >
              <span>Connect With Us</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
