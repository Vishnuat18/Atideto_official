import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import LadoAvatar from './LadoAvatar';
import LadoChatModal from './LadoChatModal';

export default function LadoBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const location = useLocation();

  // Hide on authentication or pure dashboard routes
  if (
    location.pathname === '/login' ||
    location.pathname === '/dashboard' ||
    location.pathname === '/profile'
  ) {
    return null;
  }

  // Auto-hide hint pill after 9 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 9000);
    return () => clearTimeout(timer);
  }, []);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    setShowHint(false);
  };

  return (
    <>
      {/* Lado Interactive Chat Popup */}
      <LadoChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Floating Lado Trigger Widget */}
      <div className="fixed bottom-5 right-4 sm:bottom-8 sm:right-8 z-40 flex flex-col items-end pointer-events-auto select-none">
        
        {/* Playful Floating Greeting Tooltip (No text on the icon itself) */}
        <AnimatePresence>
          {showHint && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              onClick={handleToggle}
              className="mb-2 mr-0.5 max-w-[calc(100vw-5rem)] bg-[#091124]/95 backdrop-blur-md border border-[#00C6FF]/40 text-white px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-2xl text-[11px] sm:text-xs font-medium shadow-[0_10px_25px_rgba(0,0,0,0.5),0_0_20px_rgba(0,198,255,0.25)] flex items-center gap-1.5 sm:gap-2 cursor-pointer group hover:border-[#00C6FF]"
            >
              <span className="w-2 h-2 rounded-full bg-[#00C6FF] animate-ping" />
              <span className="text-slate-200 group-hover:text-white">
                Hi, I'm <strong className="text-[#38BDF8]">Lado</strong>! Need help?
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHint(false);
                }}
                className="text-slate-400 hover:text-white ml-0.5"
                title="Dismiss"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Lado Bubble Gum Launcher Icon ── */}
        <div className="relative">
          {/* Subtle Ambient Pulse Ring */}
          {!isOpen && (
            <span
              className="absolute inset-0 rounded-[48%_52%_62%_38%_/_42%_48%_52%_58%] bg-[#00C6FF]/25 animate-ping pointer-events-none"
              style={{ animationDuration: '3.5s' }}
            />
          )}

          <motion.button
            onClick={handleToggle}
            title={isOpen ? 'Close Lado' : 'Chat with Lado'}
            aria-label={isOpen ? 'Close Lado' : 'Chat with Lado'}
            animate={
              !isOpen
                ? {
                    y: [0, -6, 0],
                    rotate: [0, 1.5, -1.5, 0],
                  }
                : { y: 0, rotate: 0 }
            }
            transition={
              !isOpen
                ? {
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
                : undefined
            }
            whileHover={{ scale: 1.1, rotate: 3 }}
            whileTap={{ scale: 0.92, rotate: -4 }}
            className={`relative p-[3px] rounded-[48%_52%_62%_38%_/_42%_48%_52%_58%] transition-shadow duration-300 cursor-pointer shadow-[0_12px_35px_rgba(0,82,255,0.5),0_0_30px_rgba(0,198,255,0.4)] hover:shadow-[0_14px_45px_rgba(0,82,255,0.7),0_0_45px_rgba(0,198,255,0.6)] ${
              isOpen
                ? 'bg-gradient-to-tr from-[#FF0055] via-[#FF3366] to-[#7928CA]'
                : 'bg-gradient-to-tr from-[#0052FF] via-[#00C6FF] to-[#7928CA]'
            }`}
          >
            {/* Inner Glass Pebble Container */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[inherit] bg-[#070D22]/90 backdrop-blur-xl flex items-center justify-center p-2 overflow-hidden relative group">
              
              {/* Internal Luminous Backdrop Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0052FF]/30 to-[#00C6FF]/20 rounded-[inherit] pointer-events-none group-hover:opacity-100 transition-opacity" />

              {/* Lado Bubble Gum Avatar or Close Icon when open */}
              {isOpen ? (
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  className="text-white flex items-center justify-center"
                >
                  <X size={26} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                </motion.div>
              ) : (
                <LadoAvatar size="xl" isInteractive={false} className="w-full h-full" />
              )}
            </div>
          </motion.button>
        </div>

      </div>
    </>
  );
}
