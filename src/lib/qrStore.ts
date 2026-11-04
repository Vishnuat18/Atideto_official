// QR Campaign & Submission Store
// Backed by Firebase Realtime Database (same tree as the rest of the ERP) with
// an offline localStorage mirror so the admin and public form keep working
// when the network is briefly unavailable.

const RTDB_BASE = ((import.meta.env?.VITE_FIREBASE_DATABASE_URL as string)
  || 'https://nitha-8f9f4-default-rtdb.firebaseio.com').replace(/\/+$/, '') + '/erp_live';

const CAMPAIGNS_KEY = 'atideto_qr_campaigns';
const SUBMISSIONS_PREFIX = 'atideto_qr_submissions_';

export interface QrCampaign {
  id: string;
  collegeName: string;
  label?: string;
  amount?: number;
  startDate?: string;
  endDate?: string;
  duration?: string;
  createdAt: string;
  createdBy?: string;
  submissionCount: number;
  active: boolean;
}

export interface QrSubmission {
  id: string;
  qrId: string;
  fullName: string;
  gender: string;
  email: string;
  countryCode: string;
  phone: string;
  collegeName: string;
  degree: string;
  department: string;
  registerNo: string;
  academicBatch: string;
  domain: string;
  mode: string;
  startDate: string;
  endDate: string;
  duration: string;
  attendancePct: number;
  amount?: number;
  submittedAt: string;
  studentId?: string;
  imported?: boolean;
}

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage may be full or blocked — cloud remains the source of truth */
  }
};

async function cloudGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${RTDB_BASE}${path}.json?_t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as T | null;
  } catch {
    return null;
  }
}

