import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Phone, ArrowRight } from 'lucide-react';

const HIDDEN_PATHS = ['/login', '/dashboard', '/profile', '/privacy-policy', '/terms-and-conditions'];

export default function StickyMobileCTA() {
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [hasScrolledPast, setHasScrolledPast] = useState(false);

  // Hide on certain pages
  const isHiddenPage = HIDDEN_PATHS.some(p => location.pathname.startsWith(p));

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      // Only show after user has scrolled past the hero area
      if (currentY > 300) {
        setHasScrolledPast(true);
      }

      // Hide when scrolling down, show when scrolling up
      if (currentY > lastScrollY.current && currentY > 200) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset scroll state on page change
  useEffect(() => {
    setHasScrolledPast(false);
    setVisible(true);
    lastScrollY.current = 0;
  }, [location.pathname]);

  if (isHiddenPage) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[100] md:hidden transition-transform duration-300 ${
        visible && hasScrolledPast ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {/* Gradient fade above the bar */}
      <div className="h-6 bg-gradient-to-t from-[#0A0E1A] to-transparent pointer-events-none" />

      <div className="bg-[#0A0E1A]/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 flex items-center gap-3">
        {/* Primary CTA */}
        <button
          onClick={() => navigate('/client-connect')}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#005DFF] to-[#2EA8FF] text-white font-bold text-sm shadow-[0_0_20px_rgba(0,93,255,0.3)] hover:shadow-[0_0_30px_rgba(0,93,255,0.5)] transition-all active:scale-[0.97]"
        >
          <span>Start Your Project</span>
          <ArrowRight size={16} />
        </button>

        {/* Call CTA */}
        <a
          href="tel:+919087284053"
          className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl border border-[#10B981]/40 bg-[#10B981]/10 text-[#10B981] transition-all active:scale-[0.95] hover:border-[#10B981] hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          aria-label="Call Atideto"
        >
          <Phone size={20} />
        </a>
      </div>

      {/* Safe area padding for iOS */}
      <div className="bg-[#0A0E1A]/95 h-[env(safe-area-inset-bottom)]" />
    </div>
  );
}
