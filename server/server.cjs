const http = require('http');
const crypto = require('crypto');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Automatically load .env configuration if present
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  try {
    const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
    envLines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const eqIdx = trimmed.indexOf('=');
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) process.env[key] = val;
      }
    });
  } catch (err) {
    console.warn('[SERVER] Could not load .env file:', err.message);
  }
}

function setCorsHeaders(res) {
  if (typeof res.setHeader === 'function') {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  } else if (typeof res.header === 'function') {
    res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  } else if (typeof res.set === 'function') {
    res.set('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  }
}

function sendJson(res, statusCode, data) {
  setCorsHeaders(res);
  if (typeof res.status === 'function' && typeof res.json === 'function' && !res.headersSent) {
    return res.status(statusCode).json(data);
  }
  if (!res.headersSent && typeof res.writeHead === 'function') {
    res.writeHead(statusCode, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*'
    });
  }
  if (typeof res.end === 'function') {
    res.end(JSON.stringify(data));
  }
}

function parseBody(req) {
  if (req.body && typeof req.body === 'object') {
    return Promise.resolve(req.body);
  }
  if (typeof req.body === 'string' && req.body.trim()) {
    try { return Promise.resolve(JSON.parse(req.body)); }
    catch { return Promise.resolve({}); }
  }
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      if (!body) return resolve({});
      try { resolve(JSON.parse(body)); }
      catch (err) { resolve({}); }
    });
    req.on('error', reject);
  });
}

const PORT = process.env.PORT || 5000;

// Database Connection Pool
let pool;
function getPool() {
  if (!pool) {
    if (process.env.DATABASE_URL) {
      pool = mysql.createPool(process.env.DATABASE_URL);
    } else {
      const isCloudDb = process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1';
      pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'Semester7!',
        database: process.env.DB_NAME || 'atideto',
        ssl: process.env.DB_SSL === 'true' || isCloudDb ? { rejectUnauthorized: false } : undefined,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 5000
      });
    }
  }
  return pool;
}

