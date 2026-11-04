import { useMemo, useState, type ReactNode } from 'react';
import {
  CalendarDays,
  ChevronDown,
  Clock3,
  Edit2,
  ExternalLink,
  GraduationCap,
  IndianRupee,
  Sparkles,
  Users,
  X
} from 'lucide-react';

import {
  normalizeCollege,
  type StudentCohortRecord
} from '@/lib/certificateStore';
import { calculateDurationFromDates } from '@/constants/registrationOptions';

export interface BatchStudent {
  id: string;
  name: string;
  registerNumber?: string;
  domain?: string;
  joinedAt?: string;
  status?: string;
  raw?: any;
}

export interface BatchGroup {
  key: string;
  college: string;
  batchLabel?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  price?: string;
  students: BatchStudent[];
  sortTime: number;
}

export interface BatchUpdatePayload {
  college: string;
  oldKey: string;
  studentIds: string[];
  updates: {
    batchLabel?: string;
    startDate?: string;
    endDate?: string;
    duration?: string;
    price?: string;
  };
}

export const getStudentTime = (s: any): number => {
  if (!s) return 0;
  const candidates = [
    s.createdAt,
    s.created_at,
    s.submittedAt,
    s.submitted_at,
    s.registeredAt,
    s.registered_at,
    s.joinedAt,
    s.joined_at,
    s.startDate,
    s.start_date,
    s.issueDate,
    s.date,
    s.timestamp
  ];
  for (const c of candidates) {
    if (!c) continue;
    const t = new Date(c).getTime();
    if (Number.isFinite(t) && t > 0) return t;
  }
  if (typeof s.id === 'string') {
    const match = s.id.match(/\d{10,13}/);
    if (match) {
      const num = Number(match[0]);
      if (num > 1000000000) return num < 10000000000 ? num * 1000 : num;
    }
  }
  return 0;
};

const toIsoDay = (value?: string): string => {
  if (!value) return '';
  const direct = /^\d{4}-\d{2}-\d{2}/.exec(value);
  if (direct) return direct[0];
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10);
};

const displayDate = (value?: string): string => {
  const iso = toIsoDay(value);
  if (!iso) return 'Not set';
  const [year, month, day] = iso.split('-');
  return `${day}-${month}-${year}`;
};

const normalizeFee = (value?: string): string => {
  const fee = String(value || '').trim();
  if (!fee || /to be decided|pending/i.test(fee)) return '';
  return fee;
};

const feeLabel = (fees: Set<string>): string => {
  const list = [...fees].filter(Boolean).sort((a, b) => a.localeCompare(b));
  if (list.length === 0) return 'Fee not set';
  if (list.length === 1) return list[0];
  return `${list[0]} – ${list[list.length - 1]}`;
};

const collegeInitials = (college: string): string =>
  college
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || '')
    .join('');

const batchOfStudent = (student: StudentCohortRecord): string => {
  const label = (student.academicBatch || '').trim();
  const start = toIsoDay(student.startDate);
  const end = toIsoDay(student.endDate);
  const dur = (student.duration || '').trim();
  if (label && (start || end)) return `${label}::${start}::${end}::${dur}`;
  if (label) return `batch::${label}`;
  if (start || end) return `dates::${start}::${end}::${dur}`;
  return 'batch::unassigned';
};

export function groupStudentsIntoBatches(records: StudentCohortRecord[]): BatchGroup[] {
  const colleges = new Map<string, { label: string; batches: Map<string, BatchGroup>; fees: Map<string, Set<string>> }>();

  for (const student of records) {
    if (!student) continue;

    const label = normalizeCollege(student.college) || 'Unassigned College';
    const collegeKey = label.toLowerCase();
    const batchKey = batchOfStudent(student);
    let college = colleges.get(collegeKey);
    if (!college) {
      college = { label, batches: new Map(), fees: new Map() };
      colleges.set(collegeKey, college);
    }

    let batch = college.batches.get(batchKey);
    if (!batch) {
      batch = {
        key: `${collegeKey}::${batchKey}`,
        college: label,
        batchLabel: student.academicBatch || '',
        startDate: toIsoDay(student.startDate),
        endDate: toIsoDay(student.endDate),
        duration: student.duration || calculateDurationFromDates(student.startDate, student.endDate || ''),
        students: [],
        sortTime: 0
      };
      college.batches.set(batchKey, batch);
      college.fees.set(batchKey, new Set());
    }

    const fee = normalizeFee(student.feeTotal);
    if (fee) college.fees.get(batchKey)?.add(fee);

    const joinedAt = student.createdAt || student.startDate || student.issueDate || '';
    batch.students.push({
      id: student.id,
      name: student.name,
      registerNumber: student.registerNumber || student.studentId || student.id,
      domain: student.domain || student.course,
      joinedAt,
      status: student.status,
      raw: student
    });
    batch.sortTime = Math.max(batch.sortTime, getStudentTime(student));
  }

  const result: BatchGroup[] = [];
  for (const college of colleges.values()) {
    for (const [batchKey, batch] of college.batches) {
      batch.price = feeLabel(college.fees.get(batchKey) || new Set());
      batch.students.sort((a, b) => getStudentTime(b.raw || b) - getStudentTime(a.raw || a));
      batch.sortTime = Math.max(batch.sortTime, getStudentTime(batch.students[0]?.raw || batch.students[0]));
      result.push(batch);
    }
  }

  return result.sort((a, b) => {
    if (b.sortTime !== a.sortTime) return b.sortTime - a.sortTime;
    return a.college.localeCompare(b.college);
  });
}

