import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  GraduationCap,
  Hash,
  Loader2,
  Mail,
  Phone,
  QrCode,
  ShieldCheck,
  Sparkles,
  User
} from 'lucide-react';
import { toast } from 'sonner';

import { formatStudentName } from '@/lib/nameFormatter';
import { submitRegistrationToDb } from '@/lib/api';
import {
  getQrCampaign,
  submitQrForm,
  type QrCampaign
} from '@/lib/qrStore';
import {
  STANDARD_DOMAINS,
  needsCustomDomain
} from '@/constants/internshipDomains';
import {
  calculateAutomaticEndDate,
  DEGREE_OPTIONS,
  DURATION_OPTIONS,
  SPECIALIZATION_OPTIONS
} from '@/constants/registrationOptions';

const COUNTRY_CODES = [
  { code: '+91', label: 'IN +91' },
  { code: '+1', label: 'US +1' },
  { code: '+44', label: 'UK +44' },
  { code: '+61', label: 'AU +61' },
  { code: '+971', label: 'AE +971' },
  { code: '+65', label: 'SG +65' },
  { code: '+49', label: 'DE +49' },
  { code: '+33', label: 'FR +33' },
  { code: '+81', label: 'JP +81' }
];

const MODES = ['Industrial Hybrid', 'Online', 'Offline / On-campus'];

interface SelectOption {
  value: string;
  label: string;
}

const toOptions = (values: string[]): SelectOption[] => values.map(value => ({ value, label: value }));

const GENDER_OPTIONS = toOptions(['Male', 'Female', 'Other', 'Prefer not to say']);
const MODE_OPTIONS = toOptions(MODES);
const DEGREE_SELECT_OPTIONS = toOptions(DEGREE_OPTIONS);
const DEPARTMENT_SELECT_OPTIONS = toOptions(SPECIALIZATION_OPTIONS);
const DURATION_SELECT_OPTIONS: SelectOption[] = DURATION_OPTIONS
  .filter(option => option.value !== 'Other')
  .map(option => ({ value: option.value, label: option.label }));
const DOMAIN_SELECT_OPTIONS: SelectOption[] = [
  ...STANDARD_DOMAINS.map(domain => ({ value: domain, label: domain })),
  { value: 'Other', label: 'Other / Custom domain' }
];
const COUNTRY_SELECT_OPTIONS: SelectOption[] = COUNTRY_CODES.map(country => ({
  value: country.code,
  label: country.label
}));

const OTHER_DEGREE = 'Other Degree (Type Below)';
const OTHER_SPECIALIZATION = 'Other Specialization (Type Below)';

interface FormState {
  fullName: string;
  gender: string;
  email: string;
  countryCode: string;
  phone: string;
  collegeName: string;
  registerNo: string;
  degree: string;
  customDegree: string;
  department: string;
  customDepartment: string;
  academicBatch: string;
  domain: string;
  customDomain: string;
  mode: string;
  startDate: string;
  duration: string;
}

const today = () => new Date().toISOString().slice(0, 10);

const formatDisplayDate = (iso: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  return match ? `${match[3]}-${match[2]}-${match[1]}` : iso;
};

const initialForm = (collegeName = ''): FormState => ({
  fullName: '',
  gender: 'Male',
  email: '',
  countryCode: '+91',
  phone: '',
  collegeName,
  registerNo: '',
  degree: '',
  customDegree: '',
  department: '',
  customDepartment: '',
  academicBatch: '',
  domain: '',
  customDomain: '',
  mode: MODES[0],
  startDate: today(),
  duration: '30 Days'
});

const labelClass = 'text-[11px] font-extrabold uppercase tracking-wider text-slate-500';
const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base font-medium text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 sm:text-sm';

