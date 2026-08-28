/** Shared status metadata + transition rules for the admin console.
 *  The backend is the source of truth — these mirror its rules for the UI only. */

export const STATUS_ORDER = [
  'RECEIVED',
  'UNDER_REVIEW',
  'SELECTED',
  'COMPLETED',
  'CERTIFICATE_GENERATED',
  'REJECTED',
] as const;

export const STATUS_META: Record<string, { label: string; className: string }> = {
  RECEIVED: { label: 'Received', className: 'bg-slate-100 text-slate-700 border-slate-200' },
  UNDER_REVIEW: { label: 'Under Review', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  SELECTED: { label: 'Selected', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  COMPLETED: { label: 'Completed', className: 'bg-violet-50 text-violet-700 border-violet-200' },
  CERTIFICATE_GENERATED: { label: 'Certificate Generated', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  REJECTED: { label: 'Rejected', className: 'bg-red-50 text-red-700 border-red-200' },
};

/** Forward pipeline + rejection + corrections. Mirrors backend/src/services/applicationService.ts */
export const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  RECEIVED: ['UNDER_REVIEW', 'REJECTED'],
  UNDER_REVIEW: ['SELECTED', 'REJECTED', 'RECEIVED'],
  SELECTED: ['COMPLETED', 'REJECTED', 'UNDER_REVIEW'],
  COMPLETED: ['CERTIFICATE_GENERATED', 'SELECTED'],
  REJECTED: ['UNDER_REVIEW'],
  CERTIFICATE_GENERATED: [],
};

export function statusMeta(status: string) {
  return STATUS_META[status] ?? { label: status, className: 'bg-slate-100 text-slate-700 border-slate-200' };
}
