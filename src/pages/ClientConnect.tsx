import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Check, Zap, Shield, Users, User, Building2,
  Sparkles, Wallet, LayoutDashboard, CalendarClock, Orbit, ClipboardList,
  MessageSquare, ShieldCheck, ArrowRight, CheckCircle2,
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

import ClientInformation from './client-connect/components/ClientInformation';
import BusinessInformation from './client-connect/components/BusinessInformation';
import ServiceSelection from './client-connect/components/ServiceSelection';
import ProjectInformation from './client-connect/components/ProjectInformation';
import BudgetTime from './client-connect/components/BudgetTime';
import MeetingType from './client-connect/components/MeetingType';
import ReviewSubmit from './client-connect/components/ReviewSubmit';
import ThankYouPage from './client-connect/components/ThankYouPage';
import ProjectIntakeWindow from './client-connect/components/ProjectIntakeWindow';
import { formatClientEmail } from '@/lib/emailFormatter';
import SEO from '@/components/seo/SEO';
import './client-connect.css';

const STEPS_TITLES = [
  'Contact Information',
  'Project Requirements',
  'Budget & Timeline',
  'Review & Submit'
];

const STEP_META = [
  { icon: Users, title: 'Contact Information', desc: 'Tell us who you are and about your company' },
  { icon: LayoutDashboard, title: 'Project Requirements', desc: 'Scope, tech stack & supporting files' },
  { icon: CalendarClock, title: 'Budget & Timeline', desc: 'Investment, timeline & how we connect' },
  { icon: CheckCircle2, title: 'Review & Submit', desc: 'Confirm your inquiry & privacy consent' },
];

interface FormValues {
  // Step 1 — Contact
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  company: string;
  businessEmail: string;
  website: string;
  // Step 2 — Project
  services: string[];
  otherServiceDetails: string;
  description: string;
  designStatus: string;
  aiIntegrations: string;
  techStack: string[];
  attachments: File[];
  // Step 3 — Budget & Timeline
  budget: string;
  customBudgetDetails: string;
  timeline: string;
  customTimelineDetails: string;
  meetingType: string;
  meetingDate: string;
  meetingTime: string;
  // Step 4 — Review
  privacyAccepted: boolean;
}

const HERO_FEATURES = [
  { icon: Zap, text: 'Response within 24 hours' },
  { icon: Shield, text: 'Privacy-first, NDA on request' },
  { icon: Users, text: 'Dedicated Project Manager' },
];

const INFO_CARDS = [
  { icon: Shield, title: 'Privacy First', desc: 'Your information is encrypted and never shared with third parties.' },
  { icon: Zap, title: '24-Hour Response', desc: 'A dedicated project manager responds with a tailored proposal.' },
  { icon: Users, title: 'Dedicated PM', desc: 'One point of contact guides you from kickoff to delivery.' },
];

