import React from 'react';

interface PullChainRopeProps {
  pullAmount: number;
  ropeLength?: number;
}

export default function PullChainRope({
  pullAmount,
  ropeLength = 60
}: PullChainRopeProps) {
  const currentLength = ropeLength + pullAmount;
  
  return (
    <div className="flex flex-col items-center pointer-events-none w-full">
      {/* Top connector (metal piece) */}
      <div className="w-2.5 h-4 bg-gradient-to-b from-[#94A3B8]/70 to-[#CBD5E1]/30 rounded-t-sm -mt-1 z-10" />

      {/* Realistic Bead Chain */}
      <div 
        className="w-2 opacity-90 shadow-sm"
        style={{ 
          height: `${currentLength}px`,
          backgroundImage: 'radial-gradient(circle at center, rgba(203,213,225,1) 25%, rgba(148,163,184,0.8) 55%, transparent 65%)',
          backgroundSize: '100% 8px',
          backgroundRepeat: 'repeat-y',
          backgroundPosition: 'center top'
        }}
      />

      {/* Bottom connector */}
      <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#94A3B8] to-[#CBD5E1] -mb-1 z-10 shadow-[0_2px_6px_rgba(15,23,42,0.15)]" />
    </div>
  );
}
