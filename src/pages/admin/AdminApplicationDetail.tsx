import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Loader2,
  Award,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getApplication, updateApplicationStatus, generateCertificate, AdminApiError } from '@/lib/adminApi';
import { ALLOWED_TRANSITIONS, statusMeta } from '@/lib/statusMeta';

export default function AdminApplicationDetail() {
  const { applicationId = '' } = useParams<{ applicationId: string }>();
  const [app, setApp] = useState<ReturnType<typeof Object> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmCert, setConfirmCert] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getApplication(applicationId)
      .then((data) => {
        if (!cancelled) setApp(data);
      })
      .catch((e) => {
        if (!cancelled) setError((e as Error).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [applicationId]);

  async function changeStatus(next: string) {
    setBusy(true);
    setNotice(null);
    try {
      const updated = await updateApplicationStatus(applicationId, next);
      setApp(updated);
    } catch (e) {
      setNotice({ type: 'error', text: e instanceof AdminApiError ? e.message : 'Status update failed' });
    } finally {
      setBusy(false);
    }
  }

  async function doGenerateCertificate() {
    setBusy(true);
    setNotice(null);
    setConfirmCert(false);
    try {
      await generateCertificate(applicationId);
      setNotice({ type: 'success', text: 'Certificate generated successfully.' });
      const updated = await getApplication(applicationId);
      setApp(updated);
    } catch (e) {
      setNotice({ type: 'error', text: e instanceof AdminApiError ? e.message : 'Certificate generation failed' });
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading application...
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="space-y-4">
        <p className="text-red-600 text-sm">{error || 'Application not found'}</p>
        <Link to="/admin/applications" className="text-sm text-[#2F2FE4] inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to applications
        </Link>
      </div>
    );
  }

  const transitions = ALLOWED_TRANSITIONS[app.status] ?? [];
  const isCompleted = app.status === 'COMPLETED';

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/admin/applications" className="text-sm text-[#2F2FE4] inline-flex items-center gap-1 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to applications
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">{app.fullName}</h1>
          <p className="font-mono text-sm text-slate-500 mt-0.5">{app.applicationId}</p>
        </div>
        <Badge variant="outline" className={statusMeta(app.status).className}>
          {statusMeta(app.status).label}
        </Badge>
      </div>

      {notice && (
        <div
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
            notice.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {notice.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          <span>{notice.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Personal</h2>
          <dl className="space-y-2 text-sm">
            <Row label="Email" value={app.email} />
            <Row label="Phone" value={`${app.countryCode} ${app.phone}`} />
            <Row label="Degree" value={`${app.degree} — ${app.stream}`} />
            <Row label="Graduation Year" value={app.graduationYear} />
          </dl>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Academic</h2>
          <dl className="space-y-2 text-sm">
            <Row label="College" value={app.college} />
            <Row label="Register No." value={app.registerNo} />
            <Row label="Course" value={app.selectedCourse} />
            <Row label="Program" value={app.programTitle} />
          </dl>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Internship</h2>
          <dl className="space-y-2 text-sm">
            <Row label="Start Date" value={new Date(app.startDate).toLocaleDateString('en-IN')} />
            <Row label="End Date" value={new Date(app.endDate).toLocaleDateString('en-IN')} />
            <Row label="Duration" value={`${app.durationDays} days`} />
            <Row label="Payment" value={app.paymentOption} />
            <Row label="Report Included" value={app.reportIncluded ? 'Yes' : 'No'} />
          </dl>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Status & Email</h2>
          <dl className="space-y-2 text-sm">
            <Row label="Status" value={statusMeta(app.status).label} />
            <Row label="Email Status" value={app.emailStatus} />
            <Row label="Submitted" value={new Date(app.createdAt).toLocaleString('en-IN')} />
          </dl>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Update Status</h2>
        {transitions.length === 0 ? (
          <p className="text-sm text-slate-500">
            This is a terminal status. No further changes are allowed.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {transitions.map((next) => (
              <Button
                key={next}
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={() => changeStatus(next)}
              >
                {next.replace(/_/g, ' ')}
              </Button>
            ))}
          </div>
        )}

        {isCompleted && (
          <div className="mt-5 border-t border-slate-100 pt-4">
            <Button
              className="bg-[#2F2FE4] hover:bg-[#2828c9]"
              disabled={busy}
              onClick={() => setConfirmCert(true)}
            >
              <Award className="w-4 h-4 mr-2" /> Generate Certificate
            </Button>
          </div>
        )}
      </Card>

      <Dialog open={confirmCert} onOpenChange={setConfirmCert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Certificate?</DialogTitle>
            <DialogDescription>
              A PDF certificate with a QR code will be generated for {app.fullName}. The QR links to the
              public verification page. This advances the application to{' '}
              <strong>CERTIFICATE_GENERATED</strong> (terminal).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmCert(false)} disabled={busy}>
              Cancel
            </Button>
            <Button className="bg-[#2F2FE4] hover:bg-[#2828c9]" onClick={doGenerateCertificate} disabled={busy}>
              {busy ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Award className="w-4 h-4 mr-2" />}
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-slate-500 shrink-0">{label}</dt>
      <dd className="font-medium text-slate-800 text-right">{value}</dd>
    </div>
  );
}