const batchOfRegistration = (reg: any): string => {
  const label = (reg.academicBatch || reg.batch || '').trim();
  const start = toIsoDay(reg.startDate || reg.start_date);
  const end = toIsoDay(reg.endDate || reg.end_date);
  const dur = (reg.duration || '').trim();
  if (label && (start || end)) return `${label}::${start}::${end}::${dur}`;
  if (label) return `batch::${label}`;
  if (start || end) return `dates::${start}::${end}::${dur}`;
  return 'batch::unassigned';
};

export function groupRegistrationsIntoBatches(registrations: any[]): BatchGroup[] {
  const colleges = new Map<string, { label: string; batches: Map<string, BatchGroup>; fees: Map<string, Set<string>> }>();

  for (const reg of registrations) {
    if (!reg) continue;

    const label = normalizeCollege(reg.college) || 'Unassigned College';
    const collegeKey = label.toLowerCase();
    const start = toIsoDay(reg.startDate || reg.start_date);
    const end = toIsoDay(reg.endDate || reg.end_date);
    const batchKey = batchOfRegistration(reg);

    let college = colleges.get(collegeKey);
    if (!college) {
      college = { label, batches: new Map(), fees: new Map() };
      colleges.set(collegeKey, college);
    }

    let batch = college.batches.get(batchKey);
    if (!batch) {
      batch = {
        key: `${collegeKey}::${batchKey}`,
        college: label,
        batchLabel: reg.academicBatch || reg.batch || '',
        startDate: start,
        endDate: end,
        duration: reg.duration || calculateDurationFromDates(start, end),
        students: [],
        sortTime: 0
      };
      college.batches.set(batchKey, batch);
      college.fees.set(batchKey, new Set());
    }

    const fee = normalizeFee(reg.feeTotal || reg.fee_total);
    if (fee) college.fees.get(batchKey)?.add(fee);

    const joinedAt = reg.createdAt || reg.created_at || start;
    batch.students.push({
      id: String(reg.regId || reg.id || ''),
      name: reg.studentName || reg.name || 'Candidate',
      registerNumber: reg.regId || reg.id || '',
      domain: reg.domain || reg.courseInterest || reg.course_interest || '',
      joinedAt,
      status: reg.stepStatus || reg.status,
      raw: reg
    });
    batch.sortTime = Math.max(batch.sortTime, getStudentTime(reg));
  }

  const result: BatchGroup[] = [];
  for (const college of colleges.values()) {
    for (const [batchKey, batch] of college.batches) {
      batch.price = feeLabel(college.fees.get(batchKey) || new Set());
      batch.students.sort((a, b) => getStudentTime(b.raw || b) - getStudentTime(a.raw || a));
      batch.sortTime = Math.max(batch.sortTime, getStudentTime(batch.students[0]?.raw || batch.students[0]));
      result.push(batch);
    }
  }

  return result.sort((a, b) => {
    if (b.sortTime !== a.sortTime) return b.sortTime - a.sortTime;
    return a.college.localeCompare(b.college);
  });
}

interface BatchGroupCardsProps {
  batches: BatchGroup[];
  onOpenStudent?: (id: string) => void;
  onUpdateBatch?: (payload: BatchUpdatePayload) => void | Promise<void>;
  emptyTitle?: string;
  emptyHint?: string;
  studentLabel?: string;
}