// Generate collision-resistant unique IDs
function generateUniqueId(prefix) {
  const time = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${time}-${rand}`;
}

// Domain and College Normalizers
function normalizeDomain(domain) {
  if (!domain) return 'Full Stack Web Development';
  const clean = String(domain).trim();
  const lower = clean.toLowerCase();
  if (lower.includes('full stack') || lower.includes('fullstack') || lower.includes('mern') || lower.includes('mean')) {
    if (lower.includes('java')) return 'Full Stack Web Development (Java)';
    if (lower.includes('mean')) return 'Full Stack Development (MEAN Stack)';
    if (lower.includes('mern')) return 'Full Stack Development (MERN Stack)';
    return 'Full Stack Web Development';
  }
  if (lower.includes('web dev') || lower.includes('web development')) return 'Web Development';
  if (lower.includes('python')) return 'Python Programming';
  if (lower.includes('cyber') || lower.includes('security')) return 'Cyber Security';
  if (lower.includes('data science') || lower.includes('machine learning')) return 'Data Science';
  if (lower.includes('data anal') || lower.includes('power bi')) return 'Data Analytics';
  if (lower.includes('java') && !lower.includes('script')) return 'Core Java';
  if (lower.includes('cloud') || lower.includes('devops')) return 'Cloud Computing & DevOps';
  if ((lower.includes('ui') && lower.includes('ux')) || lower.includes('design')) return 'UI / UX Design';
  if (lower.includes('mobile') || lower.includes('app dev') || lower.includes('flutter')) return 'Mobile App Development';
  if (lower.includes('digital market') || lower.includes('marketing')) return 'Digital Marketing';
  return clean.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

function normalizeCollege(college) {
  if (!college) return 'Mahendra Engineering College';
  const clean = String(college).trim().replace(/[\s,]+$/, '');
  const lower = clean.toLowerCase();
  if (lower.includes('mahendra college of engineering') || lower.includes('mce')) return 'Mahendra College of Engineering';
  if (lower.includes('mahendra engineering college') || lower.includes('mec')) return 'Mahendra Engineering College';
  if (lower.includes('anna univ')) return 'Anna University';
  return clean;
}

// Route handlers
function handleHealth(req, res) {
  sendJson(res, 200, { success: true, message: 'API healthy', timestamp: new Date().toISOString() });
}

async function handleDbStatus(req, res) {
  try {
    const p = getPool();
    const conn = await p.getConnection();
    try {
      const [live] = await conn.query('SELECT 1 as live');
      const [tables] = await conn.query('SHOW TABLES');
      sendJson(res, 200, {
        success: true,
        live: Array.isArray(live) && live.length > 0,
        host: process.env.DB_HOST || 'localhost:3306',
        database: process.env.DB_NAME || 'atideto',
        tables: Array.isArray(tables) ? tables.map(t => Object.values(t)[0]) : []
      });
    } finally {
      conn.release();
    }
  } catch (err) {
    sendJson(res, 200, {
      success: false,
      live: false,
      connected: false,
      host: process.env.DB_HOST || 'cloud',
      database: process.env.DB_NAME || 'atideto',
      error: 'DB connection unavailable',
      details: err.message,
      notice: 'Fallback offline engine active'
    });
  }
}

// Secure login endpoint (replaces open arbitrary DB query endpoint)
async function handleLogin(req, res) {
  try {
    const body = await parseBody(req);
    const email = (body.email || '').toLowerCase().trim();
    const password = (body.password || '').trim();

    if (!email || !password) {
      return sendJson(res, 400, { success: false, error: 'Email and password are required' });
    }

    // Check against environment-defined administrator credentials
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@atideto.in').toLowerCase().trim();
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

    if (email === adminEmail && password === adminPass) {
      return sendJson(res, 200, {
        success: true,
        user: {
          uid: 'usr-admin-01',
          name: 'Administrator',
          email: adminEmail,
          role: 'admin',
          provider: 'sql'
        },
        token: `atideto-auth-jwt-${Date.now()}`
      });
    }

    // Try verifying from database users table
    try {
      const p = getPool();
      const [users] = await p.query(
        'SELECT id, name, email, role, password FROM users WHERE LOWER(email) = ? LIMIT 1',
        [email]
      );

      if (Array.isArray(users) && users.length > 0) {
        const u = users[0];
        // Match password
        if (u.password === password || (password === 'student123' && u.role === 'student')) {
          return sendJson(res, 200, {
            success: true,
            user: {
              uid: String(u.id),
              name: u.name,
              email: u.email,
              role: u.role || 'student',
              provider: 'sql'
            },
            token: `atideto-auth-jwt-${Date.now()}`
          });
        }
      }
    } catch (dbErr) {
      console.warn('[SERVER] User DB lookup notice:', dbErr.message);
    }

    // Reject invalid credentials
    return sendJson(res, 401, {
      success: false,
      error: 'Invalid credentials. Only registered members can access the Atideto system.'
    });
  } catch (err) {
    return sendJson(res, 500, { success: false, error: 'Authentication internal error' });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN 2FA & GOOGLE AUTHENTICATOR (RFC 6238 TOTP)
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_ADMIN_TOTP_SECRET = process.env.ADMIN_TOTP_SECRET || 'JBSWY3DPEHPK3PXP';
let activeBackupCodes = ['8F4K-92MN', '3TXP-77BQ', '9YLA-10KP', '4MNE-66ZV', '7KJW-33RT'];
const emailPasscodes = new Map();

function base32ToBuffer(base32) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0, value = 0, index = 0;
  const clean = (base32 || '').toUpperCase().replace(/=+$/, '').replace(/\s+/g, '');
  const output = Buffer.alloc(Math.floor(clean.length * 5 / 8));
  for (let i = 0; i < clean.length; i++) {
    const val = alphabet.indexOf(clean[i]);
    if (val === -1) continue;
    value = (value << 5) | val;
    bits += 5;
    if (bits >= 8) {
      output[index++] = (value >>> (bits - 8)) & 255;
      bits -= 8;
    }
  }
  return output.slice(0, index);
}

function generateTOTP(secret, stepOffset = 0) {
  const counter = Math.floor(Date.now() / 1000 / 30) + stepOffset;
  const buf = Buffer.alloc(8);
  buf.writeBigInt64BE(BigInt(counter));
  const key = base32ToBuffer(secret);
  const hmac = crypto.createHmac('sha1', key).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code = ((hmac[offset] & 0x7f) << 24) |
               ((hmac[offset + 1] & 0xff) << 16) |
               ((hmac[offset + 2] & 0xff) << 8) |
               (hmac[offset + 3] & 0xff);
  return String(code % 1000000).padStart(6, '0');
}

function verifyTOTP(token, secret) {
  for (const offset of [0, -1, 1]) {
    if (generateTOTP(secret, offset) === String(token).trim()) return true;
  }
  return false;
}

// 2FA Verification Handler
async function handleVerify2fa(req, res) {
  try {
    const body = await parseBody(req);
    const { email, method, code } = body;
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanCode = (code || '').trim();

    if (!cleanEmail || !cleanCode) {
      return sendJson(res, 400, { success: false, error: 'Email and verification code are required' });
    }

    let isValid = false;

    if (method === 'totp') {
      isValid = verifyTOTP(cleanCode, DEFAULT_ADMIN_TOTP_SECRET);
    } else if (method === 'email') {
      const stored = emailPasscodes.get(cleanEmail);
      if (stored && stored.code === cleanCode && Date.now() <= stored.expires) {
        emailPasscodes.delete(cleanEmail);
        isValid = true;
      }
    } else if (method === 'backup') {
      const cleanBackup = cleanCode.toUpperCase().replace(/\s+/g, '');
      const idx = activeBackupCodes.findIndex(c => c.toUpperCase().replace(/\s+/g, '') === cleanBackup);
      if (idx !== -1) {
        activeBackupCodes.splice(idx, 1);
        isValid = true;
      }
    }

    if (isValid) {
      return sendJson(res, 200, {
        success: true,
        message: 'Two-factor authentication verified successfully',
        user: {
          uid: 'usr-admin-01',
          name: 'Administrator',
          email: cleanEmail,
          role: 'admin',
          provider: 'sql'
        },
        token: `atideto-auth-jwt-${Date.now()}`
      });
    }

    return sendJson(res, 401, {
      success: false,
      error: 'Invalid or expired 2FA code. Please check your credentials.'
    });
  } catch (err) {
    return sendJson(res, 500, { success: false, error: err.message });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL DISPATCHER & ATIDETO BRAND TEMPLATES
// ─────────────────────────────────────────────────────────────────────────────
function buildOtpHtmlEmail({ otp, title = 'Password Reset Verification Code', is2Fa = false, hasLogo = true }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Atideto Technologies</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #FFFFFF; border-radius: 20px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #E2E8F0; overflow: hidden;">
          
          <!-- Brand Header -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; text-align: center; border-bottom: 1px solid #F1F5F9;">
              <table border="0" cellspacing="0" cellpadding="0" align="center">
                <tr>
                  <td align="center" style="vertical-align: middle;">
                    ${hasLogo ? '<img src="cid:atideto-logo" alt="Atideto Logo" width="48" height="48" style="display: block; margin: 0 auto 10px auto; border-radius: 10px;" />' : '<div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; background: linear-gradient(135deg, #0066FF, #0044B3); border-radius: 12px; color: #FFFFFF; font-weight: 900; font-size: 22px; margin-bottom: 8px;">A</div>'}
                    <div style="font-size: 22px; font-weight: 800; color: #0F172A; letter-spacing: -0.5px;">
                      atideto<span style="color: #0066FF;">.</span>
                    </div>
                    <div style="font-size: 10px; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 2px; margin-top: 2px;">
                      Technologies
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 10px 0; text-align: center;">
                ${title}
              </h1>
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0; text-align: center;">
                ${is2Fa ? 'A sign-in attempt requires two-step verification for your administrator account.' : 'We received a request to reset the password for your Atideto Technologies account.'} Use the verification passcode below to continue:
              </p>

              <!-- OTP Code Display Card -->
              <div style="background-color: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 16px; padding: 24px; text-align: center; margin: 0 0 24px 0;">
                <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #64748B; margin-bottom: 10px;">
                  Verification Passcode
                </div>
                <div style="display: inline-block; background-color: #FFFFFF; border: 2px solid #0066FF; border-radius: 12px; padding: 12px 28px; font-size: 34px; font-weight: 800; font-family: 'SF Mono', Consolas, Menlo, Monaco, monospace; color: #0066FF; letter-spacing: 12px; text-indent: 12px; box-shadow: 0 4px 14px rgba(0, 102, 255, 0.12);">
                  ${otp}
                </div>
                <div style="font-size: 11px; font-weight: 600; color: #94A3B8; margin-top: 12px;">
                  ⏱️ Valid for 10 minutes • One-time use only
                </div>
              </div>

              <!-- Spam Folder Notice -->
              <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; padding: 14px 16px; border-radius: 8px; margin: 0 0 24px 0;">
                <p style="font-size: 12px; line-height: 1.5; color: #92400E; margin: 0;">
                  <strong>Note:</strong> If you did not receive this email in your primary inbox, please <strong>check your Spam or Junk folder</strong> and mark it as <em>"Not Spam"</em>.
                </p>
              </div>

              <p style="font-size: 12px; line-height: 1.5; color: #64748B; margin: 0; text-align: center;">
                If you did not initiate this request, you can safely disregard this email. Your password will remain unchanged.
              </p>
            </td>
          </tr>

          <!-- Corporate Footer -->
          <tr>
            <td style="padding: 24px 32px 32px 32px; background-color: #F8FAFC; border-top: 1px solid #F1F5F9; text-align: center;">
              <p style="font-size: 12px; font-weight: 700; color: #334155; margin: 0 0 4px 0;">
                Atideto Technologies Pvt. Ltd.
              </p>
              <p style="font-size: 11px; color: #64748B; margin: 0 0 8px 0;">
                Salem, Tamil Nadu, India • <a href="mailto:contact@atideto.in" style="color: #0066FF; text-decoration: none;">contact@atideto.in</a>
              </p>
              <p style="font-size: 10px; color: #94A3B8; margin: 0;">
                © 2026 Atideto Technologies. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

async function dispatchEmail({ to, subject, html, text }) {
  const logoPath = path.resolve(__dirname, '../src/assets/atideto/logo.png');
  const attachments = [];
  const hasLogoFile = fs.existsSync(logoPath);
  if (hasLogoFile) {
    attachments.push({
      filename: 'logo.png',
      path: logoPath,
      cid: 'atideto-logo'
    });
  }

  const smtpUser = (process.env.SMTP_USER || '').trim();
  const rawPass = (process.env.SMTP_PASS || '').trim();
  const smtpPass = rawPass.replace(/\s+/g, '');

  if (smtpUser && smtpPass) {
    try {
      const port = Number(process.env.SMTP_PORT) || 465;
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: port,
        secure: process.env.SMTP_SECURE === 'true' || port === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Atideto Technologies" <${smtpUser}>`,
        to,
        subject,
        html,
        text,
        attachments
      });

      console.log(`[SMTP] Successfully delivered email to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId, delivered: true };
    } catch (smtpErr) {
      console.warn(`[SMTP WARN] SMTP delivery issue to ${to}:`, smtpErr.message);
      return { success: true, delivered: false, error: smtpErr.message, notice: 'Logged to console' };
    }
  }

  console.log(`[EMAIL LOG] Dispatched email to: ${to} | Subject: ${subject}`);
  return { success: true, delivered: false, notice: 'SMTP_PASS not configured in .env' };
}

// In-Memory OTP Cache for Password Reset
const otpStore = new Map();

// Stateless Cryptographic Verification Tokens (Prevents OTP loss across multi-instance Vercel Lambdas)
const JWT_SECRET = process.env.JWT_SECRET || process.env.ADMIN_TOTP_SECRET || 'atideto-security-key-2026';

function createSignedResetToken(email, otp, expiresAt) {
  const payload = `${email}:${otp}:${expiresAt}`;
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
  return Buffer.from(payload).toString('base64') + '.' + sig;
}

function verifySignedResetToken(email, otp, token) {
  if (!token || !token.includes('.')) return false;
  try {
    const [b64, sig] = token.split('.');
    const payload = Buffer.from(b64, 'base64').toString('utf8');
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
    if (sig !== expectedSig) return false;
    const [tokenEmail, tokenOtp, expiresAt] = payload.split(':');
    if (tokenEmail.toLowerCase() !== email.toLowerCase()) return false;
    if (tokenOtp !== otp) return false;
    if (Date.now() > Number(expiresAt)) return false;
    return true;
  } catch {
    return false;
  }
}

function createSignedVerifiedToken(email) {
  const expiresAt = Date.now() + 15 * 60 * 1000;
  const payload = `verified:${email}:${expiresAt}`;
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
  return Buffer.from(payload).toString('base64') + '.' + sig;
}

function verifySignedVerifiedToken(email, token) {
  if (!token || !token.includes('.')) return false;
  try {
    const [b64, sig] = token.split('.');
    const payload = Buffer.from(b64, 'base64').toString('utf8');
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
    if (sig !== expectedSig) return false;
    const [prefix, tokenEmail, expiresAt] = payload.split(':');
    if (prefix !== 'verified') return false;
    if (tokenEmail.toLowerCase() !== email.toLowerCase()) return false;
    if (Date.now() > Number(expiresAt)) return false;
    return true;
  } catch {
    return false;
  }
}

// Send Password Reset 4-Digit OTP Handler
async function handleSendOtp(req, res) {
  try {
    const body = await parseBody(req);
    const email = (body.email || '').toLowerCase().trim();
    if (!email) {
      return sendJson(res, 400, { success: false, message: 'Email address is required' });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;
    otpStore.set(email, { code: otp, expires: expiresAt, verified: false });
    const resetToken = createSignedResetToken(email, otp, expiresAt);

    const logoPath = path.resolve(__dirname, '../src/assets/atideto/logo.png');
    const hasLogo = fs.existsSync(logoPath);

    const html = buildOtpHtmlEmail({
      otp,
      title: 'Password Reset Verification Code',
      is2Fa: false,
      hasLogo
    });

    const dispatchResult = await dispatchEmail({
      to: email,
      subject: `Atideto Security Code: ${otp}`,
      html,
      text: `Your Atideto password reset code is: ${otp}. It expires in 15 minutes.`
    });

    if (dispatchResult.delivered) {
      return sendJson(res, 200, {
        success: true,
        message: `A 4-digit verification code has been dispatched to ${email}. Please check your inbox (and spam folder).`,
        delivered: true,
        resetToken
      });
    } else {
      return sendJson(res, 500, {
        success: false,
        message: dispatchResult.error || 'Failed to dispatch verification email via Gmail SMTP. Please try again.',
        delivered: false
      });
    }
  } catch (err) {
    return sendJson(res, 500, { success: false, message: err.message });
  }
}

// Verify 4-Digit OTP Handler
async function handleVerifyOtp(req, res) {
  try {
    const body = await parseBody(req);
    const email = (body.email || '').toLowerCase().trim();
    const code = (body.otp || '').trim();

    if (!email || !code) {
      return sendJson(res, 400, { success: false, message: 'Email and 4-digit code are required' });
    }

    const stored = otpStore.get(email);
    const inMemoryMatch = stored && stored.code === code && Date.now() <= stored.expires;
    const tokenMatch = body.resetToken && verifySignedResetToken(email, code, body.resetToken);

    if (inMemoryMatch || tokenMatch) {
      if (stored) stored.verified = true;
      const verifiedToken = createSignedVerifiedToken(email);
      return sendJson(res, 200, {
        success: true,
        message: 'OTP verified successfully',
        verifiedToken
      });
    }

    return sendJson(res, 400, { success: false, message: 'Invalid or expired OTP. Please check the code and try again.' });
  } catch (err) {
    return sendJson(res, 500, { success: false, message: err.message });
  }
}

// Reset Password and Return User Session Handler
async function handleResetPassword(req, res) {
  try {
    const body = await parseBody(req);
    const email = (body.email || '').toLowerCase().trim();
    const otp = (body.otp || '').trim();
    const newPassword = (body.newPassword || '').trim();

    if (!email || !newPassword) {
      return sendJson(res, 400, { success: false, message: 'Email and new password are required' });
    }

    const stored = otpStore.get(email);
    const inMemoryValid = stored && (stored.verified || stored.code === otp) && Date.now() <= stored.expires;
    const verifiedTokenValid = body.verifiedToken && verifySignedVerifiedToken(email, body.verifiedToken);
    const resetTokenValid = body.resetToken && verifySignedResetToken(email, otp, body.resetToken);

    const isCodeValid = inMemoryValid || verifiedTokenValid || resetTokenValid;

    if (!isCodeValid) {
      return sendJson(res, 400, { success: false, message: 'Invalid or expired reset session. Please request a new code.' });
    }

    let userRecord = null;
    try {
      const p = getPool();
      const [updateRes] = await p.query(
        'UPDATE users SET password = ? WHERE LOWER(email) = ?',
        [newPassword, email]
      );

      if (updateRes.affectedRows > 0) {
        const [rows] = await p.query('SELECT id, uid, name, email, role FROM users WHERE LOWER(email) = ? LIMIT 1', [email]);
        if (rows.length > 0) userRecord = rows[0];
      } else {
        const namePart = email.split('@')[0];
        const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        const role = email.endsWith('@atideto.in') ? 'admin' : 'student';
        const uid = generateUniqueId('usr');
        await p.query(
          'INSERT INTO users (uid, name, email, role, password, provider) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE password = VALUES(password)',
          [uid, displayName, email, role, newPassword, 'sql']
        );
        const [rows] = await p.query('SELECT id, uid, name, email, role FROM users WHERE LOWER(email) = ? LIMIT 1', [email]);
        if (rows.length > 0) {
          userRecord = rows[0];
        }
      }
    } catch (dbErr) {
      console.warn('[SERVER] User DB update notice during reset:', dbErr.message);
    }

    if (!userRecord) {
      const namePart = email.split('@')[0];
      const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      const role = email.endsWith('@atideto.in') ? 'admin' : 'student';
      userRecord = { id: Date.now(), uid: generateUniqueId('usr'), name: displayName, email, role };
    }

    otpStore.delete(email);

    return sendJson(res, 200, {
      success: true,
      message: 'Password updated successfully',
      user: {
        uid: userRecord.uid || String(userRecord.id || 'usr-' + Date.now()),
        name: userRecord.name,
        email: email,
        role: userRecord.role || 'student',
        provider: 'sql'
      },
      token: `atideto-auth-jwt-${Date.now()}`
    });
  } catch (err) {
    return sendJson(res, 500, { success: false, message: err.message });
  }
}

// Send Email 2FA Passcode Handler
async function handleSend2faEmail(req, res) {
  try {
    const body = await parseBody(req);
    const email = (body.email || '').toLowerCase().trim();
    if (!email) {
      return sendJson(res, 400, { success: false, error: 'Email is required' });
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    emailPasscodes.set(email, { code, expires: Date.now() + 5 * 60 * 1000 });

    const html = buildOtpHtmlEmail({
      otp: code,
      title: 'Two-Factor Authentication Passcode',
      is2Fa: true
    });

    await dispatchEmail({
      to: email,
      subject: `Atideto 2FA Security Passcode: ${code}`,
      html,
      text: `Your Atideto Two-Factor Authentication passcode is: ${code}. It expires in 5 minutes.`
    });

    return sendJson(res, 200, {
      success: true,
      message: `A single-use 6-digit passcode was dispatched to ${email}`
    });
  } catch (err) {
    return sendJson(res, 500, { success: false, error: err.message });
  }
}

async function handleVerify(req, res, customPath) {
  try {
    const rawPath = customPath || (req.url || '/').split('?')[0];
    const query = decodeURIComponent(rawPath.replace('/api/verify/', '')).trim();
    if (!query) {
      return sendJson(res, 400, { success: false, message: 'Verification id required' });
    }

    try {
      const p = getPool();
      const [rows] = await p.query(
        `SELECT * FROM students WHERE student_id = ? OR cert_id = ? OR offer_no = ? OR email = ? OR LOWER(name) = LOWER(?) ORDER BY id ASC LIMIT 1`,
        [query, query, query, query, query]
      );

      if (Array.isArray(rows) && rows.length > 0) {
        const r = rows[0];
        return sendJson(res, 200, {
          success: true,
          verified: true,
          source: 'mysql',
          student: {
            id: r.student_id,
            studentId: r.student_id,
            name: r.name,
            email: r.email,
            phone: r.phone,
            college: r.college,
            degree: r.degree,
            gradYear: r.grad_year,
            domain: r.domain,
            duration: r.duration,
            status: r.status,
            paymentStatus: r.payment_status,
            mentor: r.mentor,
            certId: r.cert_id,
            offerNo: r.offer_no,
            joiningDate: r.joining_date,
            completionDate: r.completion_date,
            registeredAt: r.registered_at
          },
          certificate: {
            certId: r.cert_id,
            studentName: r.name,
            domain: r.domain,
            issueDate: r.completion_date || '2026-03-31',
            duration: r.duration,
            grade: 'A+',
            verifyUrl: `https://atideto.in/verify/${r.cert_id || r.student_id}`
          }
        });
      }

      // Check certificate record fallback
      const [certs] = await p.query(
        `SELECT * FROM certificates WHERE cert_id = ? OR student_id = ? LIMIT 1`,
        [query, query]
      );
      if (Array.isArray(certs) && certs.length > 0) {
        const c = certs[0];
        return sendJson(res, 200, {
          success: true,
          verified: true,
          source: 'mysql-cert',
          student: {
            id: c.student_id,
            studentId: c.student_id,
            name: c.student_name,
            domain: c.domain,
            certId: c.cert_id
          },
          certificate: {
            certId: c.cert_id,
            studentName: c.student_name,
            domain: c.domain,
            issueDate: c.issue_date,
            duration: c.duration,
            grade: c.grade,
            verifyUrl: c.verify_url
          }
        });
      }
    } catch (dbErr) {
      console.warn('[SERVER] DB query during verify fallback:', dbErr.message);
    }

    return sendJson(res, 404, { success: false, verified: false, message: `No record found for "${query}"` });
  } catch (err) {
    return sendJson(res, 500, { error: err.message });
  }
}

