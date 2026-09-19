import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  SOLUTION_CATEGORY_TABS,
  SOLUTIONS_DATA,
  type SolutionItem
} from '@/constants/solutions';
import SolutionDetailModal from './SolutionDetailModal';

// High-tech decorative dot matrix pattern matching the reference bento design
function DotGrid({ theme }: { theme: 'dark' | 'light' | 'blue' }) {
  const dotColor =
    theme === 'dark'
      ? '#38BDF8'
      : theme === 'light'
      ? '#94A3B8'
      : '#BAE6FD';

  return (
    <svg
      width="28"
      height="22"
      viewBox="0 0 28 22"
      fill="none"
      className="opacity-25 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none"
    >
      <circle cx="3" cy="3" r="1.5" fill={dotColor} />
      <circle cx="11" cy="3" r="1.5" fill={dotColor} />
      <circle cx="19" cy="3" r="1.5" fill={dotColor} />
      <circle cx="27" cy="3" r="1.5" fill={dotColor} />

      <circle cx="3" cy="11" r="1.5" fill={dotColor} />
      <circle cx="11" cy="11" r="1.5" fill={dotColor} />
      <circle cx="19" cy="11" r="1.5" fill={dotColor} />
      <circle cx="27" cy="11" r="1.5" fill={dotColor} />

      <circle cx="3" cy="19" r="1.5" fill={dotColor} />
      <circle cx="11" cy="19" r="1.5" fill={dotColor} />
      <circle cx="19" cy="19" r="1.5" fill={dotColor} />
      <circle cx="27" cy="19" r="1.5" fill={dotColor} />
    </svg>
  );
}

