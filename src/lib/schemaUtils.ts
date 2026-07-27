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
    "name": "ATIDETO",
    "url": "https://atideto.in",
    "logo": "https://atideto.in/assets/atideto-logo.png",
    "description": "ATIDETO is a premium software company delivering web, mobile, AI, and cloud solutions, alongside a world-class tech academy.",
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
    "name": `ATIDETO ${city}`,
    "url": "https://atideto.in",
    "image": "https://atideto.in/assets/home.png",
    "description": "ATIDETO provides premium software, web development, AI automation, and professional IT training.",
    "telephone": "+916379000598",
    "email": "mailto:vishnurajan24766@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "",
      "addressLocality": city,
      "addressRegion": "Tamil Nadu",
      "addressCountry": "IN"
    }
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
