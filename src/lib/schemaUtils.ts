export interface CourseDetails {
  name: string;
  description: string;
  providerName: string;
  url: string;
}

export interface ServiceDetails {
  name: string;
  description: string;
  url: string;
  image?: string;
  providerName: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.atideto.in/#organization",
    "name": "ATIDETO Technologies",
    "alternateName": "ATIDETO",
    "url": "https://www.atideto.in/",
    "logo": "https://www.atideto.in/atideto-logo.png",
    "description": "ATIDETO Technologies is an enterprise technology and software solutions company in Salem, Tamil Nadu, engineering custom software, web applications, mobile apps, AI automation, and cloud systems.",
    "telephone": "+919087284053",
    "email": "atideto.in@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Ponnammapet",
      "addressLocality": "Salem",
      "addressRegion": "Tamil Nadu",
      "postalCode": "636001",
      "addressCountry": "IN"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "sameAs": [
      "https://www.linkedin.com/company/atideto",
      "https://github.com/Vishnuat18"
    ]
  };
};

export const generateLocalBusinessSchema = (city: string = "Salem") => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://www.atideto.in/#localbusiness-${city.toLowerCase().replace(/\\s+/g, '-')}`,
    "name": city === "Salem" ? "ATIDETO Technologies" : `ATIDETO Technologies - ${city}`,
    "alternateName": "ATIDETO",
    "url": "https://www.atideto.in/",
    "image": "https://www.atideto.in/atideto-logo.png",
    "description": "ATIDETO Technologies provides enterprise software development, web & mobile applications, AI automation, and professional IT internships.",
    "telephone": "+919087284053",
    "email": "atideto.in@gmail.com",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": city === "Salem" ? "Ponnammapet" : "",
      "addressLocality": city,
      "addressRegion": "Tamil Nadu",
      "postalCode": city === "Salem" ? "636001" : undefined,
      "addressCountry": "IN"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "geo": city === "Salem" ? {
      "@type": "GeoCoordinates",
      "latitude": 11.6643,
      "longitude": 78.1460
    } : undefined
  };
};

export const generateCourseSchema = (course: CourseDetails) => {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.name,
    "description": course.description,
    "provider": {
      "@type": "EducationalOrganization",
      "name": course.providerName,
      "url": course.url
    }
  };
};

export const generateServiceSchema = (service: ServiceDetails) => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    "provider": {
      "@type": "LocalBusiness",
      "name": service.providerName,
      "url": service.url,
      "image": service.image
    }
  };
};

export const generateFAQSchema = (faqs: FAQItem[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

export const generateBreadcrumbSchema = (paths: { name: string; url: string }[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": paths.map((path, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": path.name,
      "item": path.url
    }))
  };
};
