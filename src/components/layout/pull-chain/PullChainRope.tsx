import React from 'react';

interface PullChainRopeProps {
  theme: string;
  pullAmount: number; // 0 to 250px
  swayX: number; // side-to-side sway offset
  ropeLength?: number;
}

export default function PullChainRope({
  theme,
  pullAmount,
  swayX,
  ropeLength = 120}: PullChainRopeProps) {
  const currentLength = ropeLength + pullAmount;
  
  // Calculate control points for a natural hanging curve (quadratic bezier)
  // When idle, it swings (swayX controls the midpoint and end).
  // When pulled, it straightens out.
  const startX = 20;
  const startY = 0;
  const endX = 20 + swayX;
  const endY = currentLength;
  const controlX = 20 + swayX * 0.5;
  const controlY = currentLength * 0.5;

  const pathD = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;

  // Custom styling details for each page theme
  const getThemeRope = () => {
    switch (theme) {
      case 'services': // Braided Purple Rope
        return (
          <>
            <path
              d={pathD}
              fill="none"
              stroke="#6b21a8"
              strokeWidth="6"
              strokeLinecap="round"
              filter="url(#glow-purple)"
            />
            <path
              d={pathD}
              fill="none"
              stroke="#c084fc"
              strokeWidth="4"
              strokeDasharray="4 6"
              strokeLinecap="round"
            />
          </>
        );
      case 'academy': // Green Twisted Climbing Rope
        return (
          <>
            <path
              d={pathD}
              fill="none"
              stroke="#15803d"
              strokeWidth="7"
              strokeLinecap="round"
              filter="url(#glow-green)"
            />
            <path
              d={pathD}
              fill="none"
              stroke="#4ade80"
              strokeWidth="5"
              strokeDasharray="8 4"
              strokeLinecap="round"
            />
          </>
        );
      case 'about': // Stitched Brown Leather Strap
        return (
          <>
            {/* Outer strap */}
            <path
              d={pathD}
              fill="none"
              stroke="#7c2d12"
              strokeWidth="8"
              strokeLinecap="square"
            />
            {/* Stitching */}
            <path
              d={pathD}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              strokeLinecap="round"
            />
          </>
        );
      case 'client-connect': // Red Paracord
        return (
          <>
            <path
              d={pathD}
              fill="none"
              stroke="#dc2626"
              strokeWidth="5"
              strokeLinecap="round"
              filter="url(#glow-red)"
            />
            <path
              d={pathD}
              fill="none"
              stroke="#fca5a5"
              strokeWidth="3"
              strokeDasharray="2 3"
              strokeLinecap="round"
            />
          </>
        );
      case 'home':
      default: // Premium Silver Steel Chain
        return (
          <>
            {/* We draw individual interlocking chain links along the path */}
            {/* Render a backing cable */}
            <path
              d={pathD}
              fill="none"
              stroke="#4b5563"
              strokeWidth="2"
            />
            {/* Chain links */}
            {Array.from({ length: Math.ceil(currentLength / 12) }).map((_, i) => {
              const ratio = i / (currentLength / 12);
              // Interpolate quadratic bezier points to place links
              const t = Math.min(ratio, 1);
              const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * endX;
              const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * endY;
              const angle = Math.atan2(currentLength * t - controlY, endX - startX) * (180 / Math.PI);

              return (
                <rect
                  key={i}
                  x={x - 4}
                  y={y - 6}
                  width="8"
                  height="12"
                  rx="4"
                  fill="none"
                  stroke={i % 2 === 0 ? '#d1d5db' : '#9ca3af'}
                  strokeWidth="2.5"
                  transform={`rotate(${angle + (i % 2 === 0 ? 0 : 90)}, ${x}, ${y})`}
                  style={{
                    filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.6))'}}
                />
              );
            })}
          </>
        );
    }
  };

  return (
    <svg
      width="100"
      height={currentLength + 20}
      className="absolute top-0 pointer-events-none"
      style={{
        left: 'calc(100% - 70px)',
        transform: 'translateX(-50%)',
        overflow: 'visible'}}
    >
      <defs>
        {/* Glow Filters */}
        <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ceiling Mount */}
      <rect x="12" y="0" width="16" height="5" rx="1" fill="#1f2937" stroke="#4b5563" strokeWidth="1" />
      <circle cx="20" cy="5" r="3" fill="#9ca3af" />

      {/* Rope/Chain Body */}
      {getThemeRope()}

      {/* Bottom Connector */}
      <circle cx={endX} cy={endY} r="4" fill={theme === 'about' ? '#d97706' : '#6b7280'} />
    </svg>
  );
}
