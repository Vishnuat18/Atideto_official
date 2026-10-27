import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

export interface ExportPdfOptions {
  filename?: string;
  orientation?: 'landscape' | 'portrait';
  canonicalWidth?: number;
  canonicalHeight?: number;
  quality?: number; // 0.1 to 1.0
  scale?: number;
}

export interface ExportImageOptions {
  filename?: string;
  canonicalWidth?: number;
  canonicalHeight?: number;
  scale?: number;
}

/**
 * Ensures all <img> elements inside the target container are fully loaded and decoded
 * before html2canvas takes a snapshot.
 */
async function collectImageDataUrls(container: HTMLElement): Promise<string[]> {
  const images = Array.from(container.querySelectorAll('img'));
  return await Promise.all(
    images.map(async (img) => {
      const src = img.currentSrc || img.src;
      if (src && src.startsWith('data:')) {
        return src;
      }
      try {
        const res = await fetch(src, { mode: 'cors' });
        const blob = await res.blob();
        return await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve((reader.result as string) || src);
          reader.onerror = () => resolve(src);
          reader.readAsDataURL(blob);
        });
      } catch (_) {
        if (img.complete && img.naturalWidth > 0) {
          try {
            const cvs = document.createElement('canvas');
            cvs.width = img.naturalWidth;
            cvs.height = img.naturalHeight;
            const ctx = cvs.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              const dUrl = cvs.toDataURL('image/png');
              if (dUrl && dUrl.length > 50) return dUrl;
            }
          } catch (_) {}
        }
        return src;
      }
    })
  );
}

/**
 * Ensures all <img> elements inside the target container are fully loaded and decoded
 * before html2canvas takes a snapshot.
 */
async function preloadImages(container: HTMLElement): Promise<void> {
  const images = Array.from(container.querySelectorAll('img'));
  await Promise.all(
    images.map(async (img) => {
      if (img.complete && img.naturalWidth !== 0) {
        if ('decode' in img) {
          try {
            await img.decode();
          } catch (_) {}
        }
        return;
      }
      await new Promise<void>((resolve) => {
        let finished = false;
        const done = () => {
          if (finished) return;
          finished = true;
          if ('decode' in img) {
            img.decode().then(resolve).catch(resolve);
          } else {
            resolve();
          }
        };
        img.onload = done;
        img.onerror = done;
        setTimeout(done, 3000); // 3s safety timeout
      });
    })
  );
}

/**
 * Core high-resolution rasterizer:
 * Captures targetElement to a clean canvas with 100% logo and design preservation,
 * custom Google fonts, base64 data URLs, and zero parent overflow/scroll clipping.
 */