export default function QrRegistration() {
  const { qrId = '' } = useParams<{ qrId: string }>();
  const [campaign, setCampaign] = useState<QrCampaign | null>(null);
  const [loadingCampaign, setLoadingCampaign] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState<FormState>(() => initialForm());
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{
    name: string;
    applicationId: string;
    domain: string;
    college: string;
    batch: string;
  } | null>(null);

  useEffect(() => {
    document.title = 'Internship Registration | Atideto Technologies';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    window.scrollTo(0, 0);
    return () => {
      robots.remove();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!qrId) {
        setNotFound(true);
        setLoadingCampaign(false);
        return;
      }
      const found = await getQrCampaign(qrId);
      if (cancelled) return;
      if (!found) {
        setNotFound(true);
      } else {
        setCampaign(found);
        setForm(prev => ({ ...prev, collegeName: found.collegeName || prev.collegeName }));
      }
      setLoadingCampaign(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [qrId]);

  const endDate = useMemo(
    () => calculateAutomaticEndDate(form.startDate, form.duration),
    [form.startDate, form.duration]
  );

  const update = (patch: Partial<FormState>) => setForm(prev => ({ ...prev, ...patch }));

  const resolvedDegree = form.degree === OTHER_DEGREE ? form.customDegree.trim() : form.degree;
  const resolvedDepartment =
    form.department === OTHER_SPECIALIZATION ? form.customDepartment.trim() : form.department;
  const resolvedDomain = needsCustomDomain(form.domain) ? form.customDomain.trim() : form.domain;

  const validate = (): string | null => {
    const name = formatStudentName(form.fullName);
    if (name.split(' ').join('').length < 2) return 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Please enter a valid email address.';
    if (form.phone.replace(/\D/g, '').length < 7) return 'Please enter a valid mobile number.';
    if (!form.collegeName.trim()) return 'Please enter your college name.';
    if (!form.registerNo.trim()) return 'Please enter your register / roll number.';
    if (!resolvedDegree) return 'Please select your degree.';
    if (!resolvedDepartment) return 'Please select your department / specialization.';
    if (!form.academicBatch.trim()) return 'Please enter your academic batch (e.g. 2022 - 2026).';
    if (!resolvedDomain) return 'Please select or type your internship domain.';
    if (!form.startDate) return 'Please choose your preferred start date.';
    if (!form.duration) return 'Please choose a duration.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    setSubmitting(true);
    const name = formatStudentName(form.fullName);
    const fullPhone = `${form.countryCode} ${form.phone.replace(/\s+/g, '')}`.trim();
    const stamp = Date.now().toString(36).toUpperCase();
    const regId = `AT-REG-2026-${stamp}`;
    const studentId = `AT-STU-2026-${stamp}`;

    // QR submission is the critical write — it powers the admin dashboard.
    try {
      await submitQrForm({
        qrId,
        fullName: name,
        gender: form.gender,
        email: form.email.trim().toLowerCase(),
        countryCode: form.countryCode,
        phone: fullPhone,
        collegeName: form.collegeName.trim(),
        degree: resolvedDegree,
        department: resolvedDepartment,
        registerNo: form.registerNo.trim(),
        academicBatch: form.academicBatch.trim(),
        domain: resolvedDomain,
        mode: form.mode,
        startDate: form.startDate,
        endDate,
        duration: form.duration,
        attendancePct: 100,
        amount: campaign?.amount,
        studentId,
        imported: false
      });
    } catch (err) {
      console.error('Failed to save QR submission:', err);
      toast.error('Could not save your application. Please check your connection and try again.');
      setSubmitting(false);
      return;
    }

    setSubmitted({
      name,
      applicationId: regId,
      domain: resolvedDomain,
      college: form.collegeName.trim(),
      batch: form.academicBatch.trim()
    });
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Secondary sync into the registrations feed — intentionally not awaited so
    // a slow/offline API can never block the student's confirmation screen.
    submitRegistrationToDb({
      regId,
      studentId,
      studentName: name,
      email: form.email.trim().toLowerCase(),
      phone: fullPhone,
      college: form.collegeName.trim(),
      degree: resolvedDegree,
      gradYear: form.academicBatch.split(/[-–/]/).pop()?.trim() || '',
      course: resolvedDomain,
      domain: resolvedDomain,
      startDate: form.startDate,
      endDate,
      duration: form.duration,
      mode: form.mode,
      notes: `QR Registration | ${qrId} | Dept: ${resolvedDepartment} | Reg No: ${form.registerNo} | Batch: ${form.academicBatch}`
    }).catch(() => {
      /* registration feed sync is best-effort */
    });
  };

  if (loadingCampaign) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#0B1220] text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <p className="text-sm font-semibold text-blue-100">Loading registration form…</p>
        </div>
      </div>
    );
  }

  if (notFound || !campaign) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#0B1220] px-5 py-12">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-xl font-black text-slate-900">This QR code is not active</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            The registration link may have expired or been removed. Please contact your placement
            cell or the Atideto team for a fresh link.
          </p>
          <a
            href="https://atideto.in"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Visit atideto.in <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#0B1220] pb-16">
      {/* Brand header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#0B1220] via-[#12224A] to-[#1E3A8A] px-5 pb-24 pt-8 text-white">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <QrCode className="h-6 w-6 text-blue-300" />
            </div>
            <div>
              <p className="text-lg font-black leading-tight tracking-tight">Atideto Technologies</p>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-200">
                Verified Internship Registration
              </p>
            </div>
          </div>

          <h1 className="mt-8 text-2xl font-black leading-tight sm:text-3xl">
            {campaign.label || 'Internship Application'}
          </h1>
          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-blue-100">
            <Building2 className="h-4 w-4 text-blue-300" />
            {campaign.collegeName}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-100 ring-1 ring-white/15">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
              Free registration · Takes 2 minutes
            </div>
            {Number(campaign.amount) > 0 && (
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-100 ring-1 ring-emerald-300/30">
                Internship fee ₹{Number(campaign.amount).toLocaleString('en-IN')}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="relative mx-auto -mt-16 w-full max-w-2xl px-4 sm:px-6">
        {submitted ? (
          <div className="rounded-3xl border border-emerald-100 bg-white p-7 shadow-2xl sm:p-9">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-center text-2xl font-black text-slate-900">
              Application received!
            </h2>
            <p className="mt-2 text-center text-sm font-medium text-slate-500">
              Thanks, {submitted.name.split(' ').slice(0, 1).join(' ')}. Your internship registration
              has been submitted successfully.
            </p>

            <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
              {[
                ['Application ID', submitted.applicationId],
                ['Domain', submitted.domain],
                ['College', submitted.college],
                ['Academic batch', submitted.batch]
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4 text-sm">
                  <span className="font-bold uppercase tracking-wide text-slate-400">{label}</span>
                  <span className="max-w-[62%] text-right font-bold text-slate-900">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
              <p className="flex items-start gap-2 text-[13px] font-semibold leading-relaxed text-blue-900">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                Your details are now with the Atideto placement team. Offer letter, certificate and
                attendance updates will be shared by email.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSubmitted(null);
                setForm(initialForm(campaign.collegeName));
              }}
              className="mt-6 w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
            >
              Register another student
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-center gap-2 rounded-2xl bg-blue-50 px-4 py-3 text-[12px] font-semibold text-blue-900 ring-1 ring-blue-100">
              <Sparkles className="h-4 w-4 shrink-0 text-blue-600" />
              Fill in your details exactly as they should appear on your offer letter and certificate.
            </div>

            {/* Personal */}
            <section className="space-y-4">
              <SectionHeading icon={User} title="Personal details" step="01" />
              <div>
                <label className={labelClass}>Full name *</label>
                <input
                  value={form.fullName}
                  onChange={e => update({ fullName: e.target.value })}
                  onBlur={e => update({ fullName: formatStudentName(e.target.value) })}
                  placeholder="e.g. Madhan K"
                  autoComplete="name"
                  className={`${inputClass} mt-1.5`}
                />
                {form.fullName.trim() && (
                  <p className="mt-1.5 text-[11px] font-semibold text-slate-400">
                    Certificate name: <span className="text-slate-700">{formatStudentName(form.fullName)}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Gender</label>
                  <SelectMenu
                    className="mt-1.5"
                    value={form.gender}
                    onChange={value => update({ gender: value })}
                    options={GENDER_OPTIONS}
                    placeholder="Select gender"
                  />
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <div className="relative mt-1.5">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => update({ email: e.target.value })}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Mobile number *</label>
                <div className="mt-1.5 flex gap-2">
                  <SelectMenu
                    className="w-28 shrink-0"
                    compact
                    value={form.countryCode}
                    onChange={value => update({ countryCode: value })}
                    options={COUNTRY_SELECT_OPTIONS}
                    placeholder="Code"
                  />
                  <div className="relative flex-1">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      inputMode="tel"
                      value={form.phone}
                      onChange={e => update({ phone: e.target.value })}
                      placeholder="98765 43210"
                      autoComplete="tel"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* College */}
            <section className="mt-8 space-y-4">
              <SectionHeading icon={GraduationCap} title="College details" step="02" />
              <div>
                <label className={labelClass}>College name *</label>
                <input
                  value={form.collegeName}
                  onChange={e => update({ collegeName: e.target.value })}
                  placeholder="Your college name"
                  className={`${inputClass} mt-1.5`}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Register / Roll number *</label>
                  <div className="relative mt-1.5">
                    <Hash className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={form.registerNo}
                      onChange={e => update({ registerNo: e.target.value })}
                      placeholder="e.g. 621523205084"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Academic batch *</label>
                  <div className="relative mt-1.5">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={form.academicBatch}
                      onChange={e => update({ academicBatch: e.target.value })}
                      placeholder="e.g. 2022 - 2026"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Degree *</label>
                  <SelectMenu
                    className="mt-1.5"
                    value={form.degree}
                    onChange={value => update({ degree: value })}
                    options={DEGREE_SELECT_OPTIONS}
                    placeholder="Select degree"
                    searchable
                  />
                  {form.degree === OTHER_DEGREE && (
                    <input
                      value={form.customDegree}
                      onChange={e => update({ customDegree: e.target.value })}
                      placeholder="Type your degree"
                      className={`${inputClass} mt-2`}
                    />
                  )}
                </div>
                <div>
                  <label className={labelClass}>Department / Specialization *</label>
                  <SelectMenu
                    className="mt-1.5"
                    value={form.department}
                    onChange={value => update({ department: value })}
                    options={DEPARTMENT_SELECT_OPTIONS}
                    placeholder="Select department"
                    searchable
                  />
                  {form.department === OTHER_SPECIALIZATION && (
                    <input
                      value={form.customDepartment}
                      onChange={e => update({ customDepartment: e.target.value })}
                      placeholder="Type your department"
                      className={`${inputClass} mt-2`}
                    />
                  )}
                </div>
              </div>
            </section>

            {/* Internship */}
            <section className="mt-8 space-y-4">
              <SectionHeading icon={BookOpen} title="Internship details" step="03" />
              <div>
                <label className={labelClass}>Internship domain *</label>
                <SelectMenu
                  className="mt-1.5"
                  value={needsCustomDomain(form.domain) ? 'Other' : form.domain}
                  onChange={value => {
                    if (value === 'Other') update({ domain: 'Other' });
                    else update({ domain: value, customDomain: '' });
                  }}
                  options={DOMAIN_SELECT_OPTIONS}
                  placeholder="Select internship domain"
                  searchable
                />
                {needsCustomDomain(form.domain) && (
                  <input
                    value={form.customDomain}
                    onChange={e => update({ customDomain: e.target.value })}
                    placeholder="Type your internship domain"
                    className={`${inputClass} mt-2`}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Preferred start date *</label>
                  <div className="relative mt-1.5">
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={e => update({ startDate: e.target.value })}
                      onClick={e => {
                        try {
                          e.currentTarget.showPicker?.();
                        } catch {
                          /* browsers may block showPicker on synthetic clicks */
                        }
                      }}
                      className={`${inputClass} qr-date-input cursor-pointer pr-10 [color-scheme:light]`}
                    />
                    <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Duration *</label>
                  <SelectMenu
                    className="mt-1.5"
                    value={form.duration}
                    onChange={value => update({ duration: value })}
                    options={DURATION_SELECT_OPTIONS}
                    placeholder="Select duration"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Mode</label>
                  <SelectMenu
                    className="mt-1.5"
                    value={form.mode}
                    onChange={value => update({ mode: value })}
                    options={MODE_OPTIONS}
                    placeholder="Select mode"
                  />
                </div>
                <div>
                  <label className={labelClass}>Expected end date</label>
                  <div className="relative mt-1.5">
                    <input
                      value={formatDisplayDate(endDate)}
                      readOnly
                      className={`${inputClass} cursor-default bg-slate-50 pr-10 text-slate-500`}
                    />
                    <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>
            </section>

            <button
              type="submit"
              disabled={submitting}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Submitting application…
                </>
              ) : (
                <>
                  Submit registration <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            <p className="mt-3 text-center text-[11px] font-medium leading-relaxed text-slate-400">
              By submitting you agree to be contacted by Atideto Technologies about this internship.
            </p>
          </form>
        )}
      </main>

      <footer className="mx-auto mt-8 max-w-2xl px-4 text-center text-[11px] font-semibold text-blue-200/60 sm:px-6">
        Powered by Atideto Technologies · atideto.in
      </footer>
    </div>
  );
}

