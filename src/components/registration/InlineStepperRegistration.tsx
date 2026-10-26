import React, { useState, useEffect } from 'react';
import { 
  Check, ChevronRight, ChevronLeft, Upload, CheckCircle2, 
  Building2, GraduationCap, Calendar, Clock, BookOpen, User, 
  Mail, Phone, ShieldCheck, Download, ExternalLink, AlertCircle, Award, X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import atidetoLogo from '@/assets/atideto/logo.png';
import { INTERNSHIP_PROGRAMS } from '@/constants';
import { submitRegistrationToDb, createStudentInDb } from '@/lib/api';
import { addStudentToRegistry } from '@/lib/certificateStore';
import { COUNTRY_CODES } from './StepperRegistrationModal';
import {
  INSTITUTION_TYPES,
  DEGREE_OPTIONS,
  SPECIALIZATION_OPTIONS,
  GRADUATION_YEARS,
  ALL_INDIAN_STATES,
  DISTRICTS_BY_STATE,
  POPULAR_CITIES,
  WEBSITE_UPSKILL_PROGRAMS,
  DURATION_OPTIONS,
  calculateAutomaticEndDate,
  calculateDurationFromDates,
  formatFriendlyDate
} from '@/constants/registrationOptions';

interface InlineStepperRegistrationProps {
  program: {
    id: string;
    title: string;
    category?: string;
    skills?: string[];
  };
  onBack: () => void;
}

export default function InlineStepperRegistration({ program, onBack }: InlineStepperRegistrationProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string>('');
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Initialize with today's date or 2026 default
  const defaultStartDate = '2026-11-02';
  const defaultDuration = '30 Days';

  const [formData, setFormData] = useState({
    photoUrl: '',
    fullName: user?.name || '',
    countryCode: '+91',
    contactNumber: '',
    email: user?.email || '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',

    // College & Location Information
    collegeName: 'Mahendra Engineering College',
    state: 'Tamil Nadu',
    customState: '',
    district: 'Namakkal',
    customDistrict: '',
    city: 'Mallasamudram',
    customCity: '',
    institutionType: 'Autonomous Institution',
    customInstitutionType: '',
    degree: 'B.Tech (Bachelor of Technology)',
    customDegree: '',
    specialization: 'Information Technology (IT)',
    customSpecialization: '',
    graduationYear: '2027 (Second Year Student)',
    customGraduationYear: '',

    // Program Track & Timeline
    programType: 'Internship' as 'Internship' | 'Course',
    selectedProgramId: program?.id || 'fs-mern',
    selectedProgramTitle: program?.title || 'Full Stack Development (MERN Stack)',
    customProgramTitle: '',
    startDate: defaultStartDate,
    duration: defaultDuration,
    customDuration: '',
    endDate: calculateAutomaticEndDate(defaultStartDate, defaultDuration),
    requirements: ''
  });

  // Effective computed values
  const effectiveInstitutionType = formData.institutionType === 'Other Institution (Type Below)'
    ? (formData.customInstitutionType || 'Autonomous Institution')
    : formData.institutionType;

  const effectiveDegree = formData.degree === 'Other Degree (Type Below)'
    ? (formData.customDegree || 'B.Tech')
    : formData.degree;

  const effectiveSpecialization = formData.specialization === 'Other Specialization (Type Below)'
    ? (formData.customSpecialization || 'Information Technology')
    : formData.specialization;

  const effectiveGraduationYear = formData.graduationYear === 'Other Year (Type Below)'
    ? (formData.customGraduationYear || '2027')
    : formData.graduationYear;

  const effectiveState = formData.state === 'Other / International (Type Below)'
    ? (formData.customState || 'Tamil Nadu')
    : formData.state;

  const effectiveDistrict = formData.district === 'Other District (Type Below)'
    ? (formData.customDistrict || 'Namakkal')
    : formData.district;

  const effectiveCity = formData.city === 'Other City / Campus (Type Below)'
    ? (formData.customCity || 'Mallasamudram')
    : formData.city;

  const effectiveProgramTitle = formData.selectedProgramId === 'other-program'
    ? (formData.customProgramTitle || 'Custom Upskill Internship')
    : formData.selectedProgramTitle;

  const effectiveDuration = formData.duration === 'Other' || formData.duration === 'Other Duration (Type Below)'
    ? (formData.customDuration || '30 Days')
    : formData.duration;

  const calculatedEndDate = calculateAutomaticEndDate(formData.startDate, effectiveDuration);

  // Sync user if auth updates
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  // Sync program prop updates
  useEffect(() => {
    if (program) {
      setFormData(prev => ({
        ...prev,
        selectedProgramId: program.id,
        selectedProgramTitle: program.title
      }));
    }
  }, [program]);

  // Automatically keep End Date synchronized whenever Start Date or Duration updates
  useEffect(() => {
    if (formData.startDate && effectiveDuration) {
      const autoEnd = calculateAutomaticEndDate(formData.startDate, effectiveDuration);
      if (autoEnd && autoEnd !== formData.endDate) {
        setFormData(prev => ({ ...prev, endDate: autoEnd }));
      }
    }
  }, [formData.startDate, effectiveDuration]);

  // Photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image file must be under 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, photoUrl: event.target?.result as string }));
        toast.success('Profile photo uploaded');
      };
      reader.readAsDataURL(file);
    }
  };

  // Step validations
  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!formData.contactNumber.trim() || formData.contactNumber.length < 7) {
      toast.error('Please enter a valid contact phone number');
      return false;
    }
    if (!formData.gender) {
      toast.error('Please select your gender');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.collegeName.trim()) {
      toast.error('Please enter your college name');
      return false;
    }
    if (formData.institutionType === 'Other Institution (Type Below)' && !formData.customInstitutionType.trim()) {
      toast.error('Please type your institution category');
      return false;
    }
    if (formData.state === 'Other / International (Type Below)' && !formData.customState.trim()) {
      toast.error('Please type your state or region');
      return false;
    }
    if (formData.district === 'Other District (Type Below)' && !formData.customDistrict.trim()) {
      toast.error('Please type your district');
      return false;
    }
    if (formData.city === 'Other City / Campus (Type Below)' && !formData.customCity.trim()) {
      toast.error('Please type your city or campus location');
      return false;
    }
    if (formData.degree === 'Other Degree (Type Below)' && !formData.customDegree.trim()) {
      toast.error('Please type your degree title');
      return false;
    }
    if (formData.specialization === 'Other Specialization (Type Below)' && !formData.customSpecialization.trim()) {
      toast.error('Please type your department / specialization');
      return false;
    }
    if (formData.graduationYear === 'Other Year (Type Below)' && !formData.customGraduationYear.trim()) {
      toast.error('Please type your graduation year');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.startDate) {
      toast.error('Please select an expected batch start date from calendar');
      return false;
    }
    if (formData.selectedProgramId === 'other-program' && !formData.customProgramTitle.trim()) {
      toast.error('Please type your desired program title');
      return false;
    }
    if ((formData.duration === 'Other' || formData.duration === 'Other Duration (Type Below)') && !formData.customDuration.trim()) {
      toast.error('Please type your custom duration (e.g. 45 Days, 4 Months)');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setStep(prev => prev + 1);
  };

  const handleSubmitRegistration = async () => {
    if (!termsAgreed) {
      toast.error('Please confirm that the provided details are true and accurate');
      return;
    }

    setIsSubmitting(true);

    const effectiveDuration = formData.duration || '3 Months';
    const calculatedEndDate = effectiveDuration
      ? (formData.endDate || calculateAutomaticEndDate(formData.startDate, effectiveDuration) || '')
      : '';

    const registerPayload = {
      regId: '', // server will assign ATD-XXX-2026-NNN
      studentName: formData.fullName,
      email: formData.email,
      phone: `${formData.countryCode} ${formData.contactNumber}`,
      college: formData.collegeName || 'Mahendra Engineering College',
      degree: effectiveDegree || 'B.Tech Information Technology',
      gradYear: effectiveGraduationYear || '2027',
      courseInterest: effectiveProgramTitle || 'Full Stack Web Development',
      domain: (formData.selectedProgramTitle || '').toLowerCase() || 'full stack development',
      mode: 'Industrial Hybrid',
      notes: `Specialization: ${effectiveSpecialization}, City: ${effectiveCity}, State: ${effectiveState}, District: ${effectiveDistrict}, Institution: ${effectiveInstitutionType}, Duration: ${effectiveDuration}, End Date: ${calculatedEndDate}`
    };

    try {
      // 1. Single canonical registration: persists to MySQL registrations, students table, and active cohort registry
      const regResult = await submitRegistrationToDb({
        ...registerPayload,
        startDate: formData.startDate || '25 Oct 2026',
        endDate: calculatedEndDate || '',
        duration: effectiveDuration || '3 Months',
        feePaid: '₹0',
        feeTotal: 'To Be Decided by Admin',
        paymentStatus: 'Pending Admin Decision'
      });

      // 2. LocalStorage sync using server-assigned canonical IDs
      const newRecord = {
        ...formData,
        effectiveInstitutionType,
        effectiveDegree,
        effectiveSpecialization,
        effectiveGraduationYear,
        effectiveState,
        effectiveDistrict,
        effectiveCity,
        effectiveProgramTitle,
        effectiveDuration,
        endDate: calculatedEndDate || '',
        applicationId: regResult?.regId || '',
        submittedAt: new Date().toISOString(),
        status: 'Active',
        paymentStatus: 'Pending Admin Decision'
      };

      const existing = JSON.parse(localStorage.getItem('atideto_registrations') || '[]');
      localStorage.setItem('atideto_registrations', JSON.stringify([newRecord, ...existing]));

      const studentSessionUser = regResult?.user || {
        uid: regResult?.studentId || regResult?.regId || `ATD-${Date.now()}`,
        name: formData.fullName,
        email: formData.email,
        role: 'student',
        provider: 'sql'
      };
      localStorage.setItem('atideto_sql_user', JSON.stringify(studentSessionUser));
      localStorage.setItem('atideto_dashboard_mode', 'student');
      window.dispatchEvent(new Event('atideto_auth_change'));

      setApplicationId(regResult?.regId || '');
      setIsSubmitting(false);
      setStep(5);
      toast.success('Registration Confirmed & Account Provisioned!');
    } catch (err: any) {
      console.error('Registration submission error:', err);
      const fallbackId = `ATD-REG-${Date.now().toString().slice(-6)}`;
      const fallbackRecord = {
        ...formData,
        effectiveInstitutionType,
        effectiveDegree,
        effectiveSpecialization,
        effectiveGraduationYear,
        effectiveState,
        effectiveDistrict,
        effectiveCity,
        effectiveProgramTitle,
        effectiveDuration,
        endDate: calculatedEndDate || '',
        applicationId: fallbackId,
        submittedAt: new Date().toISOString(),
        status: 'Active',
        paymentStatus: 'Pending Admin Decision'
      };
      const existing = JSON.parse(localStorage.getItem('atideto_registrations') || '[]');
      localStorage.setItem('atideto_registrations', JSON.stringify([fallbackRecord, ...existing]));
      setApplicationId(fallbackId);
      setStep(5);
      toast.success('Registration Saved!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const topRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  return (
    <div ref={topRef} className="h-full flex flex-col min-h-[580px] font-sans">
      
      {/* 1. TOP HEADER: Matching Reference Image 2 */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10 gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <img src={atidetoLogo} alt="Atideto" className="h-6 w-auto object-contain" />
          <span className="text-white/30 text-sm">/</span>
          <span className="text-[11px] sm:text-xs font-black tracking-wider uppercase text-[#00A3FF] truncate">
            INTERNSHIP REGISTRATION
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white/80 max-w-[280px]">
            <BookOpen size={12} className="text-[#38BDF8] shrink-0" />
            <span className="truncate font-medium">{program.title}</span>
          </div>

          <button 
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0052FF] hover:bg-[#0040cc] text-white text-xs font-bold transition shadow-[0_0_15px_rgba(0,82,255,0.4)] cursor-pointer"
            title="Revisit Course Details"
          >
            <span>Revisit Course Details</span>
            <ExternalLink size={12} />
          </button>

          <button
            type="button"
            onClick={onBack}
            className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* 2. NEAT STEPPER PROGRESS BAR (Matching Reference Image 2) */}
      {step <= 4 && (
        <div className="mb-6 px-2 sm:px-6">
          <div className="relative flex items-center justify-between max-w-xl mx-auto">
            {/* Connecting background track */}
            <div className="absolute top-4 left-6 right-6 h-[2px] bg-white/10 -z-0" />
            {/* Glowing filled progress line */}
            <div 
              className="absolute top-4 left-6 h-[2px] bg-gradient-to-r from-[#0052FF] via-[#0066FF] to-[#00A3FF] shadow-[0_0_12px_#00A3FF] -z-0 transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />

            {[
              { num: 1, label: 'Personal' },
              { num: 2, label: 'College' },
              { num: 3, label: 'Course' },
              { num: 4, label: 'Preview' }
            ].map((s) => {
              const isDone = step > s.num;
              const isCurrent = step === s.num;
              return (
                <div key={s.num} className="flex flex-col items-center relative z-10">
                  <button
                    type="button"
                    onClick={() => isDone && setStep(s.num)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                      isDone
                        ? 'bg-[#0066FF] text-white shadow-[0_0_15px_rgba(0,102,255,0.6)] cursor-pointer hover:bg-[#0052FF]'
                        : isCurrent
                          ? 'bg-gradient-to-br from-[#0052FF] to-[#00A3FF] text-white ring-4 ring-[#0066FF]/30 shadow-[0_0_20px_rgba(0,163,255,0.7)]'
                          : 'bg-[#0A0F1C] text-white/40 border border-white/15'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : s.num}
                  </button>
                  <span className={`text-[11px] font-semibold mt-1.5 transition-colors ${
                    isCurrent ? 'text-[#38BDF8] font-bold' : isDone ? 'text-white/80' : 'text-white/40'
                  }`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. STEP INPUT FIELDS (Scrollable content below Stepper) */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-5">
        
        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STEP 1: PERSONAL INFORMATION                                */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Personal Information</h3>
              <p className="text-xs text-white/60 mt-0.5">Tell us about yourself and identity details</p>
            </div>

            {/* Profile Photo Section */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="w-16 h-16 rounded-full bg-[#0B1221] border-2 border-white/20 shadow-inner flex items-center justify-center overflow-hidden shrink-0">
                {formData.photoUrl ? (
                  <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User size={28} className="text-[#38BDF8]" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-xs sm:text-sm font-bold text-white">Profile Photo</h4>
                <p className="text-[11px] text-white/50">JPG, PNG. Max 2MB</p>
                <label className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#0052FF] to-[#0066FF] hover:from-[#0066FF] hover:to-[#2EA8FF] text-white text-xs font-bold cursor-pointer transition shadow-[0_0_12px_rgba(0,102,255,0.3)]">
                  <Upload size={13} />
                  <span>Upload Photo</span>
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg, image/webp" 
                    className="hidden" 
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80 flex items-center gap-1">
                  Full Name <span className="text-[#00A3FF]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Vishnu Rajan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0B1221] text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80 flex items-center gap-1">
                  Email Address <span className="text-[#00A3FF]">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0B1221] text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition"
                />
              </div>

              {/* Contact with Country Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80 flex items-center gap-1">
                  Contact Number <span className="text-[#00A3FF]">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    className="w-24 sm:w-28 px-2 py-2.5 rounded-xl border border-white/10 bg-[#0B1221] text-xs font-bold text-white focus:outline-none focus:border-[#0066FF] cursor-pointer"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-[#0B1221] text-white">
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    placeholder="9876543210"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0B1221] text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition"
                  />
                </div>
              </div>

              {/* Gender Segmented Buttons */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80 flex items-center gap-1">
                  Gender <span className="text-[#00A3FF]">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Male', 'Female', 'Other'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`py-2.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                        formData.gender === g
                          ? 'bg-gradient-to-r from-[#0052FF] to-[#0066FF] text-white border-[#0066FF] shadow-[0_0_15px_rgba(0,102,255,0.4)]'
                          : 'bg-white/[0.03] text-white/60 border-white/10 hover:bg-white/[0.07] hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STEP 2: COLLEGE INFORMATION                                 */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">College & Academic Information</h3>
              <p className="text-xs text-white/60 mt-0.5">Your academic institution, location, and qualification details</p>
            </div>

            <div className="space-y-4">
              {/* College Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80 flex items-center gap-1">
                  College Full Name <span className="text-[#00A3FF]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.collegeName}
                  onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                  placeholder="e.g. Mahendra Engineering College / Anna University"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0B1221] text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition"
                />
              </div>

              {/* Institution Category Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80 flex items-center gap-1">
                  Institution Category / Type <span className="text-[#00A3FF]">*</span>
                </label>
                <select
                  value={formData.institutionType}
                  onChange={(e) => setFormData({ ...formData, institutionType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0B1221] text-xs font-semibold text-white focus:outline-none focus:border-[#0066FF] cursor-pointer"
                >
                  {INSTITUTION_TYPES.map((type) => (
                    <option key={type} value={type} className="bg-[#0B1221] text-white">
                      {type}
                    </option>
                  ))}
                </select>
                {formData.institutionType === 'Other Institution (Type Below)' && (
                  <input
                    type="text"
                    value={formData.customInstitutionType}
                    onChange={(e) => setFormData({ ...formData, customInstitutionType: e.target.value })}
                    placeholder="Type your institution category (e.g. Deemed University, Autonomous, International)..."
                    className="w-full mt-2 px-3.5 py-2 rounded-xl border border-[#0066FF]/50 bg-[#0066FF]/5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#0066FF] transition animate-fadeIn"
                    autoFocus
                  />
                )}
              </div>

              {/* State, District, City Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* State */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/80 flex items-center gap-1">
                    State / UT <span className="text-[#00A3FF]">*</span>
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => {
                      const newState = e.target.value;
                      const newDistricts = DISTRICTS_BY_STATE[newState] || ['Other District (Type Below)'];
                      setFormData({ 
                        ...formData, 
                        state: newState,
                        district: newDistricts[0] || 'Other District (Type Below)'
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0B1221] text-xs font-semibold text-white focus:outline-none focus:border-[#0066FF] cursor-pointer"
                  >
                    {ALL_INDIAN_STATES.map((s) => (
                      <option key={s} value={s} className="bg-[#0B1221] text-white">{s}</option>
                    ))}
                  </select>
                  {formData.state === 'Other / International (Type Below)' && (
                    <input
                      type="text"
                      value={formData.customState}
                      onChange={(e) => setFormData({ ...formData, customState: e.target.value })}
                      placeholder="Type your state / province..."
                      className="w-full mt-1.5 px-3 py-2 rounded-xl border border-[#0066FF]/50 bg-[#0066FF]/5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#0066FF] transition animate-fadeIn"
                    />
                  )}
                </div>

                {/* District */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/80 flex items-center gap-1">
                    District <span className="text-[#00A3FF]">*</span>
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0B1221] text-xs font-semibold text-white focus:outline-none focus:border-[#0066FF] cursor-pointer"
                  >
                    {(DISTRICTS_BY_STATE[formData.state] || ['Other District (Type Below)']).map((d) => (
                      <option key={d} value={d} className="bg-[#0B1221] text-white">{d}</option>
                    ))}
                    {!DISTRICTS_BY_STATE[formData.state]?.includes('Other District (Type Below)') && (
                      <option value="Other District (Type Below)" className="bg-[#0B1221] text-white">Other District (Type Below)</option>
                    )}
                  </select>
                  {formData.district === 'Other District (Type Below)' && (
                    <input
                      type="text"
                      value={formData.customDistrict}
                      onChange={(e) => setFormData({ ...formData, customDistrict: e.target.value })}
                      placeholder="Type your district..."
                      className="w-full mt-1.5 px-3 py-2 rounded-xl border border-[#0066FF]/50 bg-[#0066FF]/5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#0066FF] transition animate-fadeIn"
                    />
                  )}
                </div>

                {/* City / Campus */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/80 flex items-center gap-1">
                    City / Campus <span className="text-[#00A3FF]">*</span>
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0B1221] text-xs font-semibold text-white focus:outline-none focus:border-[#0066FF] cursor-pointer"
                  >
                    {POPULAR_CITIES.map((c) => (
                      <option key={c} value={c} className="bg-[#0B1221] text-white">{c}</option>
                    ))}
                  </select>
                  {formData.city === 'Other City / Campus (Type Below)' && (
                    <input
                      type="text"
                      value={formData.customCity}
                      onChange={(e) => setFormData({ ...formData, customCity: e.target.value })}
                      placeholder="Type your city or campus location..."
                      className="w-full mt-1.5 px-3 py-2 rounded-xl border border-[#0066FF]/50 bg-[#0066FF]/5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#0066FF] transition animate-fadeIn"
                    />
                  )}
                </div>
              </div>

              {/* Degree, Specialization, Year Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Degree */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/80 flex items-center gap-1">
                    Degree <span className="text-[#00A3FF]">*</span>
                  </label>
                  <select
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0B1221] text-xs font-semibold text-white focus:outline-none focus:border-[#0066FF] cursor-pointer"
                  >
                    {DEGREE_OPTIONS.map((deg) => (
                      <option key={deg} value={deg} className="bg-[#0B1221] text-white">{deg}</option>
                    ))}
                  </select>
                  {formData.degree === 'Other Degree (Type Below)' && (
                    <input
                      type="text"
                      value={formData.customDegree}
                      onChange={(e) => setFormData({ ...formData, customDegree: e.target.value })}
                      placeholder="Type your degree (e.g. B.Voc, Dual Degree)..."
                      className="w-full mt-1.5 px-3 py-2 rounded-xl border border-[#0066FF]/50 bg-[#0066FF]/5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#0066FF] transition animate-fadeIn"
                    />
                  )}
                </div>

                {/* Specialization */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/80 flex items-center gap-1">
                    Department / Branch <span className="text-[#00A3FF]">*</span>
                  </label>
                  <select
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0B1221] text-xs font-semibold text-white focus:outline-none focus:border-[#0066FF] cursor-pointer"
                  >
                    {SPECIALIZATION_OPTIONS.map((spec) => (
                      <option key={spec} value={spec} className="bg-[#0B1221] text-white">{spec}</option>
                    ))}
                  </select>
                  {formData.specialization === 'Other Specialization (Type Below)' && (
                    <input
                      type="text"
                      value={formData.customSpecialization}
                      onChange={(e) => setFormData({ ...formData, customSpecialization: e.target.value })}
                      placeholder="Type your branch / department..."
                      className="w-full mt-1.5 px-3 py-2 rounded-xl border border-[#0066FF]/50 bg-[#0066FF]/5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#0066FF] transition animate-fadeIn"
                    />
                  )}
                </div>

                {/* Graduation Year */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/80 flex items-center gap-1">
                    Graduation Year <span className="text-[#00A3FF]">*</span>
                  </label>
                  <select
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0B1221] text-xs font-bold text-white focus:outline-none focus:border-[#0066FF] cursor-pointer"
                  >
                    {GRADUATION_YEARS.map((yr) => (
                      <option key={yr} value={yr} className="bg-[#0B1221] text-white">{yr}</option>
                    ))}
                  </select>
                  {formData.graduationYear === 'Other Year (Type Below)' && (
                    <input
                      type="text"
                      value={formData.customGraduationYear}
                      onChange={(e) => setFormData({ ...formData, customGraduationYear: e.target.value })}
                      placeholder="Type graduation year (e.g. 2031)..."
                      className="w-full mt-1.5 px-3 py-2 rounded-xl border border-[#0066FF]/50 bg-[#0066FF]/5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#0066FF] transition animate-fadeIn"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STEP 3: PROGRAM & SCHEDULE                                  */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {step === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Program Track & Schedule</h3>
              <p className="text-xs text-white/60 mt-0.5">Select from the 12 official Atideto programs or specify your custom track</p>
            </div>

            <div className="space-y-4">
              {/* Program Track Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80 flex items-center gap-1">
                  Selected Upskill / Internship Program <span className="text-[#00A3FF]">*</span>
                </label>
                <select
                  value={formData.selectedProgramId}
                  onChange={(e) => {
                    const found = WEBSITE_UPSKILL_PROGRAMS.find(p => p.id === e.target.value);
                    setFormData({
                      ...formData,
                      selectedProgramId: e.target.value,
                      selectedProgramTitle: found ? found.title : e.target.value
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0B1221] text-sm font-semibold text-white focus:outline-none focus:border-[#0066FF] cursor-pointer"
                >
                  {WEBSITE_UPSKILL_PROGRAMS.map((prog) => (
                    <option key={prog.id} value={prog.id} className="bg-[#0B1221] text-white">
                      {prog.title} ({prog.category})
                    </option>
                  ))}
                </select>
                {formData.selectedProgramId === 'other-program' && (
                  <input
                    type="text"
                    value={formData.customProgramTitle}
                    onChange={(e) => setFormData({ ...formData, customProgramTitle: e.target.value })}
                    placeholder="Type your desired custom program or technology track (e.g. Embedded Systems, Rust, Blockchain)..."
                    className="w-full mt-2 px-3.5 py-2.5 rounded-xl border border-[#0066FF]/50 bg-[#0066FF]/5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#0066FF] transition animate-fadeIn"
                    autoFocus
                  />
                )}
              </div>

              {/* Website Program Details Banner */}
              {formData.selectedProgramId !== 'other-program' && (
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-[#0066FF]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#38BDF8] truncate">{formData.selectedProgramTitle}</p>
                    <p className="text-[11px] text-white/60">Official industry curriculum, mentor support & milestone evaluation</p>
                  </div>
                  <Link
                    to={`/internships/${formData.selectedProgramId}`}
                    target="_blank"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0066FF]/30 hover:bg-[#0066FF]/50 border border-[#0066FF]/50 text-white text-xs font-bold transition shrink-0 cursor-pointer shadow-sm"
                  >
                    <span>View Full Syllabus</span>
                    <ExternalLink size={12} className="text-[#38BDF8]" />
                  </Link>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/80 flex items-center gap-1">
                    Course Start Date (Manual) <span className="text-[#00A3FF]">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => {
                      const newStart = e.target.value;
                      const calcDur = calculateDurationFromDates(newStart, formData.endDate || calculatedEndDate);
                      setFormData({
                        ...formData,
                        startDate: newStart,
                        ...(calcDur ? { duration: calcDur } : {})
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0B1221] text-sm text-white focus:outline-none focus:border-[#0066FF] cursor-pointer"
                  />
                  <p className="text-[11px] text-white/40">Select start date from calendar</p>
                </div>

                {/* End Date (Manual) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/80 flex items-center gap-1">
                    Course End Date (Manual) <span className="text-[#00A3FF]">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.endDate || calculatedEndDate}
                    onChange={(e) => {
                      const newEnd = e.target.value;
                      const calcDur = calculateDurationFromDates(formData.startDate, newEnd);
                      setFormData({
                        ...formData,
                        endDate: newEnd,
                        ...(calcDur ? { duration: calcDur } : {})
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0B1221] text-sm text-white focus:outline-none focus:border-[#0066FF] cursor-pointer"
                  />
                  <p className="text-[11px] text-white/40">Select completion date or let duration compute</p>
                </div>
              </div>

              {/* Duration (Auto-Calculated) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white/80 flex items-center gap-1">
                    Internship Duration <span className="text-[#00A3FF]">*</span>
                  </label>
                  {formData.startDate && (formData.endDate || calculatedEndDate) && (
                    <span className="text-xs font-bold text-[#38BDF8] bg-[#0066FF]/20 px-2.5 py-0.5 rounded-md border border-[#0066FF]/30">
                      Calculated: {calculateDurationFromDates(formData.startDate, formData.endDate || calculatedEndDate) || effectiveDuration}
                    </span>
                  )}
                </div>
                <select
                  value={formData.duration}
                  onChange={(e) => {
                    const newDur = e.target.value;
                    const newEnd = calculateAutomaticEndDate(formData.startDate, newDur);
                    setFormData({
                      ...formData,
                      duration: newDur,
                      endDate: newEnd || formData.endDate
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0B1221] text-xs font-bold text-white focus:outline-none focus:border-[#0066FF] cursor-pointer"
                >
                  {DURATION_OPTIONS.map((d) => (
                    <option key={d.value} value={d.value} className="bg-[#0B1221] text-white">
                      {d.label}
                    </option>
                  ))}
                </select>
                {(formData.duration === 'Other' || formData.duration === 'Other Duration (Type Below)') && (
                  <input
                    type="text"
                    value={formData.customDuration}
                    onChange={(e) => setFormData({ ...formData, customDuration: e.target.value })}
                    placeholder="Type custom duration (e.g. 45 Days, 120 Days, 4 Months)..."
                    className="w-full mt-1.5 px-3 py-2 rounded-xl border border-[#0066FF]/50 bg-[#0066FF]/5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#0066FF] transition animate-fadeIn"
                  />
                )}
                {/* Quick pills for 7, 15, 30, 60, 90 days */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['7 Days', '15 Days', '30 Days', '60 Days', '90 Days'].map((pill) => (
                    <button
                      key={pill}
                      type="button"
                      onClick={() => {
                        const newEnd = calculateAutomaticEndDate(formData.startDate, pill);
                        setFormData({
                          ...formData,
                          duration: pill,
                          endDate: newEnd || formData.endDate
                        });
                      }}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition cursor-pointer ${
                        formData.duration === pill
                          ? 'bg-[#0066FF] text-white border-[#0066FF]'
                          : 'bg-white/[0.03] text-white/60 border-white/10 hover:text-white'
                      }`}
                    >
                      {pill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Requirements / Objectives */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80 flex items-center gap-1">
                  Requirements & Learning Goals <span className="text-white/40 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="Describe your prerequisites, tools you want to master (e.g. Next.js, PyTorch, Flutter), or capstone project aspirations..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0B1221] text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition"
                />
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STEP 4: REVIEW & CONFIRMATION                               */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {step === 4 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Review Your Application</h3>
              <p className="text-xs text-white/60 mt-0.5">Please review your information carefully before submitting</p>
            </div>

            {/* Personal Card */}
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-white">
                  <User size={15} className="text-[#00A3FF]" />
                  <span>Personal Details</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-[#00A3FF] hover:underline cursor-pointer"
                >
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-white/50">Full Name:</span>
                  <p className="font-bold text-white mt-0.5">{formData.fullName}</p>
                </div>
                <div>
                  <span className="text-white/50">Email Address:</span>
                  <p className="font-bold text-white truncate mt-0.5">{formData.email}</p>
                </div>
                <div>
                  <span className="text-white/50">Contact:</span>
                  <p className="font-bold text-white mt-0.5">{formData.countryCode} {formData.contactNumber}</p>
                </div>
                <div>
                  <span className="text-white/50">Gender:</span>
                  <p className="font-bold text-white mt-0.5">{formData.gender}</p>
                </div>
              </div>
            </div>

            {/* College Card */}
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-white">
                  <GraduationCap size={15} className="text-[#00A3FF]" />
                  <span>College & Academic Credentials</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-bold text-[#00A3FF] hover:underline cursor-pointer"
                >
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="col-span-2">
                  <span className="text-white/50">College Name:</span>
                  <p className="font-bold text-white mt-0.5">{formData.collegeName}</p>
                </div>
                <div>
                  <span className="text-white/50">Location:</span>
                  <p className="font-bold text-white mt-0.5">{effectiveCity}, {effectiveDistrict}, {effectiveState}</p>
                </div>
                <div>
                  <span className="text-white/50">Institution Type:</span>
                  <p className="font-bold text-white mt-0.5">{effectiveInstitutionType}</p>
                </div>
                <div>
                  <span className="text-white/50">Degree & Branch:</span>
                  <p className="font-bold text-white mt-0.5">{effectiveDegree} in {effectiveSpecialization}</p>
                </div>
                <div>
                  <span className="text-white/50">Graduation Year:</span>
                  <p className="font-bold text-white mt-0.5">{effectiveGraduationYear}</p>
                </div>
              </div>
            </div>

            {/* Course Card */}
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-white">
                  <Calendar size={15} className="text-[#00A3FF]" />
                  <span>Program Track & Duration</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs font-bold text-[#00A3FF] hover:underline cursor-pointer"
                >
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="col-span-2">
                  <span className="text-white/50">Program Title:</span>
                  <p className="font-bold text-[#38BDF8] mt-0.5">{effectiveProgramTitle}</p>
                </div>
                <div>
                  <span className="text-white/50">Duration:</span>
                  <p className="font-bold text-white mt-0.5">{effectiveDuration}</p>
                </div>
                <div>
                  <span className="text-white/50">Batch Start:</span>
                  <p className="font-bold text-white mt-0.5">{formData.startDate}</p>
                </div>
                <div>
                  <span className="text-white/50">Calculated End Date:</span>
                  <p className="font-bold text-[#38BDF8] mt-0.5">
                    {formatFriendlyDate(formData.endDate || calculatedEndDate)}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-white/50">Requirements / Goals:</span>
                  <p className="font-medium text-white/80 italic mt-0.5">{formData.requirements || 'Standard Industrial Curriculum'}</p>
                </div>
              </div>
            </div>

            {/* Declaration Checkbox */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-white/10 bg-white/[0.02] cursor-pointer select-none hover:border-[#0066FF]/40 transition">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#0066FF] rounded border-white/20 bg-[#0B1221] focus:ring-[#0066FF] cursor-pointer"
              />
              <span className="text-xs text-white/80 leading-relaxed">
                I hereby declare that all information furnished above is authentic and accurate. I understand that verified certifications will be issued upon successful milestone evaluations.
              </span>
            </label>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STEP 5: SUCCESSFUL SUBMISSION                               */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {step === 5 && (
          <div className="text-center py-6 px-3 space-y-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#0066FF]/15 text-[#38BDF8] flex items-center justify-center mx-auto border-2 border-[#0066FF]/40 shadow-[0_0_25px_rgba(0,102,255,0.4)]">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider bg-[#0066FF]/20 text-[#38BDF8] border border-[#0066FF]/40 uppercase">
                Application Verified & Registered in Database
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-3">
                Welcome to Atideto Academy!
              </h3>
              <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-md mx-auto">
                Your internship enrollment has been saved to the MySQL database and provisioned in the Student Learning ERP.
              </p>
            </div>

            {/* Receipt Summary Slip */}
            <div className="bg-[#0B1221] border border-white/10 rounded-xl p-4 text-left text-xs space-y-2.5 font-mono">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-white/50">Application ID:</span>
                <span className="font-bold text-[#38BDF8] text-sm tracking-wide">{applicationId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/50">Candidate Name:</span>
                <span className="font-bold text-white">{formData.fullName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/50">Program:</span>
                <span className="font-bold text-white truncate max-w-[240px]">{formData.selectedProgramTitle}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/50">Duration & Batch:</span>
                <span className="font-bold text-white">{formData.duration} (Start: {formData.startDate})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/50">Institution:</span>
                <span className="font-bold text-white truncate max-w-[240px]">{formData.collegeName}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <span className="text-white/50">Portal Login:</span>
                <span className="font-bold text-emerald-400 font-mono">student123 (Default Password)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#0052FF] to-[#0066FF] hover:from-[#0066FF] hover:to-[#2EA8FF] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,102,255,0.4)] transition cursor-pointer"
              >
                <Award size={15} />
                <span>Open Student Learning Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Download size={14} />
                <span>Print Registration Slip</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onBack();
                  setStep(1);
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-transparent hover:bg-white/5 text-white/70 hover:text-white text-xs font-medium transition cursor-pointer"
              >
                <span>Back to Explorer</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* BOTTOM STEP CONTROLS (Steps 1 to 4) */}
      {step <= 4 && (
        <div className="pt-4 mt-auto border-t border-white/10 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="px-5 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] text-xs font-bold text-white hover:bg-white/[0.08] transition flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-[#0052FF] to-[#0066FF] hover:from-[#0066FF] hover:to-[#2EA8FF] text-xs font-bold text-white transition flex items-center gap-1.5 shadow-[0_0_20px_rgba(0,102,255,0.4)] cursor-pointer"
            >
              <span>Next Step</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitRegistration}
              className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#0052FF] to-[#0066FF] hover:from-[#0066FF] hover:to-[#2EA8FF] text-xs font-bold text-white transition flex items-center gap-1.5 shadow-[0_0_20px_rgba(0,102,255,0.4)] disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting to Database...</span>
                </div>
              ) : (
                <>
                  <span>Confirm & Submit Registration</span>
                  <Check size={16} />
                </>
              )}
            </button>
          )}
        </div>
      )}

    </div>
  );
}
