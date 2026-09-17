import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '@/constants';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import PullChain from './PullChain';
import { useTheme } from '@/context/ThemeContext';
import atidetoLogo from '@/assets/atideto/logo.png';
import atidetoText from '@/assets/atideto/text.png';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const { theme: currentTheme } = useTheme();
  const isServicesPage = location.pathname.startsWith('/services');
  const theme = isServicesPage ? 'dark' : currentTheme;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false); // scrolling down
      } else {
        setIsVisible(true); // scrolling up
      }
      
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);





  const { user: currentUser } = useAuth();

  // Standard Navigation for all other pages
  return (
    <>
      {/* Main Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-3' : 'py-5'
        } ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        {/* Glass fade background */}
        <div 
          className={`absolute inset-0 transition-opacity duration-300 pointer-events-none -z-10 ${scrolled ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
            background: theme === 'light' 
              ? 'linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(244,245,247,0.75) 100%)'
              : 'linear-gradient(to bottom, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0.3) 100%)'
          }}
        />
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-10 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src={atidetoLogo} 
              alt="Atideto Logo" 
              className={`h-9 md:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${
                theme === 'light'
                  ? 'filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]'
                  : 'filter drop-shadow-[0_0_15px_rgba(0,102,255,0.55)]'
              }`} 
            />
            <img 
              src={atidetoText} 
              alt="Atideto Technologies" 
              className={`h-6 md:h-7 w-auto object-contain transition-all duration-300 ${
                theme === 'light'
                  ? 'filter brightness-0'
                  : 'filter drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]'
              }`} 
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
            {NAV_ITEMS.slice(0, 5).map((item) => {
              const displayLabel = item.label;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-sm font-medium transition-colors duration-200 relative group ${
                    isActive 
                      ? (theme === 'light' ? 'text-black font-semibold' : 'text-white font-semibold')
                      : (theme === 'light' ? 'text-zinc-600 hover:text-black' : 'text-[#AFAFAF] hover:text-white')
                  }`}
                >
                  {displayLabel}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-[2px] ${
                      theme === 'light' ? 'bg-black' : 'bg-[#2EA8FF]'
                    } transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right Area: Login */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* Desktop Auth */}
            <div className="hidden lg:flex items-center">
              {currentUser ? (
                <div className="relative group">
                  <button className={`flex items-center gap-2.5 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    theme === 'light' ? 'text-zinc-700 hover:text-black' : 'text-[#A7B3C7] hover:text-white'
                  }`}>
                    <div className="w-8 h-8 rounded-full bg-[#0052FF]/20 border border-[#0052FF]/40 flex items-center justify-center text-white text-xs font-bold uppercase shadow-[0_0_10px_rgba(0,82,255,0.2)]">
                      {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                    </div>
                    <span>{currentUser.name || 'User'}</span>
                  </button>
                  {/* Dropdown menu */}
                  <div className={`absolute right-0 mt-2 w-48 rounded-xl py-2 shadow-2xl invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 ${
                    theme === 'light' ? 'bg-white border border-zinc-200 text-black' : 'bg-[#050505] border border-white/10'
                  }`}>
                    <Link to="/profile" className={`block px-4 py-2 text-sm transition-colors ${
                      theme === 'light' ? 'text-zinc-700 hover:text-black hover:bg-zinc-100' : 'text-[#AFAFAF] hover:text-white hover:bg-white/5'
                    }`}>
                      My Profile
                    </Link>
                    <Link to="/dashboard" className={`block px-4 py-2 text-sm transition-colors ${
                      theme === 'light' ? 'text-zinc-700 hover:text-black hover:bg-zinc-100' : 'text-[#AFAFAF] hover:text-white hover:bg-white/5'
                    }`}>
                      My Dashboard
                    </Link>
                    <hr className={theme === 'light' ? 'border-zinc-200 my-1' : 'border-white/5 my-1'} />
                    <button
                      onClick={async () => {
                        try {
                          await signOut(auth);
                        } catch (err) {
                          console.error('Failed to sign out', err);
                        }
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`group relative inline-flex items-center justify-center p-[2px] rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
                    theme === 'light'
                      ? 'border-zinc-300 hover:border-zinc-400 bg-zinc-100 shadow-sm'
                      : 'border-[#55647a] hover:border-[#38BDF8] bg-[#0B1020] hover:shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center rounded-full border px-5 py-1.5 font-bold text-sm tracking-wide transition-colors ${
                      theme === 'light'
                        ? 'border-zinc-200 bg-white text-zinc-900 group-hover:border-zinc-300'
                        : 'border-[#3b475d] group-hover:border-[#38BDF8]/60 bg-[#0c1222] text-white'
                    }`}
                  >
                    Login
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Pull Chain Menu - visible on all screen sizes */}
      <PullChain />
    </>
  );
}
