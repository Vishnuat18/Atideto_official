import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, 
  Printer, 
  Sparkles, 
  CheckCircle2, 
  Palette, 
  Type, 
  FileText, 
  RotateCcw,
  ExternalLink,
  ChevronDown,
  Layers,
  Award,
  Briefcase,
  Calendar,
  CalendarCheck,
  Clock,
  Share2,
  X,
  Maximize2,
  PauseCircle,
  PlayCircle,
  ZoomIn,
  ZoomOut,
  Plus,
  Minus,
  SlidersHorizontal,
  FileArchive,
  Loader2,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import {
  exportElementToA4Pdf,
  exportElementToImage,
  renderElementToPdfBlob,
  renderElementToPngBlob,
  DEFAULT_EXPORT_SCALE
} from '@/lib/exportPdfDocument';
import {
  BatchDocMode,
  BatchFormat,
  BatchFileEntry,
  BatchStudentDocFields,
  buildBatchArchiveName,
  buildBatchDocumentFilename,
  createZipArchive,
  deriveStudentDocFields,
  downloadBlob
} from '@/lib/batchDocumentExport';
import { 
  AuthenticCertificateCanvas,
  CertificateVariant
} from '@/components/certificates/AuthenticCertificateCanvas';
import { 
  AuthenticOfferLetterCanvas 
} from '@/components/certificates/AuthenticOfferLetterCanvas';
import { 
  AuthenticAttendanceCertificateCanvas 
} from '@/components/certificates/AuthenticAttendanceCertificateCanvas';
import { 
  FullScreenCertificateModal 
} from '@/components/certificates/FullScreenCertificateModal';
import { printOfficialDocument } from '@/lib/printDocument';
import { 
  StudentCohortRecord, 
  getStoredStudents, 
  updateStudentInRegistry, 
  bulkUpdateStudentsInRegistry,
  toggleStudentCertificateHold,
  getVerificationUrl 
} from '@/lib/certificateStore';

import qrPlaceholderImg from '@/assets/certificates/qr-placeholder.png';
import QRCode from 'qrcode';

interface CertificateGeneratorDrawerProps {
  initialStudent?: StudentCohortRecord | null;
  mode?: 'certificate' | 'offer-letter' | 'attendance';
  certVariant?: CertificateVariant;
  onClose: () => void;
  onStudentUpdated?: (updated: StudentCohortRecord) => void;
}

interface BatchZipItem {
  student: StudentCohortRecord;
  mode: BatchDocMode;
  qrCodeUrl?: string;
  filename: string;
  fields: BatchStudentDocFields;
}

interface BatchZipSession {
  items: BatchZipItem[];
  index: number;
  files: BatchFileEntry[];
  format: BatchFormat;
  archiveName: string;
}

const BATCH_ZIP_TOAST_ID = 'batch-zip-download';

function showBatchProgressToast(done: number, total: number, label: string) {
  const pct = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
  toast.custom(
    () => (
      <div className="w-[340px] max-w-[88vw] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
        <div className="mb-2 flex items-center gap-2">
          <Loader2 className="animate-spin text-blue-600 shrink-0" size={16} />
          <span className="text-sm font-bold text-slate-900">Preparing ZIP download</span>
          <span className="ml-auto text-[11px] font-mono font-bold text-slate-500">
            {done}/{total}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 truncate text-[11px] text-slate-500">{label}</p>
      </div>
    ),
    { id: BATCH_ZIP_TOAST_ID, duration: Infinity, position: 'bottom-right' }
  );
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function formatDateDisplay(iso: string) {
  if (!iso) return '';
  const parts = iso.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    if (y && m && d && m >= 1 && m <= 12) {
      return `${String(d).padStart(2, '0')} ${MONTHS[m - 1]} ${y}`;
    }
  }
  return iso;
}

export function computeEndDateFromDuration(startDateStr: string, durationStr: string): string {
  if (!startDateStr) return '';
  const parts = startDateStr.split('-').map(Number);
  if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) return startDateStr;
  const [year, month, day] = parts;

  const dLower = (durationStr || '').toLowerCase().trim();

  // University 30-working-day cohort curriculum: 2026-09-14 (or 2026-09-04) -> 2026-10-14
  if ((dLower.includes('30') && dLower.includes('day')) && (startDateStr === '2026-09-14' || startDateStr === '2026-09-04' || startDateStr === '14-09-2026' || startDateStr === '04-09-2026')) {
    return '2026-10-14';
  }

  // Match months: e.g. "1 Month", "2 Months", "3 Months", "6 Months"
  const monthMatch = dLower.match(/^(\d+)\s*(month|months|m)$/);
  if (monthMatch) {
    const count = parseInt(monthMatch[1], 10);
    const date = new Date(year, month - 1 + count, day);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // Match weeks: e.g. "2 Weeks", "4 Weeks"
  const weekMatch = dLower.match(/^(\d+)\s*(week|weeks|w)$/);
  if (weekMatch) {
    const count = parseInt(weekMatch[1], 10);
    const date = new Date(year, month - 1, day + count * 7);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // Match days: e.g. "15 Days", "30 Days", "45 Days", "60 Days", "90 Days"
  const dayMatch = dLower.match(/^(\d+)\s*(day|days|d)$/);
  if (dayMatch) {
    const count = parseInt(dayMatch[1], 10);
    if (count === 30 && (startDateStr === '2026-09-14' || startDateStr === '2026-09-04')) {
      return '2026-10-14';
    }
    const date = new Date(year, month - 1, day + count);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  return startDateStr;
}

export function computeDurationFromDates(startStr: string, endStr: string): string {
  if (!startStr || !endStr) return '';
  const sParts = startStr.split('-').map(Number);
  const eParts = endStr.split('-').map(Number);
  if (sParts.length !== 3 || eParts.length !== 3) return '';

  const sDate = new Date(sParts[0], sParts[1] - 1, sParts[2]);
  const eDate = new Date(eParts[0], eParts[1] - 1, eParts[2]);

  const diffTime = eDate.getTime() - sDate.getTime();
  if (diffTime <= 0) return '0 Days';

  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  // University 30-working-day cohort curriculum: 2026-09-14 to 2026-10-14
  if ((startStr.includes('09-14') || startStr.includes('09-04')) && endStr.includes('10-14')) {
    return '30 Days';
  }

  const yearDiff = eParts[0] - sParts[0];
  const monthDiff = yearDiff * 12 + (eParts[1] - sParts[1]);

  if (sParts[2] === eParts[2] && monthDiff > 0) {
    return monthDiff === 1 ? '1 Month' : `${monthDiff} Months`;
  }

  if (diffDays >= 28 && diffDays <= 32) return '1 Month';
  if (diffDays >= 58 && diffDays <= 63) return '2 Months';
  if (diffDays >= 88 && diffDays <= 93) return '3 Months';
  if (diffDays >= 118 && diffDays <= 124) return '4 Months';
  if (diffDays >= 148 && diffDays <= 155) return '5 Months';
  if (diffDays >= 178 && diffDays <= 186) return '6 Months';

  if (diffDays % 7 === 0 && diffDays < 28) {
    const weeks = diffDays / 7;
    return weeks === 1 ? '1 Week' : `${weeks} Weeks`;
  }

  return `${diffDays} Days`;
}

export function computeDaysBetweenDates(startStr: string, endStr: string): number {
  if (!startStr || !endStr) return 30;
  const sParts = startStr.split('-').map(Number);
  const eParts = endStr.split('-').map(Number);
  if (sParts.length !== 3 || eParts.length !== 3) return 30;
  const sDate = new Date(sParts[0], sParts[1] - 1, sParts[2]);
  const eDate = new Date(eParts[0], eParts[1] - 1, eParts[2]);
  const diffTime = eDate.getTime() - sDate.getTime();
  if (diffTime <= 0) return 1;
  return Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));
}

