// Centralized SEO metadata for every public route
// Each entry maps a route path to its unique title, meta description, canonical, and optional JSON-LD

export interface PageSeoData {
  title: string;
  description: string;
  canonical: string;
  breadcrumbs: { name: string; url: string }[];
  jsonLd?: Record<string, any> | Record<string, any>[];
}

const SITE = 'https://atideto.in';

// Organization Schema — shared across all pages via index.html
export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Atideto Technologies',
  alternateName: 'Atideto',
  url: SITE,
  logo: `${SITE}/assets/logo.png`,
  description: 'Premium software company delivering web development, mobile apps, AI automation, custom software & digital marketing services across India, USA, UK & UAE.',
  foundingDate: '2024',
  founders: [{ '@type': 'Person', name: 'Vishnu Rajan' }],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Salem',
    addressLocality: 'Salem',
    addressRegion: 'Tamil Nadu',
    postalCode: '636001',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-XXXX-XXXXXX',
    contactType: 'customer service',
    availableLanguage: ['English', 'Tamil', 'Hindi'],
  },
  sameAs: [
    'https://www.linkedin.com/company/atideto',
    'https://www.instagram.com/atideto',
    'https://github.com/atideto',
    'https://www.facebook.com/atideto',
    'https://www.youtube.com/@atideto',
  ],
  areaServed: [
    { '@type': 'Country', name: 'India' },
    { '@type': 'Country', name: 'United States' },
    { '@type': 'Country', name: 'United Kingdom' },
    { '@type': 'Country', name: 'United Arab Emirates' },
  ],
};

// Service Schema builder
function serviceSchema(name: string, description: string, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: name,
    name,
    description,
    provider: { '@type': 'Organization', name: 'Atideto Technologies', url: SITE },
    url: `${SITE}/services/${slug}`,
    areaServed: 'India',
  };
}