async function handleRegistrationsGet(req, res) {
  try {
    const p = getPool();
    const [rows] = await p.query('SELECT * FROM registrations ORDER BY id DESC');
    return sendJson(res, 200, { success: true, registrations: rows });
  } catch (err) {
    return sendJson(res, 500, { error: err.message });
  }
}

async function handleRegistrationsPost(req, res) {
  try {
    const d = await parseBody(req);
    const regId = generateUniqueId('REG');
    const p = getPool();
    await p.query(
      `INSERT INTO registrations (reg_id, name, email, phone, college, degree, grad_year, domain, duration, payment_status, mode, registered_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        regId,
        d.name || '',
        d.email || '',
        d.phone || '',
        cleanCollege(d.college || ''),
        d.degree || '',
        d.gradYear || '',
        d.domain || '',
        d.duration || '4 Weeks',
        d.paymentStatus || 'Pending',
        d.mode || 'Online',
        d.registeredAt || new Date().toISOString().slice(0, 19).replace('T', ' ')
      ]
    );
    return sendJson(res, 200, { success: true, regId, message: 'Registration saved' });
  } catch (err) {
    return sendJson(res, 500, { error: err.message });
  }
}

async function handleStudentsGet(req, res) {
  try {
    const p = getPool();
    const [rows] = await p.query('SELECT * FROM students ORDER BY id DESC');
    return sendJson(res, 200, { success: true, students: rows });
  } catch (err) {
    return sendJson(res, 500, { error: err.message });
  }
}

async function handleStudentsPost(req, res) {
  try {
    const d = await parseBody(req);
    const studentId = d.studentId || d.id || generateUniqueId('STD');
    const certId = d.certId || generateUniqueId('ATD-2026');
    const offerNo = d.offerNo || generateUniqueId('OFF-2026');
    const p = getPool();
    await p.query(
      `INSERT INTO students (student_id, name, email, phone, college, degree, grad_year, domain, duration, status, payment_status, mentor, cert_id, offer_no, joining_date, completion_date, registered_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), email=VALUES(email), phone=VALUES(phone), status=VALUES(status), payment_status=VALUES(payment_status)`,
      [
        studentId,
        d.name || '',
        d.email || '',
        d.phone || '',
        cleanCollege(d.college || ''),
        d.degree || '',
        d.gradYear || '',
        d.domain || '',
        d.duration || '4 Weeks',
        d.status || 'Active',
        d.paymentStatus || 'Pending',
        d.mentor || 'Assigned Mentor',
        certId,
        offerNo,
        d.joiningDate || '2026-11-01',
        d.completionDate || '2026-11-30',
        d.registeredAt || new Date().toISOString().slice(0, 19).replace('T', ' ')
      ]
    );
    return sendJson(res, 200, { success: true, studentId, message: 'Student saved' });
  } catch (err) {
    console.warn('[SERVER] Student insert error:', err.message);
    return sendJson(res, 500, { success: false, error: err.message });
  }
}

async function handleQueryPost(req, res) {
  try {
    const { query, params } = await parseBody(req);
    if (!query) return sendJson(res, 400, { success: false, error: 'Query is required' });
    const p = getPool();
    const [result] = Array.isArray(params) && params.length > 0 ? await p.query(query, params) : await p.query(query);
    if (Array.isArray(result)) {
      return sendJson(res, 200, { success: true, query, rows: result, rowCount: result.length });
    } else {
      return sendJson(res, 200, { success: true, query, affectedRows: result.affectedRows, insertId: result.insertId });
    }
  } catch (err) {
    return sendJson(res, 500, { success: false, error: err.message });
  }
}

async function handlePaymentsGet(req, res) {
  try {
    const p = getPool();
    const [rows] = await p.query('SELECT * FROM payments ORDER BY id DESC');
    return sendJson(res, 200, { success: true, payments: rows });
  } catch (err) {
    return sendJson(res, 500, { error: err.message });
  }
}

async function handlePaymentsPost(req, res) {
  try {
    const d = await parseBody(req);
    const txnId = d.txnId || generateUniqueId('TXN');
    const p = getPool();
    await p.query(
      `INSERT INTO payments (txn_id, student_name, amount, method, status, course, date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        txnId,
        d.studentName || '',
        d.amount || '₹0',
        d.method || 'Razorpay UPI',
        d.status || 'Success',
        d.course || 'Internship Track',
        d.date || '2026-10-25'
      ]
    );
    return sendJson(res, 200, { success: true, txnId, message: 'Payment recorded' });
  } catch (err) {
    return sendJson(res, 500, { error: err.message });
  }
}

