import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StickyLetsTalk() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8"
      >
        <Link
          to="/client-connect"
          className="group relative flex items-center gap-2.5 rounded-full border border-white/20 bg-gradient-to-r from-primary via-primary-600 to-indigo-600 px-5 py-3 text-sm font-semibold !text-white shadow-xl shadow-primary/30 backdrop-blur-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/50 active:scale-95"
          style={{ color: '#ffffff' }}
          aria-label="Let's Talk - Connect with Atideto"
        >
          {/* Subtle glowing animated pulse indicator */}
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white"></span>
          </span>

          <span className="flex items-center gap-2 tracking-wide !text-white" style={{ color: '#ffffff' }}>
            <MessageCircle className="h-4 w-4 stroke-[2.2] transition-transform duration-300 group-hover:-rotate-12 !text-white" style={{ color: '#ffffff' }} />
            Let's Talk
          </span>

          <ArrowRight className="h-4 w-4 stroke-[2.2] transition-transform duration-300 group-hover:translate-x-1 !text-white" style={{ color: '#ffffff' }} />
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