// Per-page SEO data
export const PAGE_SEO: Record<string, PageSeoData> = {
  '/': {
    title: 'Atideto Technologies — AI, Web & App Development Company',
    description: 'Atideto Technologies builds premium websites, mobile apps, AI automations & custom software. Trusted by 50+ businesses across India, USA & UAE. Get a free quote.',
    canonical: '/',
    breadcrumbs: [{ name: 'Home', url: '/' }],
  },

  '/services': {
    title: 'Digital Services — Web, App, AI & Software Development',
    description: 'Explore Atideto\'s 7 core digital services: AI automation, web development, mobile apps, custom software, digital marketing, UI/UX design & business systems.',
    canonical: '/services',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
    ],
  },

  '/services/ai-automation': {
    title: 'AI Automation Services — Chatbots & Workflow Automation',
    description: 'Automate customer support, invoicing & workflows with Atideto\'s AI automation services. Custom chatbots, WhatsApp bots & predictive models for businesses.',
    canonical: '/services/ai-automation',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'AI & Automation', url: '/services/ai-automation' },
    ],
    jsonLd: [
      serviceSchema('AI & Automation Services', 'Custom AI chatbots, WhatsApp bots, workflow automation & predictive models for businesses.', 'ai-automation'),
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'How much does AI automation cost for a small business?', acceptedAnswer: { '@type': 'Answer', text: 'AI automation projects at Atideto start from ₹50,000 for a basic chatbot and can go up to ₹5,00,000+ for full enterprise workflow automation with custom ML models.' } },
          { '@type': 'Question', name: 'How long does it take to build a custom AI chatbot?', acceptedAnswer: { '@type': 'Answer', text: 'A production-ready AI chatbot typically takes 2–4 weeks from requirements to deployment, depending on integration complexity and training data volume.' } },
        ],
      },
    ],
  },

  '/services/website-development': {
    title: 'Website Development Services — Fast, Modern & SEO-Ready',
    description: 'Get a blazing-fast, mobile-first website built with React, Next.js & modern tech. Atideto delivers e-commerce, corporate & portal websites across India.',
    canonical: '/services/website-development',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Website Development', url: '/services/website-development' },
    ],
    jsonLd: serviceSchema('Website Development', 'Custom website development with sub-second load times, headless e-commerce, CMS & SEO optimization.', 'website-development'),
  },

  '/services/app-development': {
    title: 'Mobile App Development — iOS, Android & Cross-Platform',
    description: 'Build native iOS & Android apps or cross-platform Flutter & React Native apps. Atideto delivers enterprise-grade mobile apps for businesses across India.',
    canonical: '/services/app-development',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'App Development', url: '/services/app-development' },
    ],
    jsonLd: serviceSchema('Mobile App Development', 'Native iOS & Android apps, cross-platform Flutter & React Native development.', 'app-development'),
  },

  '/services/custom-software-development': {
    title: 'Custom Software Development — Bespoke Business Solutions',
    description: 'Get custom-built software tailored to your business. ERPs, SaaS platforms, billing systems, dashboards & internal tools by Atideto Technologies.',
    canonical: '/services/custom-software-development',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Custom Software', url: '/services/custom-software-development' },
    ],
    jsonLd: serviceSchema('Custom Software Development', 'Bespoke ERPs, SaaS platforms, billing systems & internal business tools.', 'custom-software-development'),
  },

  '/services/digital-marketing': {
    title: 'Digital Marketing Services — Ads, SEO & Lead Generation',
    description: 'Grow your business with Atideto\'s digital marketing services. Google Ads, Meta Ads, SEO, sales funnels & AI-powered ad creative generation.',
    canonical: '/services/digital-marketing',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Digital Marketing', url: '/services/digital-marketing' },
    ],
    jsonLd: serviceSchema('Digital Marketing', 'Google Ads, Meta Ads, SEO, sales funnels & AI-powered ad creative generation.', 'digital-marketing'),
  },

  '/services/ui-ux-design': {
    title: 'UI/UX Design Services — Product Design & Brand Identity',
    description: 'Elevate your product with Atideto\'s UI/UX design services. Figma prototypes, design systems, dashboard interfaces & WCAG-compliant accessible design.',
    canonical: '/services/ui-ux-design',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'UI/UX Design', url: '/services/ui-ux-design' },
    ],
    jsonLd: serviceSchema('UI/UX & Product Design', 'Figma prototypes, design systems, dashboard interfaces & brand identity packages.', 'ui-ux-design'),
  },

  '/services/business-systems': {
    title: 'Business Systems — ERP, CRM & Operations Software',
    description: 'Streamline operations with Atideto\'s business systems. CRM, ERP, billing, inventory, supply chain & institutional management software for Indian businesses.',
    canonical: '/services/business-systems',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Business Systems', url: '/services/business-systems' },
    ],
    jsonLd: serviceSchema('Business Systems', 'CRM, ERP, billing, inventory, supply chain & institutional management software.', 'business-systems'),
  },

  '/about': {
    title: 'About Atideto Technologies — Our Story, Team & Vision',
    description: 'Learn about Atideto Technologies: our mission to build digital experiences beyond imagination, our founding story from Salem, and the team behind 50+ projects.',
    canonical: '/about',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'About', url: '/about' },
    ],
  },

  '/careers': {
    title: 'Careers at Atideto Technologies — Join Our Team',
    description: 'Explore career opportunities at Atideto Technologies. We\'re hiring developers, designers, marketers & AI engineers. Remote-friendly roles across India.',
    canonical: '/careers',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Careers', url: '/careers' },
    ],
  },

  '/academy': {
    title: 'Atideto Academy — Tech Courses & Industry Internships',
    description: 'Join Atideto Academy for hands-on tech courses and industry internships in web development, AI, mobile apps, UI/UX & more. Certificate included.',
    canonical: '/academy',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Academy', url: '/academy' },
    ],
  },

  '/courses': {
    title: 'Tech Courses — Full Stack, AI, Mobile & Design',
    description: 'Browse Atideto\'s tech courses: full stack web development, AI & machine learning, mobile app development, UI/UX design and more. Industry-ready curriculum.',
    canonical: '/courses',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Academy', url: '/academy' },
      { name: 'Courses', url: '/courses' },
    ],
  },

  '/internships': {
    title: 'Tech Internships — Hands-On Industry Experience',
    description: 'Apply for Atideto\'s tech internships in web development, AI, mobile apps, UI/UX & digital marketing. Real projects, real mentorship, verified certificate.',
    canonical: '/internships',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Academy', url: '/academy' },
      { name: 'Internships', url: '/internships' },
    ],
  },

  '/client-connect': {
    title: 'Contact Atideto — Start Your Project Today',
    description: 'Get in touch with Atideto Technologies. Tell us about your project and receive a free consultation within 24 hours. Web, app, AI & software projects.',
    canonical: '/client-connect',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Contact', url: '/client-connect' },
    ],
  },

  '/verify': {
    title: 'Verify Certificate — Atideto Technologies',
    description: 'Verify the authenticity of your Atideto Technologies internship or course completion certificate using your certificate ID or student ID.',
    canonical: '/verify',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Verify Certificate', url: '/verify' },
    ],
  },

  '/privacy-policy': {
    title: 'Privacy Policy — Atideto Technologies',
    description: 'Read Atideto Technologies\' privacy policy. Learn how we collect, use, and protect your personal data across our website and services.',
    canonical: '/privacy-policy',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Privacy Policy', url: '/privacy-policy' },
    ],
  },

  '/terms-and-conditions': {
    title: 'Terms & Conditions — Atideto Technologies',
    description: 'Read the terms and conditions governing the use of Atideto Technologies\' website, services, academy and internship programs.',
    canonical: '/terms-and-conditions',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Terms & Conditions', url: '/terms-and-conditions' },
    ],
  },

  '/bot': {
    title: 'Lado AI Assistant — Atideto Technologies',
    description: 'Chat with Lado, Atideto\'s AI assistant. Get instant answers about our services, pricing, project timelines, and technology recommendations.',
    canonical: '/bot',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'AI Assistant', url: '/bot' },
    ],
  },

  '/requirement-gathering': {
    title: 'Project Requirements — Tell Us What You Need',
    description: 'Share your project requirements with Atideto. Our interactive form helps us understand your needs for web, app, AI or custom software development.',
    canonical: '/requirement-gathering',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Requirements', url: '/requirement-gathering' },
    ],
  },
};

