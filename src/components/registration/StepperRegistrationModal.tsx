import React, { useState, useEffect } from 'react';
import { 
  X, Check, ChevronRight, ChevronLeft, Upload, CheckCircle2, 
  Building2, GraduationCap, Calendar, Clock, BookOpen, User, 
  Mail, Phone, ShieldCheck, Download, ExternalLink, AlertCircle, FileText
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { submitRegistrationToDb, createStudentInDb } from '@/lib/api';
import { addStudentToRegistry } from '@/lib/certificateStore';
import atidetoLogo from '@/assets/atideto/logo.png';
import atidetoWordmark from '@/assets/atideto/atideto.png';
import { INTERNSHIP_PROGRAMS } from '@/constants';
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
  formatFriendlyDate
} from '@/constants/registrationOptions';

export const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'USA / Canada', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+974', country: 'Qatar', flag: '🇶🇦' },
  { code: '+968', country: 'Oman', flag: '🇴🇲' },
  { code: '+965', country: 'Kuwait', flag: '🇰🇼' },
  { code: '+973', country: 'Bahrain', flag: '🇧🇭' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
  { code: '+977', country: 'Nepal', flag: '🇳🇵' },
  { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+46', country: 'Sweden', flag: '🇸🇪' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
  { code: '+353', country: 'Ireland', flag: '🇮🇪' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
];

export const INDIAN_STATES = ALL_INDIAN_STATES;

export interface RegistrationFormData {
  // Step 1: Personal
  photoUrl: string;
  fullName: string;
  countryCode: string;
  contactNumber: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other' | '';

  // Step 2: College Information
  collegeName: string;
  district: string;
  customDistrict?: string;
  city: string;
  customCity?: string;
  state: string;
  customState?: string;
  institutionType: string;
  customInstitutionType?: string;
  degree: string;
  customDegree?: string;
  specialization: string;
  customSpecialization?: string;
  graduationYear: string;
  customGraduationYear?: string;

  // Step 3: Course / Internship Details
  programType: 'Internship' | 'Course';
  selectedProgramId: string;
  selectedProgramTitle: string;
  customProgramTitle?: string;
  startDate: string;
  duration: string;
  customDuration?: string;
  endDate?: string;
  requirements: string;
}

interface StepperModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProgramId?: string;
  initialProgramTitle?: string;
  initialType?: 'Internship' | 'Course';
  onSuccess?: (registeredData: RegistrationFormData & { applicationId: string }) => void;
}

export default function StepperRegistrationModal({
  isOpen,
  onClose,
  initialProgramId,
  initialProgramTitle,
  initialType = 'Internship',
  onSuccess
}: StepperModalProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string>('');
  const [termsAgreed, setTermsAgreed] = useState(false);

  const defaultStartDate = '2026-11-02';
  const defaultDuration = '30 Days';

  const [formData, setFormData] = useState<RegistrationFormData>({
    photoUrl: '',
    fullName: user?.name || '',
    countryCode: '+91',
    contactNumber: '',
    email: user?.email || '',
    gender: 'Male',

    collegeName: 'Mahendra Engineering College',
    district: 'Namakkal',
    customDistrict: '',
    city: 'Mallasamudram',
    customCity: '',
    state: 'Tamil Nadu',
    customState: '',
    institutionType: 'Autonomous Institution',
    customInstitutionType: '',
    degree: 'B.Tech (Bachelor of Technology)',
    customDegree: '',
    specialization: 'Information Technology (IT)',
    customSpecialization: '',
    graduationYear: '2027 (Second Year Student)',
    customGraduationYear: '',

    programType: initialType,
    selectedProgramId: initialProgramId || 'fs-mern',
    selectedProgramTitle: initialProgramTitle || 'Full Stack Development (MERN Stack)',
    customProgramTitle: '',
    startDate: defaultStartDate,
    duration: defaultDuration,
    customDuration: '',
    endDate: calculateAutomaticEndDate(defaultStartDate, defaultDuration),
    requirements: ''
  });

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

  // Automatically keep End Date synchronized whenever Start Date or Duration updates
  useEffect(() => {
    if (formData.startDate && effectiveDuration) {
      const autoEnd = calculateAutomaticEndDate(formData.startDate, effectiveDuration);
      if (autoEnd && autoEnd !== formData.endDate) {
        setFormData(prev => ({ ...prev, endDate: autoEnd }));
      }
    }
  }, [formData.startDate, effectiveDuration]);

  // Pre-fill user data whenever modal opens or auth loads
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user, isOpen]);

  // Update selected program if props change
  useEffect(() => {
    if (initialProgramTitle || initialProgramId) {
      setFormData(prev => ({
        ...prev,
        selectedProgramId: initialProgramId || prev.selectedProgramId,
        selectedProgramTitle: initialProgramTitle || prev.selectedProgramTitle,
        programType: initialType
      }));
    }
  }, [initialProgramId, initialProgramTitle, initialType]);

  if (!isOpen) return null;

  if (!user) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 antialiased">
        <div className="relative w-full max-w-md bg-[#FFFFFF] text-[#0A0A0A] rounded-2xl shadow-2xl border border-[#E2E8F0] p-6 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#0066FF]/10 text-[#0066FF] flex items-center justify-center mx-auto border border-[#0066FF]/30">
            <User size={32} />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-black text-[#0A0A0A]">Sign In Required</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              To register for <span className="font-bold text-[#0A0A0A]">{formData.selectedProgramTitle}</span>, you must be logged into your Atideto account.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 pt-2">
            <button
              onClick={() => {
                onClose();
                navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
              }}
              className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs font-black uppercase tracking-wider transition shadow-lg shadow-[#0066FF]/20 cursor-pointer"
            >
              Sign In to Continue
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Validation functions
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
      toast.error('Please enter your college full name');
      return false;
    }
    if (formData.institutionType === 'Other Institution (Type Below)' && !formData.customInstitutionType?.trim()) {
      toast.error('Please type your institution category');
      return false;
    }
    if (formData.state === 'Other / International (Type Below)' && !formData.customState?.trim()) {
      toast.error('Please type your state or region');
      return false;
    }
    if (formData.district === 'Other District (Type Below)' && !formData.customDistrict?.trim()) {
      toast.error('Please type your district');
      return false;
    }
    if (formData.city === 'Other City / Campus (Type Below)' && !formData.customCity?.trim()) {
      toast.error('Please type your city or campus location');
      return false;
    }
    if (formData.degree === 'Other Degree (Type Below)' && !formData.customDegree?.trim()) {
      toast.error('Please type your degree title');
      return false;
    }
    if (formData.specialization === 'Other Specialization (Type Below)' && !formData.customSpecialization?.trim()) {
      toast.error('Please type your department / specialization');
      return false;
    }
    if (formData.graduationYear === 'Other Year (Type Below)' && !formData.customGraduationYear?.trim()) {
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
    if (formData.selectedProgramId === 'other-program' && !formData.customProgramTitle?.trim()) {
      toast.error('Please type your desired program track');
      return false;
    }
    if ((formData.duration === 'Other' || formData.duration === 'Other Duration (Type Below)') && !formData.customDuration?.trim()) {
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

  const handleSubmitApplication = async () => {
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
      course_interest: formData.selectedProgramTitle || 'Full Stack Web Development',
      domain: (formData.selectedProgramTitle || '').toLowerCase() || 'full stack development',
      mode: 'Industrial Hybrid',
      notes: 
        `Specialization: ${effectiveSpecialization}, City: ${effectiveCity}, State: ${effectiveState}, District: ${effectiveDistrict}, Institution: ${effectiveInstitutionType}, Duration: ${effectiveDuration}, End Date: ${calculatedEndDate}`
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

      // 2. LocalStorage sync using server-assigned IDs
      const newRecord = {
        ...formData,
        institutionType: effectiveInstitutionType,
        degree: effectiveDegree,
        specialization: effectiveSpecialization,
        graduationYear: effectiveGraduationYear,
        state: effectiveState,
        district: effectiveDistrict,
        city: effectiveCity,
        selectedProgramTitle: effectiveProgramTitle,
        duration: effectiveDuration,
        endDate: calculatedEndDate || '',
        applicationId: regResult?.regId || '',
        submittedAt: new Date().toISOString(),
        status: 'Active',
        paymentStatus: 'Pending Admin Decision',
        feePaid: '₹0',
        feeTotal: 'To Be Decided by Admin'
      };

      const existing = JSON.parse(localStorage.getItem('atideto_registrations') || '[]');
      localStorage.setItem('atideto_registrations', JSON.stringify([newRecord, ...existing]));

      setApplicationId(regResult?.regId || '');
      setIsSubmitting(false);
      setStep(5); // Successful confirmation step

      toast.success('Application Submitted & Synced with MySQL!');
      if (onSuccess) {
        onSuccess(newRecord as any);
      }
    } catch (err: any) {
      console.error('Registration submission error:', err);
      setIsSubmitting(false);
      toast.error('Failed to submit: ' + (err.message || 'unknown error'));
    }
  };

  const handleDownloadSlip = () => {
    window.print();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[200] flex justify-end bg-black/60 backdrop-blur-sm overflow-hidden antialiased"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:w-[420px] md:w-[35%] lg:w-[30%] bg-[#FFFFFF] text-[#0A0A0A] shadow-2xl border-l border-[#E2E8F0] overflow-hidden flex flex-col h-full animate-in slide-in-from-right duration-300"
      >
        
        {/* Top Header: ONLY stay close X button at right side */}
        <div className="bg-[#050505] text-white px-5 py-3.5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <img src={atidetoLogo} alt="Atideto" className="h-6 w-auto object-contain shrink-0" />
            <div className="flex items-center gap-1.5 min-w-0 truncate">
              <span className="font-extrabold text-white text-sm tracking-tight shrink-0">Atideto</span>
              <span className="text-white/40">/</span>
              <span className="text-xs uppercase font-bold text-[#0066FF] tracking-wider truncate">
                {formData.programType} Registration
              </span>
            </div>
          </div>

          {/* Close X Button - only button staying at right side */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer shrink-0"
            title="Close Form"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Revisit Website Course Details Bar */}
        {step <= 4 && (
          <div className="bg-[#F0F7FF] border-b border-[#BFDBFE] px-4 py-2 flex items-center justify-between gap-2 shrink-0">
            <div className="min-w-0 flex items-center gap-1.5">
              <BookOpen size={13} className="text-[#0066FF] shrink-0" />
              <span className="text-[11px] font-bold text-[#1E3A8A] truncate max-w-[170px] sm:max-w-[200px]">
                {formData.selectedProgramTitle}
              </span>
            </div>
            <a
              href={`/upskill/${formData.selectedProgramId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0066FF] hover:bg-[#0052FF] text-white text-[10px] font-bold transition shrink-0 shadow-sm"
              title="Revisit website for complete curriculum, syllabus and schedule"
            >
              <span>Revisit Course Details</span>
              <ExternalLink size={10} />
            </a>
          </div>
        )}

        {/* 4-STEPPER PROGRESS BAR (Exact Match to Reference Image 3) */}
        {step <= 4 && (
          <div className="bg-[#FAFAFA] border-b border-[#E2E8F0] px-6 py-4 shrink-0">
            <div className="max-w-2xl mx-auto flex items-center justify-between relative">
              {/* Connecting line */}
              <div className="absolute top-4 left-6 right-6 h-[2px] bg-[#E2E8F0] -z-0" />
              <div 
                className="absolute top-4 left-6 h-[2px] bg-[#0066FF] -z-0 transition-all duration-300"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />

              {/* Step 1: Personal */}
              <div className="flex flex-col items-center relative z-10">
                <button
                  type="button"
                  onClick={() => step > 1 && setStep(1)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                    step > 1 
                      ? 'bg-[#0066FF] text-white cursor-pointer' 
                      : step === 1 
                        ? 'bg-[#0066FF] text-white ring-4 ring-[#0066FF]/20' 
                        : 'bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1]'
                  }`}
                >
                  {step > 1 ? <Check size={16} /> : '1'}
                </button>
                <span className={`text-[11px] font-bold mt-1.5 ${step === 1 ? 'text-[#0066FF]' : 'text-[#64748B]'}`}>
                  Personal
                </span>
              </div>

              {/* Step 2: College */}
              <div className="flex flex-col items-center relative z-10">
                <button
                  type="button"
                  onClick={() => step > 2 && setStep(2)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                    step > 2 
                      ? 'bg-[#0066FF] text-white cursor-pointer' 
                      : step === 2 
                        ? 'bg-[#0066FF] text-white ring-4 ring-[#0066FF]/20' 
                        : 'bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1]'
                  }`}
                >
                  {step > 2 ? <Check size={16} /> : '2'}
                </button>
                <span className={`text-[11px] font-bold mt-1.5 ${step === 2 ? 'text-[#0066FF]' : 'text-[#64748B]'}`}>
                  College
                </span>
              </div>

              {/* Step 3: Course */}
              <div className="flex flex-col items-center relative z-10">
                <button
                  type="button"
                  onClick={() => step > 3 && setStep(3)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                    step > 3 
                      ? 'bg-[#0066FF] text-white cursor-pointer' 
                      : step === 3 
                        ? 'bg-[#0066FF] text-white ring-4 ring-[#0066FF]/20' 
                        : 'bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1]'
                  }`}
                >
                  {step > 3 ? <Check size={16} /> : '3'}
                </button>
                <span className={`text-[11px] font-bold mt-1.5 ${step === 3 ? 'text-[#0066FF]' : 'text-[#64748B]'}`}>
                  Course
                </span>
              </div>

              {/* Step 4: Preview */}
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                    step === 4 
                      ? 'bg-[#0066FF] text-white ring-4 ring-[#0066FF]/20' 
                      : 'bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1]'
                  }`}
                >
                  4
                </div>
                <span className={`text-[11px] font-bold mt-1.5 ${step === 4 ? 'text-[#0066FF]' : 'text-[#64748B]'}`}>
                  Preview
                </span>
              </div>
            </div>
          </div>
        )}

        {/* MODAL BODY CONTAINER */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 font-sans">
          
          {/* ═════════════════════════════════════════════════════════════ */}
          {/* STEP 1: PERSONAL INFORMATION (Exact Image 3 Layout)          */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {step === 1 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-[#0A0A0A] tracking-tight">Personal Information</h2>
                <p className="text-xs md:text-sm text-[#64748B] mt-0.5">Tell us about yourself and identity details</p>
              </div>

              {/* Profile Photo Section (Exact Image 3) */}
              <div className="flex items-center gap-5 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="w-16 h-16 rounded-full bg-[#E2E8F0] border-2 border-white shadow-inner flex items-center justify-center overflow-hidden shrink-0">
                  {formData.photoUrl ? (
                    <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User size={30} className="text-[#94A3B8]" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[#0A0A0A]">Profile Photo</h4>
                  <p className="text-xs text-[#64748B]">JPG, PNG. Max 2MB</p>
                  <label className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#050505] hover:bg-[#0066FF] text-white text-xs font-bold cursor-pointer transition shadow-sm">
                    <Upload size={13} />
                    <span>Upload</span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0A0A0A] flex items-center gap-1">
                    Full Name <span className="text-[#0066FF]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Vishnu Rajan"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-sm text-[#0A0A0A] focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0A0A0A] flex items-center gap-1">
                    Email Address <span className="text-[#0066FF]">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="vishnurajan24766@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-sm text-[#0A0A0A] focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition"
                  />
                </div>

                {/* Contact with All Country Codes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0A0A0A] flex items-center gap-1">
                    Contact Number <span className="text-[#0066FF]">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.countryCode}
                      onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                      className="w-28 px-2 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-xs font-bold text-[#0A0A0A] focus:outline-none focus:border-[#0066FF] cursor-pointer"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      placeholder="6379000598"
                      className="flex-1 px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-sm text-[#0A0A0A] focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition"
                    />
                  </div>
                </div>

                {/* Gender (Segmented Buttons: Male / Female / Other) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0A0A0A] flex items-center gap-1">
                    Gender <span className="text-[#0066FF]">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Male', 'Female', 'Other'] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: g })}
                        className={`py-2.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                          formData.gender === g
                            ? 'bg-[#050505] text-white border-[#050505] shadow-sm'
                            : 'bg-[#F8FAFC] text-[#64748B] border-[#CBD5E1] hover:bg-[#F1F5F9]'
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

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* STEP 2: COLLEGE INFORMATION                                  */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {step === 2 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-[#0A0A0A] tracking-tight">College Information</h2>
                <p className="text-xs md:text-sm text-[#64748B] mt-0.5">Your academic institution and qualification details</p>
              </div>

              <div className="space-y-4">
                {/* College Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0A0A0A] flex items-center gap-1">
                    College Full Name <span className="text-[#0066FF]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.collegeName}
                    onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                    placeholder="e.g. Mahendra Engineering College / Anna University"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-sm text-[#0A0A0A] focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition"
                  />
                </div>

                {/* Institution Category Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0A0A0A] flex items-center gap-1">
                    Institution Category / Type <span className="text-[#0066FF]">*</span>
                  </label>
                  <select
                    value={formData.institutionType}
                    onChange={(e) => setFormData({ ...formData, institutionType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-xs font-semibold text-[#0A0A0A] focus:outline-none focus:border-[#0066FF] cursor-pointer"
                  >
                    {INSTITUTION_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {formData.institutionType === 'Other Institution (Type Below)' && (
                    <input
                      type="text"
                      value={formData.customInstitutionType || ''}
                      onChange={(e) => setFormData({ ...formData, customInstitutionType: e.target.value })}
                      placeholder="Type your institution category (e.g. Deemed University, Autonomous, International)..."
                      className="w-full mt-2 px-3.5 py-2 rounded-lg border border-[#0066FF] bg-[#F0F7FF] text-xs text-[#0A0A0A] focus:outline-none"
                      autoFocus
                    />
                  )}
                </div>

                {/* State, District, City */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* State */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#0A0A0A] flex items-center gap-1">
                      State / UT <span className="text-[#0066FF]">*</span>
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
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-xs font-semibold text-[#0A0A0A] focus:outline-none focus:border-[#0066FF] cursor-pointer"
                    >
                      {ALL_INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {formData.state === 'Other / International (Type Below)' && (
                      <input
                        type="text"
                        value={formData.customState || ''}
                        onChange={(e) => setFormData({ ...formData, customState: e.target.value })}
                        placeholder="Type your state / province..."
                        className="w-full mt-1.5 px-3 py-2 rounded-lg border border-[#0066FF] bg-[#F0F7FF] text-xs text-[#0A0A0A] focus:outline-none"
                      />
                    )}
                  </div>

                  {/* District */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#0A0A0A] flex items-center gap-1">
                      District <span className="text-[#0066FF]">*</span>
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-xs font-semibold text-[#0A0A0A] focus:outline-none focus:border-[#0066FF] cursor-pointer"
                    >
                      {(DISTRICTS_BY_STATE[formData.state] || ['Other District (Type Below)']).map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                      {!DISTRICTS_BY_STATE[formData.state]?.includes('Other District (Type Below)') && (
                        <option value="Other District (Type Below)">Other District (Type Below)</option>
                      )}
                    </select>
                    {formData.district === 'Other District (Type Below)' && (
                      <input
                        type="text"
                        value={formData.customDistrict || ''}
                        onChange={(e) => setFormData({ ...formData, customDistrict: e.target.value })}
                        placeholder="Type your district..."
                        className="w-full mt-1.5 px-3 py-2 rounded-lg border border-[#0066FF] bg-[#F0F7FF] text-xs text-[#0A0A0A] focus:outline-none"
                      />
                    )}
                  </div>

                  {/* City */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#0A0A0A] flex items-center gap-1">
                      City / Campus <span className="text-[#0066FF]">*</span>
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-xs font-semibold text-[#0A0A0A] focus:outline-none focus:border-[#0066FF] cursor-pointer"
                    >
                      {POPULAR_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {formData.city === 'Other City / Campus (Type Below)' && (
                      <input
                        type="text"
                        value={formData.customCity || ''}
                        onChange={(e) => setFormData({ ...formData, customCity: e.target.value })}
                        placeholder="Type your city or campus location..."
                        className="w-full mt-1.5 px-3 py-2 rounded-lg border border-[#0066FF] bg-[#F0F7FF] text-xs text-[#0A0A0A] focus:outline-none"
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Degree */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#0A0A0A] flex items-center gap-1">
                      Degree <span className="text-[#0066FF]">*</span>
                    </label>
                    <select
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-xs font-semibold text-[#0A0A0A] focus:outline-none focus:border-[#0066FF] cursor-pointer"
                    >
                      {DEGREE_OPTIONS.map((deg) => (
                        <option key={deg} value={deg}>{deg}</option>
                      ))}
                    </select>
                    {formData.degree === 'Other Degree (Type Below)' && (
                      <input
                        type="text"
                        value={formData.customDegree || ''}
                        onChange={(e) => setFormData({ ...formData, customDegree: e.target.value })}
                        placeholder="Type your degree (e.g. B.Voc, Dual Degree)..."
                        className="w-full mt-1.5 px-3 py-2 rounded-lg border border-[#0066FF] bg-[#F0F7FF] text-xs text-[#0A0A0A] focus:outline-none"
                      />
                    )}
                  </div>

                  {/* Specialization */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#0A0A0A] flex items-center gap-1">
                      Specialization / Branch <span className="text-[#0066FF]">*</span>
                    </label>
                    <select
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-xs font-semibold text-[#0A0A0A] focus:outline-none focus:border-[#0066FF] cursor-pointer"
                    >
                      {SPECIALIZATION_OPTIONS.map((spec) => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                    {formData.specialization === 'Other Specialization (Type Below)' && (
                      <input
                        type="text"
                        value={formData.customSpecialization || ''}
                        onChange={(e) => setFormData({ ...formData, customSpecialization: e.target.value })}
                        placeholder="Type your branch / department..."
                        className="w-full mt-1.5 px-3 py-2 rounded-lg border border-[#0066FF] bg-[#F0F7FF] text-xs text-[#0A0A0A] focus:outline-none"
                      />
                    )}
                  </div>

                  {/* Year of Graduation */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#0A0A0A] flex items-center gap-1">
                      Graduation Year <span className="text-[#0066FF]">*</span>
                    </label>
                    <select
                      value={formData.graduationYear}
                      onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-xs font-bold text-[#0A0A0A] focus:outline-none focus:border-[#0066FF] cursor-pointer"
                    >
                      {GRADUATION_YEARS.map((yr) => (
                        <option key={yr} value={yr}>{yr}</option>
                      ))}
                    </select>
                    {formData.graduationYear === 'Other Year (Type Below)' && (
                      <input
                        type="text"
                        value={formData.customGraduationYear || ''}
                        onChange={(e) => setFormData({ ...formData, customGraduationYear: e.target.value })}
                        placeholder="Type graduation year (e.g. 2031)..."
                        className="w-full mt-1.5 px-3 py-2 rounded-lg border border-[#0066FF] bg-[#F0F7FF] text-xs text-[#0A0A0A] focus:outline-none"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* STEP 3: COURSE / INTERNSHIP DETAILS                           */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {step === 3 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-[#0A0A0A] tracking-tight">Program Track & Schedule</h2>
                <p className="text-xs md:text-sm text-[#64748B] mt-0.5">Select from the 12 official Atideto programs or specify your custom track</p>
              </div>

              <div className="space-y-4">
                {/* Program Track Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0A0A0A] flex items-center gap-1">
                    Selected Upskill / Internship Program <span className="text-[#0066FF]">*</span>
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
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-sm font-semibold text-[#0A0A0A] focus:outline-none focus:border-[#0066FF] cursor-pointer"
                  >
                    {WEBSITE_UPSKILL_PROGRAMS.map((prog) => (
                      <option key={prog.id} value={prog.id}>
                        {prog.title} ({prog.category})
                      </option>
                    ))}
                  </select>
                  {formData.selectedProgramId === 'other-program' && (
                    <input
                      type="text"
                      value={formData.customProgramTitle || ''}
                      onChange={(e) => setFormData({ ...formData, customProgramTitle: e.target.value })}
                      placeholder="Type your desired custom program or technology track (e.g. Embedded Systems, Rust, Blockchain)..."
                      className="w-full mt-2 px-3.5 py-2.5 rounded-lg border border-[#0066FF] bg-[#F0F7FF] text-xs text-[#0A0A0A] focus:outline-none"
                      autoFocus
                    />
                  )}
                </div>

                {/* Revisit Website Course Details Button */}
                {formData.selectedProgramId !== 'other-program' && (
                  <div className="p-3.5 rounded-xl bg-[#F0F7FF] border border-[#BFDBFE] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1E3A8A] truncate">{formData.selectedProgramTitle}</p>
                      <p className="text-[11px] text-[#64748B]">Official curriculum, syllabus, and mentoring details</p>
                    </div>
                    <a
                      href={`/upskill/${formData.selectedProgramId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs font-bold shadow-sm transition shrink-0 cursor-pointer"
                    >
                      <span>Revisit Full Details</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#0A0A0A] flex items-center gap-1">
                      Expected Batch Start Date <span className="text-[#0066FF]">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-sm text-[#0A0A0A] focus:outline-none focus:border-[#0066FF] cursor-pointer"
                    />
                    <p className="text-[11px] text-[#64748B]">Select batch start from calendar</p>
                  </div>

                  {/* Duration */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#0A0A0A] flex items-center gap-1">
                      Duration <span className="text-[#0066FF]">*</span>
                    </label>
                    <select
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-xs font-bold text-[#0A0A0A] focus:outline-none focus:border-[#0066FF] cursor-pointer"
                    >
                      {DURATION_OPTIONS.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                    {(formData.duration === 'Other' || formData.duration === 'Other Duration (Type Below)') && (
                      <input
                        type="text"
                        value={formData.customDuration || ''}
                        onChange={(e) => setFormData({ ...formData, customDuration: e.target.value })}
                        placeholder="Type custom duration (e.g. 45 Days, 120 Days, 4 Months)..."
                        className="w-full mt-1.5 px-3 py-2 rounded-lg border border-[#0066FF] bg-[#F0F7FF] text-xs text-[#0A0A0A] focus:outline-none"
                      />
                    )}
                    {/* Quick duration buttons */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['7 Days', '15 Days', '30 Days', '60 Days'].map((pill) => (
                        <button
                          key={pill}
                          type="button"
                          onClick={() => setFormData({ ...formData, duration: pill })}
                          className={`px-2 py-0.5 text-[11px] font-bold rounded border transition cursor-pointer ${
                            formData.duration === pill
                              ? 'bg-[#0066FF] text-white border-[#0066FF]'
                              : 'bg-[#F8FAFC] text-[#64748B] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                          }`}
                        >
                          {pill}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Automatic End Date Display Card */}
                <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">Calculated End Date:</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Automatic
                        </span>
                      </div>
                      <p className="text-sm font-black text-[#0A0A0A] mt-0.5">
                        {formatFriendlyDate(formData.endDate || calculatedEndDate)}
                        <span className="text-xs text-[#64748B] font-normal ml-2">({formData.endDate || calculatedEndDate})</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-[#64748B] block">Based on Start Date +</span>
                    <span className="text-xs font-bold text-emerald-700">{effectiveDuration}</span>
                  </div>
                </div>

                {/* Requirements / Objectives */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0A0A0A] flex items-center gap-1">
                    Requirements & Learning Goals <span className="text-[#64748B] font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    placeholder="Describe your prerequisites, specific tools you want to master (e.g. Next.js, PyTorch, Kubernetes), or project aspirations..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-xs text-[#0A0A0A] focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* STEP 4: PREVIEW & EDIT                                       */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {step === 4 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-[#0A0A0A] tracking-tight">Review Your Application</h2>
                <p className="text-xs md:text-sm text-[#64748B] mt-0.5">Please review your information carefully before submitting</p>
              </div>

              {/* Personal Card */}
              <div className="p-4 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] space-y-3">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#0A0A0A]">
                    <User size={16} className="text-[#0066FF]" />
                    <span>Personal Details</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-[#0066FF] hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[#64748B]">Full Name:</span>
                    <p className="font-bold text-[#0A0A0A]">{formData.fullName}</p>
                  </div>
                  <div>
                    <span className="text-[#64748B]">Email Address:</span>
                    <p className="font-bold text-[#0A0A0A] truncate">{formData.email}</p>
                  </div>
                  <div>
                    <span className="text-[#64748B]">Contact:</span>
                    <p className="font-bold text-[#0A0A0A]">{formData.countryCode} {formData.contactNumber}</p>
                  </div>
                  <div>
                    <span className="text-[#64748B]">Gender:</span>
                    <p className="font-bold text-[#0A0A0A]">{formData.gender}</p>
                  </div>
                </div>
              </div>

              {/* College Card */}
              <div className="p-4 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] space-y-3">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#0A0A0A]">
                    <GraduationCap size={16} className="text-[#0066FF]" />
                    <span>College & Academic Credentials</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs font-bold text-[#0066FF] hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="col-span-2">
                    <span className="text-[#64748B]">College Name:</span>
                    <p className="font-bold text-[#0A0A0A]">{formData.collegeName}</p>
                  </div>
                  <div>
                    <span className="text-[#64748B]">Location:</span>
                    <p className="font-bold text-[#0A0A0A]">{effectiveCity}, {effectiveDistrict}, {effectiveState}</p>
                  </div>
                  <div>
                    <span className="text-[#64748B]">Institution Type:</span>
                    <p className="font-bold text-[#0A0A0A]">{effectiveInstitutionType}</p>
                  </div>
                  <div>
                    <span className="text-[#64748B]">Degree & Branch:</span>
                    <p className="font-bold text-[#0A0A0A]">{effectiveDegree} in {effectiveSpecialization}</p>
                  </div>
                  <div>
                    <span className="text-[#64748B]">Graduation Year:</span>
                    <p className="font-bold text-[#0A0A0A]">{effectiveGraduationYear}</p>
                  </div>
                </div>
              </div>

              {/* Course Card */}
              <div className="p-4 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] space-y-3">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#0A0A0A]">
                    <BookOpen size={16} className="text-[#0066FF]" />
                    <span>Program Selection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {formData.selectedProgramId !== 'other-program' && (
                      <a
                        href={`/upskill/${formData.selectedProgramId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0066FF] hover:underline cursor-pointer"
                      >
                        <span>Revisit Details</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-xs font-bold text-[#0066FF] hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="col-span-2">
                    <span className="text-[#64748B]">Program Title:</span>
                    <p className="font-bold text-[#0A0A0A]">{effectiveProgramTitle}</p>
                  </div>
                  <div>
                    <span className="text-[#64748B]">Duration:</span>
                    <p className="font-bold text-[#0A0A0A]">{effectiveDuration}</p>
                  </div>
                  <div>
                    <span className="text-[#64748B]">Batch Start:</span>
                    <p className="font-bold text-[#0A0A0A]">{formData.startDate}</p>
                  </div>
                  <div>
                    <span className="text-[#64748B]">Calculated End Date:</span>
                    <p className="font-bold text-emerald-700">
                      {formatFriendlyDate(formData.endDate || calculatedEndDate)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#64748B]">Requirements / Goals:</span>
                    <p className="font-medium text-[#0A0A0A] italic">{formData.requirements || 'Standard Curriculum'}</p>
                  </div>
                </div>
              </div>

              {/* Declaration Checkbox */}
              <label className="flex items-start gap-3 p-3 rounded-lg border border-[#CBD5E1] bg-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#0066FF] rounded border-gray-300 focus:ring-[#0066FF] cursor-pointer"
                />
                <span className="text-xs text-[#0A0A0A] leading-relaxed">
                  I hereby declare that all information furnished above is authentic and accurate. I understand that verified certifications will be issued upon successful milestone evaluations.
                </span>
              </label>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* STEP 5: SUCCESSFUL PAGE                                      */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {step === 5 && (
            <div className="text-center py-8 px-4 max-w-xl mx-auto space-y-6">
              <div className="w-20 h-20 rounded-full bg-[#0066FF]/10 text-[#0066FF] flex items-center justify-center mx-auto border-2 border-[#0066FF]/30 shadow-lg animate-bounce">
                <CheckCircle2 size={44} />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider bg-[#0066FF] text-white uppercase">
                  Application Verified & Registered
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-[#0A0A0A] mt-3">
                  Welcome to Atideto Technologies!
                </h2>
                <p className="text-sm text-[#64748B] mt-1 max-w-md mx-auto">
                  Your internship registration has been confirmed and provisioned in the Atideto ERP management system.
                </p>
              </div>

              {/* Receipt Summary Slip */}
              <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-5 text-left text-xs space-y-3 font-mono">
                <div className="flex justify-between items-center pb-2 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">Application ID:</span>
                  <span className="font-bold text-[#0066FF] text-sm">{applicationId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">Candidate Name:</span>
                  <span className="font-bold text-[#0A0A0A]">{formData.fullName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">Program:</span>
                  <span className="font-bold text-[#0A0A0A] truncate max-w-[240px]">{formData.selectedProgramTitle}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">Duration & Start:</span>
                  <span className="font-bold text-[#0A0A0A]">{formData.duration} (Batch: {formData.startDate})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">College Institution:</span>
                  <span className="font-bold text-[#0A0A0A] truncate max-w-[240px]">{formData.collegeName}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/dashboard');
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#0066FF]/20 transition cursor-pointer"
                >
                  <BookOpen size={16} />
                  <span>Open Student Learning Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSlip}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#050505] hover:bg-[#222222] text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Download size={15} />
                  <span>Print Application Slip</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* BOTTOM STEP CONTROLS (Steps 1 to 4) */}
        {step <= 4 && (
          <div className="bg-[#FAFAFA] border-t border-[#E2E8F0] px-6 py-4 flex items-center justify-between shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(prev => prev - 1)}
                className="px-5 py-2.5 rounded-lg border border-[#CBD5E1] bg-white text-xs font-bold text-[#0A0A0A] hover:bg-[#F1F5F9] transition flex items-center gap-1.5 cursor-pointer"
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
                className="px-7 py-2.5 rounded-lg bg-[#0066FF] hover:bg-[#0052FF] text-xs font-extrabold text-white transition flex items-center gap-1.5 shadow-md shadow-[#0066FF]/20 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitApplication}
                className="px-8 py-2.5 rounded-lg bg-[#0066FF] hover:bg-[#0052FF] text-xs font-extrabold text-white transition flex items-center gap-1.5 shadow-lg shadow-[#0066FF]/20 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Application...</span>
                  </div>
                ) : (
                  <>
                    <span>Submit Registration</span>
                    <Check size={16} />
                  </>
                )}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
