import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { preloadRoute } from '@/utils/preload';

interface CoursesMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const COURSES_COLUMN_1 = [
  { id: 'programming-languages', name: 'Programming Languages' },
  { id: 'web-development', name: 'Web Development' },
  { id: 'mobile-app-development', name: 'Mobile App Development' },
  { id: 'ai-ml', name: 'AI & Machine Learning' },
  { id: 'data-science-analytics', name: 'Data Science & Analytics' },
  { id: 'cloud-devops', name: 'Cloud & DevOps' },
];

export const COURSES_COLUMN_2 = [
  { id: 'cybersecurity-networking', name: 'Cybersecurity & Networking' },
  { id: 'database-technologies', name: 'Database Technologies' },
  { id: 'software-engineering-testing', name: 'Software Engineering & Testing' },
  { id: 'ui-ux-product-design', name: 'UI/UX & Product Design' },
  { id: 'interview-career-prep', name: 'Interview & Career Prep' },
];

export const COURSES_FEATURED_ITEM = {
  id: 'projects-internships',
  name: 'Projects & Internships'
};

export default function CoursesMegaMenu({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave
}: CoursesMegaMenuProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div
      id="courses-mega-menu"
      role="menu"
      aria-label="Courses Mega Menu"
      className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 animate-in fade-in zoom-in-95 duration-200 pointer-events-auto"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Mega Menu Container matching reference image (Black Left + Dark Charcoal Right in Blue Theme) */}
      <div className="w-[880px] max-w-[96vw] rounded-2xl overflow-hidden border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col md:flex-row text-white">
        
        {/* ── LEFT PANEL: Pitch Black with Giant Blue Title, Tagline & Pill Button ── */}
        <div className="w-full md:w-[320px] bg-black p-8 sm:p-10 flex flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r border-white/10 text-left">
          <div>
            {/* Giant Title in Signature Blue Theme with Coming Soon Pill */}
            <div className="flex items-center gap-2.5 mb-3">
              <h2 
                className="text-[28px] sm:text-[36px] font-bold text-[#0066FF] tracking-tight font-heading"
              >
                Courses
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0066FF]/20 text-[#38BDF8] border border-[#0066FF]/40">
                Coming Soon
              </span>
            </div>

            {/* Subtitle / Description */}
            <p className="text-sm text-slate-300 leading-relaxed font-normal font-sans">
              Master production code and industry skills with structured engineering curricula launching soon.
            </p>
          </div>

          {/* Liquid Blobs Menu Button: Go to Courses */}
          <div className="pt-8">
            <button
              onClick={() => {
                onClose();
                navigate('/courses');
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
              Course Categories
            </div>

            {/* 2-Column Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              
              {/* Column 1 */}
              <div className="space-y-3">
                {COURSES_COLUMN_1.map((item) => (
                  <Link
                    key={item.id}
                    to="/courses"
                    onClick={onClose}
                    onMouseEnter={() => preloadRoute('/courses')}
                    className="block text-slate-200 hover:text-[#38BDF8] text-sm font-medium transition-colors cursor-pointer py-0.5"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Column 2 */}
              <div className="space-y-3">
                {COURSES_COLUMN_2.map((item) => (
                  <Link
                    key={item.id}
                    to="/courses"
                    onClick={onClose}
                    onMouseEnter={() => preloadRoute('/courses')}
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
                  to="/courses"
                  onClick={onClose}
                  onMouseEnter={() => preloadRoute('/courses')}
                  className="block text-white font-bold text-sm hover:text-[#38BDF8] transition-colors cursor-pointer py-0.5"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {COURSES_FEATURED_ITEM.name}
                </Link>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
