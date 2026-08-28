/**
 * SEO & GEO Metadata Generator Utilities for ATIDETO Technologies
 */

export const generateMetaTitle = (pageName: string, city?: string) => {
  const brand = "ATIDETO Technologies";
  if (city) {
    return `${pageName} in ${city}, Tamil Nadu | ${brand} | Smarter Systems`;
  }
  return `${pageName} | ${brand} – Premium Software, AI & Business Solutions`;
};

export const generateMetaDescription = (serviceName: string, keywords: string, city: string = "Salem, Tamil Nadu") => {
  return `ATIDETO Technologies provides enterprise-grade ${serviceName} solutions in ${city} and globally. Led by CEO Vishnu R, our team delivers custom software, CRM, ERP, web apps, AI automation, and cloud platforms. Focus: ${keywords}.`;
};

export const generateGeoKeywords = (baseKeywords: string[], city?: string) => {
  const base = [
    'ATIDETO Technologies',
    'ATIDETO',
    'Vishnu CEO Atideto',
    'Vishnu R Atideto',
    'business solutions',
    'enterprise CRM software',
    'smart billing system',
    'ERP systems',
    'inventory management',
    'school ERP',
    'hotel management system',
    'gym management',
    'library management',
    'transport fleet management',
    'supply chain management SCM',
    'learning management system LMS',
    'student management SMS',
    'expense management software',
    'ecommerce development',
    'API management',
    'chit fund software',
    'appointment booking system',
    'custom software development',
    'AI automation company',
    'Salem tech companies',
    'Tamil Nadu software development',
    'India IT solutions'
  ];

  if (city) {
    return [
      `software company in ${city}`,
      `business software ${city}`,
      `web development ${city}`,
      `IT internships ${city}`,
      `ERP solutions ${city}`,
      ...base
    ].join(', ');
  }

  return [...base, ...baseKeywords].join(', ');
};
