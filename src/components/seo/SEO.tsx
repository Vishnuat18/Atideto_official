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
<<<<<<< HEAD
  keywords = 'ATIDETO, ATIDETO Technologies, Atideto, atideto.in, Atideto Tech, Atideto Solutions, Atideto Academy, Atideto Salem, Atideto India, Vishnu CEO Atideto, Vishnu R CEO, Neevas Nagil Founder, Kiran CPO, Business Solutions, CRM, Billing System, ERP, Inventory Management, School ERP, Hotel Management, Gym Management, Library Management, Transport Management, SCM Supply Chain, LMS, SMS, Expense Management, E-Commerce, API Management, Chit Fund, Appointment Booking, Custom Software, AI Automation, Salem, Tamil Nadu, India',
=======
  keywords = 'ATIDETO, ATIDETO Technologies, Atideto, atideto.in, Atideto Tech, Atideto Solutions, Atideto Academy, Atideto Salem, Atideto India, Vishnu CEO Atideto, Vishnu R CEO, Kiran CPO, Business Solutions, CRM Software, Billing System, ERP Software, Inventory Management, School ERP, Hotel Management, Gym Management, Library Management, Transport Management, SCM Supply Chain, LMS, SMS, Expense Management, E-Commerce Development, API Management, Chit Fund Software, Appointment Booking, Custom Software Salem, AI Automation Tamil Nadu, Enterprise Web Development, Mobile App Development, Cloud Architecture, Salem, Tamil Nadu, India',
>>>>>>> 9afa06a (2.3)
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
<<<<<<< HEAD
=======
      <meta name="title" content={title} />
>>>>>>> 9afa06a (2.3)
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="publisher" content="ATIDETO Technologies" />
      <meta name="copyright" content="ATIDETO Technologies" />
<<<<<<< HEAD
=======
      <meta name="rating" content="General" />
      <meta name="distribution" content="Global" />
      <meta name="revisit-after" content="2 days" />
      <meta name="language" content="English" />
      <meta httpEquiv="content-language" content="en-IN, en-US, en-GB" />
>>>>>>> 9afa06a (2.3)

      {/* Geolocation Meta Tags for Local & Regional GEO SEO */}
      <meta name="geo.region" content={geoRegion} />
      <meta name="geo.placename" content={geoPlacename} />
      <meta name="geo.position" content={geoPosition} />
      <meta name="ICBM" content={geoPosition.replace(';', ', ')} />

<<<<<<< HEAD
      {/* Robots index/noindex */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
=======
      {/* Dublin Core Meta Tags */}
      <meta name="DC.title" content={title} />
      <meta name="DC.creator" content={author} />
      <meta name="DC.subject" content="Enterprise Software, AI Automation, Custom Web & Mobile Solutions" />
      <meta name="DC.description" content={description} />
      <meta name="DC.publisher" content="ATIDETO Technologies" />
      <meta name="DC.language" content="en" />
      <meta name="DC.coverage" content="World" />

      {/* Robots & Search Engine Indexing Directives */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <>
          <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
          <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
          <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        </>
>>>>>>> 9afa06a (2.3)
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

<<<<<<< HEAD
      {/* Open Graph / Facebook / WhatsApp */}
=======
      {/* Open Graph / Facebook / WhatsApp / LinkedIn */}
>>>>>>> 9afa06a (2.3)
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
<<<<<<< HEAD
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="ATIDETO Technologies" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter / X Card */}
      <meta name="twitter:card" content="summary_large_image" />
=======
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="ATIDETO Technologies – Smarter Systems. Stronger Business." />
      <meta property="og:site_name" content="ATIDETO Technologies" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:locale:alternate" content="en_US" />

      {/* Twitter / X Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@atideto" />
      <meta name="twitter:creator" content="@atideto" />
>>>>>>> 9afa06a (2.3)
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
<<<<<<< HEAD
=======
      <meta name="twitter:image:alt" content="ATIDETO Technologies – Business Solutions & AI Engineering" />
>>>>>>> 9afa06a (2.3)

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
