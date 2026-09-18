import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Search,
  Sparkles,
  Building2,
  GraduationCap,
  BarChart3,
  ShoppingCart,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  SOLUTION_CATEGORY_TABS,
  SOLUTIONS_DATA,
  type SolutionItem
} from '@/constants/solutions';
import SolutionDetailModal from './SolutionDetailModal';
import ServiceVisualPreview from './ServiceVisualPreview';

// Two-Color System Theme Variants (Electric Cyan/Blue + Monochrome White/Slate)
const CARD_THEMES: Record<
  string,
  {
    glowColor: string;
    accentGlow: string;
    badgeStyle: string;
    iconColor: string;
  }
> = {
  crm: {
    glowColor: 'rgba(0, 240, 255, 0.16)',
    accentGlow: '#00F0FF',
    badgeStyle: 'text-[#00F0FF] border-cyan-500/30 bg-cyan-950/40',
    iconColor: 'text-[#00F0FF]'
  },
  'billing-system': {
    glowColor: 'rgba(56, 189, 248, 0.16)',
    accentGlow: '#38BDF8',
    badgeStyle: 'text-[#38BDF8] border-sky-500/30 bg-sky-950/40',
    iconColor: 'text-[#38BDF8]'
  },
  erp: {
    glowColor: 'rgba(0, 82, 255, 0.2)',
    accentGlow: '#0052FF',
    badgeStyle: 'text-white border-blue-500/30 bg-blue-950/50',
    iconColor: 'text-[#60A5FA]'
  },
  'inventory-management': {
    glowColor: 'rgba(0, 240, 255, 0.16)',
    accentGlow: '#00F0FF',
    badgeStyle: 'text-[#00F0FF] border-cyan-500/30 bg-cyan-950/40',
    iconColor: 'text-[#00F0FF]'
  },
  'school-erp': {
    glowColor: 'rgba(56, 189, 248, 0.16)',
    accentGlow: '#38BDF8',
    badgeStyle: 'text-[#38BDF8] border-sky-500/30 bg-sky-950/40',
    iconColor: 'text-[#38BDF8]'
  },
  'hotel-management': {
    glowColor: 'rgba(0, 240, 255, 0.16)',
    accentGlow: '#00F0FF',
    badgeStyle: 'text-[#00F0FF] border-cyan-500/30 bg-cyan-950/40',
    iconColor: 'text-[#00F0FF]'
  },
  'gym-management': {
    glowColor: 'rgba(0, 82, 255, 0.2)',
    accentGlow: '#0052FF',
    badgeStyle: 'text-white border-blue-500/30 bg-blue-950/50',
    iconColor: 'text-[#60A5FA]'
  },
  'library-management': {
    glowColor: 'rgba(56, 189, 248, 0.16)',
    accentGlow: '#38BDF8',
    badgeStyle: 'text-[#38BDF8] border-sky-500/30 bg-sky-950/40',
    iconColor: 'text-[#38BDF8]'
  },
  'transport-management': {
    glowColor: 'rgba(0, 240, 255, 0.16)',
    accentGlow: '#00F0FF',
    badgeStyle: 'text-[#00F0FF] border-cyan-500/30 bg-cyan-950/40',
    iconColor: 'text-[#00F0FF]'
  },
  scm: {
    glowColor: 'rgba(56, 189, 248, 0.16)',
    accentGlow: '#38BDF8',
    badgeStyle: 'text-[#38BDF8] border-sky-500/30 bg-sky-950/40',
    iconColor: 'text-[#38BDF8]'
  },
  lms: {
    glowColor: 'rgba(0, 82, 255, 0.2)',
    accentGlow: '#0052FF',
    badgeStyle: 'text-white border-blue-500/30 bg-blue-950/50',
    iconColor: 'text-[#60A5FA]'
  },
  sms: {
    glowColor: 'rgba(0, 240, 255, 0.16)',
    accentGlow: '#00F0FF',
    badgeStyle: 'text-[#00F0FF] border-cyan-500/30 bg-cyan-950/40',
    iconColor: 'text-[#00F0FF]'
  },
  'expense-management': {
    glowColor: 'rgba(56, 189, 248, 0.16)',
    accentGlow: '#38BDF8',
    badgeStyle: 'text-[#38BDF8] border-sky-500/30 bg-sky-950/40',
    iconColor: 'text-[#38BDF8]'
  },
  'e-commerce': {
    glowColor: 'rgba(0, 240, 255, 0.16)',
    accentGlow: '#00F0FF',
    badgeStyle: 'text-[#00F0FF] border-cyan-500/30 bg-cyan-950/40',
    iconColor: 'text-[#00F0FF]'
  },
  'api-management': {
    glowColor: 'rgba(0, 82, 255, 0.2)',
    accentGlow: '#0052FF',
    badgeStyle: 'text-white border-blue-500/30 bg-blue-950/50',
    iconColor: 'text-[#60A5FA]'
  },
  'chit-fund': {
    glowColor: 'rgba(56, 189, 248, 0.16)',
    accentGlow: '#38BDF8',
    badgeStyle: 'text-[#38BDF8] border-sky-500/30 bg-sky-950/40',
    iconColor: 'text-[#38BDF8]'
  },
  'appointment-booking': {
    glowColor: 'rgba(0, 240, 255, 0.16)',
    accentGlow: '#00F0FF',
    badgeStyle: 'text-[#00F0FF] border-cyan-500/30 bg-cyan-950/40',
    iconColor: 'text-[#00F0FF]'
  }
};

