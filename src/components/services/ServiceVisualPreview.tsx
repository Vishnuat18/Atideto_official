import React from 'react';

interface ServiceVisualPreviewProps {
  id: string;
}

export default function ServiceVisualPreview({ id }: ServiceVisualPreviewProps) {
  // Borderless icon canvas: clean, floating naturally in the card without any surrounding box or border
  const containerClass =
    'w-full h-24 sm:h-36 lg:h-40 flex items-center justify-center relative select-none pointer-events-none [&>svg]:max-w-[76px] [&>svg]:max-h-[76px] sm:[&>svg]:max-w-none sm:[&>svg]:max-h-none';

  // Common SVG gradients & filters for the Image 1 Shaded Blue style
  const SvgDefs = () => (
    <defs>
      {/* 3D Blue Shaded Linear Gradients (Image 1 reference) */}
      <linearGradient id="blueShadePrimary" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00F0FF" />
        <stop offset="45%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0052FF" />
      </linearGradient>

      <linearGradient id="blueShadeSoft" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#0052FF" stopOpacity="0.25" />
      </linearGradient>

      <linearGradient id="blueShadeDark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E3A8A" />
        <stop offset="100%" stopColor="#0B1933" />
      </linearGradient>

      {/* Radial Glow Core */}
      <radialGradient id="cyanOrbGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.6" />
        <stop offset="60%" stopColor="#0052FF" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#0052FF" stopOpacity="0" />
      </radialGradient>

      {/* Cyan Neon Filter */}
      <filter id="cyanGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
  );

  switch (id) {
    // ═════════════════════════════════════════════════════════════════════
    // 1. CRM: DEPLOY & ESTABLISHED ECOSYSTEM (Image 1 #8 DEPLOY + Image 2 #9)
    // ═════════════════════════════════════════════════════════════════════
    case 'crm':
      return (
        <div className={containerClass}>
          <svg className="w-28 h-28 sm:w-32 sm:h-32 overflow-visible" viewBox="0 0 120 120" fill="none">
            <SvgDefs />

            {/* ── B&W Default State (Image 2 style) ── */}
            <g className="transition-opacity duration-500 opacity-100 group-hover:opacity-0">
              {/* Central Isometric Hub Cube */}
              <polygon points="60,42 76,51 60,60 44,51" fill="#1E2433" stroke="#FFFFFF" strokeWidth="1.6" />
              <polygon points="44,51 60,60 60,78 44,69" fill="#121620" stroke="#FFFFFF" strokeWidth="1.6" />
              <polygon points="60,60 76,51 76,69 60,78" fill="#0C0E14" stroke="#FFFFFF" strokeWidth="1.6" />

              {/* 4 Diagonal Branching Rails with Pods */}
              <line x1="44" y1="51" x2="24" y2="33" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="24" cy="33" r="7" fill="#161B26" stroke="#FFFFFF" strokeWidth="1.6" />
              <path d="M 22 35 L 26 31 M 22 31 L 26 31 L 26 35" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />

              <line x1="76" y1="51" x2="96" y2="33" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="96" cy="33" r="7" fill="#161B26" stroke="#FFFFFF" strokeWidth="1.6" />
              <path d="M 94 35 L 98 31 M 98 35 L 98 31 L 94 31" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />

              <line x1="44" y1="69" x2="24" y2="87" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="24" cy="87" r="7" fill="#161B26" stroke="#FFFFFF" strokeWidth="1.6" />
              <path d="M 22 85 L 26 89 M 22 89 L 26 89 L 26 85" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />

              <line x1="76" y1="69" x2="96" y2="87" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="96" cy="87" r="7" fill="#161B26" stroke="#FFFFFF" strokeWidth="1.6" />
              <path d="M 98 85 L 94 89 M 98 89 L 94 89 L 94 85" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
            </g>

            {/* ── Shaded Blue Hover State (Image 1 DEPLOY style) ── */}
            <g className="transition-opacity duration-500 opacity-0 group-hover:opacity-100">
              <circle cx="60" cy="60" r="28" fill="url(#cyanOrbGlow)" />

              {/* Shaded Central Prism */}
              <polygon points="60,42 76,51 60,60 44,51" fill="url(#blueShadePrimary)" stroke="#FFFFFF" strokeWidth="1.5" />
              <polygon points="44,51 60,60 60,78 44,69" fill="url(#blueShadeSoft)" stroke="#00F0FF" strokeWidth="1.2" />
              <polygon points="60,60 76,51 76,69 60,78" fill="url(#blueShadeDark)" stroke="#38BDF8" strokeWidth="1.2" />

              {/* Luminous Diagonal Rails & Spherical Shaded Pods */}
              <line x1="44" y1="51" x2="24" y2="33" stroke="#00F0FF" strokeWidth="1.8" />
              <circle cx="24" cy="33" r="8" fill="url(#blueShadePrimary)" stroke="#FFFFFF" strokeWidth="1.5" />
              <path d="M 21 35 L 27 29 M 22 29 L 27 29 L 27 34" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />

              <line x1="76" y1="51" x2="96" y2="33" stroke="#00F0FF" strokeWidth="1.8" />
              <circle cx="96" cy="33" r="8" fill="url(#blueShadePrimary)" stroke="#FFFFFF" strokeWidth="1.5" />
              <path d="M 99 35 L 93 29 M 98 29 L 93 29 L 93 34" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />

              <line x1="44" y1="69" x2="24" y2="87" stroke="#00F0FF" strokeWidth="1.8" />
              <circle cx="24" cy="87" r="8" fill="url(#blueShadePrimary)" stroke="#FFFFFF" strokeWidth="1.5" />
              <path d="M 21 85 L 27 91 M 22 91 L 27 91 L 27 86" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />

              <line x1="76" y1="69" x2="96" y2="87" stroke="#00F0FF" strokeWidth="1.8" />
              <circle cx="96" cy="87" r="8" fill="url(#blueShadePrimary)" stroke="#FFFFFF" strokeWidth="1.5" />
              <path d="M 99 85 L 93 91 M 98 91 L 93 91 L 93 86" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      );

    // ═════════════════════════════════════════════════════════════════════
    // 2. BILLING SYSTEM: DEPTH & CYLINDERS (Image 1 #9 DEPTH + Image 2 #3)
    // ═════════════════════════════════════════════════════════════════════
    case 'billing-system':
      return (
        <div className={containerClass}>
          <svg className="w-28 h-28 sm:w-32 sm:h-32 overflow-visible" viewBox="0 0 120 120" fill="none">
            <SvgDefs />

            {/* B&W Default State */}
            <g className="transition-opacity duration-500 opacity-100 group-hover:opacity-0">
              {/* Stacked Ledger Cylinder Discs */}
              <ellipse cx="60" cy="38" rx="36" ry="12" fill="#1A202C" stroke="#FFFFFF" strokeWidth="1.6" />
              <path d="M 24 38 C 24 50, 96 50, 96 38" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
              <path d="M 24 52 C 24 64, 96 64, 96 52" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
              <path d="M 24 66 C 24 78, 96 78, 96 66" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
              <path d="M 24 80 C 24 92, 96 92, 96 80" stroke="#FFFFFF" strokeWidth="1.6" fill="none" />
              <line x1="24" y1="38" x2="24" y2="80" stroke="#FFFFFF" strokeWidth="1.6" />
              <line x1="96" y1="38" x2="96" y2="80" stroke="#FFFFFF" strokeWidth="1.6" />
              <ellipse cx="60" cy="38" rx="14" ry="5" fill="#0C0E14" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 2" />
            </g>

            {/* Shaded Blue Hover State (Image 1 DEPTH style) */}
            <g className="transition-opacity duration-500 opacity-0 group-hover:opacity-100">
              <ellipse cx="60" cy="58" rx="40" ry="24" fill="url(#cyanOrbGlow)" />
              {/* Volumetric Gradient Cylinder Body */}
              <path d="M 24 38 C 24 50, 96 50, 96 38 L 96 80 C 96 92, 24 92, 24 80 Z" fill="url(#blueShadeSoft)" />
              <ellipse cx="60" cy="38" rx="36" ry="12" fill="url(#blueShadePrimary)" stroke="#FFFFFF" strokeWidth="1.6" />
              {/* Rib Highlights */}
              <path d="M 24 52 C 24 64, 96 64, 96 52" stroke="#00F0FF" strokeWidth="1.5" fill="none" />
              <path d="M 24 66 C 24 78, 96 78, 96 66" stroke="#38BDF8" strokeWidth="1.5" fill="none" />
              <path d="M 24 80 C 24 92, 96 92, 96 80" stroke="#00F0FF" strokeWidth="1.6" fill="none" />
              <line x1="24" y1="38" x2="24" y2="80" stroke="#00F0FF" strokeWidth="1.6" />
              <line x1="96" y1="38" x2="96" y2="80" stroke="#00F0FF" strokeWidth="1.6" />
              <ellipse cx="60" cy="38" rx="14" ry="5" fill="#081A36" stroke="#FFFFFF" strokeWidth="1.2" />
            </g>
          </svg>
        </div>
      );

    // ═════════════════════════════════════════════════════════════════════
    // 3. ERP: LAYERS (Image 1 #3 LAYERS + Image 2 #12)
    // ═════════════════════════════════════════════════════════════════════
    case 'erp':
      return (
        <div className={containerClass}>
          <svg className="w-28 h-28 sm:w-32 sm:h-32 overflow-visible" viewBox="0 0 120 120" fill="none">
            <SvgDefs />

            {/* B&W Default State */}
            <g className="transition-opacity duration-500 opacity-100 group-hover:opacity-0">
              {/* Layer 3 (Bottom) */}
              <polygon points="60,64 96,78 60,92 24,78" fill="#101520" stroke="#FFFFFF" strokeWidth="1.5" />
              {/* Layer 2 (Middle) */}
              <polygon points="60,48 96,62 60,76 24,62" fill="#182030" stroke="#FFFFFF" strokeWidth="1.5" />
              {/* Layer 1 (Top) */}
              <polygon points="60,32 96,46 60,60 24,46" fill="#222C40" stroke="#FFFFFF" strokeWidth="1.6" />
              {/* Vertical Penetrating Light Rails */}
              <line x1="48" y1="28" x2="48" y2="78" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 2" />
              <line x1="72" y1="28" x2="72" y2="78" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 2" />
            </g>

            {/* Shaded Blue Hover State (Image 1 LAYERS style) */}
            <g className="transition-opacity duration-500 opacity-0 group-hover:opacity-100">
              <circle cx="60" cy="60" r="32" fill="url(#cyanOrbGlow)" />
              {/* Translucent Luminous Glass Plates */}
              <polygon points="60,64 96,78 60,92 24,78" fill="url(#blueShadeDark)" stroke="#38BDF8" strokeWidth="1.2" opacity="0.8" />
              <polygon points="60,48 96,62 60,76 24,62" fill="url(#blueShadeSoft)" stroke="#00F0FF" strokeWidth="1.4" opacity="0.9" />
              <polygon points="60,32 96,46 60,60 24,46" fill="url(#blueShadePrimary)" stroke="#FFFFFF" strokeWidth="1.6" />
              {/* Neon Vertical Conduit Beams */}
              <line x1="48" y1="24" x2="48" y2="82" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              <line x1="72" y1="24" x2="72" y2="82" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      );

    // ═════════════════════════════════════════════════════════════════════
    // 4. INVENTORY MANAGEMENT: DIMENSION (Image 1 #10 DIMENSION + Image 2 #15)
    // ═════════════════════════════════════════════════════════════════════
    case 'inventory-management':
      return (
        <div className={containerClass}>
          <svg className="w-28 h-28 sm:w-32 sm:h-32 overflow-visible" viewBox="0 0 120 120" fill="none">
            <SvgDefs />

            {/* B&W Default State */}
            <g className="transition-opacity duration-500 opacity-100 group-hover:opacity-0">
              {/* Outer Embracing Hexagonal Brackets */}
              <polygon points="60,26 90,42 90,56 60,40 30,56 30,42" fill="#1E2433" stroke="#FFFFFF" strokeWidth="1.5" />
              <polygon points="30,42 60,40 60,82 30,96" fill="#121620" stroke="#FFFFFF" strokeWidth="1.5" />
              <polygon points="90,42 60,40 60,82 90,96" fill="#0C0E14" stroke="#FFFFFF" strokeWidth="1.5" />
              {/* Inner Floating Wireframe Cube */}
              <polygon points="60,48 74,56 60,64 46,56" fill="none" stroke="#FFFFFF" strokeWidth="1.6" />
              <polygon points="46,56 60,64 60,78 46,70" fill="none" stroke="#FFFFFF" strokeWidth="1.4" />
              <polygon points="60,64 74,56 74,70 60,78" fill="none" stroke="#FFFFFF" strokeWidth="1.4" />
            </g>

            {/* Shaded Blue Hover State (Image 1 DIMENSION style) */}
            <g className="transition-opacity duration-500 opacity-0 group-hover:opacity-100">
              <circle cx="60" cy="60" r="32" fill="url(#cyanOrbGlow)" />
              {/* Shaded Outer Volumetric Faces */}
              <polygon points="60,26 90,42 90,56 60,40 30,56 30,42" fill="url(#blueShadePrimary)" stroke="#FFFFFF" strokeWidth="1.5" />
              <polygon points="30,42 60,40 60,82 30,96" fill="url(#blueShadeSoft)" stroke="#00F0FF" strokeWidth="1.2" />
              <polygon points="90,42 60,40 60,82 90,96" fill="url(#blueShadeDark)" stroke="#38BDF8" strokeWidth="1.2" />
              {/* Glowing Inner Cube Core */}
              <polygon points="60,48 74,56 60,64 46,56" fill="#FFFFFF" fillOpacity="0.25" stroke="#FFFFFF" strokeWidth="1.8" />
              <polygon points="46,56 60,64 60,78 46,70" fill="#00F0FF" fillOpacity="0.25" stroke="#00F0FF" strokeWidth="1.5" />
              <polygon points="60,64 74,56 74,70 60,78" fill="#38BDF8" fillOpacity="0.25" stroke="#38BDF8" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      );

    // ═════════════════════════════════════════════════════════════════════
    // 5. SCHOOL ERP: VOLUME (Image 1 #14 VOLUME + Image 2 #2 THRIVING PEOPLE)
    // ═════════════════════════════════════════════════════════════════════
    case 'school-erp':
      return (
        <div className={containerClass}>
          <svg className="w-28 h-28 sm:w-32 sm:h-32 overflow-visible" viewBox="0 0 120 120" fill="none">
            <SvgDefs />

            {/* B&W Default State */}
            <g className="transition-opacity duration-500 opacity-100 group-hover:opacity-0">
              {/* Translucent Gaussian Bell Curve Layers */}
              <path d="M 22 92 C 38 92, 46 42, 60 42 C 74 42, 82 92, 98 92 Z" fill="#1A2230" stroke="#FFFFFF" strokeWidth="1.6" />
              <path d="M 28 92 C 40 92, 48 54, 60 54 C 72 54, 80 92, 92 92 Z" fill="#121824" stroke="#94A3B8" strokeWidth="1.2" />
              <line x1="18" y1="92" x2="102" y2="92" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
              {/* Top Apex Node */}
              <circle cx="60" cy="42" r="3" fill="#FFFFFF" />
            </g>

            {/* Shaded Blue Hover State (Image 1 VOLUME style) */}
            <g className="transition-opacity duration-500 opacity-0 group-hover:opacity-100">
              <circle cx="60" cy="62" r="32" fill="url(#cyanOrbGlow)" />
              {/* Soft Translucent Shaded Waves */}
              <path d="M 22 92 C 38 92, 46 42, 60 42 C 74 42, 82 92, 98 92 Z" fill="url(#blueShadeSoft)" stroke="#FFFFFF" strokeWidth="1.8" />
              <path d="M 28 92 C 40 92, 48 54, 60 54 C 72 54, 80 92, 92 92 Z" fill="url(#blueShadePrimary)" stroke="#00F0FF" strokeWidth="1.5" opacity="0.85" />
              <line x1="18" y1="92" x2="102" y2="92" stroke="#00F0FF" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="60" cy="42" r="4" fill="#FFFFFF" stroke="#00F0FF" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      );

    // ═════════════════════════════════════════════════════════════════════
    // 6. HOTEL MANAGEMENT: ALIGN (Image 1 #13 ALIGN + Image 2 #11)
    // ═════════════════════════════════════════════════════════════════════
    case 'hotel-management':
      return (
        <div className={containerClass}>
          <svg className="w-28 h-28 sm:w-32 sm:h-32 overflow-visible" viewBox="0 0 120 120" fill="none">
            <SvgDefs />

            {/* B&W Default State */}
            <g className="transition-opacity duration-500 opacity-100 group-hover:opacity-0">
              {/* Sphere Discs with Aperture */}
              <circle cx="60" cy="60" r="34" fill="#141A26" stroke="#FFFFFF" strokeWidth="1.6" />
              <circle cx="56" cy="60" r="28" fill="#1A2233" stroke="#94A3B8" strokeWidth="1.2" strokeDasharray="3 3" />
              <rect x="52" y="52" width="16" height="16" rx="2" fill="#0C0E14" stroke="#FFFFFF" strokeWidth="1.6" />
              <circle cx="60" cy="60" r="3" fill="#FFFFFF" />
            </g>

            {/* Shaded Blue Hover State (Image 1 ALIGN style) */}
            <g className="transition-opacity duration-500 opacity-0 group-hover:opacity-100">
              <circle cx="60" cy="60" r="38" fill="url(#cyanOrbGlow)" />
              <circle cx="60" cy="60" r="34" fill="url(#blueShadePrimary)" stroke="#FFFFFF" strokeWidth="1.6" />
              <circle cx="56" cy="60" r="28" fill="url(#blueShadeSoft)" stroke="#00F0FF" strokeWidth="1.2" />
              <rect x="52" y="52" width="16" height="16" rx="2" fill="#081A36" stroke="#FFFFFF" strokeWidth="1.8" />
              <circle cx="60" cy="60" r="3.5" fill="#00F0FF" />
            </g>
          </svg>
        </div>
      );

    // ═════════════════════════════════════════════════════════════════════
    // 7. GYM MANAGEMENT: PERFORMANCE (Image 1 #1 PERFORMANCE)
    // ═════════════════════════════════════════════════════════════════════
    case 'gym-management':
      return (
        <div className={containerClass}>
          <svg className="w-28 h-28 sm:w-32 sm:h-32 overflow-visible" viewBox="0 0 120 120" fill="none">
            <SvgDefs />

            {/* B&W Default State */}
            <g className="transition-opacity duration-500 opacity-100 group-hover:opacity-0">
              {/* Concentric 3D Acoustic / Velocity Discs */}
              <ellipse cx="42" cy="60" rx="10" ry="24" fill="#121824" stroke="#FFFFFF" strokeWidth="1.5" />
              <ellipse cx="58" cy="60" rx="12" ry="30" fill="#1A2233" stroke="#FFFFFF" strokeWidth="1.5" />
              <ellipse cx="76" cy="60" rx="14" ry="36" fill="#242F46" stroke="#FFFFFF" strokeWidth="1.6" />
              {/* Axial Vector Arrow */}
              <line x1="22" y1="60" x2="98" y2="60" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
              <polygon points="98,60 90,56 90,64" fill="#FFFFFF" />
            </g>

            {/* Shaded Blue Hover State (Image 1 PERFORMANCE style) */}
            <g className="transition-opacity duration-500 opacity-0 group-hover:opacity-100">
              <circle cx="60" cy="60" r="36" fill="url(#cyanOrbGlow)" />
              {/* Volumetric Shaded Gradient Discs */}
              <ellipse cx="42" cy="60" rx="10" ry="24" fill="url(#blueShadeDark)" stroke="#38BDF8" strokeWidth="1.2" />
              <ellipse cx="58" cy="60" rx="12" ry="30" fill="url(#blueShadeSoft)" stroke="#00F0FF" strokeWidth="1.4" />
              <ellipse cx="76" cy="60" rx="14" ry="36" fill="url(#blueShadePrimary)" stroke="#FFFFFF" strokeWidth="1.8" />
              {/* Luminous Neon Velocity Arrow */}
              <line x1="22" y1="60" x2="98" y2="60" stroke="#00F0FF" strokeWidth="2.2" strokeLinecap="round" />
              <polygon points="100,60 92,55 92,65" fill="#FFFFFF" />
            </g>
          </svg>
        </div>
      );

    // ═════════════════════════════════════════════════════════════════════
    // 8. LIBRARY MANAGEMENT: SCALE (Image 1 #7 SCALE + Image 2 #12)
    // ═════════════════════════════════════════════════════════════════════
    case 'library-management':
      return (
        <div className={containerClass}>
          <svg className="w-28 h-28 sm:w-32 sm:h-32 overflow-visible" viewBox="0 0 120 120" fill="none">
            <SvgDefs />

            {/* B&W Default State */}
            <g className="transition-opacity duration-500 opacity-100 group-hover:opacity-0">
              {/* Coordinate Grid Axes with Arrows */}
              <line x1="28" y1="88" x2="28" y2="28" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
              <polygon points="28,26 25,32 31,32" fill="#FFFFFF" />
              <line x1="28" y1="88" x2="88" y2="88" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
              <polygon points="90,88 84,85 84,91" fill="#FFFFFF" />
              {/* Nested Scaling Cubes */}
              <rect x="32" y="38" width="46" height="46" fill="#141B28" stroke="#FFFFFF" strokeWidth="1.5" />
              <rect x="32" y="56" width="28" height="28" fill="#1E283C" stroke="#FFFFFF" strokeWidth="1.5" />
              <rect x="32" y="70" width="14" height="14" fill="#2E3C57" stroke="#FFFFFF" strokeWidth="1.5" />
            </g>

            {/* Shaded Blue Hover State (Image 1 SCALE style) */}
            <g className="transition-opacity duration-500 opacity-0 group-hover:opacity-100">
              <circle cx="58" cy="58" r="34" fill="url(#cyanOrbGlow)" />
              {/* Glowing Axis */}
              <line x1="28" y1="88" x2="28" y2="28" stroke="#00F0FF" strokeWidth="1.8" strokeLinecap="round" />
              <polygon points="28,24 24,31 32,31" fill="#00F0FF" />
              <line x1="28" y1="88" x2="88" y2="88" stroke="#00F0FF" strokeWidth="1.8" strokeLinecap="round" />
              <polygon points="92,88 85,84 85,92" fill="#00F0FF" />
              {/* Shaded Volumetric Gradient Blocks */}
              <rect x="32" y="38" width="46" height="46" fill="url(#blueShadePrimary)" stroke="#FFFFFF" strokeWidth="1.5" />
              <rect x="32" y="56" width="28" height="28" fill="url(#blueShadeSoft)" stroke="#00F0FF" strokeWidth="1.4" />
              <rect x="32" y="70" width="14" height="14" fill="url(#blueShadeDark)" stroke="#FFFFFF" strokeWidth="1.4" />
            </g>
          </svg>
        </div>
      );

    // ═════════════════════════════════════════════════════════════════════
    // 9. TRANSPORT MANAGEMENT: FLOW (Image 1 #4 FLOW + Image 2 #6)
    // ═════════════════════════════════════════════════════════════════════
    case 'transport-management':
      return (
        <div className={containerClass}>
          <svg className="w-28 h-28 sm:w-32 sm:h-32 overflow-visible" viewBox="0 0 120 120" fill="none">
            <SvgDefs />

            {/* B&W Default State */}
            <g className="transition-opacity duration-500 opacity-100 group-hover:opacity-0">
              {/* Concentric Telemetry Orbit Rings */}
              <circle cx="60" cy="60" r="34" stroke="#FFFFFF" strokeWidth="1.6" fill="none" />
              <circle cx="60" cy="60" r="26" stroke="#94A3B8" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
              <circle cx="60" cy="60" r="18" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
              <circle cx="60" cy="60" r="9" fill="#1C2433" stroke="#FFFFFF" strokeWidth="1.6" />
              <circle cx="60" cy="60" r="3" fill="#FFFFFF" />
            </g>

            {/* Shaded Blue Hover State (Image 1 FLOW style) */}
            <g className="transition-opacity duration-500 opacity-0 group-hover:opacity-100">
              <circle cx="60" cy="60" r="36" fill="url(#cyanOrbGlow)" />
              <circle cx="60" cy="60" r="34" stroke="#38BDF8" strokeWidth="1.6" fill="none" />
              <circle cx="60" cy="60" r="26" stroke="#00F0FF" strokeWidth="1.4" strokeDasharray="4 3" fill="none" />
              <circle cx="60" cy="60" r="18" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
              <circle cx="60" cy="60" r="9" fill="url(#blueShadePrimary)" stroke="#FFFFFF" strokeWidth="1.6" />
              <circle cx="60" cy="60" r="3.5" fill="#FFFFFF" />
            </g>
          </svg>
        </div>
      );

    // ═════════════════════════════════════════════════════════════════════
    // 10. SCM SUPPLY CHAIN: EVOLVE (Image 1 #2 EVOLVE + Image 2 #1)
    // ═════════════════════════════════════════════════════════════════════
    case 'scm':
      return (
        <div className={containerClass}>
          <svg className="w-28 h-28 sm:w-32 sm:h-32 overflow-visible" viewBox="0 0 120 120" fill="none">
            <SvgDefs />

            {/* B&W Default State */}
            <g className="transition-opacity duration-500 opacity-100 group-hover:opacity-0">
              {/* Intersecting Orbit Rings Around Center Sphere */}
              <ellipse cx="60" cy="60" rx="36" ry="18" stroke="#FFFFFF" strokeWidth="1.5" fill="none" className="transform -rotate-30 origin-[60px_60px]" />
              <ellipse cx="60" cy="60" rx="36" ry="18" stroke="#FFFFFF" strokeWidth="1.5" fill="none" className="transform rotate-30 origin-[60px_60px]" />
              <circle cx="60" cy="60" r="22" fill="#182030" stroke="#FFFFFF" strokeWidth="1.6" />
              {/* Orbit Satellite Nodes */}
              <circle cx="34" cy="46" r="3.5" fill="#FFFFFF" />
              <circle cx="86" cy="74" r="3.5" fill="#FFFFFF" />
            </g>

            {/* Shaded Blue Hover State (Image 1 EVOLVE style) */}
            <g className="transition-opacity duration-500 opacity-0 group-hover:opacity-100">
              <circle cx="60" cy="60" r="36" fill="url(#cyanOrbGlow)" />
              {/* Shaded Luminous Center Globe */}
              <circle cx="60" cy="60" r="22" fill="url(#blueShadePrimary)" stroke="#FFFFFF" strokeWidth="1.6" />
              {/* Luminous Neon Trajectory Rings */}
              <ellipse cx="60" cy="60" rx="36" ry="18" stroke="#00F0FF" strokeWidth="1.8" fill="none" className="transform -rotate-30 origin-[60px_60px]" />
              <ellipse cx="60" cy="60" rx="36" ry="18" stroke="#38BDF8" strokeWidth="1.8" fill="none" className="transform rotate-30 origin-[60px_60px]" />
              {/* Glowing Satellites */}
              <circle cx="34" cy="46" r="4" fill="#FFFFFF" stroke="#00F0FF" strokeWidth="1.5" />
              <circle cx="86" cy="74" r="4" fill="#FFFFFF" stroke="#00F0FF" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      );

    // ═════════════════════════════════════════════════════════════════════
    // 11. LMS: UPDATE (Image 1 #11 UPDATE + Image 2 #7)
    // ═════════════════════════════════════════════════════════════════════
    case 'lms':
      return (
        <div className={containerClass}>
          <svg className="w-28 h-28 sm:w-32 sm:h-32 overflow-visible" viewBox="0 0 120 120" fill="none">
            <SvgDefs />

            {/* B&W Default State */}
            <g className="transition-opacity duration-500 opacity-100 group-hover:opacity-0">
              {/* Overlapping Square Tiles */}
              <rect x="30" y="30" width="46" height="46" rx="3" fill="#121824" stroke="#94A3B8" strokeWidth="1.2" />
              <rect x="44" y="44" width="46" height="46" rx="3" fill="#1E283C" stroke="#FFFFFF" strokeWidth="1.6" />
              {/* Continuous Refresh Loop Arrow */}
              <path d="M 67 56 A 12 12 0 1 1 55 68" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              <polygon points="69,52 69,60 61,56" fill="#FFFFFF" />
            </g>

            {/* Shaded Blue Hover State (Image 1 UPDATE style) */}
            <g className="transition-opacity duration-500 opacity-0 group-hover:opacity-100">
              <circle cx="60" cy="60" r="34" fill="url(#cyanOrbGlow)" />
              {/* Shaded Blue Tiles */}
              <rect x="30" y="30" width="46" height="46" rx="3" fill="url(#blueShadeDark)" stroke="#38BDF8" strokeWidth="1.2" />
              <rect x="44" y="44" width="46" height="46" rx="3" fill="url(#blueShadePrimary)" stroke="#FFFFFF" strokeWidth="1.6" />
              {/* Neon Refresh Loop */}
              <path d="M 67 56 A 12 12 0 1 1 55 68" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <polygon points="70,51 70,61 61,56" fill="#00F0FF" />
            </g>
          </svg>
        </div>
      );

    // ═════════════════════════════════════════════════════════════════════
    // 12. SMS: TRUSTED COMPANY & SEAL (Image 2 #5 + Image 1 #7)
    // ═════════════════════════════════════════════════════════════════════
    case 'sms':
      return (
        <div className={containerClass}>
          <svg className="w-28 h-28 sm:w-32 sm:h-32 overflow-visible" viewBox="0 0 120 120" fill="none">
            <SvgDefs />

            {/* B&W Default State */}
            <g className="transition-opacity duration-500 opacity-100 group-hover:opacity-0">
              {/* Rosette Ribbon Seal */}
              <circle cx="60" cy="52" r="22" fill="#1C2433" stroke="#FFFFFF" strokeWidth="1.6" />
              <path d="M 52 52 L 58 58 L 68 48" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              {/* Ribbon Streamers */}
              <polygon points="52,70 52,90 60,84 68,90 68,70" fill="#141B26" stroke="#FFFFFF" strokeWidth="1.5" />
              {/* Orbiting Verification Nodes */}
              <circle cx="34" cy="52" r="2.5" fill="#FFFFFF" />
              <circle cx="86" cy="52" r="2.5" fill="#FFFFFF" />
            </g>

            {/* Shaded Blue Hover State */}
            <g className="transition-opacity duration-500 opacity-0 group-hover:opacity-100">
              <circle cx="60" cy="56" r="32" fill="url(#cyanOrbGlow)" />
              {/* Shaded Blue Medal & Streamers */}
              <polygon points="52,70 52,92 60,85 68,92 68,70" fill="url(#blueShadeDark)" stroke="#38BDF8" strokeWidth="1.4" />
              <circle cx="60" cy="52" r="22" fill="url(#blueShadePrimary)" stroke="#FFFFFF" strokeWidth="1.8" />
              <path d="M 52 52 L 58 58 L 68 48" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="34" cy="52" r="3.5" fill="#00F0FF" />
              <circle cx="86" cy="52" r="3.5" fill="#00F0FF" />
            </g>
          </svg>
        </div>
      );

    // ═════════════════════════════════════════════════════════════════════
    // 13. EXPENSE MANAGEMENT: CYCLE (Image 1 #6 CYCLE + Image 2 #8)
    // ═════════════════════════════════════════════════════════════════════
    case 'expense-management':
      return (
        <div className={containerClass}>
          <svg className="w-28 h-28 sm:w-32 sm:h-32 overflow-visible" viewBox="0 0 120 120" fill="none">
            <SvgDefs />

            {/* B&W Default State */}
            <g className="transition-opacity duration-500 opacity-100 group-hover:opacity-0">
              {/* Torus Donut Disc with Tangent Arrow */}
              <circle cx="60" cy="56" r="28" fill="#1A2230" stroke="#FFFFFF" strokeWidth="1.6" />
              <circle cx="60" cy="56" r="14" fill="#0A0D14" stroke="#FFFFFF" strokeWidth="1.6" />
              <line x1="28" y1="84" x2="90" y2="84" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
              <polygon points="94,84 86,80 86,88" fill="#FFFFFF" />
            </g>

            {/* Shaded Blue Hover State (Image 1 CYCLE style) */}
            <g className="transition-opacity duration-500 opacity-0 group-hover:opacity-100">
              <circle cx="60" cy="56" r="34" fill="url(#cyanOrbGlow)" />
              {/* Shaded Gradient Torus */}
              <circle cx="60" cy="56" r="28" fill="url(#blueShadePrimary)" stroke="#FFFFFF" strokeWidth="1.8" />
              <circle cx="60" cy="56" r="14" fill="#061226" stroke="#00F0FF" strokeWidth="1.6" />
              {/* Luminous Tangent Arrow */}
              <line x1="28" y1="84" x2="92" y2="84" stroke="#00F0FF" strokeWidth="2.2" strokeLinecap="round" />
              <polygon points="96,84 88,79 88,89" fill="#FFFFFF" />
            </g>
          </svg>
        </div>
      );

    // ═════════════════════════════════════════════════════════════════════
    // 14. E-COMMERCE: CLONE (Image 1 #15 CLONE + Image 2 #7)
    // ═════════════════════════════════════════════════════════════════════
    case 'e-commerce':
      return (
        <div className={containerClass}>
          <svg className="w-28 h-28 sm:w-32 sm:h-32 overflow-visible" viewBox="0 0 120 120" fill="none">
            <SvgDefs />

            {/* B&W Default State */}
            <g className="transition-opacity duration-500 opacity-100 group-hover:opacity-0">
              {/* Overlapping Scaled Squares with 45-degree Expansion Vector */}
              <rect x="28" y="48" width="38" height="38" fill="#161E2C" stroke="#FFFFFF" strokeWidth="1.5" />
              <rect x="52" y="32" width="38" height="38" fill="#243046" stroke="#FFFFFF" strokeWidth="1.6" />
              <line x1="38" y1="76" x2="82" y2="40" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
              <polygon points="85,38 78,38 82,45" fill="#FFFFFF" />
            </g>

            {/* Shaded Blue Hover State (Image 1 CLONE style) */}
            <g className="transition-opacity duration-500 opacity-0 group-hover:opacity-100">
              <circle cx="60" cy="58" r="34" fill="url(#cyanOrbGlow)" />
              {/* Shaded Overlapping Gradient Cubes */}
              <rect x="28" y="48" width="38" height="38" fill="url(#blueShadeSoft)" stroke="#38BDF8" strokeWidth="1.4" />
              <rect x="52" y="32" width="38" height="38" fill="url(#blueShadePrimary)" stroke="#FFFFFF" strokeWidth="1.8" />
              {/* Luminous Growth Arrow */}
              <line x1="38" y1="76" x2="82" y2="40" stroke="#00F0FF" strokeWidth="2.2" strokeLinecap="round" />
              <polygon points="87,36 78,37 83,46" fill="#FFFFFF" />
            </g>
          </svg>
        </div>
      );

    // ═════════════════════════════════════════════════════════════════════
    // 15. API INTEGRATION: DIRECT CONNECT (Image 2 #15 + Image 2 #7)
    // ═════════════════════════════════════════════════════════════════════
    case 'api-management':
      return (
        <div className={containerClass}>
          <svg className="w-28 h-28 sm:w-32 sm:h-32 overflow-visible" viewBox="0 0 120 120" fill="none">
            <SvgDefs />

            {/* B&W Default State */}
            <g className="transition-opacity duration-500 opacity-100 group-hover:opacity-0">
              {/* Left Isometric Cube with Aperture */}
              <polygon points="34,44 48,52 48,70 34,62" fill="#141B28" stroke="#FFFFFF" strokeWidth="1.5" />
              <polygon points="48,52 60,45 60,63 48,70" fill="#0C1018" stroke="#FFFFFF" strokeWidth="1.5" />
              <polygon points="34,44 46,37 60,45 48,52" fill="#202A3D" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="48" cy="58" r="5" fill="#0A0D14" stroke="#FFFFFF" strokeWidth="1.2" />

              {/* Laser Conduit Connection */}
              <line x1="48" y1="58" x2="72" y2="58" stroke="#FFFFFF" strokeWidth="1.6" strokeDasharray="2 2" />

              {/* Right Isometric Cube with Aperture */}
              <polygon points="62,44 76,52 76,70 62,62" fill="#141B28" stroke="#FFFFFF" strokeWidth="1.5" />
              <polygon points="76,52 88,45 88,63 76,70" fill="#0C1018" stroke="#FFFFFF" strokeWidth="1.5" />
              <polygon points="62,44 74,37 88,45 76,52" fill="#202A3D" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="76" cy="58" r="5" fill="#0A0D14" stroke="#FFFFFF" strokeWidth="1.2" />
            </g>

            {/* Shaded Blue Hover State */}
            <g className="transition-opacity duration-500 opacity-0 group-hover:opacity-100">
              <circle cx="60" cy="56" r="32" fill="url(#cyanOrbGlow)" />
              {/* Luminous Shaded Cubes */}
              <polygon points="34,44 48,52 48,70 34,62" fill="url(#blueShadeSoft)" stroke="#00F0FF" strokeWidth="1.4" />
              <polygon points="48,52 60,45 60,63 48,70" fill="url(#blueShadeDark)" stroke="#38BDF8" strokeWidth="1.2" />
              <polygon points="34,44 46,37 60,45 48,52" fill="url(#blueShadePrimary)" stroke="#FFFFFF" strokeWidth="1.6" />
              <circle cx="48" cy="58" r="5" fill="#081A36" stroke="#00F0FF" strokeWidth="1.5" />

              {/* Glowing High-Speed Laser Beam */}
              <line x1="48" y1="58" x2="76" y2="58" stroke="#00F0FF" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="62" cy="58" r="2.5" fill="#FFFFFF" />

              <polygon points="62,44 76,52 76,70 62,62" fill="url(#blueShadeSoft)" stroke="#00F0FF" strokeWidth="1.4" />
              <polygon points="76,52 88,45 88,63 76,70" fill="url(#blueShadeDark)" stroke="#38BDF8" strokeWidth="1.2" />
              <polygon points="62,44 74,37 88,45 76,52" fill="url(#blueShadePrimary)" stroke="#FFFFFF" strokeWidth="1.6" />
              <circle cx="76" cy="58" r="5" fill="#081A36" stroke="#00F0FF" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      );

    // ═════════════════════════════════════════════════════════════════════
    // 16. CHIT FUND: VALUE (Image 1 #5 VALUE + Image 2 #13)
    // ═════════════════════════════════════════════════════════════════════
    case 'chit-fund':
      return (
        <div className={containerClass}>
          <svg className="w-28 h-28 sm:w-32 sm:h-32 overflow-visible" viewBox="0 0 120 120" fill="none">
            <SvgDefs />

            {/* B&W Default State */}
            <g className="transition-opacity duration-500 opacity-100 group-hover:opacity-0">
              {/* 3D Faceted Octahedron Gem Prism */}
              <polygon points="60,24 88,60 60,74 32,60" fill="#1E283C" stroke="#FFFFFF" strokeWidth="1.6" />
              <polygon points="60,24 88,60 60,96" fill="#141B28" stroke="#FFFFFF" strokeWidth="1.5" />
              <polygon points="60,24 32,60 60,96" fill="#243046" stroke="#FFFFFF" strokeWidth="1.5" />
              <line x1="32" y1="60" x2="88" y2="60" stroke="#FFFFFF" strokeWidth="1.6" />
            </g>

            {/* Shaded Blue Hover State (Image 1 VALUE style) */}
            <g className="transition-opacity duration-500 opacity-0 group-hover:opacity-100">
              <circle cx="60" cy="60" r="34" fill="url(#cyanOrbGlow)" />
              {/* Luminous Shaded Crystal Facets */}
              <polygon points="60,24 88,60 60,74 32,60" fill="url(#blueShadePrimary)" stroke="#FFFFFF" strokeWidth="1.8" />
              <polygon points="60,24 88,60 60,96" fill="url(#blueShadeDark)" stroke="#38BDF8" strokeWidth="1.4" />
              <polygon points="60,24 32,60 60,96" fill="url(#blueShadeSoft)" stroke="#00F0FF" strokeWidth="1.5" />
              <line x1="32" y1="60" x2="88" y2="60" stroke="#FFFFFF" strokeWidth="1.8" />
            </g>
          </svg>
        </div>
      );

    // ═════════════════════════════════════════════════════════════════════
    // 17. APPOINTMENT BOOKING: ALWAYS ON (Image 2 #8 ALWAYS ON + Image 1 #11)
    // ═════════════════════════════════════════════════════════════════════
    case 'appointment-booking':
      return (
        <div className={containerClass}>
          <svg className="w-28 h-28 sm:w-32 sm:h-32 overflow-visible" viewBox="0 0 120 120" fill="none">
            <SvgDefs />

            {/* B&W Default State */}
            <g className="transition-opacity duration-500 opacity-100 group-hover:opacity-0">
              {/* Chrono Calendar Dial */}
              <circle cx="60" cy="60" r="32" fill="#141B28" stroke="#FFFFFF" strokeWidth="1.6" />
              <circle cx="60" cy="60" r="24" fill="#0C1018" stroke="#94A3B8" strokeWidth="1.2" strokeDasharray="3 3" />
              {/* Dynamic Lightning Sync Bolt */}
              <polygon points="62,38 48,60 58,60 56,82 72,56 60,56" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.2" />
            </g>

            {/* Shaded Blue Hover State (Image 1 style) */}
            <g className="transition-opacity duration-500 opacity-0 group-hover:opacity-100">
              <circle cx="60" cy="60" r="36" fill="url(#cyanOrbGlow)" />
              {/* Shaded Blue Chrono Disc */}
              <circle cx="60" cy="60" r="32" fill="url(#blueShadePrimary)" stroke="#FFFFFF" strokeWidth="1.8" />
              <circle cx="60" cy="60" r="24" fill="#081A36" stroke="#00F0FF" strokeWidth="1.4" strokeDasharray="4 3" />
              {/* Radiant Lightning Sync Bolt */}
              <polygon points="62,38 48,60 58,60 56,82 72,56 60,56" fill="#FFFFFF" stroke="#00F0FF" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      );

    default:
      return null;
  }
}
