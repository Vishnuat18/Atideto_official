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

/**
 * Generate Schema.org Person entity for Vishnu R (CEO & Founder of ATIDETO Technologies)
 */
export const generateCEOSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://www.atideto.in/#ceo",
    "name": "Vishnu R",
    "alternateName": ["Vishnu", "Vishnu Atideto", "Vishnu R Atideto"],
    "jobTitle": "Chief Executive Officer (CEO)",
    "description": "CEO & Founder of ATIDETO Technologies. Full-stack architect specializing in scalable enterprise systems, AI agent workflows, and cloud application engineering.",
    "image": "https://www.atideto.in/og-image.jpg",
    "url": "https://www.atideto.in/about",
    "worksFor": {
      "@type": "Organization",
      "@id": "https://www.atideto.in/#organization",
      "name": "ATIDETO Technologies"
    },
    "knowsAbout": [
      "Software Architecture",
      "Artificial Intelligence & GenAI",
      "Cloud Infrastructure (AWS, GCP, Kubernetes)",
      "Enterprise Resource Planning (ERP)",
      "CRM & Sales Automation Systems",
      "Full-Stack Web & Mobile Engineering",
      "Executive Technology Leadership"
    ],
    "sameAs": [
      "https://www.linkedin.com/in/vishnu-r-a41884300/",
      "https://github.com/Vishnuat18"
    ]
  };
};

/**
 * Generate Schema.org Person entities for the 3 Core Leaders:
 * 1. Vishnu R (CEO & Founder)
 * 2. Neevas Nagil AR (Founder)
 * 3. Kiran Balaso Patil (CPO)
 */
export const generateLeadershipSchema = () => {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": "https://www.atideto.in/#ceo",
      "name": "Vishnu R",
      "alternateName": ["Vishnu", "Vishnu Atideto", "Vishnu R Atideto"],
      "jobTitle": "Chief Executive Officer (CEO) & Founder",
      "description": "Chief Executive Officer and Full-Stack Architect. Directs company vision, enterprise engineering, AI innovation, and scalable system infrastructure at ATIDETO Technologies.",
      "image": "https://www.atideto.in/og-image.jpg",
      "url": "https://www.atideto.in/about",
      "worksFor": {
        "@type": "Organization",
        "@id": "https://www.atideto.in/#organization",
        "name": "ATIDETO Technologies"
      },
      "knowsAbout": [
        "Software Architecture",
        "Artificial Intelligence & GenAI",
        "Cloud Infrastructure (AWS, GCP, Kubernetes)",
        "Enterprise Resource Planning (ERP)",
        "CRM & Sales Automation Systems",
        "Full-Stack Web & Mobile Engineering",
        "Executive Technology Leadership"
      ],
      "sameAs": [
        "https://www.linkedin.com/in/vishnu-r-a41884300/",
        "https://github.com/Vishnuat18"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": "https://www.atideto.in/#founder-neevas",
      "name": "Neevas Nagil AR",
      "alternateName": ["Neevas Nagil", "Neevas Atideto"],
      "jobTitle": "Founder",
      "description": "Co-founder driving product strategy, client partnerships, enterprise software deployment, and strategic business growth at ATIDETO Technologies.",
      "image": "https://www.atideto.in/og-image.jpg",
      "url": "https://www.atideto.in/about",
      "worksFor": {
        "@type": "Organization",
        "@id": "https://www.atideto.in/#organization",
        "name": "ATIDETO Technologies"
      },
      "sameAs": [
        "https://www.linkedin.com/in/neevas-ramesh-6a3146366",
        "https://instagram.com/mr_cotton_candy_30"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": "https://www.atideto.in/#cpo-kiran",
      "name": "Kiran Balaso Patil",
      "alternateName": ["Kiran Patil", "Kiran Atideto"],
      "jobTitle": "Chief Product Officer (CPO)",
      "description": "Chief Product Officer & cloud infrastructure expert specializing in Kubernetes, AWS, and enterprise architecture scaling at ATIDETO Technologies.",
      "image": "https://www.atideto.in/og-image.jpg",
      "url": "https://www.atideto.in/about",
      "worksFor": {
        "@type": "Organization",
        "@id": "https://www.atideto.in/#organization",
        "name": "ATIDETO Technologies"
      },
      "sameAs": [
        "https://www.linkedin.com/in/kiran-balaso-patil-851a43351",
        "https://github.com/KiranBalasoPatil3052006"
      ]
    }
  ];
};

/**
 * Generate Brand & Entity Disambiguation Schema
 * Specifically establishes "ATIDETO" as an enterprise technology company (distinguishing from medical "antidote")
 */
export const generateBrandEntitySchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Brand",
    "@id": "https://www.atideto.in/#brand",
    "name": "ATIDETO",
    "alternateName": ["Atideto", "ATIDETO Technologies", "Atideto Solutions", "Atideto Tech", "Atideto Academy"],
    "disambiguatingDescription": "ATIDETO Technologies (distinct brand name, not antidote) is an Indian enterprise software engineering, business systems, and AI technology enterprise based in Salem, Tamil Nadu, founded and directed by CEO Vishnu R.",
    "slogan": "INNOVATE • BUILD • TRANSFORM",
    "url": "https://www.atideto.in/",
    "logo": "https://www.atideto.in/atideto-logo.png"
  };
};