// Minimalist 3D Solution Card: Borderless Icon -> Name -> Button only
// Default: Black & White / Monochrome
// Hover: Shaded Blue/Cyan 3D Gradients
function ServiceCard({
  sol,
  onOpenModal
}: {
  sol: SolutionItem;
  onOpenModal: (s: SolutionItem) => void;
  isLight?: boolean;
}) {
  const themeStyle = CARD_THEMES[sol.id] || {
    glowColor: 'rgba(0, 102, 255, 0.2)',
    accentGlow: '#00F0FF'
  };

  return (
    <div
      onClick={() => onOpenModal(sol)}
      className="relative rounded-2xl sm:rounded-[24px] p-3.5 sm:p-6 border border-white/[0.08] hover:border-cyan-400/50 transition-all duration-500 flex flex-col justify-between group cursor-pointer h-full overflow-hidden shadow-xl bg-[#090B12] hover:bg-[#0B0F1D] hover:shadow-[0_16px_40px_-8px_rgba(0,102,255,0.25)] hover:-translate-y-1.5 select-none"
    >
      {/* Soft Ambient Radial Backlight on Hover */}
      <div
        className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-32 rounded-full blur-[50px] opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: themeStyle.accentGlow }}
      />

      {/* ── 1. THE 3D ICON (Floating borderless, B&W by default, Shaded Blue on hover) ── */}
      <div className="w-full flex items-center justify-center py-1 sm:py-3 relative z-10 transition-transform duration-500 group-hover:scale-105">
        <ServiceVisualPreview id={sol.id} />
      </div>

      {/* ── 2. BELOW: NAME & SUBTITLE ONLY ── */}
      <div className="my-2 sm:my-3 text-center relative z-10">
        <h3 className="font-bold text-white text-xs sm:text-[15px] font-montserrat tracking-tight group-hover:text-[#00F0FF] transition-colors duration-300 line-clamp-1 sm:line-clamp-none">
          {sol.title}
        </h3>
        <p className="text-slate-400 text-[10px] sm:text-xs leading-relaxed line-clamp-2 mt-1 font-normal">
          {sol.subtitle}
        </p>
      </div>

      {/* ── 3. BUTTON ONLY (Fit content on mobile) ── */}
      <div className="mt-auto pt-2 relative z-10 flex justify-center sm:justify-start">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal(sol);
          }}
          className="w-fit sm:w-full py-1.5 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold inline-flex sm:flex items-center justify-center sm:justify-between gap-1.5 sm:gap-2 cursor-pointer transition-all duration-300 bg-white/[0.04] group-hover:bg-gradient-to-r group-hover:from-[#0052FF] group-hover:to-[#00F0FF] text-slate-300 group-hover:text-white border border-white/10 group-hover:border-transparent shadow-sm group-hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] group-hover:scale-[1.01] active:scale-[0.98] group/btn mx-auto sm:mx-0"
        >
          <span className="tracking-tight font-semibold">Explore System</span>
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md sm:rounded-lg flex items-center justify-center text-white bg-white/10 group-hover/btn:bg-white/20 transition-transform duration-300 group-hover/btn:translate-x-0.5">
            <ArrowRight size={10} strokeWidth={2.5} />
          </div>
        </button>
      </div>
    </div>
  );
}

