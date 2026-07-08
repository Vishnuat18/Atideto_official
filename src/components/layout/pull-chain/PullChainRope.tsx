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
      <div className="w-2 h-3 bg-gradient-to-b from-white/60 to-white/20 rounded-t-sm -mt-1 z-10" />

      {/* Realistic Bead Chain */}
      <div 
        className="w-1.5 opacity-90 shadow-sm"
        style={{ 
          height: `${currentLength}px`,
          backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.9) 20%, rgba(200,200,220,0.6) 50%, transparent 60%)',
          backgroundSize: '100% 6px',
          backgroundRepeat: 'repeat-y',
          backgroundPosition: 'center top'
        }}
      />

      {/* Bottom connector */}
      <div className="w-2 h-2 rounded-full bg-gradient-to-br from-white/80 to-white/30 -mb-1 z-10 shadow-[0_0_5px_rgba(255,255,255,0.5)]" />
    </div>
  );
}
