import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, BookOpen, Clock, Award, Star, ArrowUpRight, 
  CheckCircle2, Sparkles, Filter, X, ChevronRight, ChevronLeft,
  ChevronDown, Layout, Code2, Cpu, Cloud,
  Smartphone, Database, ShieldCheck, Globe, Server, Rocket,
  FileCheck2, GraduationCap, ArrowRight, LucideIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { preloadRoute } from '@/utils/preload';
import sampleCourseImg from '@/assets/course_logos/image.png';
import StepperRegistrationModal from '@/components/registration/StepperRegistrationModal';

// Import full 111-course dataset across all 12 categories
import { 
  ATIDETO_12_CATEGORY_GROUPS, 
  getCourseById, 
  ALL_COURSES_LIST,
  type CourseData, 
  type CategoryGroup, 
  type CurriculumModule 
} from '@/constants/allCoursesData';

// Re-export for downstream components
export { 
  ATIDETO_12_CATEGORY_GROUPS, 
  getCourseById, 
  ALL_COURSES_LIST,
  type CourseData, 
  type CategoryGroup, 
  type CurriculumModule 
};

export default function CoursesExplorer() {
  const navigate = useNavigate();
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [activeCourseModal, setActiveCourseModal] = useState<CourseData | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'modules' | 'quizzes' | 'capstone'>('modules');

  // Enrollment Modal state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerCourse, setRegisterCourse] = useState<CourseData | null>(null);
  const [enrollForm, setEnrollForm] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isClickScrolling = useRef(false);

  // ScrollSpy on Window: Detects which category section is currently in view
  useEffect(() => {
    const handleWindowScroll = () => {
      if (isClickScrolling.current) return;
      const scrollPosition = window.scrollY + 120;

      for (let i = ATIDETO_12_CATEGORY_GROUPS.length - 1; i >= 0; i--) {
        const section = document.getElementById(`cat-section-${ATIDETO_12_CATEGORY_GROUPS[i].id}`);
        if (section) {
          const top = section.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top) {
            setActiveCategoryIdx(i);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, []);

  // Click on left category: smoothly scrolls the window directly to that category
  const handleCategoryClick = (idx: number, id: string) => {
    setActiveCategoryIdx(idx);
    isClickScrolling.current = true;
    const targetEl = document.getElementById(`cat-section-${id}`);
    if (targetEl) {
      const yOffset = -70; // offset for sticky search toolbar
      const y = targetEl.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
    setTimeout(() => {
      isClickScrolling.current = false;
    }, 700);
  };

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeCourseModal) {
      setRegisterCourse(activeCourseModal);
      setActiveCourseModal(null);
      setIsRegisterModalOpen(true);
    }
  };

  return (
    <div className="w-full relative">
      
      {/* ── Main Viewport: Left Sticky Panel + Right Free-Scrolling Courses Panel ── */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start w-full relative">
        
        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* ── LEFT PANEL: Sticky Categories Sidebar ── */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <aside className="w-full lg:w-[260px] shrink-0 lg:sticky lg:top-24 self-start text-left select-none z-10">
          
          {/* Header */}
          <div className="mb-3">
            <h3 className="text-[18px] font-bold text-white tracking-tight font-heading">
              Our Courses
            </h3>
          </div>

          {/* Clean list of all 12 categories: Icon + Name (No Scroll, perfectly fitted) */}
          <nav className="space-y-1" aria-label="Course Categories">
            {ATIDETO_12_CATEGORY_GROUPS.map((grp, idx) => {
              const isActive = activeCategoryIdx === idx;
              const GrpIcon = grp.icon;
              return (
                <button
                  key={grp.id}
                  type="button"
                  onClick={() => handleCategoryClick(idx, grp.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left group ${
                    isActive
                      ? 'bg-white/[0.08] text-white border border-white/15 shadow-[0_2px_12px_rgba(0,0,0,0.5)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? 'bg-[#0066FF] text-white shadow-[0_0_12px_rgba(0,102,255,0.4)]' : 'bg-white/[0.04] text-slate-400 group-hover:text-white group-hover:bg-white/[0.08]'
                  }`}>
                    <GrpIcon size={13} />
                  </div>
                  <span className="truncate">{grp.name}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* ── RIGHT PANEL: Free Window Scrolling Courses Grid ── */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <main className="flex-1 min-w-0 w-full space-y-16 text-left">
          
          {/* Top Filter & Search Bar */}
          <div className="relative z-10 bg-transparent pt-4 pb-4 mb-8 border-b border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Our Courses Subtitle */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
                <span className="text-sm font-bold tracking-wide uppercase text-white font-sans">
                  Our Courses
                </span>
              </div>
            </div>

            {/* Search Input & Level Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search across courses, skills, tech..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-white/30 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              <div className="relative w-full sm:w-auto">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full sm:w-auto appearance-none bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-slate-200 py-2 pl-3 pr-8 rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-[#080C17] text-white">All Levels</option>
                  <option value="Beginner" className="bg-[#080C17] text-white">Beginner</option>
                  <option value="Intermediate" className="bg-[#080C17] text-white">Intermediate</option>
                  <option value="Advanced" className="bg-[#080C17] text-white">Advanced</option>
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* ── ALL 12 COURSE CATEGORIES: Right Part Moves Freely ── */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          {ATIDETO_12_CATEGORY_GROUPS.map((categoryGroup) => {
            const IconComponent = categoryGroup.icon;

            // Apply query and level filters
            let visibleCourses = categoryGroup.courses;
            if (searchQuery.trim()) {
              const q = searchQuery.toLowerCase().trim();
              visibleCourses = visibleCourses.filter((c) =>
                c.title.toLowerCase().includes(q) ||
                c.shortDesc.toLowerCase().includes(q) ||
                c.subcategory.toLowerCase().includes(q) ||
                c.skills.some((s) => s.toLowerCase().includes(q))
              );
            }
            if (selectedLevel !== 'All') {
              visibleCourses = visibleCourses.filter((c) => c.level === selectedLevel);
            }

            if (visibleCourses.length === 0 && (searchQuery || selectedLevel !== 'All')) {
              return null;
            }

            return (
              <section 
                key={categoryGroup.id}
                id={`cat-section-${categoryGroup.id}`}
                className="scroll-mt-24 space-y-6 pt-2"
              >
                
                {/* Category Header with Icon attached directly to Title */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/[0.08]">
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className="w-8 h-8 rounded-lg bg-[#0066FF]/15 border border-[#0066FF]/30 flex items-center justify-center shrink-0">
                        <IconComponent size={18} className="text-[#38BDF8]" />
                      </div>
                      <h2 className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight leading-[1.2] font-heading">
                        {categoryGroup.name}
                      </h2>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-400 font-normal max-w-2xl font-sans">
                      {categoryGroup.description}
                    </p>
                  </div>
                </div>

                {/* Course Cards Grid: Top-to-Bottom order [Square Image -> Course Name -> Learn-More Button] */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {visibleCourses.map((course) => (
                    <div
                      key={course.id}
                      onClick={() => {
                        navigate(`/courses/${course.id}`);
                      }}
                      onMouseEnter={() => preloadRoute(`/courses/${course.id}`)}
                      className="group rounded-2xl bg-[#090D18] border border-white/10 hover:border-[#0066FF]/60 p-5 sm:p-6 flex flex-col items-start justify-between transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 cursor-pointer text-left min-h-[220px]"
                    >
                      {/* 1. Square Course Logo (No div or box wrapper, exact square size) */}
                      <img
                        src={sampleCourseImg}
                        alt={course.title}
                        className="w-14 h-14 sm:w-16 sm:h-16 aspect-square object-contain rounded-xl mb-4"
                        loading="lazy"
                      />

                      {/* 2. Course Name (Middle) */}
                      <h3 className="text-[20px] sm:text-[22px] font-semibold text-white group-hover:text-[#38BDF8] transition-colors leading-snug line-clamp-2 mb-5 w-full text-left font-heading">
                        {course.title}
                      </h3>

                      {/* 3. Button (Bottom, following top-to-bottom order with Uiverse learn-more button) */}
                      <button
                        type="button"
                        className="learn-more mt-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/courses/${course.id}`);
                        }}
                      >
                        <span className="circle" aria-hidden="true">
                          <span className="icon arrow"></span>
                        </span>
                        <span className="button-text">Explore Course</span>
                      </button>
                    </div>
                  ))}
                </div>

              </section>
            );
          })}

        </main>

      </div>

      {/* ── COURSE DETAIL MODAL (Quick Overview) ── */}
      <AnimatePresence>
        {activeCourseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#090D18] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-left max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveCourseModal(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.05] text-slate-400 hover:text-white transition"
              >
                <X size={16} />
              </button>

              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono tracking-widest text-[#38BDF8] uppercase font-bold">
                  {activeCourseModal.category}
                </span>
              </div>

              <h3 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight leading-[1.25] mb-3 font-heading">
                {activeCourseModal.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                {activeCourseModal.description}
              </p>

              {/* Course Key Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-6">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Level</div>
                  <div className="text-xs font-bold text-white mt-0.5">{activeCourseModal.level}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Duration</div>
                  <div className="text-xs font-bold text-white mt-0.5">{activeCourseModal.duration}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Curriculum</div>
                  <div className="text-xs font-bold text-white mt-0.5">{activeCourseModal.modulesCount} Modules • {activeCourseModal.lessonsCount} Lessons</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Capstone</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5">Verified Certificate</div>
                </div>
              </div>

              {/* Course Structure Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2 mb-4">
                <button
                  type="button"
                  onClick={() => setActiveModalTab('modules')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    activeModalTab === 'modules' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Modules & Lessons ({activeCourseModal.curriculum.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalTab('quizzes')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    activeModalTab === 'quizzes' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Quizzes & Assignments ({activeCourseModal.quizzesCount})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalTab('capstone')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    activeModalTab === 'capstone' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Capstone Project & Certificate
                </button>
              </div>

              {/* Tab 1: Modules & Lessons */}
              {activeModalTab === 'modules' && (
                <div className="space-y-3 mb-6">
                  {activeCourseModal.curriculum.map((mod, modIdx) => (
                    <div key={modIdx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
                        <span>Module {modIdx + 1}: {mod.title}</span>
                        <span className="text-[10px] font-mono text-slate-400">{mod.week}</span>
                      </div>
                      <div className="space-y-1">
                        {mod.lessons.map((lesson, lIdx) => (
                          <div key={lIdx} className="flex items-center gap-2 text-xs text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                            <span>Lesson {lIdx + 1}: {lesson}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Quizzes & Assignments */}
              {activeModalTab === 'quizzes' && (
                <div className="space-y-3 mb-6">
                  {activeCourseModal.curriculum.map((mod, modIdx) => (
                    <div key={modIdx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                      <div className="text-xs font-bold text-white">Module {modIdx + 1} Assessment</div>
                      {mod.quiz && (
                        <div className="flex items-center gap-2 text-xs text-amber-300">
                          <CheckCircle2 size={13} />
                          <span>Quiz: {mod.quiz}</span>
                        </div>
                      )}
                      {mod.assignment && (
                        <div className="flex items-center gap-2 text-xs text-[#38BDF8]">
                          <FileCheck2 size={13} />
                          <span>Assignment: {mod.assignment}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Capstone & Certificate */}
              {activeModalTab === 'capstone' && (
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] mb-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <Rocket size={16} className="text-emerald-400" />
                    <span>Capstone: {activeCourseModal.capstoneProject.title}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeCourseModal.capstoneProject.deliverable}
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-mono">
                    <GraduationCap size={15} />
                    <span>Includes Verified Atideto Academy Certificate of Completion upon passing final assessment.</span>
                  </div>
                </div>
              )}

              {/* Inquiry Form */}
              <form onSubmit={handleEnrollSubmit} className="pt-4 border-t border-white/[0.08] space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Apply for Admission or Syllabus Consultation
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={enrollForm.name}
                    onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })}
                    required
                    className="px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/30"
                  />
                  <input
                    type="email"
                    placeholder="Your Email Address"
                    value={enrollForm.email}
                    onChange={(e) => setEnrollForm({ ...enrollForm, email: e.target.value })}
                    required
                    className="px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/30"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveCourseModal(null)}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="creatly-btn py-2.5 px-5"
                  >
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Admission Inquiry'}</span>
                    <span className="button__icon-wrapper">
                      <svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="button__icon-svg" width="9">
                        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"></path>
                      </svg>
                      <svg viewBox="0 0 14 15" fill="none" width="9" xmlns="http://www.w3.org/2000/svg" className="button__icon-svg button__icon-svg--copy">
                        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"></path>
                      </svg>
                    </span>
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 4-STEPPER COURSE REGISTRATION MODAL ── */}
      <StepperRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        initialProgramId={registerCourse?.id}
        initialProgramTitle={registerCourse?.title}
        initialType="Course"
      />

    </div>
  );
}
