import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import notFoundBg from '@/assets/login/404.jpeg';

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
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              to="/" 
              className="inline-flex items-center justify-center px-8 py-4 bg-[#2F2FE4] hover:bg-[#3A3DFF] text-white rounded-lg font-medium transition-all duration-300 shadow-[0_0_20px_rgba(47,47,228,0.3)] hover:shadow-[0_0_30px_rgba(47,47,228,0.5)] tracking-wide uppercase text-sm"
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
