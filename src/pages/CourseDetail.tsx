import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  Layers,
  GraduationCap,
  Sparkles,
  Award,
  FileCheck2,
  Rocket,
  ShieldCheck,
  Code2,
  Users,
  Check
} from 'lucide-react';
import SEO from '@/components/seo/SEO';
import { useTheme } from '@/context/ThemeContext';
import { getCourseById, ATIDETO_12_CATEGORY_GROUPS, CourseData } from '@/components/academy/CoursesExplorer';
import { toast } from 'sonner';
import StepperRegistrationModal from '@/components/registration/StepperRegistrationModal';

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Find requested course or fallback to first course
  const currentCourse: CourseData =
    (courseId ? getCourseById(courseId) : undefined) ||
    ATIDETO_12_CATEGORY_GROUPS[0].courses[0];

  // Accordion state for Curriculum modules
  const [openModuleIdx, setOpenModuleIdx] = useState<number>(0);
  
  // Accordion state for FAQ questions
  const [openFaqIdx, setOpenFaqIdx] = useState<number>(0);

  // Enrollment modal state
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [enrollForm, setEnrollForm] = useState({ name: '', email: '', phone: '', experience: 'Beginner' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [courseId]);

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollForm.name || !enrollForm.email) {
      toast.error('Please enter your name and email address.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsEnrollModalOpen(false);
      toast.success(`Application received for ${currentCourse.title}! An admissions advisor will contact you within 24 hours.`);
      setEnrollForm({ name: '', email: '', phone: '', experience: 'Beginner' });
    }, 800);
  };

  // FAQ data tailored for courses
  const courseFaqs = [
    {
      q: `Who is this ${currentCourse.title} course designed for?`,
      a: `This course is designed for aspiring software engineers, computer science students, and working developers looking to master production-level ${currentCourse.skills[0] || 'engineering'} practices. No prior commercial experience is required for Beginner tracks; Intermediate & Advanced tracks assume familiarity with basic coding syntax.`
    },
    {
      q: 'Will I receive a verified certificate upon completion?',
      a: 'Yes. Upon passing the module quizzes and successfully submitting the final Capstone Project, you receive an official, cryptographically verifiable Atideto Academy Certificate of Completion with your unique verification code.'
    },
    {
      q: 'How does the Capstone Project work?',
      a: `You will build "${currentCourse.capstoneProject.title}", solving real-world architecture problems. Your codebase will be reviewed by senior engineers against production standards: code cleanliness, git version control, performance, and deployment readiness.`
    },
    {
      q: 'Are live mentor sessions and doubt resolution included?',
      a: 'Yes. All enrolled students get direct access to our private Discord/Slack community and scheduled 1-on-1 code reviews with experienced industry mentors.'
    },
    {
      q: 'What is the weekly time commitment required?',
      a: `We recommend 6 to 10 hours per week over the ${currentCourse.duration} duration to absorb lectures, complete quizzes, and work on the hands-on engineering assignments.`
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 overflow-x-hidden ${
      isLight ? 'bg-[#FAF9F5] text-zinc-900' : 'bg-[#06080E] text-white'
    }`}>
      <SEO
        title={`${currentCourse.title} | Atideto Courses`}
        description={currentCourse.shortDesc}
        url={`https://atideto.in/courses/${currentCourse.id}`}
        keywords={`${currentCourse.title}, ${currentCourse.category}, learn ${currentCourse.technologies.join(', ')}, atideto courses`}
      />

      {/* ── 1. HERO SECTION (Simple, Clean, Matching Solutions Detail Page) ── */}
      <section className="relative pt-32 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
        {/* Ambient Top Glow */}
        <div
          aria-hidden
          className="absolute top-10 right-10 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-20 bg-[#0066FF]"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
            <ChevronRight size={12} />
            <span className="text-slate-400">{currentCourse.category}</span>
            <ChevronRight size={12} />
            <span className="text-[#2EA8FF] font-bold">{currentCourse.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Eyebrow + Title + Subtitle + Metadata + Buttons */}
            <div className="lg:col-span-7 text-left">
              


              {/* Big Title (Max 44px Desktop, 32px Mobile, Weight 700, Line-Height 1.15) */}
              <h1
                className="text-[32px] sm:text-[38px] lg:text-[44px] font-bold tracking-tight leading-[1.15] mb-6 text-white font-heading"
              >
                {currentCourse.title}
              </h1>

              {/* Tagline / Subtitle */}
              <p 
                className={`text-base sm:text-lg leading-relaxed mb-8 max-w-xl font-normal ${
                  isLight ? 'text-zinc-600' : 'text-slate-300'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {currentCourse.description}
              </p>

              {/* Quick Metadata Stats Strip */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pb-8 text-xs font-mono text-slate-300">
                <div className="inline-flex items-center gap-2">
                  <Clock size={14} className="text-[#38BDF8]" />
                  <span>{currentCourse.duration}</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <Layers size={14} className="text-[#38BDF8]" />
                  <span>{currentCourse.level} Level</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <GraduationCap size={14} className="text-emerald-400" />
                  <span>{currentCourse.modulesCount} Modules · {currentCourse.lessonsCount} Lessons</span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-amber-300">
                  <span>★</span>
                  <span>{currentCourse.rating} ({currentCourse.reviewsCount}+ reviews)</span>
                </div>
              </div>

              {/* Action Buttons: Creatlydev Button for Enroll + Secondary Button */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(true)}
                  className="creatly-btn py-3 px-6 text-sm"
                >
                  <span>Apply for Admission</span>
                  <span className="button__icon-wrapper">
                    <svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="button__icon-svg" width="10">
                      <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"></path>
                    </svg>
                    <svg viewBox="0 0 14 15" fill="none" width="10" xmlns="http://www.w3.org/2000/svg" className="button__icon-svg button__icon-svg--copy">
                      <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"></path>
                    </svg>
                  </span>
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('course-curriculum');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer ${
                    isLight
                      ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <span>View Curriculum</span>
                  <ChevronDown size={14} />
                </button>
              </div>

            </div>

            {/* Right Column: Stylized 3D / Course Visual Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className={`relative w-full max-w-md p-6 sm:p-8 rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 ${
                isLight
                  ? 'bg-white border-zinc-200/80 shadow-zinc-200/50'
                  : 'bg-[#0B0F19]/90 border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.6)]'
              }`}>
                {/* Visual Image */}
                <div className="relative group overflow-hidden rounded-2xl mb-6 bg-zinc-900 aspect-video flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#0066FF]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  <img
                    src={currentCourse.image}
                    alt={currentCourse.title}
                    className="relative z-10 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                  <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 text-xs font-mono text-white">
                    <Sparkles size={14} className="text-[#38BDF8]" />
                    <span>Production Grade Curriculum</span>
                  </div>
                </div>

                {/* Sub-badge details */}
                <div className="space-y-3 pt-2 border-t border-zinc-200/60 dark:border-white/10 text-left">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Total Modules:</span>
                    <span className="font-mono font-bold text-white">{currentCourse.modulesCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Total Lessons:</span>
                    <span className="font-mono font-bold text-white">{currentCourse.lessonsCount} Lessons</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Quizzes &amp; Tests:</span>
                    <span className="font-mono font-bold text-white">{currentCourse.quizzesCount} Quizzes</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Certification:</span>
                    <span className="font-mono font-bold text-emerald-400">Verified Certificate Included</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 2. FULL DETAILS: SKILLS & TECHNOLOGIES STACK ── */}
      <section className={`py-12 border-t ${isLight ? 'border-zinc-200/80 bg-zinc-50/50' : 'border-white/10 bg-[#080C14]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Skills Learned */}
            <div>
              <h3 className="text-xs font-bold font-mono tracking-widest uppercase text-[#38BDF8] mb-3">
                KEY COMPETENCIES GAINED
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentCourse.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-slate-200 font-medium"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div>
              <h3 className="text-xs font-bold font-mono tracking-widest uppercase text-[#38BDF8] mb-3">
                TECHNOLOGIES &amp; TOOLS MASTERED
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentCourse.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-[#0066FF]/10 border border-[#0066FF]/30 text-xs text-white font-mono font-semibold"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. CURRICULUM MODULES BREAKDOWN: 2-Column Editorial Grid ── */}
      <section id="course-curriculum" className="py-20 lg:py-24 border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Column: Sticky Section Overview & Milestones Tracker */}
            <div className="lg:col-span-5 text-left lg:sticky lg:top-24 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="w-5 h-[2px] bg-[#0066FF]" />
                  <span
                    className="text-xs font-bold tracking-[0.25em] text-[#2EA8FF] uppercase font-mono"
                  >
                    WEEK-BY-WEEK BLUEPRINT
                  </span>
                </div>
                
                <h2 
                  className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight leading-[1.2] font-heading"
                >
                  Curriculum Architecture
                </h2>

                <p className="text-sm sm:text-base text-slate-400 mt-4 leading-relaxed font-normal">
                  Every module includes video breakdowns, interactive coding labs, diagnostic assessments, and mentor-reviewed engineering assignments.
                </p>
              </div>

              {/* Quick Specs Card */}
              <div className="p-6 rounded-2xl bg-[#0B0F19] border border-white/10 space-y-4">
                <div className="flex items-center justify-between text-xs pb-3 border-b border-white/[0.06]">
                  <span className="text-slate-400">Total Duration:</span>
                  <span className="font-mono font-bold text-white">{currentCourse.duration}</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-3 border-b border-white/[0.06]">
                  <span className="text-slate-400">Experience Track:</span>
                  <span className="font-mono font-bold text-[#38BDF8]">{currentCourse.level} Level</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-3 border-b border-white/[0.06]">
                  <span className="text-slate-400">Active Syllabus:</span>
                  <span className="font-mono font-bold text-white">{currentCourse.modulesCount} Modules · {currentCourse.lessonsCount} Lessons</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Credential Issued:</span>
                  <span className="font-mono font-bold text-emerald-400">Verifiable Certificate</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(true)}
                  className="creatly-btn py-3 px-6 text-sm"
                >
                  <span>Apply for Admission</span>
                  <span className="button__icon-wrapper">
                    <svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="button__icon-svg" width="10">
                      <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"></path>
                    </svg>
                    <svg viewBox="0 0 14 15" fill="none" width="10" xmlns="http://www.w3.org/2000/svg" className="button__icon-svg button__icon-svg--copy">
                      <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            {/* Right Column: Interactive Week-by-Week Accordion */}
            <div className="lg:col-span-7 space-y-4">
              {currentCourse.curriculum.map((mod, idx) => {
                const isOpen = openModuleIdx === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? 'bg-[#0B101D] border-[#0066FF]/40 shadow-lg'
                        : 'bg-[#080C16] border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Header */}
                    <button
                      type="button"
                      onClick={() => setOpenModuleIdx(isOpen ? -1 : idx)}
                      className="w-full p-5 sm:p-6 flex items-center justify-between text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/10 text-[#38BDF8]">
                          {mod.week}
                        </span>
                        <h3 className="text-[18px] sm:text-[20px] font-semibold text-white tracking-tight font-heading">
                          {mod.title}
                        </h3>
                      </div>
                      <div className="p-1 rounded-full bg-white/[0.05] text-slate-400 shrink-0">
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>

                    {/* Body Content */}
                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-white/[0.06] space-y-4 text-xs">
                        {/* Lessons list */}
                        <div>
                          <h4 className="font-mono text-[11px] uppercase tracking-wider text-slate-400 mb-2">
                            Lessons Included:
                          </h4>
                          <ul className="space-y-2 text-slate-200">
                            {mod.lessons.map((lesson, lIdx) => (
                              <li key={lIdx} className="flex items-center gap-2.5">
                                <CheckCircle2 size={13} className="text-[#38BDF8] shrink-0" />
                                <span>{lesson}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Quiz & Assignment */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          {mod.quiz && (
                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-2.5 text-amber-300">
                              <CheckCircle2 size={14} className="shrink-0" />
                              <span><strong>Quiz:</strong> {mod.quiz}</span>
                            </div>
                          )}
                          {mod.assignment && (
                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-2.5 text-[#38BDF8]">
                              <FileCheck2 size={14} className="shrink-0" />
                              <span><strong>Assignment:</strong> {mod.assignment}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* ── 4. CAPSTONE PROJECT & INDUSTRY EVALUATION (Full 7XL Split) ── */}
      <section className={`py-20 lg:py-24 border-t ${isLight ? 'border-zinc-200/80 bg-zinc-50' : 'border-white/10 bg-[#070A12]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          
          <div className="rounded-3xl border border-white/10 bg-[#0A0F1D] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#0066FF]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Side: Capstone details */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-[2px] bg-emerald-400" />
                  <span className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-400">
                    PORTFOLIO PRODUCTION CAPSTONE
                  </span>
                </div>

                <h3 
                  className="text-[24px] sm:text-[28px] font-semibold text-white tracking-tight leading-[1.25] font-heading"
                >
                  {currentCourse.capstoneProject.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl pt-1">
                  {currentCourse.capstoneProject.deliverable}
                </p>

                <div className="pt-6 flex flex-wrap items-center gap-6 text-xs font-mono text-slate-300">
                  <span className="inline-flex items-center gap-2 text-white">
                    <Award size={16} className="text-amber-400" />
                    Verified Certificate
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="inline-flex items-center gap-2 text-white">
                    <Code2 size={16} className="text-[#38BDF8]" />
                    GitHub Portfolio Ready
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="inline-flex items-center gap-2 text-white">
                    <Users size={16} className="text-emerald-400" />
                    Senior Engineer Code Review
                  </span>
                </div>
              </div>

              {/* Right Side: Evaluation Rubric Card */}
              <div className="lg:col-span-4 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3.5">
                <div className="text-xs font-mono font-bold text-white uppercase tracking-wider pb-2 border-b border-white/[0.06]">
                  Production Review Rubric
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>Clean Code & Modular Patterns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>Unit & Integration Test Coverage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>Live Cloud Deployment Verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>Production Architecture Review</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ── 5. FREQUENTLY ASKED QUESTIONS (2-Column Split Grid) ── */}
      <section className="py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left border-t border-white/[0.08]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Heading and Support Guidance */}
          <div className="lg:col-span-5 text-left space-y-4">
            <div className="inline-flex items-center gap-2">
              <span className="w-5 h-[2px] bg-[#0066FF]" />
              <span className="text-xs font-bold font-mono tracking-widest uppercase text-[#38BDF8]">
                FREQUENTLY ASKED QUESTIONS
              </span>
            </div>

            <h2 
              className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight leading-[1.2] font-heading"
            >
              Have Questions? We Have Answers.
            </h2>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Explore track specifics, live doubts resolution, verified certification standards, and how our admission process works.
            </p>

            <div className="p-6 rounded-2xl bg-[#090D18] border border-white/10 space-y-3 mt-6">
              <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Need personalized guidance?
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect with an admissions advisor to discuss track fit, career goals, and customized scheduling.
              </p>
              <Link
                to="/client-connect"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#38BDF8] hover:text-white transition-colors pt-1"
              >
                <span>Talk with an advisor</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>

          {/* Right Column: FAQ Accordion */}
          <div className="lg:col-span-7 space-y-3">
            {courseFaqs.map((faq, i) => {
              const isOpen = openFaqIdx === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-[#080C16] overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? -1 : i)}
                    className="w-full p-5 sm:p-6 flex items-center justify-between text-left cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-semibold text-white pr-4 font-heading">
                      {faq.q}
                    </span>
                    <div className="p-1 rounded-full bg-white/[0.05] text-slate-400 shrink-0">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.05]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 6. CAREER ACCELERATOR BANNER (Clean, Left-Aligned Editorial Card) ── */}
      <section className="py-20 lg:py-24 border-t border-white/10 bg-[#04060A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          
          <div className="relative rounded-3xl border border-[#0066FF]/30 bg-gradient-to-r from-[#0052FF]/15 via-[#0066FF]/25 to-[#38BDF8]/15 p-8 sm:p-14 overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#0066FF]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#38BDF8]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl flex flex-col items-start text-left">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#38BDF8] block mb-3">
                ACCELERATE YOUR ENGINEERING CAREER
              </span>
              <h2 
                className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight mb-4 leading-[1.2] font-heading"
              >
                Ready to master {currentCourse.title}?
              </h2>
              <p 
                className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mb-8 font-normal"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Join hundreds of ambitious developers who have learned industry-standard software engineering with Atideto Academy.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(true)}
                  className="creatly-btn py-3.5 px-8 text-sm"
                >
                  <span>Apply for Admission</span>
                  <span className="button__icon-wrapper">
                    <svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="button__icon-svg" width="10">
                      <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"></path>
                    </svg>
                    <svg viewBox="0 0 14 15" fill="none" width="10" xmlns="http://www.w3.org/2000/svg" className="button__icon-svg button__icon-svg--copy">
                      <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"></path>
                    </svg>
                  </span>
                </button>

                <Link
                  to="/courses"
                  className="px-6 py-3.5 rounded-full border border-white/20 text-white hover:bg-white/10 text-xs font-semibold transition-colors"
                >
                  Browse All Courses
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 4-STEPPER COURSE REGISTRATION MODAL ── */}
      <StepperRegistrationModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        initialProgramId={currentCourse.id}
        initialProgramTitle={currentCourse.title}
        initialType="Course"
      />
    </div>
  );
}
