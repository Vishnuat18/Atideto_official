import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { preloadRoute } from '@/utils/preload';

interface UpskillMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

// 12 Official Upskill / Internship Programs from Atideto Website
export const UPSKILL_COLUMN_1 = [
  { id: 'fs-java', name: 'Full Stack Web Development (Java)' },
  { id: 'fs-mern', name: 'Full Stack Development (MERN Stack)' },
  { id: 'fs-mean', name: 'Full Stack Development (MEAN Stack)' },
  { id: 'web-dev', name: 'Web Development Internship' },
  { id: 'python', name: 'Python Internship' },
  { id: 'core-java', name: 'Core Java' },
];

export const UPSKILL_COLUMN_2 = [
  { id: 'data-science', name: 'Data Science Internship' },
  { id: 'digital-marketing', name: 'Digital Marketing Internship' },
  { id: 'app-dev', name: 'App Development Internship' },
  { id: 'cyber-security', name: 'Cyber Security Internship' },
  { id: 'cloud', name: 'Cloud & DevOps Internship' },
  { id: 'ui-ux', name: 'UI / UX Design Internship' },
];

export const UPSKILL_FEATURED_ITEM = {
  id: 'all-upskill',
  name: 'All 12 Upskill & Internship Programs ↗',
  href: '/upskill'
};

export default function UpskillMegaMenu({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave
}: UpskillMegaMenuProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div
      id="upskill-mega-menu"
      role="menu"
      aria-label="Upskill Mega Menu"
      className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 animate-in fade-in zoom-in-95 duration-200 pointer-events-auto"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* ── Mega Menu Container matching Courses & Services design ── */}
      <div className="w-[880px] max-w-[96vw] rounded-2xl overflow-hidden border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col md:flex-row text-white">
        
        {/* ── LEFT PANEL: Pitch Black with Giant Blue Title, Tagline & Pill Button ── */}
        <div className="w-full md:w-[320px] bg-black p-8 sm:p-10 flex flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r border-white/10 text-left">
          <div>
            <h2 
              className="text-[28px] sm:text-[36px] font-bold text-[#0066FF] tracking-tight mb-4 font-heading"
            >
              Upskill
            </h2>

            {/* Subtitle / Description */}
            <p className="text-sm text-slate-300 leading-relaxed font-normal font-sans">
              Accelerate your engineering career with live corporate projects, 1-on-1 mentorship, and accredited certifications.
            </p>
          </div>

          {/* Liquid Blobs Menu Button: Go to Upskill */}
          <div className="pt-8">
            <button
              onClick={() => {
                onClose();
                navigate('/upskill');
              }}
              className="menu-blob-btn"
            >
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span>Explore</span>
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL: Charcoal Contrast with 2-Column Links, Divider & Featured Item ── */}
        <div className="flex-1 bg-[#161B26] p-8 sm:p-10 flex flex-col justify-between text-left">
          <div>
            {/* Section Header */}
            <div 
              className="text-slate-400 font-semibold text-sm mb-6 tracking-wide"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Upskill & Internship Programs
            </div>

            {/* 2-Column Programs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              
              {/* Column 1 */}
              <div className="space-y-3">
                {UPSKILL_COLUMN_1.map((item) => (
                  <Link
                    key={item.id}
                    to={`/upskill/${item.id}`}
                    onClick={onClose}
                    onMouseEnter={() => preloadRoute(`/upskill/${item.id}`)}
                    className="block text-slate-200 hover:text-[#38BDF8] text-sm font-medium transition-colors cursor-pointer py-0.5"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Column 2 */}
              <div className="space-y-3">
                {UPSKILL_COLUMN_2.map((item) => (
                  <Link
                    key={item.id}
                    to={`/upskill/${item.id}`}
                    onClick={onClose}
                    onMouseEnter={() => preloadRoute(`/upskill/${item.id}`)}
                    className="block text-slate-200 hover:text-[#38BDF8] text-sm font-medium transition-colors cursor-pointer py-0.5"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Divider Line */}
                <div className="w-full h-px bg-white/10 my-2.5" />

                {/* Featured Highlighted Item */}
                <Link
                  to={UPSKILL_FEATURED_ITEM.href}
                  onClick={onClose}
                  onMouseEnter={() => preloadRoute(UPSKILL_FEATURED_ITEM.href)}
                  className="block text-white font-bold text-sm hover:text-[#38BDF8] transition-colors cursor-pointer py-0.5"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {UPSKILL_FEATURED_ITEM.name}
                </Link>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
