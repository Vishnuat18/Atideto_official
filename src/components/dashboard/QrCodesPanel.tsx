import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Edit2,
  ExternalLink,
  GraduationCap,
  Link2,
  Loader2,
  Mail,
  Phone,
  Plus,
  QrCode,
  RefreshCw,
  Save,
  Search,
  Trash2,
  UserPlus,
  Users,
  X
} from 'lucide-react';
import { toast } from 'sonner';

import {
  addStudentToRegistry,
  saveStoredStudents,
  updateStudentInRegistry,
  type StudentCohortRecord
} from '@/lib/certificateStore';
import { saveCloudStudents } from '@/lib/cloudSync';
import { formatStudentName } from '@/lib/nameFormatter';
import {
  buildQrPosterDataUrl,
  createQrDataUrl,
  downloadDataUrl,
  sanitizeFileSegment
} from '@/lib/qrPoster';
import {
  createQrCampaign,
  deleteQrCampaign,
  deleteQrSubmission,
  fetchQrCampaigns,
  fetchQrSubmissions,
  getQrFormUrl,
  markQrSubmissionImported,
  updateQrSubmission,
  type QrCampaign,
  type QrSubmission
} from '@/lib/qrStore';
import { calculateAutomaticEndDate } from '@/constants/registrationOptions';

const emptyCreateForm = { collegeName: '', label: '', amount: '' };

function formatRupees(value?: number): string {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return '';
  return `₹${num.toLocaleString('en-IN')}`;
}

function toStudentRecord(sub: QrSubmission, amount?: number): Partial<StudentCohortRecord> {
  const id = sub.studentId || `AT-QR-${sub.id.toUpperCase()}`;
  const batchEnd = sub.academicBatch.split(/[-–/]/).pop()?.trim() || '';
  const fee = Number(amount ?? sub.amount);
  const hasFee = Number.isFinite(fee) && fee > 0;
  return {
    id,
    studentId: id,
    registerNumber: sub.registerNo || id,
    name: sub.fullName,
    email: sub.email,
    phone: sub.phone,
    college: sub.collegeName,
    degree: sub.degree,
    department: sub.department,
    gradYear: batchEnd,
    academicBatch: sub.academicBatch,
    gender: sub.gender,
    course: sub.domain,
    domain: sub.domain,
    startDate: sub.startDate,
    endDate: sub.endDate,
    duration: sub.duration,
    createdAt: sub.submittedAt || new Date().toISOString(),
    mentor: 'Atideto Internship Team',
    attendance: Number(sub.attendancePct) || 100,
    score: 95,
    feePaid: '₹0',
    feeTotal: hasFee ? formatRupees(fee) : 'To Be Decided by Admin',
    paymentStatus: hasFee ? 'Payment Due' : 'Pending Admin Decision',
    status: 'active',
    tools: ['React', 'Node.js', 'Express', 'MongoDB'],
    area: ['Full Stack', 'Web Development']
  };
}

async function persistRegistry(list: StudentCohortRecord[]) {
  try {
    saveStoredStudents(list);
  } catch {
    /* local mirror */
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('atideto-students-updated', { detail: list }));
  }
  try {
    await saveCloudStudents(list);
  } catch {
    /* cloud will retry on next sync */
  }
}

