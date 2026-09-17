import {
  Users,
  Receipt,
  Layers,
  ClipboardList,
  GraduationCap,
  Building2,
  Dumbbell,
  BookOpen,
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
  type LucideIcon
} from 'lucide-react';

export interface CategoryTab {
  name: string;
  icon: LucideIcon;
}

export interface SolutionItem {
  id: string;
  title: string;
  subtitle: string;
  categories: string[];
  icon: LucideIcon;
  image?: string;
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
    id: 'crm',
    title: 'CRM',
    subtitle: 'Customer relationship management solutions.',
    categories: ['Business Systems', 'Custom'],
    icon: Users,
    badgeBg: 'bg-[#0066FF]',
    accentColor: '#0066FF',
    overview: 'Centralize sales pipelines, client communications, customer lifecycle tracking, and automated lead nurturing to accelerate revenue.',
    deliverables: ['Lead & Opportunity Management', 'Omnichannel Communication Hub', 'Automated Sales Pipelines', 'Customer Analytics & Reporting'],
    targetAudience: 'Sales teams, enterprise client managers, and growth-focused businesses.'
  },
  {
    id: 'billing-system',
    title: 'Billing System',
    subtitle: 'Smart billing and invoicing made simple.',
    categories: ['Finance', 'Business Systems'],
    icon: Receipt,
    badgeBg: 'bg-[#10B981]',
    accentColor: '#10B981',
    overview: 'Automate complex recurring billing, multi-tier subscription plans, tax compliance, and automated invoice delivery with instant reconciliation.',
    deliverables: ['Automated Invoicing & GST/VAT', 'Recurring Subscription Engine', 'Multi-Gateway Payment Sync', 'Real-Time Financial Audits'],
    targetAudience: 'SaaS companies, service agencies, wholesalers, and retail operators.'
  },
  {
    id: 'erp',
    title: 'ERP',
    subtitle: 'Enterprise resource planning.',
    categories: ['Business Systems', 'Custom'],
    icon: Layers,
    badgeBg: 'bg-[#8B5CF6]',
    accentColor: '#8B5CF6',
    overview: 'Seamlessly unite accounting, manufacturing, human resources, procurement, and risk governance into an integrated real-time command center.',
    deliverables: ['Unified Departmental Workflows', 'Role-Based Access & Governance', 'Automated Resource Allocation', 'Real-Time Executive Dashboards'],
    targetAudience: 'Mid-to-large enterprises, manufacturers, and multi-branch corporations.'
  },
  {
    id: 'inventory-management',
    title: 'Inventory Management',
    subtitle: 'Track, manage, and optimize your stock.',
    categories: ['Business Systems', 'Custom'],
    icon: ClipboardList,
    badgeBg: 'bg-[#F97316]',
    accentColor: '#F97316',
    overview: 'Gain complete visibility over stock levels, warehouse transfers, reorder thresholds, and expiration dates with barcode and RFID scanning integration.',
    deliverables: ['Multi-Location Stock Sync', 'Automated Low-Stock Reordering', 'Barcode & QR Code Scanning', 'Purchase & Supplier Tracking'],
    targetAudience: 'Distributors, warehouse operators, e-commerce stores, and retailers.'
  },
  {
    id: 'school-erp',
    title: 'School ERP',
    subtitle: 'Complete management for educational institutes.',
    categories: ['Education', 'Business Systems'],
    icon: GraduationCap,
    badgeBg: 'bg-[#EC4899]',
    accentColor: '#EC4899',
    overview: 'An all-in-one digital campus ecosystem uniting students, educators, and parents with automated admissions, grading, fee tracking, and schedules.',
    deliverables: ['Student Information Management', 'Digital Fee Collection & Receipts', 'Automated Gradebook & Reports', 'Parent-Teacher Communication App'],
    targetAudience: 'K-12 schools, higher-ed academies, and educational trust institutions.'
  },
  {
    id: 'hotel-management',
    title: 'Hotel Management',
    subtitle: 'Simplify hotel operations and guest experience.',
    categories: ['Business Systems', 'Custom'],
    icon: Building2,
    badgeBg: 'bg-[#F59E0B]',
    accentColor: '#F59E0B',
    overview: 'Optimize direct reservations, front-desk check-in/out, room service POS billing, housekeeping coordination, and personalized guest experiences.',
    deliverables: ['Direct Reservation Booking Engine', 'Front-Desk & Channel Manager', 'Housekeeping & Maintenance Alerts', 'Integrated Restaurant & Spa POS'],
    targetAudience: 'Hotels, boutique resorts, homestays, and hospitality chains.'
  },
  {
    id: 'gym-management',
    title: 'Gym Management',
    subtitle: 'Manage memberships, workouts, and billing.',
    categories: ['Business Systems', 'Custom'],
    icon: Dumbbell,
    badgeBg: 'bg-[#10B981]',
    accentColor: '#10B981',
    overview: 'Empower fitness clubs with automated membership renewals, biometric turnstile integration, trainer class scheduling, and member progress tracking.',
    deliverables: ['Member Profiles & Digital Check-In', 'Auto-Renewal & Recurring Billing', 'Class & Personal Trainer Booking', 'Member Mobile Companion Portal'],
    targetAudience: 'Fitness studios, CrossFit boxes, wellness centers, and gym franchises.'
  },
  {
    id: 'library-management',
    title: 'Library Management',
    subtitle: 'Organise books, members, and transactions.',
    categories: ['Education'],
    icon: BookOpen,
    badgeBg: 'bg-[#0284C7]',
    accentColor: '#0284C7',
    overview: 'Modernize cataloging with automated ISBN retrieval, digital barcode checkouts, overdue fine calculation, and electronic resource lending.',
    deliverables: ['OPAC Search & Dewey Decimal Tagging', 'Automated Issue & Return Tracking', 'Fine Calculation & Online Payments', 'Digital Asset & E-Book Library'],
    targetAudience: 'Academic libraries, public archives, institutional repositories, and book clubs.'
  },
  {
    id: 'transport-management',
    title: 'Transport Management',
    subtitle: 'Manage fleets, routes, and operations.',
    categories: ['Business Systems', 'Custom'],
    icon: Truck,
    badgeBg: 'bg-[#EF4444]',
    accentColor: '#EF4444',
    overview: 'End-to-end transport intelligence providing live vehicle tracking, fuel monitoring, route optimization, driver rosters, and preventative maintenance logs.',
    deliverables: ['Live GPS & Telematics Integration', 'Smart Route & Trip Optimization', 'Driver Scheduling & Shift Logs', 'Vehicle Service & Compliance Alerts'],
    targetAudience: 'Fleet operators, logistics companies, school bus transit, and transport authorities.'
  },
  {
    id: 'scm',
    title: 'SCM – Supply Chain',
    subtitle: 'Streamline your supply chain from source to delivery.',
    categories: ['Business Systems', 'Custom'],
    icon: Truck,
    badgeBg: 'bg-[#EAB308]',
    accentColor: '#EAB308',
    overview: 'Synchronize your entire supply network from raw material vendor procurement to last-mile fulfillment with predictive demand forecasting.',
    deliverables: ['End-to-End Shipment Visibility', 'Vendor Performance Benchmarking', 'Demand Forecasting Algorithms', 'Warehouse Dispatch Management'],
    targetAudience: 'Manufacturers, importers, FMCG brands, and global logistics providers.'
  },
  {
    id: 'lms',
    title: 'LMS – Learning',
    subtitle: 'Deliver engaging and trackable learning.',
    categories: ['Education'],
    icon: MonitorPlay,
    badgeBg: 'bg-[#6366F1]',
    accentColor: '#6366F1',
    overview: 'Create, distribute, and monetize interactive online courses with live webinar integration, automated quizzes, and verifiable completion certificates.',
    deliverables: ['Interactive Video & Audio Player', 'Automated Quizzes & Grading', 'Live Class Integration (Zoom/Meet)', 'Verifiable Certificate Generator'],
    targetAudience: 'EdTech startups, corporate training divisions, universities, and coaching institutes.'
  },
  {
    id: 'sms',
    title: 'SMS – Student Management',
    subtitle: 'Manage students and academic workflows.',
    categories: ['Education'],
    icon: UserCheck,
    badgeBg: 'bg-[#F43F5E]',
    accentColor: '#F43F5E',
    overview: 'Consolidated student lifecycle platform tracking admissions, attendance, behavioral records, academic transcripts, and emergency guardian notifications.',
    deliverables: ['Holistic Student Profiles', 'Biometric & QR Attendance', 'Automated SMS/WhatsApp Alerts', 'Academic Performance Records'],
    targetAudience: 'Colleges, vocational institutes, and school management boards.'
  },
  {
    id: 'expense-management',
    title: 'Expense Management',
    subtitle: 'Track and control expenses.',
    categories: ['Finance'],
    icon: PieChart,
    badgeBg: 'bg-[#06B6D4]',
    accentColor: '#06B6D4',
    overview: 'Gain complete fiscal oversight with mobile receipt OCR scanning, customizable multi-tier approval policies, corporate card feeds, and audit trails.',
    deliverables: ['AI Receipt Scanning & Extraction', 'Custom Multi-Level Approval Flows', 'Corporate Card Auto-Reconciliation', 'Per-Diem & Mileage Reimbursements'],
    targetAudience: 'Finance controllers, corporate procurement teams, and distributed remote teams.'
  },
  {
    id: 'e-commerce',
    title: 'E-Commerce',
    subtitle: 'Launch and manage your online store.',
    categories: ['E-Commerce', 'Custom'],
    icon: ShoppingCart,
    badgeBg: 'bg-[#F43F5E]',
    accentColor: '#F43F5E',
    overview: 'High-speed headless commerce platform featuring dynamic product catalogs, coupon engines, seamless checkout, and integrated shipping carrier APIs.',
    deliverables: ['Ultra-Fast Storefront Engine', 'Multi-Channel Inventory Sync', 'Cart Abandonment Recovery', 'Automated Shipping Carrier API Sync'],
    targetAudience: 'D2C brands, multi-brand retailers, and wholesale B2B merchants.'
  },
  {
    id: 'api-management',
    title: 'API Integration',
    subtitle: 'Connect and extend with powerful APIs.',
    categories: ['Cloud & DevOps', 'Custom'],
    icon: Cpu,
    badgeBg: 'bg-[#8B5CF6]',
    accentColor: '#8B5CF6',
    overview: 'Comprehensive API gateway providing rate-limiting, OAuth2/mTLS authentication, OpenAPI interactive documentation, and sub-millisecond telemetry.',
    deliverables: ['Enterprise Security & Rate Limiting', 'Developer Portal & Auto-Docs', 'Latency & Error Spike Telemetry', 'Version Lifecycle Governance'],
    targetAudience: 'Engineering teams, fintech platforms, and API-first SaaS products.'
  },
  {
    id: 'chit-fund',
    title: 'Chit Fund Management',
    subtitle: 'Manage group savings and transactions.',
    categories: ['Finance'],
    icon: Coins,
    badgeBg: 'bg-[#F59E0B]',
    accentColor: '#F59E0B',
    overview: 'Compliant financial software to orchestrate chit auctions, track subscriber installments, calculate dividends, and generate instant digital passbooks.',
    deliverables: ['Digital Auction & Bid Manager', 'Subscriber Ledger & Passbook App', 'Dividend & Commission Auto-Split', 'Regulatory Compliance Reporting'],
    targetAudience: 'Chit fund companies, micro-finance groups, and peer credit societies.'
  },
  {
    id: 'appointment-booking',
    title: 'Appointment Booking',
    subtitle: 'Easy booking and scheduling for businesses.',
    categories: ['Business Systems', 'Custom'],
    icon: CalendarClock,
    badgeBg: 'bg-[#0066FF]',
    accentColor: '#0066FF',
    overview: 'Frictionless online scheduling engine with real-time staff availability, calendar sync (Google/Outlook), deposit collection, and automated reminders.',
    deliverables: ['24/7 Self-Service Booking Widget', 'Two-Way Google/Apple Calendar Sync', 'Automated SMS & Email Reminders', 'Deposit & Full Payment Collection'],
    targetAudience: 'Healthcare clinics, legal consultants, salons, spas, and professional services.'
  }
];
