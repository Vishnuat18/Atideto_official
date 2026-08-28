import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  noindex?: boolean;
  author?: string;
  geoRegion?: string;
  geoPlacename?: string;
  geoPosition?: string;
  schema?: object | object[];
}

export default function SEO({
  title,
  description,
  keywords = 'ATIDETO, ATIDETO Technologies, Atideto, atideto.in, Atideto Tech, Atideto Solutions, Atideto Academy, Atideto Salem, Atideto India, Vishnu CEO Atideto, Vishnu R CEO, Neevas Nagil Founder, Kiran CPO, Business Solutions, CRM, Billing System, ERP, Inventory Management, School ERP, Hotel Management, Gym Management, Library Management, Transport Management, SCM Supply Chain, LMS, SMS, Expense Management, E-Commerce, API Management, Chit Fund, Appointment Booking, Custom Software, AI Automation, Salem, Tamil Nadu, India',
  image = 'https://www.atideto.in/og-image.jpg',
  url = 'https://www.atideto.in',
  type = 'website',
  noindex = false,
  author = 'Vishnu R, Chief Executive Officer (CEO) of ATIDETO Technologies',
  geoRegion = 'IN-TN',
  geoPlacename = 'Salem, Tamil Nadu, India',
  geoPosition = '11.6643;78.1460',
  schema,
}: SEOProps) {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="publisher" content="ATIDETO Technologies" />
      <meta name="copyright" content="ATIDETO Technologies" />

      {/* Geolocation Meta Tags for Local & Regional GEO SEO */}
      <meta name="geo.region" content={geoRegion} />
      <meta name="geo.placename" content={geoPlacename} />
      <meta name="geo.position" content={geoPosition} />
      <meta name="ICBM" content={geoPosition.replace(';', ', ')} />

      {/* Robots index/noindex */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="ATIDETO Technologies" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter / X Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
