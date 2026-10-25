/**
 * Isolated Document Printing Utility
 * Ensures ONLY the exact certificate or offer letter is printed without any extra page UI,
 * headers, footers, sidebars, or margins, with pixel-perfect A4 portrait sizing.
 * - Internship certificate is vertically placed (centered vertically) and properly fitted in A4 sheet.
 * - Attendance certificate and offer letter fill standard vertical A4 layout without distortion.
 */

import { toast } from 'sonner';
import { captureElementToCanvas } from './exportPdfDocument';

export interface PrintDocumentOptions {
  orientation?: 'landscape' | 'portrait';
  title?: string;
  onComplete?: () => void;
}

export async function printOfficialDocument(
  sourceElement: HTMLElement | null,
  options: PrintDocumentOptions = {}
): Promise<boolean> {
  if (!sourceElement) {
    console.error('printOfficialDocument: No source element provided');
    toast.error('Unable to find document element to print.');
    return false;
  }

  const {
    title = 'Official Document',
    onComplete
  } = options;

  const printableType = sourceElement.getAttribute('data-printable') || 'certificate';
  const isInternshipCert = printableType === 'certificate';
  const isAttendance = printableType === 'attendance-certificate' || printableType === 'attendance';
  const canonicalWidth = isInternshipCert ? 1414 : 850;
  const canonicalHeight = isInternshipCert ? 1000 : (isAttendance ? 1202 : 1277);

  const toastId = toast.loading('Preparing official A4 print document...');

  try {
    // 1. High-fidelity capture matching preview 100%
    const canvas = await captureElementToCanvas(sourceElement, canonicalWidth, canonicalHeight, 2.5);
    const imgData = canvas.toDataURL('image/png');

    // 2. Create isolated hidden print iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    iframe.setAttribute('aria-hidden', 'true');
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      document.body.removeChild(iframe);
      toast.dismiss(toastId);
      toast.error('Print window could not be initialized.');
      return false;
    }

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>${title}</title>
          <style>
            @page {
              size: ${isInternshipCert ? '297mm 210mm' : '210mm 297mm'};
              margin: 0 !important;
            }
            *, *::before, *::after {
              box-sizing: border-box !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              width: ${isInternshipCert ? '297mm' : '210mm'} !important;
              height: ${isInternshipCert ? '210mm' : '297mm'} !important;
              background: #ffffff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
              overflow: hidden !important;
            }
            .a4-print-sheet {
              width: ${isInternshipCert ? '297mm' : '210mm'} !important;
              height: ${isInternshipCert ? '210mm' : '297mm'} !important;
              max-width: ${isInternshipCert ? '297mm' : '210mm'} !important;
              max-height: ${isInternshipCert ? '210mm' : '297mm'} !important;
              display: block !important;
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              overflow: hidden !important;
              page-break-after: avoid !important;
              page-break-inside: avoid !important;
              break-after: avoid !important;
              break-inside: avoid !important;
            }
            .cert-img-internship {
              width: 297mm !important;
              height: 210mm !important;
              max-width: 297mm !important;
              max-height: 210mm !important;
              object-fit: fill !important;
              display: block !important;
              margin: 0 !important;
            }
            .cert-img-attendance, .cert-img-offer {
              width: 210mm !important;
              height: 297mm !important;
              max-width: 210mm !important;
              max-height: 297mm !important;
              object-fit: fill !important;
              display: block !important;
              margin: 0 !important;
            }
          </style>
        </head>
        <body>
          <div class="a4-print-sheet">
            <img 
              id="printDocumentImg"
              src="${imgData}" 
              class="${isInternshipCert ? 'cert-img-internship' : isAttendance ? 'cert-img-attendance' : 'cert-img-offer'}"
              alt="${title}"
            />
          </div>
        </body>
      </html>
    `);
    doc.close();

    const printImg = doc.getElementById('printDocumentImg') as HTMLImageElement;
    const triggerPrint = () => {
      toast.dismiss(toastId);
      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (err) {
          console.error('Print invocation failed:', err);
          toast.error('Print dialog could not open.');
        } finally {
          if (onComplete) onComplete();
          setTimeout(() => {
            if (iframe.parentNode) {
              document.body.removeChild(iframe);
            }
          }, 2000);
        }
      }, 250);
    };

    if (printImg && !printImg.complete) {
      printImg.onload = triggerPrint;
      printImg.onerror = triggerPrint;
    } else {
      triggerPrint();
    }

    return true;
  } catch (err) {
    console.error('printOfficialDocument error:', err);
    toast.dismiss(toastId);
    toast.error('Failed to prepare print document.');
    return false;
  }
}


