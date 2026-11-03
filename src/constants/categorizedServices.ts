// 8 Categorized Services Data Structure matching Mega Menu & Service Detail Page
import crmImg from '@/assets/solutions/crm.png';
import billingImg from '@/assets/solutions/billing.png';
import erpImg from '@/assets/solutions/erp.png';
import inventoryImg from '@/assets/solutions/inventory_management.png';
import schoolErpImg from '@/assets/solutions/school_erp.png';
import hotelImg from '@/assets/solutions/hotel management.png';
import gymImg from '@/assets/solutions/gym_management.png';
import businessPortfolioImg from '@/assets/solutions/business_portfolio.png';
import transportImg from '@/assets/solutions/transport_management.png';
import scmImg from '@/assets/solutions/scm.png';
import lmsImg from '@/assets/solutions/lms.png';
import studentMgmtImg from '@/assets/solutions/student_management.png';
import expenseImg from '@/assets/solutions/expense.png';
import ecommerceImg from '@/assets/solutions/ecommerce.png';
import apiImg from '@/assets/solutions/api.png';
import appointmentImg from '@/assets/solutions/appointment.png';
import digitalMarketingImg from '@/assets/solutions/digital_marketing.png';
import chitImg from '@/assets/solutions/chit.png';

export interface ServiceFeatureCard {
  title: string;
  desc: string;
  image: string;
  badge?: string;
}

export interface WhereThisHelpsItem {
  num: string;
  title: string;
  desc: string;
}

export interface WhatsPossibleGroup {
  groupTitle: string;
  desc: string;
  pillTags: string[];
}

export interface CategorizedService {
  id: string;
  num: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  subtitle?: string;
  tagline: string;
  description: string;
  accentColor: string;
  visualImage: string;
  capabilitiesCol1: string[];
  capabilitiesCol2: string[];
  capabilities: { name: string; tag?: string }[];
  featureGrid: ServiceFeatureCard[];
  whereThisHelps: WhereThisHelpsItem[];
  whatsPossible: WhatsPossibleGroup[];
  cta: {
    tag: string;
    title: string;
    desc: string;
    buttonText: string;
  };
}

