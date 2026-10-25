import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIZED_SERVICES } from '@/constants/categorizedServices';
import {
  Home,
  Briefcase,
  GraduationCap,
  BookOpen,
  Info,
  MessageCircle,
  LogIn,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  X,
  Phone,
  ArrowRight,
  ShieldCheck,
  User as UserIcon,
  type LucideIcon
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { preloadRoute } from '@/utils/preload';
import atidetoLogo from '@/assets/atideto/logo.png';
import atidetoWordmark from '@/assets/atideto/atideto.png';

interface PullMenuProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: string;
}

interface NavItemDef {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  hasSubmenu?: boolean;
}

const PRIMARY_NAV_ITEMS: NavItemDef[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Services & Solutions', href: '/services', icon: Briefcase, badge: '8 Core', hasSubmenu: true },
  { label: 'Courses & Academy', href: '/courses', icon: BookOpen },
  { label: 'Upskill & Internships', href: '/upskill', icon: GraduationCap, badge: '2026' },
  { label: 'About Us', href: '/about', icon: Info },
  { label: 'Careers & Hiring', href: '/careers', icon: Briefcase },
  { label: 'Client Connect', href: '/client-connect', icon: MessageCircle },
];

export default function PullMenu({ onClose }: PullMenuProps) {
  const location = useLocation();
  const { user: currentUser } = useAuth();
  const [isServicesExpanded, setIsServicesExpanded] = useState(false);

  const accentColor = '#0066FF';
  const accentLight = '#2EA8FF';

  return (
    <div className="w-full flex flex-col bg-[#080B12]/98 backdrop-blur-2xl text-white select-none">
      
      {/* 1. Header Bar: Logo + Brand + Close Button */}
      <div className="px-4 py-3.5 flex items-center justify-between border-b border-white/[0.08] shrink-0">
        <Link 
          to="/" 
          onClick={onClose}
          className="flex items-center gap-2"
        >
          <img src={atidetoLogo} alt="Atideto" className="h-7 w-auto object-contain" />
          <img src={atidetoWordmark} alt="Atideto Technologies" className="h-6 w-auto object-contain" />
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-wider text-[#38BDF8] uppercase font-bold px-2 py-0.5 rounded-full bg-[#0066FF]/15 border border-[#0066FF]/30">
            Native App
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* 2. Scrollable Menu Body */}
      <div className="overflow-y-auto max-h-[calc(92vh-120px)] p-3 space-y-3 custom-scrollbar">
        
        {/* User Status Card (When Logged in) */}
        {currentUser ? (
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 shadow-sm space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0052FF] to-[#00A3FF] flex items-center justify-center text-white font-black text-sm shadow-[0_0_12px_rgba(0,102,255,0.4)] shrink-0">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-sm text-white truncate">{currentUser.name || 'Enrolled Student'}</p>
                  <ShieldCheck size={13} className="text-[#00D26A] shrink-0" />
                </div>
                <p className="text-[11px] text-slate-400 truncate font-mono">{currentUser.email || ''}</p>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-[#0066FF]/20 text-[#38BDF8] border border-[#0066FF]/30">
                  {currentUser.role === 'admin' ? 'ERP Super Admin' : 'Student Portal'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
              <Link
                to={currentUser.role === 'admin' ? '/admin' : '/dashboard'}
                onClick={onClose}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] active:scale-95 text-white font-bold text-xs transition shadow-xs"
              >
                <LayoutDashboard size={13} />
                <span>Dashboard</span>
              </Link>
              <button
                type="button"
                onClick={async () => {
                  onClose();
                  try {
                    await signOut(auth);
                  } catch (err) {
                    console.error('Sign out error:', err);
                  }
                }}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-red-500/20 active:scale-95 text-red-400 hover:text-red-300 font-bold text-xs transition border border-white/5 cursor-pointer"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Prominent Guest Login Card */
          <div className="p-3 rounded-2xl bg-gradient-to-r from-[#0066FF]/15 via-white/[0.04] to-transparent border border-[#0066FF]/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0066FF] flex items-center justify-center text-white shrink-0 shadow-sm">
                <LogIn size={15} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Student & ERP Portal</p>
                <p className="text-[10px] text-slate-400">Access verified curriculum & dashboard</p>
              </div>
            </div>
            <Link
              to="/login"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs flex items-center gap-1 transition active:scale-95 shadow-sm"
            >
              <span>Login</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        )}

        {/* 3. Primary Navigation Group (Non-repeatable & Clean) */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-1.5 space-y-0.5">
          <div className="px-3 py-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#2EA8FF] font-bold">
              Navigation
            </span>
          </div>

          {PRIMARY_NAV_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <div key={item.href} className="flex flex-col">
                <div className="flex items-center">
                  <Link
                    to={item.href}
                    onClick={onClose}
                    onMouseEnter={() => preloadRoute(item.href)}
                    className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-[#0066FF]/20 text-[#2EA8FF] font-bold border border-[#0066FF]/30'
                        : 'text-slate-200 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-[#2EA8FF]' : 'text-slate-400'} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-white/10 text-slate-300">
                        {item.badge}
                      </span>
                    )}
                  </Link>

                  {/* Submenu Expand Chevron for Services */}
                  {item.hasSubmenu && (
                    <button
                      type="button"
                      onClick={() => setIsServicesExpanded((prev) => !prev)}
                      aria-label="Expand service categories"
                      className="p-2 ml-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition cursor-pointer"
                    >
                      <ChevronDown
                        size={15}
                        className={`transition-transform duration-200 ${
                          isServicesExpanded ? 'rotate-180 text-[#2EA8FF]' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Collapsible Services 8 Core Tracks Drawer */}
                {item.hasSubmenu && (
                  <AnimatePresence>
                    {isServicesExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-7 pr-2 py-1 space-y-1"
                      >
                        <div className="flex items-center justify-between pb-1 border-b border-white/5 text-[10px] text-slate-400 font-mono">
                          <span>8 Specialized Tracks</span>
                          <Link to="/services" onClick={onClose} className="text-[#2EA8FF] hover:underline font-bold">
                            View All →
                          </Link>
                        </div>
                        <div className="grid grid-cols-1 gap-1 pt-1">
                          {CATEGORIZED_SERVICES.map((s) => (
                            <Link
                              key={s.id}
                              to={`/services/${s.id}`}
                              onClick={onClose}
                              className="flex items-center justify-between py-1.5 px-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="font-mono text-[10px] text-[#2EA8FF] font-bold shrink-0">{s.num}</span>
                                <span className="truncate text-[11px] font-medium">{s.shortTitle}</span>
                              </div>
                              <span className="text-[10px] text-slate-500">→</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </div>

        {/* 4. Quick Action / Direct Contact Bar */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Phone size={14} className="text-[#2EA8FF]" />
            <span className="font-mono text-[11px]">+91 94432 10001</span>
          </div>
          <Link
            to="/client-connect"
            onClick={onClose}
            className="text-[11px] font-bold text-[#2EA8FF] hover:underline"
          >
            Start Project →
          </Link>
        </div>
      </div>

      {/* 5. Bottom Gradient Accent Line */}
      <div 
        className="h-[2px] w-full" 
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, ${accentLight}, transparent)` }} 
      />
    </div>
  );
}