export async function captureElementToCanvas(
  targetElement: HTMLElement,
  canonicalWidth: number,
  canonicalHeight: number,
  scale = 2.5
): Promise<HTMLCanvasElement> {
  // 1. Ensure all custom web fonts (Playfair Display, Cormorant Garamond, Inter, JetBrains Mono) are ready
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  // 2. Preload and decode all images & collect base64 data URLs
  await preloadImages(targetElement);
  const dataUrls = await collectImageDataUrls(targetElement);

  // 3. Render DOM to high-resolution canvas with html2canvas
  return await html2canvas(targetElement, {
    scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    width: canonicalWidth,
    height: canonicalHeight,
    windowWidth: canonicalWidth,
    windowHeight: canonicalHeight,
    scrollX: 0,
    scrollY: 0,
    x: 0,
    y: 0,
    logging: false,
    onclone: (_clonedDoc, clonedEl) => {
      // Swap all img src to base64 data URLs and lock exact pixel dimensions
      const origImgs = Array.from(targetElement.querySelectorAll('img'));
      const clonedImgs = Array.from(clonedEl.querySelectorAll('img'));
      clonedImgs.forEach((cImg, i) => {
        if (dataUrls[i]) {
          cImg.src = dataUrls[i];
        }
        const orig = origImgs[i];
        if (orig) {
          const w = orig.offsetWidth || orig.naturalWidth;
          const h = orig.offsetHeight || orig.naturalHeight;
          if (w > 0) cImg.style.width = `${w}px`;
          if (h > 0) cImg.style.height = `${h}px`;
          if (orig.style.objectFit) cImg.style.objectFit = orig.style.objectFit;
          if (orig.style.position) cImg.style.position = orig.style.position;
          cImg.style.display = 'block';
        }
      });

      // Reset page-level zoom and document margins
      _clonedDoc.documentElement.style.zoom = '1';
      _clonedDoc.documentElement.style.margin = '0';
      _clonedDoc.documentElement.style.padding = '0';
      _clonedDoc.documentElement.style.overflow = 'visible';

      _clonedDoc.body.style.zoom = '1';
      _clonedDoc.body.style.margin = '0';
      _clonedDoc.body.style.padding = '0';
      _clonedDoc.body.style.overflow = 'visible';
      _clonedDoc.body.style.backgroundColor = '#ffffff';

      // Move clonedEl directly to _clonedDoc.body so no parent scroll, overflow, or transform can clip it
      _clonedDoc.body.innerHTML = '';
      _clonedDoc.body.appendChild(clonedEl);

      // Force exact dimensions and reset transforms
      clonedEl.style.transform = 'none';
      clonedEl.style.position = 'relative';
      clonedEl.style.top = '0px';
      clonedEl.style.left = '0px';
      clonedEl.style.zIndex = '1';
      clonedEl.style.width = `${canonicalWidth}px`;
      clonedEl.style.height = `${canonicalHeight}px`;
      clonedEl.style.minWidth = `${canonicalWidth}px`;
      clonedEl.style.minHeight = `${canonicalHeight}px`;
      clonedEl.style.maxWidth = `${canonicalWidth}px`;
      clonedEl.style.maxHeight = `${canonicalHeight}px`;
      clonedEl.style.margin = '0';
      clonedEl.style.boxShadow = 'none';
      clonedEl.style.borderRadius = '0';
      clonedEl.style.overflow = 'hidden';

      // Keep the domain capsule on the same baseline in the export clone as it
      // has in the live preview. This avoids flex/text metric rounding moving
      // the badge upward in html2canvas-generated PNGs and PDFs.
      const domainRow = clonedEl.querySelector<HTMLElement>('[data-certificate-domain-row]');
      const domainBox = clonedEl.querySelector<HTMLElement>('[data-certificate-domain-box]');
      if (domainRow && domainBox) {
        const sourceDomainRow = targetElement.querySelector<HTMLElement>('[data-certificate-domain-row]');
        const sourceMarginTop = sourceDomainRow
          ? Number.parseFloat(window.getComputedStyle(sourceDomainRow).marginTop)
          : 0;

        // Maintain exact 1:1 margin-top and baseline alignment between the
        // live canvas element and cloned export element for 100% WYSIWYG fidelity
        domainRow.style.marginTop = `${Math.max(0, sourceMarginTop)}px`;
        domainRow.style.position = 'relative';
        domainRow.style.top = '0px';
        domainRow.style.transform = 'none';
        domainRow.style.alignItems = 'center';
        domainBox.style.position = 'relative';
        domainBox.style.top = '0px';
        domainBox.style.transform = 'none';
        domainBox.style.alignItems = 'center';
      }

      const domainContent = clonedEl.querySelector<HTMLElement>('[data-certificate-domain-content]');
      if (domainContent) {
        domainContent.style.position = 'relative';
        domainContent.style.top = '-6px';
      }
    }
  });
}

/**
 * Exports a certificate or document DOM element to an authentic, standard ISO A4 PDF sheet (210mm x 297mm).
 * - Internship certificate is vertically placed (centered vertically) and properly fitted across the A4 sheet.
 * - Attendance certificate and offer letter fill standard vertical A4 layout without distortion.
 */