export const CATEGORIZED_SERVICES: CategorizedService[] = [
  // ── 01. AI & Automation (Reference Image 1) ───────────────────────────
  {
    id: 'ai-automation',
    num: '01',
    title: 'AI & Automation',
    shortTitle: 'AI & Automation',
    eyebrow: 'INTELLIGENT SYSTEMS & BOT PROCESSORS',
    tagline: 'Spend less time on repetitive work and respond to customers more consistently.',
    description: 'We build autonomous AI agents, WhatsApp bots, multi-app Zapier/Make pipelines, customer support auto-triaging, and automated invoice processors that run on autopilot.',
    accentColor: '#0066FF',
    visualImage: '/images/solutions/sol/ai_automation.png',
    capabilitiesCol1: [
      'AI Chatbots',
      'Appointment & Reminder Automation',
      'Business Process Automation',
      'CRM Pipelining Automation',
      'Custom AI Solutions'
    ],
    capabilitiesCol2: [
      'Customer Support Automation',
      'Email Automation',
      'Website Chatbots',
      'WhatsApp Automation',
      'YouTube Automation'
    ],
    capabilities: [
      { name: 'AI Chatbots' },
      { name: 'Appointment & Reminder Automation' },
      { name: 'Business Process Automation' },
      { name: 'CRM Pipelining Automation' },
      { name: 'Custom AI Solutions' },
      { name: 'Customer Support Automation' },
      { name: 'Email Automation' },
      { name: 'Website Chatbots' },
      { name: 'WhatsApp Automation' },
      { name: 'YouTube Automation' }
    ],
    featureGrid: [
      {
        title: 'Autonomous WhatsApp AI Agents',
        desc: 'Engage customers instantly 24/7, answer questions from your product catalog, and book meetings.',
        image: apiImg,
        badge: '24/7 AI'
      },
      {
        title: 'Automated Invoice & Document OCR',
        desc: 'AI parses PDF invoices, receipts, and contracts directly into your accounting software in seconds.',
        image: billingImg,
        badge: 'Zero Entry'
      },
      {
        title: 'Multi-App Workflow Orchestration',
        desc: 'Connect your website, CRM, payment gateway, and Slack with automated data flow pipelines.',
        image: crmImg,
        badge: 'Zapier & Make'
      },
      {
        title: 'Customer Support Auto-Triaging',
        desc: 'AI categorizes support tickets, drafts intelligent replies, and escalates urgent issues.',
        image: appointmentImg,
        badge: 'Smart Support'
      },
      {
        title: 'Lead Enrichment & Instant Sync',
        desc: 'Automatically enrich inbound inquiries with company revenue, tech stack, and social data.',
        image: digitalMarketingImg,
        badge: 'Lead Intel'
      },
      {
        title: 'Custom Predictive Models',
        desc: 'Forecast demand, detect anomalies, and personalize user experiences with machine learning.',
        image: erpImg,
        badge: 'Predictive ML'
      }
    ],
    whereThisHelps: [
      {
        num: '01',
        title: 'Scale Without Adding Headcount',
        desc: 'Automate tasks that currently require 3 to 5 full-time staff members without ongoing overhead.'
      },
      {
        num: '02',
        title: 'Instant Sub-Minute Response Times',
        desc: 'Convert 50% more inbound leads by answering queries within seconds, even on weekends and holidays.'
      },
      {
        num: '03',
        title: 'Eliminate Human Data Entry Errors',
        desc: 'Automated pipelines transfer invoice data, inventory counts, and customer info with 100% precision.'
      },
      {
        num: '04',
        title: 'Liberate Your Team for High-Value Work',
        desc: 'Free up employees from tedious data copy-pasting so they can focus on closing deals and building relationships.'
      }
    ],
    whatsPossible: [
      {
        groupTitle: 'Conversational AI & Chatbots',
        desc: 'Intelligent agents that understand business context and customer requests.',
        pillTags: ['WhatsApp Bots ↗', 'Website Copilots ↗', 'Voice AI ↗']
      },
      {
        groupTitle: 'Operations & Workflow Orchestration',
        desc: 'Seamless data integration pipelines connecting all your tools into one cohesive machine.',
        pillTags: ['CRM Sync ↗', 'Billing Automation ↗', 'Inventory Triggers ↗']
      },
      {
        groupTitle: 'Custom Machine Learning & OCR',
        desc: 'Enterprise algorithms that parse invoices, detect anomalies, and predict inventory.',
        pillTags: ['Document OCR ↗', 'Predictive Engines ↗', 'Custom LLM RAG ↗']
      }
    ],
    cta: {
      tag: 'START A PROJECT',
      title: "Let's automate your business operations.",
      desc: 'Tell us your biggest manual bottlenecks. We will architect autonomous workflows that save hours daily.',
      buttonText: 'Start a conversation ↗'
    }
  },

  // ── 02. Business Systems (Enterprise Category) ────────────────────────
  {
    id: 'business-systems',
    num: '02',
    title: 'Business Systems',
    shortTitle: 'Business Systems',
    eyebrow: 'ENTERPRISE OPERATIONS & WORKFLOWS',
    tagline: 'Unify finance, operations, stock, and personnel into one cohesive engine.',
    description: 'We engineer end-to-end operational software that unifies accounting, sales funnels, warehouse stock, and employee workflows with enterprise role-based governance.',
    accentColor: '#0066FF',
    visualImage: '/images/solutions/sol/business_systems.png',
    capabilitiesCol1: [
      'Billing & POS Systems',
      'Chit Fund Management',
      'CRM Systems',
      'Enterprise ERP',
      'Executive Dashboards & BI',
      'Fleet Management & GPS'
    ],
    capabilitiesCol2: [
      'Gym Management',
      'Hotel Management',
      'Inventory & Warehouse Management',
      'School & College ERP',
      'Supply Chain Management'
    ],
    capabilities: [
      { name: 'Billing & POS Systems' },
      { name: 'Chit Fund Management' },
      { name: 'CRM Systems' },
      { name: 'Enterprise ERP' },
      { name: 'Executive Dashboards & BI' },
      { name: 'Fleet Management & GPS' },
      { name: 'Gym Management' },
      { name: 'Hotel Management' },
      { name: 'Inventory & Warehouse Management' },
      { name: 'School & College ERP' },
      { name: 'Supply Chain Management' }
    ],
    featureGrid: [
      {
        title: 'Unified Operational Workflows',
        desc: 'Bridge accounting, sales, inventory, and procurement in one real-time command dashboard.',
        image: erpImg,
        badge: 'Enterprise'
      },
      {
        title: 'Centralized CRM & Lead Pipelines',
        desc: 'Capture, track, and nurture prospect pipelines with omnichannel communications.',
        image: crmImg,
        badge: 'Sales Acceleration'
      },
      {
        title: 'Automated Billing & Tax Compliance',
        desc: 'Recurring subscriptions, GST/VAT tax compliance, and automated invoice delivery.',
        image: billingImg,
        badge: 'Financial Flow'
      },
      {
        title: 'Smart Inventory & Barcode Tracking',
        desc: 'Multi-location warehouse oversight with low-stock alerts and QR scanning.',
        image: inventoryImg,
        badge: 'Warehouse Sync'
      },
      {
        title: 'Supply Chain & Shipment Telematics',
        desc: 'Predictive vendor replenishment and live fleet dispatch tracking.',
        image: scmImg,
        badge: 'Logistics Control'
      },
      {
        title: 'Digital Campus & Institutional Portals',
        desc: 'Student information systems, fee reconciliation, and attendance automation.',
        image: schoolErpImg,
        badge: 'Academics'
      }
    ],
    whereThisHelps: [
      {
        num: '01',
        title: 'Eliminate Departmental Silos',
        desc: 'Connect procurement, sales, finance, and logistics so everyone acts on single-source-of-truth data.'
      },
      {
        num: '02',
        title: 'Automate Manual Repetitive Tasks',
        desc: 'Cut 15+ hours weekly per team member with automated reconciliations, invoice generations, and status alerts.'
      },
      {
        num: '03',
        title: 'Real-Time Executive Visibility',
        desc: 'Live telemetry dashboards empower leadership to make swift, data-backed operational decisions.'
      },
      {
        num: '04',
        title: 'Scalable Operations Architecture',
        desc: 'Engineered to handle 10x transaction spikes and multi-branch expansions without re-engineering.'
      }
    ],
    whatsPossible: [
      {
        groupTitle: 'Core Enterprise Resource Planning',
        desc: 'Complete control over financial ledgers, inventory, human capital, and distribution.',
        pillTags: ['ERP Workflows ↗', 'Procurement Control ↗', 'HR & Payroll ↗']
      },
      {
        groupTitle: 'Customer & Revenue Relationship Management',
        desc: 'High-converting sales stages, customer lifecycle tracking, and omnichannel messaging.',
        pillTags: ['Lead Pipelines ↗', 'WhatsApp Helpdesk ↗', 'Customer Portals ↗']
      },
      {
        groupTitle: 'Billing, POS & Financial Ledger Operations',
        desc: 'Instant point-of-sale checkout, multi-tier pricing, and automated compliance.',
        pillTags: ['Recurring Billing ↗', 'GST / VAT Invoicing ↗', 'Bank Reconciliation ↗']
      }
    ],
    cta: {
      tag: 'ENTERPRISE ARCHITECTURE',
      title: "Let's engineer your central operating system.",
      desc: 'Tell us your operational bottlenecks. Our systems architects will design a unified business platform tailored for your scale.',
      buttonText: 'Schedule a Consultation ↗'
    }
  },

  // ── 03. App Development (Mobile Category) ─────────────────────────────
  {
    id: 'app-development',
    num: '03',
    title: 'App Development',
    shortTitle: 'App Development',
    eyebrow: 'NATIVE & CROSS-PLATFORM MOBILE',
    tagline: 'High-performance iOS and Android applications crafted for scale and speed.',
    description: 'We architect production-grade native and cross-platform mobile apps using Flutter, React Native, Swift, and Kotlin, with offline sync, biometric security, and App Store readiness.',
    accentColor: '#0066FF',
    visualImage: '/images/solutions/sol/app_development.png',
    capabilitiesCol1: [
      'Clinic & Healthcare Apps',
      'E-Commerce & Retail Apps',
      'EdTech & Learning Apps',
      'Field & Attendance Apps',
      'FinTech & Wallet Apps',
      'Fitness & Workout Apps'
    ],
    capabilitiesCol2: [
      'Food & Restaurant Apps',
      'Logistics & Delivery Apps',
      'On-Demand Booking Apps',
      'Real Estate & Property Apps',
      'Social & Community Apps'
    ],
    capabilities: [
      { name: 'Clinic & Healthcare Apps' },
      { name: 'E-Commerce & Retail Apps' },
      { name: 'EdTech & Learning Apps' },
      { name: 'Field & Attendance Apps' },
      { name: 'FinTech & Wallet Apps' },
      { name: 'Fitness & Workout Apps' },
      { name: 'Food & Restaurant Apps' },
      { name: 'Logistics & Delivery Apps' },
      { name: 'On-Demand Booking Apps' },
      { name: 'Real Estate & Property Apps' },
      { name: 'Social & Community Apps' }
    ],
    featureGrid: [
      {
        title: 'Native iOS & Android Architecture',
        desc: 'Engineered for smooth 120Hz animations, low battery drain, and native platform features.',
        image: appointmentImg,
        badge: 'High Performance'
      },
      {
        title: 'Cross-Platform Flutter & React Native',
        desc: 'One single codebase delivering pixel-perfect native experiences across both operating systems.',
        image: apiImg,
        badge: 'Fast Delivery'
      },
      {
        title: 'Offline Sync & Real-Time Storage',
        desc: 'Seamless offline capabilities with background synchronization when connectivity resumes.',
        image: crmImg,
        badge: 'Zero Downtime'
      },
      {
        title: 'Payments & In-App Subscriptions',
        desc: 'Certified Apple StoreKit and Google Play Billing integrations with webhooks.',
        image: billingImg,
        badge: 'Monetization'
      },
      {
        title: 'Push Notifications & Engagement',
        desc: 'Targeted user re-engagement with deep linking and rich interactive notifications.',
        image: digitalMarketingImg,
        badge: 'Retention'
      },
      {
        title: 'Enterprise Mobile Security',
        desc: 'Biometric FaceID/fingerprint authentication, certificate pinning, and end-to-end encryption.',
        image: erpImg,
        badge: 'Encrypted'
      }
    ],
    whereThisHelps: [
      {
        num: '01',
        title: 'Direct Customer Touchpoint',
        desc: 'Put your brand directly in your customer’s pocket with instant mobile access and notifications.'
      },
      {
        num: '02',
        title: 'Offline Field Operations',
        desc: 'Empower delivery agents, sales reps, and warehouse teams to work seamlessly without WiFi.'
      },
      {
        num: '03',
        title: 'Higher Retention & Repeat Orders',
        desc: 'Mobile users have 3x higher checkout completion rates and repeat purchases compared to web browsers.'
      },
      {
        num: '04',
        title: 'Hardware & Sensor Integration',
        desc: 'Leverage device GPS, camera, Bluetooth, and biometric sensors to unlock rich capabilities.'
      }
    ],
    whatsPossible: [
      {
        groupTitle: 'Consumer Mobile Applications',
        desc: 'Social, marketplace, booking, and media streaming apps with fluid 120fps interactions.',
        pillTags: ['iOS Apps ↗', 'Android Apps ↗', 'Flutter Cross-Platform ↗']
      },
      {
        groupTitle: 'FinTech & Mobile Commerce',
        desc: 'Ultra-secure digital wallets, subscription engines, and instantaneous QR payments.',
        pillTags: ['Stripe In-App ↗', 'Apple Pay / Google Pay ↗', 'Biometric Auth ↗']
      },
      {
        groupTitle: 'Field Workforce & Telematics',
        desc: 'Real-time dispatch, turnstile verification, offline barcode audits, and driver tracking.',
        pillTags: ['Offline Sync ↗', 'Background GPS ↗', 'Barcode Scanning ↗']
      }
    ],
    cta: {
      tag: 'MOBILE ENGINEERING',
      title: "Let's turn your app concept into reality.",
      desc: 'From initial prototype to App Store launch, we architect scalable mobile systems that users love.',
      buttonText: 'Build your mobile app ↗'
    }
  },

  // ── 04. Digital Marketing (Reference Image 2) ───────────────────
  {
    id: 'digital-marketing',
    num: '04',
    title: 'Digital Marketing',
    shortTitle: 'Digital Marketing',
    eyebrow: 'ACQUISITION & REVENUE GROWTH',
    tagline: 'Reach people who are more likely to need what you offer.',
    description: 'We build high-ROAS paid advertising engines across Meta and Google, combined with conversion rate optimization, automated lead nurturing, and creative ad generation.',
    accentColor: '#0066FF',
    visualImage: '/images/solutions/sol/digital_marketing.png',
    capabilitiesCol1: [
      'Ad Copywriting & Creatives',
      'AI Video Ad Production',
      'Content Marketing & Reels',
      'Conversion Rate Optimization (CRO)',
      'Google Search & Display Ads'
    ],
    capabilitiesCol2: [
      'Lead Generation Funnels',
      'Meta Ads (Facebook & Instagram)',
      'Performance Social Media Ads',
      'SEO & Local Search Optimization',
      'YouTube & Video Advertising'
    ],
    capabilities: [
      { name: 'Ad Copywriting & Creatives' },
      { name: 'AI Video Ad Production' },
      { name: 'Content Marketing & Reels' },
      { name: 'Conversion Rate Optimization (CRO)' },
      { name: 'Google Search & Display Ads' },
      { name: 'Lead Generation Funnels' },
      { name: 'Meta Ads (Facebook & Instagram)' },
      { name: 'Performance Social Media Ads' },
      { name: 'SEO & Local Search Optimization' },
      { name: 'YouTube & Video Advertising' }
    ],
    featureGrid: [
      {
        title: 'High-ROAS Meta & Google Ad Campaigns',
        desc: 'Algorithmic targeting and creative testing that lowers customer acquisition costs (CAC).',
        image: digitalMarketingImg,
        badge: 'Paid Ads'
      },
      {
        title: 'AI Ad & Video Creative Generation',
        desc: 'Dynamic video and image variations generated to maximize conversion rates across feeds.',
        image: businessPortfolioImg,
        badge: 'Creative Engine'
      },
      {
        title: 'High-Converting Sales Funnels',
        desc: 'Landing pages optimized through split A/B tests to convert cold visitors into qualified buyers.',
        image: ecommerceImg,
        badge: 'High Conversion'
      },
      {
        title: 'Omnichannel Retargeting Sequences',
        desc: 'Re-engage cart abandoners and profile visitors with tailored messaging across platforms.',
        image: crmImg,
        badge: 'Retention'
      },
      {
        title: 'Automated Lead Nurturing Drips',
        desc: 'Warm up incoming inquiries automatically via automated WhatsApp and email sequences.',
        image: appointmentImg,
        badge: 'Automations'
      },
      {
        title: 'End-to-End Attribution Telemetry',
        desc: 'Know exactly which ad creative, keyword, and channel generated every rupee of revenue.',
        image: erpImg,
        badge: 'Analytics'
      }
    ],
    whereThisHelps: [
      {
        num: '01',
        title: 'Predictable Revenue Generation',
        desc: 'Transform customer acquisition from guesswork into a scalable, repeatable mathematical system.'
      },
      {
        num: '02',
        title: 'Reduce Customer Acquisition Cost',
        desc: 'Creative optimization and funnel tuning cut ad waste and maximize return on ad spend.'
      },
      {
        num: '03',
        title: 'High-Engagement Video Ads',
        desc: 'Professional promotional and product videos that arrest attention and drive immediate clicks.'
      },
      {
        num: '04',
        title: 'Faster Sales Cycle Velocities',
        desc: 'Automated email and WhatsApp drip triggers follow up with leads within 60 seconds of inquiry.'
      }
    ],
    whatsPossible: [
      {
        groupTitle: 'Performance Media Buying (Meta & Google)',
        desc: 'Laser-focused paid acquisition campaigns with continuous creative refreshes and audience testing.',
        pillTags: ['Meta Ads ↗', 'Google Search ↗', 'YouTube Ads ↗']
      },
      {
        groupTitle: 'Creative Video & Copy Production',
        desc: 'High-converting ad copy, AI video generation, and engaging product showcase reels.',
        pillTags: ['Promotional Videos ↗', 'Product Ads ↗', 'Ad Copywriting ↗']
      },
      {
        groupTitle: 'Funnel Optimization & Email Workflows',
        desc: 'High-converting landing page layouts paired with automated lifecycle email and WhatsApp triggers.',
        pillTags: ['A/B Testing ↗', 'WhatsApp Drips ↗', 'Klaviyo / Brevo ↗']
      }
    ],
    cta: {
      tag: 'GROWTH STRATEGY',
      title: "Let's accelerate your customer acquisition.",
      desc: 'Schedule a free growth audit. We will review your current funnels and outline actionable opportunities.',
      buttonText: 'Claim your free audit ↗'
    }
  },

  // ── 05. Website Development (Reference Image 3) ───────────────────────
  {
    id: 'website-development',
    num: '05',
    title: 'Website Development',
    shortTitle: 'Website Development',
    eyebrow: 'MODERN FAST DIGITAL PLATFORMS',
    tagline: 'Give customers a clear place to learn, trust and contact your business.',
    description: 'We develop modern web platforms with Next.js 15, React 19, TypeScript, and Tailwind CSS that load in under 1 second and rank on page one of Google.',
    accentColor: '#0066FF',
    visualImage: '/images/solutions/sol/web_development.png',
    capabilitiesCol1: [
      'Business Portfolio & Corporate Websites',
      'Clinic & Healthcare Websites',
      'E-Commerce & Online Stores',
      'Educational & LMS Portals',
      'High-Converting Landing Pages'
    ],
    capabilitiesCol2: [
      'Hotel & Hospitality Websites',
      'Marketplace & Directory Portals',
      'Real Estate Property Portals',
      'Restaurant & Food Ordering Sites',
      'SaaS & Web App Frontends'
    ],
    capabilities: [
      { name: 'Business Portfolio & Corporate Websites' },
      { name: 'Clinic & Healthcare Websites' },
      { name: 'E-Commerce & Online Stores' },
      { name: 'Educational & LMS Portals' },
      { name: 'High-Converting Landing Pages' },
      { name: 'Hotel & Hospitality Websites' },
      { name: 'Marketplace & Directory Portals' },
      { name: 'Real Estate Property Portals' },
      { name: 'Restaurant & Food Ordering Sites' },
      { name: 'SaaS & Web App Frontends' }
    ],
    featureGrid: [
      {
        title: 'Sub-Second Page Load Speeds',
        desc: 'Engineered with Server Components and static-first rendering for instant navigation.',
        image: businessPortfolioImg,
        badge: 'Core Web Vitals'
      },
      {
        title: 'Headless E-Commerce Engines',
        desc: 'High-converting checkout flows with instant payment gateway processing and invoice generation.',
        image: ecommerceImg,
        badge: 'High Conversion'
      },
      {
        title: 'Custom Client & Vendor Portals',
        desc: 'Secure authenticated workspaces with real-time dashboards and document sharing.',
        image: appointmentImg,
        badge: 'Secure Portals'
      },
      {
        title: 'Enterprise CMS & Content Stacks',
        desc: 'Empower marketing teams to publish campaigns quickly without code regressions.',
        image: lmsImg,
        badge: 'Decoupled'
      },
      {
        title: 'Seamless WhatsApp & Payment APIs',
        desc: 'Integrate click-to-chat WhatsApp widgets and instant UPI/Stripe payment links.',
        image: apiImg,
        badge: 'Integrations'
      },
      {
        title: 'Search Engine Dominance (SEO)',
        desc: 'Structured metadata, dynamic OpenGraph, and semantic HTML for page-one rankings.',
        image: digitalMarketingImg,
        badge: 'Organic Reach'
      }
    ],
    whereThisHelps: [
      {
        num: '01',
        title: 'First-Impression Brand Authority',
        desc: 'Bespoke web experiences that immediately differentiate your business from competitors.'
      },
      {
        num: '02',
        title: 'Conversion Rate Optimization',
        desc: 'Reduce drop-offs and drive higher inbound lead generation through smooth UX patterns.'
      },
      {
        num: '03',
        title: 'Organic Search Growth',
        desc: 'Technical SEO compliance guarantees search engines discover, crawl, and rank your content.'
      },
      {
        num: '04',
        title: 'Zero Security Vulnerabilities',
        desc: 'Hardened HTTP headers, sanitization pipelines, and strict CSRF/XSS protection.'
      }
    ],
    whatsPossible: [
      {
        groupTitle: 'Corporate Portals & SaaS Frontends',
        desc: 'Modern web applications built for speed, responsiveness, and complex interactive state.',
        pillTags: ['Next.js 15 ↗', 'Tailwind Systems ↗', 'Edge SSR ↗']
      },
      {
        groupTitle: 'E-Commerce & Digital Storefronts',
        desc: 'High-speed headless commerce with integrated Stripe, Razorpay, and multi-currency checkouts.',
        pillTags: ['Storefront Engines ↗', 'Stripe Payments ↗', 'Inventory Webhooks ↗']
      },
      {
        groupTitle: 'Client Portals & B2B Dashboards',
        desc: 'Secure authenticated environments for accounts, telemetry analytics, and self-service.',
        pillTags: ['Customer Portals ↗', 'RBAC Auth ↗', 'Real-Time Sync ↗']
      }
    ],
    cta: {
      tag: 'START A PROJECT',
      title: "Let's build a modern web experience.",
      desc: 'Whether a bespoke corporate portal or high-scale web platform, we deliver in weeks.',
      buttonText: 'Start a conversation ↗'
    }
  },

  // ── 06. Custom Software Development (Reference Image 4) ───────────────
  {
    id: 'custom-software-development',
    num: '06',
    title: 'Custom Software Development',
    shortTitle: 'Custom Software',
    eyebrow: 'BESPOKE ENTERPRISE ARCHITECTURE',
    tagline: 'Organize the work that spreadsheets and disconnected tools make difficult.',
    description: 'We develop custom enterprise software platforms, unified ERP systems, billing portals, inventory managers, and multi-tenant SaaS products that streamline complex workflows.',
    accentColor: '#0066FF',
    visualImage: '/images/solutions/sol/custom_software.png',
    capabilitiesCol1: [
      'Automated Billing & Invoicing Systems',
      'Client & Vendor Self-Service Portals',
      'Custom CRM Platforms',
      'Custom ERP & Workflow Engines',
      'Employee Attendance & Payroll Systems'
    ],
    capabilitiesCol2: [
      'Executive BI & Reporting Dashboards',
      'Multi-Tenant SaaS Architecture',
      'Order Processing & Fulfillment Systems',
      'Transport & Fleet Telematics Systems',
      'Warehouse & Inventory Control Systems'
    ],
    capabilities: [
      { name: 'Automated Billing & Invoicing Systems' },
      { name: 'Client & Vendor Self-Service Portals' },
      { name: 'Custom CRM Platforms' },
      { name: 'Custom ERP & Workflow Engines' },
      { name: 'Employee Attendance & Payroll Systems' },
      { name: 'Executive BI & Reporting Dashboards' },
      { name: 'Multi-Tenant SaaS Architecture' },
      { name: 'Order Processing & Fulfillment Systems' },
      { name: 'Transport & Fleet Telematics Systems' },
      { name: 'Warehouse & Inventory Control Systems' }
    ],
    featureGrid: [
      {
        title: 'Bespoke Internal Business Tools',
        desc: 'Say goodbye to rigid off-the-shelf software. Build tools that mirror your exact business processes.',
        image: crmImg,
        badge: 'Custom Fit'
      },
      {
        title: 'Central Billing & Invoice Control',
        desc: 'Automate invoice generation, payment reminders, and multi-currency reconciliations.',
        image: billingImg,
        badge: 'Billing Engine'
      },
      {
        title: 'Multi-Tenant SaaS Architectures',
        desc: 'Launch your own software product with tenant isolation, subscription billing, and admin telemetry.',
        image: erpImg,
        badge: 'SaaS Ready'
      },
      {
        title: 'Inventory & Order Tracking',
        desc: 'End-to-end order pipelines from customer booking to warehouse packing and dispatch.',
        image: inventoryImg,
        badge: 'Stock Sync'
      },
      {
        title: 'Employee & Attendance Portals',
        desc: 'Biometric device sync, shift rosters, leave requests, and payroll calculation engines.',
        image: transportImg,
        badge: 'HR Systems'
      },
      {
        title: 'Real-Time Executive Dashboards',
        desc: 'Consolidate multiple data sources into interactive charts, tables, and PDF export engines.',
        image: apiImg,
        badge: 'Telemetry'
      }
    ],
    whereThisHelps: [
      {
        num: '01',
        title: 'Solve Unique Competitive Edge Problems',
        desc: 'Build features and workflows that generic software solutions simply cannot support.'
      },
      {
        num: '02',
        title: 'Zero Per-User Licensing Fees',
        desc: 'Own your software asset outright without paying escalating monthly seat licenses as your team grows.'
      },
      {
        num: '03',
        title: 'Complete Data Ownership & Privacy',
        desc: 'Host your sensitive customer and operational data on your own dedicated cloud infrastructure.'
      },
      {
        num: '04',
        title: 'Infinite Flexibility for Growth',
        desc: 'Easily add new features, branch locations, and API integrations as your business scales.'
      }
    ],
    whatsPossible: [
      {
        groupTitle: 'Enterprise Operations & ERP Portals',
        desc: 'Custom enterprise software connecting finance, inventory, human resources, and project management.',
        pillTags: ['Custom ERP ↗', 'Workflow Automation ↗', 'Multi-Branch Portals ↗']
      },
      {
        groupTitle: 'Commercial SaaS Platforms',
        desc: 'Turn your industry expertise into a profitable subscription software business with multi-tenancy.',
        pillTags: ['Multi-Tenant SaaS ↗', 'Subscription Billing ↗', 'Tenant Isolation ↗']
      },
      {
        groupTitle: 'Database & Data Pipeline Modernization',
        desc: 'Migrate legacy Excel sheets and old databases to high-concurrency PostgreSQL and cloud backends.',
        pillTags: ['Cloud Migration ↗', 'PostgreSQL Stacks ↗', 'Data Warehousing ↗']
      }
    ],
    cta: {
      tag: 'CUSTOM CODE',
      title: "Let's engineer software that fits your business.",
      desc: 'No cookie-cutter templates. We architect custom solutions around your exact operational workflows.',
      buttonText: 'Discuss your project ↗'
    }
  },

  // ── 07. UI/UX & Product Design (Reference Image 5) ────────────────────
  {
    id: 'ui-ux-design',
    num: '07',
    title: 'UI/UX & Product Design',
    shortTitle: 'UI/UX & Product Design',
    eyebrow: 'PRODUCT DESIGN & USER EXPERIENCE',
    tagline: 'Make digital products easier for real people to use.',
    description: 'We turn complex workflows into delightful, effortless digital interfaces through thorough user research, high-fidelity Figma prototypes, and comprehensive design systems.',
    accentColor: '#0066FF',
    visualImage: '/images/solutions/sol/uiux_designing.png',
    capabilitiesCol1: [
      'Brand Identity & Visual Guidelines',
      'Clickable Figma Prototypes',
      'Design Systems & Component Libraries',
      'E-Commerce Storefront UI Design',
      'Enterprise Dashboard & Analytics UI'
    ],
    capabilitiesCol2: [
      'FinTech & Banking App UX',
      'Healthcare & Clinical Portal Design',
      'High-Converting Landing Page Design',
      'Mobile App UI/UX (iOS & Android)',
      'SaaS Platform & Web App Interfaces'
    ],
    capabilities: [
      { name: 'Brand Identity & Visual Guidelines' },
      { name: 'Clickable Figma Prototypes' },
      { name: 'Design Systems & Component Libraries' },
      { name: 'E-Commerce Storefront UI Design' },
      { name: 'Enterprise Dashboard & Analytics UI' },
      { name: 'FinTech & Banking App UX' },
      { name: 'Healthcare & Clinical Portal Design' },
      { name: 'High-Converting Landing Page Design' },
      { name: 'Mobile App UI/UX (iOS & Android)' },
      { name: 'SaaS Platform & Web App Interfaces' }
    ],
    featureGrid: [
      {
        title: 'Figma Clickable Interactive Prototypes',
        desc: 'Experience your application before writing a single line of code with realistic interactive flows.',
        image: businessPortfolioImg,
        badge: 'Interactive'
      },
      {
        title: 'Enterprise Design Systems & Tokens',
        desc: 'Reusable component libraries with typography, colors, and auto-layout tokens for rapid engineering.',
        image: lmsImg,
        badge: 'Design Systems'
      },
      {
        title: 'Data-Dense Dashboard Interfaces',
        desc: 'Clean information hierarchies that make complex analytics easy to understand at a glance.',
        image: crmImg,
        badge: 'Analytics UX'
      },
      {
        title: 'Mobile-First Touch Ergonomics',
        desc: 'Designed for thumbs, swipe gestures, haptic feedback, and modern edge-to-edge screens.',
        image: appointmentImg,
        badge: 'Mobile Native'
      },
      {
        title: 'Comprehensive Brand Identity Packages',
        desc: 'Distinctive logos, color palettes, custom iconography, and brand style guides.',
        image: digitalMarketingImg,
        badge: 'Branding'
      },
      {
        title: 'WCAG 2.1 AA Accessibility Standards',
        desc: 'Ensuring your digital product is fully accessible to all users with contrast and screen reader compliance.',
        image: schoolErpImg,
        badge: 'Inclusive'
      }
    ],
    whereThisHelps: [
      {
        num: '01',
        title: 'De-Risk Engineering Investments',
        desc: 'Validate user workflows and test prototypes with real customers before writing production code.'
      },
      {
        num: '02',
        title: 'Drastically Reduce User Churn',
        desc: 'Intuitive navigation and friction-free onboarding keep users engaged and prevent drop-offs.'
      },
      {
        num: '03',
        title: 'Accelerate Developer Velocity',
        desc: 'Pixel-perfect component tokens and detailed auto-layout specs speed up frontend delivery by 40%.'
      },
      {
        num: '04',
        title: 'Elevate Brand Perception',
        desc: 'Modern, editorial aesthetics command premium market pricing and foster lasting customer trust.'
      }
    ],
    whatsPossible: [
      {
        groupTitle: 'Product Design & User Research',
        desc: 'Deep user interviews, customer journey mapping, and wireframe prototypes that resolve pain points.',
        pillTags: ['User Journeys ↗', 'Wireframing ↗', 'Usability Audits ↗']
      },
      {
        groupTitle: 'Design Systems & Component Libraries',
        desc: 'Tokenized component kits in Figma built with auto-layout and variant states for seamless dev handoff.',
        pillTags: ['Figma Tokens ↗', 'Component Kits ↗', 'Typography Guides ↗']
      },
      {
        groupTitle: 'Brand Identity & Visual Design',
        desc: 'Unique logos, modern typography, iconography, and multi-format design collateral.',
        pillTags: ['Brand Guidelines ↗', 'Logo Systems ↗', 'Motion Specs ↗']
      }
    ],
    cta: {
      tag: 'DESIGN SPRINT',
      title: "Let's design an extraordinary digital experience.",
      desc: 'Collaborate with our senior designers to turn your vision into clickable prototypes ready for build.',
      buttonText: 'Book a design review ↗'
    }
  }
];

