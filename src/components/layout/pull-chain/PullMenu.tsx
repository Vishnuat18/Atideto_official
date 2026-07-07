import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS } from '@/constants';
import * as LucideIcons from 'lucide-react';

interface PullMenuProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
}

const iconMap: Record<string, keyof typeof LucideIcons> = {
  '/': 'Home',
  '/services': 'Briefcase',
  '/academy': 'GraduationCap',
  '/about': 'Info',
  '/client-connect': 'MessageCircle',
  '/login': 'LogIn',
};

const themeColors: Record<string, string> = {
  home: '#3B82F6',
  services: '#A855F7',
  academy: '#10B981',
  about: '#D97706',
  'client-connect': '#EF4444',
};

export default function PullMenu({ isOpen, onClose, theme }: PullMenuProps) {
  const location = useLocation();
  const activeColor = themeColors[theme] || themeColors.home;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-4 right-4 z-50 w-72 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-widest text-white/40 uppercase">Navigation</span>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <LucideIcons.X className="w-4 h-4 text-white/50" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="p-3 space-y-1">
            {NAV_ITEMS.map((item, index) => {
              const iconName = iconMap[item.href] || 'Circle';
              const IconComponent = LucideIcons[iconName] as React.ComponentType<any>;
              const isActive = location.pathname === item.href;
              const displayLabel = item.label === 'ATIDETO Academy' ? 'Academy' : (item.label === 'Client Connect' ? 'Contact' : item.label);

              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm text-[#AFAFAF] hover:text-white hover:bg-white/5 transition-all duration-300 group relative overflow-hidden"
                  >
                    <span
                      className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg relative z-10 transition-all duration-300 group-hover:text-white"
                    >
                      {IconComponent && <IconComponent className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />}
                      <div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"
                        style={{ backgroundColor: activeColor }}
                      />
                    </span>

                    <span className={`font-semibold text-base tracking-wide transition-transform duration-300 group-hover:translate-x-1 ${isActive ? 'text-white' : ''}`}>
                      {displayLabel}
                    </span>

                    <span className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                      <LucideIcons.ArrowRight className="w-4 h-4" style={{ color: activeColor }} />
                    </span>

                    {isActive && (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                        style={{ backgroundColor: activeColor }}
                      />
                    )}

                    <span
                      className="absolute bottom-0 left-4 right-4 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                      style={{ backgroundColor: activeColor }}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom accent line */}
          <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${activeColor}, transparent)`, opacity: 0.3 }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
