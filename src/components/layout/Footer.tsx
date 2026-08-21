import { Link, useLocation } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { Linkedin, Instagram, Disc, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import atidetoLogo from '@/assets/atideto-logo.png';
import footerBg from '@/assets/hero/footer.png';
import footerLightBg from '@/assets/hero/footer-light.png';

export default function Footer() {
  const location = useLocation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  if (location.pathname === '/login' || location.pathname === '/dashboard' || location.pathname === '/profile') {
    return null;
  }
  
  // Removed /about check to show Footer on About page

  return (
    <footer 
      className="relative overflow-hidden text-foreground font-sans border-t border-border bg-gradient-to-b from-card to-muted mt-auto w-full"
      style={{
        backgroundImage: isDark 
          ? `linear-gradient(to top, #020208, transparent, rgba(2,2,8,0.8)), url(${footerBg})`
          : `linear-gradient(to top, rgba(255,255,255,0.6), rgba(248,250,252,0.15)), url(${footerLightBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background Image is set in inline style above */}
      <div className={isDark ? "absolute inset-0 bg-black/40 -z-10 pointer-events-none" : "absolute inset-0 bg-white/20 -z-10 pointer-events-none"} />

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10">
          {/* Brand & Socials */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 flex flex-col items-start mb-2 md:mb-0">
            <Link to="/" className="flex items-center group mb-5">
              <img src={atidetoLogo} alt="ATIDETO Logo" className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-110" />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-[280px]">
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
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary-50 transition-all duration-300"
                >
                  <Social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h4 className="text-foreground font-semibold mb-5 text-[14px]">Services</h4>
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
                  <Link to={s.href} className="text-muted-foreground hover:text-primary text-sm transition-colors duration-200">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academy */}
          <div className="col-span-1">
            <h4 className="text-foreground font-semibold mb-5 text-[14px]">Academy</h4>
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
                  <Link to={c.href} className="text-muted-foreground hover:text-primary text-sm transition-colors duration-200">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-foreground font-semibold mb-5 text-[14px]">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'About Us', href: '/about' },
                { label: 'Services', href: '/services' },
                { label: 'Locations Directory', href: '/locations' },
                { label: 'Client Connect', href: '/client-connect' },
                { label: 'Requirement Gathering', href: '/requirement-gathering' },
                { label: 'Privacy Policy', href: '/privacy-policy' },
                { label: 'Terms & Conditions', href: '/terms-and-conditions' },
                { label: 'Login / Register', href: '/login' },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-muted-foreground hover:text-primary text-sm transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="col-span-1">
            <h4 className="text-foreground font-semibold mb-5 text-[14px]">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground text-sm">
                <div className="w-7 h-7 rounded-full border border-border flex items-center justify-center shrink-0 mt-0.5">
                  <Phone size={12} />
                </div>
                <a href="tel:+919087284053" className="mt-1 hover:text-primary transition-colors">+91 9087284053</a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground text-sm">
                <div className="w-7 h-7 rounded-full border border-border flex items-center justify-center shrink-0 mt-0.5">
                  <Mail size={12} />
                </div>
                <a href="mailto:atideto.in@gmail.com" className="mt-1 break-all hover:text-primary transition-colors">atideto.in@gmail.com</a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground text-sm leading-relaxed">
                <div className="w-7 h-7 rounded-full border border-border flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={12} />
                </div>
                <span className="mt-1">Ponnammapet, Salem, Tamil Nadu, India</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} ATIDETO Technologies. All rights reserved. · Salem, Tamil Nadu, India
        </p>
        <div className="flex items-center gap-6">
          <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="/terms-and-conditions" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link to="/locations" className="hover:text-primary transition-colors">Regional Hubs</Link>
        </div>
      </div>
    </footer>
  );
}
