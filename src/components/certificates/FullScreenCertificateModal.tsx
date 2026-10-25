import React, { useEffect, useRef, useState } from 'react';
import { X, Printer, Download, Award, Briefcase, CheckSquare, CalendarCheck } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';
import { 
  AuthenticCertificateCanvas, 
  AuthenticCertificateData 
} from './AuthenticCertificateCanvas';
import { 
  AuthenticOfferLetterCanvas, 
  AuthenticOfferLetterData 
} from './AuthenticOfferLetterCanvas';
import { 
  AuthenticAttendanceCertificateCanvas, 
  AuthenticAttendanceData 
} from './AuthenticAttendanceCertificateCanvas';
import { printOfficialDocument } from '@/lib/printDocument';
import { exportElementToA4Pdf, exportElementToImage } from '@/lib/exportPdfDocument';

export interface FullScreenCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  docType?: 'certificate' | 'offer-letter' | 'attendance';
  data?: any; // Generic or AuthenticCertificateData
  offerLetterData?: AuthenticOfferLetterData;
  attendanceData?: AuthenticAttendanceData;
  qrCodeUrl?: string;
  nameFont?: string;
  nameColor?: string;
  nameSize?: number;
  signatoryTitle?: string;
  udyamId?: string;
  gstin?: string;
  overallScale?: number;
  logoHeight?: number;
  certTitleSize?: number;
  domainFontSize?: number;
  domainMarginTop?: number;
  domainMarginBottom?: number;
  bodyFontSize?: number;
  qrSize?: number;
  metaFontSize?: number;
  footerFontSize?: number;
}

export const FullScreenCertificateModal: React.FC<FullScreenCertificateModalProps> = ({
  isOpen,
  onClose,
  docType = 'certificate',
  data,
  offerLetterData,
  attendanceData,
  qrCodeUrl,
  nameFont,
  nameColor,
  nameSize,
  signatoryTitle,
  udyamId,
  gstin,
  overallScale,
  logoHeight,
  certTitleSize,
  domainFontSize,
  domainMarginTop,
  domainMarginBottom,
  bodyFontSize,
  qrSize,
  metaFontSize,
  footerFontSize
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const docRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Determine base dimensions according to document type
  const isLandscape = docType === 'certificate';
  const baseWidth = isLandscape ? 1414 : 850;
  const baseHeight = docType === 'certificate' ? 1000 : docType === 'attendance' ? 1202 : 1277;

  // Auto-calculate scale to fit available viewport dimensions perfectly
  useEffect(() => {
    if (!isOpen) return;

    const computeScale = () => {
      const availW = window.innerWidth - 64; // horizontal margins
      const availH = window.innerHeight - 120; // header height + margins
      const scaleW = availW / baseWidth;
      const scaleH = availH / baseHeight;
      const fitted = Math.min(1.2, Math.max(0.18, Math.min(scaleW, scaleH)));
      setScale(fitted);
    };

    computeScale();
    window.addEventListener('resize', computeScale);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', computeScale);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, baseWidth, baseHeight]);

  if (!isOpen) return null;

  const docTitle = docType === 'certificate'
    ? 'Internship Completion Certificate'
    : docType === 'attendance'
    ? 'Certificate of Attendance'
    : 'Internship Offer Letter';

  const candidateName = 
    docType === 'offer-letter'
      ? offerLetterData?.studentName || data?.studentName || data?.name || 'Student'
      : docType === 'attendance'
      ? attendanceData?.studentName || data?.studentName || data?.name || 'Student'
      : data?.name || 'Student';

  const docId = 
    docType === 'offer-letter'
      ? offerLetterData?.offerLetterNo || data?.offerLetterNo || 'ZF-2026-INT-001'
      : docType === 'attendance'
      ? attendanceData?.certId || data?.certId || 'ATD-ATT-2026-001'
      : data?.certId || 'AT-IC-MER-2026-001';

  const handlePrint = () => {
    if (!docRef.current) return;
    printOfficialDocument(docRef.current, {
      orientation: isLandscape ? 'landscape' : 'portrait',
      title: `${docTitle.replace(/\s+/g, '_')}_${candidateName.replace(/\s+/g, '_')}`
    });
  };

  const handleDownloadPng = async () => {
    if (!docRef.current) return;
    try {
      setIsExporting(true);
      await exportElementToImage(docRef.current, {
        filename: `ATIDETO_${docTitle.replace(/\s+/g, '_')}_${candidateName.replace(/\s+/g, '_')}.png`,
        canonicalWidth: baseWidth,
        canonicalHeight: baseHeight
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!docRef.current) return;
    try {
      setIsExporting(true);
      await exportElementToA4Pdf(docRef.current, {
        filename: `ATIDETO_${docTitle.replace(/\s+/g, '_')}_${candidateName.replace(/\s+/g, '_')}.pdf`,
        orientation: isLandscape ? 'landscape' : 'portrait',
        canonicalWidth: baseWidth,
        canonicalHeight: baseHeight
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-md flex flex-col overflow-hidden animate-in fade-in duration-200">
      
      {/* Top Controls Bar */}
      <div className="h-16 px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0 shadow-lg text-white">
        
        {/* Title & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
            {docType === 'offer-letter' ? (
              <Briefcase size={18} />
            ) : docType === 'attendance' ? (
              <CalendarCheck size={18} />
            ) : (
              <Award size={18} />
            )}
          </div>
          <div>
            <h3 className="text-sm font-extrabold flex items-center gap-2">
              <span>{docTitle}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                1:1 Official Scaled
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              {candidateName} • {docId}
            </p>
          </div>
        </div>

        {/* Action Buttons & Close */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            title="Print Official Document"
          >
            <Printer size={14} className="text-blue-400" />
            <span>Print</span>
          </button>

          <button
            type="button"
            disabled={isExporting}
            onClick={handleDownloadPng}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer disabled:opacity-50"
            title="Download 300DPI PNG"
          >
            <Download size={14} className="text-emerald-400" />
            <span>PNG</span>
          </button>

          <button
            type="button"
            disabled={isExporting}
            onClick={handleDownloadPdf}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50"
            title="Download Official PDF"
          >
            <Download size={14} />
            <span>Official PDF</span>
          </button>

          <div className="h-6 w-px bg-slate-700 mx-1" />

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition cursor-pointer"
            title="Close Full View (Esc)"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-slate-950"
      >
        <div
          style={{
            width: `${Math.round(baseWidth * scale)}px`,
            height: `${Math.round(baseHeight * scale)}px`,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '12px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9)',
            transition: 'width 0.15s ease-out, height 0.15s ease-out'
          }}
          className="shrink-0 bg-white"
        >
          {docType === 'certificate' && (
            <AuthenticCertificateCanvas
              containerRef={docRef}
              data={data}
              qrCodeUrl={qrCodeUrl}
              scale={scale}
              nameFont={nameFont}
              nameColor={nameColor}
              nameSize={nameSize}
              signatoryTitle={signatoryTitle}
              udyamId={udyamId}
              gstin={gstin}
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

          {docType === 'offer-letter' && (
            <AuthenticOfferLetterCanvas
              containerRef={docRef}
              data={offerLetterData || data}
              scale={scale}
            />
          )}

          {docType === 'attendance' && (
            <AuthenticAttendanceCertificateCanvas
              containerRef={docRef}
              data={attendanceData || data}
              scale={scale}
            />
          )}
        </div>
      </div>

    </div>
  );
};