export default function BatchGroupCards({
  batches,
  onOpenStudent,
  onUpdateBatch,
  emptyTitle = 'No batches found',
  emptyHint = 'Try adjusting the college or search filter.',
  studentLabel = 'student'
}: BatchGroupCardsProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editingBatch, setEditingBatch] = useState<BatchGroup | null>(null);
  const [editForm, setEditForm] = useState<{
    batchLabel: string;
    startDate: string;
    endDate: string;
    duration: string;
    price: string;
  }>({
    batchLabel: '',
    startDate: '',
    endDate: '',
    duration: '',
    price: ''
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const colleges = useMemo(() => {
    const map = new Map<string, { label: string; batches: BatchGroup[]; sortTime: number; studentCount: number }>();
    for (const batch of batches) {
      const key = batch.college.toLowerCase();
      let entry = map.get(key);
      if (!entry) {
        entry = { label: batch.college, batches: [], sortTime: 0, studentCount: 0 };
        map.set(key, entry);
      }
      entry.batches.push(batch);
      entry.sortTime = Math.max(entry.sortTime, batch.sortTime);
      entry.studentCount += batch.students.length;
    }
    return [...map.values()]
      .map(entry => ({
        ...entry,
        batches: entry.batches.sort((a, b) => b.sortTime - a.sortTime)
      }))
      .sort((a, b) => b.sortTime - a.sortTime || a.label.localeCompare(b.label));
  }, [batches]);

  const toggle = (key: string) =>
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  const startEdit = (batch: BatchGroup) => {
    setEditingBatch(batch);
    setEditForm({
      batchLabel: batch.batchLabel || '',
      startDate: batch.startDate || '',
      endDate: batch.endDate || '',
      duration: batch.duration || '',
      price: batch.price && batch.price !== 'Fee not set' ? batch.price : ''
    });
  };

  const handleDateChange = (field: 'startDate' | 'endDate', val: string) => {
    setEditForm(prev => {
      const next = { ...prev, [field]: val };
      if (next.startDate && next.endDate) {
        const autoDur = calculateDurationFromDates(next.startDate, next.endDate);
        if (autoDur && autoDur !== '0 Days') {
          next.duration = autoDur;
        }
      }
      return next;
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch || !onUpdateBatch) return;

    setSavingEdit(true);
    try {
      await onUpdateBatch({
        college: editingBatch.college,
        oldKey: editingBatch.key,
        studentIds: editingBatch.students.map(s => s.id),
        updates: {
          batchLabel: editForm.batchLabel.trim(),
          startDate: editForm.startDate,
          endDate: editForm.endDate,
          duration: editForm.duration.trim(),
          price: editForm.price.trim()
        }
      });
      setEditingBatch(null);
    } catch (err) {
      console.error('Failed to update batch:', err);
    } finally {
      setSavingEdit(false);
    }
  };

  if (batches.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
        <GraduationCap size={30} className="mx-auto text-slate-300" />
        <p className="mt-3 text-sm font-black text-slate-800">{emptyTitle}</p>
        <p className="mt-1 text-xs font-medium text-slate-500">{emptyHint}</p>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {colleges.map(college => (
        <section key={college.label} className="space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0F172A] text-[12.5px] font-black tracking-wide text-white shadow-sm ring-1 ring-white/10">
                {collegeInitials(college.label)}
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-base font-black tracking-tight text-[#0F172A]">
                  {college.label}
                </h3>
                <p className="text-[11.5px] font-semibold text-[#64748B]">
                  {college.batches.length} batch{college.batches.length === 1 ? '' : 'es'} ·{' '}
                  {college.studentCount} {studentLabel}
                  {college.studentCount === 1 ? '' : 's'}
                </p>
              </div>
            </div>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10.5px] font-black uppercase tracking-wider text-slate-500 shadow-2xs">
              Latest Activity {displayDate(new Date(college.sortTime || Date.now()).toISOString())}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {college.batches.map(batch => {
              const isOpen = Boolean(expanded[batch.key]);
              const hasDates = Boolean(batch.startDate || batch.endDate);
              return (
                <article
                  key={batch.key}
                  className="relative overflow-hidden rounded-2xl border border-[#C9A227]/30 bg-[linear-gradient(135deg,#0B1220_0%,#111C33_52%,#0A1A3A_100%)] p-4 text-white shadow-[0_10px_30px_-18px_rgba(15,23,42,0.9)] transition hover:border-[#C9A227]/50 sm:p-5"
                >
                  {/* Certificate Gold & Blue Ambient Glows */}
                  <div
                    className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full opacity-35 blur-2xl"
                    style={{ background: 'radial-gradient(circle, #0066FF 0%, transparent 65%)' }}
                  />
                  <div
                    className="pointer-events-none absolute -bottom-24 -left-16 h-44 w-44 rounded-full opacity-25 blur-2xl"
                    style={{ background: 'radial-gradient(circle, #C9A227 0%, transparent 68%)' }}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded-full border border-[#C9A227]/40 bg-[#C9A227]/10 px-2.5 py-0.5 text-[9.5px] font-black uppercase tracking-[0.2em] text-[#E6C766]">
                            <Sparkles size={10} className="text-[#C9A227]" />
                            ATIDETO INTERNSHIP BATCH
                          </span>
                        </div>
                        <h4 className="mt-2 truncate text-base font-black tracking-tight text-white">
                          {batch.batchLabel || 'Internship Cohort'}
                        </h4>
                        <p className="mt-0.5 truncate text-[11px] font-medium text-white/60">
                          {batch.college} · {batch.students.length} {studentLabel}
                          {batch.students.length === 1 ? '' : 's'}
                        </p>
                      </div>
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#C9A227]/50 bg-[#C9A227]/15 text-[11px] font-black tracking-wider text-[#E6C766] shadow-sm">
                        {collegeInitials(batch.college)}
                      </span>
                    </div>

                    {/* From, To, Duration, Price Grid */}
                    <div className="mt-4 grid grid-cols-2 gap-2.5">
                      <Detail icon={<CalendarDays size={12} />} label="From Date" value={displayDate(batch.startDate)} />
                      <Detail icon={<CalendarDays size={12} />} label="To Date" value={displayDate(batch.endDate)} />
                      <Detail icon={<Clock3 size={12} />} label="Duration" value={batch.duration || (hasDates ? calculateDurationFromDates(batch.startDate || '', batch.endDate || '') : 'Not set')} />
                      <Detail icon={<IndianRupee size={12} />} label="Batch Fee" value={batch.price || 'Fee not set'} />
                    </div>

                    {/* Action Bar: View Students & Edit Details */}
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
                      <button
                        type="button"
                        onClick={() => toggle(batch.key)}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-[11.5px] font-black text-white ring-1 ring-white/15 transition hover:bg-white/15"
                      >
                        <Users size={13} />
                        {isOpen ? 'Hide students' : `View ${batch.students.length} students`}
                        <ChevronDown size={13} className={`transition ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {onUpdateBatch && (
                        <button
                          type="button"
                          onClick={() => startEdit(batch)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#C9A227]/40 bg-[#C9A227]/15 px-3 py-2 text-[11.5px] font-black text-[#E6C766] transition hover:bg-[#C9A227]/25"
                          title="Edit batch dates, duration, price, and label"
                        >
                          <Edit2 size={13} />
                          Edit Details
                        </button>
                      )}
                    </div>

                    {isOpen && (
                      <div className="mt-3 max-h-64 space-y-1.5 overflow-y-auto pr-1">
                        {batch.students.map(student => (
                          <div
                            key={student.id}
                            className="flex items-center gap-2.5 rounded-xl bg-white/[0.06] px-2.5 py-2 ring-1 ring-white/10"
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0066FF] text-[10.5px] font-black text-white">
                              {student.name?.slice(0, 1).toUpperCase() || 'S'}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[11.5px] font-black text-white">{student.name}</p>
                              <p className="truncate text-[10px] font-semibold text-white/50">
                                {student.registerNumber || student.id}
                                {student.domain ? ` · ${student.domain}` : ''}
                                {student.joinedAt ? ` · Joined ${displayDate(student.joinedAt)}` : ''}
                              </p>
                            </div>
                            {onOpenStudent && (
                              <button
                                type="button"
                                onClick={() => onOpenStudent(student.id)}
                                className="shrink-0 rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
                                title="Open student record"
                              >
                                <ExternalLink size={12} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      {/* Edit Batch Details Modal */}
      {editingBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-blue-600">Batch Configuration</p>
                <h3 className="mt-0.5 text-lg font-black text-slate-900">Edit Batch Details</h3>
                <p className="text-xs font-semibold text-slate-500 truncate">{editingBatch.college}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingBatch(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-5 space-y-4">
              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  Batch Name / Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Batch 1, Dec-Jan Cohort, Mahindra ABC"
                  value={editForm.batchLabel}
                  onChange={e => setEditForm(prev => ({ ...prev, batchLabel: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={editForm.startDate}
                    onChange={e => handleDateChange('startDate', e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={editForm.endDate}
                    min={editForm.startDate || undefined}
                    onChange={e => handleDateChange('endDate', e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1 Month, 15 Days"
                    value={editForm.duration}
                    onChange={e => setEditForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                  {editForm.startDate && editForm.endDate && (
                    <p className="mt-1 text-[10px] font-bold text-blue-600">Auto-calculated from dates</p>
                  )}
                </div>
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    Batch Fee / Price
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹2,500"
                    value={editForm.price}
                    onChange={e => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600">
                Updating will apply these dates, duration, and fee to all{' '}
                <strong className="text-slate-900">{editingBatch.students.length} students</strong> in this batch.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBatch(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="rounded-xl bg-[#0066FF] px-4 py-2 text-xs font-black text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {savingEdit ? 'Saving…' : 'Save Batch Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({
  icon,
  label,
  value
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#C9A227]/25 bg-white/[0.04] px-2.5 py-2">
      <p className="flex items-center gap-1 text-[8.5px] font-black uppercase tracking-[0.18em] text-[#E6C766]/80">
        {icon}
        {label}
      </p>
      <p className="mt-0.5 truncate text-[11.5px] font-black text-white">{value}</p>
    </div>
  );
}
