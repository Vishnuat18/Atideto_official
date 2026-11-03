import React from 'react';

interface SectionHeaderProps {
  number?: string;
  category: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
  italicWord?: string;
  theme?: 'dark' | 'light' | 'blue';
}

export default function SectionHeader({
  number = '02',
  category,
  title,
  highlight,
  subtitle,
  align = 'left',
  className = '',
  italicWord,
  theme = 'dark',
}: SectionHeaderProps) {
  const isLight = theme === 'light';
  const isBlue = theme === 'blue';
  const isCenter = align === 'center';

  return (
    <div className={`mb-10 sm:mb-14 flex flex-col ${isCenter ? 'items-center text-center' : 'items-start text-left'} ${className}`}>
      {/* Eyebrow: ── CATEGORY (Matching 2nd Reference Image, No Number) */}
      <div className="inline-flex items-center gap-3 mb-3.5 select-none">
        <span className={`w-8 sm:w-10 h-[1.5px] ${isBlue ? 'bg-white/50' : isLight ? 'bg-zinc-400' : 'bg-[#0052FF]'} shrink-0`} />
        <span className={`text-xs sm:text-sm font-bold tracking-[0.2em] uppercase font-heading ${
          isBlue ? 'text-white/95' : isLight ? 'text-zinc-700' : 'text-[#2EA8FF]'
        }`}>
          {category}
        </span>
      </div>

      {/* Main Heading: Plus Jakarta Sans — 36px Desktop, 28px Mobile, Weight 700 */}
      <h2
        className={`text-[28px] sm:text-[36px] font-bold tracking-tight mb-4 leading-[1.2] font-heading text-white ${
          isLight ? '!text-[#0F172A]' : 'text-white'
        }`}
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {title}{' '}
        {highlight && (
          <span className={isLight ? 'text-[#0F172A]' : 'text-white'}>
            {highlight}
          </span>
        )}
        {italicWord && (
          <span className={`italic font-bold ml-2 ${isLight ? 'text-[#0F172A]' : 'text-white'}`}>
            {italicWord}
          </span>
        )}
      </h2>

      {/* Subtitle: INTER */}
      {subtitle && (
        <p
          className={`text-sm sm:text-base leading-relaxed font-normal max-w-2xl ${
            isBlue ? 'text-blue-100' : isLight ? 'text-[#475569]' : 'text-slate-300'
          }`}
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
