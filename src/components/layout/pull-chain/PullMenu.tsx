import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NAV_ITEMS } from '@/constants';
import { CATEGORIZED_SERVICES } from '@/constants/categorizedServices';
import {
  Home,
  Briefcase,
  GraduationCap,
  BookOpen,
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
  '/courses': BookOpen,
  '/upskill': GraduationCap,
  '/academy': GraduationCap,
  '/about': Info,
  '/careers': Briefcase,
  '/client-connect': MessageCircle,
  '/login': LogIn,
  '/profile': User,
  '/dashboard': LayoutDashboard,
};

import atidetoLogo from '@/assets/atideto/logo.png';
import atidetoWordmark from '@/assets/atideto/atideto.png';

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
      {/* Official Brand Logo Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <img src={atidetoLogo} alt="Atideto" className="h-8 w-auto object-contain" />
          <img src={atidetoWordmark} alt="Atideto Technologies" className="h-8 w-auto object-contain" />
        </div>
        <span className="text-[10px] font-mono text-[#38BDF8] tracking-widest uppercase font-semibold">Atideto</span>
      </div>

      {/* Menu Items */}
      <div className="py-2 px-2">
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

              {/* Categorized Services Sub-Menu for Mobile */}
              {item.href === '/services' && (
                <div className="mx-2 mb-2 p-2 rounded-xl bg-[#070D1A]/90 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                  <div className="flex items-center justify-between px-2 pb-1.5 mb-1 border-b border-white/[0.06]">
                    <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#2EA8FF] uppercase">
                      8 Core Categories
                    </span>
                    <Link
                      to="/services"
                      onClick={onClose}
                      className="text-[10px] font-semibold text-slate-400 hover:text-white"
                    >
                      View All →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {CATEGORIZED_SERVICES.map((s) => (
                      <Link
                        key={s.id}
                        to={`/services/${s.id}`}
                        onClick={onClose}
                        className="flex items-center justify-between py-1.5 px-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all group"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-mono text-[10px] text-[#2EA8FF] font-bold shrink-0">
                            {s.num}
                          </span>
                          <span className="font-semibold truncate text-[11px] group-hover:text-white">
                            {s.shortTitle}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[#2EA8FF] group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
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