function SelectMenu({
  value,
  onChange,
  options,
  placeholder = 'Select',
  className = '',
  compact = false,
  searchable = false
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  compact?: boolean;
  searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selected = options.find(option => option.value === value) || null;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(option => option.label.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }
    const handlePointer = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('touchstart', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('touchstart', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={`relative ${open ? 'z-40' : ''} ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(current => !current)}
        className={`${inputClass} flex cursor-pointer items-center justify-between gap-2 text-left ${
          compact ? '!px-2.5 !py-2.5 !text-xs' : ''
        } ${selected ? 'text-slate-900' : 'text-slate-400'} ${
          open ? 'border-blue-600 ring-2 ring-blue-100' : ''
        }`}
      >
        <span className="min-w-0 flex-1 truncate">{selected?.label || placeholder}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-150 ${
            open ? 'rotate-180 text-blue-600' : ''
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className={`absolute z-50 mt-1.5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 animate-in fade-in slide-in-from-top-1 duration-150 ${
            compact ? 'left-0 w-44' : 'left-0 right-0'
          }`}
        >
          {searchable && (
            <div className="border-b border-slate-100 p-2">
              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Enter') event.preventDefault();
                }}
                placeholder="Search…"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-base font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 sm:text-xs"
              />
            </div>
          )}

          <div className="max-h-56 overflow-y-auto overscroll-contain py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-3 text-center text-xs font-semibold text-slate-400">
                No matches found
              </p>
            ) : (
              filtered.map(option => {
                const active = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-start justify-between gap-2 px-3 py-2.5 text-left text-[13px] font-semibold leading-snug transition ${
                      active
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-50 active:bg-slate-100'
                    }`}
                  >
                    <span className="min-w-0 whitespace-normal">{option.label}</span>
                    {active && <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  step
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  step: string;
}) {
  return (
    <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
        <Icon className="h-4 w-4" />
      </span>
      <div className="flex flex-1 items-baseline justify-between">
        <h2 className="text-sm font-black text-slate-900">{title}</h2>
        <span className="text-[11px] font-black tracking-widest text-slate-300">{step}</span>
      </div>
    </div>
  );
}
