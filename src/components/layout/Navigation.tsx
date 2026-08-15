import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import atidetoLogo from '@/assets/atideto.png';
import type { LucideIcon } from 'lucide-react';
import {
  Home, Briefcase, GraduationCap, Info, MessageCircle,
  User, LayoutDashboard, LogOut, Sun, Moon, Sparkles,
  ArrowLeft, X
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { applyThemeTransition, syncThemeMeta } from '@/lib/smoothTheme';

interface NavItemConfig {
  num: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

const MENU_ITEMS: NavItemConfig[] = [
  { num: '01', label: 'Home', href: '/', icon: Home },
  { num: '02', label: 'Services', href: '/services', icon: Briefcase },
  { num: '03', label: 'Academy', href: '/academy', icon: GraduationCap },
  { num: '04', label: 'About Us', href: '/about', icon: Info },
  { num: '05', label: 'Contact', href: '/client-connect', icon: MessageCircle },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [showLightStreak, setShowLightStreak] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const { user: currentUser } = useAuth();

  const panelRef = useRef<HTMLDivElement>(null);
  const exploreBtnRef = useRef<HTMLDivElement>(null);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // ESC key listener
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  // Outside click listener: close panel when clicking anywhere on webpage content outside panel/btn
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        exploreBtnRef.current &&
        !exploreBtnRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleOutsideClick);
    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      // Step 1: Compress button (0ms -> 100ms)
      setIsCompressing(true);
      setTimeout(() => {
        setIsCompressing(false);
        // Step 2: Show subtle light streak at 120ms (lasts 150ms) on right edge
        setShowLightStreak(true);
        setTimeout(() => setShowLightStreak(false), 250);
        // Step 3: Start panel travel from right at 150ms
        setIsOpen(true);
      }, 100);
    }
  };

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (location.pathname === href) {
      setIsOpen(false);
      return;
    }
    // Continuity Sequence: Close panel first -> then navigate
    setIsOpen(false);
    setTimeout(() => {
      navigate(href);
    }, 280);
  };

  const handleSignOut = async () => {
    setIsOpen(false);
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Failed to sign out', err);
    }
  };

  const changeTheme = (next: 'light' | 'dark') => {
    syncThemeMeta(next === 'dark');
    applyThemeTransition();
    setTheme(next);
  };

  // Outer-Space Dimension Panel Framer Motion Variants (Enters from right: translateX 130% -> 0%)
  const panelVariants = {
    closed: {
      x: '130%',
      filter: 'blur(6px)',
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 140, damping: 22, mass: 0.8 },
        filter: { duration: 0.15 },
        opacity: { duration: 0.2 }
      }
    },
    open: {
      x: '0%',
      filter: 'blur(0px)',
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 140, damping: 22, mass: 0.8 },
        filter: { duration: 0.2, delay: 0.05 },
        opacity: { duration: 0.2 }
      }
    }
  };

  const listVariants = {
    closed: { opacity: 0 },
    open: {
      opacity: 1,
      transition: {
        staggerChildren: 0.045,
        delayChildren: 0.08
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: 20 },
    open: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.26, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>

      {/* TOP LEFT BRAND LOGO */}
      <div className="fixed top-5 left-6 z-[60] md:top-6 md:left-8">
        <Link
          to="/"
          className="group flex items-center justify-center rounded-2xl border border-border/60 bg-card/80 px-4 py-2.5 shadow-md backdrop-blur-xl transition-transform duration-200 hover:scale-105 hover:border-primary/40"
          aria-label="ATIDETO Home"
        >
          <img
            src={atidetoLogo}
            alt="ATIDETO Logo"
            className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>
      </div>

      {/* PERMANENT FIXED EXPLORE BUTTON (Top: 20px, Right: 20px) WITH LEFT ARROW */}
      <div ref={exploreBtnRef} className="fixed top-5 right-5 z-[70] md:top-6 md:right-8">
        <motion.button
          onClick={handleToggle}
          animate={{ scale: isCompressing ? 0.96 : 1 }}
          whileHover={{ y: -2, scale: 1.02 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close Explore Panel' : 'Open Explore Panel'}
          className="group relative flex h-14 w-36 md:w-40 cursor-pointer items-center justify-center gap-2.5 rounded-full border border-border/80 bg-card/85 px-5 shadow-lg backdrop-blur-xl transition-all duration-200 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/20 dark:border-white/15 dark:bg-card/80"
        >
          {isOpen ? (
            <X className="h-4.5 w-4.5 text-primary transition-transform duration-200 group-hover:rotate-90" />
          ) : (
            <motion.div
              animate={{ x: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="flex items-center"
            >
              <ArrowLeft className="h-4.5 w-4.5 text-primary transition-transform duration-200 group-hover:-translate-x-1" />
            </motion.div>
          )}

          <span className="text-sm font-bold tracking-wide text-foreground">
            {isOpen ? 'Close' : 'Explore'}
          </span>
        </motion.button>
      </div>

      {/* HORIZONTAL LIGHT STREAK ILLUSION ON SCREEN RIGHT EDGE */}
      <AnimatePresence>
        {showLightStreak && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 0.8, height: 260 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed top-24 right-0 z-[64] w-1 bg-gradient-to-b from-transparent via-primary to-transparent shadow-[0_0_15px_#2F2FE4]"
          />
        )}
      </AnimatePresence>

      {/* FLOATING DIMENSION PANEL (Enters from translateX(130%) on RIGHT SIDE with ZERO background overlay) */}
      <motion.div
        ref={panelRef}
        variants={panelVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        className="fixed top-20 right-6 z-[65] w-[280px] md:top-24 md:right-8 rounded-[28px] border border-border/80 bg-card/92 p-5 shadow-2xl backdrop-blur-2xl dark:border-white/15 dark:bg-card/90"
      >
        {/* INNER CONTENT LIST (Stagger 45ms) */}
        <motion.div
          variants={listVariants}
          initial="closed"
          animate={isOpen ? 'open' : 'closed'}
          className="space-y-4"
        >
          {/* 1. PROFILE SECTION */}
          <motion.div
            variants={itemVariants}
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-muted/40 p-3 shadow-sm transition-all duration-200 hover:border-primary/40 hover:bg-muted/70"
          >
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-gradient-to-br from-primary-50 to-primary-100 text-xs font-bold uppercase text-primary transition-transform duration-200 group-hover:rotate-3 dark:from-primary-950 dark:to-primary-900 dark:text-primary-300">
                  {currentUser?.name ? currentUser.name.charAt(0) : <User className="h-4 w-4" />}
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-semibold text-foreground tracking-tight truncate max-w-[130px]">
                    {currentUser?.name || 'ATIDETO Guest'}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate max-w-[130px]">
                    {currentUser?.email || 'Innovative Technology'}
                  </span>
                </div>
              </div>

              {currentUser ? (
                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-destructive/30 text-destructive transition-colors hover:bg-destructive hover:text-white"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              ) : (
                <a
                  href="/login"
                  onClick={(e) => handleNavClick(e, '/login')}
                  className="rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  Sign In
                </a>
              )}
            </div>

            {currentUser && (
              <div className="mt-2.5 flex items-center justify-around border-t border-border/40 pt-2 text-[11px] font-medium text-muted-foreground">
                <a
                  href="/profile"
                  onClick={(e) => handleNavClick(e, '/profile')}
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <User className="h-3 w-3" />
                  Profile
                </a>
                <span className="text-border">•</span>
                <a
                  href="/dashboard"
                  onClick={(e) => handleNavClick(e, '/dashboard')}
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <LayoutDashboard className="h-3 w-3" />
                  Dashboard
                </a>
              </div>
            )}
          </motion.div>

          <hr className="border-border/50" />

          {/* 2. NUMBERED MENU ITEMS (Height 48px, Spacing 16px) */}
          <div className="space-y-2">
            {MENU_ITEMS.map((item) => {
              const isActive = location.pathname === item.href;
              const IconComp = item.icon;

              return (
                <motion.div key={item.href} variants={itemVariants}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`group relative flex h-12 items-center justify-between rounded-xl px-3.5 py-2.5 transition-all duration-200 ${
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/30 shadow-sm'
                        : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                    }`}
                  >
                    {/* Hover Left Indicator Grow (0px -> 3px) */}
                    <span
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-0 rounded-r-full bg-primary transition-all duration-200 group-hover:w-[3px] group-hover:h-6 ${
                        isActive ? 'w-[3px] h-6' : ''
                      }`}
                    />

                    <div className="flex items-center gap-3 pl-1 transition-transform duration-200 group-hover:translate-x-1">
                      <span
                        className={`text-[11px] font-mono font-bold ${
                          isActive ? 'text-primary' : 'text-muted-foreground/60 group-hover:text-primary'
                        }`}
                      >
                        {item.num}
                      </span>
                      <span className="text-xs font-semibold tracking-wide text-foreground">
                        {item.label}
                      </span>
                      {isActive && (
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                        </span>
                      )}
                    </div>

                    <IconComp
                      className={`h-4 w-4 transition-transform duration-200 group-hover:rotate-4 group-hover:scale-110 ${
                        isActive ? 'text-primary' : 'text-muted-foreground/60 group-hover:text-foreground'
                      }`}
                    />
                  </a>
                </motion.div>
              );
            })}
          </div>

          <hr className="border-border/50" />

          {/* 3. THEME SECTION (Segmented Capsule Control) */}
          <motion.div variants={itemVariants} className="space-y-2 pt-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Appearance
              </span>
              <Sparkles className="h-3 w-3 text-primary/60" />
            </div>

            <div className="relative flex h-10 w-full items-center rounded-full border border-border/60 bg-muted/60 p-1">
              <motion.div
                layoutId="theme-slider-indicator"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                className="absolute inset-y-1 rounded-full bg-card shadow-md border border-border/50"
                style={{
                  left: isDark ? '50%' : '4px',
                  right: isDark ? '4px' : '50%'
                }}
              />

              <button
                onClick={() => changeTheme('light')}
                className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 text-xs font-semibold transition-colors duration-200 ${
                  !isDark ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Sun className={`h-3.5 w-3.5 ${!isDark ? 'text-amber-500' : ''}`} />
                Light
              </button>

              <button
                onClick={() => changeTheme('dark')}
                className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 text-xs font-semibold transition-colors duration-200 ${
                  isDark ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Moon className={`h-3.5 w-3.5 ${isDark ? 'text-indigo-400' : ''}`} />
                Dark
              </button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
