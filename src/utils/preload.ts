// High-performance page and route preloader for instantaneous navigation
const preloadedRoutes = new Set<string>();

export const preloadRoute = (path: string) => {
  if (preloadedRoutes.has(path)) return;
  preloadedRoutes.add(path);

  try {
    switch (path) {
      case '/':
        import('@/pages/Index');
        break;
      case '/services':
        import('@/pages/Services');
        break;
      case '/academy':
        import('@/pages/Academy');
        break;
      case '/about':
        import('@/pages/About');
        break;
      case '/client-connect':
        import('@/pages/ClientConnect');
        break;
      case '/login':
        import('@/pages/Login');
        break;
      case '/requirement-gathering':
        import('@/pages/RequirementGathering');
        break;
      case '/privacy-policy':
        import('@/pages/PrivacyPolicy');
        break;
      case '/terms-and-conditions':
        import('@/pages/TermsAndConditions');
        break;
      case '/dashboard':
        import('@/pages/Dashboard');
        break;
      case '/profile':
        import('@/pages/Profile');
        break;
      default:
        break;
    }
  } catch (err) {
    // Fail gracefully if network or prefetch fails
    console.debug('Preload skipped for', path, err);
  }
};

/**
 * Prefetch primary navigation pages during browser idle time
 * ensuring zero network latency when the user clicks any link
 */
export const initIdlePreload = () => {
  if (typeof window === 'undefined') return;

  const runIdle = () => {
    const pages = ['/services', '/about', '/academy', '/client-connect', '/login'];
    pages.forEach((path, index) => {
      setTimeout(() => {
        preloadRoute(path);
      }, index * 200);
    });
  };

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(runIdle, { timeout: 2500 });
  } else {
    setTimeout(runIdle, 1000);
  }
};
