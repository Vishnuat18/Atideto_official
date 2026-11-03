import { toast } from 'sonner';

export interface ExportPdfOptions {
  filename?: string;
  orientation?: 'landscape' | 'portrait';
  canonicalWidth?: number;
  canonicalHeight?: number;
  quality?: number; // 0.1 to 1.0 (JPEG quality for PDF output)
  scale?: number;
}

export interface ExportImageOptions {
  filename?: string;
  canonicalWidth?: number;
  canonicalHeight?: number;
  scale?: number;
}

export const DEFAULT_EXPORT_SCALE = 2;
const MAX_CAPTURE_CACHE_ENTRIES = 1;

type Html2CanvasModule = typeof import('html2canvas');
type JsPdfModule = typeof import('jspdf');

let html2canvasModule: Promise<Html2CanvasModule> | null = null;
let jsPdfModule: Promise<JsPdfModule> | null = null;

function loadHtml2Canvas(): Promise<Html2CanvasModule> {
  if (!html2canvasModule) html2canvasModule = import('html2canvas');
  return html2canvasModule;
}

function loadJsPdf(): Promise<JsPdfModule> {
  if (!jsPdfModule) jsPdfModule = import('jspdf');
  return jsPdfModule;
}

/** Data URLs of static assets are content-addressed, so they can be cached for the session. */
const imageDataUrlCache = new Map<string, Promise<string>>();

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string) || '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function imageToDataUrl(src: string): Promise<string> {
  if (src.startsWith('data:')) return Promise.resolve(src);
  const cached = imageDataUrlCache.get(src);
  if (cached) return cached;

  const promise = (async () => {
    try {
      const res = await fetch(src, { mode: 'cors', cache: 'force-cache' });
      if (!res.ok) return src;
      return await blobToDataUrl(await res.blob());
    } catch {
      return src;
    }
  })();

  imageDataUrlCache.set(src, promise);
  return promise;
}

/**
 * Loads/decodes every <img> in the container and resolves their data URLs in
 * a single pass, then returns them in DOM order for the html2canvas clone.
 */
async function prepareImageDataUrls(container: HTMLElement): Promise<string[]> {
  const images = Array.from(container.querySelectorAll('img'));

  return await Promise.all(
    images.map(async (img) => {
      const src = img.currentSrc || img.src;
      if (!src) return '';

      if (!img.complete || img.naturalWidth === 0) {
        await new Promise<void>((resolve) => {
          let finished = false;
          const done = () => {
            if (finished) return;
            finished = true;
            resolve();
          };
          img.addEventListener('load', done, { once: true });
          img.addEventListener('error', done, { once: true });
          setTimeout(done, 4000);
        });
      }

      try {
        await img.decode();
      } catch {
        /* decode can reject for SVG/background images; ignore */
      }

      return imageToDataUrl(src);
    })
  );
}

function hashString(value: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

interface CaptureCacheEntry {
  key: string;
  canvas: HTMLCanvasElement;
}

const captureCache: CaptureCacheEntry[] = [];

function captureKey(
  element: HTMLElement,
  width: number,
  height: number,
  scale: number
): string {
  return [
    element.id || 'document',
    element.getAttribute('data-printable') || 'unknown',
    `${width}x${height}`,
    `s${scale}`,
    hashString(element.innerHTML)
  ].join('|');
}

function readCaptureCache(key: string): HTMLCanvasElement | null {
  const index = captureCache.findIndex((entry) => entry.key === key);
  if (index === -1) return null;
  const [entry] = captureCache.splice(index, 1);
  captureCache.unshift(entry);
  return entry.canvas;
}

function writeCaptureCache(key: string, canvas: HTMLCanvasElement): void {
  const existing = captureCache.findIndex((entry) => entry.key === key);
  if (existing !== -1) captureCache.splice(existing, 1);
  captureCache.unshift({ key, canvas });
  if (captureCache.length > MAX_CAPTURE_CACHE_ENTRIES) captureCache.length = MAX_CAPTURE_CACHE_ENTRIES;
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
  scale = DEFAULT_EXPORT_SCALE
): Promise<HTMLCanvasElement> {
  const key = captureKey(targetElement, canonicalWidth, canonicalHeight, scale);
  const cached = readCaptureCache(key);
  if (cached) return cached;

  // 1. Ensure all custom web fonts (Playfair Display, Cormorant Garamond, Inter, JetBrains Mono) are ready
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  // 2. Preload/decode images and collect data URLs in one pass
  const dataUrls = await prepareImageDataUrls(targetElement);

  // 3. Render DOM to high-resolution canvas with html2canvas (loaded on demand)
  const { default: html2canvas } = await loadHtml2Canvas();
  const canvas = await html2canvas(targetElement, {
    scale,
    useCORS: true,
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
    imageTimeout: 15000,
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

  writeCaptureCache(key, canvas);
  return canvas;
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error(`Failed to encode canvas as ${type}`));
      },
      type,
      quality
    );
  });
}

