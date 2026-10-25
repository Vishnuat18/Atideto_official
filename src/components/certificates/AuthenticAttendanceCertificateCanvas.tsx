import React from 'react';
import background2Img from '@/assets/certificates/background2.png';
import atidetoLogoImg from '@/assets/certificates/atideto-logo.png';

export interface AuthenticAttendanceData {
  studentName: string;
  collegeName: string;
  department?: string;
  registerNo: string;
  domain: string;
  startDate: string;
  endDate: string;
  totalDays?: number;
  presentDays?: number;
  attendancePct?: number | string;
  certId: string;
  issueDate: string;
}

export interface AuthenticAttendanceCertificateCanvasProps {
  data: AuthenticAttendanceData;
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

export function formatAttendanceDate(isoDate: string): string {
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

export const AuthenticAttendanceCertificateCanvas: React.FC<AuthenticAttendanceCertificateCanvasProps> = ({
  data,
  containerRef,
  scale = 1,
  id = 'official-authentic-attendance-certificate',
  className = '',
  style = {}
}) => {
  const department = data.department || 'B.E Computer Science & Engineering';
  const totalDays = data.totalDays || 30;
  const presentDays = data.presentDays || 28;
  const attendancePct = data.attendancePct || ((presentDays / totalDays) * 100).toFixed(1);

  return (
    <div
      ref={containerRef}
      id={id}
      data-printable="attendance-certificate"
      style={{
        width: '850px',
        height: '1202px',
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
      {/* Official Certificate Background Graphic */}
      <img
        src={background2Img}
        alt="Attendance Certificate Background"
        crossOrigin="anonymous"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '850px',
          height: '1202px',
          objectFit: 'fill',
          zIndex: 0,
          pointerEvents: 'none'
        }}
        className="absolute inset-0 w-full h-full object-fill z-0 pointer-events-none"
      />

      {/* Inner Content Layer */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-[52px_72px_145px_72px]">
        
        {/* Top Header Row with Centered Official Logo */}
        <div 
          className="flex items-center justify-center pt-1" 
          style={{ width: '100%', minHeight: '85px', height: '85px' }}
        >
          <img
            src={atidetoLogoImg}
            alt="ATIDETO Technologies"
            crossOrigin="anonymous"
            style={{
              height: '82px',
              width: 'auto',
              maxHeight: '82px',
              maxWidth: '280px',
              objectFit: 'contain',
              display: 'block'
            }}
            className="h-[82px] w-auto object-contain"
          />
        </div>

        {/* Center Content Section */}
        <div className="flex-1 flex flex-col justify-center -mt-2 space-y-5 text-center">
          
          {/* Main Title Block - Single Line */}
          <div>
            <h1 className="font-serif text-[34px] font-black leading-tight text-[#0052cc] tracking-wide uppercase whitespace-nowrap">
              CERTIFICATE OF ATTENDANCE
            </h1>
            <div className="w-20 h-1 bg-[#0052cc] mx-auto rounded-full mt-3.5 mb-5" />
          </div>

          {/* Subheading */}
          <div>
            <p className="text-[15px] text-slate-600 font-medium">
              This is to certify that
            </p>
          </div>

          {/* Recipient Student Name */}
          <div className="py-1">
            <h2 className="font-serif text-[42px] font-black text-[#0b2545] tracking-tight">
              {data.studentName}
            </h2>
          </div>

          {/* Paragraph 1 */}
          <div className="max-w-[710px] mx-auto text-[14.5px] leading-[1.8] text-slate-700">
            <p>
              bearing <strong className="text-slate-900">Register Number / Roll Number {data.registerNo}</strong>, a student of the <strong className="text-slate-900">{department}</strong> at <strong className="text-slate-900">{data.collegeName}</strong>, has attended the internship conducted by <strong className="text-[#0052cc]">ATIDETO Technologies</strong> in the domain of <strong className="text-slate-900">{data.domain}</strong>.
            </p>
          </div>

          {/* Paragraph 2 */}
          <div className="max-w-[710px] mx-auto text-[14.5px] leading-[1.8] text-slate-700">
            <p>
              The internship was undertaken from <strong className="text-slate-900">{formatAttendanceDate(data.startDate)}</strong> to <strong className="text-slate-900">{formatAttendanceDate(data.endDate)}</strong>, for a total duration of <strong className="text-slate-900">{totalDays} days</strong>, with a recorded attendance of <strong className="text-slate-900">{presentDays} out of {totalDays} working days ({attendancePct}%)</strong>.
            </p>
          </div>

          {/* Paragraph 3 */}
          <div className="max-w-[690px] mx-auto text-[13.5px] leading-[1.7] text-slate-600 pt-2 pb-4">
            <p>
              This certificate is issued upon request for academic records, institutional documentation, and internship attendance verification.
            </p>
          </div>

        </div>

        {/* Bottom Section: ID & Date on Left | Signature Area on Right with centered Founder under line */}
        <div className="grid grid-cols-2 items-end pt-2 pb-2">
          
          {/* Left Column: Metadata */}
          <div className="space-y-1.5 text-[13px] text-slate-700 font-medium">
            <p className="flex items-center gap-2">
              <span className="w-28 text-slate-600">Certificate ID</span>
              <span className="text-slate-400">:</span>
              <strong className="font-mono text-slate-900 font-bold">{data.certId}</strong>
            </p>
            <p className="flex items-center gap-2">
              <span className="w-28 text-slate-600">Date of Issue</span>
              <span className="text-slate-400">:</span>
              <strong className="text-slate-900 font-semibold">{formatAttendanceDate(data.issueDate)}</strong>
            </p>
          </div>

          {/* Right Column: Signature Space (Founder and Atideto Technologies centered directly with the blue line) */}
          <div className="flex flex-col items-center ml-auto w-52 text-center pr-2">
            <div className="h-10 w-full" />
            <div className="w-full border-b-2 border-[#0052cc]/60 mb-2" />
            <p className="font-sans text-[14px] font-bold text-[#0b2545] m-0">
              Founder
            </p>
            <p className="font-sans text-[12.5px] text-slate-600 font-medium m-0 mt-0.5">
              Atideto Technologies
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
