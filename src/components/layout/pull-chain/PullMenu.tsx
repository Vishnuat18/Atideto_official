import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS } from '@/constants';
import * as LucideIcons from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import ThemeToggle from '../ThemeToggle';

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
  '/profile': 'User',
  '/dashboard': 'LayoutDashboard',
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
  const { user: currentUser } = useAuth();

  const menuItems = currentUser 
    ? NAV_ITEMS.filter(item => item.href !== '/login').concat([
        { label: 'My Profile', href: '/profile' },
        { label: 'My Dashboard', href: '/dashboard' }
      ])
    : NAV_ITEMS;

  return (
    <div
      className="w-full bg-white/95 backdrop-blur-2xl border border-[#E2E8F0] rounded-b-2xl shadow-[0_10px_30px_rgba(15,23,42,0.1)] overflow-hidden"
    >
      {/* Theme toggle */}
      <div className="flex items-center justify-between px-4 pt-4 pb-1">
        <span className="text-xs font-bold uppercase tracking-widest text-[#475569]">Appearance</span>
        <ThemeToggle />
      </div>

      {/* Menu Items */}
      <div className="p-3 space-y-1">
        {menuItems.map((item, index) => {
          const iconName = iconMap[item.href] || 'Circle';
          const IconComponent = LucideIcons[iconName] as React.ComponentType<any>;
          const isActive = location.pathname === item.href;
          const displayLabel = item.label === 'ATIDETO Academy' ? 'Academy' : (item.label === 'Client Connect' ? 'Contact' : item.label);

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link
                to={item.href}
                onClick={onClose}
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all duration-300 group relative overflow-hidden"
              >
                <span
                  className="w-10 h-10 rounded-xl bg-[#F1F5F9] flex items-center justify-center text-lg relative z-10 transition-all duration-300 group-hover:text-[#2F2FE4]"
                >
                  {IconComponent && <IconComponent className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"
                    style={{ backgroundColor: activeColor }}
                  />
                </span>

                <span className={`font-semibold text-base tracking-wide transition-transform duration-300 group-hover:translate-x-1 ${isActive ? 'text-[#2F2FE4]' : ''}`}>
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

        {currentUser && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: menuItems.length * 0.05 }}
          >
            <button
              onClick={async () => {
                onClose();
                try {
                  await signOut(auth);
                } catch (err) {
                  console.error('Failed to sign out', err);
                }
              }}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm text-red-500 hover:text-red-600 hover:bg-[#FEF2F2] transition-all duration-300 group relative overflow-hidden text-left"
            >
              <span className="w-10 h-10 rounded-xl bg-[#F1F5F9] flex items-center justify-center text-lg relative z-10 transition-all duration-300 group-hover:text-red-500">
                <LucideIcons.LogOut className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              </span>
              <span className="font-semibold text-base tracking-wide transition-transform duration-300 group-hover:translate-x-1">
                Sign Out
              </span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${activeColor}, transparent)`, opacity: 0.3 }} />
    </div>
  );
}
