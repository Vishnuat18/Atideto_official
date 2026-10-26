import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  Briefcase, 
  GraduationCap, 
  Info, 
  User as UserIcon, 
  MessageCircle, 
  ShieldCheck, 
  Users, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import atidetoLogo from '@/assets/atideto/logo.png';
import atidetoWordmark from '@/assets/atideto/atideto.png';
import { preloadRoute } from '@/utils/preload';
import { toast } from 'sonner';

export default function MobileNativeMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user: currentUser, logout } = useAuth();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    toast.success('Signed out successfully');
  };

  const isHomeActive = location.pathname === '/';
  const isServicesActive = location.pathname.startsWith('/services');
  const isCoursesActive = location.pathname.startsWith('/courses') || location.pathname.startsWith('/academy');
  const isAboutActive = location.pathname === '/about';

  return (
    <>
      {/* 1. MOBILE NATIVE HEADER (Visible strictly on mobile < md) */}
      {/* Replaces the desktop floating nav on phones with a clean fixed native app bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between pointer-events-auto bg-[#07090E]/95 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
        {/* Left: Brand Logo & Wordmark */}
        <Link 
          to="/" 
          className="flex items-center gap-2 group shrink-0"
          aria-label="Atideto Home"
          onClick={() => setIsOpen(false)}
        >
          <img 
            src={atidetoLogo} 
            alt="Atideto" 
            className="h-7 sm:h-8 w-auto object-contain" 
          />
          <img 
            src={atidetoWordmark} 
            alt="Atideto Technologies" 
            className="h-6 sm:h-7 w-auto object-contain" 
          />
        </Link>

        {/* Right: Circular Hamburger Button (≡) exactly matching Careem reference image */}
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          aria-label="Toggle Navigation Menu"
          aria-expanded={isOpen}
          className="w-10 h-10 rounded-full bg-[#161B26] border border-white/10 text-white flex items-center justify-center shadow-md active:scale-90 transition-all hover:border-[#0066FF] hover:bg-[#1E2536] cursor-pointer"
        >
          <Menu size={18} className="text-white" />
        </button>
      </div>

      {/* 2. NATIVE MOBILE MENU SHEET (Careem-Style Top Sheet in Dark Theme Only) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dimmed Blur Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 pointer-events-auto md:hidden"
            />

            {/* Top Sheet Card (Dark Theme Only) */}
            <motion.div
              initial={{ y: '-100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 left-0 right-0 z-50 pointer-events-auto md:hidden bg-[#0A0E17] border-b border-white/15 rounded-b-[32px] shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden pt-4 pb-3 px-4 text-white"
            >
              {/* Header: Centered Logo + Circular Close Button (X) */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="w-9" /> {/* Optical balance spacer */}
                <div className="flex items-center gap-2">
                  <img src={atidetoLogo} alt="Atideto" className="h-7 w-auto object-contain" />
                  <span className="font-extrabold text-base tracking-tight text-white">
                    Atideto<span className="text-[#0066FF]">.</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-white flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Primary Circular Icon Row (Reference Image Native Style) */}
              <div className="py-5 px-1 flex items-center justify-around">
                {/* 1. Home */}
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  onMouseEnter={() => preloadRoute('/')}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border transition-all active:scale-90 ${
                    isHomeActive 
                      ? 'bg-[#0066FF] border-[#38BDF8] text-white shadow-[0_0_18px_rgba(0,102,255,0.6)]' 
                      : 'bg-white/[0.06] border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                  }`}>
                    <Home size={22} />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300 mt-2 tracking-wide">Home</span>
                </Link>

                {/* 2. Services */}
                <Link
                  to="/services"
                  onClick={() => setIsOpen(false)}
                  onMouseEnter={() => preloadRoute('/services')}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border transition-all active:scale-90 ${
                    isServicesActive 
                      ? 'bg-[#0066FF] border-[#38BDF8] text-white shadow-[0_0_18px_rgba(0,102,255,0.6)]' 
                      : 'bg-white/[0.06] border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                  }`}>
                    <Briefcase size={22} />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300 mt-2 tracking-wide">Services</span>
                </Link>

                {/* 3. Academy */}
                <Link
                  to="/courses"
                  onClick={() => setIsOpen(false)}
                  onMouseEnter={() => preloadRoute('/courses')}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border transition-all active:scale-90 ${
                    isCoursesActive 
                      ? 'bg-[#0066FF] border-[#38BDF8] text-white shadow-[0_0_18px_rgba(0,102,255,0.6)]' 
                      : 'bg-white/[0.06] border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                  }`}>
                    <GraduationCap size={22} />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300 mt-2 tracking-wide">Academy</span>
                </Link>

                {/* 4. About */}
                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  onMouseEnter={() => preloadRoute('/about')}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border transition-all active:scale-90 ${
                    isAboutActive 
                      ? 'bg-[#0066FF] border-[#38BDF8] text-white shadow-[0_0_18px_rgba(0,102,255,0.6)]' 
                      : 'bg-white/[0.06] border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                  }`}>
                    <Info size={22} />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300 mt-2 tracking-wide">About</span>
                </Link>

                {/* 5. Profile / Login */}
                <Link
                  to={currentUser ? (currentUser.role === 'admin' ? '/admin' : '/dashboard') : '/login'}
                  onClick={() => setIsOpen(false)}
                  onMouseEnter={() => preloadRoute('/login')}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border transition-all active:scale-90 ${
                    currentUser 
                      ? 'bg-gradient-to-tr from-[#0052FF] to-[#00A3FF] border-[#38BDF8] text-white shadow-[0_0_18px_rgba(0,163,255,0.6)]' 
                      : 'bg-white/[0.06] border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                  }`}>
                    <UserIcon size={22} />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300 mt-2 tracking-wide">
                    {currentUser ? (currentUser.role === 'admin' ? 'ERP' : 'Profile') : 'Login'}
                  </span>
                </Link>
              </div>

              {/* Secondary Non-Repeatable Quick Action Cards (Reference Image Lower Grid) */}
              <div className="grid grid-cols-2 gap-2 pt-1 pb-3">
                <Link
                  to="/client-connect"
                  onClick={() => setIsOpen(false)}
                  className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] flex items-center gap-2.5 transition active:scale-95"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#0066FF]/20 text-[#38BDF8] flex items-center justify-center shrink-0">
                    <MessageCircle size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">Client Connect</span>
                    <span className="text-[10px] text-slate-400 block truncate">Start a Project</span>
                  </div>
                </Link>

                <Link
                  to="/upskill"
                  onClick={() => setIsOpen(false)}
                  className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] flex items-center gap-2.5 transition active:scale-95"
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <Briefcase size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">Internships</span>
                    <span className="text-[10px] text-slate-400 block truncate">Upskill Tracks</span>
                  </div>
                </Link>

                <Link
                  to="/careers"
                  onClick={() => setIsOpen(false)}
                  className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] flex items-center gap-2.5 transition active:scale-95"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Users size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">Careers</span>
                    <span className="text-[10px] text-slate-400 block truncate">Join Our Team</span>
                  </div>
                </Link>

                <Link
                  to="/verify"
                  onClick={() => setIsOpen(false)}
                  className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] flex items-center gap-2.5 transition active:scale-95"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <ShieldCheck size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">Verify Cert</span>
                    <span className="text-[10px] text-slate-400 block truncate">Instant Lookup</span>
                  </div>
                </Link>
              </div>

              {/* If logged in: User Pill & Sign Out */}
              {currentUser && (
                <div className="pt-2 pb-1 border-t border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-2 h-2 rounded-full bg-[#00D26A]" />
                    <span className="text-xs font-bold text-slate-200 truncate">{currentUser.name || currentUser.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer py-1 px-2.5 rounded-lg hover:bg-red-500/10 transition"
                  >
                    <LogOut size={13} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}

              {/* Grab Handle Pill at Bottom (matching Reference Image) */}
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-2" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}