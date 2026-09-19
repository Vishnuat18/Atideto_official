import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * TopProgressBar: A non-blocking, modern top-line progress bar (like GitHub / YouTube / Vercel)
 * that indicates route loading without flashing a full-screen blackout.
 */
export default function TopProgressBar() {
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // Only show center micro-indicator if loading takes longer than 250ms
    const timer = setTimeout(() => {
      setShowIndicator(true);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
      {/* Top glowing progress line */}
      <motion.div
        className="h-[2.5px] bg-gradient-to-r from-[#0052FF] via-[#00F0FF] to-[#38BDF8] shadow-[0_0_12px_rgba(0,240,255,0.7)]"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          repeat: Infinity,
          duration: 0.9,
          ease: 'easeInOut',
        }}
      />

      {/* Subtle non-blocking center pulse if slow connection */}
      {showIndicator && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none bg-black/10 backdrop-blur-[1px] z-[9998]">
          <div className="w-9 h-9 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
        </div>
      )}
    </div>
  );
}
