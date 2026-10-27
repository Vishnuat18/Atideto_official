// Atideto Cloud Database Synchronization Engine
// Uses Firebase Realtime Database for cross-mobile, multi-device, and Vercel cloud synchronization.
// Guarantees real-time synchronization across mobile phones, tablets, and desktop browsers.

import { StudentCohortRecord, saveStoredStudents, getStoredStudents } from './certificateStore';

const RTDB_BASE = ((import.meta.env?.VITE_FIREBASE_DATABASE_URL as string) || 'https://nitha-8f9f4-default-rtdb.firebaseio.com').replace(/\/+$/, '') + '/erp_live';

interface CloudMeta {
  lastSync: number;
  syncedBy?: string;
  version?: number;
}

/**
 * Fetch all students from the authoritative Cloud Realtime Database.
 */
export async function fetchCloudStudents(): Promise<StudentCohortRecord[] | null> {
  try {
    const res = await fetch(`${RTDB_BASE}/students.json?_t=${Date.now()}`, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data) return null;

    let list: StudentCohortRecord[] = [];
    if (Array.isArray(data)) {
      list = data.filter(Boolean);
    } else if (typeof data === 'object') {
      list = Object.values(data);
    }

    if (list.length > 0) {
      // Clean and normalize each record
      const cleaned = list.map(s => ({
        ...s,
        id: s.studentId || s.id,
        studentId: s.studentId || s.id,
        tools: Array.isArray(s.tools) ? s.tools : [],
        area: Array.isArray(s.area) ? s.area : [],
        startDate: s.startDate || '2026-10-25',
        endDate: s.endDate || '2027-01-25',
        duration: s.duration || '3 Months'
      }));
      saveStoredStudents(cleaned, true);
      return cleaned;
    }
  } catch (err) {
    console.warn('[CloudSync] fetchCloudStudents error:', err);
  }
  return null;
}

/**
 * Persist the entire student list to the Cloud Realtime Database.
 */
export async function saveCloudStudents(students: StudentCohortRecord[]): Promise<boolean> {
  if (!Array.isArray(students) || students.length === 0) return false;
  try {
    const res = await fetch(`${RTDB_BASE}/students.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(students)
    });
    if (res.ok) {
      touchCloudMeta('students');
      saveStoredStudents(students);
      return true;
    }
  } catch (err) {
    console.warn('[CloudSync] saveCloudStudents error:', err);
  }
  return false;
}

/**
 * Update a specific student record in Cloud Realtime Database.
 * Immediately propagates changes to any other connected devices.
 */
export async function saveCloudStudent(studentId: string, updates: Partial<StudentCohortRecord>): Promise<boolean> {
  if (!studentId || !updates) return false;
  try {
    // 1. Fetch current cloud students or use cached
    let currentStudents = await fetchCloudStudents();
    if (!currentStudents || currentStudents.length === 0) {
      currentStudents = getStoredStudents();
    }

    const idx = currentStudents.findIndex(s => s.id === studentId || s.studentId === studentId);
    let updatedList: StudentCohortRecord[];

    if (idx >= 0) {
      const merged = { ...currentStudents[idx], ...updates };
      currentStudents[idx] = merged;
      updatedList = [...currentStudents];
    } else {
      const newRec = {
        id: studentId,
        studentId,
        name: updates.name || 'Enrolled Student',
        email: updates.email || '',
        phone: updates.phone || '',
        college: updates.college || 'Mahendra Engineering College',
        degree: updates.degree || 'B.Tech Information Technology',
        gradYear: updates.gradYear || '2027',
        course: updates.course || updates.domain || 'Full Stack Web Development',
        domain: updates.domain || updates.course || 'Full Stack Web Development',
        startDate: updates.startDate || '2026-10-25',
        endDate: updates.endDate || '2027-01-25',
        duration: updates.duration || '3 Months',
        mentor: updates.mentor || 'Karthik Ramanathan (AI & Web Lead)',
        attendance: updates.attendance !== undefined ? Number(updates.attendance) : 95,
        score: updates.score !== undefined ? Number(updates.score) : 95,
        feePaid: updates.feePaid || '₹0',
        feeTotal: updates.feeTotal || 'To Be Decided by Admin',
        paymentStatus: updates.paymentStatus || 'Pending Admin Decision',
        certId: updates.certId || `ATD-INT-2026-${String(currentStudents.length + 1).padStart(4, '0')}`,
        offerNo: updates.offerNo || `ATD-OFL-2026-${String(currentStudents.length + 1).padStart(4, '0')}`,
        issueDate: updates.issueDate || updates.startDate || '2026-10-25',
        status: (updates.status as any) || 'active',
        tools: updates.tools || ['React', 'Node.js', 'Express', 'MongoDB'],
        area: updates.area || ['Full Stack', 'Web Development'],
        ...updates
      } as StudentCohortRecord;
      updatedList = [...currentStudents, newRec];
    }

    // 2. Put updated list to cloud
    const saved = await saveCloudStudents(updatedList);
    if (saved) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('atideto_students_updated', {
          detail: { studentId, updates, fullList: updatedList }
        }));
      }
      return true;
    }
  } catch (err) {
    console.warn('[CloudSync] saveCloudStudent error:', err);
  }
  return false;
}

/**
 * Delete a student from Cloud Realtime Database.
 */
export async function deleteCloudStudent(studentId: string): Promise<boolean> {
  if (!studentId) return false;
  try {
    let currentStudents = await fetchCloudStudents();
    if (!currentStudents) currentStudents = getStoredStudents();

    const filtered = currentStudents.filter(s => s.id !== studentId && s.studentId !== studentId);
    return await saveCloudStudents(filtered);
  } catch (err) {
    console.warn('[CloudSync] deleteCloudStudent error:', err);
  }
  return false;
}

/**
 * Fetch CRM Clients from Cloud RTDB.
 */
export async function fetchCloudClients(): Promise<any[] | null> {
  try {
    const res = await fetch(`${RTDB_BASE}/clients.json?_t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data) return null;
    return Array.isArray(data) ? data.filter(Boolean) : Object.values(data);
  } catch {
    return null;
  }
}

