import {
  Users,
  Receipt,
  Layers,
  ClipboardList,
  GraduationCap,
  Building2,
  Dumbbell,
  Briefcase,
  Truck,
  MonitorPlay,
  UserCheck,
  PieChart,
  ShoppingCart,
  Cpu,
  Coins,
  CalendarClock,
  LayoutGrid,
  BarChart3,
  Cloud,
  Megaphone,
  type LucideIcon
} from 'lucide-react';

// Import all 18 high-resolution 3D solution assets from src/assets/solutions
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
import chitImg from '@/assets/solutions/chit.png';
import appointmentImg from '@/assets/solutions/appointment.png';
import digitalMarketingImg from '@/assets/solutions/digital_marketing.png';

export interface CategoryTab {
  name: string;
  icon: LucideIcon;
}

export type BentoTheme = 'dark' | 'light' | 'blue';

export interface SolutionItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  categories: string[];
  icon: LucideIcon;
  theme: BentoTheme;
  colSpanDesktop: number;
  image: string;
  badgeBg: string;
  accentColor: string;
  overview: string;
  deliverables: string[];
  targetAudience: string;
}

export const SOLUTION_CATEGORY_TABS: CategoryTab[] = [
  { name: 'All', icon: LayoutGrid },
  { name: 'Business Systems', icon: Building2 },
  { name: 'Education', icon: GraduationCap },
  { name: 'Finance', icon: BarChart3 },
  { name: 'E-Commerce', icon: ShoppingCart },
  { name: 'Custom', icon: Layers },
  { name: 'Cloud & DevOps', icon: Cloud },
];

export const SOLUTION_CATEGORIES = SOLUTION_CATEGORY_TABS.map(t => t.name);

