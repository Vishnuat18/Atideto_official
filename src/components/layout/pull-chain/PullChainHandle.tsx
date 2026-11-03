import React from 'react';
import { motion } from 'framer-motion';
import atidetoLogo from '@/assets/atideto/logo.png';

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
        cursor: isDragging ? 'grabbing' : 'grab',
        marginTop: '-1px', // ensures chain and connector touch seamlessly
      }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
    >
      {/* Metal connector clasp — bridges chain to logo */}
      <div className="flex flex-col items-center">
        {/* Connector barrel */}
        <div
          style={{
            width: '6px',
            height: '10px',
            background: 'linear-gradient(180deg, rgba(160,170,190,0.85), rgba(100,115,140,0.7), rgba(140,155,175,0.8))',
            borderRadius: '2px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.2)',
          }}
        />
        {/* Small ring */}
        <div
          style={{
            width: '10px',
            height: '10px',
            border: '1.5px solid rgba(160,175,200,0.7)',
            borderRadius: '50%',
            marginTop: '-1px',
            boxShadow: '0 0 3px rgba(150,170,200,0.25)',
          }}
        />
      </div>

      {/* Logo — directly touching the ring connector */}
      <img 
        src={atidetoLogo} 
        alt="Pull Menu" 
        className="select-none pointer-events-none"
        draggable="false"
        style={{
          width: '36px',
          height: '36px',
          objectFit: 'contain',
          marginTop: '-2px', // logo touches the ring
          filter: 'drop-shadow(0 0 14px rgba(0,102,255,0.55)) drop-shadow(0 0 6px rgba(46,168,255,0.35))',
        }}
      />
    </motion.div>
  );
}
