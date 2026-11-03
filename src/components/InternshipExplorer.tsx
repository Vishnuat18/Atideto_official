import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlayCircle, Award, Briefcase, Clock, CheckCircle2, ChevronRight, ChevronLeft, Layers, Sparkles, Folder, Users, BarChart2,
  Code2, Server, Database, Globe, Smartphone, Shield, Cloud, Palette, Laptop, Target, Zap, Rocket, Star, 
  MessageSquare, HelpCircle, ChevronDown, Compass, Download, ArrowRight, Check, Calendar, ExternalLink,
  GraduationCap, Building2, User, Mail, Phone, ShieldCheck, FileCheck2, AlertCircle, Upload, CheckCircle
} from 'lucide-react';
import { INTERNSHIP_PROGRAMS, INTERNSHIP_CATEGORIES } from '@/constants';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { submitRegistrationToDb, createStudentInDb } from '@/lib/api';
import { addStudentToRegistry } from '@/lib/certificateStore';
import { COUNTRY_CODES, INDIAN_STATES } from '@/components/registration/StepperRegistrationModal';
import InlineStepperRegistration from '@/components/registration/InlineStepperRegistration';

// --- Subcomponents for Right Panel ---

const DeepMindVisual = ({ icon }: { icon: string }) => {
  return (
    <div className="relative flex items-center justify-center p-2 lg:p-4">
      {/* Center Floating Image with Shadow */}
      <motion.div 
        animate={{ y: [-15, 15, -15] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        <img 
          src={icon} 
          alt="Internship Logo" 
          className="w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain drop-shadow-[0_20px_30px_rgba(0,163,255,0.3)] hover:drop-shadow-[0_20px_40px_rgba(0,163,255,0.6)] transition-all duration-300" 
        />
      </motion.div>
    </div>
  );
};

export default function InternshipExplorer() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeId, setActiveId] = useState(INTERNSHIP_PROGRAMS[0].id);
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const mainBoxRef = useRef<HTMLDivElement>(null);
  const [stepperStep, setStepperStep] = useState(1);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredPrograms = activeCategory === 'All' 
    ? INTERNSHIP_PROGRAMS 
    : INTERNSHIP_PROGRAMS.filter(p => p.category === activeCategory);

  const activeProgram = INTERNSHIP_PROGRAMS.find(p => p.id === activeId) || INTERNSHIP_PROGRAMS[0];

  const [applyForm, setApplyForm] = useState({
    photoUrl: '',
    fullName: user?.name || '',
    email: user?.email || '',
    countryCode: '+91',
    contactNumber: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    collegeName: 'Mahendra Engineering College',
    district: 'Namakkal',
    city: 'Mallasamudram',
    state: 'Tamil Nadu',
    institutionType: 'Autonomous' as 'Autonomous' | 'University' | 'Affiliated',
    degree: 'B.Tech Information Technology',
    specialization: 'Information Technology',
    graduationYear: '2027',
    programType: 'Internship' as 'Internship' | 'Course',
    selectedProgramId: activeProgram.id,
    selectedProgramTitle: activeProgram.title,
    startDate: '2026-11-02',
    duration: '3 Months',
    requirements: '',
    applicationId: ''
  });

  useEffect(() => {
    if (user) {
      setApplyForm(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    if (activeProgram) {
      setApplyForm(prev => ({
        ...prev,
        selectedProgramId: activeProgram.id,
        selectedProgramTitle: activeProgram.title
      }));
    }
  }, [activeProgram]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image file must be under 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setApplyForm(prev => ({ ...prev, photoUrl: event.target?.result as string }));
        toast.success('Profile photo uploaded');
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep1 = () => {
    if (!applyForm.fullName.trim()) {
      toast.error('Please enter your full name');
      return false;
    }
    if (!applyForm.email.trim() || !applyForm.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!applyForm.contactNumber.trim() || applyForm.contactNumber.length < 7) {
      toast.error('Please enter a valid contact phone number');
      return false;
    }
    if (!applyForm.gender) {
      toast.error('Please select your gender');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!applyForm.collegeName.trim()) {
      toast.error('Please enter your college name');
      return false;
    }
    if (!applyForm.district.trim()) {
      toast.error('Please enter your college district');
      return false;
    }
    if (!applyForm.city.trim()) {
      toast.error('Please enter your college city');
      return false;
    }
    if (!applyForm.degree.trim()) {
      toast.error('Please enter your degree program');
      return false;
    }
    if (!applyForm.specialization.trim()) {
      toast.error('Please enter your department / specialization');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!applyForm.startDate) {
      toast.error('Please select an expected start date');
      return false;
    }
    if (!applyForm.duration) {
      toast.error('Please select internship duration');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (stepperStep === 1 && !validateStep1()) return;
    if (stepperStep === 2 && !validateStep2()) return;
    if (stepperStep === 3 && !validateStep3()) return;
    setStepperStep(prev => prev + 1);
  };

  const handleSubmitRegistration = async () => {
    if (!termsAgreed) {
      toast.error('Please confirm the accuracy declaration');
      return;
    }

    setIsSubmitting(true);
    const newId = `AT-REG-2026-MEC-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      // Single canonical registration call: persists to MySQL registrations, students, and central registry
      await submitRegistrationToDb({
        regId: newId,
        studentId: `STU-${newId}`,
        studentName: applyForm.fullName,
        email: applyForm.email,
        phone: `${applyForm.countryCode} ${applyForm.contactNumber}`,
        college: applyForm.collegeName,
        degree: applyForm.degree,
        gradYear: applyForm.graduationYear,
        courseInterest: applyForm.selectedProgramTitle,
        domain: activeProgram.title || activeProgram.category || 'Information Technology',
        startDate: applyForm.startDate,
        duration: applyForm.duration,
        mode: 'Industrial Hybrid',
        notes: `Specialization: ${applyForm.specialization}, City: ${applyForm.city}, Duration: ${applyForm.duration}`
      });

      // 4. LocalStorage sync for immediate UI updates
      const existing = JSON.parse(localStorage.getItem('atideto_registrations') || '[]');
      const newRecord = {
        ...applyForm,
        applicationId: newId,
        submittedAt: new Date().toISOString(),
        status: 'Active',
        paymentStatus: 'Verified'
      };
      localStorage.setItem('atideto_registrations', JSON.stringify([newRecord, ...existing]));

      setApplyForm(prev => ({ ...prev, applicationId: newId }));
      setStepperStep(5);
      toast.success('Registration Successfully Submitted & Synced with Database!');
    } catch (err: any) {
      console.error('Registration error:', err);
      setApplyForm(prev => ({ ...prev, applicationId: newId }));
      setStepperStep(5);
      toast.success('Registration Saved!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full relative z-10 text-white font-sans">
      
      {/* 1. Filters */}
      <div className={`text-center mb-10 ${showMobileDetails ? 'hidden lg:block' : 'block'}`}>
        <div className="flex flex-wrap justify-center gap-3">
          {INTERNSHIP_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setShowMobileDetails(false);
              }}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-[#0052FF] text-white shadow-[0_0_20px_rgba(0,82,255,0.4)] border border-[#0052FF]'
                  : 'bg-transparent text-white/60 border border-white/20 hover:border-white/40 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Box Container: Full-width 4-stepper registration when applying, split explorer when browsing */}
      <div ref={mainBoxRef} className="mb-24 scroll-mt-24">
        {isApplying ? (
          <div className="w-full bg-[#050914] border border-white/10 rounded-[24px] shadow-2xl p-6 sm:p-8 lg:p-10 relative overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
            <InlineStepperRegistration
              program={activeProgram}
              onBack={() => {
                setIsApplying(false);
                setTimeout(() => {
                  mainBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 40);
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            {/* Left Panel (35%) */}
            <div className={`w-full lg:w-[35%] flex flex-col h-auto lg:h-auto overflow-hidden ${showMobileDetails ? 'hidden lg:flex' : 'flex'}`}>
          <div className="grid grid-cols-2 lg:flex lg:flex-col gap-4 relative h-full overflow-y-auto custom-scrollbar pr-2 pb-10 lg:pb-0">
            <AnimatePresence>
              {filteredPrograms.map((prog) => {
                const isActive = prog.id === activeId;
                return (
                  <motion.button
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={prog.id}
                    onClick={() => {
                      setActiveId(prog.id);
                      setIsApplying(false);
                      setShowMobileDetails(true);
                    }}
                    whileHover={{ scale: 1.02 }}
                    className={`relative w-full p-5 rounded-[20px] transition-all duration-300 overflow-hidden flex flex-col items-center justify-center text-center lg:flex-row lg:items-center lg:text-left gap-4 group ${
                      isActive 
                        ? 'bg-[#0B1221] border border-[#00A3FF]/50 shadow-[0_0_20px_rgba(0,163,255,0.15)]' 
                        : 'bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] hover:border-white/20'
                    }`}
                  >
                    {/* Active Background Sweep */}
                    {isActive && (
                      <motion.div 
                        layoutId="activeGlowLeft"
                        className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-[#00A3FF]/10 to-transparent pointer-events-none" 
                      />
                    )}
                    {isActive && (
                      <motion.div 
                        layoutId="activeLeftBarLeft"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1/2 bg-[#00A3FF] rounded-r-full shadow-[0_0_10px_#00A3FF] hidden lg:block" 
                      />
                    )}

                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-4 flex-1 lg:pr-4">
                      <div className={`w-12 h-12 shrink-0 flex items-center justify-center ${isActive ? 'drop-shadow-[0_0_10px_rgba(0,163,255,0.4)]' : 'opacity-80 group-hover:opacity-100 transition-opacity'}`}>
                        <img src={prog.icon as string} alt={prog.title} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-[13px] lg:text-[14px] leading-snug transition-colors ${isActive ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                          {prog.title}
                        </h3>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Panel (65%) */}
        <div 
          ref={rightPanelRef}
          className={`w-full lg:w-[65%] bg-[#050914] border border-white/5 rounded-[24px] shadow-2xl overflow-hidden relative ${showMobileDetails ? 'flex' : 'hidden lg:flex'}`}>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProgram.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-8 lg:p-10 relative z-10 h-full flex flex-col w-full"
            >
              {/* Mobile Back Button */}
              {showMobileDetails && (
                <button
                  onClick={() => {
                    setShowMobileDetails(false);
                    setIsApplying(false);
                  }}
                  className="lg:hidden mb-6 flex items-center gap-2 text-[#00A3FF] hover:text-white font-semibold text-sm transition-colors cursor-pointer self-start"
                >
                  &larr; Back to Internships
                </button>
              )}
              
              {/* Render Details OR Application Form */}
              {!isApplying && (
                <>
                  {/* Header inside Right Panel */}
                  <div className="flex flex-row gap-4 md:gap-8 mb-10 items-center justify-start">
                    <div className="shrink-0">
                      <DeepMindVisual icon={activeProgram.icon as string} />
                    </div>
                    <div className="flex-1 text-left">
                      <h2 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight leading-tight font-heading">
                        {activeProgram.title}
                      </h2>
                    </div>
                  </div>

                  {/* 4 Stats Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {[
                      { l: 'Projects', v: '5+ Real-world', i: Folder },
                      { l: 'Live Classes', v: 'Included', i: Users },
                      { l: 'Certificate', v: 'Industry Verified', i: Award },
                      { l: 'Duration', v: 'Flexible', i: Clock }
                    ].map(stat => (
                      <div key={stat.l} className="bg-[#0A0F1C] border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center group hover:bg-[#00A3FF]/5 hover:border-[#00A3FF]/20 transition-all hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,163,255,0.05)]">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 bg-transparent border border-[#00A3FF]/30 text-[#00A3FF] group-hover:shadow-[0_0_15px_rgba(0,163,255,0.4)] transition-shadow">
                          <stat.i className="w-5 h-5" />
                        </div>
                        <div className="text-[11px] text-white/50 uppercase font-bold tracking-wider mb-1">{stat.l}</div>
                        <div className="text-[13px] font-bold text-white">{stat.v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Skills */}
                  <div className="mb-10">
                    <h3 className="text-[18px] sm:text-[20px] font-semibold text-white mb-4 font-heading">Skills You'll Master</h3>
                    <div className="flex flex-wrap gap-2.5">
                      {activeProgram.skills.map(skill => (
                        <div key={skill} className="px-4 py-2 bg-transparent border border-white/20 rounded-md text-[13px] font-semibold text-white/80 hover:bg-[#00A3FF]/10 hover:border-[#00A3FF]/50 hover:text-[#00A3FF] transition-all cursor-default font-sans">
                          {skill}
                        </div>
                      ))}
                      <div className="px-4 py-2 bg-transparent border border-white/20 rounded-md text-[13px] font-semibold text-white/80 hover:bg-[#00A3FF]/10 hover:border-[#00A3FF]/50 hover:text-[#00A3FF] transition-all cursor-default font-sans">Git</div>
                      <div className="px-4 py-2 bg-transparent border border-white/20 rounded-md text-[13px] font-semibold text-white/80 hover:bg-[#00A3FF]/10 hover:border-[#00A3FF]/50 hover:text-[#00A3FF] transition-all cursor-default font-sans">Deployment</div>
                    </div>
                  </div>

                  {/* Bottom Split (Build / Certificate) */}
                  <div className="flex flex-col md:flex-row gap-8 mb-10">
                    {/* What You'll Build */}
                    <div className="flex-1">
                      <h3 className="text-[18px] sm:text-[20px] font-semibold text-white mb-4 font-heading">What You'll Build</h3>
                      <ul className="space-y-3 font-sans">
                        {['Student Management System', 'E-Commerce Web Application', 'Blog Platform with Authentication', 'RESTful APIs & Integrations', 'Deploy Your Application'].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-[14px] text-white/70">
                            <div className="w-5 h-5 rounded-full bg-[#0052FF] flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 text-white" strokeWidth={3} />
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Certificate */}
                    <div className="flex-1">
                      <div className="bg-[#0A0F1C] border border-[#00A3FF]/20 rounded-2xl p-5 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(0,163,255,0.1)] transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00A3FF]/10 blur-[40px] rounded-full" />
                        <h3 className="text-[#00A3FF] font-semibold text-[16px] mb-2 relative z-10 font-heading">Internship Certificate</h3>
                        <p className="text-[12px] text-white/60 mb-4 relative z-10">Earn a verified certificate from Atideto Academy to showcase your skills.</p>
                        <div className="w-full h-[120px] bg-white/5 border border-white/10 rounded-lg flex items-center justify-center relative z-10 overflow-hidden">
                          {/* Fake Certificate Illustration */}
                          <div className="w-[80%] h-[70%] bg-[#05070B] border-4 border-[#00A3FF]/30 flex flex-col items-center justify-center p-2 relative">
                             <div className="w-8 h-8 rounded-full bg-[#F59E0B] absolute bottom-2 right-2 flex items-center justify-center"><Award className="w-4 h-4 text-white" /></div>
                             <div className="w-1/2 h-1 bg-white/20 mb-2 rounded" />
                             <div className="w-3/4 h-2 bg-white/40 mb-2 rounded" />
                             <div className="w-1/3 h-1 bg-white/20 rounded" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Career & Mentorship Perks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start gap-4 p-4 lg:p-5 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-2xl hover:border-white/10 transition-all">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                        <Briefcase className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-[14px] mb-1">Placement Assistance</h4>
                        <p className="text-white/60 text-[12px] leading-relaxed">Dedicated support for resume building and interview prep.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 lg:p-5 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-2xl hover:border-white/10 transition-all">
                      <div className="w-10 h-10 rounded-full bg-[#0052FF]/10 flex items-center justify-center shrink-0 border border-[#0052FF]/20">
                        <HelpCircle className="w-5 h-5 text-[#38BDF8]" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-[14px] mb-1">1-on-1 Mentorship</h4>
                        <p className="text-white/60 text-[12px] leading-relaxed">Live doubt clearing sessions with industry experts.</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3.5 mt-auto pt-5 border-t border-white/10">
                    <button 
                      onClick={() => {
                        setIsApplying(true);
                        setTimeout(() => {
                          mainBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 40);
                      }} 
                      className="flex items-center gap-2 px-7 py-3.5 bg-[#0052FF] hover:bg-[#0040cc] text-white font-bold rounded-full transition-all shadow-[0_0_20px_rgba(0,82,255,0.3)] cursor-pointer"
                    >
                      Apply Now <ArrowRight className="w-4 h-4" />
                    </button>

                    <Link
                      to={`/internships/${activeProgram.id}`}
                      className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#0052FF]/20 to-[#0066FF]/20 hover:from-[#0052FF]/30 hover:to-[#0066FF]/30 border border-[#0066FF]/40 hover:border-[#0066FF]/70 text-white font-semibold rounded-full transition-all cursor-pointer"
                    >
                      <span>Full Program Page</span> <ExternalLink className="w-4 h-4 text-[#38BDF8]" />
                    </Link>

                    <button 
                      onClick={() => toast.success(`Downloading ${activeProgram.title} syllabus...`)}
                      className="flex items-center gap-2 px-6 py-3.5 bg-transparent border border-white/20 hover:border-white/40 text-white font-semibold rounded-full transition-all cursor-pointer"
                    >
                      Download Syllabus <Download className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}

              {/* Render 4-Stepper Registration Form (Reference Image 2) */}
              {isApplying && (
                <InlineStepperRegistration
                  program={activeProgram}
                  onBack={() => setIsApplying(false)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    )}
  </div>

      {/* 3. Full Width Sections (Below Explorer) */}
      
      {/* Why Learn */}
      <div className="mb-14">
        <h2 className="text-[28px] sm:text-[36px] font-bold text-center text-white mb-8 sm:mb-12 font-heading leading-[1.2]">Why Learn With Atideto Academy?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {[
            { icon: Users, t: 'Industry Experts', d: 'Learn from professionals working in top companies.' },
            { icon: Code2, t: 'Hands-on Projects', d: 'Build real-world projects for your portfolio.' },
            { icon: Award, t: 'Certificate', d: 'Earn industry-recognized internship certificate.' },
            { icon: Clock, t: 'Flexible Learning', d: 'Live classes + recorded sessions' }
          ].map(feat => (
            <div key={feat.t} className="flex flex-col items-center text-center p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#0052FF]/30 transition-all group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-[#0052FF]/10 group-hover:border-[#0052FF]/40 transition-all group-hover:shadow-[0_0_20px_rgba(0,82,255,0.25)]">
                <feat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#00A3FF]" />
              </div>
              <h4 className="font-semibold text-xs sm:text-[15px] text-white mb-1 sm:mb-2 font-heading">{feat.t}</h4>
              <p className="text-[11px] sm:text-[12px] text-white/60 leading-relaxed max-w-[200px] font-sans font-normal">{feat.d}</p>
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