export function getCategorizedServiceById(id: string): CategorizedService | undefined {
  if (!id) return CATEGORIZED_SERVICES[0];
  const normalizedId = id.toLowerCase().trim();

  // Comprehensive alias mapping supporting all routes and numbering
  const aliasMap: Record<string, string> = {
    '01': 'ai-automation',
    '1': 'ai-automation',
    'ai': 'ai-automation',
    'automation': 'ai-automation',
    'ai-and-automation': 'ai-automation',
    'automation-your-business': 'ai-automation',

    '02': 'business-systems',
    '2': 'business-systems',
    'business': 'business-systems',

    '03': 'app-development',
    '3': 'app-development',
    'app': 'app-development',
    'mobile-app-development': 'app-development',
    'mobile': 'app-development',

    '04': 'digital-marketing',
    '4': 'digital-marketing',
    'digital-marketing': 'digital-marketing',
    'digital-marketing-advertising': 'digital-marketing',
    'marketing-advertising': 'digital-marketing',
    'marketing': 'digital-marketing',

    '05': 'website-development',
    '5': 'website-development',
    'web-development': 'website-development',
    'web': 'website-development',
    'website': 'website-development',

    '06': 'custom-software-development',
    '6': 'custom-software-development',
    'custom-software': 'custom-software-development',
    'software': 'custom-software-development',

    '07': 'ui-ux-design',
    '7': 'ui-ux-design',
    'ui-ux-design-branding': 'ui-ux-design',
    'ui-ux-product-design': 'ui-ux-design',
    'ui-ux-designing': 'ui-ux-design',
    'ui-ux': 'ui-ux-design',

    'service-01': 'ai-automation',
    'service-02': 'business-systems',
    'service-03': 'app-development',
    'service-04': 'digital-marketing',
    'service-05': 'website-development',
    'service-06': 'custom-software-development',
    'service-07': 'ui-ux-design'
  };

  const targetId = aliasMap[normalizedId] || normalizedId;
  return CATEGORIZED_SERVICES.find(
    (s) => s.id === targetId || s.num === normalizedId || s.id === normalizedId
  );
}

export function getServiceSubtitle(id?: string, eyebrow?: string): string {
  if (!id) return '';
  const normalized = id.toLowerCase();
  if (normalized.includes('ai') || normalized.includes('01')) return 'Intelligent Systems';
  if (normalized.includes('business') || normalized.includes('02')) return 'Enterprise Operations';
  if (normalized.includes('app') || normalized.includes('03')) return 'Mobile Systems';
  if (normalized.includes('market') || normalized.includes('04')) return 'Growth Engine';
  if (normalized.includes('web') || normalized.includes('05')) return 'Modern Platforms';
  if (normalized.includes('custom') || normalized.includes('software') || normalized.includes('06')) return 'Bespoke Architecture';
  if (normalized.includes('ui') || normalized.includes('ux') || normalized.includes('design') || normalized.includes('07')) return 'Product Experience';

  if (eyebrow) {
    return eyebrow.split('&')[0].trim().toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return '';
}
