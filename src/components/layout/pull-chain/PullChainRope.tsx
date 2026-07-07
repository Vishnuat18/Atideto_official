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
      {/* Ceiling mount dot */}
      <div className="w-1.5 h-1.5 rounded-full bg-white/40 -mt-1 z-10" />

      {/* Simple thin rope line */}
      <div 
        className="w-[1px] bg-white/30"
        style={{ height: `${currentLength}px` }}
      />

      {/* Bottom connector dot */}
      <div className="w-1 h-1 rounded-full bg-white/40 -mb-1 z-10" />
    </div>
  );
}
