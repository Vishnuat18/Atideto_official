import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Disable automatic browser scroll restoration (like when hitting back button)
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // When arriving with a #hash (e.g. /services#web-dev), let the target page
    // handle scrolling to the referenced section instead of jumping to the top.
    if (window.location.hash) {
      return;
    }

    // Instantly jump to the top of the page on route change without any smooth scroll animation
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior, // Using 'instant' where supported (or defaults to auto)
    });
    
    // Fallback for older browsers
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}