export const CertificateGeneratorDrawer: React.FC<CertificateGeneratorDrawerProps> = ({
  initialStudent,
  mode: initialMode = 'certificate',
  certVariant = 'internship',
  onClose,
  onStudentUpdated
}) => {
  const [activeDocMode, setActiveDocMode] = useState<'certificate' | 'offer-letter' | 'attendance'>(initialMode);
  const certificateDocLabel =
    certVariant === 'course'
      ? 'Course Completion Certificate'
      : certVariant === 'project'
      ? 'Project Completion Certificate'
      : 'Internship Completion Certificate';
  const certificateFileSlug =
    certVariant === 'course'
      ? 'CourseCompletionCertificate'
      : certVariant === 'project'
      ? 'ProjectCompletionCertificate'
      : 'Certificate';
  const certificateShortLabel =
    certVariant === 'course'
      ? 'Course Certificate'
      : certVariant === 'project'
      ? 'Project Certificate'
      : 'Completion Certificate';
  const studentsList = getStoredStudents();

  // Selected Student
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudent?.id || studentsList[0]?.id || '621523205106'
  );

  // Common Form Fields
  const [studentName, setStudentName] = useState(initialStudent?.name || studentsList[0]?.name || 'SURESH KUMAR D');
  const [salutation, setSalutation] = useState('Mr.');
  const [collegeName, setCollegeName] = useState(initialStudent?.college || studentsList[0]?.college || 'Mahendra College of Engineering');
  const [registerNo, setRegisterNo] = useState(initialStudent?.registerNumber || initialStudent?.id || studentsList[0]?.registerNumber || studentsList[0]?.id || '621523205106');
  const [domain, setDomain] = useState(initialStudent?.domain || studentsList[0]?.domain || 'FULL STACK WEB DEVELOPMENT');
  const [startDate, setStartDate] = useState(initialStudent?.startDate || '2026-09-14');
  const [endDate, setEndDate] = useState(initialStudent?.endDate || '2026-10-14');
  const [duration, setDuration] = useState(initialStudent?.duration || '30 Days');
  const [issueDate, setIssueDate] = useState(initialStudent?.issueDate || '2026-10-14');
  const [verifyId, setVerifyId] = useState(initialStudent?.certId || 'ATD-INT-2026-0001');
  const [offerLetterNo, setOfferLetterNo] = useState(initialStudent?.offerNo || 'ATD-OFL-2026-0001');
  const [studentEmail, setStudentEmail] = useState(initialStudent?.email || 'sureshkumard706@gmail.com');
  const [studentPhone, setStudentPhone] = useState(initialStudent?.phone || '+91 90473 33741');
  const [modeOfWork, setModeOfWork] = useState('Offline');
  const [udyamId, setUdyamId] = useState('UDYAM-TN-20-0242534');
  const [signatoryTitle, setSignatoryTitle] = useState('Founder, ATIDETO Technologies');

  // Attendance Certificate Specific Fields
  const [department, setDepartment] = useState(initialStudent?.degree || 'Department of Computer Science and Engineering');
  const [totalDays, setTotalDays] = useState<number>(26);
  const [presentDays, setPresentDays] = useState<number>(26);
  const [attendancePct, setAttendancePct] = useState<string>('100%');
  const [attendanceCertId, setAttendanceCertId] = useState<string>(
    initialStudent?.attendanceCertId || 'ATD-ATT-2026-0001'
  );

  // Customization & Typography
  const [activeStudioTab, setActiveStudioTab] = useState<'details' | 'typography' | 'presets'>('details');
  const [nameFont, setNameFont] = useState<'Cormorant Garamond' | 'Playfair Display' | 'Great Vibes' | 'Inter' | 'Cinzel' | 'Bodoni Moda'>('Cormorant Garamond');
  const [nameColor, setNameColor] = useState('#12539c');
  const [nameSize, setNameSize] = useState(58);
  const [themePreset, setThemePreset] = useState<'navy-gold' | 'executive' | 'modern-blue' | 'classic-serif'>('navy-gold');

  // Internship Certificate Granular Sizing Options
  const [overallScale, setOverallScale] = useState<number>(1.0);
  const [logoHeight, setLogoHeight] = useState<number>(98);
  const [certTitleSize, setCertTitleSize] = useState<number>(44);
  const [domainFontSize, setDomainFontSize] = useState<number>(17);
  const [domainMarginTop, setDomainMarginTop] = useState<number>(38);
  const [domainMarginBottom, setDomainMarginBottom] = useState<number>(16);
  const [bodyFontSize, setBodyFontSize] = useState<number>(19);
  const [qrSize, setQrSize] = useState<number>(120);
  const [metaFontSize, setMetaFontSize] = useState<number>(15);
  const [footerFontSize, setFooterFontSize] = useState<number>(14);

  const handleIncreaseOverallScale = () => {
    setOverallScale((prev) => {
      const next = Math.min(1.30, Number((prev + 0.05).toFixed(2)));
      toast.success(`Overall certificate content scale increased to ${Math.round(next * 100)}%`);
      return next;
    });
  };

  const handleDecreaseOverallScale = () => {
    setOverallScale((prev) => {
      const next = Math.max(0.75, Number((prev - 0.05).toFixed(2)));
      toast.success(`Overall certificate content scale decreased to ${Math.round(next * 100)}%`);
      return next;
    });
  };

  const handleResetSizing = () => {
    setOverallScale(1.0);
    setLogoHeight(82);
    setCertTitleSize(40);
    setNameSize(52);
    setDomainFontSize(14);
    setDomainMarginTop(38);
    setDomainMarginBottom(16);
    setBodyFontSize(15.5);
    setQrSize(88);
    setMetaFontSize(13.5);
    setFooterFontSize(12.5);
    toast.info('Reset all certificate sizes and scaling to official defaults');
  };

  // QR Code Image Data URL
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const [showFullViewModal, setShowFullViewModal] = useState<boolean>(false);

  // Batch ZIP download state
  const [showBatchZipModal, setShowBatchZipModal] = useState<boolean>(false);
  const [batchSelectedIds, setBatchSelectedIds] = useState<string[]>([]);
  const [batchFormat, setBatchFormat] = useState<BatchFormat>('pdf');
  const [isBatchProcessing, setIsBatchProcessing] = useState<boolean>(false);
  const [batchRenderItem, setBatchRenderItem] = useState<BatchZipItem | null>(null);
  const batchSessionRef = useRef<BatchZipSession | null>(null);
  const batchCanvasRef = useRef<HTMLDivElement | null>(null);

  const certContainerRef = useRef<HTMLDivElement>(null);
  const offerContainerRef = useRef<HTMLDivElement>(null);
  const attendanceContainerRef = useRef<HTMLDivElement>(null);
  const previewWrapperRef = useRef<HTMLDivElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const issueDateRef = useRef<HTMLInputElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(760);

  // Dynamically observe container width for auto-fit responsive preview
  useEffect(() => {
    if (!previewWrapperRef.current) return;
    const updateWidth = () => {
      if (previewWrapperRef.current) {
        setContainerWidth(previewWrapperRef.current.clientWidth);
      }
    };
    updateWidth();
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });
    ro.observe(previewWrapperRef.current);
    window.addEventListener('resize', updateWidth);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Compute proportional fit scale
  const isLandscape = activeDocMode === 'certificate';
  const baseWidth = isLandscape ? 1414 : 850;
  const baseHeight = activeDocMode === 'certificate' ? 1000 : activeDocMode === 'attendance' ? 1202 : 1277;
  const availWidth = Math.max(260, containerWidth - 32);
  const fitScale = Math.min(1, Math.max(0.15, availWidth / baseWidth));
  const effectiveScale = fitScale;

  // Sync when initialStudent changes
  useEffect(() => {
    if (initialStudent) {
      populateStudentData(initialStudent);
    }
  }, [initialStudent]);

  const [syncDatesToAllStudents, setSyncDatesToAllStudents] = useState<boolean>(false);
  const isBatchAllMode = selectedStudentId === 'ALL_COHORT';

  const populateStudentData = (st: StudentCohortRecord) => {
    setSelectedStudentId(st.id);
    setStudentName(st.name);
    setCollegeName(st.college);
    setRegisterNo(st.registerNumber || st.id);
    setDomain(st.domain);
    setStartDate(st.startDate || '2026-09-14');
    setEndDate(st.endDate || '2026-10-14');
    setDuration(st.duration || '30 Days');
    setIssueDate(st.issueDate || '2026-10-14');
    const num = st.certId ? st.certId.replace(/[^0-9]/g, '').slice(-4) : (st.id.replace(/[^0-9]/g, '').slice(-4) || '0001');
    const padded = num.padStart(4, '0');
    setVerifyId(st.certId && st.certId.startsWith('ATD-INT-2026-') ? st.certId : `ATD-INT-2026-${padded}`);
    setOfferLetterNo(st.offerNo && st.offerNo.startsWith('ATD-OFL-2026-') ? st.offerNo : `ATD-OFL-2026-${padded}`);
    setAttendanceCertId(st.attendanceCertId || `ATD-ATT-2026-${padded}`);
    setStudentEmail(st.email);
    setStudentPhone(st.phone);
    setDepartment(st.degree || 'Department of Computer Science and Engineering');

    // Working days: standard 26 working days for 30 days duration (100% default attendance)
    const workDays = 26;
    const attPct = st.attendance !== undefined ? st.attendance : 100;
    const attDays = Math.round(workDays * (attPct / 100));
    setTotalDays(workDays);
    setPresentDays(attDays);
    setAttendancePct(`${attPct}%`);

    // Determine salutation
    const femaleNames = ['srishanmathi', 'sailisha', 'prasantha', 'priya', 'shibiya', 'preethiroshini', 'priyadharshini', 'yoshika'];
    const isFemale = femaleNames.some(fn => st.name.toLowerCase().includes(fn));
    setSalutation(isFemale ? 'Ms.' : 'Mr.');
  };

  // Generate Stable Deterministic QR Code URL (Never changes across regenerations for the same student)
  useEffect(() => {
    let isMounted = true;
    const verificationUrl = getVerificationUrl(verifyId);
    
    QRCode.toDataURL(verificationUrl, {
      width: 280,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
      .then((dataUrl) => {
        if (isMounted) setQrCodeUrl(dataUrl);
      })
      .catch((err) => {
        console.warn('Local QRCode generation error, falling back to network:', err);
        const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=8&data=${encodeURIComponent(verificationUrl)}`;
        if (isMounted) setQrCodeUrl(fallbackUrl);
      });

    return () => {
      isMounted = false;
    };
  }, [verifyId]);

  // Handle Candidate Selection from Dropdown
  const handleStudentSelect = (id: string) => {
    if (id === 'ALL_COHORT') {
      setSelectedStudentId('ALL_COHORT');
      setStudentName('All Enrolled Cohort Candidates');
      setRegisterNo(`Cohort Batch (${studentsList.length} Candidates)`);
      setCollegeName('Mahendra College of Engineering');
      setDomain('FULL STACK WEB DEVELOPMENT');
      setStartDate('2026-09-14');
      setEndDate('2026-10-14');
      setDuration('30 Days');
      setIssueDate('2026-10-14');
      setTotalDays(30);
      setPresentDays(28);
      setAttendancePct('93.3%');
      toast.info(`Switched to Batch Cohort Mode (${studentsList.length} Students)`);
      return;
    }
    const found = studentsList.find(s => s.id === id);
    if (found) {
      populateStudentData(found);
      toast.success(`Loaded credentials for ${found.name}`);
    }
  };

  // Quick Action: Apply current dates, duration & issue date to ALL students in registry
  const handleApplyDatesToAllStudents = () => {
    const allIds = studentsList.map(s => s.id);
    const updates = {
      startDate,
      endDate,
      duration,
      issueDate,
      college: collegeName,
      domain
    };
    bulkUpdateStudentsInRegistry(allIds, updates);
    toast.success(`⚡ Successfully applied Start Date (${startDate}), End Date (${endDate}), and Duration (${duration}) to all ${allIds.length} students!`);
  };

  // Apply Theme Presets
  const applyThemePreset = (preset: 'navy-gold' | 'executive' | 'modern-blue' | 'classic-serif') => {
    setThemePreset(preset);
    if (preset === 'navy-gold') {
      setNameFont('Cormorant Garamond');
      setNameColor('#12539c');
      setNameSize(42);
    } else if (preset === 'executive') {
      setNameFont('Playfair Display');
      setNameColor('#0b2545');
      setNameSize(40);
    } else if (preset === 'modern-blue') {
      setNameFont('Inter');
      setNameColor('#0066FF');
      setNameSize(38);
    } else if (preset === 'classic-serif') {
      setNameFont('Cinzel');
      setNameColor('#a8791f');
      setNameSize(39);
    }
    toast.success(`Applied ${preset.replace('-', ' ')} theme styling`);
  };

  // Check if current student's certificate is already generated
  const selectedStudent = studentsList.find(s => s.id === selectedStudentId);
  const isAlreadyGenerated = Boolean(selectedStudent?.certGenerated);

  // Save / Issue / Regenerate Document
  const handleSaveAndIssue = () => {
    if (isBatchAllMode || syncDatesToAllStudents) {
      const allIds = studentsList.map(s => s.id);
      const updates = {
        college: collegeName,
        domain,
        startDate,
        endDate,
        duration,
        issueDate,
        status: 'active' as const,
        certGenerated: true,
        sentToAdministration: true,
        certGeneratedAt: new Date().toISOString()
      };
      const updatedList = bulkUpdateStudentsInRegistry(allIds, updates);
      if (onStudentUpdated && updatedList[0]) {
        onStudentUpdated(updatedList[0]);
      }
      toast.success(`⚡ Successfully updated and generated documents for all ${allIds.length} candidates across Student Administration!`);
      return;
    }

    const isPreviouslyGenerated = Boolean(selectedStudent?.certGenerated);
    const updated = updateStudentInRegistry(selectedStudentId, {
      name: studentName,
      college: collegeName,
      domain,
      startDate,
      endDate,
      duration,
      issueDate,
      certId: verifyId,
      offerNo: offerLetterNo,
      email: studentEmail,
      phone: studentPhone,
      status: 'active',
      certGenerated: true,
      sentToAdministration: true,
      certGeneratedAt: new Date().toISOString()
    });
    const found = updated.find(s => s.id === selectedStudentId);
    if (found && onStudentUpdated) {
      onStudentUpdated(found);
    }
    toast.success(
      isPreviouslyGenerated
        ? `Official Document successfully regenerated and updated in Student Administration for ${studentName}!`
        : `Official Document generated and sent to Student Administration for ${studentName}!`
    );
  };

  // Admin Privilege: Hold / Release Certificate
  const handleToggleHold = () => {
    if (!selectedStudentId) return;
    const isCurrentlyHeld = Boolean(selectedStudent?.certHold);
    const updated = toggleStudentCertificateHold(selectedStudentId, !isCurrentlyHeld);
    const found = updated.find(s => s.id === selectedStudentId);
    if (found && onStudentUpdated) {
      onStudentUpdated(found);
    }
    toast.success(
      !isCurrentlyHeld
        ? `Certificate placed on HOLD for ${studentName}. Withheld from student portal and public verification.`
        : `Certificate hold RELEASED for ${studentName}. Document is active.`
    );
  };

  // Dedicated isolated print handler
  const handlePrint = () => {
    const targetEl = 
      activeDocMode === 'certificate' 
        ? certContainerRef.current 
        : activeDocMode === 'attendance'
        ? attendanceContainerRef.current 
        : offerContainerRef.current;
    if (!targetEl) return;

    printOfficialDocument(targetEl, {
      orientation: activeDocMode === 'certificate' ? 'landscape' : 'portrait',
      title: activeDocMode === 'certificate' 
        ? `Official_${certificateFileSlug}_${studentName}` 
        : activeDocMode === 'attendance'
        ? `Official_Attendance_Certificate_${studentName}`
        : `Official_OfferLetter_${studentName}`
    });
  };

  // Download High-Resolution PNG (Optimized under 2MB for fast loading)
  const handleDownloadPng = async () => {
    const targetEl = 
      activeDocMode === 'certificate' 
        ? certContainerRef.current 
        : activeDocMode === 'attendance'
        ? attendanceContainerRef.current 
        : offerContainerRef.current;
    if (!targetEl) return;

    try {
      setIsExporting(true);
      const cleanName = studentName.trim().replace(/\s+/g, '_');
      const filename = activeDocMode === 'certificate' 
        ? `ATIDETO_${certificateFileSlug}_${cleanName}_${verifyId}.png`
        : activeDocMode === 'attendance'
        ? `ATIDETO_AttendanceCertificate_${cleanName}_${attendanceCertId.replace(/\//g, '_')}.png`
        : `ATIDETO_OfferLetter_${cleanName}_${offerLetterNo.replace(/\//g, '_')}.png`;

      await exportElementToImage(targetEl, {
        filename,
        canonicalWidth: baseWidth,
        canonicalHeight: baseHeight
      });
    } catch (err) {
      console.error('Download PNG failed:', err);
      toast.dismiss();
      toast.error('Failed to export PNG. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Download Official PDF (Compressed under 2MB for fast loading)
  const handleDownloadPdf = async () => {
    const targetEl = 
      activeDocMode === 'certificate' 
        ? certContainerRef.current 
        : activeDocMode === 'attendance'
        ? attendanceContainerRef.current 
        : offerContainerRef.current;
    if (!targetEl) return;

    try {
      setIsExporting(true);
      const cleanName = studentName.trim().replace(/\s+/g, '_');
      const filename = activeDocMode === 'certificate' 
        ? `ATIDETO_Official_${certificateFileSlug}_${cleanName}.pdf`
        : activeDocMode === 'attendance'
        ? `ATIDETO_Official_AttendanceCertificate_${cleanName}.pdf`
        : `ATIDETO_Official_OfferLetter_${cleanName}.pdf`;

      await exportElementToA4Pdf(targetEl, {
        filename,
        orientation: activeDocMode === 'certificate' ? 'landscape' : 'portrait',
        canonicalWidth: baseWidth,
        canonicalHeight: baseHeight
      });
    } catch (err) {
      console.error('Download PDF failed:', err);
      toast.error('Failed to export PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  // ── Batch ZIP download ────────────────────────────────────────────────
  const handleOpenBatchZip = () => {
    if (studentsList.length === 0) {
      toast.error('No students available for batch download.');
      return;
    }
    setBatchSelectedIds(studentsList.map((s) => s.id));
    setShowBatchZipModal(true);
  };

  const toggleBatchStudent = (id: string) => {
    setBatchSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
    );
  };

  const handleStartBatchZip = async () => {
    if (isBatchProcessing) return;
    const selectedStudents = studentsList.filter((s) => batchSelectedIds.includes(s.id));
    if (selectedStudents.length === 0) {
      toast.error('Select at least one student to download.');
      return;
    }

    setShowBatchZipModal(false);
    setIsBatchProcessing(true);
    showBatchProgressToast(0, selectedStudents.length, 'Preparing documents...');

    try {
      const items: BatchZipItem[] = await Promise.all(
        selectedStudents.map(async (st) => {
          const fields = deriveStudentDocFields(st);
          let itemQrCodeUrl: string | undefined;
          if (activeDocMode === 'certificate') {
            try {
              itemQrCodeUrl = await QRCode.toDataURL(getVerificationUrl(fields.verifyId), {
                width: 250,
                margin: 1,
                errorCorrectionLevel: 'M',
                color: { dark: '#000000', light: '#ffffff' }
              });
            } catch {
              itemQrCodeUrl = undefined;
            }
          }
          return {
            student: st,
            mode: activeDocMode,
            qrCodeUrl: itemQrCodeUrl,
            filename: buildBatchDocumentFilename(st, activeDocMode, batchFormat),
            fields
          } satisfies BatchZipItem;
        })
      );

      batchSessionRef.current = {
        items,
        index: 0,
        files: [],
        format: batchFormat,
        archiveName: buildBatchArchiveName(activeDocMode, batchFormat)
      };
      showBatchProgressToast(0, items.length, items[0].student.name);
      setBatchRenderItem(items[0]);
    } catch (err) {
      console.error('Batch ZIP preparation failed:', err);
      toast.error('Could not prepare batch documents. Please try again.', {
        id: BATCH_ZIP_TOAST_ID
      });
      setIsBatchProcessing(false);
    }
  };

  const getBatchCertificateData = (item: BatchZipItem) => {
    const st = item.student;
    return {
      name: st.name,
      college: st.college,
      id: st.registerNumber || st.id,
      domain: st.domain,
      startDate: st.startDate || '2026-09-14',
      endDate: st.endDate || '2026-10-14',
      duration: st.duration || '30 Days',
      issueDate: st.issueDate || '2026-10-14',
      certId: item.fields.verifyId
    };
  };

  const getBatchOfferLetterData = (item: BatchZipItem) => {
    const st = item.student;
    return {
      studentName: st.name,
      collegeName: st.college,
      studentEmail: st.email,
      studentPhone: st.phone,
      domain: st.domain,
      duration: st.duration || '30 Days',
      startDate: st.startDate || '2026-09-14',
      endDate: st.endDate || '2026-10-14',
      offerLetterNo: item.fields.offerLetterNo,
      issueDate: st.issueDate || '2026-10-14',
      salutation: item.fields.salutation,
      mode: modeOfWork
    };
  };

  const getBatchAttendanceData = (item: BatchZipItem) => {
    const st = item.student;
    return {
      studentName: st.name,
      collegeName: st.college,
      department: st.degree || 'Department of Computer Science and Engineering',
      registerNo: st.registerNumber || st.id,
      domain: st.domain,
      duration: st.duration || '30 Days',
      startDate: st.startDate || '2026-09-14',
      endDate: st.endDate || '2026-10-14',
      totalDays: item.fields.totalDays,
      totalWorkingDays: item.fields.totalDays,
      presentDays: item.fields.presentDays,
      attendancePct: item.fields.attendancePct,
      certId: item.fields.attendanceCertId,
      issueDate: st.issueDate || '2026-10-14'
    };
  };

  // Sequentially render each selected document off-screen, then bundle into a ZIP.
  useEffect(() => {
    if (!batchRenderItem) return;
    const session = batchSessionRef.current;
    if (!session) return;

    let cancelled = false;

    const run = async () => {
      try {
        // Two frames lets React commit the off-screen canvas and paint its <img> nodes.
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
        );
        if (cancelled) return;

        const el = batchCanvasRef.current;
        if (!el) throw new Error('Off-screen document host was not ready.');

        const isLandscape = batchRenderItem.mode === 'certificate';
        const options = {
          canonicalWidth: isLandscape ? 1414 : 850,
          canonicalHeight:
            batchRenderItem.mode === 'certificate'
              ? 1000
              : batchRenderItem.mode === 'attendance'
              ? 1202
              : 1277,
          orientation: isLandscape ? ('landscape' as const) : ('portrait' as const),
          scale: DEFAULT_EXPORT_SCALE
        };

        const blob =
          session.format === 'pdf'
            ? await renderElementToPdfBlob(el, options)
            : await renderElementToPngBlob(el, options);

        if (cancelled) return;

        session.files.push({ name: batchRenderItem.filename, blob });
        const processed = session.index + 1;
        const total = session.items.length;

        if (processed < total) {
          session.index = processed;
          showBatchProgressToast(processed, total, session.items[processed].student.name);
          setBatchRenderItem(session.items[processed]);
        } else {
          showBatchProgressToast(total, total, 'Compressing ZIP archive...');
          const archive = await createZipArchive(session.files);
          if (cancelled) return;
          downloadBlob(archive, session.archiveName);
          batchSessionRef.current = null;
          setBatchRenderItem(null);
          setIsBatchProcessing(false);
          toast.success(
            `Downloaded ${total} document${total === 1 ? '' : 's'} as a ZIP archive!`,
            { id: BATCH_ZIP_TOAST_ID, duration: 4500 }
          );
        }
      } catch (err) {
        console.error('Batch ZIP export failed:', err);
        batchSessionRef.current = null;
        setBatchRenderItem(null);
        setIsBatchProcessing(false);
        toast.error('Batch ZIP download failed. Please try again.', {
          id: BATCH_ZIP_TOAST_ID
        });
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [batchRenderItem]);

  const renderSizeControl = (
    label: string,
    value: number,
    setter: (v: number) => void,
    min: number,
    max: number,
    step = 1,
    unit = 'px',
    description?: string
  ) => (
    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-slate-300 transition space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <span className="font-bold text-slate-800 text-xs block truncate">{label}</span>
          {description && <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{description}</p>}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setter(Math.max(min, Number((value - step).toFixed(1))))}
            className="w-6 h-6 rounded-md bg-white hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 transition cursor-pointer active:scale-95 shadow-2xs"
            title={`Decrease ${label}`}
          >
            <Minus size={11} />
          </button>
          <span className="min-w-[46px] text-center font-mono font-bold text-blue-700 text-xs px-1.5 py-0.5 bg-white border border-slate-200 rounded-md shadow-2xs">
            {value}{unit}
          </span>
          <button
            type="button"
            onClick={() => setter(Math.min(max, Number((value + step).toFixed(1))))}
            className="w-6 h-6 rounded-md bg-white hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 transition cursor-pointer active:scale-95 shadow-2xs"
            title={`Increase ${label}`}
          >
            <Plus size={11} />
          </button>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setter(parseFloat(e.target.value))}
        className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
      />
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-slate-50 text-slate-800 select-text overflow-hidden">
      
      {/* ───────────────────────────────────────────────────────────────── */}
      {/* DRAWER TOP BAR                                                    */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="p-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20">
            {activeDocMode === 'offer-letter' ? (
              <Briefcase size={20} />
            ) : activeDocMode === 'attendance' ? (
              <CalendarCheck size={20} />
            ) : (
              <Award size={20} />
            )}
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>
                {activeDocMode === 'offer-letter' 
                  ? 'Official Offer Letter Generator' 
                  : activeDocMode === 'attendance'
                  ? 'Attendance Certificate Generator'
                  : `Official ${certificateDocLabel} Studio`}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                Live Engine
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Official ATIDETO Document Studio with 1:1 ID Synchronization
            </p>
          </div>
        </div>

        {/* Mode Toggle Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveDocMode('certificate')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeDocMode === 'certificate'
                ? 'bg-white text-blue-600 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award size={13} />
            <span>{certificateShortLabel}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveDocMode('offer-letter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeDocMode === 'offer-letter'
                ? 'bg-white text-blue-600 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase size={13} />
            <span>Offer Letter</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveDocMode('attendance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeDocMode === 'attendance'
                ? 'bg-white text-blue-600 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarCheck size={13} />
            <span>Attendance Certificate</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition cursor-pointer"
          title="Close Generator"
        >
          <X size={18} />
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* WORKSPACE SPLIT: LEFT CONFIG FORM | RIGHT LIVE DOCUMENT PREVIEW  */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">

        {/* TOP CANDIDATE SELECTOR & QUICK ISSUE BAR (Exact Reference Styling) */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-wrap lg:flex-nowrap items-center justify-between gap-5">
          {/* Left: Candidate Selector */}
          <div className="w-full sm:w-80 shrink-0">
            <label className="block text-[11px] font-black text-slate-800 uppercase tracking-wider mb-2 leading-tight">
              SELECT ENROLLED CANDIDATE<br />TO GENERATE
            </label>
            <div className="relative">
              <select
                value={selectedStudentId}
                onChange={(e) => handleStudentSelect(e.target.value)}
                className="w-full appearance-none pl-3.5 pr-10 py-2.5 rounded-xl bg-white border border-blue-500 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition cursor-pointer shadow-xs"
              >
                <option value="ALL_COHORT" className="font-extrabold text-blue-700 bg-blue-50">
                  👥 All Candidates ({studentsList.length} Students) — Batch Cohort Mode
                </option>
                {studentsList.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} — {st.id} ({st.domain || 'Engineering'}) {st.certHold ? '[HELD]' : st.certGenerated ? '[ISSUED]' : ''}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none" />
            </div>
            {isBatchAllMode && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 font-bold flex items-center justify-between gap-2 shadow-2xs">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={13} className="text-blue-600 shrink-0" />
                  <span>Batch Cohort Mode: Changes apply to all {studentsList.length} students</span>
                </span>
                <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-md font-mono">
                  {studentsList.length} Active
                </span>
              </div>
            )}
          </div>

          {/* Right: Actions & Status matching reference image */}
          <div className="flex flex-wrap items-center gap-3.5 flex-1 justify-start lg:justify-end">
            {/* Orange Regenerate Button */}
            <button
              type="button"
              onClick={handleSaveAndIssue}
              className={`px-5 py-3 rounded-2xl text-white font-black text-xs transition flex items-center gap-2 shadow-sm cursor-pointer ${
                isBatchAllMode || syncDatesToAllStudents
                  ? 'bg-blue-600 hover:bg-blue-500'
                  : isAlreadyGenerated 
                  ? 'bg-[#d97706] hover:bg-[#b45309]' 
                  : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
              title={
                isBatchAllMode || syncDatesToAllStudents
                  ? `Update All ${studentsList.length} Candidates in Administration`
                  : isAlreadyGenerated 
                  ? 'Regenerate Document & Push Updates' 
                  : 'Generate & Send to Student Administration'
              }
            >
              {isBatchAllMode || syncDatesToAllStudents ? (
                <>
                  <Sparkles size={15} className="shrink-0" />
                  <span>Update All {studentsList.length} Candidates in Administration</span>
                </>
              ) : isAlreadyGenerated ? (
                <>
                  <RotateCcw size={15} className="shrink-0" />
                  <span>Regenerate & Update Administration</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} className="shrink-0" />
                  <span>Generate & Send to Student Administration</span>
                </>
              )}
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="w-11 h-11 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 flex items-center justify-center transition cursor-pointer shrink-0 shadow-xs"
              title="Print Official Document"
            >
              <Printer size={16} />
            </button>

            {/* Status Indicator */}
            {isAlreadyGenerated && (
              <div className="flex items-center gap-2 text-xs font-bold text-[#059669] shrink-0">
                <CheckCircle2 size={16} className="text-[#059669] shrink-0" />
                <span>Official credential generated and active in student portal. Only Admin can regenerate.</span>
              </div>
            )}

            {/* Admin Privilege: Hold / Release Certificate */}
            <button
              type="button"
              onClick={handleToggleHold}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border shadow-2xs ${
                selectedStudent?.certHold
                  ? 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
              title="Admin privilege: Toggle Certificate Hold for Student Portal & Verification"
            >
              {selectedStudent?.certHold ? (
                <>
                  <PlayCircle size={14} className="text-rose-600 shrink-0" />
                  <span>On Hold (Click to Release)</span>
                </>
              ) : (
                <>
                  <PauseCircle size={14} className="text-slate-500 shrink-0" />
                  <span>Hold Certificate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* STUDIO TABS: DETAILS | TYPOGRAPHY | PRESETS */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveStudioTab('details')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeStudioTab === 'details'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText size={13} />
            <span>Document Details & Content</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveStudioTab('typography')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeStudioTab === 'typography'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Type size={13} />
            <span>Typography & Styles</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveStudioTab('presets')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeStudioTab === 'presets'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Palette size={13} />
            <span>Theme Presets</span>
          </button>
        </div>

        {/* TAB 1: FORM INPUTS */}
        {activeStudioTab === 'details' && (
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
            
            {/* General Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Recipient Student Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Register No / Roll No</label>
                <input
                  type="text"
                  value={registerNo}
                  onChange={(e) => setRegisterNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">College / Institution</label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Internship Domain / Track</label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 font-semibold text-blue-700 focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* Dates & Duration with Workable Calendar Pickers and Multiple Student Update */}
            <div className="space-y-3 pt-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
                  <Calendar size={14} className="text-blue-600" />
                  <span>Internship Schedule, Dates & Tenure</span>
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleApplyDatesToAllStudents}
                    className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs transition cursor-pointer active:scale-95"
                    title="Apply current Start Date, End Date, Duration, and Issue Date to all enrolled candidates"
                  >
                    <Sparkles size={11} />
                    <span>⚡ Apply Dates to All ({studentsList.length}) Students</span>
                  </button>
                </div>
              </div>

              {/* Batch Auto-Sync Checkbox */}
              <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-700 cursor-pointer select-none bg-blue-50/70 hover:bg-blue-50 p-2.5 rounded-xl border border-blue-200/80 transition">
                <input
                  type="checkbox"
                  checked={syncDatesToAllStudents || isBatchAllMode}
                  onChange={(e) => setSyncDatesToAllStudents(e.target.checked)}
                  className="rounded accent-blue-600 cursor-pointer w-4 h-4"
                />
                <span className="flex-1">
                  <b>Multiple Student Update:</b> Automatically apply any date or duration change to all <b>{studentsList.length} enrolled candidates</b> in real-time
                </span>
                {(syncDatesToAllStudents || isBatchAllMode) && (
                  <span className="text-[10px] bg-blue-600 text-white font-mono px-2 py-0.5 rounded-full font-bold">
                    ACTIVE
                  </span>
                )}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Start Date */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Calendar size={13} className="text-blue-600" />
                      <span>Start Date</span>
                    </label>
                    <span className="text-[10px] text-blue-600 font-mono font-bold">Click to pick</span>
                  </div>
                  <div className="relative">
                    <input
                      ref={startDateRef}
                      type="date"
                      value={startDate}
                      onClick={(e) => {
                        try {
                          (e.currentTarget as any).showPicker?.();
                        } catch {
                          /* fallback to native focus */
                        }
                      }}
                      onChange={(e) => {
                        const newStart = e.target.value;
                        setStartDate(newStart);
                        let autoEnd = '';
                        if (newStart && duration) {
                          autoEnd = computeEndDateFromDuration(newStart, duration);
                          if (autoEnd) {
                            setEndDate(autoEnd);
                            const days = computeDaysBetweenDates(newStart, autoEnd);
                            setTotalDays(days);
                            const newPresent = Math.min(days, Math.round(days * 0.933));
                            setPresentDays(newPresent);
                            setAttendancePct(`${((newPresent / days) * 100).toFixed(1)}%`);
                          }
                        }
                        if (syncDatesToAllStudents || isBatchAllMode) {
                          bulkUpdateStudentsInRegistry(studentsList.map(s => s.id), {
                            startDate: newStart,
                            ...(autoEnd ? { endDate: autoEnd } : {})
                          });
                        }
                      }}
                      className="w-full pl-3 pr-9 py-2 rounded-lg bg-slate-50 border border-slate-300 font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 cursor-pointer shadow-xs text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (startDateRef.current) {
                          if (typeof startDateRef.current.showPicker === 'function') {
                            try { startDateRef.current.showPicker(); } catch { startDateRef.current.focus(); }
                          } else {
                            startDateRef.current.focus();
                          }
                        }
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-blue-600 rounded transition cursor-pointer"
                      title="Choose Start Date"
                    >
                      <Calendar size={15} />
                    </button>
                  </div>
                </div>

                {/* End Date */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Calendar size={13} className="text-emerald-600" />
                      <span>End Date</span>
                    </label>
                    <span className="text-[10px] text-emerald-600 font-semibold">Auto / Editable</span>
                  </div>
                  <div className="relative">
                    <input
                      ref={endDateRef}
                      type="date"
                      value={endDate}
                      onClick={(e) => {
                        try {
                          (e.currentTarget as any).showPicker?.();
                        } catch {
                          /* fallback to native focus */
                        }
                      }}
                      onChange={(e) => {
                        const newEnd = e.target.value;
                        setEndDate(newEnd);
                        let autoDur = '';
                        if (startDate && newEnd) {
                          autoDur = computeDurationFromDates(startDate, newEnd);
                          if (autoDur) setDuration(autoDur);
                          const days = computeDaysBetweenDates(startDate, newEnd);
                          setTotalDays(days);
                          const newPresent = Math.min(days, Math.round(days * 0.933));
                          setPresentDays(newPresent);
                          setAttendancePct(`${((newPresent / days) * 100).toFixed(1)}%`);
                        }
                        if (syncDatesToAllStudents || isBatchAllMode) {
                          bulkUpdateStudentsInRegistry(studentsList.map(s => s.id), {
                            endDate: newEnd,
                            ...(autoDur ? { duration: autoDur } : {})
                          });
                        }
                      }}
                      className="w-full pl-3 pr-9 py-2 rounded-lg bg-slate-50 border border-slate-300 font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 cursor-pointer shadow-xs text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (endDateRef.current) {
                          if (typeof endDateRef.current.showPicker === 'function') {
                            try { endDateRef.current.showPicker(); } catch { endDateRef.current.focus(); }
                          } else {
                            endDateRef.current.focus();
                          }
                        }
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-emerald-600 rounded transition cursor-pointer"
                      title="Choose End Date"
                    >
                      <Calendar size={15} />
                    </button>
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Clock size={13} className="text-amber-600" />
                      <span>Duration</span>
                    </label>
                    <span className="text-[10px] text-amber-600 font-semibold">Auto syncs</span>
                  </div>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => {
                      const newDur = e.target.value;
                      setDuration(newDur);
                      let autoEnd = '';
                      if (startDate && newDur) {
                        autoEnd = computeEndDateFromDuration(startDate, newDur);
                        if (autoEnd) {
                          setEndDate(autoEnd);
                          const days = computeDaysBetweenDates(startDate, autoEnd);
                          const workDays = Math.max(1, Math.round(days * (26 / 30)));
                          setTotalDays(workDays);
                          setPresentDays(workDays);
                          setAttendancePct('100%');
                        }
                      }
                      if (syncDatesToAllStudents || isBatchAllMode) {
                        bulkUpdateStudentsInRegistry(studentsList.map(s => s.id), {
                          duration: newDur,
                          ...(autoEnd ? { endDate: autoEnd } : {})
                        });
                      }
                    }}
                    placeholder="e.g. 30 Days"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 shadow-xs text-xs"
                  />
                </div>

                {/* Issue Date */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Calendar size={13} className="text-purple-600" />
                      <span>Issue Date</span>
                    </label>
                    <span className="text-[10px] text-purple-600 font-mono font-bold">Click to pick</span>
                  </div>
                  <div className="relative">
                    <input
                      ref={issueDateRef}
                      type="date"
                      value={issueDate}
                      onClick={(e) => {
                        try {
                          (e.currentTarget as any).showPicker?.();
                        } catch {
                          /* fallback to native focus */
                        }
                      }}
                      onChange={(e) => {
                        const newIssue = e.target.value;
                        setIssueDate(newIssue);
                        if (syncDatesToAllStudents || isBatchAllMode) {
                          bulkUpdateStudentsInRegistry(studentsList.map(s => s.id), {
                            issueDate: newIssue
                          });
                        }
                      }}
                      className="w-full pl-3 pr-9 py-2 rounded-lg bg-slate-50 border border-slate-300 font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 cursor-pointer shadow-xs text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (issueDateRef.current) {
                          if (typeof issueDateRef.current.showPicker === 'function') {
                            try { issueDateRef.current.showPicker(); } catch { issueDateRef.current.focus(); }
                          } else {
                            issueDateRef.current.focus();
                          }
                        }
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-purple-600 rounded transition cursor-pointer"
                      title="Choose Issue Date"
                    >
                      <Calendar size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Duration Auto-Chooser Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
                  <Clock size={12} className="text-slate-400" />
                  Auto Duration Presets:
                </span>
                {[
                  { label: '30 Days', dur: '30 Days', defaultEnd: '2026-10-14' },
                  { label: '15 Days', dur: '15 Days' },
                  { label: '1 Month', dur: '1 Month' },
                  { label: '2 Months', dur: '2 Months' },
                  { label: '3 Months', dur: '3 Months' },
                  { label: '6 Months', dur: '6 Months' }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setDuration(preset.dur);
                      let computedEnd = '';
                      if (preset.dur === '30 Days' && (!startDate || startDate === '2026-09-14' || startDate === '2026-09-04')) {
                        setStartDate('2026-09-14');
                        computedEnd = '2026-10-14';
                        setEndDate('2026-10-14');
                        setIssueDate('2026-10-14');
                        setTotalDays(26);
                        setPresentDays(26);
                        setAttendancePct('100%');
                      } else if (startDate) {
                        computedEnd = computeEndDateFromDuration(startDate, preset.dur);
                        if (computedEnd) {
                          setEndDate(computedEnd);
                          setIssueDate(computedEnd);
                          const days = computeDaysBetweenDates(startDate, computedEnd);
                          const workDays = Math.max(1, Math.round(days * (26 / 30)));
                          setTotalDays(workDays);
                          setPresentDays(workDays);
                          setAttendancePct('100%');
                        }
                      }
                      if (syncDatesToAllStudents || isBatchAllMode) {
                        bulkUpdateStudentsInRegistry(studentsList.map(s => s.id), {
                          duration: preset.dur,
                          startDate: startDate || '2026-09-14',
                          ...(computedEnd ? { endDate: computedEnd, issueDate: computedEnd } : {})
                        });
                        toast.success(`Applied ${preset.dur} schedule to all ${studentsList.length} students!`);
                      } else {
                        toast.info(`Auto-computed End Date: ${computedEnd || endDate} (${preset.dur})`);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer border ${
                      duration.toLowerCase() === preset.dur.toLowerCase()
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Attendance Certificate Specific Fields */}
            {activeDocMode === 'attendance' && (
              <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200/60 space-y-3">
                <div className="font-extrabold text-blue-900 text-xs flex items-center gap-1.5">
                  <CalendarCheck size={14} />
                  <span>Attendance Certificate Specific Parameters</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Academic Department</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600"
                      placeholder="e.g. Department of Computer Science and Engineering"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Total Working Days</label>
                    <input
                      type="number"
                      value={totalDays}
                      onChange={(e) => {
                        const tot = parseInt(e.target.value, 10) || 1;
                        setTotalDays(tot);
                        const pct = (presentDays / tot) * 100;
                        setAttendancePct(`${Number.isInteger(pct) ? pct : pct.toFixed(1)}%`);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 font-mono text-slate-900 focus:outline-none focus:border-blue-600"
                      placeholder="26"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Attended Working Days</label>
                    <input
                      type="number"
                      value={presentDays}
                      onChange={(e) => {
                        const pres = parseInt(e.target.value, 10) || 0;
                        setPresentDays(pres);
                        const pct = (pres / (totalDays || 1)) * 100;
                        setAttendancePct(`${Number.isInteger(pct) ? pct : pct.toFixed(1)}%`);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 font-mono text-slate-900 focus:outline-none focus:border-blue-600"
                      placeholder="26"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Attendance Percentage</label>
                    <input
                      type="text"
                      value={attendancePct}
                      onChange={(e) => setAttendancePct(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 font-mono font-bold text-emerald-700 focus:outline-none focus:border-blue-600"
                      placeholder="100%"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Offer Letter Specific Fields */}
            {activeDocMode === 'offer-letter' && (
              <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200/60 space-y-3">
                <div className="font-extrabold text-blue-900 text-xs flex items-center gap-1.5">
                  <Briefcase size={14} />
                  <span>Offer Letter Addressee & Dispatch Parameters</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Candidate Salutation</label>
                    <select
                      value={salutation}
                      onChange={(e) => setSalutation(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 font-bold text-slate-900"
                    >
                      <option value="Mr.">Mr.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Mrs.">Mrs.</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Candidate Email</label>
                    <input
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Candidate Phone</label>
                    <input
                      type="text"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 font-mono text-slate-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Identifiers & Registrations */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Completion Certificate ID</label>
                <input
                  type="text"
                  value={verifyId}
                  onChange={(e) => setVerifyId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 font-mono font-bold text-blue-700 focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Offer Letter No.</label>
                <input
                  type="text"
                  value={offerLetterNo}
                  onChange={(e) => setOfferLetterNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Attendance Certificate ID</label>
                <input
                  type="text"
                  value={attendanceCertId}
                  onChange={(e) => setAttendanceCertId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TYPOGRAPHY STUDIO */}
        {activeStudioTab === 'typography' && (
          activeDocMode === 'certificate' ? (
            /* DEDICATED INTERNSHIP CERTIFICATE SIZING & TYPOGRAPHY SUITE */
            <div className="space-y-4">
              {/* MASTER OVERALL SCALING CARD */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-slate-50 border-2 border-blue-400/40 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                      <SlidersHorizontal size={17} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-slate-900">Overall Certificate Scale</h4>
                        <span className="px-2.5 py-0.5 rounded-full font-mono font-bold bg-blue-600 text-white text-[11px] shadow-2xs">
                          {Math.round(overallScale * 100)}%
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-tight mt-0.5">
                        Proportionally scale all logos, title, student name, domain box, QR code & footer together
                      </p>
                    </div>
                  </div>

                  {/* Master Scale Quick Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDecreaseOverallScale}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                      title="Decrease overall certificate size by 5%"
                    >
                      <Minus size={13} className="text-red-600" />
                      <span>Decrease All (-5%)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleIncreaseOverallScale}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                      title="Increase overall certificate size by 5%"
                    >
                      <Plus size={13} className="text-white" />
                      <span>Increase All (+5%)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetSizing}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      title="Reset all sizes and scaling to official defaults"
                    >
                      <RotateCcw size={12} className="text-slate-500" />
                      <span>Reset to Default</span>
                    </button>
                  </div>
                </div>

                {/* Master Slider */}
                <div className="space-y-1 pt-1">
                  <input
                    type="range"
                    min="75"
                    max="130"
                    step="1"
                    value={Math.round(overallScale * 100)}
                    onChange={(e) => setOverallScale(Number(e.target.value) / 100)}
                    className="w-full accent-blue-600 h-2 bg-blue-200/70 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 px-0.5">
                    <span>75% (Compact)</span>
                    <span className={overallScale === 1.0 ? 'text-blue-600 font-extrabold' : ''}>100% (Default Official)</span>
                    <span>130% (Spacious)</span>
                  </div>
                </div>
              </div>

              {/* GRANULAR SIZING ACCORDION / GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* CARD 1: STUDENT NAME & HEADING */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 text-xs">
                  <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">Student Name & Typography</h4>
                      <p className="text-slate-500 text-[11px]">Font family, name color, and heading scale</p>
                    </div>
                    <Type size={16} className="text-blue-600" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Font Family</label>
                      <select
                        value={nameFont}
                        onChange={(e: any) => setNameFont(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 font-bold text-slate-900"
                      >
                        <option value="Cormorant Garamond">Cormorant Garamond (Official)</option>
                        <option value="Playfair Display">Playfair Display</option>
                        <option value="Great Vibes">Great Vibes (Calligraphy)</option>
                        <option value="Cinzel">Cinzel (Royal Serif)</option>
                        <option value="Inter">Inter (Modern Clean)</option>
                        <option value="Bodoni Moda">Bodoni Moda</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Name Text Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={nameColor}
                          onChange={(e) => setNameColor(e.target.value)}
                          className="w-10 h-9 p-0.5 rounded border border-slate-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={nameColor}
                          onChange={(e) => setNameColor(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-300 font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {renderSizeControl('Student Name Font Size', nameSize, setNameSize, 32, 72, 1, 'px', 'Primary recipient name typography size')}
                  {renderSizeControl('Certificate Title Size', certTitleSize, setCertTitleSize, 26, 56, 1, 'px', 'Internship Completion Certificate heading font size')}
                </div>

                {/* CARD 2: HEADER INSTITUTIONAL LOGOS */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 text-xs">
                  <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">Header Logos & Emblems</h4>
                      <p className="text-slate-500 text-[11px]">ATIDETO, MSME, Startup India & UDYAM registration</p>
                    </div>
                    <Award size={16} className="text-blue-600" />
                  </div>

                  {renderSizeControl(
                    'Header Logos Height',
                    logoHeight,
                    setLogoHeight,
                    45,
                    120,
                    1,
                    'px',
                    'Proportionally balances ATIDETO logo, MSME emblem, Startup India badge, and UDYAM registration font'
                  )}

                  <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-200/60 text-slate-600 text-[11px] leading-relaxed">
                    💡 <strong className="text-slate-800">Proportional Layout Note:</strong> Adjusting the logo height keeps the official MSME emblem, Ashoka seal, and Startup India badge aligned at the exact same horizontal baseline across PDF, image, and print.
                  </div>
                </div>

                {/* CARD 3: DOMAIN CAPSULE BOX & MARGIN */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 text-xs">
                  <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">Internship Domain Box</h4>
                      <p className="text-slate-500 text-[11px]">Pill typography size and vertical spacing from name</p>
                    </div>
                    <Layers size={16} className="text-blue-600" />
                  </div>

                  {renderSizeControl('Domain Pill Font Size', domainFontSize, setDomainFontSize, 10, 22, 1, 'px', 'Text size of "Internship Domain :" and selected domain')}
                  {renderSizeControl('Domain Box Top Gap from Name', domainMarginTop, setDomainMarginTop, 6, 45, 1, 'px', 'Vertical spacing between student name and domain capsule')}
                  {renderSizeControl('Domain Box Bottom Gap', domainMarginBottom, setDomainMarginBottom, 4, 30, 1, 'px', 'Vertical spacing between domain capsule and description text')}
                </div>

                {/* CARD 4: BODY PARAGRAPHS & DESCRIPTION */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 text-xs">
                  <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">Certificate Body Description</h4>
                      <p className="text-slate-500 text-[11px]">Official recognition statement text size & readability</p>
                    </div>
                    <FileText size={16} className="text-blue-600" />
                  </div>

                  {renderSizeControl(
                    'Body Description Text Size',
                    bodyFontSize,
                    setBodyFontSize,
                    11,
                    22,
                    0.5,
                    'px',
                    'Controls font size of both recognition paragraphs and date metadata'
                  )}

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
                    Lines automatically wrap and maintain optimal line height (1.75) for crisp rendering on high-DPI prints.
                  </div>
                </div>

                {/* CARD 5: VERIFICATION, QR & FOOTER STRIP */}
                <div className="md:col-span-2 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 text-xs">
                  <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">Credentials, Verification QR & Footer</h4>
                      <p className="text-slate-500 text-[11px]">Scan QR code size, metadata font, and support footer strip</p>
                    </div>
                    <CheckCircle2 size={16} className="text-blue-600" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {renderSizeControl('Verification QR Code Size', qrSize, setQrSize, 60, 130, 2, 'px', 'Center QR code width & height')}
                    {renderSizeControl('Metadata & Signatory Font Size', metaFontSize, setMetaFontSize, 10, 18, 0.5, 'px', 'Duration, Issue Date, Verify ID & Signature')}
                    {renderSizeControl('Footer Contact Info Font Size', footerFontSize, setFooterFontSize, 9, 16, 0.5, 'px', 'Email, phone, and website footer')}
                  </div>
                </div>

              </div>
            </div>
          ) : (
            /* DEFAULT TYPOGRAPHY FOR OTHER DOCUMENTS (OFFER LETTER / ATTENDANCE) */
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Student Name Font & Styling</h4>
                <p className="text-slate-500 text-[11px]">Select elegant fonts from Google Fonts for official document presentation</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Font Family</label>
                  <select
                    value={nameFont}
                    onChange={(e: any) => setNameFont(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 font-bold text-slate-900"
                  >
                    <option value="Cormorant Garamond">Cormorant Garamond (Official)</option>
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Great Vibes">Great Vibes (Calligraphy)</option>
                    <option value="Cinzel">Cinzel (Royal Serif)</option>
                    <option value="Inter">Inter (Modern Clean)</option>
                    <option value="Bodoni Moda">Bodoni Moda</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={nameColor}
                      onChange={(e) => setNameColor(e.target.value)}
                      className="w-10 h-9 p-0.5 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={nameColor}
                      onChange={(e) => setNameColor(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-slate-700">Font Size ({nameSize}px)</label>
                  </div>
                  <input
                    type="range"
                    min="28"
                    max="56"
                    value={nameSize}
                    onChange={(e) => setNameSize(parseInt(e.target.value, 10))}
                    className="w-full accent-blue-600 mt-2"
                  />
                </div>
              </div>
            </div>
          )
        )}

        {/* TAB 3: DESIGN PRESETS */}
        {activeStudioTab === 'presets' && (
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 text-xs">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">Official Theme Presets</h4>
              <p className="text-slate-500 text-[11px]">Instant design configurations for corporate and academic credentials</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'navy-gold', title: 'Royal Navy & Gold', font: 'Cormorant Garamond', col: '#12539c' },
                { id: 'executive', title: 'Executive Navy', font: 'Playfair Display', col: '#0b2545' },
                { id: 'modern-blue', title: 'Modern Azure', font: 'Inter', col: '#0066FF' },
                { id: 'classic-serif', title: 'Classic Gold', font: 'Cinzel', col: '#a8791f' }
              ].map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyThemePreset(p.id as any)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer space-y-1 ${
                    themePreset === p.id 
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-slate-900">{p.title}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{p.font}</p>
                  <div className="w-4 h-4 rounded-full mt-1 border" style={{ backgroundColor: p.col }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* LIVE DOCUMENT PREVIEW CANVAS (Image 2 Parity)                     */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div ref={previewWrapperRef} className="space-y-3">
          
          {/* Header Bar with Show Full View & Print Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span className="text-xs font-bold text-slate-900">
                {activeDocMode === 'certificate' 
                  ? `Official ${certificateDocLabel} Canvas`
                  : activeDocMode === 'attendance'
                  ? 'Official Attendance Certificate Canvas'
                  : 'Official Internship Offer Letter'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {activeDocMode === 'certificate' ? 'A4 Landscape (1414×1000)' : activeDocMode === 'attendance' ? 'A4 Portrait (850×1202)' : 'A4 Portrait (850×1277)'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Print Document"
              >
                <Printer size={13} className="text-blue-600" />
                <span>Print {activeDocMode === 'certificate' ? 'Certificate' : activeDocMode === 'attendance' ? 'Attendance Cert' : 'Offer Letter'}</span>
              </button>

              <button
                type="button"
                disabled={isExporting}
                onClick={handleDownloadPng}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
              >
                <Download size={13} className="text-blue-600" />
                <span>Download PNG</span>
              </button>

              <button
                type="button"
                disabled={isExporting}
                onClick={handleDownloadPdf}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Download size={13} />
                <span>Official PDF</span>
              </button>

              <button
                type="button"
                disabled={isBatchProcessing}
                onClick={handleOpenBatchZip}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                title="Select multiple students and download all documents as a ZIP archive"
              >
                {isBatchProcessing ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <FileArchive size={13} />
                )}
                <span>{isBatchProcessing ? 'Preparing ZIP...' : 'Batch ZIP'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowFullViewModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Open Big Popup of Full Screen Certificate"
              >
                <Maximize2 size={13} />
                <span>Show Full View</span>
              </button>
            </div>
          </div>

          {/* Actual Scaled Canvas Container */}
          <div className="w-full overflow-x-auto rounded-2xl border border-slate-800 shadow-2xl bg-slate-950 p-2 sm:p-4 flex items-center justify-center min-h-[350px]">
            <div
              style={{
                width: `${Math.round(baseWidth * effectiveScale)}px`,
                height: `${Math.round(baseHeight * effectiveScale)}px`,
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '12px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                transition: 'width 0.12s ease-out, height 0.12s ease-out'
              }}
              className="shrink-0 bg-white"
            >
              {activeDocMode === 'certificate' && (
                <AuthenticCertificateCanvas
                  variant={certVariant}
                  containerRef={certContainerRef}
                  data={{
                    name: studentName,
                    college: collegeName,
                    id: registerNo,
                    domain: domain,
                    startDate: startDate,
                    endDate: endDate,
                    duration: duration,
                    issueDate: issueDate,
                    certId: verifyId
                  }}
                  qrCodeUrl={qrCodeUrl}
                  scale={effectiveScale}
                  nameFont={nameFont}
                  nameColor={nameColor}
                  nameSize={nameSize}
                  signatoryTitle={signatoryTitle}
                  udyamId={udyamId}
                  overallScale={overallScale}
                  logoHeight={logoHeight}
                  certTitleSize={certTitleSize}
                  domainFontSize={domainFontSize}
                  domainMarginTop={domainMarginTop}
                  domainMarginBottom={domainMarginBottom}
                  bodyFontSize={bodyFontSize}
                  qrSize={qrSize}
                  metaFontSize={metaFontSize}
                  footerFontSize={footerFontSize}
                />
              )}

              {activeDocMode === 'offer-letter' && (
                <AuthenticOfferLetterCanvas
                  containerRef={offerContainerRef}
                  data={{
                    studentName,
                    collegeName,
                    studentEmail,
                    studentPhone,
                    domain,
                    duration,
                    startDate,
                    endDate,
                    offerLetterNo,
                    issueDate,
                    salutation,
                    mode: modeOfWork
                  }}
                  scale={effectiveScale}
                />
              )}

              {activeDocMode === 'attendance' && (
                <AuthenticAttendanceCertificateCanvas
                  containerRef={attendanceContainerRef}
                  data={{
                    studentName,
                    collegeName,
                    department,
                    registerNo,
                    domain,
                    duration,
                    startDate,
                    endDate,
                    totalDays,
                    totalWorkingDays: totalDays,
                    presentDays,
                    attendancePct,
                    certId: attendanceCertId,
                    issueDate
                  }}
                  scale={effectiveScale}
                />
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Full-Screen Document Modal Popup */}
      <FullScreenCertificateModal
        isOpen={showFullViewModal}
        onClose={() => setShowFullViewModal(false)}
        docType={activeDocMode}
        certVariant={certVariant}
        data={{
          name: studentName,
          college: collegeName,
          id: registerNo,
          domain: domain,
          startDate: startDate,
          endDate: endDate,
          duration: duration,
          issueDate: issueDate,
          certId: verifyId
        }}
        offerLetterData={{
          studentName,
          collegeName,
          studentEmail,
          studentPhone,
          domain,
          duration,
          startDate,
          endDate,
          offerLetterNo,
          issueDate,
          salutation,
          mode: modeOfWork
        }}
        attendanceData={{
          studentName,
          collegeName,
          department,
          registerNo,
          domain,
          duration,
          startDate,
          endDate,
          totalDays,
          totalWorkingDays: totalDays,
          presentDays,
          attendancePct,
          certId: attendanceCertId,
          issueDate
        }}
        qrCodeUrl={qrCodeUrl}
        nameFont={nameFont}
        nameColor={nameColor}
        nameSize={nameSize}
        signatoryTitle={signatoryTitle}
        udyamId={udyamId}
        overallScale={overallScale}
        logoHeight={logoHeight}
        certTitleSize={certTitleSize}
        domainFontSize={domainFontSize}
        domainMarginTop={domainMarginTop}
        domainMarginBottom={domainMarginBottom}
        bodyFontSize={bodyFontSize}
        qrSize={qrSize}
        metaFontSize={metaFontSize}
        footerFontSize={footerFontSize}
      />

      {/* Batch ZIP Selection Modal */}
      {showBatchZipModal && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
                  <FileArchive size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Batch ZIP Download</h3>
                  <p className="text-xs text-slate-500">
                    Select students to export{' '}
                    {activeDocMode === 'certificate'
                      ? 'completion certificates'
                      : activeDocMode === 'attendance'
                      ? 'attendance certificates'
                      : 'offer letters'}{' '}
                    as a single ZIP file.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBatchZipModal(false)}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-5 py-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBatchSelectedIds(studentsList.map((s) => s.id))}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => setBatchSelectedIds([])}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Clear
                </button>
                <span className="text-xs font-bold text-slate-600">
                  {batchSelectedIds.length}/{studentsList.length} selected
                </span>
              </div>
              <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setBatchFormat('pdf')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    batchFormat === 'pdf'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  PDF
                </button>
                <button
                  type="button"
                  onClick={() => setBatchFormat('png')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    batchFormat === 'png'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  PNG
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-2">
              {studentsList.length === 0 ? (
                <p className="p-6 text-center text-sm text-slate-500">No enrolled students found.</p>
              ) : (
                studentsList.map((st) => {
                  const checked = batchSelectedIds.includes(st.id);
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => toggleBatchStudent(st.id)}
                      className={`mb-1 flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition cursor-pointer ${
                        checked
                          ? 'border-emerald-300 bg-emerald-50'
                          : 'border-transparent hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                          checked
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : 'border-slate-300 bg-white text-transparent'
                        }`}
                      >
                        <Check size={13} strokeWidth={3} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-slate-900">
                          {st.name}
                        </span>
                        <span className="block truncate text-[11px] text-slate-500">
                          {st.id} · {st.domain || st.college}
                        </span>
                      </span>
                      {st.certHold && (
                        <span className="shrink-0 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                          HELD
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4">
              <button
                type="button"
                onClick={() => setShowBatchZipModal(false)}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={batchSelectedIds.length === 0}
                onClick={handleStartBatchZip}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileArchive size={14} />
                <span>Download ZIP ({batchSelectedIds.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Off-screen render host used only while building a batch ZIP */}
      {batchRenderItem && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            opacity: 0,
            pointerEvents: 'none',
            zIndex: 0
          }}
        >
          {batchRenderItem.mode === 'certificate' && (
            <AuthenticCertificateCanvas
              key={batchRenderItem.student.id}
              containerRef={batchCanvasRef}
              variant={certVariant}
              data={getBatchCertificateData(batchRenderItem)}
              qrCodeUrl={batchRenderItem.qrCodeUrl}
              scale={1}
              nameFont={nameFont}
              nameColor={nameColor}
              nameSize={nameSize}
              signatoryTitle={signatoryTitle}
              udyamId={udyamId}
              overallScale={overallScale}
              logoHeight={logoHeight}
              certTitleSize={certTitleSize}
              domainFontSize={domainFontSize}
              domainMarginTop={domainMarginTop}
              domainMarginBottom={domainMarginBottom}
              bodyFontSize={bodyFontSize}
              qrSize={qrSize}
              metaFontSize={metaFontSize}
              footerFontSize={footerFontSize}
            />
          )}
          {batchRenderItem.mode === 'offer-letter' && (
            <AuthenticOfferLetterCanvas
              key={batchRenderItem.student.id}
              containerRef={batchCanvasRef}
              data={getBatchOfferLetterData(batchRenderItem)}
              scale={1}
            />
          )}
          {batchRenderItem.mode === 'attendance' && (
            <AuthenticAttendanceCertificateCanvas
              key={batchRenderItem.student.id}
              containerRef={batchCanvasRef}
              data={getBatchAttendanceData(batchRenderItem)}
              scale={1}
            />
          )}
        </div>
      )}

    </div>
  );
};