function resolveCanonicalSize(
  targetElement: HTMLElement,
  options: { canonicalWidth?: number; canonicalHeight?: number }
): { canonicalWidth: number; canonicalHeight: number; isInternshipCert: boolean; printableType: string } {
  const printableType = targetElement.getAttribute('data-printable') || 'certificate';
  const isInternshipCert = printableType === 'certificate';
  const canonicalWidth = options.canonicalWidth || (isInternshipCert ? 1414 : 850);
  const canonicalHeight =
    options.canonicalHeight ||
    (isInternshipCert
      ? 1000
      : printableType === 'attendance-certificate' || printableType === 'attendance'
      ? 1202
      : 1277);
  return { canonicalWidth, canonicalHeight, isInternshipCert, printableType };
}

/**
 * Rasterizes the target element and returns the PDF as a Blob (no download/toast).
 * Used by batch ZIP exports so many documents can be generated quietly.
 */
export async function renderElementToPdfBlob(
  targetElement: HTMLElement,
  options: ExportPdfOptions = {}
): Promise<Blob> {
  const { canonicalWidth, canonicalHeight, isInternshipCert } = resolveCanonicalSize(
    targetElement,
    options
  );
  const scale = options.scale || DEFAULT_EXPORT_SCALE;
  const quality = options.quality ?? 0.92;

  const canvas = await captureElementToCanvas(targetElement, canonicalWidth, canonicalHeight, scale);
  const imageBlob = await canvasToBlob(canvas, 'image/jpeg', quality);
  const imgData = await blobToDataUrl(imageBlob);

  const { jsPDF } = await loadJsPdf();
  const pdf = isInternshipCert
    ? new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true })
    : new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });

  if (isInternshipCert) {
    pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
  } else {
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
  }

  return pdf.output('blob');
}

/**
 * Rasterizes the target element and returns the PNG as a Blob (no download/toast).
 * Used by batch ZIP exports so many documents can be generated quietly.
 */
export async function renderElementToPngBlob(
  targetElement: HTMLElement,
  options: ExportImageOptions = {}
): Promise<Blob> {
  const { canonicalWidth, canonicalHeight } = resolveCanonicalSize(targetElement, options);
  const scale = options.scale || DEFAULT_EXPORT_SCALE;
  const canvas = await captureElementToCanvas(targetElement, canonicalWidth, canonicalHeight, scale);
  return canvasToBlob(canvas, 'image/png');
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
  const scale = options.scale || DEFAULT_EXPORT_SCALE;
  const quality = options.quality ?? 0.92;
  const filename = options.filename || `ATIDETO_Official_Document_${Date.now()}.pdf`;

  const toastId = toast.loading('Generating official A4 PDF certificate...');

  try {
    const canvas = await captureElementToCanvas(targetElement, canonicalWidth, canonicalHeight, scale);
    // JPEG keeps the PDF 5-10x smaller than PNG and encodes faster; the documents
    // are fully opaque so there is no transparency to preserve.
    const blob = await canvasToBlob(canvas, 'image/jpeg', quality);
    const imgData = await blobToDataUrl(blob);

    const { jsPDF } = await loadJsPdf();
    if (isInternshipCert) {
      // Standard ISO A4 Landscape PDF (297mm x 210mm)
      // Takes 100% complete space of A4 sheet, with ZERO white space in border sides
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
      pdf.save(filename);
    } else {
      // Standard ISO A4 Portrait PDF (210mm x 297mm) for Attendance Certificate and Offer Letter
      // Takes 100% complete space of A4 portrait sheet, with ZERO white space in border sides
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
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
  const scale = options.scale || DEFAULT_EXPORT_SCALE;
  const filename = options.filename || `ATIDETO_Official_Document_${Date.now()}.png`;

  const toastId = toast.loading('Generating high-resolution official PNG image...');

  try {
    const canvas = await captureElementToCanvas(targetElement, canonicalWidth, canonicalHeight, scale);

    // Export directly at full resolution matching exact A4 aspect ratio (1414 x 1000 for landscape A4 certificate,
    // 850 x 1202 for attendance, 850 x 1277 for offer letter) without any white letterbox padding or border lines.
    const blob = await canvasToBlob(canvas, 'image/png');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Give the browser time to start the download before releasing the blob.
    setTimeout(() => URL.revokeObjectURL(url), 1500);

    toast.dismiss(toastId);
    toast.success('Downloaded official document PNG!');
    return true;
  } catch (error) {
    console.error('exportElementToImage error:', error);
    toast.dismiss(toastId);
    toast.error('Failed to export document image.');
    return false;
  }
}
