import React from 'react';
import { Mail, Globe } from 'lucide-react';
import offerLetterBgImage from '@/assets/certificates/Offerletter.png';
import atidetoLogoImg from '@/assets/certificates/atideto-logo.png';
import atidetoSealImg from '@/assets/certificates/atideto-seal.png';
import zyrflowSealImg from '@/assets/certificates/zyrflow-seal.png';

export interface AuthenticOfferLetterData {
  studentName: string;
  collegeName: string;
  studentEmail: string;
  studentPhone: string;
  domain: string;
  duration: string;
  startDate: string;
  endDate: string;
  offerLetterNo: string;
  issueDate: string;
  mode?: string;
  salutation?: string;
}

export interface AuthenticOfferLetterCanvasProps {
  data: AuthenticOfferLetterData;
  containerRef?: React.Ref<HTMLDivElement>;
  scale?: number;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function formatOfferLetterDate(isoDate: string): string {
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

export const AuthenticOfferLetterCanvas: React.FC<AuthenticOfferLetterCanvasProps> = ({
  data,
  containerRef,
  scale = 1,
  id = 'official-authentic-offer-letter',
  className = '',
  style = {}
}) => {
  const salutation = data.salutation || 'Mr.';
  const mode = data.mode || 'Offline';

  return (
    <div
      ref={containerRef}
      id={id}
      data-printable="offer-letter"
      style={{
        width: '850px',
        height: '1277px',
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
      {/* Official Letterhead Background Graphic */}
      <img
        src={offerLetterBgImage}
        alt="Offer Letter Background"
        crossOrigin="anonymous"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '850px',
          height: '1277px',
          objectFit: 'fill',
          zIndex: 0,
          pointerEvents: 'none'
        }}
        className="absolute inset-0 w-full h-full object-fill z-0 pointer-events-none"
      />

      {/* Inner Content Layer */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-[60px_62px_45px_62px]">
        
        {/* Upper Body Section */}
        <div className="space-y-4">
          
          {/* Top Centered Logo (ATIDETO Technologies - Prominent Header) */}
          <div 
            className="flex items-center justify-center pt-1" 
            style={{ width: '100%', minHeight: '85px', height: '85px' }}
          >
            <img
              src={atidetoLogoImg}
              alt="ATIDETO Technologies"
              crossOrigin="anonymous"
              style={{
                height: '80px',
                width: 'auto',
                maxHeight: '80px',
                maxWidth: '280px',
                objectFit: 'contain',
                display: 'block'
              }}
              className="h-[80px] w-auto object-contain"
            />
          </div>

          {/* Document Title */}
          <div className="text-center pt-1">
            <h1 className="font-extrabold text-[27px] tracking-wide text-[#0f2e6b] uppercase">
              INTERNSHIP OFFER LETTER
            </h1>
          </div>

          {/* Reference Meta Line */}
          <div className="flex items-center justify-between text-[12.5px] pt-1 text-slate-800">
            <div>
              <span className="font-semibold text-slate-700">Offer Letter No. : </span>
              <strong className="font-mono text-slate-900">{data.offerLetterNo}</strong>
            </div>
            <div>
              <span className="font-semibold text-slate-700">Date : </span>
              <strong className="text-slate-900">{formatOfferLetterDate(data.issueDate)}</strong>
            </div>
          </div>

          {/* Candidate Addressee Block */}
          <div className="space-y-0.5 text-[12.5px] pt-1">
            <p className="font-bold text-slate-900">To,</p>
            <p className="font-bold text-slate-900">
              {salutation}{' '}
              <span className="text-[#1e40af] font-extrabold">{data.studentName}</span>
            </p>
            <p className="text-slate-700">{data.collegeName}</p>
            <p className="text-slate-600">{data.studentEmail}</p>
            <p className="text-slate-600 font-mono">{data.studentPhone}</p>
          </div>

          {/* Greeting */}
          <div className="pt-2 text-[12.5px]">
            <p className="text-slate-900">
              <span className="font-bold">Dear </span>
              <span className="font-bold text-[#1e40af]">{data.studentName}</span>,
            </p>
          </div>

          {/* Body Paragraph 1 */}
          <div className="text-[12.5px] leading-[1.65] text-slate-700">
            <p>
              We are pleased to offer you an internship opportunity. This internship is designed to provide practical industry exposure, hands-on learning, and real-world project experience while helping you strengthen your technical and professional skills.
            </p>
          </div>

          {/* Section: Internship Details */}
          <div className="pt-1">
            <h3 className="text-[13.5px] font-extrabold text-[#1e40af] mb-2">
              Internship Details
            </h3>

            {/* Details Box */}
            <div className="border border-blue-200/75 rounded-xl bg-blue-50/20 overflow-hidden divide-y divide-blue-200/50">
              <div className="flex items-center text-[12px] py-2 px-4">
                <span className="w-44 font-bold text-[#1e40af]">Internship Domain</span>
                <span className="w-4 font-bold text-slate-400">:</span>
                <span className="font-medium text-slate-800">{data.domain}</span>
              </div>
              <div className="flex items-center text-[12px] py-2 px-4">
                <span className="w-44 font-bold text-[#1e40af]">Duration</span>
                <span className="w-4 font-bold text-slate-400">:</span>
                <span className="font-medium text-slate-800">{data.duration}</span>
              </div>
              <div className="flex items-center text-[12px] py-2 px-4">
                <span className="w-44 font-bold text-[#1e40af]">Start Date</span>
                <span className="w-4 font-bold text-slate-400">:</span>
                <span className="font-medium text-slate-800">{formatOfferLetterDate(data.startDate)}</span>
              </div>
              <div className="flex items-center text-[12px] py-2 px-4">
                <span className="w-44 font-bold text-[#1e40af]">End Date</span>
                <span className="w-4 font-bold text-slate-400">:</span>
                <span className="font-medium text-slate-800">{formatOfferLetterDate(data.endDate)}</span>
              </div>
              <div className="flex items-center text-[12px] py-2 px-4">
                <span className="w-44 font-bold text-[#1e40af]">Mode</span>
                <span className="w-4 font-bold text-slate-400">:</span>
                <span className="font-medium text-slate-800">{mode}</span>
              </div>
            </div>
          </div>

          {/* Body Paragraph 2 */}
          <div className="text-[12px] leading-[1.65] text-slate-700 pt-1">
            <p>
              This internship offer letter is issued by Zyrflow Technologies Pvt. Ltd., under the internship program conducted and managed by Atideto Technologies. Upon successful completion of the program requirements, the intern will be eligible to receive a completion certificate issued by Zyrflow Technologies Pvt. Ltd., subject to the applicable certification requirements.
            </p>
          </div>

        </div>

        {/* Signatures & Seals Block - Aligned to Bottom */}
        <div className="mt-auto pt-4 pb-2">
          <p className="text-[13px] font-bold text-slate-900 mb-3">
            Sincerely,
          </p>

          <div className="grid grid-cols-2 gap-8 pt-1 items-end">
            
            {/* Left Column: Atideto Technologies */}
            <div className="space-y-1">
              <p className="text-[12.5px] font-bold text-slate-900">
                For Atideto Technologies
              </p>
              <div className="py-1">
                <img
                  src={atidetoSealImg}
                  alt="Atideto Official Seal"
                  crossOrigin="anonymous"
                  className="w-[108px] h-[108px] object-contain drop-shadow-xs"
                  style={{ width: '108px', height: '108px' }}
                />
              </div>
              <p className="text-[11.5px] text-slate-600 font-medium">
                Coimbatore • Salem
              </p>
            </div>

            {/* Right Column: Zyrflow Technologies Pvt. Ltd. - Aligned to Right Side Corner */}
            <div className="space-y-1 flex flex-col items-end text-right ml-auto">
              <p className="text-[12.5px] font-bold text-slate-900">
                For Zyrflow Technologies Pvt. Ltd.
              </p>
              <div className="py-1 flex justify-end w-full">
                <img
                  src={zyrflowSealImg}
                  alt="Zyrflow Official Seal"
                  crossOrigin="anonymous"
                  className="w-[108px] h-[108px] object-contain drop-shadow-xs"
                  style={{ width: '108px', height: '108px' }}
                />
              </div>
              <p className="text-[11.5px] text-slate-600 font-medium">
                Sikarajapuram, Vellore – 632515
              </p>
            </div>

          </div>
        </div>

        {/* Footer Contact Strip */}
        <div className="pt-4 border-t border-slate-200/70 text-[10.5px] text-slate-600 flex items-center justify-center gap-3">
          <span className="flex items-center gap-1.5"><Mail size={12} className="text-blue-600 shrink-0" /> internships@zyrflow.com</span>
          <span className="text-slate-400">•</span>
          <span className="flex items-center gap-1.5"><Globe size={12} className="text-blue-600 shrink-0" /> zyrflow.com</span>
          <span className="text-slate-400">•</span>
          <span className="flex items-center gap-1.5"><Globe size={12} className="text-blue-600 shrink-0" /> atideto.in</span>
          <span className="text-slate-400">•</span>
          <span className="font-medium text-slate-700">Training Partner: Atideto Technologies</span>
        </div>

      </div>
    </div>
  );
};
