/**
 * Admin dashboard API client.
 *
 * Uses same-origin fetch with credentials (HttpOnly auth cookie) plus the
 * double-submit CSRF token: every state-changing request echoes the readable
 * `atideto_csrf` cookie in the `x-csrf-token` header.
 */

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';

const CSRF_COOKIE = 'atideto_csrf';

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export class AdminApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'AdminApiError';
    this.status = status;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH';
  body?: unknown;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  const method = options.method ?? 'GET';
  const isMutation = method !== 'GET';

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (isMutation) {
    const csrf = getCookie(CSRF_COOKIE);
    if (!csrf) {
      throw new AdminApiError('Session expired. Please login again.', 401);
    }
    headers['x-csrf-token'] = csrf;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/api/admin${path}`, {
      method,
      headers,
      credentials: 'include',
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new AdminApiError('Network error. Please check your connection.', 0);
  }

  let data: Record<string, unknown> = {};
  try {
    data = (await res.json()) as Record<string, unknown>;
  } catch {
    // ignore — will throw with status below
  }

  if (!res.ok) {
    const message = (data.message as string) || 'Request failed';
    if (res.status === 401) {
      throw new AdminApiError('Session expired. Please login again.', 401);
    }
    throw new AdminApiError(message, res.status);
  }

  return data as T;
}

// ============================================================
// Auth
// ============================================================

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export async function login(email: string, password: string): Promise<{ admin: AdminUser; csrfToken: string }> {
  const data = await request<{ success: boolean; data: { admin: AdminUser; csrfToken: string } }>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  return data.data;
}

export async function fetchMe(): Promise<AdminUser> {
  const data = await request<{ success: boolean; data: { admin: AdminUser } }>('/auth/me');
  return data.data.admin;
}

export async function logout(): Promise<void> {
  await request<{ success: boolean }>('/auth/logout', { method: 'POST' });
}

// ============================================================
// Applications
// ============================================================

export interface Application {
  id: string;
  applicationId: string;
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  college: string;
  registerNo: string;
  degree: string;
  stream: string;
  graduationYear: string;
  programId: string;
  programTitle: string;
  selectedCourse: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  reportIncluded: boolean;
  paymentOption: string;
  status: string;
  emailStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationListResult {
  applications: Application[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Stats {
  total: number;
  byStatus: Record<string, number>;
}

export async function getStats(): Promise<Stats> {
  const data = await request<{ success: boolean; data: Stats }>('/stats');
  return data.data;
}

export async function listApplications(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: 'latest' | 'oldest';
}): Promise<ApplicationListResult> {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.search) qs.set('search', params.search);
  if (params.status) qs.set('status', params.status);
  if (params.sort) qs.set('sort', params.sort);
  const query = qs.toString();
  const data = await request<{ success: boolean; data: ApplicationListResult }>(`/applications${query ? `?${query}` : ''}`);
  return data.data;
}

export async function getApplication(applicationId: string): Promise<Application> {
  const data = await request<{ success: boolean; data: { application: Application } }>(
    `/applications/${encodeURIComponent(applicationId)}`,
  );
  return data.data.application;
}

export async function updateApplicationStatus(applicationId: string, status: string): Promise<Application> {
  const data = await request<{ success: boolean; data: { application: Application } }>(
    `/applications/${encodeURIComponent(applicationId)}/status`,
    { method: 'PATCH', body: { status } },
  );
  return data.data.application;
}

export async function getEligibleApplications(): Promise<Application[]> {
  const data = await request<{ success: boolean; data: { applications: Application[] } }>('/applications/eligible');
  return data.data.applications;
}

// ============================================================
// Certificates
// ============================================================

export interface Certificate {
  id: string;
  certificateId: string;
  applicationId: string | null;
  studentName: string;
  course: string;
  college: string | null;
  startDate: string | null;
  endDate: string | null;
  duration: string | null;
  issueDate: string;
  status: string;
  verificationUrl: string | null;
  verifiedCount: number;
  pdfUrl?: string | null;
  imgUrl?: string | null;
  createdAt: string;
}

export interface CertificateListResult {
  certificates: Certificate[];
  total: number;
  page: number;
  totalPages: number;
}

export async function listCertificates(params: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<CertificateListResult> {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.status) qs.set('status', params.status);
  const query = qs.toString();
  const data = await request<{ success: boolean; data: CertificateListResult }>(
    `/certificates${query ? `?${query}` : ''}`,
  );
  return data.data;
}

export async function getCertificateServiceStatus(): Promise<{ configured: boolean }> {
  const data = await request<{ success: boolean; data: { configured: boolean } }>('/certificates/status');
  return data.data;
}

export async function generateCertificate(applicationId: string): Promise<Certificate> {
  const data = await request<{ success: boolean; data: { certificate: Certificate } }>(
    '/certificates/generate',
    { method: 'POST', body: { applicationId } },
  );
  return data.data.certificate;
}

export async function revokeCertificate(certificateId: string): Promise<Certificate> {
  const data = await request<{ success: boolean; data: { certificate: Certificate } }>(
    `/certificates/${encodeURIComponent(certificateId)}/revoke`,
    { method: 'POST' },
  );
  return data.data.certificate;
}