// Helper: get SEO data for a route, with fallback
export function getSeoForRoute(pathname: string): PageSeoData {
  // Direct match
  if (PAGE_SEO[pathname]) return PAGE_SEO[pathname];

  // Try matching service detail routes
  if (pathname.startsWith('/services/')) {
    const serviceId = pathname.replace('/services/', '');
    return PAGE_SEO[pathname] || {
      title: `${serviceId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Services`,
      description: `Learn about Atideto's ${serviceId.replace(/-/g, ' ')} services. Premium digital solutions for businesses across India.`,
      canonical: pathname,
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Services', url: '/services' },
        { name: serviceId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), url: pathname },
      ],
    };
  }

  // Course detail
  if (pathname.startsWith('/courses/')) {
    return {
      title: 'Course Details — Atideto Academy',
      description: 'Explore this course at Atideto Academy. Industry-ready curriculum with hands-on projects and certification.',
      canonical: pathname,
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Academy', url: '/academy' },
        { name: 'Courses', url: '/courses' },
        { name: 'Course Details', url: pathname },
      ],
    };
  }

  // Internship detail
  if (pathname.startsWith('/internships/') || pathname.startsWith('/upskill/')) {
    return {
      title: 'Internship Details — Atideto Academy',
      description: 'Apply for this industry internship at Atideto. Real projects, expert mentorship, and a verified completion certificate.',
      canonical: pathname,
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Academy', url: '/academy' },
        { name: 'Internships', url: '/internships' },
        { name: 'Internship Details', url: pathname },
      ],
    };
  }

  // Verify with ID
  if (pathname.startsWith('/verify/') || pathname.startsWith('/studentverify')) {
    return PAGE_SEO['/verify'];
  }

  // Default fallback
  return {
    title: 'Atideto Technologies — Building Digital Experiences',
    description: 'Atideto Technologies is a premium software company delivering web, mobile, AI, and cloud solutions across India, USA, UK & UAE.',
    canonical: pathname,
    breadcrumbs: [{ name: 'Home', url: '/' }],
  };
}