async function cloudPut(path: string, value: unknown): Promise<boolean> {
  try {
    const res = await fetch(`${RTDB_BASE}${path}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value)
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function cloudDelete(path: string): Promise<boolean> {
  try {
    const res = await fetch(`${RTDB_BASE}${path}.json`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}

const asList = <T,>(data: unknown): T[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data.filter(Boolean) as T[];
  if (typeof data === 'object') return Object.values(data as Record<string, T>).filter(Boolean);
  return [];
};

const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export function generateQrId(collegeName?: string): string {
  const slug = String(collegeName || 'campaign')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 28) || 'campaign';
  return `${slug}-${newId('q').replace(/^q-/, '')}`;
}

export function getQrFormUrl(qrId: string): string {
  if (typeof window === 'undefined') return `/join/${qrId}`;
  return `${window.location.origin}/join/${qrId}`;
}

/* ------------------------------------------------------------------ */
/* Campaigns                                                           */
/* ------------------------------------------------------------------ */

export function listLocalCampaigns(): QrCampaign[] {
  return readJson<QrCampaign[]>(CAMPAIGNS_KEY, []).filter(Boolean);
}

function writeLocalCampaigns(list: QrCampaign[]) {
  writeJson(CAMPAIGNS_KEY, list);
}

function upsertLocalCampaign(campaign: QrCampaign) {
  const list = listLocalCampaigns();
  const idx = list.findIndex(c => c.id === campaign.id);
  if (idx >= 0) list[idx] = { ...list[idx], ...campaign };
  else list.unshift(campaign);
  writeLocalCampaigns(list);
}

function sortCampaigns(list: QrCampaign[]): QrCampaign[] {
  return [...list].sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
}

export async function fetchQrCampaigns(): Promise<QrCampaign[]> {
  const local = listLocalCampaigns();
  const cloud = await cloudGet<Record<string, QrCampaign>>('/qrCampaigns');
  const cloudList = asList<QrCampaign>(cloud);

  if (!cloudList.length) return sortCampaigns(local);

  const merged = new Map<string, QrCampaign>();
  local.forEach(c => { if (c?.id) merged.set(c.id, c); });
  cloudList.forEach(c => {
    if (!c?.id) return;
    merged.set(c.id, {
      ...c,
      submissionCount: Number(c.submissionCount) || 0,
      active: c.active !== false
    });
  });

  const list = sortCampaigns([...merged.values()]);
  writeLocalCampaigns(list);
  return list;
}

export async function getQrCampaign(qrId: string): Promise<QrCampaign | null> {
  const local = listLocalCampaigns().find(c => c.id === qrId);
  if (local) return local;
  const cloud = await cloudGet<QrCampaign>(`/qrCampaigns/${qrId}`);
  if (cloud?.id) {
    upsertLocalCampaign({ ...cloud, submissionCount: Number(cloud.submissionCount) || 0 });
    return cloud;
  }
  return null;
}

export async function saveQrCampaign(campaign: QrCampaign): Promise<boolean> {
  upsertLocalCampaign(campaign);
  return cloudPut(`/qrCampaigns/${campaign.id}`, campaign);
}

export async function createQrCampaign(input: {
  collegeName: string;
  label?: string;
  amount?: number;
  startDate?: string;
  endDate?: string;
  duration?: string;
  createdBy?: string;
}): Promise<QrCampaign> {
  const amount = Number(input.amount);
  const campaign: QrCampaign = {
    id: generateQrId(input.collegeName),
    collegeName: input.collegeName.trim(),
    label: input.label?.trim() || '',
    amount: Number.isFinite(amount) && amount > 0 ? amount : undefined,
    startDate: input.startDate || '',
    endDate: input.endDate || '',
    duration: input.duration || '',
    createdAt: new Date().toISOString(),
    createdBy: input.createdBy || '',
    submissionCount: 0,
    active: true
  };
  await saveQrCampaign(campaign);
  return campaign;
}

export async function deleteQrCampaign(qrId: string): Promise<void> {
  writeLocalCampaigns(listLocalCampaigns().filter(c => c.id !== qrId));
  try {
    localStorage.removeItem(`${SUBMISSIONS_PREFIX}${qrId}`);
  } catch {
    /* ignore */
  }
  await Promise.all([
    cloudDelete(`/qrCampaigns/${qrId}`),
    cloudDelete(`/qrSubmissions/${qrId}`)
  ]);
}

async function adjustCampaignCount(qrId: string, delta: number): Promise<void> {
  const campaign = await getQrCampaign(qrId);
  if (!campaign) return;
  const next: QrCampaign = {
    ...campaign,
    submissionCount: Math.max(0, (Number(campaign.submissionCount) || 0) + delta)
  };
  await saveQrCampaign(next);
}

/* ------------------------------------------------------------------ */
/* Submissions                                                         */
/* ------------------------------------------------------------------ */

export function listLocalSubmissions(qrId: string): QrSubmission[] {
  return readJson<QrSubmission[]>(`${SUBMISSIONS_PREFIX}${qrId}`, []).filter(Boolean);
}

function writeLocalSubmissions(qrId: string, list: QrSubmission[]) {
  writeJson(`${SUBMISSIONS_PREFIX}${qrId}`, list);
}

function upsertLocalSubmission(submission: QrSubmission) {
  const list = listLocalSubmissions(submission.qrId);
  const idx = list.findIndex(s => s.id === submission.id);
  if (idx >= 0) list[idx] = { ...list[idx], ...submission };
  else list.unshift(submission);
  writeLocalSubmissions(submission.qrId, list);
}

export async function fetchQrSubmissions(qrId: string): Promise<QrSubmission[]> {
  const local = listLocalSubmissions(qrId);
  const cloud = await cloudGet<Record<string, QrSubmission>>(`/qrSubmissions/${qrId}`);
  const cloudList = asList<QrSubmission>(cloud);

  if (!cloudList.length) return sortSubmissions(local);

  const merged = new Map<string, QrSubmission>();
  local.forEach(s => { if (s?.id) merged.set(s.id, s); });
  cloudList.forEach(s => { if (s?.id) merged.set(s.id, { ...s, qrId }); });

  const list = sortSubmissions([...merged.values()]);
  writeLocalSubmissions(qrId, list);
  return list;
}

function sortSubmissions(list: QrSubmission[]): QrSubmission[] {
  return [...list].sort((a, b) => String(b.submittedAt || '').localeCompare(String(a.submittedAt || '')));
}

export async function submitQrForm(
  input: Omit<QrSubmission, 'id' | 'submittedAt'> & { id?: string }
): Promise<QrSubmission> {
  const submission: QrSubmission = {
    ...input,
    id: input.id || newId('sub'),
    submittedAt: new Date().toISOString()
  };

  upsertLocalSubmission(submission);
  await cloudPut(`/qrSubmissions/${submission.qrId}/${submission.id}`, submission);
  // Keep the local counter in sync even when the cloud write is temporarily
  // offline — the submissions list remains the source of truth in the admin.
  await adjustCampaignCount(submission.qrId, 1);
  return submission;
}

export async function updateQrSubmission(submission: QrSubmission): Promise<boolean> {
  upsertLocalSubmission(submission);
  return cloudPut(`/qrSubmissions/${submission.qrId}/${submission.id}`, submission);
}

export async function markQrSubmissionImported(
  submission: QrSubmission,
  studentId: string
): Promise<void> {
  const next: QrSubmission = { ...submission, studentId, imported: true };
  upsertLocalSubmission(next);
  await cloudPut(`/qrSubmissions/${submission.qrId}/${submission.id}`, next);
}

export async function deleteQrSubmission(submission: QrSubmission): Promise<void> {
  const list = listLocalSubmissions(submission.qrId).filter(s => s.id !== submission.id);
  writeLocalSubmissions(submission.qrId, list);
  await cloudDelete(`/qrSubmissions/${submission.qrId}/${submission.id}`);
  await adjustCampaignCount(submission.qrId, -1);
}
