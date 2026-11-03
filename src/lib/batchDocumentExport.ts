import type { StudentCohortRecord } from './certificateStore';

export type BatchDocMode = 'certificate' | 'offer-letter' | 'attendance';
export type BatchFormat = 'pdf' | 'png';

export interface BatchStudentDocFields {
  verifyId: string;
  offerLetterNo: string;
  attendanceCertId: string;
  salutation: string;
  totalDays: number;
  presentDays: number;
  attendancePct: string;
}

const FEMALE_NAME_HINTS = [
  'srishanmathi',
  'sailisha',
  'prasantha',
  'priya',
  'shibiya',
  'preethiroshini',
  'priyadharshini',
  'yoshika'
];

/** Mirrors the single-student form derivation so batch output matches the live preview. */
export function deriveStudentDocFields(student: StudentCohortRecord): BatchStudentDocFields {
  const digits = student.certId
    ? student.certId.replace(/[^0-9]/g, '').slice(-4)
    : student.id.replace(/[^0-9]/g, '').slice(-4) || '0001';
  const padded = digits.padStart(4, '0');

  const verifyId =
    student.certId && student.certId.startsWith('ATD-INT-2026-')
      ? student.certId
      : `ATD-INT-2026-${padded}`;
  const offerLetterNo =
    student.offerNo && student.offerNo.startsWith('ATD-OFL-2026-')
      ? student.offerNo
      : `ATD-OFL-2026-${padded}`;
  const attendanceCertId = student.attendanceCertId || `ATD-ATT-2026-${padded}`;

  const totalDays = 26;
  const attendance = student.attendance !== undefined ? student.attendance : 100;
  const presentDays = Math.round(totalDays * (attendance / 100));

  const lowerName = (student.name || '').toLowerCase();
  const salutation = FEMALE_NAME_HINTS.some((hint) => lowerName.includes(hint)) ? 'Ms.' : 'Mr.';

  return {
    verifyId,
    offerLetterNo,
    attendanceCertId,
    salutation,
    totalDays,
    presentDays,
    attendancePct: `${attendance}%`
  };
}

export function sanitizeFileSegment(value: string): string {
  return (value || '')
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^A-Za-z0-9_-]/g, '')
    .replace(/_+/g, '_');
}

export function buildBatchDocumentFilename(
  student: StudentCohortRecord,
  mode: BatchDocMode,
  format: BatchFormat
): string {
  const fields = deriveStudentDocFields(student);
  const cleanName = sanitizeFileSegment(student.name) || sanitizeFileSegment(student.id) || 'Candidate';
  const ext = format === 'pdf' ? 'pdf' : 'png';
  const pdfTag = format === 'pdf' ? 'Official_' : '';

  if (mode === 'certificate') {
    return `ATIDETO_${pdfTag}Certificate_${cleanName}_${sanitizeFileSegment(fields.verifyId)}.${ext}`;
  }
  if (mode === 'attendance') {
    return `ATIDETO_${pdfTag}AttendanceCertificate_${cleanName}_${sanitizeFileSegment(
      fields.attendanceCertId
    )}.${ext}`;
  }
  return `ATIDETO_${pdfTag}OfferLetter_${cleanName}_${sanitizeFileSegment(
    fields.offerLetterNo
  )}.${ext}`;
}

export function buildBatchArchiveName(mode: BatchDocMode, format: BatchFormat): string {
  const stamp = new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/[:T]/g, '-');
  const label =
    mode === 'certificate'
      ? 'Completion_Certificates'
      : mode === 'attendance'
      ? 'Attendance_Certificates'
      : 'Offer_Letters';
  return `ATIDETO_${label}_${format.toUpperCase()}_${stamp}.zip`;
}

export interface BatchFileEntry {
  name: string;
  blob: Blob;
}

/** Bundles already-rendered blobs into a ZIP archive (store mode, since PDFs/PNGs are compressed). */
export async function createZipArchive(files: BatchFileEntry[]): Promise<Blob> {
  // Lazy-load JSZip so the dashboard's initial bundle stays lean.
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  const usedNames = new Set<string>();

  for (const file of files) {
    let name = file.name;
    if (usedNames.has(name)) {
      const dot = name.lastIndexOf('.');
      const base = dot === -1 ? name : name.slice(0, dot);
      const ext = dot === -1 ? '' : name.slice(dot);
      let counter = 2;
      while (usedNames.has(`${base}_${counter}${ext}`)) counter += 1;
      name = `${base}_${counter}${ext}`;
    }
    usedNames.add(name);
    zip.file(name, file.blob);
  }

  return zip.generateAsync({
    type: 'blob',
    compression: 'STORE'
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
