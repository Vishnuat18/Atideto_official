import background1 from '@/assets/certificates/background1.webp';
import background2 from '@/assets/certificates/background2.webp';
import background from '@/assets/certificates/background.webp';
import atidetoLogo from '@/assets/certificates/atideto-logo.webp';
import atidetoSeal from '@/assets/certificates/atideto-seal.webp';
import zyrflowSeal from '@/assets/certificates/zyrflow-seal.webp';
import msmeLogo from '@/assets/certificates/msme-logo.webp';
import startupIndia from '@/assets/certificates/startup-india.webp';

const CERTIFICATE_ASSETS = [
  background1,
  background2,
  background,
  atidetoLogo,
  atidetoSeal,
  zyrflowSeal,
  msmeLogo,
  startupIndia
];

let preloadPromise: Promise<void> | null = null;

/**
 * Warms the HTTP cache for the certificate artwork as soon as the certificates
 * view is opened, so the first preview/export does not wait on ~300 KB of images.
 */
export function preloadCertificateAssets(): Promise<void> {
  if (preloadPromise) return preloadPromise;

  preloadPromise = Promise.all(
    CERTIFICATE_ASSETS.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.decoding = 'async';
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        })
    )
  ).then(() => undefined);

  return preloadPromise;
}
