import { Link, useLocation } from 'react-router-dom';
import { Linkedin, Github, Instagram, Twitter } from 'lucide-react';
import atidetoLogo from '@/assets/atideto-logo.png';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Academy', href: '/academy' },
  { label: 'About Us', href: '/about' },
  { label: 'Client Connect', href: '/client-connect' },
];

export default function LeftSidebar() {
  const location = useLocation();

  return (
    <div className="fixed top-0 left-0 bottom-0 w-[280px] bg-[rgba(4,6,8,0.7)] backdrop-blur-2xl border-r border-white/5 z-50 flex flex-col justify-between py-10 px-8 transition-all duration-500">
      
      {/* Top: Logo */}
      <Link to="/" className="flex flex-col items-start group">
        <div className="flex items-center">
          <img src={atidetoLogo} alt="ATIDETO Logo" className="h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-105 filter drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
        </div>
      </Link>

      {/* Middle: Navigation */}
      <nav className="flex flex-col gap-6 mt-12 mb-auto">
        {NAV_LINKS.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`text-sm font-medium tracking-wide transition-all duration-300 relative group flex items-center ${
              location.pathname === item.href ? 'text-white pl-4' : 'text-[#94A3B8] hover:text-white hover:pl-2'
            }`}
          >
            {location.pathname === item.href && (
              <span className="absolute left-0 w-1.5 h-1.5 rounded-full bg-[#3B82F6] shadow-[0_0_10px_#3B82F6]" />
            )}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom: Socials & Copyright */}
      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          <a href="#" className="text-[#94A3B8] hover:text-[#3B82F6] transition-colors"><Linkedin size={18} /></a>
          <a href="#" className="text-[#94A3B8] hover:text-[#3B82F6] transition-colors"><Github size={18} /></a>
          <a href="#" className="text-[#94A3B8] hover:text-[#3B82F6] transition-colors"><Instagram size={18} /></a>
          <a href="#" className="text-[#94A3B8] hover:text-[#3B82F6] transition-colors"><Twitter size={18} /></a>
        </div>
        <div className="text-[10px] text-[#94A3B8]/60 font-space tracking-widest uppercase">
          © {new Date().getFullYear()} ATIDETO
        </div>
      </div>

    </div>
  );
}
