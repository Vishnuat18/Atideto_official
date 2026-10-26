import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Smartphone,
  Mail,
  Key,
  QrCode,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  X,
  Lock
} from 'lucide-react';
import {
  DEFAULT_ADMIN_TOTP_SECRET,
  verifyTotpCode,
  verifyBackupRecoveryCode,
  getStoredBackupCodes,
  sendAdminEmail2FaPasscode,
  verifyAdminEmail2FaPasscode,
  getTotpRemainingSeconds,
  generateTotpQrCodeDataUrl
} from '@/lib/totp';
import { toast } from 'sonner';

type TwoFactorMethod = 'totp' | 'email' | 'backup' | 'try_another_way';

interface AdminTwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  tempUser: any;
  onSuccess: (verifiedUser: any) => void;
}

export default function AdminTwoFactorModal({
  isOpen,
  onClose,
  email,
  tempUser,
  onSuccess
}: AdminTwoFactorModalProps) {
  const [method, setMethod] = useState<TwoFactorMethod>('totp');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [backupCode, setBackupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [remainingSeconds, setRemainingSeconds] = useState<number>(getTotpRemainingSeconds());
  const [emailResendTimer, setEmailResendTimer] = useState<number>(0);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  // Live 30-second countdown timer for Google Authenticator TOTP
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setRemainingSeconds(getTotpRemainingSeconds());
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Email resend countdown
  useEffect(() => {
    if (emailResendTimer <= 0) return;
    const timer = setInterval(() => {
      setEmailResendTimer(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [emailResendTimer]);

  // Load QR code on mount
  useEffect(() => {
    if (!isOpen) return;
    generateTotpQrCodeDataUrl(email || 'admin@atideto.in')
      .then(url => setQrCodeUrl(url))
      .catch(err => console.warn('QR generation notice:', err));
  }, [isOpen, email]);

  // Auto-focus first input box when method opens
  useEffect(() => {
    if (isOpen && (method === 'totp' || method === 'email')) {
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 150);
    }
  }, [isOpen, method]);

  if (!isOpen) return null;

  // Handle digit inputs
  const handleDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = clean;
    setOtpDigits(newDigits);
    setError('');

    // Auto move to next input box
    if (clean && index < 5) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto verify if all 6 digits are typed
    if (clean && index === 5 && newDigits.every(d => d !== '')) {
      executeVerification(newDigits.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!paste) return;
    const newDigits = [...otpDigits];
    for (let i = 0; i < paste.length; i++) {
      newDigits[i] = paste[i];
    }
    setOtpDigits(newDigits);
    if (paste.length === 6) {
      executeVerification(paste);
    } else if (paste.length > 0 && paste.length < 6) {
      inputRefs[paste.length].current?.focus();
    }
  };

  // Main 2FA verification logic
  const executeVerification = async (codeToVerify?: string) => {
    setError('');
    setLoading(true);

    try {
      if (method === 'totp') {
        const fullCode = codeToVerify || otpDigits.join('');
        if (fullCode.length !== 6) {
          setError('Please enter the complete 6-digit Google Authenticator code.');
          setLoading(false);
          return;
        }

        const isValid = await verifyTotpCode(fullCode, DEFAULT_ADMIN_TOTP_SECRET);
        if (isValid) {
          toast.success('Google Authenticator verified successfully');
          onSuccess(tempUser);
          return;
        } else {
          setError('Invalid or expired code. Please check your Google Authenticator app and try again.');
        }
      } else if (method === 'email') {
        const fullCode = codeToVerify || otpDigits.join('');
        if (fullCode.length !== 6) {
          setError('Please enter the 6-digit passcode sent to your email.');
          setLoading(false);
          return;
        }

        const isValid = verifyAdminEmail2FaPasscode(email, fullCode);
        if (isValid) {
          toast.success('Email 2FA passcode verified');
          onSuccess(tempUser);
          return;
        } else {
          setError('Invalid or expired email passcode. Please request a new one.');
        }
      } else if (method === 'backup') {
        if (!backupCode.trim()) {
          setError('Please enter your 8-digit emergency recovery code.');
          setLoading(false);
          return;
        }

        const activeCodes = getStoredBackupCodes();
        const { valid } = verifyBackupRecoveryCode(backupCode, activeCodes);

        if (valid) {
          toast.success('Emergency backup code accepted');
          onSuccess(tempUser);
          return;
        } else {
          setError('Invalid emergency backup code. Please verify the characters.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger Email OTP send
  const handleSendEmailCode = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await sendAdminEmail2FaPasscode(email);
      toast.success(res.message, {
        description: 'Code expires in 5 minutes. Please check your inbox or spam.'
      });
      setEmailResendTimer(30);
      setMethod('email');
      setOtpDigits(['', '', '', '', '', '']);
    } catch (e: any) {
      setError('Failed to dispatch email code.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySecretKey = () => {
    navigator.clipboard.writeText(DEFAULT_ADMIN_TOTP_SECRET);
    setCopiedKey(true);
    toast.success('Secret key copied to clipboard');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden">
        
        {/* Subtle decorative glowing background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#0066FF]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#6366F1]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header with Close Button */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800/80 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0066FF]/15 border border-[#0066FF]/30 flex items-center justify-center text-[#38BDF8]">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Two-Step Verification</h2>
              <p className="text-[11px] text-slate-400 font-mono">{email || 'admin@atideto.in'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Cancel"
          >
            <X size={18} />
          </button>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* 1. PRIMARY VIEW: GOOGLE AUTHENTICATOR (TOTP)                         */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {method === 'totp' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#0066FF]/10 text-[#38BDF8] border border-[#0066FF]/20">
                <Smartphone size={13} />
                <span>Google Authenticator</span>
              </div>
              <p className="text-sm text-slate-300 font-medium pt-1">
                Enter the 6-digit code generated in your Authenticator app
              </p>
            </div>

            {/* 6 Digit Input Boxes (Optimized for Mobile & Native Feel) */}
            <div className="flex justify-center items-center gap-1.5 xs:gap-2 sm:gap-2.5 max-w-full px-0.5" onPaste={handlePaste}>
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`w-10 h-13 xs:w-11 xs:h-14 sm:w-12 sm:h-14 text-center text-lg xs:text-xl sm:text-2xl font-black font-mono rounded-xl sm:rounded-2xl bg-[#080D1A] border transition-all duration-150 outline-none select-none ${
                    error
                      ? 'border-red-500/80 text-red-400 bg-red-950/20'
                      : digit
                      ? 'border-[#0066FF] text-white ring-2 ring-[#0066FF]/30 shadow-[0_0_12px_rgba(0,102,255,0.3)] bg-[#0066FF]/10'
                      : 'border-white/10 text-white hover:border-white/20 focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/20'
                  }`}
                />
              ))}
            </div>

            {/* Live 30s Countdown Indicator */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <div className="relative w-4 h-4 flex items-center justify-center">
                <svg className="w-4 h-4 -rotate-90">
                  <circle cx="8" cy="8" r="6" stroke="#334155" strokeWidth="2" fill="none" />
                  <circle
                    cx="8"
                    cy="8"
                    r="6"
                    stroke="#38BDF8"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={37.7}
                    strokeDashoffset={37.7 - (37.7 * remainingSeconds) / 30}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
              </div>
              <span>
                Code refreshes in <strong className="text-white font-mono">{remainingSeconds}s</strong>
              </span>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 text-xs text-red-300 bg-red-950/40 border border-red-800/50 rounded-xl">
                <AlertCircle size={15} className="shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={() => executeVerification()}
                disabled={loading || otpDigits.some(d => !d)}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-[#0066FF] hover:bg-blue-600 disabled:opacity-40 disabled:hover:bg-[#0066FF] text-white transition flex items-center justify-center gap-2 shadow-lg shadow-[#0066FF]/25 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-end text-xs pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setMethod('try_another_way');
                  }}
                  className="font-semibold text-[#38BDF8] hover:text-[#67E8F9] transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Try another way</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* 2. "TRY ANOTHER WAY" METHOD SELECTOR MODAL                           */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {method === 'try_another_way' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-bold text-white">Choose another way to verify</h3>
              <p className="text-xs text-slate-400 mt-1">
                Select one of the backup verification methods associated with your administrator account.
              </p>
            </div>

            <div className="space-y-2.5">
              {/* Option 1: Google Authenticator */}
              <button
                type="button"
                onClick={() => {
                  setMethod('totp');
                  setError('');
                }}
                className="w-full p-4 rounded-2xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-[#0066FF]/40 text-left transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0066FF]/10 text-[#38BDF8] flex items-center justify-center shrink-0">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#38BDF8] transition">
                      Google Authenticator App
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Use the 6-digit rolling passcode from your mobile app
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-500 group-hover:text-white transition" />
              </button>

              {/* Option 2: Email Passcode */}
              <button
                type="button"
                onClick={handleSendEmailCode}
                className="w-full p-4 rounded-2xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-[#0066FF]/40 text-left transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition">
                      Email Passcode
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Send a single-use verification code to {email || 'admin@atideto.in'}
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-500 group-hover:text-white transition" />
              </button>

              {/* Option 3: Emergency Backup Code */}
              <button
                type="button"
                onClick={() => {
                  setMethod('backup');
                  setError('');
                }}
                className="w-full p-4 rounded-2xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-[#0066FF]/40 text-left transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <Key size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                      Emergency Backup Code
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Enter one of your 8-digit single-use recovery codes
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-500 group-hover:text-white transition" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMethod('totp')}
              className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition cursor-pointer text-center"
            >
              Back to Authenticator
            </button>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* 3. OPTION B: EMAIL ONE-TIME PASSCODE                                 */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {method === 'email' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                <Mail size={13} />
                <span>Email Passcode</span>
              </div>
              <p className="text-sm text-slate-300 font-medium pt-1">
                Enter the 6-digit code sent to <strong className="text-white">{email}</strong>
              </p>
            </div>

            {/* 6 Digit Input Boxes (Optimized for Mobile & Native Feel) */}
            <div className="flex justify-center items-center gap-1.5 xs:gap-2 sm:gap-2.5 max-w-full px-0.5" onPaste={handlePaste}>
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-10 h-13 xs:w-11 xs:h-14 sm:w-12 sm:h-14 text-center text-lg xs:text-xl sm:text-2xl font-black font-mono rounded-xl sm:rounded-2xl bg-[#080D1A] border border-slate-800 text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 outline-none transition select-none"
                />
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 text-xs text-red-300 bg-red-950/40 border border-red-800/50 rounded-xl">
                <AlertCircle size={15} className="shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => executeVerification()}
                disabled={loading || otpDigits.some(d => !d)}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 cursor-pointer"
              >
                {loading ? <RefreshCw size={16} className="animate-spin" /> : 'Verify Email Code'}
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  disabled={emailResendTimer > 0 || loading}
                  onClick={handleSendEmailCode}
                  className="text-slate-400 hover:text-white disabled:opacity-50 transition cursor-pointer"
                >
                  {emailResendTimer > 0 ? `Resend code in ${emailResendTimer}s` : 'Resend code'}
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('try_another_way')}
                  className="text-[#38BDF8] hover:text-[#67E8F9] transition flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <span>Try another way</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* 4. OPTION C: EMERGENCY BACKUP RECOVERY CODE                          */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {method === 'backup' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                <Key size={13} />
                <span>Emergency Backup Code</span>
              </div>
              <p className="text-sm text-slate-300 font-medium pt-1">
                Enter one of your 8-digit single-use emergency recovery passcodes
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                8-Digit Backup Code
              </label>
              <input
                type="text"
                placeholder="e.g. 8F4K-92MN"
                value={backupCode}
                onChange={(e) => {
                  setBackupCode(e.target.value.toUpperCase());
                  setError('');
                }}
                className="w-full px-4 py-3 text-center text-lg font-mono font-bold tracking-widest rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition uppercase"
              />
              <p className="text-[11px] text-slate-500 mt-2 text-center">
                Each emergency code can only be used once.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 text-xs text-red-300 bg-red-950/40 border border-red-800/50 rounded-xl">
                <AlertCircle size={15} className="shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => executeVerification()}
                disabled={loading || !backupCode.trim()}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                {loading ? <RefreshCw size={16} className="animate-spin" /> : 'Verify Backup Code'}
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setMethod('totp')}
                  className="text-slate-400 hover:text-white transition cursor-pointer"
                >
                  Use Authenticator App
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('try_another_way')}
                  className="text-[#38BDF8] hover:text-[#67E8F9] transition flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <span>Try another way</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}



      </div>
    </div>
  );
}