export const SOLUTIONS_DATA: SolutionItem[] = [
  {
    id: 'business-portfolio',
    number: '01',
    title: 'Business Portfolio',
    subtitle: 'High-impact corporate showcases engineered to establish authority & win clients.',
    categories: ['Business Systems', 'Custom'],
    icon: Briefcase,
    theme: 'dark',
    colSpanDesktop: 7,
    image: businessPortfolioImg,
    badgeBg: 'bg-[#0284C7]',
    accentColor: '#0284C7',
    overview: 'High-impact corporate portfolio and digital showcase platforms engineered to position brand authority, highlight projects, and drive client conversions.',
    deliverables: ['Interactive Case Studies Showcase', 'High-Converting Landing Pages', 'Custom Brand Identity Integration', 'SEO, Performance & Speed Optimized'],
    targetAudience: 'Agencies, creative studios, consultants, startups, and enterprises.'
  },
  {
    id: 'crm',
    number: '02',
    title: 'CRM Solutions',
    subtitle: 'Centralize customer journeys, sales pipelines & automated communications.',
    categories: ['Business Systems', 'Custom'],
    icon: Users,
    theme: 'light',
    colSpanDesktop: 4,
    image: crmImg,
    badgeBg: 'bg-[#0066FF]',
    accentColor: '#0066FF',
    overview: 'Centralize sales pipelines, client communications, customer lifecycle tracking, and automated lead nurturing to accelerate revenue.',
    deliverables: ['Lead & Opportunity Management', 'Omnichannel Communication Hub', 'Automated Sales Pipelines', 'Customer Analytics & Reporting'],
    targetAudience: 'Sales teams, enterprise client managers, and growth-focused businesses.'
  },
  {
    id: 'erp',
    number: '03',
    title: 'ERP Systems',
    subtitle: 'Unite enterprise operations, supply networks & departmental workflows.',
    categories: ['Business Systems', 'Custom'],
    icon: Layers,
    theme: 'blue',
    colSpanDesktop: 6,
    image: erpImg,
    badgeBg: 'bg-[#8B5CF6]',
    accentColor: '#8B5CF6',
    overview: 'Seamlessly unite accounting, manufacturing, human resources, procurement, and risk governance into an integrated real-time command center.',
    deliverables: ['Unified Departmental Workflows', 'Role-Based Access & Governance', 'Automated Resource Allocation', 'Real-Time Executive Dashboards'],
    targetAudience: 'Mid-to-large enterprises, manufacturers, and multi-branch corporations.'
  },
  {
    id: 'billing-system',
    number: '04',
    title: 'Billing & POS',
    subtitle: 'Automate multi-tier recurring billing, tax compliance & payment syncing.',
    categories: ['Finance', 'Business Systems'],
    icon: Receipt,
    theme: 'dark',
    colSpanDesktop: 7,
    image: billingImg,
    badgeBg: 'bg-[#10B981]',
    accentColor: '#10B981',
    overview: 'Automate complex recurring billing, multi-tier subscription plans, tax compliance, and automated invoice delivery with instant reconciliation.',
    deliverables: ['Automated Invoicing & GST/VAT', 'Recurring Subscription Engine', 'Multi-Gateway Payment Sync', 'Real-Time Financial Audits'],
    targetAudience: 'SaaS companies, service agencies, wholesalers, and retail operators.'
  },
  {
    id: 'e-commerce',
    number: '05',
    title: 'E-Commerce Platforms',
    subtitle: 'Ultra-fast storefronts with instant checkout, coupon engines & carrier tracking.',
    categories: ['E-Commerce', 'Custom'],
    icon: ShoppingCart,
    theme: 'light',
    colSpanDesktop: 5,
    image: ecommerceImg,
    badgeBg: 'bg-[#F43F5E]',
    accentColor: '#F43F5E',
    overview: 'High-speed headless commerce platform featuring dynamic product catalogs, coupon engines, seamless checkout, and integrated shipping carrier APIs.',
    deliverables: ['Ultra-Fast Storefront Engine', 'Multi-Channel Inventory Sync', 'Cart Abandonment Recovery', 'Automated Shipping Carrier API Sync'],
    targetAudience: 'D2C brands, multi-brand retailers, and wholesale B2B merchants.'
  },
  {
    id: 'digital-marketing',
    number: '06',
    title: 'Digital Marketing',
    subtitle: 'Performance ad campaigns, omnichannel SEO & high-converting sales funnels.',
    categories: ['E-Commerce', 'Custom', 'Business Systems'],
    icon: Megaphone,
    theme: 'dark',
    colSpanDesktop: 5,
    image: digitalMarketingImg,
    badgeBg: 'bg-[#0052FF]',
    accentColor: '#0052FF',
    overview: 'Data-driven performance marketing campaigns, SEO optimization, social media hyper-growth, and conversion rate funnels designed for measurable customer acquisition.',
    deliverables: ['Omnichannel Social Media Growth', 'Conversion Funnel & CRO Audits', 'Targeted PPC & Paid Performance Ads', 'Growth Telemetry & Real-Time ROAS Analytics'],
    targetAudience: 'Startups, scaling e-commerce brands, local enterprises, and businesses looking to expand their market footprint.'
  },
  {
    id: 'school-erp',
    number: '07',
    title: 'School ERP',
    subtitle: 'Smart digital campus ecosystem connecting students, faculty & parents.',
    categories: ['Education', 'Business Systems'],
    icon: GraduationCap,
    theme: 'blue',
    colSpanDesktop: 5,
    image: schoolErpImg,
    badgeBg: 'bg-[#EC4899]',
    accentColor: '#EC4899',
    overview: 'An all-in-one digital campus ecosystem uniting students, educators, and parents with automated admissions, grading, fee tracking, and schedules.',
    deliverables: ['Student Information Management', 'Digital Fee Collection & Receipts', 'Automated Gradebook & Reports', 'Parent-Teacher Communication App'],
    targetAudience: 'K-12 schools, higher-ed academies, and educational trust institutions.'
  },
  {
    id: 'inventory-management',
    number: '08',
    title: 'Inventory Management',
    subtitle: 'Real-time multi-warehouse stock monitoring with QR & barcode tracking.',
    categories: ['Business Systems', 'Custom'],
    icon: ClipboardList,
    theme: 'light',
    colSpanDesktop: 4,
    image: inventoryImg,
    badgeBg: 'bg-[#F97316]',
    accentColor: '#F97316',
    overview: 'Gain complete visibility over stock levels, warehouse transfers, reorder thresholds, and expiration dates with barcode and RFID scanning integration.',
    deliverables: ['Multi-Location Stock Sync', 'Automated Low-Stock Reordering', 'Barcode & QR Code Scanning', 'Purchase & Supplier Tracking'],
    targetAudience: 'Distributors, warehouse operators, e-commerce stores, and retailers.'
  },
  {
    id: 'scm',
    number: '09',
    title: 'Supply Chain (SCM)',
    subtitle: 'Synchronize supplier logistics, demand forecasting & shipment pipelines.',
    categories: ['Business Systems', 'Custom'],
    icon: Truck,
    theme: 'dark',
    colSpanDesktop: 5,
    image: scmImg,
    badgeBg: 'bg-[#EAB308]',
    accentColor: '#EAB308',
    overview: 'Synchronize your entire supply network from raw material vendor procurement to last-mile fulfillment with predictive demand forecasting.',
    deliverables: ['End-to-End Shipment Visibility', 'Vendor Performance Benchmarking', 'Demand Forecasting Algorithms', 'Warehouse Dispatch Management'],
    targetAudience: 'Manufacturers, importers, FMCG brands, and global logistics providers.'
  },
  {
    id: 'transport-management',
    number: '10',
    title: 'Transport Logistics',
    subtitle: 'Live GPS vehicle telematics, route optimization & driver shift rosters.',
    categories: ['Business Systems', 'Custom'],
    icon: Truck,
    theme: 'blue',
    colSpanDesktop: 5,
    image: transportImg,
    badgeBg: 'bg-[#EF4444]',
    accentColor: '#EF4444',
    overview: 'End-to-end transport intelligence providing live vehicle tracking, fuel monitoring, route optimization, driver rosters, and preventative maintenance logs.',
    deliverables: ['Live GPS & Telematics Integration', 'Smart Route & Trip Optimization', 'Driver Scheduling & Shift Logs', 'Vehicle Service & Compliance Alerts'],
    targetAudience: 'Fleet operators, logistics companies, school bus transit, and transport authorities.'
  },
  {
    id: 'hotel-management',
    number: '11',
    title: 'Hotel Management',
    subtitle: 'Direct reservation booking engine, room service POS & guest coordination.',
    categories: ['Business Systems', 'Custom'],
    icon: Building2,
    theme: 'dark',
    colSpanDesktop: 5,
    image: hotelImg,
    badgeBg: 'bg-[#F59E0B]',
    accentColor: '#F59E0B',
    overview: 'Optimize direct reservations, front-desk check-in/out, room service POS billing, housekeeping coordination, and personalized guest experiences.',
    deliverables: ['Direct Reservation Booking Engine', 'Front-Desk & Channel Manager', 'Housekeeping & Maintenance Alerts', 'Integrated Restaurant & Spa POS'],
    targetAudience: 'Hotels, boutique resorts, homestays, and hospitality chains.'
  },
  {
    id: 'sms',
    number: '12',
    title: 'Student Management',
    subtitle: 'Consolidated student records, attendance tracking & academic transcripts.',
    categories: ['Education'],
    icon: UserCheck,
    theme: 'blue',
    colSpanDesktop: 5,
    image: studentMgmtImg,
    badgeBg: 'bg-[#F43F5E]',
    accentColor: '#F43F5E',
    overview: 'Consolidated student lifecycle platform tracking admissions, attendance, behavioral records, academic transcripts, and emergency guardian notifications.',
    deliverables: ['Holistic Student Profiles', 'Biometric & QR Attendance', 'Automated SMS/WhatsApp Alerts', 'Academic Performance Records'],
    targetAudience: 'Colleges, vocational institutes, and school management boards.'
  },
  {
    id: 'lms',
    number: '13',
    title: 'LMS (Learning Platform)',
    subtitle: 'Deliver interactive video courses, automated quizzes & verifiable certificates.',
    categories: ['Education'],
    icon: MonitorPlay,
    theme: 'light',
    colSpanDesktop: 4,
    image: lmsImg,
    badgeBg: 'bg-[#6366F1]',
    accentColor: '#6366F1',
    overview: 'Create, distribute, and monetize interactive online courses with live webinar integration, automated quizzes, and verifiable completion certificates.',
    deliverables: ['Interactive Video & Audio Player', 'Automated Quizzes & Grading', 'Live Class Integration (Zoom/Meet)', 'Verifiable Certificate Generator'],
    targetAudience: 'EdTech startups, corporate training divisions, universities, and coaching institutes.'
  },
  {
    id: 'gym-management',
    number: '14',
    title: 'Gym & Fitness Club',
    subtitle: 'Biometric turnstile check-ins, auto-renewals & trainer class scheduling.',
    categories: ['Business Systems', 'Custom'],
    icon: Dumbbell,
    theme: 'dark',
    colSpanDesktop: 5,
    image: gymImg,
    badgeBg: 'bg-[#10B981]',
    accentColor: '#10B981',
    overview: 'Empower fitness clubs with automated membership renewals, biometric turnstile integration, trainer class scheduling, and member progress tracking.',
    deliverables: ['Member Profiles & Digital Check-In', 'Auto-Renewal & Recurring Billing', 'Class & Personal Trainer Booking', 'Member Mobile Companion Portal'],
    targetAudience: 'Fitness studios, CrossFit boxes, wellness centers, and gym franchises.'
  },
  {
    id: 'expense-management',
    number: '15',
    title: 'Expense Management',
    subtitle: 'AI receipt OCR scanning, multi-tier approvals & card auto-reconciliation.',
    categories: ['Finance'],
    icon: PieChart,
    theme: 'light',
    colSpanDesktop: 7,
    image: expenseImg,
    badgeBg: 'bg-[#06B6D4]',
    accentColor: '#06B6D4',
    overview: 'Gain complete fiscal oversight with mobile receipt OCR scanning, customizable multi-tier approval policies, corporate card feeds, and audit trails.',
    deliverables: ['AI Receipt Scanning & Extraction', 'Custom Multi-Level Approval Flows', 'Corporate Card Auto-Reconciliation', 'Per-Diem & Mileage Reimbursements'],
    targetAudience: 'Finance controllers, corporate procurement teams, and distributed remote teams.'
  },
  {
    id: 'chit-fund',
    number: '16',
    title: 'Chit Fund Systems',
    subtitle: 'Digital auction bid manager, subscriber passbooks & dividend auto-splits.',
    categories: ['Finance'],
    icon: Coins,
    theme: 'dark',
    colSpanDesktop: 5,
    image: chitImg,
    badgeBg: 'bg-[#F59E0B]',
    accentColor: '#F59E0B',
    overview: 'Compliant financial software to orchestrate chit auctions, track subscriber installments, calculate dividends, and generate instant digital passbooks.',
    deliverables: ['Digital Auction & Bid Manager', 'Subscriber Ledger & Passbook App', 'Dividend & Commission Auto-Split', 'Regulatory Compliance Reporting'],
    targetAudience: 'Chit fund companies, micro-finance groups, and peer credit societies.'
  },
  {
    id: 'appointment-booking',
    number: '17',
    title: 'Appointment Booking',
    subtitle: '24/7 calendar availability, automated client reminders & deposit sync.',
    categories: ['Business Systems', 'Custom'],
    icon: CalendarClock,
    theme: 'blue',
    colSpanDesktop: 5,
    image: appointmentImg,
    badgeBg: 'bg-[#0066FF]',
    accentColor: '#0066FF',
    overview: 'Frictionless online scheduling engine with real-time staff availability, calendar sync (Google/Outlook), deposit collection, and automated reminders.',
    deliverables: ['24/7 Self-Service Booking Widget', 'Two-Way Google/Apple Calendar Sync', 'Automated SMS & Email Reminders', 'Deposit & Full Payment Collection'],
    targetAudience: 'Healthcare clinics, legal consultants, salons, spas, and professional services.'
  },
  {
    id: 'api-management',
    number: '18',
    title: 'API & Cloud Integration',
    subtitle: 'Secure API gateways, sub-millisecond telemetry & microservice webhooks.',
    categories: ['Cloud & DevOps', 'Custom'],
    icon: Cpu,
    theme: 'light',
    colSpanDesktop: 7,
    image: apiImg,
    badgeBg: 'bg-[#8B5CF6]',
    accentColor: '#8B5CF6',
    overview: 'Comprehensive API gateway providing rate-limiting, OAuth2/mTLS authentication, OpenAPI interactive documentation, and sub-millisecond telemetry.',
    deliverables: ['Enterprise Security & Rate Limiting', 'Developer Portal & Auto-Docs', 'Latency & Error Spike Telemetry', 'Version Lifecycle Governance'],
    targetAudience: 'Engineering teams, fintech platforms, and API-first SaaS products.'
  }
];