/**
 * Generate Schema.org Organization entity with CEO Vishnu R, Founders, and all 17 business solutions
 */
export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.atideto.in/#organization",
    "name": "ATIDETO Technologies",
    "alternateName": ["ATIDETO", "Atideto", "Atideto Technologies", "Atideto Solutions", "Atideto Tech", "Atideto Salem", "Atideto India"],
    "legalName": "ATIDETO Technologies",
    "slogan": "INNOVATE • BUILD • TRANSFORM",
    "url": "https://www.atideto.in/",
    "logo": "https://www.atideto.in/atideto-logo.png",
    "image": "https://www.atideto.in/og-image.jpg",
    "disambiguatingDescription": "ATIDETO Technologies (not to be confused with antidote) is an enterprise software engineering company and AI systems provider based in Salem, Tamil Nadu, India, founded and led by CEO Vishnu R.",
    "description": "ATIDETO Technologies is a premium technology and digital solutions enterprise in Salem, Tamil Nadu. We engineer intelligent business software: CRM, Billing Systems, ERP, Inventory, School ERP, Web & Mobile Applications, AI Automation, and Cloud Infrastructure.",
    "telephone": "+919087284053",
    "email": "atidetotechnologies@gmail.com",
    "founder": [
      {
        "@type": "Person",
        "@id": "https://www.atideto.in/#ceo",
        "name": "Vishnu R",
        "jobTitle": "Chief Executive Officer (CEO) & Founder"
      },
      {
        "@type": "Person",
        "@id": "https://www.atideto.in/#founder-neevas",
        "name": "Neevas Nagil AR",
        "jobTitle": "Founder"
      }
    ],
    "ceo": {
      "@type": "Person",
      "@id": "https://www.atideto.in/#ceo",
      "name": "Vishnu R",
      "jobTitle": "Chief Executive Officer (CEO)"
    },
    "employee": [
      {
        "@type": "Person",
        "@id": "https://www.atideto.in/#cpo-kiran",
        "name": "Kiran Balaso Patil",
        "jobTitle": "Chief Product Officer (CPO)"
      }
    ],
    "brand": {
      "@type": "Brand",
      "@id": "https://www.atideto.in/#brand",
      "name": "ATIDETO"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+919087284053",
        "contactType": "sales & inquiries",
        "email": "atidetotechnologies@gmail.com",
        "areaServed": ["IN", "Worldwide"],
        "availableLanguage": ["English", "Tamil"]
      },
      {
        "@type": "ContactPoint",
        "telephone": "+919363600534",
        "contactType": "customer support",
        "email": "atideto.in@gmail.com",
        "areaServed": ["IN", "Worldwide"],
        "availableLanguage": ["English", "Tamil"]
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Ponnammapet",
      "addressLocality": "Salem",
      "addressRegion": "Tamil Nadu",
      "postalCode": "636001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 11.6643,
      "longitude": 78.1460
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "19:00"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "ATIDETO Business Solutions Suite",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "SoftwareApplication", "name": "CRM – Customer Relationship Management" } },
        { "@type": "Offer", "itemOffered": { "@type": "SoftwareApplication", "name": "Billing System – Invoicing & GST" } },
        { "@type": "Offer", "itemOffered": { "@type": "SoftwareApplication", "name": "ERP – Enterprise Resource Planning" } },
        { "@type": "Offer", "itemOffered": { "@type": "SoftwareApplication", "name": "Inventory Management System" } },
        { "@type": "Offer", "itemOffered": { "@type": "SoftwareApplication", "name": "School ERP System" } },
        { "@type": "Offer", "itemOffered": { "@type": "SoftwareApplication", "name": "Hotel Management System" } },
        { "@type": "Offer", "itemOffered": { "@type": "SoftwareApplication", "name": "Gym Management System" } },
        { "@type": "Offer", "itemOffered": { "@type": "SoftwareApplication", "name": "Library Management System" } },
        { "@type": "Offer", "itemOffered": { "@type": "SoftwareApplication", "name": "Transport Management System" } },
        { "@type": "Offer", "itemOffered": { "@type": "SoftwareApplication", "name": "SCM – Supply Chain Management" } },
        { "@type": "Offer", "itemOffered": { "@type": "SoftwareApplication", "name": "LMS – Learning Management System" } },
        { "@type": "Offer", "itemOffered": { "@type": "SoftwareApplication", "name": "SMS – Student Management System" } },
        { "@type": "Offer", "itemOffered": { "@type": "SoftwareApplication", "name": "Expense Management System" } },
        { "@type": "Offer", "itemOffered": { "@type": "SoftwareApplication", "name": "E-Commerce Management System" } },
        { "@type": "Offer", "itemOffered": { "@type": "SoftwareApplication", "name": "API Management System" } },
        { "@type": "Offer", "itemOffered": { "@type": "SoftwareApplication", "name": "Chit Fund Management System" } },
        { "@type": "Offer", "itemOffered": { "@type": "SoftwareApplication", "name": "Appointment Booking System" } }
      ]
    },
    "sameAs": [
      "https://www.linkedin.com/company/atideto",
      "https://github.com/Vishnuat18",
      "https://www.instagram.com/atideto",
      "https://youtube.com/@atideto"
    ]
  };
};