export async function saveCloudClients(clients: any[]): Promise<boolean> {
  try {
    const res = await fetch(`${RTDB_BASE}/clients.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clients)
    });
    if (res.ok) {
      touchCloudMeta('clients');
      return true;
    }
  } catch {}
  return false;
}

/**
 * Fetch Founders & Staff from Cloud RTDB.
 */
export async function fetchCloudStaff(): Promise<any[] | null> {
  try {
    const res = await fetch(`${RTDB_BASE}/staff.json?_t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data) return null;
    return Array.isArray(data) ? data.filter(Boolean) : Object.values(data);
  } catch {
    return null;
  }
}

export async function saveCloudStaff(staff: any[]): Promise<boolean> {
  try {
    const res = await fetch(`${RTDB_BASE}/staff.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staff)
    });
    if (res.ok) {
      touchCloudMeta('staff');
      return true;
    }
  } catch {}
  return false;
}

/**
 * Fetch Registrations from Cloud RTDB.
 */
export async function fetchCloudRegistrations(): Promise<any[] | null> {
  try {
    const res = await fetch(`${RTDB_BASE}/registrations.json?_t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data) return null;
    return Array.isArray(data) ? data.filter(Boolean) : Object.values(data);
  } catch {
    return null;
  }
}

export async function saveCloudRegistrations(regs: any[]): Promise<boolean> {
  try {
    const res = await fetch(`${RTDB_BASE}/registrations.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regs)
    });
    if (res.ok) {
      touchCloudMeta('registrations');
      return true;
    }
  } catch {}
  return false;
}

/**
 * Fetch Payments from Cloud RTDB.
 */
export async function fetchCloudPayments(): Promise<any[] | null> {
  try {
    const res = await fetch(`${RTDB_BASE}/payments.json?_t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data) return null;
    return Array.isArray(data) ? data.filter(Boolean) : Object.values(data);
  } catch {
    return null;
  }
}

export async function saveCloudPayments(payments: any[]): Promise<boolean> {
  try {
    const res = await fetch(`${RTDB_BASE}/payments.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payments)
    });
    if (res.ok) {
      touchCloudMeta('payments');
      return true;
    }
  } catch {}
  return false;
}

/**
 * Fetch all ERP collections in parallel for instant synchronization.
 */
export async function syncAllCloudData() {
  const [students, clients, staff, regs, payments] = await Promise.all([
    fetchCloudStudents().catch(() => null),
    fetchCloudClients().catch(() => null),
    fetchCloudStaff().catch(() => null),
    fetchCloudRegistrations().catch(() => null),
    fetchCloudPayments().catch(() => null)
  ]);

  return {
    students,
    clients,
    staff,
    registrations: regs,
    payments,
    syncedAt: Date.now()
  };
}

/**
 * Internal helper to update metadata timestamp in Cloud RTDB.
 */
async function touchCloudMeta(entity: string) {
  try {
    await fetch(`${RTDB_BASE}/meta.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lastSync: Date.now(),
        lastUpdatedEntity: entity,
        syncedBy: 'admin@atideto.in'
      })
    });
  } catch {}
}

/**
 * Live Cloud Sync listener:
 * Polls every 6 seconds and listens to focus & visibilitychange events.
 * Executes callback whenever a newer update is detected on another device.
 */
