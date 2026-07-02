import { Link, useLocation } from 'react-router-dom';
import HorizonBackground from './HorizonBackground';
import { Linkedin, Instagram, Disc, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import atidetoLogo from '@/assets/atideto-logo.png';

export default function Footer() {
  const location = useLocation();
  
  if (location.pathname === '/about') {
    return null;
  }

  return (
    <footer className="relative overflow-hidden text-white font-sans border-t border-white/5">
      {/* Animated Background */}
      <HorizonBackground />
      
      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020208] via-transparent to-[#020208]/80 -z-10 pointer-events-none" />

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Socials */}
          <div className="lg:col-span-1 flex flex-col items-start">
            <Link to="/" className="flex items-center group mb-6">
              <img src={atidetoLogo} alt="ATIDETO Logo" className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-110" />
            </Link>
            <p className="text-[#a0a0a0] text-sm leading-relaxed mb-6">
              Building digital experiences that empower businesses to grow and scale.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Linkedin, label: 'LinkedIn', href: '#' },
                { icon: Instagram, label: 'Instagram', href: '#' },
                { icon: Disc, label: 'Discord', href: '#' },
                { icon: Youtube, label: 'YouTube', href: '#' },
              ].map((Social) => (
                <a
                  key={Social.label}
                  href={Social.href}
                  aria-label={Social.label}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#a0a0a0] hover:text-white hover:border-white/30 transition-all duration-300"
                >
                  <Social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-medium mb-6 text-[15px]">Services</h4>
            <ul className="space-y-3.5">
              {[
                'Web Development',
                'Mobile App Development',
                'UI / UX Design',
                'Desktop Software',
                'AI & Automation',
                'Cloud Solutions',
                'Data Analytics',
                'Custom Solutions'
              ].map((s) => (
                <li key={s}>
                  <Link to="#" className="text-[#a0a0a0] hover:text-white text-[13px] transition-colors duration-200">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academy */}
          <div>
            <h4 className="text-white font-medium mb-6 text-[15px]">Academy</h4>
            <ul className="space-y-3.5">
              {[
                'All Courses',
                'Internships',
                'Certifications',
                'Student Dashboard',
                'Payment Options',
                'Certificate Verify'
              ].map((c) => (
                <li key={c}>
                  <Link to="#" className="text-[#a0a0a0] hover:text-white text-[13px] transition-colors duration-200">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium mb-6 text-[15px]">Quick Links</h4>
            <ul className="space-y-3.5">
              {[
                'Home',
                'About Us',
                'Services',
                'Client Connect',
                'Login / Register',
                'Privacy Policy',
                'Terms & Conditions'
              ].map((l) => (
                <li key={l}>
                  <Link to="#" className="text-[#a0a0a0] hover:text-white text-[13px] transition-colors duration-200">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-white font-medium mb-6 text-[15px]">Contact Us</h4>
            <ul className="space-y-5">
              <li className="flex items-center gap-3 text-[#a0a0a0] text-[13px]">
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                  <Phone size={14} />
                </div>
                +91 12345 67890
              </li>
              <li className="flex items-center gap-3 text-[#a0a0a0] text-[13px]">
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                  <Mail size={14} />
                </div>
                hello@atideto.com
              </li>
              <li className="flex items-center gap-3 text-[#a0a0a0] text-[13px] leading-tight">
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                  <MapPin size={14} />
                </div>
                Salem, Tamil Nadu, India
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 max-w-7xl mx-auto px-6 py-6 text-center">
        <p className="text-[#a0a0a0] text-[13px]">
          © 2025 ATIDETO. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