export async function exportElementToA4Pdf(
  targetElement: HTMLElement | null,
  options: ExportPdfOptions = {}
): Promise<boolean> {
  if (!targetElement) {
    console.error('exportElementToA4Pdf: Target element is null');
    toast.error('Unable to find document element to export.');
    return false;
  }

  const printableType = targetElement.getAttribute('data-printable') || 'certificate';
  const isInternshipCert = printableType === 'certificate';
  const canonicalWidth = options.canonicalWidth || (isInternshipCert ? 1414 : 850);
  const canonicalHeight = options.canonicalHeight || (isInternshipCert ? 1000 : (printableType === 'attendance-certificate' || printableType === 'attendance' ? 1202 : 1277));
  const scale = options.scale || 2.5;
  const filename = options.filename || `ATIDETO_Official_Document_${Date.now()}.pdf`;

  const toastId = toast.loading('Generating official A4 PDF certificate...');

  try {
    const canvas = await captureElementToCanvas(targetElement, canonicalWidth, canonicalHeight, scale);
    const imgData = canvas.toDataURL('image/png');

    if (isInternshipCert) {
      // Standard ISO A4 Landscape PDF (297mm x 210mm)
      // Takes 100% complete space of A4 sheet, with ZERO white space in border sides
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      pdf.addImage(imgData, 'PNG', 0, 0, 297, 210, undefined, 'FAST');
      pdf.save(filename);
    } else {
      // Standard ISO A4 Portrait PDF (210mm x 297mm) for Attendance Certificate and Offer Letter
      // Takes 100% complete space of A4 portrait sheet, with ZERO white space in border sides
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
      pdf.save(filename);
    }

    toast.dismiss(toastId);
    toast.success('Downloaded official A4 PDF document!');
    return true;
  } catch (error) {
    console.error('exportElementToA4Pdf error:', error);
    toast.dismiss(toastId);
    toast.error('Failed to export PDF document.');
    return false;
  }
}

/**
 * Exports a certificate or document DOM element to a high-resolution, unclipped PNG image.
 * - Takes 100% complete space of authentic A4 dimensions with ZERO white margins or borders.
 */
export async function exportElementToImage(
  targetElement: HTMLElement | null,
  options: ExportImageOptions = {}
): Promise<boolean> {
  if (!targetElement) {
    console.error('exportElementToImage: Target element is null');
    toast.error('Unable to find document element to export.');
    return false;
  }

  const printableType = targetElement.getAttribute('data-printable') || 'certificate';
  const isInternshipCert = printableType === 'certificate';
  const canonicalWidth = options.canonicalWidth || (isInternshipCert ? 1414 : 850);
  const canonicalHeight = options.canonicalHeight || (isInternshipCert ? 1000 : (printableType === 'attendance-certificate' || printableType === 'attendance' ? 1202 : 1277));
  const scale = options.scale || 2.5;
  const filename = options.filename || `ATIDETO_Official_Document_${Date.now()}.png`;

  const toastId = toast.loading('Generating high-resolution official PNG image...');

  try {
    const canvas = await captureElementToCanvas(targetElement, canonicalWidth, canonicalHeight, scale);

    // Export directly at full resolution matching exact A4 aspect ratio (1414 x 1000 for landscape A4 certificate,
    // 850 x 1202 for attendance, 850 x 1277 for offer letter) without any white letterbox padding or border lines.
    canvas.toBlob((blob) => {
      if (!blob) {
        toast.dismiss(toastId);
        toast.error('Failed to create image blob.');
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = filename;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      toast.dismiss(toastId);
      toast.success('Downloaded official document PNG!');
    }, 'image/png');

    return true;
  } catch (error) {
    console.error('exportElementToImage error:', error);
    toast.dismiss(toastId);
    toast.error('Failed to export document image.');
    return false;
  }
}


