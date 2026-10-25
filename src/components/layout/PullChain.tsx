import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PullMenu from './pull-chain/PullMenu';
import BackgroundBlur from './pull-chain/BackgroundBlur';

export default function PullChain() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="lg:hidden relative flex items-center">
      {/* Neat & Professional Native Mobile Menu Bar Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border bg-white/[0.08] hover:bg-white/[0.14] border-white/20 text-white active:scale-95 shadow-sm cursor-pointer select-none"
      >
        <span className="text-[11px] font-bold tracking-wider uppercase text-slate-200">
          {isOpen ? 'Close' : 'Menu'}
        </span>
        <div className="w-3.5 h-3.5 flex flex-col justify-center items-center gap-1">
          <span
            className={`w-3.5 h-[1.5px] bg-[#2EA8FF] rounded-full transition-all duration-300 ${
              isOpen ? 'rotate-45 translate-y-[2.5px]' : ''
            }`}
          />
          <span
            className={`w-3.5 h-[1.5px] bg-[#2EA8FF] rounded-full transition-all duration-300 ${
              isOpen ? '-rotate-45 -translate-y-[2.5px]' : ''
            }`}
          />
        </div>
      </button>

      {/* Background Dim & Blur Overlay */}
      <AnimatePresence>
        {isOpen && <BackgroundBlur isOpen={isOpen} onClose={() => setIsOpen(false)} />}
      </AnimatePresence>

      {/* Native-Style Mobile Menu Sheet (Top Slide-down, Rounded Bottom, Professional App Feel) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 left-0 right-0 z-50 w-full max-h-[92vh] overflow-hidden flex flex-col bg-[#07090E]/98 backdrop-blur-2xl border-b border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] rounded-b-3xl pointer-events-auto"
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          >
            <PullMenu isOpen={isOpen} onClose={() => setIsOpen(false)} theme="home" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
