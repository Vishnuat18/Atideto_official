import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NAV_ITEMS } from '@/constants';
import {
  Home,
  Briefcase,
  GraduationCap,
  Info,
  MessageCircle,
  LogIn,
  User,
  LayoutDashboard,
  LogOut,
  Circle,
  type LucideIcon
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { preloadRoute } from '@/utils/preload';

interface PullMenuProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
}

const iconMap: Record<string, LucideIcon> = {
  '/': Home,
  '/services': Briefcase,
  '/academy': GraduationCap,
  '/about': Info,
  '/client-connect': MessageCircle,
  '/login': LogIn,
  '/profile': User,
  '/dashboard': LayoutDashboard,
};

export default function PullMenu({ isOpen, onClose }: PullMenuProps) {
  const location = useLocation();
  const { user: currentUser } = useAuth();

  // Two-color palette: deep dark bg + blue accent
  const accentColor = '#0066FF';
  const accentLight = '#2EA8FF';

  const menuItems = currentUser 
    ? NAV_ITEMS.filter(item => item.href !== '/login').concat([
        { label: 'My Profile', href: '/profile' },
        { label: 'My Dashboard', href: '/dashboard' }
      ])
    : NAV_ITEMS;

  return (
    <div className="w-full bg-[#0a0a0a]/97 backdrop-blur-2xl rounded-b-2xl overflow-hidden border border-white/[0.06]">
      {/* Menu Items */}
      <div className="py-3 px-2">
        {menuItems.map((item, index) => {
          const IconComponent = iconMap[item.href] || Circle;
          const isActive = location.pathname === item.href;

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.04, ease: 'easeOut' }}
            >
              <Link
                to={item.href}
                onClick={onClose}
                onMouseEnter={() => preloadRoute(item.href)}
                onTouchStart={() => preloadRoute(item.href)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm transition-all duration-200 group ${
                  isActive 
                    ? 'text-white' 
                    : 'text-[#8A8F98] hover:text-white'
                }`}
              >
                {/* Icon — no border, no background box */}
                {IconComponent && (
                  <IconComponent 
                    className="w-[18px] h-[18px] shrink-0 transition-colors duration-200" 
                    style={{ color: isActive ? accentLight : undefined }}
                  />
                )}

                {/* Menu item name */}
                <span className={`text-[14px] tracking-wide transition-colors duration-200 ${
                  isActive ? 'font-semibold' : 'font-medium'
                }`}>
                  {item.label}
                </span>

                {/* Active dot */}
                {isActive && (
                  <span 
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}

        {/* Sign Out for logged-in users */}
        {currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: menuItems.length * 0.04 }}
          >
            <div className="mx-4 my-1.5 border-t border-white/[0.06]" />
            <button
              onClick={async () => {
                onClose();
                try {
                  await signOut(auth);
                } catch (err) {
                  console.error('Failed to sign out', err);
                }
              }}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm text-red-400 hover:text-red-300 transition-all duration-200 group text-left cursor-pointer"
            >
              <LogOut className="w-[18px] h-[18px] shrink-0" />
              <span className="font-medium text-[14px] tracking-wide">Sign Out</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Bottom accent line — two-color gradient */}
      <div 
        className="h-[2px] w-full" 
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, ${accentLight}, transparent)`, opacity: 0.4 }} 
      />
    </div>
  );
}
