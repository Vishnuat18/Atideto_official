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
      <div className="w-2.5 h-4 bg-gradient-to-b from-white/70 to-white/20 rounded-t-sm -mt-1 z-10" />

      {/* Realistic Bead Chain */}
      <div 
        className="w-2 opacity-90 shadow-sm"
        style={{ 
          height: `${currentLength}px`,
          backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,1) 25%, rgba(200,200,220,0.8) 55%, transparent 65%)',
          backgroundSize: '100% 8px',
          backgroundRepeat: 'repeat-y',
          backgroundPosition: 'center top'
        }}
      />

      {/* Bottom connector */}
      <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-white/90 to-white/40 -mb-1 z-10 shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
    </div>
  );
}
