import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShieldCheck, ShieldX, ShieldQuestion, Loader2, Award } from 'lucide-react';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';

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
  const { certificateId = '' } = useParams<{ certificateId: string }>();
  const [state, setState] = useState<VerifyState>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;

    async function verify() {
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
    const title = isRevoked ? 'CERTIFICATE REVOKED' : isValid ? 'CERTIFICATE VALID' : 'CERTIFICATE NOT FOUND';
    const text = isRevoked
      ? 'This certificate has been revoked by Atideto Technologies and is no longer valid.'
      : isValid
        ? 'This certificate was issued by Atideto Technologies and is authentic.'
        : 'No certificate was found for this ID. Please check the certificate number and try again.';

    return (
      <div
        className={`w-full max-w-2xl rounded-2xl border p-8 shadow-sm ${
          isRevoked
            ? 'border-red-200 bg-red-50/50'
            : isValid
              ? 'border-emerald-200 bg-emerald-50/50'
              : 'border-amber-200 bg-amber-50/50'
        }`}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          {icon}
          <h1 className={`text-2xl font-bold tracking-wide ${isRevoked ? 'text-red-600' : isValid ? 'text-emerald-600' : 'text-amber-600'}`}>
            {title}
          </h1>
          <p className="text-sm text-slate-600 max-w-md">{text}</p>
        </div>

        {cert && (
          <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <Detail label="Certificate ID" value={cert.certificateId} mono />
            <Detail label="Student" value={cert.studentName} />
            <Detail label="Program / Course" value={cert.course} />
            <Detail label="College" value={cert.college || '—'} />
            <Detail label="Start Date" value={formatDate(cert.startDate)} />
            <Detail label="End Date" value={formatDate(cert.endDate)} />
            <Detail label="Duration" value={cert.duration ? `${cert.duration} days` : '—'} />
            <Detail label="Issue Date" value={formatDate(cert.issueDate)} />
          </dl>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 bg-slate-50">
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
