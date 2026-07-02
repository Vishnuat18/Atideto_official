import { useState } from 'react';
import atidetoLogo from '@/assets/atideto-logo.png';
import atidetoTextLogo from '@/assets/atideto-text-logo.png';

type Mode = 'login' | 'register' | 'forgot';

export default function Login() {
  const [mode, setMode] = useState<Mode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'student' });
  const [submitted, setSubmitted] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState(false);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const getPasswordStrength = (p: string) => {
    if (!p) return { score: 0, label: '', color: '' };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^a-zA-Z0-9]/.test(p)) score++;
    const levels = [
      { label: 'Weak', color: '#D2042D' },
      { label: 'Fair', color: '#f59e0b' },
      { label: 'Good', color: '#00D26A' },
      { label: 'Strong', color: '#00D26A' },
    ];
    return { score, ...levels[Math.max(0, score - 1)] };
  };

  const strength = getPasswordStrength(form.password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register' && !otpStep) {
      setOtpStep(true);
      return;
    }
    setSubmitted(true);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted && mode === 'forgot') {
    return (
      <div style={{ background: '#050505', minHeight: '100vh', paddingTop: '80px' }} className="flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="text-6xl mb-6">📧</div>
          <h2 className="text-white text-2xl font-bold mb-4" >Check Your Email</h2>
          <p className="text-[#AFAFAF] mb-8">
            We've sent a password reset link to <strong className="text-white">{form.email}</strong>
          </p>
          <button onClick={() => { setSubmitted(false); setMode('login'); }} className="btn-outline px-8 py-3">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ background: '#050505', minHeight: '100vh', paddingTop: '80px' }} className="flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-[#2F2FE4]/20 flex items-center justify-center text-4xl mx-auto mb-6 animate-pulseGlow">
            {mode === 'login' ? '✅' : '🎉'}
          </div>
          <h2 className="text-white text-2xl font-bold mb-4" >
            {mode === 'login' ? 'Welcome Back!' : 'Account Created!'}
          </h2>
          <p className="text-[#AFAFAF] mb-8">
            {mode === 'login'
              ? `Signed in as ${form.email}`
              : `Welcome to ATIDETO Academy, ${form.name}! Check your email to verify your account.`}
          </p>
          <div className="glass rounded-xl p-5 text-sm text-left space-y-2">
            <div className="flex justify-between"><span className="text-[#AFAFAF]">Role</span><span className="text-white capitalize">{form.role}</span></div>
            <div className="flex justify-between"><span className="text-[#AFAFAF]">Email</span><span className="text-white">{form.email}</span></div>
            <div className="flex justify-between"><span className="text-[#AFAFAF]">Status</span><span className="text-[#00D26A]">Active</span></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#050505', minHeight: '100vh', paddingTop: '80px' }}>
      <div className="max-w-md mx-auto px-6 py-16">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={atidetoLogo} alt="ATIDETO Logo" className="h-16 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(46,168,255,0.4)]" />
            <img src={atidetoTextLogo} alt="ATIDETO" className="h-8 w-auto object-contain" />
          </div>
          <p className="text-[#AFAFAF] text-sm mt-1">
            {mode === 'login' ? 'Sign in to your account' : mode === 'register' ? 'Create your account' : 'Reset your password'}
          </p>
        </div>

        {/* Mode Tabs */}
        {mode !== 'forgot' && (
          <div className="flex rounded-xl overflow-hidden mb-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {(['login', 'register'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setOtpStep(false); }}
                className={`flex-1 py-3 text-sm font-medium transition-all duration-200 capitalize ${
                  mode === m ? 'bg-[#2F2FE4] text-white' : 'text-[#AFAFAF] hover:text-white'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>
        )}

        {/* Form Card */}
        <div className="rounded-2xl p-8" style={{ background: '#111111', border: '1px solid rgba(47,47,228,0.15)' }}>
          {/* OTP Step for Registration */}
          {otpStep && mode === 'register' ? (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="text-3xl mb-3">📱</div>
                <h3 className="text-white font-bold" >Verify Your Email</h3>
                <p className="text-[#AFAFAF] text-sm mt-1">Enter the 6-digit code sent to {form.email}</p>
              </div>
              <div className="flex gap-2 justify-center">
                {Array.from({ length: 6 }).map((_, i) => (
                  <input
                    key={i}
                    maxLength={1}
                    className="w-12 h-12 text-center text-white text-xl font-bold rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val && e.target.nextElementSibling) {
                        (e.target.nextElementSibling as HTMLInputElement).focus();
                      }
                      setOtp((prev) => {
                        const arr = prev.split('');
                        arr[i] = val;
                        return arr.join('');
                      });
                    }}
                  />
                ))}
              </div>
              <button
                onClick={handleSubmit as any}
                className="btn-primary w-full py-3.5 mt-4"
              >
                Verify & Complete Registration
              </button>
              <button
                onClick={() => setOtpStep(false)}
                className="w-full text-[#AFAFAF] text-sm hover:text-white transition-colors py-2"
              >
                ← Back
              </button>
            </div>
          ) : mode === 'forgot' ? (
            <form onSubmit={handleForgot} className="space-y-4">
              <div>
                <label className="text-[#AFAFAF] text-sm block mb-2">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full py-3.5">
                Send Reset Link
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full text-[#AFAFAF] text-sm hover:text-white transition-colors py-2"
              >
                ← Back to Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selector (Register) */}
              {mode === 'register' && (
                <div>
                  <label className="text-[#AFAFAF] text-sm block mb-2">Account Type</label>
                  <div className="flex gap-3">
                    {['student', 'admin'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => update('role', r)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 capitalize ${
                          form.role === r
                            ? 'bg-[#2F2FE4] text-white'
                            : 'bg-white/5 text-[#AFAFAF] border border-white/10 hover:border-white/30'
                        }`}
                      >
                        {r === 'student' ? '🎓 Student' : '👤 Admin'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Name (Register) */}
              {mode === 'register' && (
                <div>
                  <label className="text-[#AFAFAF] text-sm block mb-2">Full Name</label>
                  <input
                    className="form-input"
                    placeholder="John Smith"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="text-[#AFAFAF] text-sm block mb-2">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-[#AFAFAF] text-sm block mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input pr-12"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AFAFAF] hover:text-white transition-colors text-sm"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>

                {/* Password Strength */}
                {mode === 'register' && form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="flex-1 h-1 rounded-full transition-all duration-300"
                          style={{ background: i <= strength.score ? strength.color : 'rgba(255,255,255,0.1)' }}
                        />
                      ))}
                    </div>
                    <p className="text-xs mt-1" style={{ color: strength.color }}>
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password (Register) */}
              {mode === 'register' && (
                <div>
                  <label className="text-[#AFAFAF] text-sm block mb-2">Confirm Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={form.confirm}
                    onChange={(e) => update('confirm', e.target.value)}
                    required
                  />
                  {form.confirm && form.password !== form.confirm && (
                    <p className="text-xs text-[#D2042D] mt-1">Passwords do not match</p>
                  )}
                </div>
              )}

              {/* Remember Me & Forgot (Login) */}
              {mode === 'login' && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" style={{ accentColor: '#2F2FE4' }} />
                    <span className="text-[#AFAFAF] text-sm">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[#2F2FE4] hover:text-[#818cf8] text-sm transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={mode === 'register' && form.password !== form.confirm && !!form.confirm}
                className="btn-primary w-full py-3.5 text-base disabled:opacity-40"
              >
                {mode === 'login' ? 'Sign In →' : 'Create Account →'}
              </button>
            </form>
          )}
        </div>

        {/* Divider & Social */}
        {mode !== 'forgot' && !otpStep && (
          <>
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[#AFAFAF] text-xs">or continue with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[{ icon: '🇬', label: 'Google' }, { icon: '🐙', label: 'GitHub' }].map((p) => (
                <button
                  key={p.label}
                  className="btn-outline py-3 flex items-center justify-center gap-2 text-sm"
                >
                  <span>{p.icon}</span> {p.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
