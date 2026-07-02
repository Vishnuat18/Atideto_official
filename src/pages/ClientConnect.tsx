import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

import ClientInformation from './client-connect/components/ClientInformation';
import BusinessInformation from './client-connect/components/BusinessInformation';
import ServiceSelection from './client-connect/components/ServiceSelection';
import ProjectInformation from './client-connect/components/ProjectInformation';
import BudgetTime from './client-connect/components/BudgetTime';
import MeetingType from './client-connect/components/MeetingType';
import ReviewSubmit from './client-connect/components/ReviewSubmit';
import ThankYouPage from './client-connect/components/ThankYouPage';
import RibbonBackground from './about/components/RibbonBackground';

const STEPS_TITLES = [
  'Client Information',
  'Business Information',
  'What kind of work are you interested in?',
  'Project Information',
  'Budget & Time',
  'Meeting Type',
  'Review & Submit'
];

interface FormValues {
  // Step 1
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  // Step 2
  company: string;
  businessEmail: string;
  website: string;
  // Step 3
  services: string[];
  otherServiceDetails: string;
  // Step 4
  description: string;
  designStatus: string;
  aiIntegrations: string;
  techStack: string[];
  attachments: File[];
  // Step 5
  budget: string;
  customBudgetDetails: string;
  timeline: string;
  customTimelineDetails: string;
  // Step 6
  meetingType: string;
  meetingDate: string;
  meetingTime: string;
}

