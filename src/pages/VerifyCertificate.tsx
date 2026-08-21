import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ShieldCheck, ShieldX, ShieldQuestion, Loader2, Award, CheckCircle2, User, Hash, Building, Calendar } from 'lucide-react';
import SEO from '@/components/seo/SEO';
import { CertificateCanvas } from '@/components/certificate/CertificateCanvas';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || 'https://atideto-backend-system.vercel.app';

interface VerifyResult {
  certificateId: string;
  studentName: string;
  course: string;
  college: string | null;
  registerNo?: string | null;
  startDate: string | null;
  endDate: string | null;
  duration: string | null;
  issueDate: string;
  status: string;
  verifiedCount: number;
}

type VerifyState =
  | { kind: 'loading' }
  | { kind: 'valid'; cert: VerifyResult }
  | { kind: 'revoked'; cert: VerifyResult }
  | { kind: 'notfound' }
  | { kind: 'error'; message: string };

function formatDate(value: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function VerifyCertificate() {
  const { certificateId: paramId = '' } = useParams<{ certificateId: string }>();
  const [searchParams] = useSearchParams();
  const certificateId = paramId || searchParams.get('id') || searchParams.get('certificateId') || '';
  const [state, setState] = useState<VerifyState>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      if (!certificateId) {
        setState({ kind: 'notfound' });
        return;
      }
      setState({ kind: 'loading' });
      try {
        const res = await fetch(`${API_BASE_URL}/api/certificates/verify/${encodeURIComponent(certificateId)}`, {
          headers: { Accept: 'application/json' },
        });
        const data = await res.json().catch(() => ({}));

        if (cancelled) return;

        if (res.ok && data.success) {
          const cert = data.certificate as VerifyResult;
          if (cert.status === 'revoked') {
            setState({ kind: 'revoked', cert });
          } else {
            setState({ kind: 'valid', cert });
          }
        } else if (res.status === 404) {
          setState({ kind: 'notfound' });
        } else {
          setState({ kind: 'error', message: data.message || 'Verification failed. Please try again.' });
        }
      } catch {
        if (!cancelled) {
          setState({ kind: 'error', message: 'Network error. Please check your connection and try again.' });
        }
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [certificateId]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <SEO 
        title="Verify Certificate | ATIDETO Official Credential Verification"
        description="Verify authentic completion certificates and student internship credentials issued by ATIDETO Technologies."
        url={`https://www.atideto.in/verify/${encodeURIComponent(certificateId || '')}`}
        noindex={true}
      />

      {/* Header Badge */}
      <div className="bg-slate-900 border-b border-slate-800 text-white py-6 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2F2FE4]/20 border border-[#2F2FE4]/40 flex items-center justify-center text-[#2F2FE4]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-extrabold tracking-wider text-white">ATIDETO TECHNOLOGIES</p>
              <p className="text-xs text-slate-400">Official Student Credential Verification Portal</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> MSME Registered
          </span>
        </div>
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-8 my-6">
        {state.kind === 'loading' && (
          <div className="py-24 flex flex-col items-center justify-center text-slate-500 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#2F2FE4]" />
            <p className="text-sm font-semibold">Verifying authentic certificate record {certificateId}...</p>
          </div>
        )}

        {state.kind === 'notfound' && (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 sm:p-10 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <ShieldQuestion className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Certificate Not Found</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              No certificate record matching <span className="font-mono font-bold text-slate-800">{certificateId || 'specified query'}</span> was found in the ATIDETO verification database. Please verify the ID and scan again.
            </p>
          </div>
        )}

        {state.kind === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-8 sm:p-10 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <ShieldX className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Verification Error</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{state.message}</p>
          </div>
        )}

        {(state.kind === 'valid' || state.kind === 'revoked') && (
          <div className="space-y-8 animate-fadeIn">
            {/* Status Hero Card */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left ${
                state.kind === 'valid'
                  ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-emerald-500/40 text-white'
                  : 'bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 border-red-500/40 text-white'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border ${
                    state.kind === 'valid'
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : 'bg-red-500/20 border-red-500/40 text-red-400'
                  }`}
                >
                  {state.kind === 'valid' ? <ShieldCheck className="w-10 h-10" /> : <ShieldX className="w-10 h-10" />}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span
                      className={`px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                        state.kind === 'valid'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}
                    >
                      {state.kind === 'valid' ? '✓ OFFICIALLY VERIFIED STUDENT' : '✗ REVOKED CERTIFICATE'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Verified {state.cert.verifiedCount || 1} times
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    {state.kind === 'valid' ? 'Authentic Person & Certificate Credential' : 'Invalid or Revoked Credential'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                    {state.kind === 'valid'
                      ? `This document certifies that ${state.cert.studentName} has successfully completed the ${state.cert.course} internship at ATIDETO Technologies.`
                      : 'This certificate code is revoked and is no longer an active credential.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Full Certificate Canvas Section */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-full flex items-center justify-between px-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Official Visual Certificate</span>
                <span className="font-mono text-[#2F2FE4]">{state.cert.certificateId}</span>
              </div>
              <CertificateCanvas
                id="verifiedStudentCertCanvas"
                data={{
                  studentName: state.cert.studentName,
                  course: state.cert.course,
                  college: state.cert.college || '—',
                  registerNo: state.cert.registerNo || '',
                  startDate: state.cert.startDate || '',
                  endDate: state.cert.endDate || '',
                  duration: state.cert.duration || '—',
                  issueDate: state.cert.issueDate,
                  verifyId: state.cert.certificateId,
                  qrLink: `https://www.atideto.in/verify/${encodeURIComponent(state.cert.certificateId)}`,
                }}
              />
            </div>

            {/* Member & Internship Breakdown Grid */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Verified Student & Internship Breakdown
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#2F2FE4]" /> Verified Student
                  </span>
                  <p className="font-extrabold text-sm text-slate-900">{state.cert.studentName}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-[#2F2FE4]" /> Certificate ID
                  </span>
                  <p className="font-mono font-bold text-sm text-[#2F2FE4]">{state.cert.certificateId}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#2F2FE4]" /> Program / Domain
                  </span>
                  <p className="font-bold text-sm text-slate-900">{state.cert.course}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-[#2F2FE4]" /> Institution
                  </span>
                  <p className="font-bold text-sm text-slate-900">{state.cert.college || '—'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#2F2FE4]" /> Internship Period
                  </span>
                  <p className="font-medium text-xs text-slate-700">
                    {formatDate(state.cert.startDate)} — {formatDate(state.cert.endDate)}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#2F2FE4]" /> Duration
                  </span>
                  <p className="font-medium text-xs text-slate-700">
                    {state.cert.duration ? `${state.cert.duration} Days` : '—'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#2F2FE4]" /> Issue Date
                  </span>
                  <p className="font-medium text-xs text-slate-700">{formatDate(state.cert.issueDate)}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2F2FE4]" /> Status
                  </span>
                  <p className={`font-bold text-xs ${state.kind === 'valid' ? 'text-emerald-700' : 'text-red-700'}`}>
                    {state.kind === 'valid' ? 'Active & Authentic' : 'Revoked'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
