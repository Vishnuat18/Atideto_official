import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, Clock, Sparkles, Users, 
  Code2, ArrowRight, Check, Shield, ChevronDown,
  Copy, AlertCircle, Loader2
} from 'lucide-react';
import { INTERNSHIP_PROGRAMS, INTERNSHIP_CATEGORIES } from '@/constants';
import { Link } from 'react-router-dom';
import atidetoLogo from '@/assets/atideto-logo.png';

// Backend API base URL. In development Vite proxies /api → localhost:5000, so an
// empty string works. In production set VITE_API_URL to the deployed API origin,
// e.g. https://api.atideto.in (no trailing slash).
const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';

// Helper date functions
function getFormattedToday(): string {
  return new Date().toISOString().split('T')[0];
}

function calculateEndDate(startIsoStr: string, daysStr: string): string {
  if (!startIsoStr) return '';
  const d = new Date(startIsoStr);
  const days = parseInt(daysStr, 10) || 30;
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// --- Subcomponent for Visual ---
const DeepMindVisual = ({ icon }: { icon: string }) => {
  return (
    <div className="relative flex items-center justify-center p-2 lg:p-4">
      <motion.div 
        animate={{ y: [-15, 15, -15] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        <img 
          src={icon} 
          alt="Internship Logo" 
          className="w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain drop-shadow-[0_20px_30px_rgba(47,47,228,0.2)] hover:drop-shadow-[0_20px_40px_rgba(47,47,228,0.35)] transition-all duration-300" 
        />
      </motion.div>
    </div>
  );
};

export default function InternshipExplorer() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeId, setActiveId] = useState(INTERNSHIP_PROGRAMS[0].id);
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applyStep, setApplyStep] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedDocId, setSubmittedDocId] = useState<string>('');
  const [copiedId, setCopiedId] = useState(false);

  const [applyForm, setApplyForm] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    college: '',
    registerNo: '',
    degree: 'B.Tech',
    stream: 'Computer Science & Engineering',
    graduationYear: '2026',
    selectedCourse: '',
    startDate: getFormattedToday(),
    endDate: calculateEndDate(getFormattedToday(), '30'),
    duration: '30',
    reportIncluded: false,
    paymentOption: 'Pay Now'
  });

  const filteredPrograms = activeCategory === 'All' 
    ? INTERNSHIP_PROGRAMS 
    : INTERNSHIP_PROGRAMS.filter(p => p.category === activeCategory);

  const activeProgram = INTERNSHIP_PROGRAMS.find(p => p.id === activeId) || INTERNSHIP_PROGRAMS[0];
  const activeProgramLevel = (activeProgram as { level?: string }).level || 'Beginner to Advanced';
  const activeProgramDescription = activeProgram.description || `Build job-ready ${activeProgram.title.toLowerCase()} skills through guided practice, live mentorship, and portfolio-focused internship tasks.`;
  const selectedProgramIndex = filteredPrograms.findIndex((prog) => prog.id === activeId);
  const programFocus = activeProgram.skills.slice(0, 3).join(' + ');
  const programPath = [
    { step: '01', title: 'Foundation', detail: `Core concepts in ${activeProgram.skills[0] || activeProgram.category}` },
    { step: '02', title: 'Build Sprint', detail: `Hands-on tasks with ${activeProgram.skills[1] || 'industry tools'}` },
    { step: '03', title: 'Portfolio Proof', detail: 'Final project, review, and verified certificate' }
  ];
  const programOutcomes = [
    { icon: Code2, title: 'Live Project Work', detail: 'Build usable modules instead of only watching lessons.' },
    { icon: Users, title: 'Mentor Review', detail: 'Get practical feedback on code, design, and delivery.' },
    { icon: Award, title: 'Verified Certificate', detail: 'Completion proof aligned with your selected domain.' }
  ];

  const handleOpenApplication = () => {
    setApplyForm(prev => ({
      ...prev,
      selectedCourse: activeProgram.title,
      startDate: prev.startDate || getFormattedToday(),
      endDate: prev.endDate || calculateEndDate(prev.startDate || getFormattedToday(), prev.duration)
    }));
    setIsApplying(true);
    setApplyStep(0);
    setSubmitError(null);
    setSubmittedDocId('');
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      programId: activeProgram.id,
      programTitle: applyForm.selectedCourse || activeProgram.title,
      name: applyForm.name.trim(),
      email: applyForm.email.trim(),
      phone: applyForm.phone.trim(),
      countryCode: applyForm.countryCode,
      college: applyForm.college.trim(),
      registerNo: applyForm.registerNo.trim(),
      degree: applyForm.degree,
      stream: applyForm.stream.trim(),
      graduationYear: applyForm.graduationYear,
      selectedCourse: applyForm.selectedCourse || activeProgram.title,
      startDate: applyForm.startDate,
      endDate: applyForm.endDate || calculateEndDate(applyForm.startDate, applyForm.duration),
      duration: applyForm.duration,
      reportIncluded: applyForm.reportIncluded,
      paymentOption: applyForm.paymentOption,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/internships/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmittedDocId(data.data.applicationId);
        setApplyStep(4);
      } else {
        setSubmitError(data.message || 'Unable to submit application. Please try again.');
      }
    } catch (err) {
      console.warn('Application submission error:', err);
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full relative z-10 text-[#0F172A] font-sans">
      
      {/* 1. Category Filters */}
      <div className={`mb-7 ${showMobileDetails ? 'hidden lg:block' : 'block'}`}>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {INTERNSHIP_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setShowMobileDetails(false);
              }}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 border ${
                activeCategory === cat
                  ? 'bg-[#2F2FE4] text-white shadow-[0_0_20px_rgba(47,47,228,0.25)] border-[#2F2FE4]'
                  : 'bg-[#F8FAFC] text-[#475569] border-[#CBD5E1] hover:border-[#2F2FE4] hover:text-[#2F2FE4]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Split Layout (Explorer) */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,370px)_1fr] gap-6 lg:gap-8 mb-24 items-start">
        
        {/* Left Panel (Program Cards List) */}
        <div className={`w-full flex flex-col h-auto overflow-hidden ${showMobileDetails ? 'hidden lg:flex' : 'flex'}`}>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[#E2E8F0] bg-white p-1.5 shadow-sm">
                <img src={atidetoLogo} alt="ATIDETO" className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#2F2FE4]">Choose Track</p>
                <h2 className="text-xl font-bold leading-tight text-[#0F172A]">Internship paths</h2>
              </div>
            </div>
            <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 text-xs font-bold text-[#475569]">
              {filteredPrograms.length} shown
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-col gap-3 relative overflow-y-auto custom-scrollbar pr-1 pb-4 lg:max-h-[760px]">
            {filteredPrograms.map((prog) => {
              const isActive = prog.id === activeId;
              return (
                <div
                  key={prog.id}
                  onClick={() => {
                    setActiveId(prog.id);
                    setShowMobileDetails(true);
                  }}
                  style={{ minHeight: 76 }}
                  className={`w-full p-3.5 rounded-2xl cursor-pointer transition-all duration-300 border relative overflow-hidden group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#2F2FE4]/20 via-[#2F2FE4]/10 to-transparent border-[#2F2FE4] shadow-[0_0_25px_rgba(47,47,228,0.12)]'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F3F4F6]'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2F2FE4]" />
                  )}
                  <div className="flex min-h-12 items-center gap-3">
                    <div
                      className="grid shrink-0 place-items-center rounded-xl border border-[#E2E8F0] bg-white"
                      style={{ width: 46, height: 46 }}
                    >
                      <img src={prog.icon} alt={prog.title} className="h-8 w-8 object-contain" />
                    </div>
                    <div className="min-w-0 flex-1 py-0.5">
                      <h3 className="font-bold text-[13px] leading-snug text-[#0F172A] group-hover:text-[#2F2FE4] transition-colors">
                        {prog.title}
                      </h3>
                      <p className="text-[#475569] text-[11px] leading-none mt-1.5 font-semibold">
                        {prog.duration} &bull; {prog.category}
                      </p>
                    </div>
                    <ArrowRight className={`h-4 w-4 shrink-0 transition-all ${isActive ? 'text-[#2F2FE4]' : 'text-[#94A3B8] group-hover:text-[#2F2FE4]'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel (Program Details OR Application Form) */}
        <div className={`w-full flex flex-col ${!showMobileDetails ? 'hidden lg:flex' : 'flex'}`}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={isApplying ? `applying-${applyStep}` : activeId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="bg-white border border-[#E2E8F0] backdrop-blur-xl rounded-3xl p-5 sm:p-6 lg:p-7 flex flex-col shadow-2xl relative overflow-hidden"
            >
              
              {/* Back to Programs list button on Mobile */}
              <button 
                onClick={() => {
                  setShowMobileDetails(false);
                  setIsApplying(false);
                }}
                className="lg:hidden mb-4 flex items-center gap-2 text-xs text-[#2F2FE4] font-semibold"
              >
                Back to all internships
              </button>

              {!isApplying ? (
                <>
                  {/* Internship Detail Overview Header */}
                  <div className="space-y-6">
                    <div className="grid gap-5 border-b border-[#E2E8F0] pb-6 xl:grid-cols-[1fr_210px] xl:items-center">
                      <div>
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-2 rounded-full border border-[#2F2FE4]/30 bg-[#2F2FE4]/10 px-3 py-1">
                            <img src={atidetoLogo} alt="ATIDETO" className="h-4 w-4 object-contain" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#2F2FE4]">ATIDETO Academy</span>
                          </span>
                          <span className="text-[11px] uppercase font-semibold tracking-[0.18em] text-[#2F2FE4] bg-[#2F2FE4]/10 px-3 py-1 rounded-full border border-[#2F2FE4]/30">
                            {activeProgram.category}
                          </span>
                          <span className="text-[11px] uppercase font-bold tracking-[0.14em] text-[#64748B]">
                            Track {selectedProgramIndex + 1 > 0 ? String(selectedProgramIndex + 1).padStart(2, '0') : '01'}
                          </span>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]">
                            <img src={activeProgram.icon} alt="" className="h-11 w-11 object-contain" />
                          </div>
                          <div>
                            <h2 className="text-2xl lg:text-4xl font-extrabold leading-tight text-[#0F172A]">
                              {activeProgram.title}
                            </h2>
                            <p className="mt-3 max-w-2xl text-sm md:text-base leading-relaxed text-[#334155]">
                              {activeProgramDescription}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                        <DeepMindVisual icon={activeProgram.icon} />
                        <div className="mt-1 rounded-xl border border-[#E2E8F0] bg-white p-3 text-center">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">Focus Stack</p>
                          <p className="mt-1 text-sm font-semibold text-[#0F172A]">{programFocus || activeProgram.category}</p>
                        </div>
                      </div>
                    </div>

                    {/* Program Highlights */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-[#F8FAFC] border border-[#EEF2F7] rounded-2xl p-4">
                        <Clock className="mb-3 h-5 w-5 text-[#2F2FE4]" />
                        <span className="text-[10px] text-[#64748B] font-semibold uppercase tracking-[0.14em] block mb-1">Duration</span>
                        <span className="text-[#0F172A] font-semibold text-sm sm:text-base">{activeProgram.duration}</span>
                      </div>
                      <div className="bg-[#F8FAFC] border border-[#EEF2F7] rounded-2xl p-4">
                        <Sparkles className="mb-3 h-5 w-5 text-[#2F2FE4]" />
                        <span className="text-[10px] text-[#64748B] font-semibold uppercase tracking-[0.14em] block mb-1">Skill Level</span>
                        <span className="text-[#0F172A] font-semibold text-sm sm:text-base">{activeProgramLevel}</span>
                      </div>
                      <div className="bg-[#F8FAFC] border border-[#EEF2F7] rounded-2xl p-4">
                        <Shield className="mb-3 h-5 w-5 text-[#2F2FE4]" />
                        <span className="text-[10px] text-[#64748B] font-semibold uppercase tracking-[0.14em] block mb-1">Certificate</span>
                        <span className="text-[#2F2FE4] font-semibold text-sm sm:text-base">ATIDETO Verified</span>
                      </div>
                      <div className="bg-[#F8FAFC] border border-[#EEF2F7] rounded-2xl p-4">
                        <Users className="mb-3 h-5 w-5 text-[#2F2FE4]" />
                        <span className="text-[10px] text-[#64748B] font-semibold uppercase tracking-[0.14em] block mb-1">Mode</span>
                        <span className="text-[#0F172A] font-semibold text-sm sm:text-base">Live Mentorship</span>
                      </div>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
                      <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                        <div className="mb-4 flex items-center justify-between gap-4">
                          <h3 className="text-base font-bold text-[#0F172A]">What you will practice</h3>
                          <span className="text-xs font-semibold text-[#64748B]">{activeProgram.skills.length} skills</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {activeProgram.skills.map((skill) => (
                            <span key={skill} className="rounded-full border border-[#2F2FE4]/25 bg-[#2F2FE4]/10 px-3 py-1.5 text-xs font-semibold text-[#2F2FE4]">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                        <h3 className="mb-4 text-base font-bold text-[#0F172A]">Learning path</h3>
                        <div className="space-y-3">
                          {programPath.map((item) => (
                            <div key={item.step} className="grid grid-cols-[36px_1fr] gap-3">
                              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#2F2FE4] text-xs font-bold text-white">{item.step}</span>
                              <div>
                                <p className="text-sm font-semibold text-[#0F172A]">{item.title}</p>
                                <p className="text-xs leading-relaxed text-[#64748B]">{item.detail}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      {programOutcomes.map((item) => (
                        <div key={item.title} className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
                          <item.icon className="mb-3 h-5 w-5 text-[#2F2FE4]" />
                          <h4 className="text-sm font-semibold text-[#0F172A]">{item.title}</h4>
                          <p className="mt-1 text-xs leading-relaxed text-[#64748B]">{item.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Apply Now Action */}
                  <div className="mt-6 flex flex-col gap-4 border-t border-[#E2E8F0] pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#0F172A]">Ready to start this track?</p>
                      <p className="text-xs text-[#64748B]">Your application opens with this program pre-selected.</p>
                    </div>
                    <button 
                      onClick={handleOpenApplication}
                      className="flex items-center justify-center gap-2 px-8 py-4 bg-[#2F2FE4] hover:bg-[#4F46E5] text-white font-bold rounded-full transition-all shadow-[0_0_25px_rgba(47,47,228,0.25)] text-base cursor-pointer hover:scale-[1.02]"
                    >
                      Apply Now <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                /* ============================================================
                   APPLICATION FORM (Clean, Navigatable, Aligned Dropdowns)
                   ============================================================ */
                <div className="h-full flex flex-col">
                  
                  {/* Header & Cancel */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E2E8F0]">
                    <div>
                      <button 
                        onClick={() => {
                          setIsApplying(false);
                          setApplyStep(0);
                        }}
                        className="mb-2 text-xs text-[#2F2FE4] hover:underline cursor-pointer font-semibold block"
                      >
                        Cancel Application
                      </button>
                      <h2 className="text-xl md:text-2xl font-black text-[#0F172A]">
                        {applyStep === 0 && "Personal Information"}
                        {applyStep === 1 && "Academic & Certificate Info"}
                        {applyStep === 2 && "Course Selection & Schedule"}
                        {applyStep === 3 && "Summary Review & Payment"}
                        {applyStep === 4 && "Application Registered!"}
                      </h2>
                      <p className="text-[#475569] text-xs mt-0.5">
                        Applying for: <strong className="text-[#2F2FE4] font-semibold">{applyForm.selectedCourse || activeProgram.title}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Navigatable Step Indicator Buttons */}
                  {applyStep < 4 && (
                    <div className="w-full mb-6">
                      <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold mb-3">
                        <button
                          type="button"
                          onClick={() => setApplyStep(0)}
                          className={`py-2.5 px-3 rounded-xl border transition-all cursor-pointer ${
                            applyStep === 0 
                              ? 'bg-[#2F2FE4]/20 border-[#2F2FE4] text-[#2F2FE4] shadow-[0_0_12px_rgba(47,47,228,0.2)]' 
                              : applyStep > 0 
                              ? 'bg-[#F1F5F9] border-[#E2E8F0] text-emerald-600 hover:bg-[#EEF2F7]' 
                              : 'bg-transparent border-[#EEF2F7] text-[#64748B] hover:text-[#334155]'
                          }`}
                        >
                          Personal
                        </button>
                        <button
                          type="button"
                          onClick={() => setApplyStep(1)}
                          className={`py-2.5 px-3 rounded-xl border transition-all cursor-pointer ${
                            applyStep === 1 
                              ? 'bg-[#2F2FE4]/20 border-[#2F2FE4] text-[#2F2FE4] shadow-[0_0_12px_rgba(47,47,228,0.2)]' 
                              : applyStep > 1 
                              ? 'bg-[#F1F5F9] border-[#E2E8F0] text-emerald-600 hover:bg-[#EEF2F7]' 
                              : 'bg-transparent border-[#EEF2F7] text-[#64748B] hover:text-[#334155]'
                          }`}
                        >
                          Academic
                        </button>
                        <button
                          type="button"
                          onClick={() => setApplyStep(2)}
                          className={`py-2.5 px-3 rounded-xl border transition-all cursor-pointer ${
                            applyStep === 2 || applyStep === 3 
                              ? 'bg-[#2F2FE4]/20 border-[#2F2FE4] text-[#2F2FE4] shadow-[0_0_12px_rgba(47,47,228,0.2)]' 
                              : 'bg-transparent border-[#EEF2F7] text-[#64748B] hover:text-[#334155]'
                          }`}
                        >
                          Schedule
                        </button>
                      </div>
                      <div className="w-full bg-[#F1F5F9] rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-[#2F2FE4] to-[#2F2FE4] h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${((Math.min(applyStep, 2) + 1) / 3) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 1: Personal Information */}
                  {applyStep === 0 && (
                    <div className="space-y-5 flex-1 animate-fadeIn">
                      <div className="bg-[#F8FAFC] border border-[#2F2FE4]/20 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#2F2FE4]/10 flex items-center justify-center border border-[#2F2FE4]/30 shrink-0">
                          <Users className="w-5 h-5 text-[#2F2FE4]" />
                        </div>
                        <div>
                          <h4 className="text-[#0F172A] font-bold text-sm">Personal & Contact Information</h4>
                          <p className="text-[#475569] text-xs">Data used for marketing updates, communication & certificate name</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Full Name */}
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-[#334155]">Full Name (As on Certificate)</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Arun Kumar" 
                            value={applyForm.name}
                            onChange={(e) => setApplyForm({...applyForm, name: e.target.value})}
                            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2F2FE4] rounded-xl px-4 py-3 text-[#0F172A] text-base focus:outline-none transition-all placeholder:text-[#94A3B8]"
                            autoFocus
                          />
                        </div>

                        {/* Gmail / Email */}
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-[#334155]">Gmail / Email Address</label>
                          <input 
                            type="email" 
                            placeholder="e.g. arun.kumar@gmail.com" 
                            value={applyForm.email}
                            onChange={(e) => setApplyForm({...applyForm, email: e.target.value})}
                            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2F2FE4] rounded-xl px-4 py-3 text-[#0F172A] text-base focus:outline-none transition-all placeholder:text-[#94A3B8]"
                          />
                        </div>

                        {/* Phone Number with Aligned Dropdown Arrow */}
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-[#334155]">Phone Number (WhatsApp updates)</label>
                          <div className="flex gap-2">
                            <div className="relative shrink-0">
                              <select
                                value={applyForm.countryCode}
                                onChange={(e) => setApplyForm({...applyForm, countryCode: e.target.value})}
                                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-3 pr-8 py-3 text-[#0F172A] text-base focus:outline-none focus:border-[#2F2FE4] cursor-pointer appearance-none"
                              >
                                <option value="+91" className="bg-white text-[#0F172A]">+91 (IN)</option>
                                <option value="+1" className="bg-white text-[#0F172A]">+1 (US)</option>
                                <option value="+44" className="bg-white text-[#0F172A]">+44 (UK)</option>
                                <option value="+971" className="bg-white text-[#0F172A]">+971 (UAE)</option>
                              </select>
                              <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                            <input 
                              type="tel" 
                              placeholder="98765 43210" 
                              value={applyForm.phone}
                              onChange={(e) => setApplyForm({...applyForm, phone: e.target.value})}
                              className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2F2FE4] rounded-xl px-4 py-3 text-[#0F172A] text-base focus:outline-none transition-all placeholder:text-[#94A3B8]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-6 border-t border-[#E2E8F0] mt-6">
                        <button 
                          type="button"
                          onClick={() => setIsApplying(false)}
                          className="px-6 py-3 rounded-full border border-[#CBD5E1] text-[#334155] font-semibold text-sm hover:bg-[#F1F5F9] transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button 
                          type="button"
                          disabled={!applyForm.name || !applyForm.email || !applyForm.phone}
                          onClick={() => setApplyStep(1)}
                          className="px-8 py-3 rounded-full bg-[#2F2FE4] hover:bg-[#4F46E5] text-white font-bold text-sm transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-[0_0_20px_rgba(47,47,228,0.2)]"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Academic Details */}
                  {applyStep === 1 && (
                    <div className="space-y-5 flex-1 animate-fadeIn">
                      <div className="bg-[#F8FAFC] border border-[#2F2FE4]/20 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#2F2FE4]/10 flex items-center justify-center border border-[#2F2FE4]/30 shrink-0">
                          <Award className="w-5 h-5 text-[#2F2FE4]" />
                        </div>
                        <div>
                          <h4 className="text-[#0F172A] font-bold text-sm">Academic & Certificate Information</h4>
                          <p className="text-[#475569] text-xs">Essential data printed on your official ATIDETO completion certificate</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* College Name */}
                        <div className="flex flex-col space-y-1.5 sm:col-span-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-[#334155]">College / University Name</label>
                          <input 
                            list="collegesList"
                            type="text" 
                            placeholder="e.g. Anna University" 
                            value={applyForm.college}
                            onChange={(e) => setApplyForm({...applyForm, college: e.target.value})}
                            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2F2FE4] rounded-xl px-4 py-3 text-[#0F172A] text-base focus:outline-none transition-all placeholder:text-[#94A3B8]"
                            autoFocus
                          />
                          <datalist id="collegesList">
                            <option value="Anna University" />
                            <option value="IIT Madras" />
                            <option value="NIT Trichy" />
                            <option value="SRM Institute of Science and Technology" />
                            <option value="VIT Vellore" />
                            <option value="PSG College of Technology" />
                            <option value="SASTRA University" />
                            <option value="Government College of Engineering" />
                          </datalist>
                        </div>

                        {/* Register Number */}
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-[#334155]">Register Number / Roll No.</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 710022104001" 
                            value={applyForm.registerNo}
                            onChange={(e) => setApplyForm({...applyForm, registerNo: e.target.value})}
                            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2F2FE4] rounded-xl px-4 py-3 text-[#0F172A] text-base focus:outline-none transition-all placeholder:text-[#94A3B8]"
                          />
                        </div>

                        {/* Year of Graduation with Aligned Dropdown Arrow */}
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-[#334155]">Year of Graduation</label>
                          <div className="relative">
                            <select
                              value={applyForm.graduationYear}
                              onChange={(e) => setApplyForm({...applyForm, graduationYear: e.target.value})}
                              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2F2FE4] rounded-xl pl-4 pr-10 py-3 text-[#0F172A] text-base focus:outline-none cursor-pointer appearance-none"
                            >
                              <option value="2024" className="bg-white text-[#0F172A]">2024</option>
                              <option value="2025" className="bg-white text-[#0F172A]">2025</option>
                              <option value="2026" className="bg-white text-[#0F172A]">2026</option>
                              <option value="2027" className="bg-white text-[#0F172A]">2027</option>
                              <option value="2028" className="bg-white text-[#0F172A]">2028</option>
                              <option value="2029" className="bg-white text-[#0F172A]">2029</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        {/* Degree Name with Aligned Dropdown Arrow */}
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-[#334155]">Degree Name</label>
                          <div className="relative">
                            <select
                              value={applyForm.degree}
                              onChange={(e) => setApplyForm({...applyForm, degree: e.target.value})}
                              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2F2FE4] rounded-xl pl-4 pr-10 py-3 text-[#0F172A] text-base focus:outline-none cursor-pointer appearance-none"
                            >
                              <option value="B.Tech" className="bg-white text-[#0F172A]">B.Tech</option>
                              <option value="B.E" className="bg-white text-[#0F172A]">B.E</option>
                              <option value="B.Sc" className="bg-white text-[#0F172A]">B.Sc</option>
                              <option value="BCA" className="bg-white text-[#0F172A]">BCA</option>
                              <option value="M.Tech" className="bg-white text-[#0F172A]">M.Tech</option>
                              <option value="MCA" className="bg-white text-[#0F172A]">MCA</option>
                              <option value="Other" className="bg-white text-[#0F172A]">Other</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        {/* Department / Stream */}
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-[#334155]">Department / Stream</label>
                          <input 
                            list="streamList"
                            type="text"
                            placeholder="e.g. Computer Science & Engineering"
                            value={applyForm.stream}
                            onChange={(e) => setApplyForm({...applyForm, stream: e.target.value})}
                            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2F2FE4] rounded-xl px-4 py-3 text-[#0F172A] text-base focus:outline-none transition-all placeholder:text-[#94A3B8]"
                          />
                          <datalist id="streamList">
                            <option value="Computer Science & Engineering" />
                            <option value="Information Technology" />
                            <option value="Artificial Intelligence & Data Science" />
                            <option value="Electronics & Communication Engineering" />
                            <option value="Electrical & Electronics Engineering" />
                            <option value="Mechanical Engineering" />
                            <option value="Civil Engineering" />
                          </datalist>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-6 border-t border-[#E2E8F0] mt-6">
                        <button 
                          type="button"
                          onClick={() => setApplyStep(0)}
                          className="px-6 py-3 rounded-full border border-[#CBD5E1] text-[#334155] font-semibold text-sm hover:bg-[#F1F5F9] transition-all cursor-pointer"
                        >
                          Back
                        </button>
                        <button 
                          type="button"
                          disabled={!applyForm.college || !applyForm.registerNo}
                          onClick={() => setApplyStep(2)}
                          className="px-8 py-3 rounded-full bg-[#2F2FE4] hover:bg-[#4F46E5] text-white font-bold text-sm transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-[0_0_20px_rgba(47,47,228,0.2)]"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Course Selection & Schedule */}
                  {applyStep === 2 && (
                    <div className="space-y-5 flex-1 animate-fadeIn">
                      <div className="bg-[#F8FAFC] border border-[#2F2FE4]/20 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#2F2FE4]/10 flex items-center justify-center border border-[#2F2FE4]/30 shrink-0">
                          <Sparkles className="w-5 h-5 text-[#2F2FE4]" />
                        </div>
                        <div>
                          <h4 className="text-[#0F172A] font-bold text-sm">Course Domain & Internship Dates</h4>
                          <p className="text-[#475569] text-xs">Verify your selected course and set your start & completion dates</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Course Selection (Auto-selected with Aligned Dropdown Arrow) */}
                        <div className="flex flex-col space-y-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#2F2FE4]">Selected Course / Domain</label>
                            <span className="text-[11px] bg-[#2F2FE4]/20 text-[#2F2FE4] border border-[#2F2FE4]/40 px-2.5 py-0.5 rounded-full font-semibold">
                              ✓ Auto-selected
                            </span>
                          </div>
                          <div className="relative">
                            <select
                              value={applyForm.selectedCourse || activeProgram.title}
                              onChange={(e) => setApplyForm({...applyForm, selectedCourse: e.target.value})}
                              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2F2FE4] rounded-xl pl-4 pr-10 py-3 text-[#0F172A] font-bold text-base focus:outline-none cursor-pointer appearance-none"
                            >
                              {INTERNSHIP_PROGRAMS.map(prog => (
                                <option key={prog.id} value={prog.title} className="bg-white text-[#0F172A]">
                                  {prog.title} ({prog.category})
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#2F2FE4] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* From Date (Start Date) */}
                          <div className="flex flex-col space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#334155]">From Date (Start Date)</label>
                            <input 
                              type="date" 
                              value={applyForm.startDate}
                              onChange={(e) => {
                                const newStart = e.target.value;
                                const newEnd = calculateEndDate(newStart, applyForm.duration);
                                setApplyForm({...applyForm, startDate: newStart, endDate: newEnd});
                              }}
                              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2F2FE4] rounded-xl px-4 py-3 text-[#0F172A] text-base focus:outline-none cursor-pointer scheme-light"
                            />
                          </div>

                          {/* Duration with Aligned Dropdown Arrow */}
                          <div className="flex flex-col space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#334155]">Duration</label>
                            <div className="relative">
                              <select
                                value={applyForm.duration}
                                onChange={(e) => {
                                  const newDur = e.target.value;
                                  const newEnd = calculateEndDate(applyForm.startDate, newDur);
                                  setApplyForm({...applyForm, duration: newDur, endDate: newEnd});
                                }}
                                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2F2FE4] rounded-xl pl-4 pr-10 py-3 text-[#0F172A] text-base focus:outline-none cursor-pointer appearance-none"
                              >
                                <option value="7" className="bg-white text-[#0F172A]">7 Days (₹500)</option>
                                <option value="15" className="bg-white text-[#0F172A]">15 Days (₹1,000)</option>
                                <option value="30" className="bg-white text-[#0F172A]">1 Month / 30 Days (₹2,000)</option>
                                <option value="60" className="bg-white text-[#0F172A]">2 Months (₹4,000)</option>
                                <option value="90" className="bg-white text-[#0F172A]">3 Months (₹6,000)</option>
                                <option value="180" className="bg-white text-[#0F172A]">6 Months (₹12,000)</option>
                              </select>
                              <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </div>

                          {/* To Date (End Date) */}
                          <div className="flex flex-col space-y-1.5 sm:col-span-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#334155]">To Date (Completion Date)</label>
                            <input 
                              type="date" 
                              value={applyForm.endDate || calculateEndDate(applyForm.startDate, applyForm.duration)}
                              onChange={(e) => setApplyForm({...applyForm, endDate: e.target.value})}
                              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2F2FE4] rounded-xl px-4 py-3 text-[#0F172A] text-base focus:outline-none cursor-pointer scheme-light"
                            />
                          </div>
                        </div>

                        {/* Report Addon */}
                        <div className="flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 mt-2">
                          <input 
                            type="checkbox" 
                            id="reportAddon"
                            checked={applyForm.reportIncluded}
                            onChange={(e) => setApplyForm({...applyForm, reportIncluded: e.target.checked})}
                            className="w-4 h-4 rounded cursor-pointer accent-[#2F2FE4]"
                          />
                          <label htmlFor="reportAddon" className="text-xs text-[#334155] cursor-pointer flex-1">
                            Include Official Project & Internship Documentation Report (+ ₹200)
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-6 border-t border-[#E2E8F0] mt-6">
                        <button 
                          type="button"
                          onClick={() => setApplyStep(1)}
                          className="px-6 py-3 rounded-full border border-[#CBD5E1] text-[#334155] font-semibold text-sm hover:bg-[#F1F5F9] transition-all cursor-pointer"
                        >
                          Back
                        </button>
                        <button 
                          type="button"
                          disabled={!applyForm.startDate}
                          onClick={() => setApplyStep(3)}
                          className="px-8 py-3 rounded-full bg-[#2F2FE4] hover:bg-[#4F46E5] text-white font-bold text-sm transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-[0_0_20px_rgba(47,47,228,0.2)]"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Summary Review & Payment Schedule */}
                  {applyStep === 3 && (
                    <div className="space-y-5 flex-1 animate-fadeIn">
                      <h3 className="text-base md:text-lg font-bold text-[#0F172A] mb-2">Review Summary & Confirmation</h3>

                      {/* Summary Card */}
                      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 space-y-3 text-xs">
                        <div className="flex items-start justify-between pb-2.5 border-b border-[#E2E8F0]">
                          <div>
                            <span className="text-[#2F2FE4] font-bold block text-sm">{applyForm.name}</span>
                            <span className="text-[#475569]">{applyForm.email} &bull; {applyForm.countryCode}{applyForm.phone}</span>
                          </div>
                          <span className="bg-[#EEF2F7] text-[#334155] px-2 py-0.5 rounded text-[10px] uppercase font-bold">Personal</span>
                        </div>

                        <div className="flex items-start justify-between pb-2.5 border-b border-[#E2E8F0]">
                          <div>
                            <span className="text-[#0F172A] font-semibold block">{applyForm.college}</span>
                            <span className="text-[#475569]">Reg No: <strong className="text-[#0F172A]">{applyForm.registerNo}</strong> | {applyForm.degree} ({applyForm.stream}) | Batch {applyForm.graduationYear}</span>
                          </div>
                          <span className="bg-[#EEF2F7] text-[#334155] px-2 py-0.5 rounded text-[10px] uppercase font-bold">Academic</span>
                        </div>

                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[#2F2FE4] font-bold block text-sm">{applyForm.selectedCourse || activeProgram.title}</span>
                            <span className="text-[#475569]">Schedule: <strong className="text-[#0F172A]">{applyForm.startDate}</strong> to <strong className="text-[#0F172A]">{applyForm.endDate || calculateEndDate(applyForm.startDate, applyForm.duration)}</strong> ({applyForm.duration} Days)</span>
                          </div>
                          <span className="bg-[#EEF2F7] text-[#334155] px-2 py-0.5 rounded text-[10px] uppercase font-bold">Domain</span>
                        </div>
                      </div>

                      {/* Payment Schedule Selector */}
                      <div className="space-y-2 pt-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#334155] block">Select Payment Schedule</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { id: 'Pay Now', title: 'Pay Now', desc: 'Secure early-bird spot & immediate dashboard access.' },
                            { id: 'Pay Later', title: 'Pay Later', desc: 'Pay upon internship completion before certificate unlock.' }
                          ].map((opt) => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setApplyForm({...applyForm, paymentOption: opt.id})}
                              className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                                applyForm.paymentOption === opt.id
                                  ? 'bg-[#2F2FE4]/15 border-[#2F2FE4] text-[#2F2FE4] shadow-[0_0_15px_rgba(47,47,228,0.12)]'
                                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#475569] hover:border-[#CBD5E1]'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-xs text-[#0F172A]">{opt.title}</span>
                                {applyForm.paymentOption === opt.id && <span className="w-2.5 h-2.5 rounded-full bg-[#2F2FE4]"></span>}
                              </div>
                              <p className="text-[11px] text-[#64748B] leading-snug">{opt.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {submitError && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-red-600 mb-4">
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                          <span className="flex-1">{submitError}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-6 border-t border-[#E2E8F0] mt-6">
                        <button 
                          type="button"
                          onClick={() => setApplyStep(2)}
                          disabled={isSubmitting}
                          className="px-6 py-3 rounded-full border border-[#CBD5E1] text-[#334155] font-semibold text-sm hover:bg-[#F1F5F9] transition-all cursor-pointer disabled:opacity-40"
                        >
                          Back
                        </button>
                        <button 
                          type="button"
                          disabled={isSubmitting}
                          onClick={handleSubmitApplication}
                          className="px-8 py-3 rounded-full bg-gradient-to-r from-[#2F2FE4] to-[#4F46E5] text-white font-bold text-sm shadow-[0_0_25px_rgba(47,47,228,0.25)] transition-all cursor-pointer hover:scale-[1.02] flex items-center gap-2 disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                              Submitting...
                            </>
                          ) : (
                            'Submit Application'
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: Success Response & Confirmation Receipt */}
                  {applyStep === 4 && (
                    <div className="space-y-6 flex-1 text-center animate-fadeIn py-4 flex flex-col items-center custom-scrollbar overflow-y-auto">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#2F2FE4] to-[#4F46E5] flex items-center justify-center shadow-[0_0_25px_rgba(47,47,228,0.3)] mb-2">
                        <Check className="w-8 h-8 text-white animate-pulse" strokeWidth={3} />
                      </div>

                      <div className="space-y-1">
                        <span className="inline-block bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full mb-1">
                          ✓ Sent to Certificate System
                        </span>
                        <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">Application Registered Successfully!</h2>
                        <p className="text-[#475569] text-xs max-w-md leading-relaxed">
                          Thank you <strong className="text-[#0F172A]">{applyForm.name}</strong>! Your internship details for <strong className="text-[#2F2FE4]">{applyForm.selectedCourse || activeProgram.title}</strong> have been saved and forwarded to the ATIDETO Certificate Management System.
                        </p>
                        <p className="text-[#059669] text-xs max-w-md leading-relaxed">
                          A confirmation email has been sent to <strong className="text-[#0F172A]">{applyForm.email}</strong>.
                        </p>
                      </div>

                      {/* Application Reference ID Box */}
                      {submittedDocId && (
                        <div className="bg-[#F8FAFC] border border-[#2F2FE4]/40 rounded-xl p-3 flex items-center justify-between gap-3 w-full max-w-md">
                          <div className="text-left">
                            <span className="text-[10px] uppercase font-bold text-[#64748B] block">Application Reference ID</span>
                            <span className="text-xs font-mono font-bold text-[#2F2FE4]">{submittedDocId}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(submittedDocId);
                              setCopiedId(true);
                              setTimeout(() => setCopiedId(false), 2000);
                            }}
                            className="flex items-center gap-1 text-[11px] bg-[#EEF2F7] hover:bg-[#E2E8F0] text-[#0F172A] px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                          >
                            {copiedId ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-[#475569]" /> Copy ID
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Submitted Response Details Card */}
                      <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 space-y-3 text-left max-w-md text-xs">
                        <h4 className="text-[#0F172A] font-bold text-xs uppercase tracking-wider pb-2 border-b border-[#E2E8F0] text-center text-[#2F2FE4]">
                          Submitted Response Summary
                        </h4>

                        <div className="flex justify-between items-center pb-2 border-b border-[#E2E8F0]">
                          <span className="text-[#64748B] uppercase font-semibold text-[10px]">Student Name</span>
                          <span className="text-[#0F172A] font-bold">{applyForm.name}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-[#E2E8F0]">
                          <span className="text-[#64748B] uppercase font-semibold text-[10px]">Email</span>
                          <span className="text-[#334155] font-medium">{applyForm.email}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-[#E2E8F0]">
                          <span className="text-[#64748B] uppercase font-semibold text-[10px]">Phone</span>
                          <span className="text-[#334155] font-medium">{applyForm.countryCode}{applyForm.phone}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-[#E2E8F0]">
                          <span className="text-[#64748B] uppercase font-semibold text-[10px]">Register No.</span>
                          <span className="text-[#2F2FE4] font-mono font-bold">{applyForm.registerNo}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-[#E2E8F0]">
                          <span className="text-[#64748B] uppercase font-semibold text-[10px]">College</span>
                          <span className="text-[#0F172A] font-medium">{applyForm.college}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-[#E2E8F0]">
                          <span className="text-[#64748B] uppercase font-semibold text-[10px]">Degree & Stream</span>
                          <span className="text-[#334155] font-medium">{applyForm.degree} ({applyForm.stream})</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-[#E2E8F0]">
                          <span className="text-[#64748B] uppercase font-semibold text-[10px]">Graduation Year</span>
                          <span className="text-[#334155] font-medium">{applyForm.graduationYear}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-[#E2E8F0]">
                          <span className="text-[#64748B] uppercase font-semibold text-[10px]">Duration</span>
                          <span className="text-[#0F172A] font-medium">{applyForm.startDate} to {applyForm.endDate || calculateEndDate(applyForm.startDate, applyForm.duration)} ({applyForm.duration} Days)</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-[#E2E8F0]">
                          <span className="text-[#64748B] uppercase font-semibold text-[10px]">Payment Schedule</span>
                          <span className="text-[#334155] font-medium">{applyForm.paymentOption}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-[#64748B] uppercase font-semibold text-[10px]">Certificate Status</span>
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <Shield className="w-3.5 h-3.5 text-emerald-600" /> Certificate Ready on Completion
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-2">
                        <button 
                          onClick={() => {
                            setIsApplying(false);
                            setApplyStep(0);
                          }}
                          className="px-6 py-2.5 rounded-full border border-[#CBD5E1] text-[#0F172A] font-bold text-xs hover:bg-[#F1F5F9] transition-all cursor-pointer"
                        >
                          View Other Internships
                        </button>
                        <Link 
                          to="/dashboard"
                          className="px-8 py-2.5 rounded-full bg-[#2F2FE4] hover:bg-[#4F46E5] text-white font-bold text-xs transition-all shadow-[0_0_20px_rgba(47,47,228,0.2)] flex items-center justify-center gap-1.5"
                        >
                          Go to Dashboard
                        </Link>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Why Learn Section */}
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#0F172A] mb-12">Why Learn With Atideto Academy?</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { icon: Users, t: 'Industry Experts', d: 'Learn from professionals working in top companies.' },
            { icon: Code2, t: 'Hands-on Projects', d: 'Build real-world projects for your portfolio.' },
            { icon: Award, t: 'Certificate', d: 'Earn industry-recognized internship certificate.' },
            { icon: Clock, t: 'Flexible Learning', d: 'Live classes + recorded sessions for revision.' }
          ].map(feat => (
            <div key={feat.t} className="flex-1 min-w-[200px] flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mb-4 group-hover:bg-[#2F2FE4]/10 group-hover:border-[#2F2FE4]/30 transition-all group-hover:shadow-[0_0_20px_rgba(47,47,228,0.12)]">
                <feat.icon className="w-8 h-8 text-[#2F2FE4]" />
              </div>
              <h4 className="font-bold text-[15px] text-[#0F172A] mb-2">{feat.t}</h4>
              <p className="text-[12px] text-[#64748B] leading-relaxed max-w-[200px]">{feat.d}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
          display: none;
        }
        .custom-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
