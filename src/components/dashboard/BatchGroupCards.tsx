import { useMemo, useState, type ReactNode } from 'react';
import {
  CalendarDays,
  ChevronDown,
  Clock3,
  ExternalLink,
  GraduationCap,
  IndianRupee,
  Users
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

const toTime = (value?: string): number => {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : 0;
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
  const start = toIsoDay(student.startDate);
  const end = toIsoDay(student.endDate);
  if (start || end) return `${start}|${end}|${student.duration || ''}`;
  return `batch|${student.academicBatch || 'unassigned'}`;
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
      status: student.status
    });
    batch.sortTime = Math.max(
      batch.sortTime,
      toTime(student.createdAt),
      toTime(student.startDate),
      toTime(student.issueDate)
    );
  }

  const result: BatchGroup[] = [];
  for (const college of colleges.values()) {
    for (const [batchKey, batch] of college.batches) {
      batch.price = feeLabel(college.fees.get(batchKey) || new Set());
      batch.students.sort((a, b) => toTime(b.joinedAt) - toTime(a.joinedAt));
      batch.sortTime = Math.max(batch.sortTime, toTime(batch.students[0]?.joinedAt));
      result.push(batch);
    }
  }

  return result.sort((a, b) => {
    if (b.sortTime !== a.sortTime) return b.sortTime - a.sortTime;
    return a.college.localeCompare(b.college);
  });
}

export function groupRegistrationsIntoBatches(registrations: any[]): BatchGroup[] {
  const colleges = new Map<string, { label: string; batches: Map<string, BatchGroup>; fees: Map<string, Set<string>> }>();

  for (const reg of registrations) {
    if (!reg) continue;

    const label = normalizeCollege(reg.college) || 'Unassigned College';
    const collegeKey = label.toLowerCase();
    const start = toIsoDay(reg.startDate || reg.start_date);
    const end = toIsoDay(reg.endDate || reg.end_date);
    const batchKey = start || end
      ? `${start}|${end}|${reg.duration || ''}`
      : `batch|${reg.academicBatch || 'unassigned'}`;

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
        batchLabel: reg.academicBatch || '',
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
      status: reg.stepStatus || reg.status
    });
    batch.sortTime = Math.max(batch.sortTime, toTime(joinedAt), toTime(start));
  }

  const result: BatchGroup[] = [];
  for (const college of colleges.values()) {
    for (const [batchKey, batch] of college.batches) {
      batch.price = feeLabel(college.fees.get(batchKey) || new Set());
      batch.students.sort((a, b) => toTime(b.joinedAt) - toTime(a.joinedAt));
      batch.sortTime = Math.max(batch.sortTime, toTime(batch.students[0]?.joinedAt));
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
  emptyTitle?: string;
  emptyHint?: string;
  studentLabel?: string;
}

export default function BatchGroupCards({
  batches,
  onOpenStudent,
  emptyTitle = 'No batches found',
  emptyHint = 'Try adjusting the college or search filter.',
  studentLabel = 'student'
}: BatchGroupCardsProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

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
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0F172A] text-[12.5px] font-black tracking-wide text-white shadow-sm">
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
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10.5px] font-black uppercase tracking-wider text-slate-500">
              Latest {displayDate(new Date(college.sortTime || Date.now()).toISOString())}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {college.batches.map(batch => {
              const isOpen = Boolean(expanded[batch.key]);
              return (
                <article
                  key={batch.key}
                  className="relative overflow-hidden rounded-2xl border border-[#1E3A6E] bg-[linear-gradient(135deg,#0B1220_0%,#111C33_52%,#0A1A3A_100%)] p-4 text-white shadow-[0_10px_30px_-18px_rgba(15,23,42,0.9)] sm:p-5"
                >
                  <div
                    className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full opacity-40 blur-2xl"
                    style={{ background: 'radial-gradient(circle, #0066FF 0%, transparent 65%)' }}
                  />
                  <div
                    className="pointer-events-none absolute -bottom-24 -left-16 h-44 w-44 rounded-full opacity-25 blur-2xl"
                    style={{ background: 'radial-gradient(circle, #C9A227 0%, transparent 68%)' }}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[9.5px] font-black uppercase tracking-[0.22em] text-[#7FA6FF]">
                          ATIDETO TECHNOLOGIES
                        </p>
                        <h4 className="mt-1 truncate text-[15px] font-black tracking-tight text-white">
                          Internship Batch
                        </h4>
                        <p className="mt-0.5 truncate text-[10.5px] font-semibold text-white/55">
                          {batch.batchLabel || 'Internship Cohort'} · {batch.students.length}{' '}
                          {studentLabel}
                          {batch.students.length === 1 ? '' : 's'}
                        </p>
                      </div>
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#C9A227]/50 bg-[#C9A227]/10 text-[11px] font-black tracking-wider text-[#E6C766]">
                        {collegeInitials(batch.college)}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2.5">
                      <Detail icon={<CalendarDays size={12} />} label="From" value={displayDate(batch.startDate)} />
                      <Detail icon={<CalendarDays size={12} />} label="To" value={displayDate(batch.endDate)} />
                      <Detail icon={<Clock3 size={12} />} label="Duration" value={batch.duration || 'Not set'} />
                      <Detail icon={<IndianRupee size={12} />} label="Batch Fee" value={batch.price || 'Fee not set'} />
                    </div>

                    <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3">
                      <button
                        type="button"
                        onClick={() => toggle(batch.key)}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-[11.5px] font-black text-white ring-1 ring-white/15 transition hover:bg-white/15"
                      >
                        <Users size={13} />
                        {isOpen ? 'Hide students' : `View ${batch.students.length} students`}
                        <ChevronDown size={13} className={`transition ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {isOpen && (
                      <div className="mt-3 space-y-1.5">
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
    <div className="rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2">
      <p className="flex items-center gap-1 text-[8.5px] font-black uppercase tracking-[0.18em] text-white/45">
        {icon}
        {label}
      </p>
      <p className="mt-0.5 truncate text-[11.5px] font-black text-white">{value}</p>
    </div>
  );
}
