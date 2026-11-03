import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import notFoundBg from '@/assets/login/404.jpeg';
import SEO from '@/components/seo/SEO';

const NotFound = () => {
  const location = useLocation();

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
    <main className="relative min-h-[100vh] flex flex-col items-center justify-center pt-24 pb-12 px-4 text-white font-sans overflow-hidden">
      <SEO title="404 - Page Not Found | Atideto" description="The page you are looking for does not exist." noindex={true} />
      {/* Background Image scoped only to this section */}
      <div className="absolute inset-0 z-0">
        <img 
          src={notFoundBg} 
          alt="404 Background" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto p-4 md:p-8 mt-[30vh]">
          <h1 className="text-[32px] sm:text-[44px] font-bold text-white mb-2 tracking-tight drop-shadow-[0_0_30px_rgba(47,47,228,0.4)] font-heading leading-[1.15]">
            404
          </h1>
          <p className="text-lg sm:text-xl font-semibold text-white/90 mb-2 font-heading">
            Page <span className="italic text-[#38BDF8]">Not Found</span>
          </p>
          <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-md mx-auto font-inter font-normal">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              to="/" 
              className="inline-flex items-center justify-center px-8 py-4 bg-[#0052FF] hover:bg-[#0038B8] text-white rounded-lg font-medium transition-all duration-300 shadow-[0_0_20px_rgba(0,82,255,0.3)] hover:shadow-[0_0_30px_rgba(0,82,255,0.5)] tracking-wide uppercase text-sm"
            >
              ← Back to Home
            </Link>
            <Link 
              to="/client-connect" 
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-white/20 hover:border-white/50 text-white rounded-lg font-medium transition-all duration-300 tracking-wide uppercase text-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
    </main>
  );
};

export default NotFound;
