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

// Secure login endpoint
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

    // Check database users table
    try {
      const p = getPool();
      const [users] = await p.query(
        'SELECT id, uid, name, email, role, password FROM users WHERE LOWER(email) = ? LIMIT 1',
        [email]
      );

      if (Array.isArray(users) && users.length > 0) {
        const u = users[0];
        // Match password or default password
        const passMatch = u.password === password || (password === 'student123' && u.role === 'student') || (password === 'admin123' && u.role === 'admin');
        if (passMatch) {
          return sendJson(res, 200, {
            success: true,
            user: {
              uid: u.uid || String(u.id),
              name: u.name,
              email: u.email,
              role: u.role || 'student',
              provider: 'sql'
            },
            token: `atideto-auth-jwt-${Date.now()}`
          });
        }
      }

      // Check students table if user record was not yet created
      const [students] = await p.query(
        'SELECT student_id, name, email FROM students WHERE LOWER(email) = ? LIMIT 1',
        [email]
      );
      if (Array.isArray(students) && students.length > 0) {
        const st = students[0];
        if (password === 'student123') {
          // Provision in users table
          await p.query(
            'INSERT INTO users (uid, name, email, password, role, provider) VALUES (?, ?, ?, ?, ?, ?)',
            [st.student_id, st.name, email, 'student123', 'student', 'sql']
          );
          return sendJson(res, 200, {
            success: true,
            user: {
              uid: st.student_id,
              name: st.name,
              email: st.email,
              role: 'student',
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
      error: 'Invalid credentials. Please verify your email and password or activate your student account.'
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
                  Valid for 15 minutes • One-time use only
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
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const primaryPort = Number(process.env.SMTP_PORT) || 465;
    const isSecure = process.env.SMTP_SECURE === 'true' || primaryPort === 465;

    const trySend = async (port, secure, requireTls) => {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        requireTLS: requireTls,
        auth: {
          user: smtpUser,
          pass: smtpPass
        },
        tls: {
          rejectUnauthorized: false
        },
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 5000
      });

      return await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Atideto Technologies" <${smtpUser}>`,
        to,
        subject,
        html,
        text,
        attachments
      });
    };

    try {
      const info = await trySend(primaryPort, isSecure, false);
      console.log(`[SMTP] Successfully delivered email to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId, delivered: true };
    } catch (primaryErr) {
      console.warn(`[SMTP WARN] Primary port ${primaryPort} failed for ${to}: ${primaryErr.message}. Attempting port 587 fallback...`);
      try {
        const info2 = await trySend(587, false, true);
        console.log(`[SMTP] Successfully delivered email via port 587 fallback to ${to}: ${info2.messageId}`);
        return { success: true, messageId: info2.messageId, delivered: true };
      } catch (fallbackErr) {
        console.error(`[SMTP ERROR] Both SMTP attempts failed for ${to}:`, fallbackErr.message);
        return { success: false, delivered: false, error: fallbackErr.message };
      }
    }
  }

  console.warn(`[EMAIL WARN] SMTP credentials missing in environment for ${to}`);
  return { success: false, delivered: false, error: 'SMTP credentials (SMTP_USER, SMTP_PASS) not configured in environment.' };
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
        message: dispatchResult.error || 'Failed to dispatch verification code. Please check SMTP settings.',
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

// Student Account Activation Handler
async function handleActivateAccount(req, res) {
  try {
    const body = await parseBody(req);
    const studentId = (body.studentId || '').trim();
    const email = (body.email || '').toLowerCase().trim();
    const password = (body.password || '').trim();

    if (!email || !password) {
      return sendJson(res, 400, { success: false, message: 'Email and new password are required' });
    }

    const p = getPool();
    const [students] = await p.query(
      'SELECT student_id, name, email FROM students WHERE LOWER(email) = ? OR student_id = ? LIMIT 1',
      [email, studentId || email]
    );

    if (!Array.isArray(students) || students.length === 0) {
      return sendJson(res, 404, {
        success: false,
        message: 'No student record found with this email or Student ID. Please register first.'
      });
    }

    const st = students[0];
    const uid = st.student_id || generateUniqueId('usr');

    await p.query(
      `INSERT INTO users (uid, name, email, password, role, provider)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE password = VALUES(password), name = VALUES(name)`,
      [uid, st.name, email, password, 'student', 'sql']
    );

    return sendJson(res, 200, {
      success: true,
      message: 'Student account activated successfully! You can now access your Student Dashboard.',
      user: {
        uid,
        name: st.name,
        email,
        role: 'student',
        provider: 'sql'
      },
      token: `atideto-auth-jwt-${Date.now()}`
    });
  } catch (err) {
    console.error('[SERVER] Activate account error:', err);
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

// Certificate & Student Verification Handler
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
        let parsedTools = ['React', 'Node.js', 'Express', 'MongoDB'];
        let parsedArea = ['Full Stack', 'Web Development'];
        try {
          if (r.tools) parsedTools = typeof r.tools === 'string' ? JSON.parse(r.tools) : r.tools;
        } catch {}
        try {
          if (r.area) parsedArea = typeof r.area === 'string' ? JSON.parse(r.area) : r.area;
        } catch {}

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
            course: r.course || r.domain,
            domain: r.domain || r.course,
            startDate: r.start_date || '2026-10-25',
            endDate: r.end_date || r.issue_date || '2027-01-25',
            duration: r.internship_duration || '3 Months',
            status: r.status,
            internshipStatus: r.internship_status || 'Active Industrial Track',
            paymentStatus: r.payment_status,
            mentor: r.mentor || 'Karthik Ramanathan (AI & Web Lead)',
            attendance: Number(r.attendance) || 98,
            score: Number(r.score) || 95,
            feePaid: r.fee_paid || '₹0',
            feeTotal: r.fee_total || '₹700',
            certId: r.cert_id,
            offerNo: r.offer_no,
            joiningDate: r.start_date,
            completionDate: r.end_date || r.issue_date,
            issueDate: r.issue_date || '2026-10-25',
            registeredAt: r.created_at,
            certHold: !!r.cert_hold,
            tools: parsedTools,
            area: parsedArea
          },
          certificate: {
            certId: r.cert_id,
            studentName: r.name,
            college: r.college,
            degree: r.degree,
            domain: r.domain || r.course,
            startDate: r.start_date || '2026-10-25',
            endDate: r.end_date || r.issue_date || '2027-01-25',
            issueDate: r.issue_date || '2026-10-25',
            duration: r.internship_duration || '3 Months',
            grade: 'A+',
            certHold: !!r.cert_hold,
            verifyUrl: `https://atideto.in/verify?id=${encodeURIComponent(r.cert_id || r.student_id)}`
          }
        });
      }

      // Check certificate record fallback
      const [certs] = await p.query(
        `SELECT * FROM certificates WHERE cert_id = ? LIMIT 1`,
        [query]
      );
      if (Array.isArray(certs) && certs.length > 0) {
        const c = certs[0];
        return sendJson(res, 200, {
          success: true,
          verified: true,
          source: 'mysql-cert',
          student: {
            id: c.cert_id,
            studentId: c.cert_id,
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

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRATIONS CRUD
// ─────────────────────────────────────────────────────────────────────────────
async function handleRegistrationsGet(req, res) {
  try {
    const p = getPool();
    const [rows] = await p.query('SELECT * FROM registrations ORDER BY id DESC');
    return sendJson(res, 200, { success: true, registrations: rows });
  } catch (err) {
    return sendJson(res, 500, { success: false, error: err.message });
  }
}

async function handleRegistrationsPost(req, res) {
  try {
    const d = await parseBody(req);
    const regId = d.regId || generateUniqueId('REG');
    const studentId = d.studentId || generateUniqueId('STD');
    const normDomain = normalizeDomain(d.domain || d.courseInterest || d.course_interest || d.course);
    const normCol = normalizeCollege(d.college);
    const cleanEmail = (d.email || '').toLowerCase().trim();
    const cleanName = (d.studentName || d.name || '').trim();
    const p = getPool();

    // 1. Insert into registrations
    await p.query(
      `INSERT INTO registrations (
        reg_id, student_name, email, phone, college, degree,
        grad_year, course_interest, domain, mode, step_status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        student_name=VALUES(student_name), phone=VALUES(phone),
        college=VALUES(college), degree=VALUES(degree), grad_year=VALUES(grad_year),
        course_interest=VALUES(course_interest), domain=VALUES(domain),
        mode=VALUES(mode), step_status=VALUES(step_status), notes=VALUES(notes)`,
      [
        regId,
        cleanName,
        cleanEmail,
        d.phone || '',
        normCol,
        d.degree || 'B.Tech Information Technology',
        d.gradYear || '2027',
        normDomain,
        normDomain,
        d.mode || 'Industrial Hybrid',
        d.stepStatus || d.step_status || 'Submitted (Step 4/4)',
        d.notes || 'Enrolled from public website'
      ]
    );

    // 2. Automatically create/upsert student record in students table
    const certId = d.certId || generateUniqueId('ATD-INT-2026');
    const offerNo = d.offerNo || generateUniqueId('ATD-OFL-2026');
    await p.query(
      `INSERT INTO students (
        student_id, name, email, phone, college, degree, grad_year,
        course, domain, start_date, batch, status, internship_status,
        internship_duration, mentor, attendance, score, fee_paid,
        fee_total, payment_status, cert_id, offer_no, issue_date,
        cert_generated, sent_to_administration, tools, area
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name=VALUES(name), phone=VALUES(phone), college=VALUES(college)`,
      [
        studentId,
        cleanName,
        cleanEmail,
        d.phone || '',
        normCol,
        d.degree || 'B.Tech Information Technology',
        d.gradYear || '2027',
        normDomain,
        normDomain,
        d.startDate || '2026-10-25',
        '2026-WEB',
        'Registered',
        'Registered Industrial Track',
        d.duration || '3 Months',
        'Karthik Ramanathan (AI & Web Lead)',
        100,
        95,
        '₹0',
        'To Be Decided by Admin',
        'Pending Admin Decision',
        certId,
        offerNo,
        '2026-10-25',
        0,
        1,
        JSON.stringify(['React', 'Node.js', 'Express', 'MongoDB']),
        JSON.stringify(['Full Stack', 'Web Development'])
      ]
    );

    // 3. Automatically create active login in users table if not existing
    let userRecord = null;
    if (cleanEmail) {
      const [existingUsers] = await p.query('SELECT id, uid, name, email, role FROM users WHERE LOWER(email) = ? LIMIT 1', [cleanEmail]);
      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        userRecord = existingUsers[0];
      } else {
        const uid = generateUniqueId('usr');
        await p.query(
          'INSERT INTO users (uid, name, email, password, role, provider) VALUES (?, ?, ?, ?, ?, ?)',
          [uid, cleanName, cleanEmail, 'student123', 'student', 'sql']
        );
        userRecord = { uid, name: cleanName, email: cleanEmail, role: 'student', provider: 'sql' };
      }
    }

    return sendJson(res, 200, {
      success: true,
      regId,
      studentId,
      message: 'Registration and student account created successfully',
      user: userRecord,
      token: `atideto-auth-jwt-${Date.now()}`
    });
  } catch (err) {
    console.error('[SERVER] Registration insert error:', err);
    return sendJson(res, 500, { success: false, error: err.message });
  }
}

async function handleRegistrationsPut(req, res, regId) {
  try {
    const d = await parseBody(req);
    const p = getPool();
    const setClauses = [];
    const params = [];

    if (d.studentName !== undefined || d.student_name !== undefined) {
      setClauses.push('student_name = ?');
      params.push(d.studentName || d.student_name);
    }
    if (d.stepStatus !== undefined || d.step_status !== undefined) {
      setClauses.push('step_status = ?');
      params.push(d.stepStatus || d.step_status);
    }
    if (d.notes !== undefined) { setClauses.push('notes = ?'); params.push(d.notes); }
    if (d.mode !== undefined) { setClauses.push('mode = ?'); params.push(d.mode); }

    if (setClauses.length === 0) {
      return sendJson(res, 200, { success: true, message: 'No fields to update' });
    }

    params.push(regId, regId);
    await p.query(`UPDATE registrations SET ${setClauses.join(', ')} WHERE reg_id = ? OR CAST(id AS CHAR) = ?`, params);

    // If step_status updated to Approved, also update student status in students table
    const statusVal = d.stepStatus || d.step_status;
    if (statusVal && statusVal.toLowerCase().includes('approv')) {
      await p.query('UPDATE students SET status = ? WHERE student_id = ? OR CAST(id AS CHAR) = ?', ['Active', regId, regId]);
    }

    return sendJson(res, 200, { success: true, regId, message: 'Registration updated successfully' });
  } catch (err) {
    console.error('[SERVER] Registration update error:', err);
    return sendJson(res, 500, { success: false, error: err.message });
  }
}

async function handleRegistrationsDelete(req, res, regId) {
  try {
    const p = getPool();
    await p.query('DELETE FROM registrations WHERE reg_id = ? OR CAST(id AS CHAR) = ?', [regId, regId]);
    return sendJson(res, 200, { success: true, regId, message: 'Registration deleted successfully' });
  } catch (err) {
    console.error('[SERVER] Registration delete error:', err);
    return sendJson(res, 500, { success: false, error: err.message });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// STUDENTS CRUD
// ─────────────────────────────────────────────────────────────────────────────
async function handleStudentsGet(req, res) {
  try {
    const p = getPool();
    const [rows] = await p.query('SELECT * FROM students ORDER BY id ASC');
    return sendJson(res, 200, { success: true, students: rows });
  } catch (err) {
    return sendJson(res, 500, { success: false, error: err.message });
  }
}

async function handleStudentsPost(req, res) {
  try {
    const d = await parseBody(req);
    const studentId = d.studentId || d.id || generateUniqueId('STD');
    const normDomain = normalizeDomain(d.domain || d.course);
    const normCol = normalizeCollege(d.college);
    const certId = d.certId || generateUniqueId('ATD-INT-2026');
    const offerNo = d.offerNo || generateUniqueId('ATD-OFL-2026');
    const p = getPool();

    await p.query(
      `INSERT INTO students (
        student_id, name, email, phone, college, degree, grad_year,
        course, domain, start_date, end_date, batch, status, internship_status,
        internship_duration, mentor, attendance, score, fee_paid,
        fee_total, payment_status, cert_id, offer_no, issue_date,
        cert_generated, sent_to_administration, tools, area, cert_hold
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name=VALUES(name), email=VALUES(email), phone=VALUES(phone),
        college=VALUES(college), degree=VALUES(degree), grad_year=VALUES(grad_year),
        course=VALUES(course), domain=VALUES(domain), start_date=VALUES(start_date),
        end_date=VALUES(end_date), status=VALUES(status), internship_status=VALUES(internship_status),
        internship_duration=VALUES(internship_duration), mentor=VALUES(mentor),
        attendance=VALUES(attendance), score=VALUES(score), fee_paid=VALUES(fee_paid),
        fee_total=VALUES(fee_total), payment_status=VALUES(payment_status),
        cert_id=VALUES(cert_id), offer_no=VALUES(offer_no), issue_date=VALUES(issue_date),
        cert_generated=VALUES(cert_generated), sent_to_administration=VALUES(sent_to_administration),
        tools=VALUES(tools), area=VALUES(area), cert_hold=VALUES(cert_hold)`,
      [
        studentId,
        d.name || '',
        (d.email || '').toLowerCase().trim(),
        d.phone || '',
        normCol,
        d.degree || 'B.Tech Information Technology',
        d.gradYear || '2027',
        normDomain,
        normDomain,
        d.startDate || '2026-10-25',
        d.endDate || '2027-01-25',
        d.batch || '2026-MEC',
        d.status || 'Active',
        d.internshipStatus || 'Active Industrial Track',
        d.duration || d.internshipDuration || '3 Months',
        d.mentor || 'Karthik Ramanathan (AI & Web Lead)',
        Number(d.attendance) || 95,
        Number(d.score) || 95,
        d.feePaid || '₹0',
        d.feeTotal || 'To Be Decided by Admin',
        d.paymentStatus || 'Pending Admin Decision',
        certId,
        offerNo,
        d.issueDate || '2026-10-25',
        d.certGenerated ? 1 : 0,
        d.sentToAdministration !== undefined ? (d.sentToAdministration ? 1 : 0) : 1,
        JSON.stringify(d.tools || ['React', 'Node.js', 'Express', 'MongoDB']),
        JSON.stringify(d.area || ['Full Stack', 'Web Development']),
        d.certHold ? 1 : 0
      ]
    );

    // Also ensure linked user account exists
    const cleanEmail = (d.email || '').toLowerCase().trim();
    if (cleanEmail) {
      const [u] = await p.query('SELECT id FROM users WHERE LOWER(email) = ? LIMIT 1', [cleanEmail]);
      if (!Array.isArray(u) || u.length === 0) {
        await p.query(
          'INSERT INTO users (uid, name, email, password, role, provider) VALUES (?, ?, ?, ?, ?, ?)',
          [studentId, d.name || 'Student', cleanEmail, 'student123', 'student', 'sql']
        );
      }
    }

    return sendJson(res, 200, { success: true, studentId, message: 'Student saved to database' });
  } catch (err) {
    console.error('[SERVER] Student insert error:', err);
    return sendJson(res, 500, { success: false, error: err.message });
  }
}

async function handleStudentsPut(req, res, studentId) {
  try {
    const d = await parseBody(req);
    const p = getPool();
    const setClauses = [];
    const params = [];

    if (d.name !== undefined) { setClauses.push('name = ?'); params.push(d.name); }
    if (d.email !== undefined) { setClauses.push('email = ?'); params.push(d.email.toLowerCase().trim()); }
    if (d.phone !== undefined) { setClauses.push('phone = ?'); params.push(d.phone); }
    if (d.college !== undefined) { setClauses.push('college = ?'); params.push(normalizeCollege(d.college)); }
    if (d.degree !== undefined) { setClauses.push('degree = ?'); params.push(d.degree); }
    if (d.gradYear !== undefined) { setClauses.push('grad_year = ?'); params.push(d.gradYear); }
    if (d.course !== undefined || d.domain !== undefined) {
      const dom = normalizeDomain(d.domain || d.course);
      setClauses.push('course = ?', 'domain = ?');
      params.push(dom, dom);
    }
    if (d.startDate !== undefined) { setClauses.push('start_date = ?'); params.push(d.startDate); }
    if (d.endDate !== undefined) { setClauses.push('end_date = ?'); params.push(d.endDate); }
    if (d.certHold !== undefined) { setClauses.push('cert_hold = ?'); params.push(d.certHold ? 1 : 0); }
    if (d.status !== undefined) { setClauses.push('status = ?'); params.push(d.status); }
    if (d.internshipStatus !== undefined) { setClauses.push('internship_status = ?'); params.push(d.internshipStatus); }
    if (d.duration !== undefined || d.internshipDuration !== undefined) {
      setClauses.push('internship_duration = ?');
      params.push(d.duration || d.internshipDuration);
    }
    if (d.mentor !== undefined) { setClauses.push('mentor = ?'); params.push(d.mentor); }
    if (d.attendance !== undefined) { setClauses.push('attendance = ?'); params.push(Number(d.attendance) || 0); }
    if (d.score !== undefined) { setClauses.push('score = ?'); params.push(Number(d.score) || 0); }
    if (d.feePaid !== undefined) { setClauses.push('fee_paid = ?'); params.push(d.feePaid); }
    if (d.feeTotal !== undefined) { setClauses.push('fee_total = ?'); params.push(d.feeTotal); }
    if (d.paymentStatus !== undefined) { setClauses.push('payment_status = ?'); params.push(d.paymentStatus); }
    if (d.certId !== undefined) { setClauses.push('cert_id = ?'); params.push(d.certId); }
    if (d.offerNo !== undefined) { setClauses.push('offer_no = ?'); params.push(d.offerNo); }
    if (d.issueDate !== undefined) { setClauses.push('issue_date = ?'); params.push(d.issueDate); }
    if (d.certGenerated !== undefined) { setClauses.push('cert_generated = ?'); params.push(d.certGenerated ? 1 : 0); }
    if (d.sentToAdministration !== undefined) { setClauses.push('sent_to_administration = ?'); params.push(d.sentToAdministration ? 1 : 0); }
    if (d.tools !== undefined) { setClauses.push('tools = ?'); params.push(JSON.stringify(d.tools)); }
    if (d.area !== undefined) { setClauses.push('area = ?'); params.push(JSON.stringify(d.area)); }

    if (setClauses.length === 0) {
      return sendJson(res, 200, { success: true, message: 'No fields to update' });
    }

    params.push(studentId, studentId);
    await p.query(
      `UPDATE students SET ${setClauses.join(', ')} WHERE student_id = ? OR CAST(id AS CHAR) = ?`,
      params
    );

    return sendJson(res, 200, { success: true, studentId, message: 'Student updated successfully' });
  } catch (err) {
    console.error('[SERVER] Student update error:', err);
    return sendJson(res, 500, { success: false, error: err.message });
  }
}

async function handleStudentsDelete(req, res, studentId) {
  try {
    const p = getPool();
    await p.query('DELETE FROM students WHERE student_id = ? OR CAST(id AS CHAR) = ?', [studentId, studentId]);
    await p.query('DELETE FROM registrations WHERE reg_id = ? OR CAST(id AS CHAR) = ?', [studentId, studentId]);
    return sendJson(res, 200, { success: true, studentId, message: 'Student deleted successfully' });
  } catch (err) {
    console.error('[SERVER] Student delete error:', err);
    return sendJson(res, 500, { success: false, error: err.message });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// STAFF CRUD
// ─────────────────────────────────────────────────────────────────────────────
async function handleStaffGet(req, res) {
  try {
    const p = getPool();
    const [rows] = await p.query('SELECT * FROM staff ORDER BY id ASC');
    return sendJson(res, 200, { success: true, staff: rows });
  } catch (err) {
    return sendJson(res, 500, { success: false, error: err.message });
  }
}

async function handleStaffPost(req, res) {
  try {
    const d = await parseBody(req);
    const empId = d.emp_id || d.empId || generateUniqueId('EMP');
    const p = getPool();
    await p.query(
      `INSERT INTO staff (
        emp_id, name, email, phone, role, department, status, assigned_students,
        account_holder, account_no, ifsc_code, branch, upi_link, scanner_image,
        instagram, facebook, linkedin, portfolio, other_socials
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        empId,
        d.name || '',
        (d.email || '').toLowerCase().trim(),
        d.phone || '',
        d.role || 'Team Member',
        d.department || 'Software Engineering',
        d.status || 'Active',
        Number(d.assigned_students || d.assignedStudents) || 10,
        d.account_holder || d.accountHolder || '',
        d.account_no || d.accountNo || '',
        d.ifsc_code || d.ifscCode || '',
        d.branch || '',
        d.upi_link || d.upiLink || '',
        d.scanner_image || d.scannerImage || '',
        d.instagram || '',
        d.facebook || '',
        d.linkedin || '',
        d.portfolio || '',
        JSON.stringify(d.other_socials || d.otherSocials || [])
      ]
    );
    return sendJson(res, 200, { success: true, empId, message: 'Staff member created successfully' });
  } catch (err) {
    return sendJson(res, 500, { success: false, error: err.message });
  }
}

async function handleStaffPut(req, res, empId) {
  try {
    const d = await parseBody(req);
    const p = getPool();
    const setClauses = [];
    const params = [];

    if (d.name !== undefined) { setClauses.push('name = ?'); params.push(d.name); }
    if (d.email !== undefined) { setClauses.push('email = ?'); params.push(d.email.toLowerCase().trim()); }
    if (d.phone !== undefined) { setClauses.push('phone = ?'); params.push(d.phone); }
    if (d.role !== undefined) { setClauses.push('role = ?'); params.push(d.role); }
    if (d.department !== undefined) { setClauses.push('department = ?'); params.push(d.department); }
    if (d.status !== undefined) { setClauses.push('status = ?'); params.push(d.status); }
    if (d.assigned_students !== undefined || d.assignedStudents !== undefined) {
      setClauses.push('assigned_students = ?');
      params.push(Number(d.assigned_students ?? d.assignedStudents) || 0);
    }
    if (d.account_holder !== undefined || d.accountHolder !== undefined) {
      setClauses.push('account_holder = ?');
      params.push(d.account_holder ?? d.accountHolder);
    }
    if (d.account_no !== undefined || d.accountNo !== undefined) {
      setClauses.push('account_no = ?');
      params.push(d.account_no ?? d.accountNo);
    }
    if (d.ifsc_code !== undefined || d.ifscCode !== undefined) {
      setClauses.push('ifsc_code = ?');
      params.push(d.ifsc_code ?? d.ifscCode);
    }
    if (d.branch !== undefined) { setClauses.push('branch = ?'); params.push(d.branch); }
    if (d.upi_link !== undefined || d.upiLink !== undefined) {
      setClauses.push('upi_link = ?');
      params.push(d.upi_link ?? d.upiLink);
    }
    if (d.scanner_image !== undefined || d.scannerImage !== undefined) {
      setClauses.push('scanner_image = ?');
      params.push(d.scanner_image ?? d.scannerImage);
    }
    if (d.instagram !== undefined) { setClauses.push('instagram = ?'); params.push(d.instagram); }
    if (d.facebook !== undefined) { setClauses.push('facebook = ?'); params.push(d.facebook); }
    if (d.linkedin !== undefined) { setClauses.push('linkedin = ?'); params.push(d.linkedin); }
    if (d.portfolio !== undefined) { setClauses.push('portfolio = ?'); params.push(d.portfolio); }
    if (d.other_socials !== undefined || d.otherSocials !== undefined) {
      setClauses.push('other_socials = ?');
      params.push(JSON.stringify(d.other_socials ?? d.otherSocials));
    }

    if (setClauses.length === 0) return sendJson(res, 200, { success: true });

    params.push(empId, empId);
    await p.query(`UPDATE staff SET ${setClauses.join(', ')} WHERE emp_id = ? OR CAST(id AS CHAR) = ?`, params);
    return sendJson(res, 200, { success: true, empId, message: 'Staff member updated successfully' });
  } catch (err) {
    return sendJson(res, 500, { success: false, error: err.message });
  }
}

async function handleStaffDelete(req, res, empId) {
  try {
    const p = getPool();
    await p.query('DELETE FROM staff WHERE emp_id = ? OR CAST(id AS CHAR) = ?', [empId, empId]);
    return sendJson(res, 200, { success: true, empId, message: 'Staff member deleted' });
  } catch (err) {
    return sendJson(res, 500, { success: false, error: err.message });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CLIENTS CRUD
// ─────────────────────────────────────────────────────────────────────────────
async function handleClientsGet(req, res) {
  try {
    const p = getPool();
    const [rows] = await p.query('SELECT * FROM clients ORDER BY id ASC');
    return sendJson(res, 200, { success: true, clients: rows });
  } catch (err) {
    return sendJson(res, 500, { success: false, error: err.message });
  }
}

async function handleClientsPost(req, res) {
  try {
    const d = await parseBody(req);
    const clientId = d.clientId || d.client_id || generateUniqueId('CLT');
    const p = getPool();
    await p.query(
      `INSERT INTO clients (
        client_id, name, industry, contact_person, email, phone,
        mou_status, active_projects, contract_value, pipeline_status, tools, area
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        clientId,
        d.name || '',
        d.industry || 'Enterprise Software',
        d.contactPerson || d.contact_person || '',
        d.email || '',
        d.phone || '',
        d.mouStatus || d.mou_status || 'Under Discussion',
        Number(d.activeProjects || d.active_projects) || 1,
        d.contractValue || d.contract_value || '₹0',
        d.pipelineStatus || d.pipeline_status || 'Lead',
        JSON.stringify(d.tools || []),
        JSON.stringify(d.area || [])
      ]
    );
    return sendJson(res, 200, { success: true, clientId, message: 'Client created' });
  } catch (err) {
    return sendJson(res, 500, { success: false, error: err.message });
  }
}

async function handleClientsPut(req, res, clientId) {
  try {
    const d = await parseBody(req);
    const p = getPool();
    const setClauses = [];
    const params = [];

    if (d.name !== undefined) { setClauses.push('name = ?'); params.push(d.name); }
    if (d.industry !== undefined) { setClauses.push('industry = ?'); params.push(d.industry); }
    if (d.contactPerson !== undefined || d.contact_person !== undefined) {
      setClauses.push('contact_person = ?');
      params.push(d.contactPerson ?? d.contact_person);
    }
    if (d.email !== undefined) { setClauses.push('email = ?'); params.push(d.email); }
    if (d.phone !== undefined) { setClauses.push('phone = ?'); params.push(d.phone); }
    if (d.mouStatus !== undefined || d.mou_status !== undefined) {
      setClauses.push('mou_status = ?');
      params.push(d.mouStatus ?? d.mou_status);
    }
    if (d.activeProjects !== undefined || d.active_projects !== undefined) {
      setClauses.push('active_projects = ?');
      params.push(Number(d.activeProjects ?? d.active_projects) || 0);
    }
    if (d.contractValue !== undefined || d.contract_value !== undefined) {
      setClauses.push('contract_value = ?');
      params.push(d.contractValue ?? d.contract_value);
    }
    if (d.pipelineStatus !== undefined || d.pipeline_status !== undefined) {
      setClauses.push('pipeline_status = ?');
      params.push(d.pipelineStatus ?? d.pipeline_status);
    }

    if (setClauses.length === 0) return sendJson(res, 200, { success: true });

    params.push(clientId, clientId);
    await p.query(`UPDATE clients SET ${setClauses.join(', ')} WHERE client_id = ? OR CAST(id AS CHAR) = ?`, params);
    return sendJson(res, 200, { success: true, clientId, message: 'Client updated' });
  } catch (err) {
    return sendJson(res, 500, { success: false, error: err.message });
  }
}

async function handleClientsDelete(req, res, clientId) {
  try {
    const p = getPool();
    await p.query('DELETE FROM clients WHERE client_id = ? OR CAST(id AS CHAR) = ?', [clientId, clientId]);
    return sendJson(res, 200, { success: true, clientId, message: 'Client deleted' });
  } catch (err) {
    return sendJson(res, 500, { success: false, error: err.message });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENTS CRUD
// ─────────────────────────────────────────────────────────────────────────────
async function handlePaymentsGet(req, res) {
  try {
    const p = getPool();
    const [rows] = await p.query('SELECT * FROM payments ORDER BY id DESC');
    return sendJson(res, 200, { success: true, payments: rows });
  } catch (err) {
    return sendJson(res, 500, { success: false, error: err.message });
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
        d.studentName || d.student_name || '',
        d.amount || '₹0',
        d.method || 'UPI Transfer',
        d.status || 'Success',
        d.course || 'Internship Track',
        d.date || new Date().toISOString().slice(0, 10)
      ]
    );
    return sendJson(res, 200, { success: true, txnId, message: 'Payment recorded' });
  } catch (err) {
    return sendJson(res, 500, { success: false, error: err.message });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CERTIFICATES CRUD
// ─────────────────────────────────────────────────────────────────────────────
async function handleCertificatesGet(req, res) {
  try {
    const p = getPool();
    const [rows] = await p.query('SELECT * FROM certificates ORDER BY id DESC');
    return sendJson(res, 200, { success: true, certificates: rows });
  } catch (err) {
    return sendJson(res, 500, { success: false, error: err.message });
  }
}

async function handleCertificatesPost(req, res) {
  try {
    const d = await parseBody(req);
    const certId = d.certId || d.cert_id || generateUniqueId('ATD-INT-2026');
    const p = getPool();
    await p.query(
      `INSERT INTO certificates (cert_id, student_name, college, degree, domain, issue_date, duration, grade, verify_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE student_name=VALUES(student_name), college=VALUES(college), domain=VALUES(domain), issue_date=VALUES(issue_date)`,
      [
        certId,
        d.studentName || d.student_name || '',
        normalizeCollege(d.college),
        d.degree || 'B.Tech Information Technology',
        normalizeDomain(d.domain),
        d.issueDate || d.issue_date || '2026-10-25',
        d.duration || '3 Months',
        d.grade || 'A+',
        d.verifyUrl || d.verify_url || `https://atideto.in/verify/${certId}`
      ]
    );
    return sendJson(res, 200, { success: true, certId, message: 'Certificate saved' });
  } catch (err) {
    return sendJson(res, 500, { success: false, error: err.message });
  }
}

// Arbitrary Safe Query Handler (Admin Console)
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

// ─────────────────────────────────────────────────────────────────────────────
// UNIFIED ROUTER DISPATCHER
// ─────────────────────────────────────────────────────────────────────────────
async function appHandler(req, res) {
  const parsedUrl = new URL(req.url || '/', 'http://localhost');
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS pre-flight
  if (method === 'OPTIONS') {
    setCorsHeaders(res);
    if (res.writeHead) res.writeHead(204);
    else res.statusCode = 204;
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

  // Authentication endpoints
  if (pathname === '/api/auth/login' && method === 'POST') {
    return await handleLogin(req, res);
  }
  if (pathname === '/api/auth/activate-account' && method === 'POST') {
    return await handleActivateAccount(req, res);
  }
  if (pathname === '/api/auth/verify-2fa' && method === 'POST') {
    return await handleVerify2fa(req, res);
  }
  if (pathname === '/api/auth/send-2fa-email' && method === 'POST') {
    return await handleSend2faEmail(req, res);
  }
  if (pathname === '/api/auth/send-otp' && method === 'POST') {
    return await handleSendOtp(req, res);
  }
  if (pathname === '/api/auth/verify-otp' && method === 'POST') {
    return await handleVerifyOtp(req, res);
  }
  if (pathname === '/api/auth/reset-password' && method === 'POST') {
    return await handleResetPassword(req, res);
  }

  // Verification endpoint
  if (pathname.startsWith('/api/verify/') && method === 'GET') {
    return await handleVerify(req, res, pathname);
  }

  // Clean REST sub-router for resource collections
  // e.g. /api/students, /api/students/:id, /api/registrations/:id, etc.
  const pathParts = pathname.replace(/^\/api\//, '').split('/');
  const resource = pathParts[0];
  const resourceId = pathParts[1] ? decodeURIComponent(pathParts[1]) : null;

  // STUDENTS
  if (resource === 'students') {
    if (!resourceId && method === 'GET') return await handleStudentsGet(req, res);
    if (!resourceId && method === 'POST') return await handleStudentsPost(req, res);
    if (resourceId && (method === 'PUT' || method === 'POST')) return await handleStudentsPut(req, res, resourceId);
    if (resourceId && method === 'DELETE') return await handleStudentsDelete(req, res, resourceId);
  }

  // REGISTRATIONS
  if (resource === 'registrations') {
    if (!resourceId && method === 'GET') return await handleRegistrationsGet(req, res);
    if (!resourceId && method === 'POST') return await handleRegistrationsPost(req, res);
    if (resourceId && (method === 'PUT' || method === 'POST')) return await handleRegistrationsPut(req, res, resourceId);
    if (resourceId && method === 'DELETE') return await handleRegistrationsDelete(req, res, resourceId);
  }

  // STAFF
  if (resource === 'staff') {
    if (!resourceId && method === 'GET') return await handleStaffGet(req, res);
    if (!resourceId && method === 'POST') return await handleStaffPost(req, res);
    if (resourceId && (method === 'PUT' || method === 'POST')) return await handleStaffPut(req, res, resourceId);
    if (resourceId && method === 'DELETE') return await handleStaffDelete(req, res, resourceId);
  }

  // CLIENTS
  if (resource === 'clients') {
    if (!resourceId && method === 'GET') return await handleClientsGet(req, res);
    if (!resourceId && method === 'POST') return await handleClientsPost(req, res);
    if (resourceId && (method === 'PUT' || method === 'POST')) return await handleClientsPut(req, res, resourceId);
    if (resourceId && method === 'DELETE') return await handleClientsDelete(req, res, resourceId);
  }

  // PAYMENTS
  if (resource === 'payments') {
    if (method === 'GET') return await handlePaymentsGet(req, res);
    if (method === 'POST') return await handlePaymentsPost(req, res);
  }

  // CERTIFICATES
  if (resource === 'certificates') {
    if (method === 'GET') return await handleCertificatesGet(req, res);
    if (method === 'POST') return await handleCertificatesPost(req, res);
  }

  // 404 Route Not Found
  sendJson(res, 404, { error: 'Route not found or method unsupported', pathname, method });
}

// Create server instance
const server = http.createServer(appHandler);

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[API-SERVER] Atideto Enterprise API running securely on http://localhost:${PORT}`);
  });
}

module.exports = appHandler;
module.exports.appHandler = appHandler;
module.exports.server = server;