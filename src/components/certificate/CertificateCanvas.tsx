import React from 'react';
import '@/styles/certificate.css';

export interface CertificateCanvasProps {
  data: {
    studentName: string;
    course: string;
    college?: string | null;
    registerNo?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    duration?: string | null;
    issueDate?: string | null;
    verifyId?: string | null;
    qrLink?: string | null;
    udyamId?: string | null;
    founderDesignation?: string | null;
    email?: string | null;
    phone?: string | null;
    website?: string | null;
  };
  id?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function formatCertificateDate(val?: string | null): string {
  if (!val) return '—';
  const str = String(val).split('T')[0];
  const parts = str.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d) && m >= 1 && m <= 12) {
      return `${String(d).padStart(2, '0')} ${MONTHS[m - 1]} ${y}`;
    }
  }
  const dateObj = new Date(val);
  if (!isNaN(dateObj.getTime())) {
    const d = dateObj.getDate();
    const m = dateObj.getMonth();
    const y = dateObj.getFullYear();
    return `${String(d).padStart(2, '0')} ${MONTHS[m]} ${y}`;
  }
  return val;
}

export const CertificateCanvas: React.FC<CertificateCanvasProps> = ({
  data,
  id = 'certificateCanvas',
}) => {
  const eyebrow = 'THIS CERTIFIES THAT';
  const mainTitle = 'Internship Completion Certificate';
  const domainPrefix = 'Internship Domain';
  const p1Text =
    'This Certificate of Completion is proudly awarded in recognition of the successful completion of the internship program at ATIDETO. Throughout the internship, the intern demonstrated professionalism, dedication, and a strong commitment to learning while contributing to assigned responsibilities and project objectives.';
  const p2Prefix = 'The internship was successfully completed from';
  const p2Mid = 'by a student of';
  const p2Suffix =
    '. We appreciate the intern\'s contribution and wish them continued success in their future academic and professional endeavors.';
  const durationLabel = 'Duration';
  const issueDateLabel = 'Issue Date';
  const verifyIdLabel = 'Verify ID';
  const qrCaption = 'Scan to verify';

  const udyamId = data.udyamId || 'UDYAM-TN-20-0242534';
  const founderDesignation = data.founderDesignation || 'Founder, ATIDETO Technologies';
  const email = data.email || 'hello@atideto.com';
  const phone = data.phone || '+91 98765 43210';
  const website = data.website || 'www.atideto.com';

  const defaultQrUrl =
    data.qrLink ||
    `https://atideto-certificate-system.vercel.app/studentverify.html?id=${encodeURIComponent(data.verifyId || '')}`;
  const qrImgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=4&data=${encodeURIComponent(defaultQrUrl)}`;

  return (
    <div className="certificate-wrapper">
      <div className="certificate" id={id}>
        {/* Background Frame Image */}
        <img
          src="/assets/background1.png"
          alt="Certificate Background"
          className="cert-bg"
        />

        {/* Inner Certificate Content Area */}
        <div className="cert-inner">
          {/* 1. Header Row (Logos & MSME) */}
          <div className="cert-top">
            <div className="cert-top-left">
              <img
                src="/assets/atideto-logo.png"
                alt="ATIDETO Technologies"
                className="cert-atideto-logo"
              />
            </div>
            <div className="cert-top-right">
              <img
                src="/assets/msme-logo.png"
                alt="MSME Registered"
                className="cert-msme-logo"
              />
              <span className="udyam-id" id="out-udyamId">
                {udyamId}
              </span>
            </div>
          </div>

          {/* 2. Certificate Eyebrow & Title */}
          <div className="cert-title-block">
            <p className="cert-eyebrow" id="out-eyebrow">
              {eyebrow}
            </p>
            <h2 className="cert-title" id="out-title">
              {mainTitle}
            </h2>
          </div>

          {/* 3. Student Name with Underline */}
          <div className="cert-name-block">
            <h3 className="cert-name" id="out-studentName">
              {data.studentName || 'Student Name'}
            </h3>
            <div className="cert-underline" />
          </div>

          {/* 4. Domain Pill Badge */}
          <div className="cert-domain-wrapper">
            <p className="cert-domain">
              {domainPrefix}&nbsp;:&nbsp;
              <span id="out-domain">
                {data.course || 'Domain / Course'}
              </span>
            </p>
          </div>

          {/* 5. Description Paragraphs */}
          <div className="cert-description">
            <p id="out-descParagraph">
              {p1Text.includes('ATIDETO') ? (
                <>
                  {p1Text.split('ATIDETO')[0]}
                  <strong>ATIDETO</strong>
                  {p1Text.split('ATIDETO').slice(1).join('ATIDETO')}
                </>
              ) : (
                p1Text
              )}
            </p>
            <p>
              {p2Prefix}{' '}
              <span id="out-startDate">{formatCertificateDate(data.startDate)}</span> to{' '}
              <span id="out-endDate">{formatCertificateDate(data.endDate)}</span> {p2Mid}{' '}
              <strong id="out-collegeName">{data.college || '—'}</strong>
              {data.registerNo ? (
                <>
                  {' '}(Register No.: <strong id="out-registerNo">{data.registerNo}</strong>)
                </>
              ) : null}
              {p2Suffix}
            </p>
          </div>

          {/* 6. Bottom Information Row */}
          <div className="cert-bottom">
            {/* Left Meta Table */}
            <div className="cert-meta">
              <p>
                <span>{durationLabel}</span>
                <b id="out-duration">{data.duration ? `${data.duration} Days` : '—'}</b>
              </p>
              <p>
                <span>{issueDateLabel}</span>
                <b id="out-issueDate">{formatCertificateDate(data.issueDate)}</b>
              </p>
              <p>
                <span>{verifyIdLabel}</span>
                <b id="out-verifyId">{data.verifyId || '—'}</b>
              </p>
            </div>

            {/* Center QR Code */}
            <div className="cert-qr">
              <div className="qr-box">
                <img
                  src={qrImgSrc}
                  alt="Verification QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <span>{qrCaption}</span>
            </div>

            {/* Right Signature Block */}
            <div className="cert-signature">
              <div className="sig-line" />
              <p id="out-founderName">{founderDesignation}</p>
            </div>
          </div>

          {/* 7. Footer Contact Bar */}
          <div className="cert-footer">
            <span>
              <i>✉</i> <span id="out-mail">{email}</span>
            </span>
            <span>
              <i>☎</i> <span id="out-contact">{phone}</span>
            </span>
            <span>
              <i>🌐</i> <span id="out-website">{website}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
