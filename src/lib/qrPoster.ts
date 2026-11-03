// Branded QR poster renderer. Produces a shareable PNG that can be printed and
// put up in a college — company name on top, QR in the middle, college name and
// registration link below.

export interface QrPosterOptions {
  companyName?: string;
  collegeName: string;
  url: string;
  qrDataUrl: string;
  label?: string;
  amount?: number;
}

export async function createQrDataUrl(text: string, size = 720): Promise<string> {
  const mod: any = await import('qrcode');
  const QRCode = mod?.default || mod;
  return QRCode.toDataURL(text, {
    width: size,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: { dark: '#0B1220', light: '#FFFFFF' }
  });
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const lines: string[] = [];
  let line = words[0];
  for (let i = 1; i < words.length; i += 1) {
    const candidate = `${line} ${words[i]}`;
    if (ctx.measureText(candidate).width <= maxWidth) line = candidate;
    else {
      lines.push(line);
      line = words[i];
    }
  }
  lines.push(line);
  return lines;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function buildQrPosterDataUrl(options: QrPosterOptions): Promise<string> {
  const companyName = (options.companyName || 'Atideto Technologies').trim();
  const collegeName = (options.collegeName || '').trim();
  const cleanUrl = options.url.replace(/^https?:\/\//, '');

  const W = 1000;
  const H = 1360;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Unable to create poster canvas');

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, W, H);

  // Top brand band
  const band = ctx.createLinearGradient(0, 0, W, 340);
  band.addColorStop(0, '#0B1220');
  band.addColorStop(1, '#1E3A8A');
  ctx.fillStyle = band;
  ctx.fillRect(0, 0, W, 340);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 50px Inter, "Segoe UI", Arial, sans-serif';
  ctx.fillText(companyName, W / 2, 120);

  ctx.fillStyle = '#93C5FD';
  ctx.font = '600 22px Inter, "Segoe UI", Arial, sans-serif';
  ctx.fillText('INTERNSHIP REGISTRATION', W / 2, 190);

  if (options.label) {
    ctx.fillStyle = 'rgba(255,255,255,0.14)';
    roundedRect(ctx, W / 2 - 210, 230, 420, 56, 28);
    ctx.fill();
    ctx.fillStyle = '#DBEAFE';
    ctx.font = '600 22px Inter, "Segoe UI", Arial, sans-serif';
    const labelLines = wrapText(ctx, options.label, 380);
    ctx.fillText(labelLines[0] || '', W / 2, 259);
  }

  const amountValue = Number(options.amount);
  if (Number.isFinite(amountValue) && amountValue > 0) {
    ctx.fillStyle = '#BBF7D0';
    ctx.font = '700 24px Inter, "Segoe UI", Arial, sans-serif';
    ctx.fillText(`Internship Fee: ₹${amountValue.toLocaleString('en-IN')}`, W / 2, 315);
  }

  // QR card with soft shadow
  const cardX = 150;
  const cardY = 380;
  const cardW = 700;
  const cardH = 640;
  ctx.save();
  ctx.shadowColor = 'rgba(15, 23, 42, 0.18)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 18;
  ctx.fillStyle = '#FFFFFF';
  roundedRect(ctx, cardX, cardY, cardW, cardH, 36);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2;
  roundedRect(ctx, cardX, cardY, cardW, cardH, 36);
  ctx.stroke();

  const qrImg = await loadImage(options.qrDataUrl);
  const qrSize = 560;
  ctx.drawImage(qrImg, (W - qrSize) / 2, cardY + (cardH - qrSize) / 2, qrSize, qrSize);

  // College name
  ctx.fillStyle = '#0F172A';
  ctx.font = '800 42px Inter, "Segoe UI", Arial, sans-serif';
  const collegeLines = wrapText(ctx, collegeName, 840).slice(0, 2);
  let y = 1080;
  collegeLines.forEach((line) => {
    ctx.fillText(line, W / 2, y);
    y += 50;
  });

  // Instruction + link
  ctx.fillStyle = '#475569';
  ctx.font = '500 26px Inter, "Segoe UI", Arial, sans-serif';
  ctx.fillText('Scan to fill your internship application', W / 2, y + 6);
  y += 54;

  ctx.fillStyle = '#0066FF';
  ctx.font = '600 24px Inter, "Segoe UI", Arial, sans-serif';
  const urlLines = wrapText(ctx, cleanUrl, 860).slice(0, 2);
  urlLines.forEach((line) => {
    ctx.fillText(line, W / 2, y + 6);
    y += 34;
  });

  // Footer
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(220, H - 64);
  ctx.lineTo(W - 220, H - 64);
  ctx.stroke();

  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 20px Inter, "Segoe UI", Arial, sans-serif';
  ctx.fillText('atideto.in  •  Verified Internship Program', W / 2, H - 30);

  return canvas.toDataURL('image/png');
}

export function sanitizeFileSegment(value: string): string {
  return String(value || '')
    .replace(/[^a-zA-Z0-9-_ ]+/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60) || 'qr-poster';
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