export function subscribeToCloudSync(onSync: (data: any) => void) {
  if (typeof window === 'undefined') return () => {};

  let lastKnownSync: number | null = null;
  let isChecking = false;

  const checkForUpdates = async () => {
    if (isChecking) return;
    isChecking = true;
    try {
      const metaRes = await fetch(`${RTDB_BASE}/meta.json?_t=${Date.now()}`, { cache: 'no-store' });
      if (metaRes.ok) {
        const meta: CloudMeta = await metaRes.json();
        if (meta && meta.lastSync) {
          // On first run, record the current timestamp without triggering an immediate full re-render
          if (lastKnownSync === null) {
            lastKnownSync = meta.lastSync;
            return;
          }
          if (meta.lastSync > lastKnownSync) {
            lastKnownSync = meta.lastSync;
            const freshData = await syncAllCloudData();
            onSync(freshData);
          }
        }
      }
    } catch (err) {
      // Ignore background transient network hiccups
    } finally {
      isChecking = false;
    }
  };

  // Initial check on mount to initialize lastKnownSync
  checkForUpdates();

  // Gentle periodic polling every 15 seconds (never causes 1-second UI loops)
  const interval = setInterval(checkForUpdates, 15000);

  // Sync on tab focus or screen unlock
  const handleFocus = () => {
    if (document.visibilityState === 'visible') {
      checkForUpdates();
    }
  };

  window.addEventListener('focus', handleFocus);
  document.addEventListener('visibilitychange', handleFocus);

  return () => {
    clearInterval(interval);
    window.removeEventListener('focus', handleFocus);
    document.removeEventListener('visibilitychange', handleFocus);
  };
}

/**
 * Sanitize an email address for use as a Firebase Realtime Database node key.
 */
export function encodeEmailKey(email: string): string {
  return (email || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
}

/**
 * Save user credentials and account details to Cloud RTDB.
 * Enables login from any device or phone even when MySQL is offline.
 */
export async function saveCloudUser(userData: {
  email: string;
  name?: string;
  password?: string;
  role?: string;
  uid?: string;
  studentId?: string;
}): Promise<boolean> {
  const cleanEmail = (userData.email || '').toLowerCase().trim();
  if (!cleanEmail) return false;
  const key = encodeEmailKey(cleanEmail);

  try {
    const existing = await fetchCloudUser(cleanEmail);
    const updated = {
      ...(existing || {}),
      email: cleanEmail,
      name: userData.name || existing?.name || cleanEmail.split('@')[0],
      role: userData.role || existing?.role || (cleanEmail.endsWith('@atideto.in') ? 'admin' : 'student'),
      uid: userData.uid || existing?.uid || `usr-${Date.now()}`,
      ...(userData.password ? { password: userData.password } : {}),
      ...(userData.studentId ? { studentId: userData.studentId } : {}),
      updatedAt: Date.now()
    };

    const res = await fetch(`${RTDB_BASE}/users/${key}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    return res.ok;
  } catch (err) {
    console.warn('[CloudSync] saveCloudUser error:', err);
    return false;
  }
}

/**
 * Retrieve user record from Cloud RTDB by email.
 */
export async function fetchCloudUser(email: string): Promise<any | null> {
  const cleanEmail = (email || '').toLowerCase().trim();
  if (!cleanEmail) return null;
  const key = encodeEmailKey(cleanEmail);
  try {
    const res = await fetch(`${RTDB_BASE}/users/${key}.json?_t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Save active OTP to Cloud RTDB for multi-instance stateless verification.
 */
export async function saveCloudOtp(email: string, otp: string, expiresAt: number): Promise<boolean> {
  const cleanEmail = (email || '').toLowerCase().trim();
  if (!cleanEmail || !otp) return false;
  const key = encodeEmailKey(cleanEmail);
  try {
    const res = await fetch(`${RTDB_BASE}/otps/${key}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: otp,
        expires: expiresAt,
        verified: false,
        createdAt: Date.now()
      })
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Verify OTP against Cloud RTDB.
 */
export async function verifyCloudOtp(email: string, otp: string): Promise<boolean> {
  const cleanEmail = (email || '').toLowerCase().trim();
  if (!cleanEmail || !otp) return false;
  const key = encodeEmailKey(cleanEmail);
  try {
    const res = await fetch(`${RTDB_BASE}/otps/${key}.json?_t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return false;
    const data = await res.json();
    if (!data) return false;
    const isValid = String(data.code).trim() === String(otp).trim() && Date.now() <= data.expires;
    if (isValid) {
      await fetch(`${RTDB_BASE}/otps/${key}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: true })
      });
      return true;
    }
  } catch {}
  return false;
}

/**
 * Delete OTP after successful password reset.
 */
export async function deleteCloudOtp(email: string): Promise<boolean> {
  const cleanEmail = (email || '').toLowerCase().trim();
  if (!cleanEmail) return false;
  const key = encodeEmailKey(cleanEmail);
  try {
    const res = await fetch(`${RTDB_BASE}/otps/${key}.json`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}

