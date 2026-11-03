import { Helmet } from 'react-helmet-async';

interface SeoHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  jsonLd?: Record<string, any> | Record<string, any>[];
  breadcrumbs?: { name: string; url: string }[];
}

const SITE_NAME = 'Atideto Technologies';
const SITE_URL = 'https://atideto.in';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

/**
 * SeoHead — Injects per-page <title>, <meta>, <link rel="canonical">,
 * Open Graph tags, BreadcrumbList schema, and custom JSON-LD into <head>.
 *
 * Usage:
 *   <SeoHead
 *     title="AI Automation Services | Atideto"
 *     description="Custom AI chatbots, WhatsApp bots..."
 *     canonical="/services/ai-automation"
 *     breadcrumbs={[
 *       { name: 'Home', url: '/' },
 *       { name: 'Services', url: '/services' },
 *       { name: 'AI & Automation', url: '/services/ai-automation' }
 *     ]}
 *     jsonLd={{ "@type": "Service", ... }}
 *   />
 */
export default function SeoHead({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  noindex = false,
  jsonLd,
  breadcrumbs,
}: SeoHeadProps) {
  const fullTitle = title.includes('Atideto') ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = canonical
    ? canonical.startsWith('http') ? canonical : `${SITE_URL}${canonical}`
    : undefined;
  const image = ogImage || DEFAULT_OG_IMAGE;

  // Build BreadcrumbList schema from breadcrumbs prop
  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: crumb.name,
          item: crumb.url.startsWith('http') ? crumb.url : `${SITE_URL}${crumb.url}`,
        })),
      }
    : null;

  // Collect all JSON-LD blocks
  const jsonLdBlocks: Record<string, any>[] = [];
  if (breadcrumbSchema) jsonLdBlocks.push(breadcrumbSchema);
  if (jsonLd) {
    if (Array.isArray(jsonLd)) {
      jsonLdBlocks.push(...jsonLd);
    } else {
      jsonLdBlocks.push(jsonLd);
    }
  }

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Canonical */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Hreflang */}
      {canonicalUrl && (
        <>
          <link rel="alternate" hrefLang="en-in" href={canonicalUrl} />
          <link rel="alternate" hrefLang="en" href={canonicalUrl} />
          <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
        </>
      )}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={SITE_NAME} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      {jsonLdBlocks.map((block, i) => (
        <script key={`jsonld-${i}`} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}
