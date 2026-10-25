import { useLocation } from 'react-router-dom';
import SeoHead from '@/components/seo/SeoHead';
import { getSeoForRoute } from '@/constants/seoData';

/**
 * RouteSeoInjector — Automatically injects the correct SeoHead
 * for the current route. Place this once inside <BrowserRouter>.
 */
export default function RouteSeoInjector() {
  const { pathname } = useLocation();
  const seo = getSeoForRoute(pathname);

  return (
    <SeoHead
      title={seo.title}
      description={seo.description}
      canonical={seo.canonical}
      breadcrumbs={seo.breadcrumbs}
      jsonLd={seo.jsonLd}
      noindex={
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/admin') ||
        pathname.startsWith('/profile') ||
        pathname.startsWith('/login')
      }
    />
  );
}