// Professional Bento Card Component with exact accent colors, clean 3D asset integration & no empty space
function BentoServiceCard({
  sol,
  onOpenModal,
  isWide = false,
  className = ''
}: {
  sol: SolutionItem;
  onOpenModal: (s: SolutionItem) => void;
  isWide?: boolean;
  className?: string;
}) {
  const isDark = sol.theme === 'dark';
  const isLight = sol.theme === 'light';

  return (
    <div
      onClick={() => onOpenModal(sol)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenModal(sol);
        }
      }}
      className={`group relative rounded-2xl sm:rounded-[22px] p-5 cursor-pointer select-none transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden h-full min-h-[190px] sm:min-h-[200px] border ${
        isDark
          ? 'bg-gradient-to-br from-[#0B1022] via-[#070A16] to-[#03060E] border-white/[0.09] hover:border-cyan-400/60 shadow-xl hover:shadow-[0_16px_36px_rgba(0,240,255,0.22)]'
          : isLight
          ? 'bg-gradient-to-br from-[#FFFFFF] via-[#F8FAFC] to-[#F1F5F9] border-slate-200/90 hover:border-blue-500/60 shadow-md hover:shadow-[0_16px_36px_rgba(0,82,255,0.18)]'
          : 'bg-gradient-to-br from-[#0052FF] via-[#0047E0] to-[#0034A8] border-blue-400/40 hover:border-white/70 shadow-xl hover:shadow-[0_16px_40px_rgba(0,82,255,0.45)]'
      } ${className}`}
    >
      {/* ── RIGHT: 3D Illustration fitted cleanly inside without distortion or overflow ── */}
      <div
        className={`absolute right-1 sm:right-2 bottom-2 top-2 flex items-center justify-end pointer-events-none overflow-hidden z-0 ${
          isWide ? 'w-[42%] sm:w-[44%]' : 'w-[45%] sm:w-[47%]'
        }`}
      >
        <img
          src={sol.image}
          alt={sol.title}
          className={`w-auto max-w-full object-contain object-right transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1 block ${
            isWide
              ? 'max-h-[145px] sm:max-h-[160px]'
              : 'max-h-[130px] sm:max-h-[145px]'
          }`}
          loading="lazy"
          draggable={false}
        />
      </div>

      {/* ── LEFT: Content container (Number, Title, Subtitle, Arrow Button) ── */}
      <div
        className={`relative z-10 flex flex-col justify-between h-full ${
          isWide ? 'max-w-[58%] sm:max-w-[59%]' : 'max-w-[55%] sm:max-w-[56%]'
        }`}
      >
        {/* Top: Number Badge */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span
              className={`font-mono text-xs sm:text-[13px] font-extrabold tracking-wider ${
                isDark
                  ? 'text-[#38BDF8]'
                  : isLight
                  ? 'text-slate-500'
                  : 'text-blue-200'
              }`}
            >
              {sol.number}
            </span>
            <div
              className={`w-3.5 h-0.5 rounded-full ${
                isDark
                  ? 'bg-cyan-400/50'
                  : isLight
                  ? 'bg-slate-300'
                  : 'bg-blue-300/60'
              }`}
            />
          </div>

          {/* Solution Name */}
          <h3
            className={`font-extrabold text-[15px] sm:text-base lg:text-[17px] font-montserrat tracking-tight leading-snug transition-colors duration-200 ${
              isDark
                ? 'text-white group-hover:text-[#38BDF8]'
                : isLight
                ? 'text-[#0B0F19] group-hover:text-[#0052FF]'
                : 'text-white group-hover:text-cyan-200'
            }`}
          >
            {sol.title}
          </h3>

          {/* Subtitle / Tagline */}
          <p
            className={`text-xs sm:text-[12px] leading-relaxed mt-1.5 line-clamp-2 transition-colors duration-200 ${
              isDark
                ? 'text-slate-400 group-hover:text-slate-300'
                : isLight
                ? 'text-slate-600 group-hover:text-slate-700'
                : 'text-blue-100 group-hover:text-white'
            }`}
          >
            {sol.subtitle}
          </p>
        </div>

        {/* Bottom: Action Arrow Button */}
        <div className="pt-2.5 mt-auto flex items-center">
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:translate-x-1.5 shadow-sm shrink-0 ${
              isDark
                ? 'bg-white/[0.08] text-slate-200 border border-white/10 group-hover:bg-[#00F0FF] group-hover:border-[#00F0FF] group-hover:text-black group-hover:shadow-[0_0_16px_rgba(0,240,255,0.45)]'
                : isLight
                ? 'bg-slate-100 text-slate-700 border border-slate-200 group-hover:bg-[#0052FF] group-hover:border-[#0052FF] group-hover:text-white group-hover:shadow-[0_0_16px_rgba(0,82,255,0.35)]'
                : 'bg-white/15 text-white border border-white/25 group-hover:bg-white group-hover:text-[#0052FF] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]'
            }`}
          >
            <ArrowRight size={13} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Decorative dot matrix in top right corner */}
      <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-0 pointer-events-none">
        <DotGrid theme={sol.theme} />
      </div>
    </div>
  );
}

// Hotstar-styled Mobile Card with exact aspect ratio, neat spacing & perfectly contained 3D illustration
function HotstarMobileCard({
  sol,
  onOpenModal
}: {
  sol: SolutionItem;
  onOpenModal: (s: SolutionItem) => void;
}) {
  const isDark = sol.theme === 'dark';
  const isLight = sol.theme === 'light';

  return (
    <div
      onClick={() => onOpenModal(sol)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenModal(sol);
        }
      }}
      className={`group relative rounded-[20px] p-4 cursor-pointer select-none transition-all duration-200 active:scale-[0.98] flex flex-col justify-between overflow-hidden h-[162px] w-[248px] min-w-[248px] max-w-[248px] shrink-0 snap-start border ${
        isDark
          ? 'bg-gradient-to-br from-[#0D1326] via-[#090D1C] to-[#050711] border-white/[0.08] active:border-cyan-400/50 shadow-md'
          : isLight
          ? 'bg-gradient-to-br from-[#FFFFFF] via-[#F8FAFC] to-[#F1F5F9] border-slate-200/90 active:border-blue-500/50 shadow-sm'
          : 'bg-gradient-to-br from-[#0052FF] via-[#0047E0] to-[#0034A8] border-blue-400/30 active:border-white/60 shadow-md'
      }`}
    >
      {/* ── RIGHT: 3D Illustration fitted cleanly inside without distortion or overflow ── */}
      <div className="absolute right-2 bottom-2 top-2 w-[42%] flex items-center justify-center pointer-events-none overflow-hidden z-0">
        <img
          src={sol.image}
          alt={sol.title}
          className="w-auto max-w-full max-h-[110px] object-contain object-center transition-transform duration-300 group-hover:scale-105 block"
          loading="lazy"
          draggable={false}
        />
      </div>

      {/* ── LEFT: Content (Number, Title, Subtitle, Arrow) ── */}
      <div className="relative z-10 flex flex-col justify-between h-full max-w-[58%] pr-1">
        <div>
          {/* Number badge */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span
              className={`font-mono text-[11px] font-extrabold tracking-wider ${
                isDark
                  ? 'text-[#38BDF8]'
                  : isLight
                  ? 'text-slate-500'
                  : 'text-blue-200'
              }`}
            >
              {sol.number}
            </span>
            <div
              className={`w-3 h-0.5 rounded-full ${
                isDark
                  ? 'bg-cyan-400/60'
                  : isLight
                  ? 'bg-slate-300'
                  : 'bg-blue-300/60'
              }`}
            />
          </div>

          {/* Solution Title */}
          <h4
            className={`font-extrabold text-[14px] font-montserrat tracking-tight leading-snug line-clamp-2 ${
              isDark
                ? 'text-white'
                : isLight
                ? 'text-[#0B0F19]'
                : 'text-white'
            }`}
          >
            {sol.title}
          </h4>

          {/* Subtitle / Tagline */}
          <p
            className={`text-[10.5px] leading-tight mt-1 line-clamp-2 ${
              isDark
                ? 'text-slate-400'
                : isLight
                ? 'text-slate-600'
                : 'text-blue-100'
            }`}
          >
            {sol.subtitle}
          </p>
        </div>

        {/* Action Button at bottom */}
        <div className="pt-2 mt-auto flex items-center gap-1.5">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200 group-active:translate-x-1 shadow-sm shrink-0 ${
              isDark
                ? 'bg-white/[0.08] text-slate-200 border border-white/10'
                : isLight
                ? 'bg-slate-100 text-slate-700 border border-slate-200'
                : 'bg-white/20 text-white border border-white/30'
            }`}
          >
            <ArrowRight size={11} strokeWidth={2.5} />
          </div>
          <span
            className={`text-[10px] font-bold tracking-tight ${
              isDark
                ? 'text-cyan-400'
                : isLight
                ? 'text-blue-600'
                : 'text-blue-100'
            }`}
          >
            View Details
          </span>
        </div>
      </div>
    </div>
  );
}

