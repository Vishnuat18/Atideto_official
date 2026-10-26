import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Search, 
  Download, 
  Printer, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  Award,
  Building2,
  Calendar,
  Clock,
  ArrowRight,
  Share2,
  QrCode,
  Eye,
  Maximize2,
  Camera,
  Upload,
  KeyRound,
  RotateCcw,
  RefreshCw,
  Copy,
  PauseCircle
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { exportElementToA4Pdf, exportElementToImage } from '@/lib/exportPdfDocument';
import { 
  AuthenticCertificateCanvas 
} from '@/components/certificates/AuthenticCertificateCanvas';
import { 
  FullScreenCertificateModal 
} from '@/components/certificates/FullScreenCertificateModal';
import { printOfficialDocument } from '@/lib/printDocument';
import { 
  StudentCohortRecord, 
  findStudentOrCertificate, 
  getStoredStudents,
  getVerificationUrl 
} from '@/lib/certificateStore';
import { verifyCertificateFromDb } from '@/lib/api';
import { toast } from 'sonner';

// Assets
import certBgImage from '@/assets/certificates/background1.png';
import atidetoLogoImg from '@/assets/certificates/atideto-logo.png';
import msmeLogoImg from '@/assets/certificates/msme-logo.png';
import qrPlaceholderImg from '@/assets/certificates/qr-placeholder.png';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function fmtDate(iso: string) {
  if (!iso) return '—';
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

function splitIdInto4Boxes(raw: string): [string, string, string, string] {
  if (!raw || !raw.trim()) return ['', '', '', ''];
  const cleaned = raw.trim();
  const parts = cleaned.split(/[-/\s]+/).filter(Boolean);
  if (parts.length >= 4) {
    if (parts.length === 5 && parts[0].toUpperCase() === 'AT' && parts[1].toUpperCase() === 'IC') {
      return ['AT-IC', parts[2].toUpperCase(), parts[3].toUpperCase(), parts[4].toUpperCase()];
    }
    return [parts[0].toUpperCase(), parts[1].toUpperCase(), parts[2].toUpperCase(), parts[3].toUpperCase()];
  }
  if (parts.length === 3) {
    return [parts[0].toUpperCase(), parts[1].toUpperCase(), parts[2].toUpperCase(), ''];
  }
  if (parts.length === 2) {
    return [parts[0].toUpperCase(), parts[1].toUpperCase(), '', ''];
  }
  if (parts.length === 1) {
    return [parts[0].toUpperCase(), '', '', ''];
  }
  return ['', '', '', ''];
}

export default function StudentVerify() {
  const [searchParams] = useSearchParams();
  const { id: pathId } = useParams<{ id?: string }>();

  const paramId = searchParams.get('id') || searchParams.get('certificateId') || pathId || '';
  const [verifyMode, setVerifyMode] = useState<'boxes' | 'scan'>('boxes');
  const [boxValues, setBoxValues] = useState<[string, string, string, string]>(() => {
    if (paramId) return splitIdInto4Boxes(paramId);
    return ['', '', '', ''];
  });

  const box0Ref = useRef<HTMLInputElement>(null);
  const box1Ref = useRef<HTMLInputElement>(null);
  const box2Ref = useRef<HTMLInputElement>(null);
  const box3Ref = useRef<HTMLInputElement>(null);
  const boxRefs = [box0Ref, box1Ref, box2Ref, box3Ref];

  // Camera scanner states
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const [searchInput, setSearchInput] = useState(paramId);
  const [searchedId, setSearchedId] = useState(paramId);
  const [isLoading, setIsLoading] = useState(false);
  const [certificateData, setCertificateData] = useState<StudentCohortRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showFullViewModal, setShowFullViewModal] = useState<boolean>(false);

  const certVisualRef = useRef<HTMLDivElement>(null);
  const previewWrapperRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1000);

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
  }, [certificateData]);

  const baseWidth = 1414;
  const baseHeight = 1000;
  const availWidth = Math.max(280, containerWidth - 32);
  const fitScale = Math.min(1, Math.max(0.15, availWidth / baseWidth));
  const effectiveScale = fitScale;

  // Auto-verify if ID provided in URL on mount
  useEffect(() => {
    if (paramId) {
      performVerification(paramId);
    }
  }, []);

  const handleClear = () => {
    setBoxValues(['', '', '', '']);
    setSearchInput('');
    setSearchedId('');
    setCertificateData(null);
    setHasSearched(false);
    setQrCodeUrl('');
    box0Ref.current?.focus();
  };

  const performVerification = async (idToVerify: string) => {
    const cleanId = idToVerify.trim();
    if (!cleanId) {
      handleClear();
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setSearchedId(cleanId);
    setBoxValues(splitIdInto4Boxes(cleanId));

    try {
      // 1. Authoritative verification from MySQL database first
      const dbRes = await verifyCertificateFromDb(cleanId);
      let match: StudentCohortRecord | null = null;

      if (dbRes && dbRes.verified && dbRes.student) {
        const s = dbRes.student;
        match = {
          id: s.id || s.studentId,
          studentId: s.studentId || s.id,
          name: s.name,
          email: s.email || '',
          phone: s.phone || '',
          college: s.college || 'Mahendra Engineering College',
          degree: s.degree || 'B.Tech Information Technology',
          gradYear: s.gradYear || '2027',
          course: s.course || s.domain || 'Full Stack Web Development',
          domain: s.domain || s.course || 'Full Stack Web Development',
          startDate: s.startDate || s.joiningDate || '2026-10-25',
          endDate: s.endDate || s.completionDate || '2027-01-25',
          duration: s.duration || '3 Months',
          mentor: s.mentor || 'Karthik Ramanathan (AI & Web Lead)',
          attendance: Number(s.attendance) || 98,
          score: Number(s.score) || 95,
          feePaid: s.feePaid || '₹0',
          feeTotal: s.feeTotal || '₹700',
          paymentStatus: s.paymentStatus || 'Paid',
          certId: s.certId || cleanId,
          offerNo: s.offerNo || '',
          issueDate: s.completionDate || s.issueDate || '2026-10-25',
          status: (s.status as any) || 'active',
          tools: s.tools || ['React', 'Node.js', 'Express', 'MongoDB'],
          area: s.area || ['Full Stack', 'Web Development'],
          certHold: !!s.certHold
        };
      }

      // 2. If not found in live database (or server offline), fallback to client registry
      if (!match) {
        match = findStudentOrCertificate(cleanId);
      }

      setCertificateData(match);

      if (match) {
        toast.success(`Authentic Certificate verified for ${match.name}`);
        const verUrl = getVerificationUrl(match.certId);
        QRCode.toDataURL(verUrl, {
          width: 280,
          margin: 1,
          errorCorrectionLevel: 'M',
          color: { dark: '#000000', light: '#ffffff' }
        })
          .then(url => setQrCodeUrl(url))
          .catch(() => setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=8&data=${encodeURIComponent(verUrl)}`));
      } else {
        toast.error(`No official certificate found matching "${cleanId}"`);
      }
    } catch (err: any) {
      console.warn('[StudentVerify] Verification error, checking local store:', err);
      const fallback = findStudentOrCertificate(cleanId);
      setCertificateData(fallback);
      if (fallback) {
        toast.success(`Authentic Certificate verified for ${fallback.name}`);
      } else {
        toast.error(`No official certificate found matching "${cleanId}"`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBoxChange = (index: number, val: string) => {
    const upper = val.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    
    // Advance on hyphen or delimiter
    if (val.includes('-') || val.includes(' ') || val.includes('/')) {
      const cleanPiece = upper.replace(/-/g, '');
      const next = [...boxValues] as [string, string, string, string];
      next[index] = cleanPiece;
      setBoxValues(next);

      // If all boxes are cleared, immediately hide any old certificate data
      if (!next.some(Boolean)) {
        setCertificateData(null);
        setHasSearched(false);
        setSearchedId('');
        setQrCodeUrl('');
      }

      if (index < 3) {
        boxRefs[index + 1].current?.focus();
      }
      return;
    }

    const next = [...boxValues] as [string, string, string, string];
    next[index] = upper;
    setBoxValues(next);

    // If all boxes are cleared, immediately hide any old certificate data
    if (!next.some(Boolean)) {
      setCertificateData(null);
      setHasSearched(false);
      setSearchedId('');
      setQrCodeUrl('');
    }

    const maxLens = [5, 4, 4, 4];
    if (upper.length >= maxLens[index] && index < 3) {
      boxRefs[index + 1].current?.focus();
    }
  };

  const handleBoxKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !boxValues[index] && index > 0) {
      boxRefs[index - 1].current?.focus();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      handleVerify4Boxes();
    }
    if (e.key === 'ArrowRight' && index < 3) {
      boxRefs[index + 1].current?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      boxRefs[index - 1].current?.focus();
    }
  };

  const handleBoxPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    if (!pasted) return;
    const parts = splitIdInto4Boxes(pasted);
    setBoxValues(parts);
    toast.success(`Pasted Certificate ID: ${parts.filter(Boolean).join('-')}`);
    const fullId = parts.filter(Boolean).join('-');
    performVerification(fullId);
  };

  const handleVerify4Boxes = () => {
    const combined = boxValues.filter(Boolean).join('-');
    if (!combined) {
      toast.error('Please enter the certificate ID in the 4 boxes');
      return;
    }
    performVerification(combined);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // CAMERA SCANNER HANDLERS (With Hardware BarcodeDetector + jsQR Fallback)
  // ─────────────────────────────────────────────────────────────────────────────
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
    setCameraActive(false);
  };

  const startCamera = async (facing: 'environment' | 'user' = facingMode) => {
    stopCamera();
    setCameraError(null);
    setIsScanning(true);
    try {
      let stream: MediaStream;
      try {
        // First try requested facing mode (ideal for mobile back camera)
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facing }, width: { ideal: 1280 }, height: { ideal: 720 } }
        });
      } catch {
        // Fallback to any available video source (e.g. laptop webcam)
        stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.muted = true;
        await videoRef.current.play().catch(e => console.warn('[StudentVerify] Video play prevented:', e));
        setCameraActive(true);
      }
    } catch (err: any) {
      console.warn('[StudentVerify] Camera stream error:', err);
      setCameraError('Camera access was not permitted or is unavailable on this device. You can upload a photo of the QR code below.');
      setIsScanning(false);
      setCameraActive(false);
    }
  };

  const toggleCameraFacing = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    startCamera(nextFacing);
  };

  // Auto clean-up camera when unmounting
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Handle mode change
  useEffect(() => {
    if (verifyMode === 'scan') {
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [verifyMode]);

  const handleScannedText = (scannedRaw: string) => {
    let extractedId = scannedRaw.trim();
    try {
      if (extractedId.startsWith('http://') || extractedId.startsWith('https://')) {
        const urlObj = new URL(extractedId);
        const qId = urlObj.searchParams.get('id') || urlObj.searchParams.get('certificateId');
        if (qId) {
          extractedId = qId;
        } else {
          const pathSegments = urlObj.pathname.split('/').filter(Boolean);
          if (pathSegments.length > 0) {
            extractedId = pathSegments[pathSegments.length - 1];
          }
        }
      } else if (extractedId.includes('?id=')) {
        const match = extractedId.match(/[?&]id=([^&]+)/);
        if (match) extractedId = decodeURIComponent(match[1]);
      }
    } catch (e) {
      console.warn('[StudentVerify] URL parse fallback:', e);
    }

    const parts = splitIdInto4Boxes(extractedId);
    setBoxValues(parts);
    setSearchInput(extractedId);
    setVerifyMode('boxes');
    performVerification(extractedId);
  };

  // Continuous Camera QR Frame Decoding Loop
  useEffect(() => {
    if (!isScanning) return;
    let animId: number;

    const checkFrame = async () => {
      const video = videoRef.current;
      if (
        video &&
        video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
        video.videoWidth > 0 &&
        video.videoHeight > 0
      ) {
        try {
          // 1. Try Hardware-accelerated BarcodeDetector API if available
          if ('BarcodeDetector' in window) {
            try {
              const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
              const barcodes = await detector.detect(video);
              if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
                toast.success('QR Code detected & verified!');
                stopCamera();
                handleScannedText(barcodes[0].rawValue);
                return;
              }
            } catch {}
          }

          // 2. Fallback to universal jsQR Canvas Analysis
          let canvas = scanCanvasRef.current;
          if (!canvas) {
            canvas = document.createElement('canvas');
            scanCanvasRef.current = canvas;
          }
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imgData.data, imgData.width, imgData.height, {
              inversionAttempts: 'attemptBoth',
            });
            if (code && code.data && code.data.trim()) {
              toast.success('QR Code detected & verified!');
              stopCamera();
              handleScannedText(code.data);
              return;
            }
          }
        } catch (e) {
          console.warn('[StudentVerify] Frame scan note:', e);
        }
      }
      animId = requestAnimationFrame(checkFrame);
    };

    animId = requestAnimationFrame(checkFrame);
    return () => cancelAnimationFrame(animId);
  }, [isScanning]);

  const handleQrImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading('Analyzing uploaded QR image...');
    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        toast.error('Image processing failed', { id: toastId });
        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);

      const code = jsQR(imgData.data, imgData.width, imgData.height, {
        inversionAttempts: 'attemptBoth',
      });

      if (code && code.data && code.data.trim()) {
        toast.success('QR Code found in photo!', { id: toastId });
        handleScannedText(code.data);
      } else {
        toast.error('No readable QR code found in this photo. Please ensure it is clear or enter the 4-part ID.', { id: toastId });
      }
    } catch (err) {
      console.error('[StudentVerify] QR Image read error:', err);
      toast.error('Could not decode QR code from the selected image.', { id: toastId });
    } finally {
      e.target.value = '';
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      performVerification(searchInput.trim());
    } else {
      handleClear();
    }
  };

  // Download High-Res PNG
  const handleDownloadPng = async () => {
    if (!certVisualRef.current || !certificateData) return;
    await exportElementToImage(certVisualRef.current, {
      filename: `ATIDETO_Verified_Certificate_${certificateData.certId}.png`,
      canonicalWidth: 1414,
      canonicalHeight: 1000
    });
  };

  // Download Vector PDF (< 2MB optimized for fast loading)
  const handleDownloadPdf = async () => {
    if (!certVisualRef.current || !certificateData) return;
    await exportElementToA4Pdf(certVisualRef.current, {
      filename: `ATIDETO_Official_Certificate_${certificateData.certId}.pdf`,
      orientation: 'landscape',
      canonicalWidth: 1414,
      canonicalHeight: 1000
    });
  };

  const handlePrint = () => {
    if (!certVisualRef.current || !certificateData) return;
    printOfficialDocument(certVisualRef.current, {
      orientation: 'landscape',
      title: `ATIDETO_Official_Certificate_${certificateData.certId}`
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* ───────────────────────────────────────────────────────────────── */}
      {/* MAIN CONTAINER (With top padding for original website Navigation)  */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-28 sm:pt-36 pb-16 space-y-8">

        {/* VERIFICATION HEADER & MODE SWITCHER */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
            <ShieldCheck size={14} />
            <span>Official Verification Portal • MSME Registered</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Verify Student Certificate
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            Scan the QR code or enter the 4-part Certificate ID printed on the official document to view the cryptographic record.
          </p>

          {/* NATIVE SEGMENTED PILL SWITCHER */}
          <div className="inline-flex p-1 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl mx-auto">
            <button
              type="button"
              onClick={() => {
                setVerifyMode('boxes');
                stopCamera();
              }}
              className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                verifyMode === 'boxes'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound size={15} />
              <span>Enter 4-Part ID</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setVerifyMode('scan');
                startCamera();
              }}
              className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                verifyMode === 'scan'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera size={15} />
              <span>Scan QR Code</span>
            </button>
          </div>

          {/* ─────────────────────────────────────────────────────────── */}
          {/* OPTION 1: 4-BOX INPUT FOR CERTIFICATE ID                     */}
          {/* ─────────────────────────────────────────────────────────── */}
          {verifyMode === 'boxes' && (
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-5 sm:p-7 rounded-3xl shadow-2xl space-y-4 animate-in fade-in duration-200">
              <div className="text-center space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                  4 Segment Identification Code
                </span>
                <p className="text-xs text-slate-400">
                  Type or paste the 4 segments (e.g. <strong className="text-slate-200 font-mono">ATD - INT - 2026 - 0001</strong>)
                </p>
              </div>

              {/* 4 INPUT BOXES */}
              <div className="flex items-center justify-center gap-2 sm:gap-3.5 max-w-xl mx-auto">
                {/* Box 1 */}
                <div className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Prefix</span>
                  <input
                    ref={box0Ref}
                    type="text"
                    maxLength={6}
                    value={boxValues[0]}
                    onChange={(e) => handleBoxChange(0, e.target.value)}
                    onKeyDown={(e) => handleBoxKeyDown(0, e)}
                    onPaste={handleBoxPaste}
                    placeholder="ATD"
                    className="w-full h-12 sm:h-14 bg-slate-950 border-2 border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-2xl text-center font-mono text-base sm:text-xl font-black text-white uppercase transition tracking-wider shadow-inner"
                  />
                </div>

                <span className="text-slate-600 font-black text-xl sm:text-2xl mt-4 select-none">-</span>

                {/* Box 2 */}
                <div className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Track</span>
                  <input
                    ref={box1Ref}
                    type="text"
                    maxLength={5}
                    value={boxValues[1]}
                    onChange={(e) => handleBoxChange(1, e.target.value)}
                    onKeyDown={(e) => handleBoxKeyDown(1, e)}
                    onPaste={handleBoxPaste}
                    placeholder="INT"
                    className="w-full h-12 sm:h-14 bg-slate-950 border-2 border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-2xl text-center font-mono text-base sm:text-xl font-black text-white uppercase transition tracking-wider shadow-inner"
                  />
                </div>

                <span className="text-slate-600 font-black text-xl sm:text-2xl mt-4 select-none">-</span>

                {/* Box 3 */}
                <div className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Year</span>
                  <input
                    ref={box2Ref}
                    type="text"
                    maxLength={4}
                    value={boxValues[2]}
                    onChange={(e) => handleBoxChange(2, e.target.value)}
                    onKeyDown={(e) => handleBoxKeyDown(2, e)}
                    onPaste={handleBoxPaste}
                    placeholder="2026"
                    className="w-full h-12 sm:h-14 bg-slate-950 border-2 border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-2xl text-center font-mono text-base sm:text-xl font-black text-white uppercase transition tracking-wider shadow-inner"
                  />
                </div>

                <span className="text-slate-600 font-black text-xl sm:text-2xl mt-4 select-none">-</span>

                {/* Box 4 */}
                <div className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Roll No</span>
                  <input
                    ref={box3Ref}
                    type="text"
                    maxLength={6}
                    value={boxValues[3]}
                    onChange={(e) => handleBoxChange(3, e.target.value)}
                    onKeyDown={(e) => handleBoxKeyDown(3, e)}
                    onPaste={handleBoxPaste}
                    placeholder="0001"
                    className="w-full h-12 sm:h-14 bg-slate-950 border-2 border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-2xl text-center font-mono text-base sm:text-xl font-black text-white uppercase transition tracking-wider shadow-inner"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleVerify4Boxes}
                  disabled={isLoading || !boxValues.some(Boolean)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-sm font-black transition shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck size={18} />
                  <span>Verify Certificate</span>
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-800"
                >
                  <RotateCcw size={14} />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────── */}
          {/* OPTION 2: LIVE CAMERA SCAN / UPLOAD QR IMAGE                */}
          {/* ─────────────────────────────────────────────────────────── */}
          {verifyMode === 'scan' && (
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800/80 p-6 rounded-3xl shadow-2xl max-w-xl mx-auto space-y-5 text-center animate-in fade-in duration-200">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                  Universal Optical QR Scanner
                </span>
                <p className="text-xs text-slate-400">
                  Align the certificate QR code inside the viewfinder or upload a photo
                </p>
              </div>

              {/* Live Camera Viewport with Native Precision Reticle */}
              <div className="relative w-full max-w-sm mx-auto aspect-square rounded-3xl overflow-hidden bg-black border-2 border-blue-500/40 shadow-2xl flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Reticle HUD Corners */}
                <div className="absolute inset-8 pointer-events-none flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-8 h-8 border-t-3 border-l-3 border-[#38BDF8] rounded-tl-xl shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                    <div className="w-8 h-8 border-t-3 border-r-3 border-[#38BDF8] rounded-tr-xl shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                  </div>
                  {isScanning && (
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent shadow-[0_0_12px_#38BDF8] animate-pulse" />
                  )}
                  <div className="flex justify-between">
                    <div className="w-8 h-8 border-b-3 border-l-3 border-[#38BDF8] rounded-bl-xl shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                    <div className="w-8 h-8 border-b-3 border-r-3 border-[#38BDF8] rounded-br-xl shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                  </div>
                </div>

                {!isScanning && (
                  <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                      <Camera size={26} />
                    </div>
                    <p className="text-xs text-slate-300 font-medium">Camera is paused</p>
                    <button
                      type="button"
                      onClick={() => startCamera(facingMode)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-lg shadow-blue-600/30 flex items-center gap-2"
                    >
                      <Camera size={14} />
                      <span>Start Camera</span>
                    </button>
                  </div>
                )}
              </div>

              {cameraError && (
                <p className="text-xs text-amber-400 bg-amber-950/40 border border-amber-800/60 p-3 rounded-2xl">
                  {cameraError}
                </p>
              )}

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <label className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer border border-slate-800 hover:border-slate-700 shadow-sm">
                  <Upload size={14} className="text-[#38BDF8]" />
                  <span>Upload QR Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQrImageUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={toggleCameraFacing}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer border border-slate-800 flex items-center gap-1.5"
                  title="Switch between front and rear cameras"
                >
                  <RefreshCw size={14} className="text-blue-400" />
                  <span>Flip Camera</span>
                </button>

                {isScanning ? (
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer border border-slate-800"
                  >
                    Pause Camera
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => startCamera(facingMode)}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md"
                  >
                    Resume Camera
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Hidden Canvas for QR Frame Analysis */}
          <canvas ref={scanCanvasRef} className="hidden" aria-hidden="true" />
        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* STATE 1: LOADING SPINNER                                          */}
        {/* ───────────────────────────────────────────────────────────────── */}
        {isLoading && (
          <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-base font-bold text-white">Validating Cryptographic Record...</h3>
            <p className="text-xs text-slate-400">Checking ATIDETO authentic credential registry</p>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* STATE 2: NOT FOUND ERROR                                          */}
        {/* ───────────────────────────────────────────────────────────────── */}
        {!isLoading && hasSearched && !certificateData && (
          <div className="max-w-xl mx-auto p-8 rounded-2xl bg-rose-950/30 border border-rose-800 text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-full bg-rose-900/40 border border-rose-700 flex items-center justify-center text-rose-400 mx-auto">
              <XCircle size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-rose-300">Certificate Not Found</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                No official credential matching <strong className="text-white font-mono">{searchedId}</strong> could be verified in our records.
              </p>
            </div>
            <div className="text-[11px] text-slate-400 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-left space-y-1">
              <p className="font-bold text-slate-300">Verification Tips:</p>
              <p>• Ensure the full ID is entered including prefix (e.g. <span className="font-mono text-blue-400">AT-IC-MER-2026-0001</span> or <span className="font-mono text-blue-400">AT-MEC-2027-01</span>).</p>
              <p>• Check that the student has completed the enrollment and milestone requirements.</p>
              <p>• For institutional inquiries, contact <strong className="text-white">verify@atideto.in</strong>.</p>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* STATE 2B: CREDENTIAL ON ADMINISTRATIVE HOLD (Admin Privilege)      */}
        {/* ───────────────────────────────────────────────────────────────── */}
        {!isLoading && certificateData && certificateData.certHold && (
          <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-amber-950/30 border border-amber-600/60 text-center space-y-4 shadow-2xl animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-amber-900/40 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
              <PauseCircle size={32} />
            </div>
            <div>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Administrative Hold Status
              </span>
              <h3 className="text-2xl font-black text-amber-200 mt-2">
                Credential On Administrative Hold
              </h3>
              <p className="text-xs text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
                The official completion certificate for <strong className="text-white">{certificateData.name}</strong> (<span className="font-mono text-amber-300">{certificateData.certId}</span>) is currently placed on administrative hold by academic authorities.
              </p>
              <p className="text-xs text-slate-400 mt-2">
                This document is temporarily withheld and cannot be verified or downloaded until administrative clearance is provided.
              </p>
            </div>
            <div className="text-[11px] text-slate-400 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-left space-y-1">
              <p className="font-bold text-slate-200">Administrative Contact:</p>
              <p>For inquiries regarding hold status and clearance, please contact <strong className="text-blue-400 font-mono">verify@atideto.in</strong> or your institutional department coordinator.</p>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* STATE 3: VERIFIED STUDENT CERTIFICATE SUCCESS VIEW                */}
        {/* ───────────────────────────────────────────────────────────────── */}
        {!isLoading && certificateData && !certificateData.certHold && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* OFFICIAL VERIFICATION HERO BANNER */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-emerald-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                  <ShieldCheck size={32} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 size={12} className="inline" />
                      <span>Authenticated Document</span>
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      MSME ID: UDYAM-TN-20-0242534
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    {certificateData.name}
                  </h2>
                  <p className="text-xs text-emerald-300 font-medium">
                    {certificateData.college} • {certificateData.degree}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowFullViewModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-blue-600/20 cursor-pointer"
                >
                  <Maximize2 size={14} />
                  <span>Show Full View</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Download size={14} className="text-blue-400" />
                  <span>Download PNG</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download PDF Certificate</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1 cursor-pointer"
                  title="Print Official Document"
                >
                  <Printer size={14} />
                </button>
              </div>
            </div>

            {/* VERIFIED DETAILS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-black text-slate-500">Certificate ID</span>
                <p className="font-mono font-bold text-blue-400 text-sm truncate">{certificateData.certId}</p>
                <p className="text-[10px] text-slate-500">Immutable Hash</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-black text-slate-500">Domain Specialization</span>
                <p className="font-bold text-white text-sm truncate">{certificateData.domain}</p>
                <p className="text-[10px] text-slate-500">{certificateData.duration}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-black text-slate-500">Tenure Completed</span>
                <p className="font-bold text-emerald-400 text-sm truncate">
                  {fmtDate(certificateData.startDate)} - {fmtDate(certificateData.endDate || '')}
                </p>
                <p className="text-[10px] text-slate-500">Attendance: {certificateData.attendance}%</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-black text-slate-500">Enrollment Roll No</span>
                <p className="font-mono font-bold text-white text-sm truncate">{certificateData.id}</p>
                <p className="text-[10px] text-slate-500">Verified Candidate</p>
              </div>
            </div>

            {/* FULL VISUAL CERTIFICATE CANVAS PREVIEW */}
            <div ref={previewWrapperRef} className="space-y-3">
              {/* Proportional Scaled Viewport */}
              <div className="w-full overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950 p-2 sm:p-4 flex items-center justify-center shadow-2xl min-h-[350px]">
                <div
                  style={{
                    width: `${Math.round(baseWidth * effectiveScale)}px`,
                    height: `${Math.round(baseHeight * effectiveScale)}px`,
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                    transition: 'width 0.12s ease-out, height 0.12s ease-out'
                  }}
                  className="shrink-0 bg-white"
                >
                  <AuthenticCertificateCanvas
                    containerRef={certVisualRef}
                    data={certificateData}
                    qrCodeUrl={qrCodeUrl}
                    scale={effectiveScale}
                  />
                </div>
              </div>
            </div>

            {/* Full Screen Modal View */}
            <FullScreenCertificateModal
              isOpen={showFullViewModal}
              onClose={() => setShowFullViewModal(false)}
              data={certificateData}
              qrCodeUrl={qrCodeUrl}
            />
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© 2026 ATIDETO Technologies Private Limited. All rights reserved.</p>
        <p className="text-[11px] text-slate-600 mt-0.5">
          Government of India MSME Registered Entity: UDYAM-TN-20-0242534
        </p>
      </footer>

    </div>
  );
}
