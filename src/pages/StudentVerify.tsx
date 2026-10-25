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
  if (!raw) return ['ATD', 'INT', '2026', '0001'];
  const cleaned = raw.trim();
  const parts = cleaned.split(/[-/\s]+/).filter(Boolean);
  if (parts.length >= 4) {
    if (parts.length === 5 && parts[0].toUpperCase() === 'AT' && parts[1].toUpperCase() === 'IC') {
      return ['AT-IC', parts[2].toUpperCase(), parts[3].toUpperCase(), parts[4].toUpperCase()];
    }
    return [parts[0].toUpperCase(), parts[1].toUpperCase(), parts[2].toUpperCase(), parts[3].toUpperCase()];
  }
  if (parts.length === 3) {
    return [parts[0].toUpperCase(), parts[1].toUpperCase(), '2026', parts[2].toUpperCase()];
  }
  if (parts.length === 2) {
    return [parts[0].toUpperCase(), 'INT', '2026', parts[1].toUpperCase()];
  }
  if (parts.length === 1) {
    return [parts[0].toUpperCase(), 'INT', '2026', '0001'];
  }
  return ['ATD', 'INT', '2026', '0001'];
}

export default function StudentVerify() {
  const [searchParams] = useSearchParams();
  const { id: pathId } = useParams<{ id?: string }>();

  const paramId = searchParams.get('id') || searchParams.get('certificateId') || pathId || '';
  const [verifyMode, setVerifyMode] = useState<'boxes' | 'scan'>('boxes');
  const [boxValues, setBoxValues] = useState<[string, string, string, string]>(() => {
    if (paramId) return splitIdInto4Boxes(paramId);
    return ['ATD', 'INT', '2026', '0001'];
  });

  const box0Ref = useRef<HTMLInputElement>(null);
  const box1Ref = useRef<HTMLInputElement>(null);
  const box2Ref = useRef<HTMLInputElement>(null);
  const box3Ref = useRef<HTMLInputElement>(null);
  const boxRefs = [box0Ref, box1Ref, box2Ref, box3Ref];

  // Camera scanner states
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

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

  // Auto-verify if ID provided in URL, OR fetch fresh data from MySQL on mount
  useEffect(() => {
    if (paramId) {
      performVerification(paramId);
    } else {
      // Fetch fresh student data from MySQL on mount (no ID = show all / search)
      const fetchInitialData = async () => {
        try {
          const result = await verifyCertificateFromDb('');
          // result may be null if no query, that's OK - just ensures API is contacted
        } catch (e: any) {
          console.warn('[StudentVerify] Initial API fetch failed, falling back to local:', e?.message || e);
        }
      };
      fetchInitialData();
    }
  }, []);

  const performVerification = (idToVerify: string) => {
    const cleanId = idToVerify.trim();
    if (!cleanId) return;

    setIsLoading(true);
    setHasSearched(true);
    setSearchedId(cleanId);
    setBoxValues(splitIdInto4Boxes(cleanId));

    setTimeout(() => {
      const match = findStudentOrCertificate(cleanId);
      setCertificateData(match);
      setIsLoading(false);

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
    }, 350);
  };

  const handleBoxChange = (index: number, val: string) => {
    const upper = val.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    
    // Advance on hyphen or delimiter
    if (val.includes('-') || val.includes(' ') || val.includes('/')) {
      const cleanPiece = upper.replace(/-/g, '');
      const next = [...boxValues] as [string, string, string, string];
      next[index] = cleanPiece;
      setBoxValues(next);
      if (index < 3) {
        boxRefs[index + 1].current?.focus();
      }
      return;
    }

    const next = [...boxValues] as [string, string, string, string];
    next[index] = upper;
    setBoxValues(next);

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

  // Camera Scanner Handlers
  const startCamera = async () => {
    setCameraError(null);
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError('Camera access was not permitted or is unavailable. You can upload an image of the QR code below.');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const handleScannedText = (scannedRaw: string) => {
    let extractedId = scannedRaw.trim();
    try {
      if (extractedId.includes('?')) {
        const urlObj = new URL(extractedId, window.location.origin);
        extractedId = urlObj.searchParams.get('id') || urlObj.searchParams.get('certificateId') || extractedId;
      }
    } catch {}

    const parts = splitIdInto4Boxes(extractedId);
    setBoxValues(parts);
    setSearchInput(extractedId);
    setVerifyMode('boxes');
    performVerification(extractedId);
  };

  // Barcode detection frame check
  useEffect(() => {
    if (!isScanning) return;
    let animId: number;
    let detector: any = null;
    if ('BarcodeDetector' in window) {
      try {
        detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
      } catch (e) {}
    }

    const checkFrame = async () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && detector) {
        try {
          const codes = await detector.detect(videoRef.current);
          if (codes && codes.length > 0 && codes[0].rawValue) {
            handleScannedText(codes[0].rawValue);
            stopCamera();
            return;
          }
        } catch (e) {}
      }
      animId = requestAnimationFrame(checkFrame);
    };

    animId = requestAnimationFrame(checkFrame);
    return () => cancelAnimationFrame(animId);
  }, [isScanning]);

  const handleQrImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.loading('Scanning uploaded QR code image...');
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });

      if ('BarcodeDetector' in window) {
        const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
        const codes = await detector.detect(img);
        if (codes && codes.length > 0 && codes[0].rawValue) {
          toast.dismiss();
          toast.success('QR Code detected from image!');
          handleScannedText(codes[0].rawValue);
          return;
        }
      }

      toast.dismiss();
      toast.info('QR scanned image received. Please verify ID format.');
    } catch (err) {
      toast.dismiss();
      toast.error('Unable to decode QR code from the uploaded image.');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      performVerification(searchInput.trim());
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

          {/* MODE SELECTOR BUTTONS */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setVerifyMode('boxes');
                stopCamera();
              }}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                verifyMode === 'boxes'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <KeyRound size={16} />
              <span>Enter 4-Part ID</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setVerifyMode('scan');
                startCamera();
              }}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                verifyMode === 'scan'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Camera size={16} />
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
                  onClick={() => {
                    setBoxValues(['', '', '', '']);
                    box0Ref.current?.focus();
                  }}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
                >
                  <RotateCcw size={14} />
                  <span>Clear</span>
                </button>
              </div>

              {/* Sample Instant Clickable Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-500">Sample Records:</span>
                {[
                  'ATD-INT-2026-0001',
                  'AT-IC-MER-2026-0001',
                  'AT-IC-WDV-2026-0002',
                  'ATD-INT-2026-0003'
                ].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => {
                      const parsed = splitIdInto4Boxes(sample);
                      setBoxValues(parsed);
                      performVerification(sample);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-blue-600 hover:text-white text-slate-300 font-mono transition border border-slate-700 cursor-pointer"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────── */}
          {/* OPTION 2: LIVE CAMERA SCAN / UPLOAD QR IMAGE                */}
          {/* ─────────────────────────────────────────────────────────── */}
          {verifyMode === 'scan' && (
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-6 rounded-3xl shadow-2xl max-w-xl mx-auto space-y-5 text-center animate-in fade-in duration-200">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                  Optical QR Scanner
                </span>
                <p className="text-xs text-slate-400">
                  Hold the certificate QR code in front of the camera or upload an image file
                </p>
              </div>

              {/* Live Camera Viewport */}
              <div className="relative w-full max-w-sm mx-auto aspect-square rounded-2xl overflow-hidden bg-black border-2 border-blue-500/50 shadow-inner flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* HUD Crosshairs */}
                <div className="absolute inset-8 pointer-events-none flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg" />
                    <div className="w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg" />
                  </div>
                  <div className="w-full h-0.5 bg-blue-400 shadow-[0_0_12px_#60a5fa] animate-pulse" />
                  <div className="flex justify-between">
                    <div className="w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg" />
                    <div className="w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg" />
                  </div>
                </div>

                {!isScanning && (
                  <div className="absolute inset-0 bg-slate-950/85 flex flex-col items-center justify-center p-4 space-y-3">
                    <Camera size={36} className="text-slate-500" />
                    <p className="text-xs text-slate-300 font-medium">Camera is paused</p>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md"
                    >
                      Start Camera
                    </button>
                  </div>
                )}
              </div>

              {cameraError && (
                <p className="text-xs text-amber-400 bg-amber-950/40 border border-amber-800/60 p-2.5 rounded-xl">
                  {cameraError}
                </p>
              )}

              {/* Upload QR Image or Stop Camera */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <label className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer border border-slate-700">
                  <Upload size={14} className="text-blue-400" />
                  <span>Upload QR Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQrImageUpload}
                    className="hidden"
                  />
                </label>

                {isScanning && (
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-2.5 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded-xl text-xs font-bold transition cursor-pointer border border-rose-700"
                  >
                    Stop Camera
                  </button>
                )}
              </div>
            </div>
          )}
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
