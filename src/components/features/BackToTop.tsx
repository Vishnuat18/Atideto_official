import { useState, useEffect } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-5 left-4 sm:bottom-8 sm:left-8 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#1D68FE] text-white flex items-center justify-center transition-all duration-300 hover:bg-[#2563EB] shadow-[0_0_20px_rgba(29,104,254,0.5)] hover:shadow-[0_0_30px_rgba(29,104,254,0.75)] hover:-translate-y-0.5 active:scale-95 select-none"
      aria-label="Back to top"
    >
      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
}
