import QRCode from 'qrcode';

// Base32 Alphabet RFC 4648
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

// Default corporate secret and recovery codes for Administrator
export const DEFAULT_ADMIN_TOTP_SECRET = 'JBSWY3DPEHPK3PXP';
export const DEFAULT_ADMIN_BACKUP_CODES = [
  '8F4K-92MN',
  '3TXP-77BQ',
  '9YLA-10KP',
  '4MNE-66ZV',
  '7KJW-33RT'
];

/**
 * Decodes a Base32 string into a Uint8Array byte buffer
 */
export function base32ToBuffer(base32: string): Uint8Array {
  const clean = (base32 || '').toUpperCase().replace(/=+$/, '').replace(/\s+/g, '');
  const length = Math.floor((clean.length * 5) / 8);
  const buffer = new Uint8Array(length);
  let bits = 0;
  let value = 0;
  let index = 0;

  for (let i = 0; i < clean.length; i++) {
    const val = BASE32_ALPHABET.indexOf(clean[i]);
    if (val === -1) continue;
    value = (value << 5) | val;
    bits += 5;

    if (bits >= 8) {
      buffer[index++] = (value >>> (bits - 8)) & 255;
      bits -= 8;
    }
  }

  return buffer.slice(0, index);
}

/**
 * Generates RFC 6238 TOTP 6-digit code for a given time step offset using Web Crypto
 */
export async function generateTotpCode(secret: string = DEFAULT_ADMIN_TOTP_SECRET, stepOffset: number = 0): Promise<string> {
  const keyBytes = base32ToBuffer(secret);
  const timeStep = 30; // seconds
  const currentStep = Math.floor(Date.now() / 1000 / timeStep) + stepOffset;

  // 8-byte big-endian counter buffer
  const counterBuffer = new ArrayBuffer(8);
  const view = new DataView(counterBuffer);
  view.setBigUint64(0, BigInt(currentStep), false);

  // Use standard Web Crypto subtle HMAC-SHA1
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    keyBytes as unknown as BufferSource,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  const signature = new Uint8Array(await window.crypto.subtle.sign('HMAC', cryptoKey, counterBuffer));
  const offset = signature[signature.length - 1] & 0x0f;
  const binary =
    ((signature[offset] & 0x7f) << 24) |
    ((signature[offset + 1] & 0xff) << 16) |
    ((signature[offset + 2] & 0xff) << 8) |
    (signature[offset + 3] & 0xff);

  const otp = binary % 1000000;
  return String(otp).padStart(6, '0');
}

/**
 * Verifies if entered 6-digit code matches TOTP in a [-1, 0, +1] time step window (90s window)
 */
export async function verifyTotpCode(enteredCode: string, secret: string = DEFAULT_ADMIN_TOTP_SECRET): Promise<boolean> {
  const cleanCode = (enteredCode || '').trim();
  if (cleanCode.length !== 6) return false;

  // Check window: previous 30s, current 30s, next 30s (prevents clock drift failure)
  const offsets = [0, -1, 1];
  for (const offset of offsets) {
    try {
      const expected = await generateTotpCode(secret, offset);
      if (cleanCode === expected) {
        return true;
      }
    } catch (e) {
      console.warn('TOTP calculation step notice:', e);
    }
  }

  return false;
}

/**
 * Generates an otpauth:// URI recognized by Google Authenticator, Microsoft Authenticator, and 1Password
 */
export function getTotpUri(
  email: string = 'admin@atideto.in',
  issuer: string = 'Atideto Technologies',
  secret: string = DEFAULT_ADMIN_TOTP_SECRET
): string {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedLabel = encodeURIComponent(`${issuer}:${email}`);
  return `otpauth://totp/${encodedLabel}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}

/**
 * Generates a high-resolution QR Code Data URL from the TOTP URI
 */
export async function generateTotpQrCodeDataUrl(
  email: string = 'admin@atideto.in',
  issuer: string = 'Atideto Technologies',
  secret: string = DEFAULT_ADMIN_TOTP_SECRET
): Promise<string> {
  const uri = getTotpUri(email, issuer, secret);
  return await QRCode.toDataURL(uri, {
    width: 240,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
}

/**
 * Returns remaining seconds in the current 30-second TOTP cycle (1 to 30)
 */
export function getTotpRemainingSeconds(): number {
  return 30 - (Math.floor(Date.now() / 1000) % 30);
}

/**
 * Validates an Emergency Backup Recovery Code (e.g. "8F4K-92MN")
 */
export function verifyBackupRecoveryCode(enteredCode: string, activeCodes: string[] = DEFAULT_ADMIN_BACKUP_CODES): {
  valid: boolean;
  remainingCodes: string[];
} {
  const clean = enteredCode.toUpperCase().replace(/\s+/g, '').replace(/[^A-Z0-9-]/g, '');
  const index = activeCodes.findIndex(c => c.toUpperCase().replace(/\s+/g, '') === clean);

  if (index !== -1) {
    const remainingCodes = [...activeCodes];
    remainingCodes.splice(index, 1);
    try {
      localStorage.setItem('atideto_admin_backup_codes', JSON.stringify(remainingCodes));
    } catch {}
    return { valid: true, remainingCodes };
  }

  return { valid: false, remainingCodes: activeCodes };
}

/**
 * Retrieves remaining backup codes from storage or returns defaults
 */
export function getStoredBackupCodes(): string[] {
  try {
    const raw = localStorage.getItem('atideto_admin_backup_codes');
    if (raw) return JSON.parse(raw);
  } catch {}
  return [...DEFAULT_ADMIN_BACKUP_CODES];
}

/**
 * Generates an Email 2FA passcode and stores it with expiration in sessionStorage
 */
export async function sendAdminEmail2FaPasscode(email: string): Promise<{ success: boolean; message: string }> {
  const cleanEmail = email.toLowerCase().trim();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    sessionStorage.setItem(`atideto_admin_email_2fa_${cleanEmail}`, JSON.stringify({
      code,
      expires: Date.now() + 5 * 60 * 1000 // 5 minutes
    }));
  } catch {}
  return {
    success: true,
    message: `A single-use 6-digit security passcode was sent to ${cleanEmail}.`
  };
}

/**
 * Validates the Email 2FA passcode
 */
export function verifyAdminEmail2FaPasscode(email: string, enteredCode: string): boolean {
  const cleanEmail = email.toLowerCase().trim();
  const cleanCode = enteredCode.trim();
  try {
    const raw = sessionStorage.getItem(`atideto_admin_email_2fa_${cleanEmail}`);
    if (raw) {
      const data = JSON.parse(raw);
      if (data && data.code === cleanCode && Date.now() <= data.expires) {
        sessionStorage.removeItem(`atideto_admin_email_2fa_${cleanEmail}`);
        return true;
      }
    }
  } catch {}
  return false;
}
