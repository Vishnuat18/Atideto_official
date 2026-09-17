import React from 'react';
import { motion } from 'framer-motion';
import atidetoLogo from '@/assets/atideto/logo.png';

interface LogoLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  className?: string;
}

export default function LogoLoader({ 
  size = 'fullscreen', 
  className = '' 
}: LogoLoaderProps) {
  const logoDimensions = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    fullscreen: 'w-20 h-20 sm:w-24 sm:h-24'
  };

  const containerClasses = size === 'fullscreen' 
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-[#050505]'
    : 'flex items-center justify-center p-8 w-full';

  return (
    <div className={`${containerClasses} ${className}`} role="status" aria-label="Loading">
      <div className={`relative ${logoDimensions[size]} flex items-center justify-center select-none`}>
        {/* Strictly the Atideto logo with an elegant breathing skeleton pulse */}
        <motion.img
          src={atidetoLogo}
          alt="Loading..."
          className="w-full h-full object-contain"
          animate={{
            opacity: [0.35, 1, 0.35],
            scale: [0.96, 1.04, 0.96]
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>
    </div>
  );
}
