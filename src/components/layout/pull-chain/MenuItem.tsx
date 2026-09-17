import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

interface MenuItemProps {
  label: string;
  href: string;
  index: number;
  iconName: keyof typeof LucideIcons;
  onClick: () => void;
  activeThemeColor: string;
}

export default function MenuItem({
  label,
  href,
  index,
  iconName,
  onClick,
  activeThemeColor}: MenuItemProps) {
  const IconComponent = LucideIcons[iconName] as React.ComponentType<any>;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        to={href}
        onClick={onClick}
        className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm text-[#AFAFAF] hover:text-white hover:bg-white/5 transition-all duration-300 group relative overflow-hidden"
      >
        {/* Glow behind icon */}
        <span
          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg relative z-10 transition-all duration-300 group-hover:text-white"
          style={{
            borderColor: 'rgba(255, 255, 255, 0.05)'}}
        >
          {IconComponent && <IconComponent className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />}
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"
            style={{ backgroundColor: activeThemeColor }}
          />
        </span>

        <span className="font-semibold text-base tracking-wide transition-transform duration-300 group-hover:translate-x-1">
          {label}
        </span>

        {/* Arrow indicator */}
        <span className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
          <LucideIcons.ArrowRight className="w-4 h-4" style={{ color: activeThemeColor }} />
        </span>

        {/* Hover animated underline */}
        <span
          className="absolute bottom-0 left-4 right-4 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
          style={{ backgroundColor: activeThemeColor }}
        />
      </Link>
    </motion.div>
  );
}
