import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Disable automatic browser scroll restoration (like when hitting back button)
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Instantly jump to the top of the page on route change without any smooth scroll animation
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });
    
    // Fallback for older browsers
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const timer = setTimeout(() => {
      document.documentElement.style.scrollBehavior = '';
    }, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
