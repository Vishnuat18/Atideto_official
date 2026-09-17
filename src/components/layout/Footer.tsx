import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Linkedin, Instagram, Phone, Mail } from 'lucide-react';
import { XIcon } from '@/components/icons/XIcon';
import footerBg from '@/assets/section/footer.png';
import atidetoLogo from '@/assets/atideto/logo.png';
import atidetoText from '@/assets/atideto/text.png';
import { toast } from 'sonner';

export default function Footer() {
  const location = useLocation();
  const [email, setEmail] = useState('');

  if (location.pathname === '/login' || location.pathname === '/dashboard' || location.pathname === '/profile') {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for subscribing to Atideto tech updates!');
      setEmail('');
    }
  };


  const socialLinks = [
    {
      icon: Instagram,
      label: 'Instagram',
      handle: '@atideto',
      href: 'https://www.instagram.com/atideto',
      borderStyle: 'border-[#E1306C]/45 hover:border-[#E1306C]',
      bgStyle: 'bg-gradient-to-r from-[#200B1A]/85 via-[#18091B]/75 to-[#1F0E14]/85 hover:from-[#2E0E24] hover:to-[#221018]',
      shadowStyle: 'shadow-[0_0_15px_rgba(225,48,108,0.18)] hover:shadow-[0_0_24px_rgba(225,48,108,0.45)]',
      iconColor: 'text-[#FF548F]',
      textColor: 'text-[#FFE4E6] group-hover:text-white',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      handle: '@atideto',
      href: 'https://www.linkedin.com/company/atideto',
      borderStyle: 'border-[#0A66C2]/45 hover:border-[#38BDF8]',
      bgStyle: 'bg-gradient-to-r from-[#071526]/85 via-[#091A30]/75 to-[#06182B]/85 hover:from-[#0B213D] hover:to-[#0A2645]',
      shadowStyle: 'shadow-[0_0_15px_rgba(10,102,194,0.18)] hover:shadow-[0_0_24px_rgba(56,189,248,0.45)]',
      iconColor: 'text-[#38BDF8]',
      textColor: 'text-[#E0F2FE] group-hover:text-white',
    },
    {
      icon: XIcon,
      label: 'X',
      handle: '@atideto',
      href: 'https://x.com/atideto',
      borderStyle: 'border-slate-500/40 hover:border-[#38BDF8]/80',
      bgStyle: 'bg-gradient-to-r from-slate-900/75 via-[#0A101D]/75 to-slate-900/65 hover:from-slate-800/80 hover:to-slate-700/70',
      shadowStyle: 'shadow-[0_0_15px_rgba(255,255,255,0.08)] hover:shadow-[0_0_24px_rgba(56,189,248,0.35)]',
      iconColor: 'text-slate-300 group-hover:text-[#38BDF8]',
      textColor: 'text-slate-200 group-hover:text-white',
    },
  ];

  const contactButtons = [
    {
      icon: Phone,
      label: 'Contact us',
      href: 'tel:+916379000598',
      borderStyle: 'border-[#10B981]/45 hover:border-[#10B981]',
      bgStyle: 'bg-gradient-to-r from-[#062016]/85 via-[#08281B]/75 to-[#051E14]/85 hover:from-[#093522] hover:to-[#072B1C]',
      shadowStyle: 'shadow-[0_0_15px_rgba(16,185,129,0.18)] hover:shadow-[0_0_24px_rgba(16,185,129,0.45)]',
      iconColor: 'text-[#10B981]',
      textColor: 'text-[#D1FAE5] group-hover:text-white',
    },
    {
      icon: Mail,
      label: 'Mail Us',
      href: 'mailto:atidetotechnologies@gmail.com',
      borderStyle: 'border-[#EA4335]/45 hover:border-[#EA4335]',
      bgStyle: 'bg-gradient-to-r from-[#220B0F]/85 via-[#2A0E13]/75 to-[#1F090C]/85 hover:from-[#361118] hover:to-[#280C11]',
      shadowStyle: 'shadow-[0_0_15px_rgba(234,67,53,0.18)] hover:shadow-[0_0_24px_rgba(234,67,53,0.45)]',
      iconColor: 'text-[#FF5C5C]',
      textColor: 'text-[#FFE4E6] group-hover:text-white',
    },
  ];

  const footerNavButtons = [
    { label: 'Home', href: '/' },
    { label: 'Company', href: '/about' },
    { label: 'Solutions', href: '/services' },
    { label: 'Internship', href: '/academy' },
    { label: 'Contact', href: '/client-connect' },
  ];

  return (
    <footer 
      className="relative w-full bg-[#050505] overflow-hidden text-white pt-14 sm:pt-20 pb-28 sm:pb-12 px-4 sm:px-6 lg:px-12 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${footerBg})` }}
    >
      {/* ── Top Seamless Fade into Previous Section ── */}
      <div 
        className="absolute top-0 inset-x-0 h-24 sm:h-48 bg-gradient-to-b from-[#050505] via-[#050505]/80 to-transparent pointer-events-none z-10" 
        aria-hidden="true"
      />

      <div className="relative z-20 max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Logo & Brand Text Image */}
        <Link to="/" className="inline-flex flex-col items-center group mb-4 transition-transform duration-300 hover:scale-105">
          <img 
            src={atidetoLogo} 
            alt="Atideto Logo" 
            className="w-14 h-14 sm:w-20 sm:h-20 object-contain drop-shadow-[0_0_25px_rgba(0,102,255,0.45)] mb-2"
          />
          <img 
            src={atidetoText} 
            alt="Atideto Technologies" 
            className="h-7 sm:h-10 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]"
          />
        </Link>

        {/* Subtitle / Mission Statement */}
        <p className="text-slate-300 text-xs sm:text-[14px] max-w-xl mx-auto leading-relaxed font-light mb-6 sm:mb-7 px-2">
          Building digital experiences that empower businesses to grow, automate, and scale with cutting-edge software and AI innovations.
        </p>

        {/* Quick Contact Info Buttons — Above the Menu */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6 px-2">
          {contactButtons.map((btn) => (
            <a
              key={btn.label}
              href={btn.href}
              aria-label={btn.label}
              className={`group relative inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] cursor-pointer ${btn.borderStyle} ${btn.bgStyle} ${btn.shadowStyle}`}
            >
              <btn.icon size={14} className={`transition-transform duration-300 group-hover:scale-110 shrink-0 ${btn.iconColor}`} />
              <span className={`text-[12px] sm:text-[13px] font-medium tracking-wide transition-colors duration-200 ${btn.textColor}`}>
                {btn.label}
              </span>
            </a>
          ))}
        </div>

        {/* ── MOBILE MENU (3 in Row 1, 2 in Row 2 in order of show) ── */}
        <div className="w-full flex flex-col items-center md:hidden mb-6">
          <div className="flex flex-col items-center gap-2 w-full max-w-sm mx-auto">
            {/* Row 1: 3 items (Home, Company, Solutions) */}
            <div className="flex items-center justify-center gap-2 w-full">
              {footerNavButtons.slice(0, 3).map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`group relative inline-flex items-center justify-center p-[2px] rounded-full border-2 transition-all duration-300 active:scale-95 shrink-0 ${
                      isActive
                        ? 'border-[#38BDF8] shadow-[0_0_12px_rgba(56,189,248,0.35)]'
                        : 'border-[#55647a] hover:border-[#94a3b8]'
                    } bg-[#0B1020]`}
                  >
                    <span className={`inline-flex items-center justify-center rounded-full border px-3.5 py-1 text-white font-bold text-xs tracking-wide transition-colors ${
                      isActive
                        ? 'border-[#38BDF8]/60 bg-[#071526]'
                        : 'border-[#3b475d] bg-[#0c1222]'
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Row 2: 2 items (Internship, Contact) */}
            <div className="flex items-center justify-center gap-2 w-full">
              {footerNavButtons.slice(3, 5).map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`group relative inline-flex items-center justify-center p-[2px] rounded-full border-2 transition-all duration-300 active:scale-95 shrink-0 ${
                      isActive
                        ? 'border-[#38BDF8] shadow-[0_0_12px_rgba(56,189,248,0.35)]'
                        : 'border-[#55647a] hover:border-[#94a3b8]'
                    } bg-[#0B1020]`}
                  >
                    <span className={`inline-flex items-center justify-center rounded-full border px-4 py-1 text-white font-bold text-xs tracking-wide transition-colors ${
                      isActive
                        ? 'border-[#38BDF8]/60 bg-[#071526]'
                        : 'border-[#3b475d] bg-[#0c1222]'
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── DESKTOP (WEB) SECTION: SOCIAL ABOVE MENUS + REFERENCE-STYLE BG BUTTONS ── */}
        {/* 1. Desktop Social Banners */}
        <div className="hidden md:flex flex-wrap items-center justify-center gap-3.5 mb-6 max-w-full px-2">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${social.label} ${social.handle}`}
              className={`group relative inline-flex items-center gap-2 px-5 py-2 rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] cursor-pointer ${social.borderStyle} ${social.bgStyle} ${social.shadowStyle}`}
            >
              <social.icon size={15} className={`transition-transform duration-300 group-hover:scale-110 shrink-0 ${social.iconColor}`} />
              <span className={`text-[13px] font-medium tracking-wide transition-colors duration-200 ${social.textColor}`}>
                {social.handle}
              </span>
            </a>
          ))}
        </div>

        {/* 2. Desktop Navigation Menu (Matching Reference Image) */}
        <nav className="hidden md:flex flex-wrap items-center justify-center gap-3 mb-8 px-2" aria-label="Footer Navigation">
          {footerNavButtons.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`group relative inline-flex items-center justify-center p-[2.5px] rounded-full border-2 transition-all duration-300 hover:scale-105 active:scale-95 ${
                  isActive
                    ? 'border-[#38BDF8] shadow-[0_0_18px_rgba(56,189,248,0.35)]'
                    : 'border-[#55647a] hover:border-[#94a3b8] hover:shadow-[0_0_15px_rgba(148,163,184,0.25)]'
                } bg-[#0B1020]`}
              >
                <span className={`inline-flex items-center justify-center rounded-full border px-6 py-2 text-white font-bold text-sm tracking-wide transition-colors ${
                  isActive
                    ? 'border-[#38BDF8]/60 bg-[#071526]'
                    : 'border-[#3b475d] group-hover:border-[#64748b] bg-[#0c1222]'
                }`}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Newsletter Subscription Form — Inline / Same Line on Mobile & Desktop */}
        <form onSubmit={handleSubscribe} className="flex flex-row items-center justify-center gap-2 max-w-md w-full mb-6 sm:mb-8 px-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email for updates..."
            required
            className="flex-1 min-w-0 px-3.5 sm:px-4 py-2.5 rounded-xl bg-[#081022]/90 border border-white/15 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500 shadow-inner transition-colors"
          />
          <button
            type="submit"
            className="w-fit px-4 sm:px-6 py-2.5 rounded-xl bg-[#1A6CFF] hover:bg-[#2563EB] text-white font-medium text-xs sm:text-sm shadow-[0_0_20px_rgba(26,108,255,0.6)] hover:shadow-[0_0_25px_rgba(26,108,255,0.85)] transition-all active:scale-95 shrink-0 whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>

        {/* ── MOBILE SOCIAL ICONS (BELOW SUBSCRIBE) ── */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 w-fit mx-auto md:hidden">
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className={`w-fit inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-medium backdrop-blur-md transition-all active:scale-95 ${s.borderStyle} ${s.bgStyle} ${s.shadowStyle} ${s.textColor}`}
            >
              <s.icon size={13} className={s.iconColor} />
              <span>{s.handle}</span>
            </a>
          ))}
        </div>

        {/* Legal & Policy Links (Mobile & Desktop) */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-slate-400 mb-5 px-3">
          <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <span className="text-slate-600 select-none">•</span>
          <Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
          <span className="text-slate-600 select-none">•</span>
          <Link to="/about" className="hover:text-white transition-colors">Regional Hubs</Link>
          <span className="text-slate-600 select-none">•</span>
          <Link to="/academy" className="hover:text-white transition-colors">Verify Certificate</Link>
        </div>

        {/* Copyright */}
        <div className="text-center px-4">
          <p className="text-[11px] sm:text-xs text-slate-500">
            © 2026 Atideto Technologies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
