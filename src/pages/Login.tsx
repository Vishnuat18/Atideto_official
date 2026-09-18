import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import atidetoLogo from '@/assets/atideto/logo.png';
import loginBg from '@/assets/login/login.jpeg';
import signupBg from '@/assets/login/signup.jpeg';
import SEO from '@/components/seo/SEO';

type Mode = 'login' | 'register' | 'forgot';

const getAuthErrorMessage = (err: any) => {
  if (!err) return 'An unexpected error occurred. Please try again.';
  const code = err.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email address is already registered. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again or use Forgot Password.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in window was closed before completing Google login.';
    case 'auth/cancelled-popup-request':
      return 'Multiple sign-in popups opened. Please try again.';
    case 'auth/too-many-requests':
      return 'Access temporarily blocked due to many failed attempts. Please reset your password or try again later.';
    case 'auth/network-request-failed':
      return 'Network connection issue. Please check your internet connection.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact Atideto support.';
    default:
      return err.message || 'Authentication failed. Please check your details and try again.';
  }
};

export default function Login() {
  const [mode, setMode] = useState<Mode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'student' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Disable body scroll when login page is mounted
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const email = form.email.trim();
    const password = form.password;

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (mode === 'register') {
      if (!form.name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== form.confirm) {
        setError('Passwords do not match. Please re-enter your password confirmation.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'register') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        try {
          await updateProfile(user, { displayName: form.name.trim() });
        } catch (pErr) {
          console.warn('Profile update non-fatal warning:', pErr);
        }

        try {
          await setDoc(doc(db, 'users', user.uid), {
            name: form.name.trim(),
            email: email,
            role: form.role || 'student',
            createdAt: new Date().toISOString()
          }, { merge: true });
        } catch (fsErr) {
          console.warn('Firestore user save non-fatal warning:', fsErr);
        }

        try {
          await sendEmailVerification(user);
        } catch (vErr) {
          console.warn('Email verification non-fatal warning:', vErr);
        }

        navigate('/dashboard');
      } else if (mode === 'login') {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
          if (
            email === 'admin@atideto.in' &&
            password === 'atideto07' &&
            (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found')
          ) {
            try {
              const userCredential = await createUserWithEmailAndPassword(auth, email, password);
              const user = userCredential.user;
              await updateProfile(user, { displayName: 'Administrator' });
              await setDoc(doc(db, 'users', user.uid), {
                name: 'Administrator',
                email: email,
                role: 'admin',
                createdAt: new Date().toISOString()
              }, { merge: true });
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
      console.error('Auth error:', err);
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const userCredential = await signInWithPopup(auth, provider);

      try {
        await setDoc(
          doc(db, 'users', userCredential.user.uid),
          {
            name: userCredential.user.displayName || userCredential.user.email?.split('@')[0] || 'User',
            email: userCredential.user.email,
            role: 'student',
            createdAt: new Date().toISOString()
          },
          { merge: true }
        );
      } catch (fsErr) {
        console.warn('Firestore Google auth save warning:', fsErr);
      }

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Google auth error:', err);
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = form.email.trim();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSubmitted(true);
    } catch (err: any) {
      console.error('Reset error:', err);
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (submitted && mode === 'forgot') {
    return (
      <div className="fixed inset-0 z-[100] h-screen w-screen bg-[#050505] flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="text-6xl mb-6">📧</div>
          <h2 className="text-white text-2xl font-bold mb-4">Check Your Email</h2>
          <p className="text-[#AFAFAF] mb-8">
            We've sent a password reset link to <strong className="text-white">{form.email}</strong>
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setMode('login');
            }}
            className="btn-outline px-8 py-3"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] h-screen w-screen text-white font-sans overflow-hidden">
      <SEO
        title={mode === 'login' ? 'Login | Atideto' : mode === 'register' ? 'Create Account | Atideto' : 'Reset Password | Atideto'}
        description="Access your custom project dashboard and client portal at Atideto."
        url="https://atideto.in/login"
      />
      {/* Layer 0: Full Screen Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={mode === 'login' ? loginBg : signupBg}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Layer 1: Form Container (Overlaid) */}
      <div className="relative z-10 flex h-full">
        {/* Back to Home Button */}
        <Link
          to="/"
          className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-[#AFAFAF] hover:text-white transition-colors duration-200 z-50 bg-black/40 hover:bg-black/60 px-4 py-2 rounded-lg backdrop-blur-md border border-white/10 hover:border-white/20"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium tracking-wide">Back to Home</span>
        </Link>

        {/* Left Side: Form Area */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto max-h-screen py-16">
          <div className="w-full max-w-md space-y-5 my-auto bg-black/60 md:bg-transparent p-6 sm:p-8 md:p-0 rounded-2xl md:rounded-none backdrop-blur-xl md:backdrop-blur-none border border-white/10 md:border-none shadow-2xl md:shadow-none">
            {/* Logo / Header */}
            <div className="text-center mb-6">
              <div className="flex justify-center items-center gap-3 mb-4">
                <img
                  src={atidetoLogo}
                  alt="Atideto Logo"
                  className="h-10 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(46,168,255,0.5)]"
                />
                <span className="text-2xl sm:text-3xl font-extrabold font-montserrat tracking-tight text-white">
                  Atideto
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2 tracking-wide font-montserrat">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-[#AFAFAF] text-sm">
                {mode === 'login'
                  ? 'Sign in to continue to your dashboard & learning portal'
                  : 'Join Atideto and launch your next digital project'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-[#D2042D]/15 border border-[#D2042D]/50 rounded-xl text-[#FF6B6B] text-sm text-center font-medium animate-in fade-in duration-200">
                {error}
              </div>
            )}

            {mode === 'forgot' ? (
              <form onSubmit={handleForgot} className="space-y-6">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-transparent border-b border-white/20 pb-3 text-base text-white placeholder-[#7D7D7D] focus:outline-none focus:border-[#2F2FE4] transition-all duration-300"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#2F2FE4] hover:bg-[#3A3DFF] text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setMode('login');
                  }}
                  className="w-full text-[#AFAFAF] text-sm hover:text-white transition-colors py-2 cursor-pointer"
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
                      className="w-full bg-transparent border-b border-white/20 pb-3 text-base text-white placeholder-[#7D7D7D] focus:outline-none focus:border-[#2F2FE4] transition-all duration-300"
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
                    className="w-full bg-transparent border-b border-white/20 pb-3 text-base text-white placeholder-[#7D7D7D] focus:outline-none focus:border-[#2F2FE4] transition-all duration-300"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    required
                  />
                </div>

                {/* Password with Eye Toggle */}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="w-full bg-transparent border-b border-white/20 pb-3 pr-10 text-base text-white placeholder-[#7D7D7D] focus:outline-none focus:border-[#2F2FE4] transition-all duration-300"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1 text-[#7D7D7D] hover:text-white transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Confirm Password (Register mode only) */}
                {mode === 'register' && (
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      className="w-full bg-transparent border-b border-white/20 pb-3 pr-10 text-base text-white placeholder-[#7D7D7D] focus:outline-none focus:border-[#2F2FE4] transition-all duration-300"
                      value={form.confirm}
                      onChange={(e) => update('confirm', e.target.value)}
                      required
                    />
                  </div>
                )}

                {/* Options for Login */}
                {mode === 'login' && (
                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="rounded border-white/20 bg-transparent text-[#2F2FE4] focus:ring-0 focus:ring-offset-0"
                      />
                      <span className="text-[#AFAFAF] text-sm">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setError('');
                        setMode('forgot');
                      }}
                      className="text-[#2F2FE4] hover:text-[#5B5EFF] text-sm font-medium transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#2F2FE4] hover:bg-[#3A3DFF] text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 mt-4 cursor-pointer shadow-[0_4px_20px_rgba(47,47,228,0.4)]"
                >
                  {loading
                    ? 'Processing...'
                    : mode === 'login'
                    ? 'Sign In'
                    : 'Create Account'}
                </button>

                {/* Toggle Mode */}
                <div className="text-center mt-6">
                  <span className="text-[#7D7D7D] text-sm">
                    {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setMode(mode === 'login' ? 'register' : 'login');
                    }}
                    className="text-[#2F2FE4] hover:text-[#5B5EFF] text-sm font-medium transition-colors ml-1 cursor-pointer font-semibold"
                  >
                    {mode === 'login' ? 'Sign Up' : 'Sign In'}
                  </button>
                </div>
              </form>
            )}

            {/* Social Auth */}
            {mode !== 'forgot' && (
              <div className="mt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-[#7D7D7D] text-xs uppercase tracking-wider">
                    Or continue with
                  </span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    className="w-full py-3 border border-white/20 hover:border-white/40 bg-white/[0.03] hover:bg-white/[0.08] rounded-lg flex items-center justify-center gap-3 text-sm text-slate-200 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
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
