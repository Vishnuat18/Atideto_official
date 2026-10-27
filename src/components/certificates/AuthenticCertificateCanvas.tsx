import React from 'react';
import { Mail, Phone, Globe } from 'lucide-react';
import certBgImage from '@/assets/certificates/background1.png';
import atidetoLogoImg from '@/assets/certificates/atideto-logo.png';
import msmeLogoImg from '@/assets/certificates/msme-logo.png';
import startupIndiaLogo from '@/assets/certificates/startup-india.png';
import qrPlaceholderImg from '@/assets/certificates/qr-placeholder.png';
import QRCode from 'qrcode';
import { getVerificationUrl } from '@/lib/certificateStore';

export interface AuthenticCertificateData {
  name: string;
  college: string;
  id: string; // Register No / Student ID
  domain: string;
  startDate: string;
  endDate?: string;
  duration: string;
  issueDate: string;
  certId: string;
}

export interface AuthenticCertificateCanvasProps {
  data: AuthenticCertificateData;
  qrCodeUrl?: string;
  containerRef?: React.Ref<HTMLDivElement>;
  scale?: number;
  nameFont?: string;
  nameColor?: string;
  nameSize?: number;
  signatoryTitle?: string;
  udyamId?: string;
  gstin?: string;
  supportEmail?: string;
  supportPhone?: string;
  website?: string;
  id?: string;
  className?: string;
  style?: React.CSSProperties;

  // Granular sizing options (Internship Certificate)
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

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function formatCertificateDate(isoDate?: string): string {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    if (y && m && d && m >= 1 && m <= 12) {
      return `${String(d).padStart(2, '0')} ${MONTHS[m - 1]} ${y}`;
    }
  }
  return isoDate;
}

