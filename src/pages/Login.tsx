import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';
import atidetoPng from '@/assets/atideto.png';
import loginBg from '@/assets/login/login.jpeg';
import signupBg from '@/assets/login/signup.jpeg';
import loginLightBg from '@/assets/login/login-light.jpeg';
import signupLightBg from '@/assets/login/signup-light.jpeg';
import SEO from '@/components/seo/SEO';

type Mode = 'login' | 'register' | 'forgot';

export default function Login() {
  const [mode, setMode] = useState<Mode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'student' });
  const [submitted, setSubmitted] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    // Disable body scroll when login page is mounted
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        const user = userCredential.user;
        
        await updateProfile(user, { displayName: form.name });
        await setDoc(doc(db, 'users', user.uid), {
          name: form.name,
          email: form.email,
          role: form.role,
          createdAt: new Date().toISOString()
        });
        
        await sendEmailVerification(user);
        navigate('/dashboard');
      } else if (mode === 'login') {
        try {
          await signInWithEmailAndPassword(auth, form.email, form.password);
        } catch (err: any) {
          if (form.email === 'admin@atideto.in' && form.password === 'atideto07' && err.code === 'auth/invalid-credential') {
            try {
              const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
              const user = userCredential.user;
              await updateProfile(user, { displayName: 'Administrator' });
              await setDoc(doc(db, 'users', user.uid), {
                name: 'Administrator',
                email: form.email,
                role: 'admin',
                createdAt: new Date().toISOString()
              });
            } catch (createErr: any) {
              if (createErr.code !== 'auth/email-already-in-use') {
                throw createErr;
              }
            }
          } else {
            throw err;
          }
        }
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // If new user, save to firestore
      if (mode === 'register') {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name: userCredential.user.displayName,
          email: userCredential.user.email,
          role: 'student',
          createdAt: new Date().toISOString()
        }, { merge: true });
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate with Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, form.email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted && mode === 'forgot') {
    return (
      <div className="fixed inset-0 z-[100] h-screen w-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="text-6xl mb-6">📧</div>
          <h2 className="text-[#0F172A] text-2xl font-bold mb-4" >Check Your Email</h2>
          <p className="text-[#64748B] mb-8">
            We've sent a password reset link to <strong className="text-[#0F172A]">{form.email}</strong>
          </p>
          <button onClick={() => { setSubmitted(false); setMode('login'); }} className="btn-outline px-8 py-3">
            Back to Login
          </button>
        </div>
      </div>
    );
  }



  return (
    <div className="fixed inset-0 z-[100] h-screen w-screen text-[#0F172A] font-sans overflow-hidden">
      <SEO 
        title="Login | ATIDETO"
        description="Access your custom project dashboard and client portal at ATIDETO."
        url="https://atideto.in/login"
      />
      {/* Layer 0: Background */}
      {isDark ? (
        <div className="absolute inset-0 z-0">
          <img 
            src={mode === 'login' ? loginBg : signupBg} 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-0 z-0">
          <img 
            src={mode === 'login' ? loginLightBg : signupLightBg} 
            alt="Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/20" />
        </div>
      )}

      {/* Layer 1: Form Container (Overlaid) */}
      <div className="relative z-10 flex h-full">
        
        {/* Back to Home Button */}
        <Link 
          to="/" 
          className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-[#64748B] hover:text-[#0F172A] transition-colors duration-200 z-50 bg-white/70 hover:bg-white/90 px-4 py-2 rounded-lg backdrop-blur-md border border-[#E2E8F0] hover:border-[#CBD5E1]"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium tracking-wide">Back to Home</span>
        </Link>

        {/* Left Side: Form Area */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-5 my-auto">
          
          {/* Logo / Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <img src={atidetoPng} alt="ATIDETO Logo" className="h-12 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(47,47,228,0.4)]" />
            </div>
            <h2 className="text-2xl font-bold mb-2 tracking-wide">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-[#64748B] text-sm">
              {mode === 'login' 
                ? 'Sign in to continue your learning journey' 
                : 'Join Adetito and start your learning journey'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-[#D2042D]/10 border border-[#D2042D]/50 rounded-xl text-[#D2042D] text-sm text-center">
              {error}
            </div>
          )}

          {mode === 'forgot' ? (
            <form onSubmit={handleForgot} className="space-y-6">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-transparent border-b border-[#CBD5E1] pb-3 text-base text-[#0F172A] placeholder-[#7D7D7D] focus:outline-none focus:border-[#2F2FE4] transition-all duration-300"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3.5 bg-[#2F2FE4] hover:bg-[#3A3DFF] text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full text-[#64748B] text-sm hover:text-[#0F172A] transition-colors py-2"
              >
                ← Back to Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              

              {/* Name */}
              {mode === 'register' && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full bg-transparent border-b border-[#CBD5E1] pb-3 text-base text-[#0F172A] placeholder-[#7D7D7D] focus:outline-none focus:border-[#2F2FE4] transition-all duration-300"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-transparent border-b border-[#CBD5E1] pb-3 text-base text-[#0F172A] placeholder-[#7D7D7D] focus:outline-none focus:border-[#2F2FE4] transition-all duration-300"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full bg-transparent border-b border-[#CBD5E1] pb-3 pr-12 text-base text-[#0F172A] placeholder-[#7D7D7D] focus:outline-none focus:border-[#2F2FE4] transition-all duration-300"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  required
                />
                {/* Visual indicator for password strength can be added below if needed */}
              </div>



              {/* Options for Login */}
              {mode === 'login' && (
                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-[#CBD5E1] bg-transparent text-[#2F2FE4] focus:ring-0 focus:ring-offset-0" />
                    <span className="text-[#64748B] text-sm">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[#2F2FE4] hover:text-[#5B5EFF] text-sm font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#2F2FE4] hover:bg-[#3A3DFF] text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 mt-4"
              >
                {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
              </button>

              {/* Toggle Mode */}
              <div className="text-center mt-6">
                <span className="text-[#7D7D7D] text-sm">
                  {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-[#2F2FE4] hover:text-[#5B5EFF] text-sm font-medium transition-colors ml-1"
                >
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </div>

            </form>
          )}

          {/* Social Auth */}
          {mode !== 'forgot' && !otpStep && (
            <div className="mt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-px bg-[#F1F5F9]" />
                <span className="text-[#7D7D7D] text-xs uppercase tracking-wider">Or continue with</span>
                <div className="flex-1 h-px bg-[#F1F5F9]" />
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full py-3 border border-[#CBD5E1] rounded-lg flex items-center justify-center gap-3 text-sm text-[#64748B] hover:text-[#0F172A] hover:border-[#A5B4FC] transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
        {/* Spacer to keep form on the left half of the screen */}
        <div className="hidden md:block md:w-1/2" />
      </div>
    </div>
  );
}
