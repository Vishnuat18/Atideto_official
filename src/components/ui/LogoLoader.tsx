import React, { useState, useEffect } from 'react';
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
  const [isDismissed, setIsDismissed] = useState(false);

  // Failsafe auto-dismiss after 1.0s so loader NEVER blocks content
  useEffect(() => {
    if (size === 'fullscreen') {
      const timer = setTimeout(() => {
        setIsDismissed(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [size]);

  if (isDismissed) return null;

  const logoDimensions = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    fullscreen: 'w-16 h-16 sm:w-20 sm:h-20'
  };

  const containerClasses = size === 'fullscreen' 
    ? 'fixed inset-0 z-[999] flex items-center justify-center bg-[#050505]/70 backdrop-blur-sm pointer-events-none transition-opacity duration-300'
    : 'flex items-center justify-center p-8 w-full';

  return (
    <div className={`${containerClasses} ${className}`} role="status" aria-label="Loading">
      <div className={`relative ${logoDimensions[size]} flex items-center justify-center select-none`}>
        {/* Strictly the Atideto 'A' logo with an elegant breathing pulse */}
        <motion.img
          src={atidetoLogo}
          alt="Loading..."
          className="w-full h-full object-contain filter drop-shadow-[0_0_24px_rgba(0,102,255,0.5)]"
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [0.96, 1.04, 0.96]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>
    </div>
  );
}
