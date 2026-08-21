import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ShieldCheck, ShieldX, ShieldQuestion, Loader2, Award, CheckCircle2 } from 'lucide-react';
import SEO from '@/components/seo/SEO';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || 'https://atideto-backend-system.vercel.app';

interface VerifyResult {
  certificateId: string;
  studentName: string;
  course: string;
  college: string | null;
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

  const resultCard = (status: VerifyState['kind'], cert?: VerifyResult) => {
    const isValid = status === 'valid';
    const isRevoked = status === 'revoked';
    const icon = isRevoked ? <ShieldX className="w-12 h-12 text-red-500" /> : isValid ? <ShieldCheck className="w-12 h-12 text-emerald-500" /> : <ShieldQuestion className="w-12 h-12 text-amber-500" />;
    const title = isRevoked ? 'CERTIFICATE REVOKED' : isValid ? 'VERIFIED AUTHENTIC PERSON & CERTIFICATE' : 'CERTIFICATE NOT FOUND';
    const text = isRevoked
      ? 'This certificate has been revoked by Atideto Technologies and is no longer valid.'
      : isValid
        ? `This certificate is authentic and officially issued by Atideto Technologies to ${cert?.studentName || 'the student'}.`
        : 'No certificate was found for this ID. Please check the certificate number and try again.';

    const qrUrl = `https://atideto-certificate-system.vercel.app/studentverify?id=${encodeURIComponent(cert?.certificateId || '')}`;
    const qrImgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=6&data=${encodeURIComponent(qrUrl)}`;

    return (
      <div
        className={`w-full max-w-2xl rounded-2xl border p-6 sm:p-8 shadow-sm ${
          isRevoked
            ? 'border-red-200 bg-red-50/50'
            : isValid
              ? 'border-emerald-200 bg-emerald-50/50'
              : 'border-amber-200 bg-amber-50/50'
        }`}
      >
        <div className="flex flex-col items-center gap-3 text-center mb-6">
          {icon}
          <h1 className={`text-xl sm:text-2xl font-bold tracking-wide ${isRevoked ? 'text-red-600' : isValid ? 'text-emerald-600' : 'text-amber-600'}`}>
            {title}
          </h1>
          <p className="text-sm text-slate-600 max-w-md">{text}</p>
          {isValid && cert && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified Person • {cert.verifiedCount || 1} Scans/Verifications
            </div>
          )}
        </div>

        {cert && (
          <div className="space-y-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm bg-white/80 p-5 rounded-xl border border-slate-200/60">
              <Detail label="Verified Person (Student)" value={cert.studentName} />
              <Detail label="Certificate ID" value={cert.certificateId} mono />
              <Detail label="Program / Course" value={cert.course} />
              <Detail label="College / Institution" value={cert.college || '—'} />
              <Detail label="Internship Period" value={`${formatDate(cert.startDate)} — ${formatDate(cert.endDate)}`} />
              <Detail label="Duration" value={cert.duration ? `${cert.duration} days` : '—'} />
              <Detail label="Issue Date" value={formatDate(cert.issueDate)} />
              <Detail label="Status" value={isValid ? 'Active / Authentic' : 'Revoked'} />
            </dl>

            {isValid && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200 text-center sm:text-left">
                <div className="flex items-center gap-3">
                  <img src={qrImgSrc} alt="Verification QR" className="w-16 h-16 rounded border p-1 bg-white shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Scan to Verify Certificate</p>
                    <p className="text-[11px] text-slate-500">Scan this QR code anytime to verify authentic holder status</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 bg-slate-50">
      <SEO 
        title="Verify Certificate | ATIDETO Official Credential Verification"
        description="Verify authentic completion certificates and student internship credentials issued by ATIDETO Technologies."
        url={`https://www.atideto.in/verify/${encodeURIComponent(certificateId || '')}`}
        noindex={true}
      />
      <div className="flex items-center gap-3 mb-8">
        <Award className="w-8 h-8 text-[#2F2FE4]" />
        <div>
          <p className="text-sm font-semibold text-[#2F2FE4] tracking-wide uppercase">ATIDETO TECHNOLOGIES</p>
          <p className="text-xs text-slate-500">Certificate Verification</p>
        </div>
      </div>

      {state.kind === 'loading' && (
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#2F2FE4]" />
          <p className="text-sm">Verifying certificate {certificateId}...</p>
        </div>
      )}

      {state.kind === 'valid' && resultCard('valid', state.cert)}
      {state.kind === 'revoked' && resultCard('revoked', state.cert)}
      {state.kind === 'notfound' && resultCard('notfound')}

      {state.kind === 'error' && (
        <div className="w-full max-w-xl rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center">
          <p className="text-red-600 font-semibold mb-2">Verification error</p>
          <p className="text-sm text-slate-600">{state.message}</p>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">{label}</dt>
      <dd className={`font-medium text-slate-800 ${mono ? 'font-mono text-[#2F2FE4]' : ''}`}>{value}</dd>
    </div>
  );
}
