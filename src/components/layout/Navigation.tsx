import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '@/constants';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import atidetoLogo from '@/assets/atideto-logo.png';
import PullMenu from './pull-chain/PullMenu';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // scrolling down
      } else {
        setIsVisible(true); // scrolling up
      }
      
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);





  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch role/name from firestore if needed, but display name is available on user object
        let role = 'student';
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            role = docSnap.data().role || 'student';
          }
        } catch (e) {
          console.error(e);
        }
        
        setCurrentUser({
          uid: user.uid,
          name: user.displayName || 'User',
          email: user.email,
          role: role
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

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
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
            background: 'linear-gradient(to bottom, rgba(5,5,5,0.1) 0%, transparent 100%)'
          }}
        />
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-10 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img src={atidetoLogo} alt="ATIDETO Logo" className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_0_8px_rgba(46,168,255,0.4)]" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
            {NAV_ITEMS.slice(0, 5).map((item) => {
              const displayLabel = item.label === 'ATIDETO Academy' ? 'Academy' : (item.label === 'Client Connect' ? 'Contact' : item.label);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-white relative group ${
                    location.pathname === item.href ? 'text-white' : 'text-[#AFAFAF]'
                  }`}
                >
                  {displayLabel}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-[2px] bg-[#2EA8FF] transition-all duration-300 ${
                      location.pathname === item.href ? 'w-full shadow-[0_0_8px_#2EA8FF]' : 'w-0 group-hover:w-full group-hover:shadow-[0_0_8px_#2EA8FF]'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-6">
            {currentUser ? (
              <div className="relative group">
                <button className="flex items-center gap-2.5 text-sm font-medium text-[#A7B3C7] hover:text-white transition-colors duration-200 cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-[#0052FF]/20 border border-[#0052FF]/40 flex items-center justify-center text-white text-xs font-bold uppercase shadow-[0_0_10px_rgba(0,82,255,0.2)]">
                    {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                  </div>
                  <span>{currentUser.name || 'User'}</span>
                </button>
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-[#050505] border border-white/10 rounded-xl py-2 shadow-2xl invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-[#AFAFAF] hover:text-white hover:bg-white/5 transition-colors">
                    My Profile
                  </Link>
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-[#AFAFAF] hover:text-white hover:bg-white/5 transition-colors">
                    My Dashboard
                  </Link>
                  <hr className="border-white/5 my-1" />
                  <button
                    onClick={async () => {
                      try {
                        await signOut(auth);
                      } catch (err) {
                        console.error('Failed to sign out', err);
                      }
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-[#A7B3C7] hover:text-white transition-colors duration-200"
              >
                Sign In
              </Link>
            )}
            <Link
              to="/client-connect"
              className="btn-premium-glow rounded-full px-6 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 text-white font-semibold text-sm transition-all duration-300 shadow-[0_0_15px_rgba(46,168,255,0.15)] flex items-center gap-1.5"
            >
              Let's Talk <span className="text-[#2EA8FF] font-bold">→</span>
            </Link>
          </div>

          {/* Mobile Menu Hint */}
          <div className="lg:hidden flex items-center gap-3">
            <Link
              to="/client-connect"
              className="btn-primary text-xs px-4 py-2"
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