export const AuthenticCertificateCanvas: React.FC<AuthenticCertificateCanvasProps> = ({
  data,
  qrCodeUrl,
  containerRef,
  scale = 1,
  nameFont = "'Cormorant Garamond', Georgia, serif",
  nameColor = '#12539c',
  nameSize = 58,
  signatoryTitle = 'Founder, ATIDETO Technologies',
  udyamId = 'UDYAM-TN-20-0242534',
  supportEmail = 'hello@atideto.com',
  supportPhone = '+91 98765 43210',
  website = 'www.atideto.com',
  id = 'official-authentic-certificate',
  className = '',
  style = {},
  // Sizing controls
  overallScale = 1.0,
  logoHeight = 98,
  certTitleSize = 44,
  domainFontSize = 17,
  domainMarginTop = 38,
  domainMarginBottom = 16,
  bodyFontSize = 19,
  qrSize = 120,
  metaFontSize = 15,
  footerFontSize = 14
}) => {
  const studentName = data?.name || 'Candidate Name';
  const collegeName = data?.college || 'Institution / College';
  const registerNo = data?.id || 'REGISTER-NO';
  const domainName = data?.domain || 'Industrial Specialization';
  const formattedStartDate = formatCertificateDate(data?.startDate) || '01 June 2026';
  const formattedEndDate = formatCertificateDate(data?.endDate) || '31 July 2026';
  const duration = data?.duration || 'Internship Period';
  const formattedIssueDate = formatCertificateDate(data?.issueDate) || '01 August 2026';
  const certId = data?.certId || 'CERT-ID-PENDING';

  // Compute effective sizes multiplied by overall master scale
  const masterScale = overallScale || 1.0;
  const effLogoHeight = Math.max(30, Math.round(logoHeight * masterScale));
  const effCertTitleSize = Math.max(18, Math.round(certTitleSize * masterScale));
  const effNameSize = Math.max(22, Math.round(nameSize * masterScale));
  const effDomainFontSize = Math.max(9, Math.round(domainFontSize * masterScale));
  const effDomainMarginTop = Math.max(4, Math.round(domainMarginTop * masterScale));
  const effDomainMarginBottom = Math.max(4, Math.round(domainMarginBottom * masterScale));
  const effBodyFontSize = Number(Math.max(10, bodyFontSize * masterScale).toFixed(1));
  const effQrSize = Math.max(50, Math.round(qrSize * masterScale));
  const effMetaFontSize = Number(Math.max(9, metaFontSize * masterScale).toFixed(1));
  const effFooterFontSize = Number(Math.max(8, footerFontSize * masterScale).toFixed(1));

  const [computedQrUrl, setComputedQrUrl] = React.useState<string>(qrCodeUrl || '');

  React.useEffect(() => {
    let active = true;
    if (qrCodeUrl && (qrCodeUrl.startsWith('data:') || qrCodeUrl.startsWith('http'))) {
      setComputedQrUrl(qrCodeUrl);
      return;
    }
    const verUrl = getVerificationUrl(certId);
    QRCode.toDataURL(verUrl, {
      width: 250,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#000000', light: '#ffffff' }
    })
      .then((url) => {
        if (active) setComputedQrUrl(url);
      })
      .catch(() => {
        if (active) {
          setComputedQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=8&data=${encodeURIComponent(verUrl)}`);
        }
      });

  return () => {
      active = false;
    };
  }, [certId, qrCodeUrl]);

  return (
    <div
      ref={containerRef}
      id={id}
      data-printable="certificate"
      style={{
        width: '1414px',
        height: '1000px',
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top left',
        position: scale !== 1 ? 'absolute' : 'relative',
        top: 0,
        left: 0,
        fontFamily: "'Inter', sans-serif",
        ...style
      }}
      className={`relative bg-white text-slate-900 overflow-hidden select-none shrink-0 ${className}`}
    >
      {/* Official Certificate Background Graphic (Guilloche Waves & Geometry) */}
      <img
        src={certBgImage}
        alt="Certificate Background"
        crossOrigin="anonymous"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1414px',
          height: '1000px',
          objectFit: 'cover',
          zIndex: 0,
          pointerEvents: 'none'
        }}
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />

      {/* Inner Content Layer — calibrated to use the A4 landscape page cleanly. */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between px-[68px] pt-[36px] pb-[22px]">

        {/* Top Header: Left ATIDETO logo | Right: Startup India + MSME + UDYAM ID */}
        <div 
          className="flex items-center justify-between" 
          style={{ 
            minHeight: `${effLogoHeight}px`, 
            height: `${effLogoHeight}px`, 
            width: '100%' 
          }}
        >
          {/* Top-Left: ATIDETO Technologies Logo */}
          <div className="flex items-center" style={{ height: `${effLogoHeight}px` }}>
            <img
              src={atidetoLogoImg}
              alt="ATIDETO Technologies"
              crossOrigin="anonymous"
              style={{
                height: `${effLogoHeight}px`,
                width: 'auto',
                maxHeight: `${effLogoHeight}px`,
                maxWidth: `${Math.round(effLogoHeight * 3.4)}px`,
                objectFit: 'contain',
                display: 'block'
              }}
              className="w-auto object-contain"
            />
          </div>

          {/* Top-Right: Startup India logo + Ashoka Emblem & MSME Logo + UDYAM ID */}
          <div className="flex items-center gap-7">
            <img
              src={startupIndiaLogo}
              alt="Startup India"
              crossOrigin="anonymous"
              style={{
                height: `${Math.round(effLogoHeight * 0.72)}px`,
                width: 'auto',
                maxHeight: `${Math.round(effLogoHeight * 0.72)}px`,
                maxWidth: `${Math.round(effLogoHeight * 2.3)}px`,
                objectFit: 'contain',
                display: 'block'
              }}
              className="w-auto object-contain"
            />
            <div className="flex flex-col items-center">
              <img
                src={msmeLogoImg}
                alt="MSME Registered"
                crossOrigin="anonymous"
                style={{
                  height: `${Math.round(effLogoHeight * 0.98)}px`,
                  width: 'auto',
                  maxHeight: `${Math.round(effLogoHeight * 0.98)}px`,
                  maxWidth: `${Math.round(effLogoHeight * 1.8)}px`,
                  objectFit: 'contain',
                  display: 'block'
                }}
                className="w-auto object-contain"
              />
              <span
                style={{ 
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: `${Math.max(9.5, Math.round(effLogoHeight * 0.14))}px`
                }}
                className="font-bold text-black tracking-[0.3px] mt-1 text-center"
              >
                {udyamId}
              </span>
            </div>
          </div>
        </div>

        {/* Center Content Block - Vertically Centered */}
        <div className="flex-1 flex flex-col justify-center my-auto py-2 text-center">

          {/* Eyebrow & Title */}
          <div>
            <p 
              className="font-sans uppercase tracking-[0.28em] text-[#5c7595] font-bold m-0"
              style={{ fontSize: `${Math.max(10.5, Math.round(effCertTitleSize * 0.325))}px` }}
            >
              THIS CERTIFIES THAT
            </p>
            <h1
              style={{ 
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: `${effCertTitleSize}px`
              }}
              className="font-extrabold text-[#0b2545] tracking-[0.2px] mt-2 mb-0"
            >
              Internship Completion Certificate
            </h1>
          </div>

          {/* Student Name */}
          <div className="mt-3 mb-0">
            <h2
              style={{
                fontFamily: nameFont || "'Cormorant Garamond', Georgia, serif",
                color: nameColor || '#12539c',
                fontSize: `${effNameSize}px`,
                fontWeight: 700
              }}
              className="font-bold tracking-wide italic m-0 leading-[1.08]"
            >
              {studentName}
            </h2>
          </div>

          {/* Domain Title Capsule Box directly below student name */}
          <div 
            className="flex justify-center items-center"
            data-certificate-domain-row="true"
            style={{
              marginTop: `${effDomainMarginTop}px`,
              marginBottom: `${effDomainMarginBottom}px`,
              position: 'relative',
            }}
          >
            <div
              className="inline-flex items-center justify-center rounded-full shadow-xs"
              data-certificate-domain-box="true"
              style={{
                border: '1.5px solid #caa868',
                backgroundColor: '#ffffff',
                minWidth: `${Math.round(430 * masterScale)}px`,
                maxWidth: `${Math.round(780 * masterScale)}px`,
                height: `${Math.max(38, Math.round(effDomainFontSize * 2.3))}px`,
                paddingLeft: `${Math.max(26, Math.round(effDomainFontSize * 2.1))}px`,
                paddingRight: `${Math.max(26, Math.round(effDomainFontSize * 2.1))}px`,
                boxSizing: 'border-box',
                lineHeight: 1
              }}
            >
              <div
                data-certificate-domain-content="true"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  position: 'relative',
                  top: '-6px',
                  lineHeight: 1
                }}
              >
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: `${effDomainFontSize}px`,
                    fontWeight: 600,
                    color: '#0b2545',
                    lineHeight: 1,
                    display: 'inline-block',
                    verticalAlign: 'middle'
                  }}
                  className="whitespace-nowrap select-none"
                >
                  Internship Domain :
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: `${effDomainFontSize}px`,
                    fontWeight: 700,
                    color: '#12539c',
                    lineHeight: 1,
                    display: 'inline-block',
                    verticalAlign: 'middle'
                  }}
                  className="whitespace-nowrap select-none"
                >
                  {domainName}
                </span>
              </div>
            </div>
          </div>

          {/* Description Paragraphs with responsive, customizable font size */}
          <div 
            className="text-center max-w-[1140px] mx-auto text-[#2c3746] space-y-4"
            style={{
              fontSize: `${effBodyFontSize}px`,
              lineHeight: '1.58'
            }}
          >
            <p className="m-0">
              This Certificate of Completion is proudly awarded in recognition of the successful completion of the internship program at ATIDETO. Throughout the internship, the intern demonstrated professionalism, dedication, and a strong commitment to learning while contributing to assigned responsibilities and project objectives.
            </p>
            <p className="m-0">
              The internship was successfully completed from{' '}
              <span className="font-bold text-[#0b2545]">{formattedStartDate}</span> to{' '}
              <span className="font-bold text-[#0b2545]">{formattedEndDate}</span> by a student of{' '}
              <span className="font-bold text-[#0b2545]">{collegeName}</span> (Register No.:{' '}
              <span className="font-bold text-[#0b2545]">{registerNo}</span>). We appreciate the intern's contribution and wish them continued success in their future academic and professional endeavors.
            </p>
          </div>

        </div>

        {/* Bottom Section: Left=Meta, Center=QR, Right=Signature */}
        <div className="grid grid-cols-3 items-end pt-3 pb-1">
          {/* Left Column: Metadata */}
          <div 
            className="flex flex-col gap-2.5 font-sans"
            style={{ fontSize: `${effMetaFontSize}px` }}
          >
            <div className="flex items-center">
              <span className="font-bold text-[#0b2545] w-[105px]">Duration</span>
              <span className="font-mono text-black font-semibold">{duration}</span>
            </div>
            <div className="flex items-center">
              <span className="font-bold text-[#0b2545] w-[105px]">Issue Date</span>
              <span className="font-mono text-black font-semibold">{formattedIssueDate}</span>
            </div>
            <div className="flex items-center">
              <span className="font-bold text-[#0b2545] w-[105px]">Verify ID</span>
              <span className="font-mono text-black font-extrabold">{certId}</span>
            </div>
          </div>

          {/* Middle Column: Scalable QR Code */}
          <div className="flex flex-col items-center justify-center">
            <div className="p-2 bg-white border border-slate-300 rounded-lg shadow-xs">
              <img
                src={computedQrUrl || qrPlaceholderImg}
                alt="Verification QR"
                crossOrigin="anonymous"
                style={{ 
                  width: `${effQrSize}px`, 
                  height: `${effQrSize}px`, 
                  minWidth: `${effQrSize}px`, 
                  minHeight: `${effQrSize}px`, 
                  objectFit: 'contain', 
                  display: 'block' 
                }}
                className="object-contain"
              />
            </div>
            <span 
              style={{ fontSize: `${Math.max(9, Math.round(effQrSize * 0.125))}px` }}
              className="font-semibold text-[#5c7595] mt-2 tracking-wide"
            >
              Scan to verify
            </span>
          </div>

          {/* Right Column: Signature */}
          <div className="flex flex-col items-end text-right">
            <div className="w-[260px] h-[2px] bg-[#0b2545]/80 mb-2.5" />
            <p 
              className="font-sans font-bold text-[#0b2545] m-0"
              style={{ fontSize: `${effMetaFontSize + 0.5}px` }}
            >
              {signatoryTitle}
            </p>
          </div>
        </div>

        {/* Footer Contact Strip */}
        <div 
          className="flex items-center justify-center gap-16 text-[#5c7595] pb-0 font-sans"
          style={{ fontSize: `${effFooterFontSize}px` }}
        >
          <div className="flex items-center gap-2 shrink-0">
            <Mail size={Math.round(effFooterFontSize * 1.1)} color="#12539c" strokeWidth={2} className="text-[#12539c] shrink-0" />
            <span className="font-medium">{supportEmail}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Phone size={Math.round(effFooterFontSize * 1.1)} color="#12539c" strokeWidth={2} className="text-[#12539c] shrink-0" />
            <span className="font-medium">{supportPhone}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Globe size={Math.round(effFooterFontSize * 1.1)} color="#12539c" strokeWidth={2} className="text-[#12539c] shrink-0" />
            <span className="font-medium">{website}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
