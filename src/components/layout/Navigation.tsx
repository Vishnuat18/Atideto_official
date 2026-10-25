import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, LayoutDashboard, LogOut, Shield, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import PullChain from './PullChain';
import ServicesMegaMenu from './ServicesMegaMenu';
import CoursesMegaMenu from './CoursesMegaMenu';
import UpskillMegaMenu from './UpskillMegaMenu';
import atidetoLogo from '@/assets/atideto/logo.png';
import atidetoWordmark from '@/assets/atideto/atideto.png';
import { preloadRoute } from '@/utils/preload';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isLightNav, setIsLightNav] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    setScrolled(window.scrollY > 40);
    setIsVisible(true);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrolled = currentScrollY > 40;
      setScrolled(isScrolled);

      const deltaY = currentScrollY - lastScrollY.current;

      // When at top (scrollY <= 40), always visible and docked
      if (currentScrollY <= 40) {
        setIsVisible(true);
      } else if (Math.abs(deltaY) > 6) {
        // Scrolling DOWN -> hide floating nav
        // Scrolling UP -> reveal floating nav
        if (deltaY > 0) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }

      lastScrollY.current = currentScrollY;

      // Check if floating nav is overlapping any light theme section
      const lightSections = document.querySelectorAll('[data-nav-theme="light"]');
      let overLight = false;
      const navTop = 15;
      const navBottom = 75;

      lightSections.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= navBottom && rect.bottom >= navTop) {
          overLight = true;
        }
      });

      setIsLightNav(overLight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [location.pathname]);

  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Profile hover dropdown state
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileTimer = useRef<number | null>(null);

  const handleProfileMouseEnter = () => {
    if (profileTimer.current) clearTimeout(profileTimer.current);
    setIsProfileDropdownOpen(true);
  };

  const handleProfileMouseLeave = () => {
    profileTimer.current = window.setTimeout(() => {
      setIsProfileDropdownOpen(false);
    }, 250);
  };

  const handleDashboardClick = () => {
    setIsProfileDropdownOpen(false);
    if (currentUser?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogoutClick = async () => {
    setIsProfileDropdownOpen(false);
    await logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  // Mega-menu state for Services
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const closeServicesTimer = useRef<number | null>(null);

  // Mega-menu state for Courses
  const [isCoursesMenuOpen, setIsCoursesMenuOpen] = useState(false);
  const closeCoursesTimer = useRef<number | null>(null);

  // Mega-menu state for Upskill (Internships)
  const [isUpskillMenuOpen, setIsUpskillMenuOpen] = useState(false);
  const closeUpskillTimer = useRef<number | null>(null);

  // Handlers for Services
  const handleServicesMouseEnter = () => {
    if (closeServicesTimer.current) clearTimeout(closeServicesTimer.current);
    setIsServicesMenuOpen(true);
    setIsCoursesMenuOpen(false);
    setIsUpskillMenuOpen(false);
  };
  const handleServicesMouseLeave = () => {
    closeServicesTimer.current = window.setTimeout(() => {
      setIsServicesMenuOpen(false);
    }, 200);
  };

  // Handlers for Courses
  const handleCoursesMouseEnter = () => {
    if (closeCoursesTimer.current) clearTimeout(closeCoursesTimer.current);
    setIsCoursesMenuOpen(true);
    setIsServicesMenuOpen(false);
    setIsUpskillMenuOpen(false);
  };
  const handleCoursesMouseLeave = () => {
    closeCoursesTimer.current = window.setTimeout(() => {
      setIsCoursesMenuOpen(false);
    }, 200);
  };

  // Handlers for Upskill
  const handleUpskillMouseEnter = () => {
    if (closeUpskillTimer.current) clearTimeout(closeUpskillTimer.current);
    setIsUpskillMenuOpen(true);
    setIsServicesMenuOpen(false);
    setIsCoursesMenuOpen(false);
  };
  const handleUpskillMouseLeave = () => {
    closeUpskillTimer.current = window.setTimeout(() => {
      setIsUpskillMenuOpen(false);
    }, 200);
  };

  // Close mega menus on route change
  useEffect(() => {
    setIsServicesMenuOpen(false);
    setIsCoursesMenuOpen(false);
    setIsUpskillMenuOpen(false);
  }, [location.pathname]);

  // Close mega menus when clicking outside
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#services-mega-menu') && !target.closest('[aria-label="Toggle Services Mega Menu"]')) {
        setIsServicesMenuOpen(false);
      }
      if (!target.closest('#courses-mega-menu') && !target.closest('[aria-label="Toggle Courses Mega Menu"]')) {
        setIsCoursesMenuOpen(false);
      }
      if (!target.closest('#upskill-mega-menu') && !target.closest('[aria-label="Toggle Upskill Mega Menu"]')) {
        setIsUpskillMenuOpen(false);
      }
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  if (location.pathname === '/login' || location.pathname === '/dashboard' || location.pathname.startsWith('/admin')) {
    return null;
  }

  const isHomeActive = location.pathname === '/';
  const isServicesActive = location.pathname.startsWith('/services') || isServicesMenuOpen;
  const isCoursesActive = location.pathname === '/courses' || location.pathname.startsWith('/academy') || isCoursesMenuOpen;
  const isUpskillActive = location.pathname.startsWith('/upskill') || location.pathname.startsWith('/internships') || isUpskillMenuOpen;
  const isAboutActive = location.pathname === '/about';
  const isCareersActive = location.pathname.startsWith('/careers');
  const isContactActive = location.pathname === '/client-connect';

  const isLight = scrolled && isLightNav;
  const isAnyMenuOpen = isServicesMenuOpen || isCoursesMenuOpen || isUpskillMenuOpen;
  const showNav = !scrolled || isVisible || isAnyMenuOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ease-out pointer-events-none ${
        scrolled ? 'pt-3 sm:pt-4 px-3 sm:px-6' : 'pt-0 px-0'
      } ${
        !showNav
          ? '-translate-y-full opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100'
      }`}
    >
      <nav
        className={`pointer-events-auto transition-all duration-300 ease-out flex items-center justify-between w-full relative ${
          scrolled
            ? `max-w-5xl rounded-full px-4 sm:px-6 py-2.5 sm:py-3 border ${
                isLight
                  ? 'bg-[#FAF8F5] border-slate-300/80 shadow-[0_12px_40px_rgba(15,23,42,0.08)] text-slate-900'
                  : 'bg-[#0E1015] border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.7)] text-white'
              }`
            : 'max-w-7xl mx-auto px-6 py-5 bg-transparent border-transparent shadow-none text-white'
        }`}
      >
        {/* Left: Logo (Natural Origami Blue Logo, No Color Changes, Wordmark only when not scrolled) */}
        <Link 
          to="/" 
          className="flex items-center gap-2.5 sm:gap-3 group shrink-0"
          onMouseEnter={() => preloadRoute('/')}
          aria-label="Atideto Home"
        >
          <img 
            src={atidetoLogo} 
            alt="Atideto Logo" 
            className={`w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${
              scrolled ? 'h-7 sm:h-8' : 'h-9 sm:h-10 md:h-11'
            }`} 
          />
          {!scrolled && (
            <img 
              src={atidetoWordmark} 
              alt="Atideto Technologies" 
              className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
            />
          )}
        </Link>

        {/* Center: Desktop Nav Links with Reference Spacing */}
        <div className="hidden lg:flex items-center gap-7 lg:gap-8 xl:gap-9 relative">
          {/* 1. Home */}
          <Link
            to="/"
            onMouseEnter={() => preloadRoute('/')}
            className={`text-sm font-medium transition-colors duration-200 relative group font-sans py-1 ${
              isHomeActive 
                ? (isLight ? 'text-[#0052FF] font-bold' : 'text-[#2EA8FF] font-bold')
                : (isLight ? 'text-slate-800 hover:text-[#0052FF]' : 'text-slate-200 hover:text-[#2EA8FF]')
            }`}
          >
            <span>Home</span>
            <span className={`absolute -bottom-1 left-0 h-[2px] rounded-full transition-all duration-300 ${
              isLight ? 'bg-[#0052FF]' : 'bg-[#0066FF]'
            } ${isHomeActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
          </Link>

          {/* 2. Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleServicesMouseEnter}
            onMouseLeave={handleServicesMouseLeave}
          >
            <div className="inline-flex items-center gap-1">
              <Link
                to="/services"
                onMouseEnter={() => preloadRoute('/services')}
                className={`text-sm font-medium transition-colors duration-200 relative group font-sans inline-flex items-center cursor-pointer py-1 ${
                  isServicesActive
                    ? (isLight ? 'text-[#0052FF] font-bold' : 'text-[#2EA8FF] font-bold')
                    : (isLight ? 'text-slate-800 hover:text-[#0052FF]' : 'text-slate-200 hover:text-[#2EA8FF]')
                }`}
              >
                <span>Services</span>
                <span className={`absolute -bottom-1 left-0 h-[2px] rounded-full transition-all duration-300 ${
                  isLight ? 'bg-[#0052FF]' : 'bg-[#0066FF]'
                } ${isServicesActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsServicesMenuOpen((prev) => !prev);
                }}
                aria-expanded={isServicesMenuOpen}
                aria-label="Toggle Services Mega Menu"
                className={`p-0.5 rounded transition-colors cursor-pointer ${
                  isLight ? 'text-slate-500 hover:text-[#0052FF]' : 'text-slate-400 hover:text-[#2EA8FF]'
                }`}
              >
                <ChevronDown 
                  size={13} 
                  className={`transition-transform duration-200 ${
                    isServicesMenuOpen 
                      ? (isLight ? 'rotate-180 text-[#0052FF]' : 'rotate-180 text-[#2EA8FF]') 
                      : ''
                  }`} 
                />
              </button>
            </div>
          </div>

          {/* 3. Courses Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleCoursesMouseEnter}
            onMouseLeave={handleCoursesMouseLeave}
          >
            <div className="inline-flex items-center gap-1">
              <Link
                to="/courses"
                onMouseEnter={() => preloadRoute('/courses')}
                className={`text-sm font-medium transition-colors duration-200 relative group font-sans inline-flex items-center cursor-pointer py-1 ${
                  isCoursesActive
                    ? (isLight ? 'text-[#0052FF] font-bold' : 'text-[#2EA8FF] font-bold')
                    : (isLight ? 'text-slate-800 hover:text-[#0052FF]' : 'text-slate-200 hover:text-[#2EA8FF]')
                }`}
              >
                <span>Courses</span>
                <span className={`absolute -bottom-1 left-0 h-[2px] rounded-full transition-all duration-300 ${
                  isLight ? 'bg-[#0052FF]' : 'bg-[#0066FF]'
                } ${isCoursesActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsCoursesMenuOpen((prev) => !prev);
                }}
                aria-expanded={isCoursesMenuOpen}
                aria-label="Toggle Courses Mega Menu"
                className={`p-0.5 rounded transition-colors cursor-pointer ${
                  isLight ? 'text-slate-500 hover:text-[#0052FF]' : 'text-slate-400 hover:text-[#2EA8FF]'
                }`}
              >
                <ChevronDown 
                  size={13} 
                  className={`transition-transform duration-200 ${
                    isCoursesMenuOpen 
                      ? (isLight ? 'rotate-180 text-[#0052FF]' : 'rotate-180 text-[#2EA8FF]') 
                      : ''
                  }`} 
                />
              </button>
            </div>
          </div>

          {/* 4. Upskill Dropdown (Internships & Programs) */}
          <div
            className="relative"
            onMouseEnter={handleUpskillMouseEnter}
            onMouseLeave={handleUpskillMouseLeave}
          >
            <div className="inline-flex items-center gap-1">
              <Link
                to="/upskill"
                onMouseEnter={() => preloadRoute('/upskill')}
                className={`text-sm font-medium transition-colors duration-200 relative group font-sans inline-flex items-center cursor-pointer py-1 ${
                  isUpskillActive
                    ? (isLight ? 'text-[#0052FF] font-bold' : 'text-[#2EA8FF] font-bold')
                    : (isLight ? 'text-slate-800 hover:text-[#0052FF]' : 'text-slate-200 hover:text-[#2EA8FF]')
                }`}
              >
                <span>Upskill</span>
                <span className={`absolute -bottom-1 left-0 h-[2px] rounded-full transition-all duration-300 ${
                  isLight ? 'bg-[#0052FF]' : 'bg-[#0066FF]'
                } ${isUpskillActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsUpskillMenuOpen((prev) => !prev);
                }}
                aria-expanded={isUpskillMenuOpen}
                aria-label="Toggle Upskill Mega Menu"
                className={`p-0.5 rounded transition-colors cursor-pointer ${
                  isLight ? 'text-slate-500 hover:text-[#0052FF]' : 'text-slate-400 hover:text-[#2EA8FF]'
                }`}
              >
                <ChevronDown 
                  size={13} 
                  className={`transition-transform duration-200 ${
                    isUpskillMenuOpen 
                      ? (isLight ? 'rotate-180 text-[#0052FF]' : 'rotate-180 text-[#2EA8FF]') 
                      : ''
                  }`} 
                />
              </button>
            </div>
          </div>

          {/* 5. About */}
          <Link
            to="/about"
            onMouseEnter={() => preloadRoute('/about')}
            className={`text-sm font-medium transition-colors duration-200 relative group font-sans py-1 ${
              isAboutActive
                ? (isLight ? 'text-[#0052FF] font-bold' : 'text-[#2EA8FF] font-bold')
                : (isLight ? 'text-slate-800 hover:text-[#0052FF]' : 'text-slate-200 hover:text-[#2EA8FF]')
            }`}
          >
            <span>About</span>
            <span className={`absolute -bottom-1 left-0 h-[2px] rounded-full transition-all duration-300 ${
              isLight ? 'bg-[#0052FF]' : 'bg-[#0066FF]'
            } ${isAboutActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
          </Link>

          {/* 6. Careers */}
          <Link
            to="/careers"
            onMouseEnter={() => preloadRoute('/careers')}
            className={`text-sm font-medium transition-colors duration-200 relative group font-sans py-1 ${
              isCareersActive
                ? (isLight ? 'text-[#0052FF] font-bold' : 'text-[#2EA8FF] font-bold')
                : (isLight ? 'text-slate-800 hover:text-[#0052FF]' : 'text-slate-200 hover:text-[#2EA8FF]')
            }`}
          >
            <span>Careers</span>
            <span className={`absolute -bottom-1 left-0 h-[2px] rounded-full transition-all duration-300 ${
              isLight ? 'bg-[#0052FF]' : 'bg-[#0066FF]'
            } ${isCareersActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
          </Link>

          {/* 7. Contact */}
          <Link
            to="/client-connect"
            onMouseEnter={() => preloadRoute('/client-connect')}
            className={`text-sm font-medium transition-colors duration-200 relative group font-sans py-1 ${
              isContactActive
                ? (isLight ? 'text-[#0052FF] font-bold' : 'text-[#2EA8FF] font-bold')
                : (isLight ? 'text-slate-800 hover:text-[#0052FF]' : 'text-slate-200 hover:text-[#2EA8FF]')
            }`}
          >
            <span>Contact</span>
            <span className={`absolute -bottom-1 left-0 h-[2px] rounded-full transition-all duration-300 ${
              isLight ? 'bg-[#0052FF]' : 'bg-[#0066FF]'
            } ${isContactActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
          </Link>

          {/* ── UNIFIED MEGA MENUS ── */}
          <ServicesMegaMenu 
            isOpen={isServicesMenuOpen} 
            onClose={() => setIsServicesMenuOpen(false)} 
            onMouseEnter={handleServicesMouseEnter}
            onMouseLeave={handleServicesMouseLeave}
          />

          <CoursesMegaMenu 
            isOpen={isCoursesMenuOpen} 
            onClose={() => setIsCoursesMenuOpen(false)} 
            onMouseEnter={handleCoursesMouseEnter}
            onMouseLeave={handleCoursesMouseLeave}
          />

          <UpskillMegaMenu 
            isOpen={isUpskillMenuOpen} 
            onClose={() => setIsUpskillMenuOpen(false)} 
            onMouseEnter={handleUpskillMouseEnter}
            onMouseLeave={handleUpskillMouseLeave}
          />
        </div>

        {/* Right Area: Login/Dashboard + PullChain */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">

          {/* Profile Pill & Dropdown (Reference Image 1) */}
          {currentUser ? (
            <div 
              className="relative hidden sm:block"
              onMouseEnter={handleProfileMouseEnter}
              onMouseLeave={handleProfileMouseLeave}
            >
              {/* Profile Pill Button with User Icon & Name (Reference Image 1) */}
              <button
                type="button"
                onClick={handleDashboardClick}
                className="flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-[0_2px_8px_rgba(0,0,0,0.3)] cursor-pointer select-none border border-white/20 bg-[#1E232E]/90 hover:bg-[#2A3140] text-white group"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#0052FF] to-[#00A3FF] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <UserIcon size={12} />
                </div>
                <span className="w-2 h-2 rounded-full bg-[#00D26A] shadow-[0_0_8px_#00D26A] shrink-0" />
                <span className="tracking-wide max-w-[130px] truncate">
                  {currentUser.role === 'admin' ? 'ERP Admin' : (currentUser.name || 'Student Profile')}
                </span>
                <ChevronDown size={12} className="text-white/60 group-hover:text-white transition-transform group-hover:rotate-180" />
              </button>

              {/* Hover Dropdown Card */}
              {isProfileDropdownOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-[#0B101B]/95 backdrop-blur-xl border border-white/15 p-3 shadow-2xl text-white z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.04] border border-white/5 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0052FF] to-[#00A3FF] flex items-center justify-center font-bold text-sm shadow-[0_0_12px_rgba(0,163,255,0.4)] shrink-0">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-white truncate">{currentUser.name || (currentUser.role === 'admin' ? 'ERP Admin' : 'Student')}</p>
                      <p className="text-[10px] text-white/50 truncate font-mono">{currentUser.email || ''}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-[#0066FF]/20 text-[#38BDF8] border border-[#0066FF]/30">
                        {currentUser.role === 'admin' ? 'ERP Super Admin' : 'Student'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={handleDashboardClick}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#0052FF] text-white/90 hover:text-white text-xs font-semibold transition cursor-pointer text-left"
                    >
                      <LayoutDashboard size={14} className="text-[#38BDF8]" />
                      <span>Dashboard ({currentUser.role === 'admin' ? 'Admin ERP' : 'Student Portal'})</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleLogoutClick}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-semibold transition cursor-pointer text-left"
                    >
                      <LogOut size={14} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              onMouseEnter={() => preloadRoute('/login')}
              className="hidden sm:inline-flex kingfress-btn font-sans"
              aria-label="Login"
            >
              <span className="span-mother">
                <span>L</span>
                <span>o</span>
                <span>g</span>
                <span>i</span>
                <span>n</span>
              </span>
              <span className="span-mother2">
                <span>L</span>
                <span>o</span>
                <span>g</span>
                <span>i</span>
                <span>n</span>
              </span>
            </Link>
          )}

          {/* Mobile / Global Pull-Chain Menu Trigger */}
          <PullChain />
        </div>
      </nav>
    </header>
  );
}
