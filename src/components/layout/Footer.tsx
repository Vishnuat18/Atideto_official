import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Linkedin, Instagram, Phone, Mail, MapPin } from 'lucide-react';
import { XIcon } from '@/components/icons/XIcon';
import footerBg from '@/assets/footer.png';
import atidetoLogo from '@/assets/atideto/logo.png';
import atidetoWordmark from '@/assets/atideto/atideto.png';

export default function Footer() {
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/dashboard' || location.pathname.startsWith('/admin') || location.pathname === '/profile') {
    return null;
  }

  const socialLinks = [
    {
      icon: Instagram,
      label: 'Instagram',
      handle: '@atideto',
      href: 'https://www.instagram.com/atideto',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      handle: '@atideto',
      href: 'https://www.linkedin.com/company/atideto',
    },
    {
      icon: XIcon,
      label: 'X',
      handle: '@atideto',
      href: 'https://x.com/atideto',
    },
  ];

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Courses', href: '/courses' },
    { label: 'Upskill', href: '/upskill' },
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Client Connect', href: '/client-connect' },
  ];

  const serviceLinks = [
    { label: 'App Development', href: '/services' },
    { label: 'Web Development', href: '/services' },
    { label: 'UI & UX Design', href: '/services' },
    { label: 'Digital Marketing', href: '/services' },
    { label: 'Custom Software', href: '/services' },
    { label: 'Business Automation', href: '/services' },
  ];

  return (
    <footer 
      className="relative w-full bg-[#010204] text-white overflow-hidden bg-cover bg-no-repeat pt-14 sm:pt-20 pb-12 sm:pb-10 px-4 sm:px-8 lg:px-16"
      style={{ 
        backgroundImage: `url(${footerBg})`,
        backgroundPosition: 'right center'
      }}
    >
      {/* ── Top Seamless Fade into Previous Section ── */}
      <div 
        className="absolute top-0 inset-x-0 h-20 sm:h-32 bg-gradient-to-b from-[#050505] via-[#050505]/70 to-transparent pointer-events-none z-10" 
        aria-hidden="true"
      />

      {/* Mobile/Tablet backdrop tint to maintain pristine legibility while highlighting the blue wave art */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-transparent lg:hidden pointer-events-none z-10"
        aria-hidden="true"
      />

      <div className="relative z-20 max-w-7xl mx-auto flex flex-col">
        {/* ── TOP / MAIN CONTENT: OCCUPIES THE LEFT 50% ON DESKTOP ── */}
        <div className="w-full lg:w-1/2 lg:max-w-2xl flex flex-col items-start text-left">
          
          {/* Brand Logo & Wordmark (Both the exact same size, bigger) */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 sm:gap-4 group mb-6 transition-transform duration-300 hover:scale-[1.02]"
            aria-label="Atideto Technologies Home"
          >
            <img 
              src={atidetoLogo} 
              alt="Atideto Logo" 
              className="h-11 sm:h-13 md:h-14 w-auto object-contain drop-shadow-[0_0_25px_rgba(0,102,255,0.6)]"
            />
            <img 
              src={atidetoWordmark} 
              alt="Atideto Technologies" 
              className="h-11 sm:h-13 md:h-14 w-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] filter brightness-105"
            />
          </Link>

          {/* Mission / Company Overview */}
          <p className="font-ui text-slate-300 text-xs sm:text-[13px] leading-relaxed max-w-lg mb-6 font-normal">
            Empowering businesses with custom enterprise software, scalable web &amp; mobile platforms, intelligent automation, and career-accelerating technical programs.
          </p>

          {/* Quick Direct Touchpoint Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-8">
            <a
              href="tel:+916379000598"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 hover:border-[#38BDF8]/60 bg-[#071324]/80 hover:bg-[#0A1E38] text-slate-300 hover:text-white transition-all text-xs font-medium backdrop-blur-sm shadow-[0_0_12px_rgba(0,102,255,0.15)]"
            >
              <Phone size={13} className="text-[#38BDF8]" />
              <span>+91 6379000598</span>
            </a>
            <a
              href="mailto:atidetotechnologies@gmail.com"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 hover:border-[#38BDF8]/60 bg-[#071324]/80 hover:bg-[#0A1E38] text-slate-300 hover:text-white transition-all text-xs font-medium backdrop-blur-sm shadow-[0_0_12px_rgba(0,102,255,0.15)]"
            >
              <Mail size={13} className="text-[#38BDF8]" />
              <span>atidetotechnologies@gmail.com</span>
            </a>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.03] text-slate-400 text-xs font-normal">
              <MapPin size={12} className="text-[#38BDF8]" />
              <span>Tamil Nadu, India</span>
            </div>
          </div>

          {/* ── Categorized Footer Links (Left 50% Multi-Column) ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 w-full mb-6 pt-1">
            {/* Column 1: Navigation */}
            <div>
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#38BDF8] mb-3">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs sm:text-[13px]">
                {navLinks.map((item) => (
                  <li key={item.label}>
                    <Link 
                      to={item.href} 
                      className="text-slate-400 hover:text-white transition-colors duration-200 block py-0.5"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Solutions */}
            <div>
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#38BDF8] mb-3">
                Solutions
              </h4>
              <ul className="space-y-2 text-xs sm:text-[13px]">
                {serviceLinks.map((service) => (
                  <li key={service.label}>
                    <Link 
                      to={service.href} 
                      className="text-slate-400 hover:text-white transition-colors duration-200 block py-0.5"
                    >
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Follow us online */}
            <div className="col-span-2 sm:col-span-1">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#38BDF8] mb-3">
                Follow us online
              </h4>
              <div className="flex flex-col gap-2.5">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-xs sm:text-[13px] text-slate-400 hover:text-white transition-colors duration-200 group py-0.5"
                  >
                    <div className="w-6 h-6 rounded-md bg-[#0A1628] border border-white/10 flex items-center justify-center group-hover:border-[#38BDF8]/60 transition-colors">
                      <social.icon size={12} className="text-[#38BDF8] group-hover:scale-110 transition-transform" />
                    </div>
                    <span>{social.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── FULL-WIDTH BOTTOM FOOTER BAR ── */}
        <div className="w-full pt-8 mt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 text-xs text-slate-400">
            <Link to="/privacy-policy" className="hover:text-white transition-colors duration-200">
              Privacy policy
            </Link>
            <span className="text-slate-600 select-none">•</span>
            <Link to="/terms-and-conditions" className="hover:text-white transition-colors duration-200">
              Terms of Use
            </Link>
            <span className="text-slate-600 select-none">•</span>
            <Link to="/privacy-policy#responsible-disclosure" className="hover:text-white transition-colors duration-200">
              Responsible Disclosure
            </Link>
          </div>
          <p className="text-xs text-slate-400 font-normal text-center md:text-right">
            &copy; 2026 Atideto Technologies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