export default function ClientConnect() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      countryCode: '+91',
      services: [],
      techStack: [],
      attachments: [],
      meetingType: 'Online'
    },
    mode: 'onChange'
  });

  const values = watch();

  useEffect(() => {
    // Scroll reset to top on mount
    window.scrollTo(0, 0);
  }, []);

  const toggleService = (service: string) => {
    const currentServices = values.services || [];
    if (currentServices.includes(service)) {
      setValue(
        'services',
        currentServices.filter((s) => s !== service)
      );
    } else {
      setValue('services', [...currentServices, service]);
    }
  };

  const next = () => {
    if (canStepProceed() && step < 6) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  };

  const prev = () => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  const canStepProceed = () => {
    if (step === 0) {
      return !!(values.name && values.email && values.phone && !errors.name && !errors.email && !errors.phone);
    }
    if (step === 1) {
      return !!(values.company && values.businessEmail && !errors.company && !errors.businessEmail);
    }
    if (step === 2) {
      return values.services && values.services.length > 0;
    }
    if (step === 3) {
      return !!(values.description && !errors.description);
    }
    if (step === 4) {
      if (!values.budget || !values.timeline) return false;
      if (values.budget === 'Custom Budget' && !values.customBudgetDetails) return false;
      if (values.timeline === 'Custom Timeline' && !values.customTimelineDetails) return false;
      return true;
    }
    if (step === 5) {
      if (!values.meetingType) return false;
      if (values.meetingType === 'Offline' && (!values.meetingDate || !values.meetingTime)) return false;
      return true;
    }
    return true;
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const generatedId = `ATD-${Date.now().toString().slice(-6)}`;
      
      // Save to Firebase Firestore
      await addDoc(collection(db, 'project_inquiries'), {
        requestId: generatedId,
        createdAt: serverTimestamp(),
        // Client Info
        name: data.name,
        email: data.email,
        countryCode: data.countryCode,
        phone: data.phone,
        // Business Info
        company: data.company,
        businessEmail: data.businessEmail,
        website: data.website || '',
        // Services
        services: data.services,
        otherServiceDetails: data.otherServiceDetails || '',
        // Project Info
        description: data.description,
        designStatus: data.designStatus || '',
        aiIntegrations: data.aiIntegrations || '',
        techStack: data.techStack,
        // Budget & Timeline
        budget: data.budget,
        customBudgetDetails: data.customBudgetDetails || '',
        timeline: data.timeline,
        customTimelineDetails: data.customTimelineDetails || '',
        // Meeting
        meetingType: data.meetingType,
        meetingDate: data.meetingDate || '',
        meetingTime: data.meetingTime || '',
        // Meta
        status: 'new',
      });

      setRequestId(generatedId);
      console.log("SUCCESSFULLY STORED PROJECT REQUEST IN FIREBASE:", generatedId);
    } catch (error) {
      console.error("Error saving to Firebase:", error);
    }

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const resetForm = () => {
    setStep(0);
    setSubmitted(false);
    setRequestId('');
    setValue('name', '');
    setValue('email', '');
    setValue('phone', '');
    setValue('company', '');
    setValue('businessEmail', '');
    setValue('website', '');
    setValue('services', []);
    setValue('otherServiceDetails', '');
    setValue('description', '');
    setValue('designStatus', '');
    setValue('aiIntegrations', '');
    setValue('techStack', []);
    setValue('attachments', []);
    setValue('budget', '');
    setValue('customBudgetDetails', '');
    setValue('timeline', '');
    setValue('customTimelineDetails', '');
    setValue('meetingType', 'Online');
    setValue('meetingDate', '');
    setValue('meetingTime', '');
  };

  return (
    <div 
      className="min-h-screen pt-16 pb-20 relative text-white font-sans overflow-x-hidden flex flex-col justify-between selection:bg-[#5B5EFF]/30"
      style={{
        background: 'radial-gradient(circle at center, #08103E 0%, #050A30 30%, #050505 70%, #030303 100%)'
      }}
    >
      {/* Subtle vignette and noise textures */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.6))] pointer-events-none z-0" />
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none z-0" 
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }} 
      />

      {/* Hero Section with Ribbon Background */}
      {!submitted && (
        <div className="relative w-full overflow-hidden py-12 lg:py-20 border-b border-white/5 mb-12">
          <RibbonBackground />
          
          <header className="relative z-10 max-w-[1400px] mx-auto px-6 flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#5B5EFF]/30 bg-[#5B5EFF]/10 text-[#5B5EFF] text-xs font-bold tracking-[0.2em] uppercase mb-6"
            >
              Client Connect
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-white"
            >
              Start Your <span className="text-[#5B5EFF]">Project</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-[#AFAFAF] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              Tell us about your vision. We'll craft a tailored proposal and set up your dashboard within 24 hours.
            </motion.p>
          </header>
        </div>
      )}

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex-1 flex flex-col justify-center">
        
        {!submitted ? (
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col justify-center">
            
            {/* Header + Nav Arrows Row */}
            <div className="flex items-center justify-between max-w-4xl mx-auto mb-16 relative w-full">
              {/* Previous Arrow */}
              <button
                type="button"
                onClick={prev}
                disabled={step === 0 || isSubmitting}
                className="w-[42px] h-[42px] flex items-center justify-center rounded-full border border-[#5B5EFF]/30 text-[#5B5EFF] hover:border-[#5B5EFF] hover:shadow-[0_0_15px_rgba(91,94,255,0.4)] disabled:opacity-0 disabled:pointer-events-none transition-all duration-300 transform hover:scale-[1.08] cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Step Title */}
              <h1 className="text-[28px] md:text-[52px] font-bold text-white text-center leading-tight tracking-tight px-4 flex-1">
                {STEPS_TITLES[step]}
              </h1>

              {/* Next Arrow */}
              <button
                type="button"
                onClick={next}
                disabled={step === 6 || !canStepProceed() || isSubmitting}
                className="w-[42px] h-[42px] flex items-center justify-center rounded-full border border-[#5B5EFF]/30 text-[#5B5EFF] hover:border-[#5B5EFF] hover:shadow-[0_0_15px_rgba(91,94,255,0.4)] disabled:opacity-0 disabled:pointer-events-none transition-all duration-300 transform hover:scale-[1.08] cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Steps Container */}
            <div className="flex-1 flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="w-full"
                >
                  {step === 0 && <ClientInformation register={register} errors={errors} />}
                  {step === 1 && <BusinessInformation register={register} errors={errors} />}
                  {step === 2 && (
                    <ServiceSelection
                      selectedServices={values.services || []}
                      onToggleService={toggleService}
                      register={register}
                    />
                  )}
                  {step === 3 && (
                    <ProjectInformation
                      register={register}
                      errors={errors}
                      control={control}
                      selectedServices={values.services || []}
                    />
                  )}
                  {step === 4 && (
                    <BudgetTime 
                      setValue={setValue} 
                      watch={watch} 
                      register={register} 
                      onAutoAdvance={next} 
                    />
                  )}
                  {step === 5 && (
                    <MeetingType 
                      setValue={setValue} 
                      watch={watch} 
                      register={register} 
                      errors={errors} 
                      onAutoAdvance={next} 
                    />
                  )}
                  {step === 6 && (
                    <ReviewSubmit
                      formValues={values}
                      goToStep={(s) => {
                        setDirection(-1);
                        setStep(s);
                      }}
                      isSubmitting={isSubmitting}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Navigation Buttons */}
            <div className="flex justify-between items-center max-w-2xl mx-auto mt-12 pt-6 border-t border-white/5 w-full relative z-20">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={prev}
                  disabled={isSubmitting}
                  className="px-8 h-[58px] rounded-full border border-[#5B5EFF]/40 text-white font-semibold hover:border-[#5B5EFF] hover:shadow-[0_0_15px_rgba(91,94,255,0.2)] hover:scale-[1.03] transition-all duration-300 cursor-pointer flex items-center justify-center bg-transparent"
                >
                  &larr; Previous Step
                </button>
              ) : (
                <div />
              )}

              {step < 6 ? (
                <button
                  type="button"
                  onClick={next}
                  disabled={!canStepProceed() || isSubmitting}
                  className="px-10 h-[58px] rounded-full bg-gradient-to-r from-[#5B5EFF] to-[#3A3DFF] text-white font-bold hover:shadow-[0_0_25px_rgba(91,94,255,0.4)] transition-all duration-300 hover:scale-[1.02] disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center justify-center"
                >
                  Next Step &rarr;
                </button>
              ) : (
                <div />
              )}
            </div>
            
          </form>
        ) : (
          /* Thank You Page */
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full flex-1 flex flex-col justify-center"
            >
              <ThankYouPage requestId={requestId} formValues={values} onReset={resetForm} />
            </motion.div>
          </AnimatePresence>
        )}

      </div>
    </div>
  );
}