// Mobile E-Commerce style category grouping definition
const MOBILE_CATEGORIES = [
  {
    title: 'Business Systems',
    description: 'Enterprise operations, CRM & scheduling',
    icon: Building2,
    ids: [
      'crm',
      'billing-system',
      'erp',
      'inventory-management',
      'hotel-management',
      'gym-management',
      'appointment-booking'
    ]
  },
  {
    title: 'Education & Academics',
    description: 'Smart campus, LMS & student portals',
    icon: GraduationCap,
    ids: ['school-erp', 'library-management', 'lms', 'sms']
  },
  {
    title: 'Finance & Accounts',
    description: 'Automated billing, expense OCR & chit pools',
    icon: BarChart3,
    ids: ['billing-system', 'expense-management', 'chit-fund']
  },
  {
    title: 'Commerce & Logistics',
    description: 'Fast storefronts, supply chain & APIs',
    icon: ShoppingCart,
    ids: ['e-commerce', 'scm', 'transport-management', 'api-management']
  }
];

export default function SolutionsGrid() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalSolution, setActiveModalSolution] = useState<SolutionItem | null>(null);

  // Filter solutions based on both category and search query
  const filteredSolutions = useMemo(() => {
    return SOLUTIONS_DATA.filter((sol) => {
      const matchesCategory =
        selectedCategory === 'All' || sol.categories.includes(selectedCategory);
      const matchesSearch =
        searchQuery.trim() === '' ||
        sol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sol.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sol.categories.some((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section
      id="solutions-grid"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-black text-white overflow-hidden"
    >
      {/* Soft Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#0052FF]/12 blur-[150px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* ── Section Header ── */}
        <div className="text-center mb-10 sm:mb-12">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center px-4 py-1 rounded-full bg-blue-950/70 border border-blue-500/30 text-[#38BDF8] text-[11px] sm:text-xs font-extrabold tracking-[0.2em] uppercase mb-3.5 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
            OUR SERVICES
          </div>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-extrabold text-white tracking-tight font-montserrat leading-tight mb-2.5">
            Engineered for{' '}
            <span className="bg-gradient-to-r from-[#00F0FF] via-[#38BDF8] to-[#0052FF] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,240,255,0.4)]">
              Modern Operations
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
            End-to-end digital solutions tailored to your industry, goals, and scale.
          </p>
        </div>

        {/* ── Filter Tabs & Search Bar Row ── */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-10 sm:mb-12 w-full">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-2.5">
            {SOLUTION_CATEGORY_TABS.map((tab) => {
              const isActive = selectedCategory === tab.name;
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.name}
                  onClick={() => setSelectedCategory(tab.name)}
                  className={`px-4 sm:px-4.5 py-2 rounded-full text-xs sm:text-[13px] font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-sm ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0052FF] to-[#00F0FF] text-white shadow-[0_0_20px_rgba(0,82,255,0.4)] border border-blue-400/50'
                      : 'bg-[#0c0d14] text-slate-300 hover:text-white border border-white/10 hover:border-blue-400/40'
                  }`}
                >
                  <TabIcon
                    size={14}
                    className={isActive ? 'text-white' : 'text-slate-400'}
                  />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input on Right */}
          <div className="relative w-full sm:w-80 lg:w-72 shrink-0">
            <Search
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-full bg-[#0c0d14] border border-white/10 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0052FF] shadow-sm transition-all"
            />
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* ── MOBILE VIEW: Section-Wise Horizontal Scroll (E-Commerce Style) ── */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        <div className="block md:hidden">
          {selectedCategory === 'All' && searchQuery.trim() === '' ? (
            /* When 'All' is active, render Section-Wise Horizontal Carousels */
            <div className="space-y-9">
              {MOBILE_CATEGORIES.map((sec) => {
                const SecIcon = sec.icon;
                const items = SOLUTIONS_DATA.filter((s) => sec.ids.includes(s.id));
                if (items.length === 0) return null;

                return (
                  <div key={sec.title} className="w-full">
                    {/* Section Row Header */}
                    <div className="flex items-center justify-between px-1 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-950/80 text-[#38BDF8] border border-blue-500/30 flex items-center justify-center">
                          <SecIcon size={15} />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-sm sm:text-base font-montserrat">
                            {sec.title}
                          </h3>
                          <p className="text-[10px] text-slate-400">
                            {sec.description}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold text-[#38BDF8] flex items-center gap-0.5">
                        Swipe <ChevronRight size={12} />
                      </span>
                    </div>

                    {/* Horizontal Scroll Track (Reduced card width for mobile) */}
                    <div className="flex gap-3 overflow-x-auto pb-4 pt-1 px-1 snap-x snap-mandatory scrollbar-none -mx-4 px-4">
                      {items.map((sol) => (
                        <div
                          key={`mob-${sol.id}`}
                          className="min-w-[190px] max-w-[210px] shrink-0 snap-start"
                        >
                          <ServiceCard
                            sol={sol}
                            onOpenModal={setActiveModalSolution}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* When a specific Category or Search Query is Active on Mobile */
            <div>
              <div className="flex items-center justify-between px-1 mb-3">
                <span className="text-xs font-bold text-slate-400">
                  {filteredSolutions.length} Solutions Available
                </span>
                <span className="text-[10px] font-bold text-[#38BDF8] flex items-center gap-0.5">
                  Swipe <ChevronRight size={12} />
                </span>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-4 pt-1 px-1 snap-x snap-mandatory scrollbar-none -mx-4 px-4">
                {filteredSolutions.map((sol) => (
                  <div
                    key={`mob-filtered-${sol.id}`}
                    className="min-w-[190px] max-w-[210px] shrink-0 snap-start"
                  >
                    <ServiceCard
                      sol={sol}
                      onOpenModal={setActiveModalSolution}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mobile Bottom Banner: Custom Solutions */}
          {selectedCategory === 'All' && searchQuery.trim() === '' && (
            <div className="mt-8 rounded-2xl bg-gradient-to-r from-[#031B4D] via-[#052A72] to-[#0A3D99] p-5 text-white border border-blue-400/30 shadow-lg text-center">
              <span className="text-[10px] font-bold tracking-widest text-blue-300 uppercase block mb-1">
                LET'S BUILD TOGETHER
              </span>
              <h3 className="text-lg font-bold font-montserrat mb-1">
                Custom Solutions for <span className="text-[#38BDF8]">Your Business Needs.</span>
              </h3>
              <p className="text-blue-100 text-xs mb-4">
                From idea to implementation — we help you scale with technology.
              </p>
              <button
                onClick={() => navigate('/client-connect')}
                className="w-fit mx-auto px-6 py-2.5 rounded-full bg-white text-[#031B4D] text-xs font-bold shadow-md inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Get a Free Consultation</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* ── DESKTOP VIEW: Responsive 5-Column Grid Layout ── */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        <div className="hidden md:block">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
          >
            <AnimatePresence>
              {filteredSolutions.map((sol) => (
                <motion.div
                  key={sol.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <ServiceCard
                    sol={sol}
                    onOpenModal={setActiveModalSolution}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Wide Bottom Card Banner: Custom Solutions */}
            {(selectedCategory === 'All' ||
              selectedCategory === 'Business Systems' ||
              selectedCategory === 'Custom') &&
              searchQuery.trim() === '' && (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-3 min-h-[190px] rounded-[24px] bg-gradient-to-r from-[#031B4D] via-[#052A72] to-[#0A3D99] p-6 sm:p-7 relative overflow-hidden flex flex-col md:flex-row items-center justify-between text-white shadow-xl border border-blue-400/25 group"
                >
                  {/* Background Concentric Curves */}
                  <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-white/10 pointer-events-none" />
                  <div className="absolute right-[20px] top-1/2 -translate-y-1/2 w-60 h-60 rounded-full border border-white/10 pointer-events-none" />

                  {/* Left Content */}
                  <div className="flex-1 max-w-lg z-10 text-center md:text-left mb-6 md:mb-0">
                    <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-blue-300 block mb-2">
                      LET'S BUILD TOGETHER
                    </span>
                    <h3 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold leading-tight tracking-tight mb-2 font-montserrat">
                      Custom Solutions for <span className="text-[#38BDF8]">Your Business Needs.</span>
                    </h3>
                    <p className="text-blue-100 text-xs sm:text-[13px] leading-relaxed max-w-md">
                      From idea to implementation — we help you scale with technology.
                    </p>

                    {/* Consultation Button */}
                    <button
                      onClick={() => navigate('/client-connect')}
                      className="mt-5 px-6 py-2.5 rounded-full bg-white hover:bg-blue-50 text-[#031B4D] text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 inline-flex items-center gap-2 cursor-pointer"
                    >
                      <span>Get a Free Consultation</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Right Side: Code-Rendered Terminal & Live Dashboard Preview */}
                  <div className="relative shrink-0 w-full md:w-72 h-44 flex items-center justify-center z-10">
                    <div className="w-full max-w-[270px] bg-[#0A0F1D]/90 backdrop-blur-md rounded-2xl border border-blue-400/30 p-3.5 shadow-2xl flex flex-col justify-between h-36">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                        </div>
                        <span className="font-mono text-[9px] text-blue-300 font-semibold">
                          atideto_engine.sh
                        </span>
                      </div>

                      <div className="font-mono text-[9px] text-slate-300 space-y-1 my-1">
                        <div className="text-emerald-400 flex items-center gap-1">
                          <span>$</span> <span>deploy --production</span>
                        </div>
                        <div className="text-blue-300 flex items-center justify-between">
                          <span>✓ 99.99% Cloud SLA</span>
                          <span className="text-white font-bold">● LIVE</span>
                        </div>
                        <div className="text-slate-400 text-[8px] truncate">
                          Custom APIs, AI pipelines & real-time sync
                        </div>
                      </div>

                      <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px] text-blue-200">
                        <span className="font-bold text-sky-400">Grow Digitally with Us</span>
                        <span className="font-mono text-emerald-400">→ 3x ROI</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
          </motion.div>
        </div>

        {/* Empty Search Result State */}
        {filteredSolutions.length === 0 && (
          <div className="text-center py-16 bg-[#0A1224] rounded-3xl border border-white/10 p-8 my-6">
            <Sparkles size={32} className="mx-auto text-blue-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">
              No services found
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              We couldn't find any services matching "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/15"
            >
              Clear Search & Filters
            </button>
          </div>
        )}
      </div>

      {/* ── Interactive Deep-Dive Details Modal ── */}
      <SolutionDetailModal
        solution={activeModalSolution}
        isOpen={!!activeModalSolution}
        onClose={() => setActiveModalSolution(null)}
      />
    </section>
  );
}