/**
 * Generate LocalBusiness & ProfessionalService schema with exact coordinates for Local & GEO SEO
 */
export const generateLocalBusinessSchema = (city: string = "Salem") => {
  const isSalem = city.toLowerCase() === "salem";
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `https://www.atideto.in/#localbusiness-${city.toLowerCase().replace(/\s+/g, '-')}`,
    "name": isSalem ? "ATIDETO Technologies – Software & Business Solutions" : `ATIDETO Technologies - ${city}`,
    "alternateName": ["ATIDETO", `ATIDETO ${city}`, "Atideto"],
    "url": "https://www.atideto.in/",
    "image": "https://www.atideto.in/og-image.jpg",
    "logo": "https://www.atideto.in/atideto-logo.png",
    "description": `ATIDETO Technologies provides enterprise business solutions (CRM, ERP, Billing, Inventory, School ERP), custom software development, web & mobile applications, and AI automation for clients in ${city}, Tamil Nadu, and globally.`,
    "telephone": "+919087284053",
    "email": "atidetotechnologies@gmail.com",
    "priceRange": "$$",
    "currenciesAccepted": "INR, USD, EUR",
    "paymentAccepted": "Cash, Credit Card, UPI, Net Banking, Wire Transfer",
    "founder": {
      "@type": "Person",
      "@id": "https://www.atideto.in/#ceo",
      "name": "Vishnu R",
      "jobTitle": "Chief Executive Officer (CEO)"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": isSalem ? "Ponnammapet" : `${city} Regional Center`,
      "addressLocality": city,
      "addressRegion": "Tamil Nadu",
      "postalCode": isSalem ? "636001" : undefined,
      "addressCountry": "IN"
    },
    "geo": isSalem ? {
      "@type": "GeoCoordinates",
      "latitude": 11.6643,
      "longitude": 78.1460
    } : {
      "@type": "GeoCoordinates",
      "latitude": 11.1271,
      "longitude": 78.6569
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "19:00"
      }
    ],
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": "Tamil Nadu"
      },
      {
        "@type": "Country",
        "name": "India"
      }
    ]
  };
};

/**
 * Generate Schema.org schemas for all 17 Business Solutions
 */
export const generateBusinessSolutionsSchema = () => {
  const solutions = [
    { name: "CRM – Customer Relationship Management", desc: "Manage leads, pipelines, customer interactions and sales automation." },
    { name: "Billing System", desc: "Automated GST invoicing, recurring billing, and payment processing." },
    { name: "ERP – Enterprise Resource Planning", desc: "Unified enterprise operations, HR, procurement and accounting system." },
    { name: "Inventory Management System", desc: "Track, manage and optimize warehouse inventory with barcode scanning." },
    { name: "School ERP", desc: "Complete management solution for schools, admissions, fees, and student report cards." },
    { name: "Hotel Management System", desc: "Simplify hotel operations, room reservations, and guest management." },
    { name: "Gym Management System", desc: "Manage fitness memberships, schedules, biometric access and subscriptions." },
    { name: "Library Management System", desc: "Digital book cataloging, barcode issue/returns, and member management." },
    { name: "Transport Management System", desc: "Fleet GPS tracking, route optimization, driver logs and transport operations." },
    { name: "SCM – Supply Chain Management", desc: "Streamline procurement, logistics, vendor portals, and supply chain visibility." },
    { name: "LMS – Learning Management System", desc: "Online course delivery, interactive quizzes, video streaming and certification." },
    { name: "SMS – Student Management System", desc: "Centralized student academic data, grading, attendance, and alumni records." },
    { name: "Expense Management System", desc: "OCR receipt scanning, budget approvals, and corporate expense tracking." },
    { name: "E-Commerce Management System", desc: "High-converting online storefronts, catalog, payments, and shipping sync." },
    { name: "API Management System", desc: "Secure, monitor and manage enterprise APIs with developer portals." },
    { name: "Chit Fund Management System", desc: "Manage chit groups, live auctions, dividends, and subscriber passbooks." },
    { name: "Appointment Booking System – For All Businesses", desc: "Self-service calendar bookings, automated WhatsApp reminders, and slot management." }
  ];

  return solutions.map((sol) => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": sol.name,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web, Cloud, Windows, Android, iOS",
    "description": sol.desc,
    "provider": {
      "@type": "Organization",
      "@id": "https://www.atideto.in/#organization",
      "name": "ATIDETO Technologies"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "@id": "https://www.atideto.in/#organization"
      }
    }
  }));
};

export const generateCourseSchema = (course: CourseDetails) => {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.name,
    "description": course.description,
    "provider": {
      "@type": "EducationalOrganization",
      "@id": "https://www.atideto.in/#organization",
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
      "@type": "Organization",
      "@id": "https://www.atideto.in/#organization",
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