// Interactive Mobile Rail Component: No header icon, proper margin, interactive swipe chevrons & progress dots
function InteractiveMobileRail({
  sec,
  solutions,
  onOpenModal
}: {
  sec: {
    title: string;
    description: string;
    ids: string[];
  };
  solutions: SolutionItem[];
  onOpenModal: (s: SolutionItem) => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScroll = () => {
    if (!railRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = railRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Approximate active item index for progress indicator
    const cardWidth = 248 + 14; // card width + gap
    const index = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(Math.max(0, index), solutions.length - 1));
  };

  useEffect(() => {
    checkScroll();
  }, [solutions]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!railRef.current) return;
    const scrollAmount = 262; // card width (248) + gap (14)
    railRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const scrollToIndex = (index: number) => {
    if (!railRef.current) return;
    const scrollAmount = index * 262;
    railRef.current.scrollTo({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="w-full">
      {/* ── Rail Header (NO icon next to title, proper margins & typography) ── */}
      <div className="flex items-end justify-between px-1 mb-3.5">
        <div className="max-w-[75%]">
          <h3 className="font-extrabold text-white text-[16px] font-montserrat tracking-tight leading-tight">
            {sec.title}
          </h3>
          <p className="text-[11px] text-slate-400 leading-tight mt-1">
            {sec.description}
          </p>
        </div>

        {/* Interactive Swipe Controls (tap to smoothly slide cards) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous service"
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              canScrollLeft
                ? 'bg-white/10 text-white border border-white/20 active:scale-90 active:bg-blue-600 cursor-pointer'
                : 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed opacity-35'
            }`}
          >
            <ChevronLeft size={14} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Next service"
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              canScrollRight
                ? 'bg-blue-600 text-white border border-blue-400/40 shadow-[0_0_12px_rgba(0,82,255,0.4)] active:scale-90 active:bg-blue-500 cursor-pointer'
                : 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed opacity-35'
            }`}
          >
            <ChevronRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* ── Hotstar Horizontal Rail Track with touch snap & smooth swipe ── */}
      <div
        ref={railRef}
        onScroll={checkScroll}
        className="flex gap-3.5 overflow-x-auto pb-2 pt-1 px-3 snap-x snap-mandatory scrollbar-none -mx-3 scroll-smooth"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {solutions.map((sol) => (
          <HotstarMobileCard
            key={`mob-${sol.id}`}
            sol={sol}
            onOpenModal={onOpenModal}
          />
        ))}
      </div>

      {/* ── Interactive Swipe Progress Indicator Dots (tap to navigate) ── */}
      <div className="flex items-center justify-center gap-1.5 mt-2.5">
        {solutions.map((sol, idx) => (
          <button
            key={`dot-${sol.id}`}
            type="button"
            onClick={() => scrollToIndex(idx)}
            aria-label={`Go to ${sol.title}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              activeIndex === idx
                ? 'w-5 h-1.5 bg-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.6)]'
                : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// Mobile category grouping starting with Business Portfolio as #01
const MOBILE_CATEGORIES = [
  {
    title: 'Business Systems',
    description: 'Enterprise operations, CRM & scheduling',
    ids: [
      'business-portfolio',
      'crm',
      'erp',
      'billing-system',
      'inventory-management',
      'hotel-management',
      'gym-management',
      'appointment-booking'
    ]
  },
  {
    title: 'Education & Academics',
    description: 'Smart campus, LMS & student portals',
    ids: ['school-erp', 'sms', 'lms']
  },
  {
    title: 'Finance & Accounts',
    description: 'Automated billing, expense OCR & chit pools',
    ids: ['billing-system', 'expense-management', 'chit-fund']
  },
  {
    title: 'Commerce & Growth',
    description: 'Fast storefronts, supply chain & marketing',
    ids: ['e-commerce', 'digital-marketing', 'scm', 'transport-management', 'api-management']
  }
];

export default function SolutionsGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalSolution, setActiveModalSolution] = useState<SolutionItem | null>(null);

  // Filter solutions based on category and search query
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

  // Exact 5-Row Bento Layout: (4 - 3 - 4 - 3 - 4 = 18 Cards)
  const isDefaultBento = selectedCategory === 'All' && searchQuery.trim() === '';
  const row1 = SOLUTIONS_DATA.slice(0, 4);   // 01 Business Portfolio, 02 CRM, 03 ERP, 04 Billing & POS (4 cards)
  const row2 = SOLUTIONS_DATA.slice(4, 7);   // 05 E-Commerce, 06 Digital Marketing, 07 School ERP (3 cards)
  const row3 = SOLUTIONS_DATA.slice(7, 11);  // 08 Inventory, 09 SCM, 10 Transport Logistics, 11 Hotel Management (4 cards)
  const row4 = SOLUTIONS_DATA.slice(11, 14); // 12 Student Management, 13 LMS, 14 Gym & Fitness Club (3 cards)
  const row5 = SOLUTIONS_DATA.slice(14, 18); // 15 Expense Management, 16 Chit Fund, 17 Appointment Booking, 18 API & Cloud (4 cards)

  return (
    <section
      id="solutions-grid"
      className="relative w-full py-16 sm:py-24 px-3 sm:px-6 lg:px-10 bg-black text-white overflow-hidden"
    >
      {/* Soft Ambient Radial Backlights */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[380px] bg-[#0052FF]/14 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[300px] bg-[#00F0FF]/10 blur-[140px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* ── Section Header ── */}
        <div className="text-center mb-8 sm:mb-12">
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

        {/* ── Filter Tabs & Search Bar Row (Desktop & Tablet only) ── */}
        <div className="hidden sm:flex flex-col lg:flex-row items-center justify-between gap-4 mb-8 sm:mb-12 w-full">
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
        {/* ── 1. DESKTOP VIEW (≥ lg): Professional 5-Row Bento Grid Layout   ── */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {isDefaultBento ? (
          <div className="hidden lg:block space-y-4">
            {/* Row 1: 4 Cards (01 Business Portfolio, 02 CRM, 03 ERP, 04 Billing & POS) */}
            <div className="grid grid-cols-4 gap-4">
              {row1.map((sol) => (
                <BentoServiceCard
                  key={sol.id}
                  sol={sol}
                  onOpenModal={setActiveModalSolution}
                />
              ))}
            </div>

            {/* Row 2: 3 Cards (Wider Showcase: 05 E-Commerce, 06 Digital Marketing, 07 School ERP) */}
            <div className="grid grid-cols-3 gap-4">
              {row2.map((sol) => (
                <BentoServiceCard
                  key={sol.id}
                  sol={sol}
                  onOpenModal={setActiveModalSolution}
                  isWide
                />
              ))}
            </div>

            {/* Row 3: 4 Cards (08 Inventory, 09 SCM, 10 Transport Logistics, 11 Hotel Management) */}
            <div className="grid grid-cols-4 gap-4">
              {row3.map((sol) => (
                <BentoServiceCard
                  key={sol.id}
                  sol={sol}
                  onOpenModal={setActiveModalSolution}
                />
              ))}
            </div>

            {/* Row 4: 3 Cards (Wider Showcase: 12 Student Management, 13 LMS, 14 Gym & Fitness Club) */}
            <div className="grid grid-cols-3 gap-4">
              {row4.map((sol) => (
                <BentoServiceCard
                  key={sol.id}
                  sol={sol}
                  onOpenModal={setActiveModalSolution}
                  isWide
                />
              ))}
            </div>

            {/* Row 5: 4 Cards (15 Expense Management, 16 Chit Fund, 17 Appointment Booking, 18 API & Cloud) */}
            <div className="grid grid-cols-4 gap-4">
              {row5.map((sol) => (
                <BentoServiceCard
                  key={sol.id}
                  sol={sol}
                  onOpenModal={setActiveModalSolution}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Filtered or Searched Desktop Grid */
          <div className="hidden lg:block">
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
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
                  >
                    <BentoServiceCard
                      sol={sol}
                      onOpenModal={setActiveModalSolution}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* ── 2. TABLET VIEW (sm to lg): Balanced Multi-Column Grid           ── */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        <div className="hidden sm:block lg:hidden">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredSolutions.map((sol) => (
              <BentoServiceCard
                key={`tablet-${sol.id}`}
                sol={sol}
                onOpenModal={setActiveModalSolution}
              />
            ))}
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* ── 3. MOBILE VIEW (< sm): Hotstar-Styled Categorized Rails          ── */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        <div className="block sm:hidden space-y-8">
          {MOBILE_CATEGORIES.map((sec) => {
            const items = SOLUTIONS_DATA.filter((s) => sec.ids.includes(s.id));
            if (items.length === 0) return null;

            return (
              <InteractiveMobileRail
                key={sec.title}
                sec={sec}
                solutions={items}
                onOpenModal={setActiveModalSolution}
              />
            );
          })}
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
              className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/15 cursor-pointer"
            >
              Clear Search & Filters
            </button>
          </div>
        )}
      </div>

      {/* ── Interactive Deep-Dive Details Modal ── */}
      <SolutionDetailModal
        solution={activeModalSolution}
        onClose={() => setActiveModalSolution(null)}
      />
    </section>
  );
}
