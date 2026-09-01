import { Link, useLocation } from 'react-router-dom';
import footerBg from '@/assets/hero/footer.png';
import { Linkedin, Instagram, Disc, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import atidetoLogo from '@/assets/atideto-logo.png';

export default function Footer() {
  const location = useLocation();
  
  if (location.pathname === '/login' || location.pathname === '/dashboard' || location.pathname === '/profile') {
    return null;
  }
  
  // Removed /about check to show Footer on About page

  return (
    <footer 
      className="relative overflow-hidden text-white font-sans border-t border-white/5 w-full mt-auto"
      style={{
        backgroundImage: `linear-gradient(to top, #020208, transparent, rgba(2,2,8,0.8)), url(${footerBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background Image is set in inline style above */}
      <div className="absolute inset-0 bg-black/40 -z-10 pointer-events-none" />

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10">
          {/* Brand & Socials */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 flex flex-col items-start mb-2 md:mb-0">
            <Link to="/" className="flex items-center group mb-5">
              <img src={atidetoLogo} alt="ATIDETO Logo" className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-110" />
            </Link>
            <p className="text-[#a0a0a0] text-[13px] leading-relaxed mb-6 max-w-[280px]">
              Building digital experiences that empower businesses to grow and scale.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/company/atideto' },
                { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/atideto' },
                { icon: Disc, label: 'Discord', href: 'https://discord.gg/atideto' },
                { icon: Youtube, label: 'YouTube', href: 'https://youtube.com/@atideto' },
              ].map((Social) => (
                <a
                  key={Social.label}
                  href={Social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={Social.label}
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[#a0a0a0] hover:text-white hover:border-white/30 transition-all duration-300"
                >
                  <Social.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h4 className="text-white font-semibold mb-5 text-[14px]">Services</h4>
            <ul className="space-y-3">
              {[
                { label: 'Web Development', href: '/services' },
                { label: 'Mobile App Development', href: '/services' },
                { label: 'UI / UX Design', href: '/services' },
                { label: 'Desktop Software', href: '/services' },
                { label: 'AI & Automation', href: '/services' },
                { label: 'Cloud Solutions', href: '/services' },
                { label: 'Data Analytics', href: '/services' },
                { label: 'Custom Solutions', href: '/services' }
              ].map((s) => (
                <li key={s.label}>
                  <Link to={s.href} className="text-[#a0a0a0] hover:text-white text-[12px] transition-colors duration-200">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academy */}
          <div className="col-span-1">
            <h4 className="text-white font-semibold mb-5 text-[14px]">Academy</h4>
            <ul className="space-y-3">
              {[
                { label: 'All Courses', href: '/academy' },
                { label: 'Internships', href: '/academy' },
                { label: 'Certifications', href: '/academy' },
                { label: 'Student Dashboard', href: '/login' },
                { label: 'Payment Options', href: '/academy' },
                { label: 'Certificate Verify', href: '/academy' }
              ].map((c) => (
                <li key={c.label}>
                  <Link to={c.href} className="text-[#a0a0a0] hover:text-white text-[12px] transition-colors duration-200">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-white font-semibold mb-5 text-[14px]">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'About Us', href: '/about' },
                { label: 'Services', href: '/services' },
                { label: 'Client Connect', href: '/client-connect' },
                { label: 'Login / Register', href: '/login' },
                { label: 'Privacy Policy', href: '/privacy-policy' },
                { label: 'Terms & Conditions', href: '/terms-and-conditions' }
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-[#a0a0a0] hover:text-white text-[12px] transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="col-span-1">
            <h4 className="text-white font-semibold mb-5 text-[14px]">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-[#a0a0a0] text-[12px]">
                <div className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone size={12} />
                </div>
                <div className="flex flex-col">
                  <a href="tel:+919087284053" className="hover:text-white transition-colors">+91 9087284053</a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-[#a0a0a0] text-[12px]">
                <div className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail size={12} />
                </div>
                <a href="mailto:atidetotechnologies@gmail.com" className="mt-1 break-all hover:text-white transition-colors">atidetotechnologies@gmail.com</a>
              </li>
              <li className="flex items-start gap-3 text-[#a0a0a0] text-[12px] leading-relaxed">
                <div className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={12} />
                </div>
                <span className="mt-1">Salem, Tamil Nadu, India</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 max-w-7xl mx-auto px-6 py-6 text-center">
        <p className="text-[#a0a0a0] text-[13px]">
          © {new Date().getFullYear()} ATIDETO. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
