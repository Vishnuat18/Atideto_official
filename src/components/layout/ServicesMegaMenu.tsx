import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { preloadRoute } from '@/utils/preload';
import { CATEGORIZED_SERVICES } from '@/constants/categorizedServices';

interface ServicesMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

// 7 Core Service Categories split into 2 columns matching layout
export const SERVICES_COLUMN_1 = [
  { id: 'ai-automation', name: 'AI & Automation' },
  { id: 'business-systems', name: 'Business Systems' },
  { id: 'app-development', name: 'App Development' },
  { id: 'digital-marketing', name: 'Digital Marketing' },
];

export const SERVICES_COLUMN_2 = [
  { id: 'website-development', name: 'Website Development' },
  { id: 'custom-software-development', name: 'Custom Software Development' },
  { id: 'ui-ux-design', name: 'UI/UX & Product Design' },
];

export const SERVICES_FEATURED_ITEM = {
  id: 'all-services',
  name: 'All Solutions & Systems ↗',
  href: '/services'
};

export default function ServicesMegaMenu({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave
}: ServicesMegaMenuProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div
      id="services-mega-menu"
      role="menu"
      aria-label="Services Mega Menu"
      className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 animate-in fade-in zoom-in-95 duration-200 pointer-events-auto"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* ── Mega Menu Container matching Courses design (Black Left + Dark Charcoal Right in Blue Theme) ── */}
      <div className="w-[880px] max-w-[96vw] rounded-2xl overflow-hidden border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col md:flex-row text-white">
        
        {/* ── LEFT PANEL: Pitch Black with Giant Blue Title, Tagline & Pill Button ── */}
        <div className="w-full md:w-[320px] bg-black p-8 sm:p-10 flex flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r border-white/10 text-left">
          <div>
            <h2 
              className="text-[28px] sm:text-[36px] font-bold text-[#0066FF] tracking-tight mb-4 font-heading"
            >
              Services
            </h2>

            {/* Subtitle / Description */}
            <p className="text-sm text-slate-300 leading-relaxed font-normal font-sans">
              High-performance digital products engineered for operational efficiency, security, and measurable growth.
            </p>
          </div>

          {/* Liquid Blobs Menu Button: Go to Services */}
          <div className="pt-8">
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/services');
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

        {/* ── RIGHT PANEL: Charcoal Contrast with 2-Column Categories Grid (ONLY CATEGORIES) ── */}
        <div className="flex-1 bg-[#161B26] p-8 sm:p-10 flex flex-col justify-between text-left">
          <div>
            {/* Section Header */}
            <div 
              className="text-slate-400 font-semibold text-sm mb-6 tracking-wide"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Service Categories
            </div>

            {/* 2-Column Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              
              {/* Column 1 */}
              <div className="space-y-3">
                {SERVICES_COLUMN_1.map((item) => (
                  <Link
                    key={item.id}
                    to={`/services/${item.id}`}
                    onClick={onClose}
                    onMouseEnter={() => preloadRoute(`/services/${item.id}`)}
                    className="block text-slate-200 hover:text-[#38BDF8] text-sm font-medium transition-colors cursor-pointer py-0.5"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Column 2 */}
              <div className="space-y-3">
                {SERVICES_COLUMN_2.map((item) => (
                  <Link
                    key={item.id}
                    to={`/services/${item.id}`}
                    onClick={onClose}
                    onMouseEnter={() => preloadRoute(`/services/${item.id}`)}
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
                  to={SERVICES_FEATURED_ITEM.href}
                  onClick={onClose}
                  onMouseEnter={() => preloadRoute(SERVICES_FEATURED_ITEM.href)}
                  className="block text-white font-bold text-sm hover:text-[#38BDF8] transition-colors cursor-pointer py-0.5"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {SERVICES_FEATURED_ITEM.name}
                </Link>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
