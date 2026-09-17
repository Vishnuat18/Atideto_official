import { Link, useLocation } from 'react-router-dom';
import { Linkedin, Github, Instagram } from 'lucide-react';
import { XIcon } from '@/components/icons/XIcon';
import atidetoLogo from '@/assets/atideto/logo.png';
import atidetoText from '@/assets/atideto/text.png';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Academy', href: '/academy' },
  { label: 'Connect', href: '/client-connect' },
];

export default function LeftSidebar() {
  const location = useLocation();

  return (
    <div className="fixed top-0 left-0 bottom-0 w-[280px] bg-[rgba(4,6,8,0.7)] backdrop-blur-2xl border-r border-white/5 z-50 flex flex-col justify-between py-10 px-8 transition-all duration-500">
      
      {/* Top: Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <img src={atidetoLogo} alt="Atideto Logo" className="h-9 w-auto object-contain transition-transform duration-500 group-hover:scale-105 filter drop-shadow-[0_0_15px_rgba(0,102,255,0.6)]" />
        <img src={atidetoText} alt="Atideto Technologies" className="h-5 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]" />
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
          <a href="https://x.com/atideto" target="_blank" rel="noopener noreferrer" aria-label="X (formerly Twitter)" className="text-[#94A3B8] hover:text-[#3B82F6] transition-colors"><XIcon size={18} /></a>
        </div>
        <div className="text-[10px] text-[#94A3B8]/60 font-space tracking-widest uppercase">
          © {new Date().getFullYear()} Atideto
        </div>
      </div>

    </div>
  );
}