export default function ClientConnect() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [submitError, setSubmitError] = useState('');

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
      privacyAccepted: false
    },
    mode: 'onChange'
  });

  const values = watch();

  useEffect(() => {
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
    if (canStepProceed() && step < 3) {
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

  const goToStep = (s: number) => {
    if (s >= 0 && s <= 3 && s < step) {
      setDirection(-1);
      setStep(s);
    }
  };

  const canStepProceed = () => {
    if (step === 0) {
      return !!(
        values.name && values.email && values.phone &&
        values.company && values.businessEmail &&
        !errors.name && !errors.email && !errors.phone &&
        !errors.company && !errors.businessEmail
      );
    }
    if (step === 1) {
      return !!(
        values.services && values.services.length > 0 &&
        values.description && !errors.description
      );
    }
    if (step === 2) {
      if (!values.budget || !values.timeline || !values.meetingType) return false;
      if (values.budget === 'Custom Budget' && !values.customBudgetDetails) return false;
      if (values.timeline === 'Custom Timeline' && !values.customTimelineDetails) return false;
      if (values.meetingType === 'Offline' && (!values.meetingDate || !values.meetingTime)) return false;
      return true;
    }
    if (step === 3) {
      return values.privacyAccepted === true;
    }
    return true;
  };

  const progress = ((step + 1) / 4) * 100;

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const generatedId = `ATD-${Date.now().toString().slice(-6)}`;

      const email = formatClientEmail(data as unknown as Record<string, any>);

      await addDoc(collection(db, 'project_inquiries'), {
        requestId: generatedId,
        createdAt: serverTimestamp(),
        name: data.name,
        email: data.email,
        countryCode: data.countryCode,
        phone: data.phone,
        company: data.company,
        businessEmail: data.businessEmail,
        website: data.website || '',
        services: data.services,
        otherServiceDetails: data.otherServiceDetails || '',
        description: data.description,
        designStatus: data.designStatus || '',
        aiIntegrations: data.aiIntegrations || '',
        techStack: data.techStack,
        budget: data.budget,
        customBudgetDetails: data.customBudgetDetails || '',
        timeline: data.timeline,
        customTimelineDetails: data.customTimelineDetails || '',
        meetingType: data.meetingType,
        meetingDate: data.meetingDate || '',
        meetingTime: data.meetingTime || '',
        privacyAccepted: data.privacyAccepted === true,
        emailHtml: email.html,
        emailText: email.text,
        emailSubject: email.subject,
        status: 'new',
      });

      try {
        await addDoc(collection(db, 'mail'), {
          to: [
            'kiranbalasopatil33@gmail.com',
            'vishnurajan24766@gmail.com',
            'yogeshbrf2006@gmail.com',
          ],
          message: {
            subject: email.subject,
            html: email.html,
            text: email.text,
          },
          createdAt: serverTimestamp(),
        });
      } catch (mailErr) {
        console.warn("Email queue write failed (non-blocking):", mailErr);
      }

      setRequestId(generatedId);
      setSubmitted(true);
      toast.success('Project inquiry submitted successfully! We\'ll get back to you within 24 hours.');
    } catch (error: any) {
      console.error("Error saving to Firebase:", error);
      const msg = error?.code === 'permission-denied'
        ? 'Firebase security rules are blocking writes. Go to Firebase Console → Firestore → Rules and set `allow read, write: if true;` for testing.'
        : `Failed to submit: ${error?.message || 'Unknown error'}`;
      setSubmitError(msg);
      toast.error('Submission failed. Check the error message below.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(0);
    setSubmitted(false);
    setRequestId('');
    setSubmitError('');
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
    setValue('meetingType', '');
    setValue('meetingDate', '');
    setValue('meetingTime', '');
    setValue('privacyAccepted', false);
  };

  return (
    <div className="contact-page relative text-[color:var(--cc-white)] overflow-x-hidden">
      <SEO
        title="Start Your Project | ATIDETO"
        description="Tell us about your vision. We'll craft a tailored proposal and set up your project dashboard within 24 hours."
        url="https://atideto.in/client-connect"
      />

      {/* Layered animated background */}
      <div className="cc-bg" aria-hidden="true">
        <div className="cc-bg-mesh" />
        <div className="cc-bg-grid" />
        <div className="cc-bg-orbits">
          <div className="cc-bg-orbit o1" />
          <div className="cc-bg-orbit o2" />
          <div className="cc-bg-orbit o3" />
        </div>
        <div className="cc-bg-noise" />
        <div className="cc-bg-vignette" />
      </div>

      {!submitted ? (
        <>
          {/* ============ HERO ============ */}
          <section className="cc-hero">
            <div className="cc-hero-left">
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="cc-badge"
              >
                <i /> Client Connect · Project Intake
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08 }}
              >
                Let&apos;s Build Your <span className="grad">Next Digital</span> Product
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.16 }}
                className="cc-hero-sub"
              >
                Tell us about your vision. We&apos;ll craft a tailored proposal,
                assign a dedicated project manager, and set up your project
                dashboard within 24 hours.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.24 }}
                className="cc-features"
              >
                {HERO_FEATURES.map((f) => (
                  <div className="cc-feature" key={f.text}>
                    <span className="tick"><f.icon /></span>
                    {f.text}
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.32 }}
                className="cc-hero-cta"
              >
                <a href="#cc-wizard" className="cc-btn-primary">
                  Start Your Project <ArrowRight />
                </a>
                <a href="/services" className="cc-btn-ghost">
                  Explore Services
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="cc-trust"
              >
                <div className="avatars" aria-hidden="true">
                  <span style={{ background: '#2F2FE4' }}>K</span>
                  <span style={{ background: '#4F46E5' }}>V</span>
                  <span style={{ background: '#2EA8FF' }}>S</span>
                  <span style={{ background: '#00D26A' }}>N</span>
                </div>
                <span>Trusted by <b>250+</b> founders &amp; teams worldwide</span>
              </motion.div>
            </div>

            {/* Right visual: project intake workspace window */}
            <div className="cc-hero-visual" aria-hidden="true">
              <ProjectIntakeWindow />
            </div>
          </section>

          {/* ============ WIZARD ============ */}
          <section id="cc-wizard" className="cc-wizard">
            {/* Horizontal journey nav */}
            <nav
              className="cc-journey"
              style={{ '--p': `${progress}` } as React.CSSProperties}
              aria-label="Project setup progress"
            >
              {STEP_META.map((s, i) => {
                const isActive = i === step;
                const isDone = i < step;
                return (
                  <button
                    key={i}
                    type="button"
                    className={`cc-jstep ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                    onClick={() => goToStep(i)}
                    disabled={i > step}
                  >
                    <span className="index">
                      {isDone ? <Check /> : <s.icon />}
                    </span>
                    <span className="txt">
                      <b>{s.title}</b>
                      <small>{s.desc}</small>
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="cc-panel">
              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence initial={false}>
                  {!submitted && (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {/* Progress bar */}
                      <div className="cc-progress-top">
                        <div className="cc-progress-meta">
                          <span>Step {step + 1} of 4</span>
                          <b>{Math.round(progress)}%</b>
                        </div>
                        <div className="cc-progress-track">
                          <motion.i
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>
                      </div>

                      {/* Panel heading */}
                      <div className="cc-panel-head">
                        <div className="kicker">
                          {(() => {
                            const StepIcon = STEP_META[step].icon;
                            return <StepIcon />;
                          })()} {STEP_META[step].title}
                        </div>
                        <h2>{STEPS_TITLES[step]}</h2>
                        <p>{STEP_META[step].desc} — we keep this short &amp; focused.</p>
                      </div>

                      {submitError && (
                        <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm text-center">
                          {submitError}
                        </div>
                      )}

                      {/* Steps container */}
                      <div className="cc-step-body">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={step}
                            initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                          >
                            {step === 0 && (
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                <div>
                                  <div className="cc-subhead">
                                    <span className="ic"><User /></span>
                                    <span className="tx">
                                      <b>Your Details</b>
                                      <small>Who should we reach out to?</small>
                                    </span>
                                  </div>
                                  <ClientInformation register={register} errors={errors} values={values} />
                                </div>
                                <div>
                                  <div className="cc-subhead">
                                    <span className="ic"><Building2 /></span>
                                    <span className="tx">
                                      <b>Business Information</b>
                                      <small>About your company</small>
                                    </span>
                                  </div>
                                  <BusinessInformation register={register} errors={errors} values={values} />
                                </div>
                              </div>
                            )}

                            {step === 1 && (
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                <div className="space-y-6">
                                  <div>
                                    <div className="cc-subhead">
                                      <span className="ic"><Sparkles /></span>
                                      <span className="tx">
                                        <b>What We&apos;ll Build</b>
                                        <small>Select the services you need</small>
                                      </span>
                                    </div>
                                    <ServiceSelection
                                      selectedServices={values.services || []}
                                      onToggleService={toggleService}
                                      register={register}
                                    />
                                  </div>
                                  <div>
                                    <ProjectInformation
                                      register={register}
                                      errors={errors}
                                      control={control}
                                      selectedServices={values.services || []}
                                      showDescriptionOnly={true}
                                    />
                                  </div>
                                </div>
                                <div className="space-y-6">
                                  <div className="cc-subhead">
                                    <span className="ic"><LayoutDashboard /></span>
                                    <span className="tx">
                                      <b>Project Scope &amp; Assets</b>
                                      <small>Stack, questions &amp; supporting files</small>
                                    </span>
                                  </div>
                                  <ProjectInformation
                                    register={register}
                                    errors={errors}
                                    control={control}
                                    selectedServices={values.services || []}
                                    showAssetsOnly={true}
                                  />
                                </div>
                              </div>
                            )}

                            {step === 2 && (
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                <div>
                                  <div className="cc-subhead">
                                    <span className="ic"><Wallet /></span>
                                    <span className="tx">
                                      <b>Budget &amp; Timeline</b>
                                      <small>Investment &amp; availability</small>
                                    </span>
                                  </div>
                                  <BudgetTime
                                    setValue={setValue}
                                    watch={watch}
                                    register={register}
                                  />
                                </div>
                                <div>
                                  <div className="cc-subhead">
                                    <span className="ic"><CalendarClock /></span>
                                    <span className="tx">
                                      <b>How We&apos;ll Connect</b>
                                      <small>Meeting preference</small>
                                    </span>
                                  </div>
                                  <MeetingType
                                    setValue={setValue}
                                    watch={watch}
                                    register={register}
                                    errors={errors}
                                    onAutoAdvance={next}
                                  />
                                </div>
                              </div>
                            )}

                            {step === 3 && (
                              <ReviewSubmit
                                formValues={values}
                                goToStep={(s) => {
                                  setDirection(-1);
                                  setStep(s);
                                }}
                                isSubmitting={isSubmitting}
                                submitError={submitError}
                                register={register}
                                errors={errors}
                                privacyAccepted={values.privacyAccepted === true}
                              />
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      {/* Bottom nav */}
                      <div className="cc-nav">
                        {step > 0 && (
                          <button
                            type="button"
                            onClick={prev}
                            disabled={isSubmitting}
                            className="cc-nav-back"
                          >
                            <ChevronLeft /> Previous
                          </button>
                        )}
                        <div style={{ flex: 1 }} />
                        {step < 3 && (
                          <button
                            type="button"
                            onClick={next}
                            disabled={!canStepProceed() || isSubmitting}
                            className="cc-nav-next"
                          >
                            Next Step <ChevronRight />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </section>

          {/* ============ INFO CARDS ============ */}
          <section className="cc-info-grid">
            {INFO_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="cc-info-card"
              >
                <div className="i-ic"><card.icon /></div>
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </section>
        </>
      ) : (
        /* ============ THANK YOU ============ */
        <div className="cc-success-card">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <ThankYouPage requestId={requestId} formValues={values} onReset={resetForm} />
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