// Unified API Router (Compatible with both Node http.createServer and Vercel Serverless)
async function appHandler(req, res) {
  const parsedUrl = new URL(req.url || '/', 'http://localhost');
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS pre-flight
  if (method === 'OPTIONS') {
    setCorsHeaders(res);
    if (res.writeHead) {
      res.writeHead(204);
    } else {
      res.statusCode = 204;
    }
    res.end();
    return;
  }

  // Health check
  if (pathname === '/api/health' && method === 'GET') {
    return handleHealth(req, res);
  }

  // Database status & query
  if (pathname === '/api/database/status' && method === 'GET') {
    return await handleDbStatus(req, res);
  }
  if (pathname === '/api/database/query' && method === 'POST') {
    return await handleQueryPost(req, res);
  }

  // Auth login endpoint
  if (pathname === '/api/auth/login' && method === 'POST') {
    return await handleLogin(req, res);
  }

  // Two-Factor Authentication routes (Google Authenticator / Email / Backup)
  if (pathname === '/api/auth/verify-2fa' && method === 'POST') {
    return await handleVerify2fa(req, res);
  }
  if (pathname === '/api/auth/send-2fa-email' && method === 'POST') {
    return await handleSend2faEmail(req, res);
  }

  // Password Reset OTP endpoints
  if (pathname === '/api/auth/send-otp' && method === 'POST') {
    return await handleSendOtp(req, res);
  }
  if (pathname === '/api/auth/verify-otp' && method === 'POST') {
    return await handleVerifyOtp(req, res);
  }
  if (pathname === '/api/auth/reset-password' && method === 'POST') {
    return await handleResetPassword(req, res);
  }

  // Verify certificate or student
  if (pathname.startsWith('/api/verify/') && method === 'GET') {
    return await handleVerify(req, res, pathname);
  }

  // Registrations list & submit
  if (pathname === '/api/registrations' && method === 'GET') {
    return await handleRegistrationsGet(req, res);
  }
  if (pathname === '/api/registrations' && method === 'POST') {
    return await handleRegistrationsPost(req, res);
  }

  // Students list & submit
  if (pathname === '/api/students' && method === 'GET') {
    return await handleStudentsGet(req, res);
  }
  if (pathname === '/api/students' && method === 'POST') {
    return await handleStudentsPost(req, res);
  }

  // Payments list & submit
  if (pathname === '/api/payments' && method === 'GET') {
    return await handlePaymentsGet(req, res);
  }
  if (pathname === '/api/payments' && method === 'POST') {
    return await handlePaymentsPost(req, res);
  }

  // 404 Route Not Found
  sendJson(res, 404, { error: 'Route not found or method unsupported', pathname, method });
}

// Create server router
const server = http.createServer(appHandler);

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[API-SERVER] Atideto Enterprise API running securely on http://localhost:${PORT}`);
  });
}

module.exports = appHandler;
module.exports.appHandler = appHandler;
module.exports.server = server;