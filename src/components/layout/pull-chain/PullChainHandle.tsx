import React from 'react';
import { motion } from 'framer-motion';
import atidetoLogo from '@/assets/atideto-logo.png';

interface PullChainHandleProps {
  isDragging: boolean;
}

export default function PullChainHandle({
  isDragging
}: PullChainHandleProps) {
  return (
    <motion.div
      className="flex flex-col items-center select-none z-50 pointer-events-auto"
      style={{
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
    >
      <img 
        src={atidetoLogo} 
        alt="Pull Menu" 
        className="w-12 h-12 -mt-1 object-contain select-none pointer-events-none drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
        draggable="false"
      />
    </motion.div>
  );
}