export default function QrCodesPanel() {
  const [campaigns, setCampaigns] = useState<QrCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [creating, setCreating] = useState(false);

  const [selected, setSelected] = useState<QrCampaign | null>(null);
  const [submissions, setSubmissions] = useState<QrSubmission[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [search, setSearch] = useState('');

  const [qrDataUrl, setQrDataUrl] = useState('');
  const [qrLoading, setQrLoading] = useState(false);
  const [posterBusyId, setPosterBusyId] = useState('');

  const [detail, setDetail] = useState<QrSubmission | null>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<QrSubmission | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [importingId, setImportingId] = useState('');
  const [importingAllId, setImportingAllId] = useState('');

  const loadCampaigns = async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);
    try {
      const list = await fetchQrCampaigns();
      setCampaigns(list);
    } catch {
      toast.error('Could not load QR campaigns');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
    const timer = setInterval(() => loadCampaigns(), 20000);
    return () => clearInterval(timer);
  }, []);

  const selectedId = selected?.id || '';

  useEffect(() => {
    if (!selectedId) {
      setQrDataUrl('');
      setQrLoading(false);
      return;
    }
    let cancelled = false;
    setQrLoading(true);
    setQrDataUrl('');
    createQrDataUrl(getQrFormUrl(selectedId))
      .then(url => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) toast.error('Could not render QR code');
      })
      .finally(() => {
        if (!cancelled) setQrLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    const timer = setInterval(async () => {
      const fresh = await fetchQrSubmissions(selectedId);
      setSubmissions(prev => (fresh.length !== prev.length ? fresh : prev));
    }, 15000);
    return () => clearInterval(timer);
  }, [selectedId]);

  const stats = useMemo(() => {
    const totalSubmissions = campaigns.reduce((sum, c) => sum + (Number(c.submissionCount) || 0), 0);
    return {
      campaigns: campaigns.length,
      submissions: totalSubmissions,
      active: campaigns.filter(c => c.active !== false).length
    };
  }, [campaigns]);

  const filteredSubmissions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return submissions;
    return submissions.filter(s =>
      [s.fullName, s.email, s.registerNo, s.domain, s.collegeName, s.academicBatch]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(q))
    );
  }, [submissions, search]);

  const openCampaign = async (campaign: QrCampaign) => {
    setSelected(campaign);
    setDetail(null);
    setEditing(false);
    setEditForm(null);
    setSearch('');
    setLoadingSubs(true);
    try {
      const list = await fetchQrSubmissions(campaign.id);
      setSubmissions(list);
    } catch {
      toast.error('Could not load submissions');
    } finally {
      setLoadingSubs(false);
    }
  };

  const closeCampaign = () => {
    setSelected(null);
    setDetail(null);
    setEditing(false);
    setEditForm(null);
    setSubmissions([]);
    setSearch('');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.collegeName.trim()) {
      toast.error('Please enter the college name');
      return;
    }
    setCreating(true);
    try {
      const amount = Number(createForm.amount);
      const campaign = await createQrCampaign({
        collegeName: createForm.collegeName,
        label: createForm.label,
        amount: Number.isFinite(amount) && amount > 0 ? amount : undefined
      });
      setCampaigns(prev => [campaign, ...prev]);
      setCreateOpen(false);
      setCreateForm(emptyCreateForm);
      toast.success('QR code created. Share the link or download the poster.');
      await openCampaign(campaign);
      await loadCampaigns();
    } catch {
      toast.error('Could not create QR code');
    } finally {
      setCreating(false);
    }
  };

  const handleCopyLink = async (qrId: string) => {
    const url = getQrFormUrl(qrId);
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Registration link copied');
    } catch {
      window.prompt('Copy this registration link:', url);
    }
  };

  const handleDownloadPoster = async (campaign: QrCampaign) => {
    setPosterBusyId(campaign.id);
    try {
      const url = getQrFormUrl(campaign.id);
      const qr = await createQrDataUrl(url);
      const poster = await buildQrPosterDataUrl({
        collegeName: campaign.collegeName,
        label: campaign.label,
        amount: campaign.amount,
        url,
        qrDataUrl: qr
      });
      downloadDataUrl(
        poster,
        `${sanitizeFileSegment(campaign.collegeName)}-internship-qr.png`
      );
      toast.success('QR poster downloaded');
    } catch {
      toast.error('Could not generate QR poster');
    } finally {
      setPosterBusyId('');
    }
  };

  const handleDeleteCampaign = async (campaign: QrCampaign) => {
    const ok = window.confirm(
      `Delete the QR campaign for "${campaign.collegeName}"?\n\nThis removes the poster link and all ${campaign.submissionCount} submissions collected through it.`
    );
    if (!ok) return;
    await deleteQrCampaign(campaign.id);
    setCampaigns(prev => prev.filter(c => c.id !== campaign.id));
    if (selected?.id === campaign.id) closeCampaign();
    toast.success('QR campaign deleted');
  };

  const importSubmissions = async (
    list: QrSubmission[],
    amount: number | undefined,
    sourceLabel: string
  ) => {
    const pending = list.filter(sub => !sub.imported);
    if (pending.length === 0) {
      toast.success(`All students from ${sourceLabel} are already in the student list`);
      return;
    }

    let registry: StudentCohortRecord[] = [];
    const imported: QrSubmission[] = [];

    for (const sub of pending) {
      const studentId = sub.studentId || `AT-QR-${sub.id.toUpperCase()}`;
      const record = {
        ...toStudentRecord(sub, sub.amount ?? amount),
        id: studentId,
        studentId
      };
      registry = addStudentToRegistry(record);
      registry = updateStudentInRegistry(studentId, {
        college: sub.collegeName,
        academicBatch: sub.academicBatch,
        department: sub.department,
        gender: sub.gender,
        mode: sub.mode,
        registerNumber: sub.registerNo || studentId,
        name: sub.fullName,
        createdAt: sub.submittedAt || new Date().toISOString()
      });
      await markQrSubmissionImported(sub, studentId);
      imported.push({ ...sub, studentId, imported: true });
    }

    await persistRegistry(registry);
    const importedById = new Map(imported.map(sub => [sub.id, sub]));
    setSubmissions(prev =>
      prev.map(sub => {
        const next = importedById.get(sub.id);
        return next ? { ...sub, studentId: next.studentId, imported: true } : sub;
      })
    );
    toast.success(
      `${imported.length} student${imported.length === 1 ? '' : 's'} imported from ${sourceLabel}`
    );
  };

  const handleImportAllForCampaign = async (campaign: QrCampaign) => {
    setImportingAllId(campaign.id);
    try {
      const list = await fetchQrSubmissions(campaign.id);
      await importSubmissions(list, campaign.amount, campaign.collegeName);
      await loadCampaigns();
    } catch {
      toast.error('Could not import the students from this QR campaign');
    } finally {
      setImportingAllId('');
    }
  };

  const handleImport = async (sub: QrSubmission) => {
    setImportingId(sub.id);
    try {
      const studentId = sub.studentId || `AT-QR-${sub.id.toUpperCase()}`;
      const record = { ...toStudentRecord(sub, sub.amount ?? selected?.amount), id: studentId, studentId };
      let list = addStudentToRegistry(record);
      list = updateStudentInRegistry(studentId, {
        college: sub.collegeName,
        academicBatch: sub.academicBatch,
        department: sub.department,
        gender: sub.gender,
        mode: sub.mode,
        registerNumber: sub.registerNo || studentId,
        name: sub.fullName,
        createdAt: sub.submittedAt || new Date().toISOString()
      });
      await persistRegistry(list);
      await markQrSubmissionImported(sub, studentId);

      const nextSub = { ...sub, studentId, imported: true };
      setSubmissions(prev => prev.map(s => (s.id === sub.id ? nextSub : s)));
      setDetail(prev => (prev && prev.id === sub.id ? nextSub : prev));
      toast.success(`${sub.fullName} added to the student registry`);
    } catch {
      toast.error('Could not import this student');
    } finally {
      setImportingId('');
    }
  };

  const startEdit = (sub: QrSubmission) => {
    setEditing(true);
    setEditForm({ ...sub });
  };

  const handleSaveEdit = async () => {
    if (!editForm) return;
    const name = formatStudentName(editForm.fullName);
    if (!name) {
      toast.error('Student name cannot be empty');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSavingEdit(true);
    const next: QrSubmission = {
      ...editForm,
      fullName: name,
      endDate: calculateAutomaticEndDate(editForm.startDate, editForm.duration) || editForm.endDate
    };
    try {
      await updateQrSubmission(next);
      if (next.studentId) {
        const list = updateStudentInRegistry(next.studentId, {
          name: next.fullName,
          email: next.email,
          phone: next.phone,
          college: next.collegeName,
          degree: next.degree,
          department: next.department,
          gradYear: next.academicBatch.split(/[-–/]/).pop()?.trim() || '',
          academicBatch: next.academicBatch,
          gender: next.gender,
          course: next.domain,
          domain: next.domain,
          registerNumber: next.registerNo,
          startDate: next.startDate,
          endDate: next.endDate,
          duration: next.duration
        });
        await persistRegistry(list);
      }
      setSubmissions(prev => prev.map(s => (s.id === next.id ? next : s)));
      setDetail(next);
      setEditing(false);
      setEditForm(null);
      toast.success('Student details updated');
    } catch {
      toast.error('Could not save changes');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteSubmission = async (sub: QrSubmission) => {
    const ok = window.confirm(`Delete the submission from "${sub.fullName}"?`);
    if (!ok) return;
    await deleteQrSubmission(sub);
    setSubmissions(prev => prev.filter(s => s.id !== sub.id));
    if (detail?.id === sub.id) {
      setDetail(null);
      setEditing(false);
      setEditForm(null);
    }
    setCampaigns(prev =>
      prev.map(c =>
        c.id === sub.qrId
          ? { ...c, submissionCount: Math.max(0, (Number(c.submissionCount) || 0) - 1) }
          : c
      )
    );
    if (selected?.id === sub.qrId) {
      setSelected(prev =>
        prev ? { ...prev, submissionCount: Math.max(0, (Number(prev.submissionCount) || 0) - 1) } : prev
      );
    }
    toast.success('Submission deleted');
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-black tracking-tight text-[#0F172A] sm:text-3xl">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0066FF] text-white shadow-sm">
              <QrCode size={20} />
            </span>
            QR Registration Codes
          </h1>
          <p className="mt-1 text-xs font-medium text-[#64748B] sm:text-sm">
            Create a college-specific QR, collect student details, and import them into the ERP.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadCampaigns(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-xs font-bold text-[#475569] shadow-xs transition hover:border-slate-300 hover:text-slate-900"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0066FF] px-4 py-2.5 text-xs font-black text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
          >
            <Plus size={15} /> New QR Code
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <StatCard icon={<QrCode size={16} />} label="Campaigns" value={stats.campaigns} tone="blue" />
        <StatCard icon={<Users size={16} />} label="Submissions" value={stats.submissions} tone="emerald" />
        <StatCard icon={<CheckCircle2 size={16} />} label="Active" value={stats.active} tone="amber" />
      </div>

      {/* Campaign list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white py-20">
          <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
          <p className="mt-3 text-sm font-semibold text-slate-500">Loading QR campaigns…</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <QrCode size={28} />
          </div>
          <h3 className="mt-4 text-base font-black text-slate-900">No QR codes yet</h3>
          <p className="mx-auto mt-1 max-w-md text-sm font-medium text-slate-500">
            Create a QR for a college. Students scan it, fill the form on their phone, and their
            details appear here instantly.
          </p>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
          >
            <Plus size={16} /> Create your first QR
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {campaigns.map(campaign => (
            <div
              key={campaign.id}
              className="group flex flex-col rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-xs transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                    <GraduationCap size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-black text-[#0F172A]" title={campaign.collegeName}>
                      {campaign.collegeName}
                    </h3>
                    <p className="truncate text-[11.5px] font-semibold text-[#64748B]">
                      {campaign.label || 'Internship Registration'}
                    </p>
                    {campaign.amount ? (
                      <p className="truncate text-[11px] font-bold text-emerald-600">
                        {formatRupees(campaign.amount)} internship fee
                      </p>
                    ) : null}
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                    campaign.active === false
                      ? 'bg-slate-100 text-slate-500'
                      : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                  }`}
                >
                  {campaign.active === false ? 'Paused' : 'Live'}
                </span>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Submissions</p>
                  <p className="text-2xl font-black leading-tight text-[#0F172A]">
                    {Number(campaign.submissionCount) || 0}
                  </p>
                </div>
                <p className="text-[11px] font-semibold text-slate-400">
                  {campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : ''}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-1.5 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => openCampaign(campaign)}
                  className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-[11.5px] font-black text-white transition hover:bg-slate-800"
                >
                  View students
                </button>
                <button
                  type="button"
                  onClick={() => handleImportAllForCampaign(campaign)}
                  disabled={importingAllId === campaign.id || (Number(campaign.submissionCount) || 0) === 0}
                  title="Import all students from this QR into the student list"
                  className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {importingAllId === campaign.id ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <UserPlus size={15} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleCopyLink(campaign.id)}
                  title="Copy registration link"
                  className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Link2 size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadPoster(campaign)}
                  title="Download QR poster"
                  className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  {posterBusyId === campaign.id ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Download size={15} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteCampaign(campaign)}
                  title="Delete campaign"
                  className="rounded-lg border border-slate-200 p-2 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create modal */}
      {createOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-[#0F172A]">New QR Registration</h2>
                <p className="mt-0.5 text-xs font-medium text-slate-500">
                  One QR per college keeps submissions organised.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  College name *
                </label>
                <input
                  value={createForm.collegeName}
                  onChange={e => setCreateForm(prev => ({ ...prev, collegeName: e.target.value }))}
                  placeholder="e.g. Mahendra College of Engineering"
                  autoFocus
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  Poster heading / label
                </label>
                <input
                  value={createForm.label}
                  onChange={e => setCreateForm(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g. Internship Drive 2026"
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  Internship amount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  value={createForm.amount}
                  onChange={e => setCreateForm(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="e.g. 15000"
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
                <p className="mt-1 text-[10.5px] font-medium text-slate-400">
                  Applied as the total internship fee when students from this QR are imported.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0066FF] px-4 py-2.5 text-xs font-black text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {creating ? <Loader2 size={14} className="animate-spin" /> : <QrCode size={14} />}
                {creating ? 'Creating…' : 'Generate QR'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Campaign drawer */}
      {selected && (
        <div className="fixed inset-0 z-[110] flex justify-end bg-black/40 backdrop-blur-[2px]">
          <div className="flex h-full w-full max-w-3xl flex-col overflow-hidden bg-[#F8FAFC] shadow-2xl">
            {/* Drawer header */}
            <div className="flex items-start justify-between gap-3 border-b border-[#E2E8F0] bg-white px-4 py-3.5 sm:px-6">
              <div className="flex min-w-0 items-center gap-2">
                {detail && (
                  <button
                    type="button"
                    onClick={() => {
                      setDetail(null);
                      setEditing(false);
                      setEditForm(null);
                    }}
                    className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                    title="Back to submissions"
                  >
                    <ArrowLeft size={16} />
                  </button>
                )}
                <div className="min-w-0">
                  <h2 className="truncate text-base font-black text-[#0F172A]">
                    {detail ? detail.fullName : selected.collegeName}
                  </h2>
                  <p className="truncate text-[11.5px] font-semibold text-slate-500">
                    {detail
                      ? `${detail.domain} · ${detail.academicBatch}`
                      : `${selected.label || 'Internship Registration'} · ${Math.max(Number(selected.submissionCount) || 0, submissions.length)} submissions${selected.amount ? ` · ${formatRupees(selected.amount)} fee` : ''}`}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                {!detail && (
                  <>
                    <button
                      type="button"
                      onClick={async () => {
                        setImportingAllId(selected.id);
                        try {
                          await importSubmissions(submissions, selected.amount, selected.collegeName);
                          await loadCampaigns();
                        } catch {
                          toast.error('Could not import the students from this QR campaign');
                        } finally {
                          setImportingAllId('');
                        }
                      }}
                      disabled={importingAllId === selected.id || submissions.every(sub => sub.imported)}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[11px] font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {importingAllId === selected.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <UserPlus size={13} />
                      )}
                      Import all
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyLink(selected.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Copy size={13} /> Copy link
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadPoster(selected)}
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-bold text-white transition hover:bg-slate-800"
                    >
                      {posterBusyId === selected.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Download size={13} />
                      )}
                      Poster
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={closeCampaign}
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {detail ? (
                <SubmissionDetail
                  submission={detail}
                  campaignAmount={selected?.amount}
                  editing={editing}
                  editForm={editForm}
                  saving={savingEdit}
                  importing={importingId === detail.id}
                  onChange={patch =>
                    setEditForm(prev => (prev ? { ...prev, ...patch } : prev))
                  }
                  onStartEdit={() => startEdit(detail)}
                  onCancelEdit={() => {
                    setEditing(false);
                    setEditForm(null);
                  }}
                  onSave={handleSaveEdit}
                  onImport={() => handleImport(detail)}
                  onDelete={() => handleDeleteSubmission(detail)}
                />
              ) : (
                <div className="space-y-4 p-4 sm:p-6">
                  {/* QR preview */}
                  <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-start">
                    <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-2">
                      {qrLoading ? (
                        <Loader2 size={26} className="animate-spin text-blue-500" />
                      ) : qrDataUrl ? (
                        <img src={qrDataUrl} alt="QR code" className="h-full w-full object-contain" />
                      ) : (
                        <QrCode size={40} className="text-slate-300" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 text-center sm:text-left">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                        Public registration link
                      </p>
                      <p className="mt-1 break-all text-xs font-semibold text-blue-700">
                        {getQrFormUrl(selected.id)}
                      </p>
                      <p className="mt-2 text-[11.5px] font-medium leading-relaxed text-slate-500">
                        Print the poster or share this link on WhatsApp. Every submission is captured
                        live and counted on this page.
                      </p>
                      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                        <button
                          type="button"
                          onClick={() => handleCopyLink(selected.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-[11.5px] font-bold text-blue-700 ring-1 ring-blue-100 transition hover:bg-blue-100"
                        >
                          <Copy size={13} /> Copy link
                        </button>
                        <a
                          href={getQrFormUrl(selected.id)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[11.5px] font-bold text-slate-600 transition hover:bg-slate-50"
                        >
                          <ExternalLink size={13} /> Open form
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search name, email, register number…"
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <span className="rounded-lg bg-white px-2.5 py-2 text-[11px] font-black text-slate-500 ring-1 ring-slate-200">
                      {filteredSubmissions.length}
                    </span>
                  </div>

                  {/* Submissions */}
                  {loadingSubs ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16">
                      <Loader2 size={24} className="animate-spin text-blue-500" />
                      <p className="mt-2 text-xs font-semibold text-slate-500">Loading submissions…</p>
                    </div>
                  ) : filteredSubmissions.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
                      <Users size={30} className="mx-auto text-slate-300" />
                      <h3 className="mt-3 text-sm font-black text-slate-800">
                        {submissions.length === 0 ? 'No submissions yet' : 'No matching students'}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {submissions.length === 0
                          ? 'Share the QR or link with students — new entries appear here automatically.'
                          : 'Try a different name, email, or register number.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {(() => {
                        const pendingCount = submissions.filter(s => !s.imported).length;
                        if (pendingCount > 0) {
                          return (
                            <button
                              type="button"
                              onClick={async () => {
                                setImportingAllId(selected.id);
                                try {
                                  await importSubmissions(submissions, selected.amount, selected.collegeName);
                                  await loadCampaigns();
                                } catch {
                                  toast.error('Could not import the students from this QR campaign');
                                } finally {
                                  setImportingAllId('');
                                }
                              }}
                              disabled={importingAllId === selected.id}
                              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-700 disabled:opacity-50"
                            >
                              {importingAllId === selected.id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <UserPlus size={16} />
                              )}
                              Import all {pendingCount} pending student{pendingCount === 1 ? '' : 's'} into certificate registry
                            </button>
                          );
                        }
                        return null;
                      })()}
                      {filteredSubmissions.map(sub => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => setDetail(sub)}
                          className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left shadow-xs transition hover:border-blue-200 hover:bg-blue-50/30"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-sm font-black text-white">
                            {sub.fullName.slice(0, 1).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-[13px] font-black text-slate-900">{sub.fullName}</p>
                              {sub.imported && (
                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9.5px] font-black uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-100">
                                  <Check size={9} /> Imported
                                </span>
                              )}
                            </div>
                            <p className="truncate text-[11.5px] font-semibold text-slate-500">
                              {sub.domain} · {sub.academicBatch} · {sub.registerNo}
                            </p>
                          </div>
                          <div className="hidden shrink-0 text-right sm:block">
                            <p className="text-[11px] font-bold text-slate-400">
                              {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : ''}
                            </p>
                            <p className="text-[10.5px] font-semibold text-slate-400">{sub.mode}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: 'blue' | 'emerald' | 'amber';
}) {
  const toneClasses = {
    blue: 'bg-blue-50 text-blue-600 ring-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100'
  }[tone];

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-3 shadow-xs sm:p-4">
      <div className="flex items-center gap-2">
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ring-1 ${toneClasses}`}>
          {icon}
        </span>
        <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-500 sm:text-[11.5px]">
          {label}
        </span>
      </div>
      <p className="mt-2 text-2xl font-black leading-none text-[#0F172A]">{value}</p>
    </div>
  );
}

function SubmissionDetail({
  submission,
  campaignAmount,
  editing,
  editForm,
  saving,
  importing,
  onChange,
  onStartEdit,
  onCancelEdit,
  onSave,
  onImport,
  onDelete
}: {
  submission: QrSubmission;
  campaignAmount?: number;
  editing: boolean;
  editForm: QrSubmission | null;
  saving: boolean;
  importing: boolean;
  onChange: (patch: Partial<QrSubmission>) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  onImport: () => void;
  onDelete: () => void;
}) {
  const fieldClass =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100';

  if (editing && editForm) {
    return (
      <div className="space-y-4 p-4 sm:p-6">
        <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4">
          <p className="flex items-center gap-2 text-xs font-bold text-blue-900">
            <Edit2 size={14} /> Editing student details — changes update the ERP record too.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <EditField label="Full name">
            <input
              value={editForm.fullName}
              onChange={e => onChange({ fullName: e.target.value })}
              onBlur={e => onChange({ fullName: formatStudentName(e.target.value) })}
              className={fieldClass}
            />
          </EditField>
          <EditField label="Gender">
            <select
              value={editForm.gender}
              onChange={e => onChange({ gender: e.target.value })}
              className={fieldClass}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
              <option>Prefer not to say</option>
            </select>
          </EditField>
          <EditField label="Email">
            <input
              type="email"
              value={editForm.email}
              onChange={e => onChange({ email: e.target.value })}
              className={fieldClass}
            />
          </EditField>
          <EditField label="Phone">
            <input
              value={editForm.phone}
              onChange={e => onChange({ phone: e.target.value })}
              className={fieldClass}
            />
          </EditField>
          <EditField label="College">
            <input
              value={editForm.collegeName}
              onChange={e => onChange({ collegeName: e.target.value })}
              className={fieldClass}
            />
          </EditField>
          <EditField label="Register / Roll number">
            <input
              value={editForm.registerNo}
              onChange={e => onChange({ registerNo: e.target.value })}
              className={fieldClass}
            />
          </EditField>
          <EditField label="Degree">
            <input
              value={editForm.degree}
              onChange={e => onChange({ degree: e.target.value })}
              className={fieldClass}
            />
          </EditField>
          <EditField label="Department">
            <input
              value={editForm.department}
              onChange={e => onChange({ department: e.target.value })}
              className={fieldClass}
            />
          </EditField>
          <EditField label="Academic batch">
            <input
              value={editForm.academicBatch}
              onChange={e => onChange({ academicBatch: e.target.value })}
              placeholder="2022 - 2026"
              className={fieldClass}
            />
          </EditField>
          <EditField label="Internship domain">
            <input
              value={editForm.domain}
              onChange={e => onChange({ domain: e.target.value })}
              className={fieldClass}
            />
          </EditField>
          <EditField label="Start date">
            <input
              type="date"
              value={editForm.startDate}
              onChange={e => onChange({ startDate: e.target.value })}
              className={fieldClass}
            />
          </EditField>
          <EditField label="Duration">
            <input
              value={editForm.duration}
              onChange={e => onChange({ duration: e.target.value })}
              className={fieldClass}
            />
          </EditField>
          <EditField label="Mode">
            <input
              value={editForm.mode}
              onChange={e => onChange({ mode: e.target.value })}
              className={fieldClass}
            />
          </EditField>
          <EditField label="Attendance %">
            <input
              type="number"
              min={0}
              max={100}
              value={editForm.attendancePct}
              onChange={e => onChange({ attendancePct: Number(e.target.value) })}
              className={fieldClass}
            />
          </EditField>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg px-3.5 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-black text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 sm:p-6">
      {/* Import state */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-lg font-black text-white">
              {submission.fullName.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">{submission.fullName}</p>
              <p className="text-[11.5px] font-semibold text-slate-500">
                Applied {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : '—'}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
              submission.imported
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                : 'bg-amber-50 text-amber-700 ring-1 ring-amber-100'
            }`}
          >
            {submission.imported ? <Check size={11} /> : <AlertTriangle size={11} />}
            {submission.imported ? 'In student registry' : 'Not imported yet'}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          {!submission.imported && (
            <button
              type="button"
              onClick={onImport}
              disabled={importing}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-3.5 py-2 text-xs font-black text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {importing ? <Loader2 size={13} className="animate-spin" /> : <UserPlus size={13} />}
              {importing ? 'Importing…' : 'Import to students'}
            </button>
          )}
          <button
            type="button"
            onClick={onStartEdit}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <Edit2 size={13} /> Edit details
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          Student information
        </h3>
        <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          <DetailRow icon={<Mail size={13} />} label="Email" value={submission.email} />
          <DetailRow icon={<Phone size={13} />} label="Phone" value={submission.phone} />
          <DetailRow icon={<GraduationCap size={13} />} label="College" value={submission.collegeName} />
          <DetailRow icon={<GraduationCap size={13} />} label="Degree" value={submission.degree} />
          <DetailRow label="Department" value={submission.department} />
          <DetailRow label="Academic batch" value={submission.academicBatch} />
          <DetailRow label="Register no." value={submission.registerNo} />
          <DetailRow label="Gender" value={submission.gender} />
        </div>

        <h3 className="mt-5 border-t border-slate-100 pt-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          Internship details
        </h3>
        <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          <DetailRow label="Domain" value={submission.domain} />
          <DetailRow label="Mode" value={submission.mode} />
          <DetailRow label="Start date" value={submission.startDate} />
          <DetailRow label="End date" value={submission.endDate} />
          <DetailRow label="Duration" value={submission.duration} />
          <DetailRow label="Attendance" value={`${submission.attendancePct}%`} />
          <DetailRow label="Internship fee" value={formatRupees(submission.amount ?? campaignAmount) || 'Not set'} />
          <DetailRow label="Student ID" value={submission.studentId || 'Assigned on import'} />
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value
}: {
  icon?: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wide text-slate-400">
        {icon}
        {label}
      </span>
      <span className="max-w-[62%] break-words text-right text-[12.5px] font-bold text-slate-800">
        {value || '—'}
      </span>
    </div>
  );
}

function EditField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
