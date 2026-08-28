import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import SEO from '@/components/seo/SEO';
import notFoundBg from '@/assets/login/404.jpeg';
import notFoundLightBg from '@/assets/login/404-light.jpeg';

const NotFound = () => {
  const location = useLocation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
    
    // Hide PreFooterCTA globally
    const preFooter = document.getElementById('pre-footer-cta');
    if (preFooter) preFooter.style.display = 'none';
    
    return () => {
      if (preFooter) preFooter.style.display = 'block';
    };
  }, [location.pathname]);

  return (
    <main className="relative min-h-[100vh] flex flex-col items-center justify-center pt-24 pb-12 px-4 text-[#0F172A] font-sans overflow-hidden">
      <SEO title="404 - Page Not Found | ATIDETO" description="The page you are looking for does not exist." noindex={true} />
      {/* Background scoped only to this section */}
      {isDark ? (
        <div className="absolute inset-0 z-0">
          <img 
            src={notFoundBg} 
            alt="404 Background" 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-0 z-0">
          <img 
            src={notFoundLightBg} 
            alt="404 Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/20 to-white/40" />
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto p-4 md:p-8 mt-[30vh]">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              to="/" 
              className="inline-flex items-center justify-center px-8 py-4 bg-[#2F2FE4] hover:bg-[#3A3DFF] text-white rounded-lg font-medium transition-all duration-300 shadow-[0_0_20px_rgba(47,47,228,0.3)] hover:shadow-[0_0_30px_rgba(47,47,228,0.5)] tracking-wide uppercase text-sm"
            >
              ← Back to Home
            </Link>
            <Link 
              to="/client-connect" 
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-[#CBD5E1] hover:border-[#2F2FE4] text-[#0F172A] rounded-lg font-medium transition-all duration-300 tracking-wide uppercase text-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
    </main>
  );
};

export default NotFound;
