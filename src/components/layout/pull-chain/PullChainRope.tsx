import React from 'react';

interface PullChainRopeProps {
  pullAmount: number;
  ropeLength?: number;
}

export default function PullChainRope({
  pullAmount,
  ropeLength = 65
}: PullChainRopeProps) {
  const currentLength = ropeLength + pullAmount;
  const linkCount = Math.floor(currentLength / 6);
  
  return (
    <div className="flex flex-col items-center pointer-events-none" style={{ width: '8px' }}>
      {/* Top anchor pin — disappears into the top edge */}
      <div 
        className="rounded-b-sm"
        style={{
          width: '3px',
          height: '6px',
          background: 'linear-gradient(to bottom, rgba(160,170,190,0.6), rgba(130,140,160,0.4))',
        }}
      />

      {/* Metallic chain links */}
      <div className="flex flex-col items-center" style={{ gap: '0px' }}>
        {Array.from({ length: linkCount }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i % 2 === 0 ? '3px' : '2px',
              height: '5px',
              borderRadius: '1px',
              background: i % 2 === 0 
                ? 'linear-gradient(135deg, rgba(200,210,230,0.9), rgba(140,155,180,0.7), rgba(180,195,215,0.85))'
                : 'linear-gradient(135deg, rgba(160,175,200,0.7), rgba(120,135,160,0.5), rgba(150,165,185,0.65))',
              boxShadow: i % 3 === 0 
                ? '0 0 3px rgba(180,200,230,0.25)' 
                : 'none',
              marginTop: '-0.5px',
            }}
          />
        ))}
      </div>
    </div>
  );
}
