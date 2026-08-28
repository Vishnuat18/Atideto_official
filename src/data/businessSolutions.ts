import type { LucideIcon } from 'lucide-react';
import {
  Users,
  Receipt,
  Boxes,
  ClipboardList,
  GraduationCap,
  Building2,
  Dumbbell,
  BookOpen,
  Bus,
  Truck,
  MonitorPlay,
  UserCheck,
  PieChart,
  ShoppingCart,
  Cpu,
  Coins,
  CalendarCheck,
} from 'lucide-react';

export interface BusinessSolution {
  id: string;
  number: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  category: 'Enterprise' | 'Operations' | 'Finance' | 'Education' | 'Hospitality & Services' | 'Commerce & Tech';
  features: string[];
  benefits: string[];
  schemaType: 'SoftwareApplication' | 'Service';
}

export const BUSINESS_SOLUTIONS: BusinessSolution[] = [
  {
    id: 'crm',
    number: '01',
    name: 'CRM',
    shortName: 'CRM',
    tagline: 'Customer Relationship Management',
    description: 'Empower your sales, marketing, and support teams with unified customer intelligence, pipeline tracking, deal management, and automated follow-ups.',
    icon: Users,
    category: 'Enterprise',
    features: [
      'Lead & Contact Lifecycle Management',
      'Automated Sales Pipeline & Deal Stages',
      'Multi-channel WhatsApp & Email Integration',
      'Customer Support Ticketing & SLA Tracking',
      'Real-time Analytics & Revenue Forecasting'
    ],
    benefits: [
      'Increase lead conversion rates by up to 45%',
      'Eliminate forgotten follow-ups with smart automations',
      'Centralize customer communication history in one place'
    ],
    schemaType: 'SoftwareApplication',
  },
  {
    id: 'billing-system',
    number: '02',
    name: 'Billing System',
    shortName: 'Billing',
    tagline: 'Smart billing and invoicing made simple.',
    description: 'Automated invoice generation, GST/tax calculation, recurring subscription billing, payment gateway integrations, and instant payment links.',
    icon: Receipt,
    category: 'Finance',
    features: [
      'One-Click GST & Tax-Compliant Invoicing',
      'Automated Recurring Invoices & Reminders',
      'Integrated UPI, Card & Net Banking Gateways',
      'Multi-currency & Multi-branch Billing Support',
      'Comprehensive Cash Flow & Outstanding Reports'
    ],
    benefits: [
      'Speed up payment collections by 60%',
      '100% tax and GST compliance without human error',
      'Send professional digital invoices via WhatsApp and Email'
    ],
    schemaType: 'SoftwareApplication',
  },
  {
    id: 'erp',
    number: '03',
    name: 'ERP',
    shortName: 'ERP',
    tagline: 'Enterprise Resource Planning',
    description: 'A single, unified ERP engine that orchestrates your enterprise finance, inventory, manufacturing, human resources, and business operations.',
    icon: Boxes,
    category: 'Enterprise',
    features: [
      'End-to-End Enterprise Resource Orchestration',
      'Financial Accounting, General Ledger & Audits',
      'Human Resource & Payroll Management (HRMS)',
      'Procurement, Purchase Orders & Vendor Portal',
      'Role-based Access Control & Security Auditing'
    ],
    benefits: [
      'Break data silos between departmental teams',
      'Real-time executive dashboard for high-level decision making',
      'Scalable modular architecture tailored to your business'
    ],
    schemaType: 'SoftwareApplication',
  },
  {
    id: 'inventory-management',
    number: '04',
    name: 'Inventory Management System',
    shortName: 'Inventory Management',
    tagline: 'Track, manage and optimize your inventory.',
    description: 'Real-time stock auditing, multi-warehouse synchronization, automated low-stock reordering alerts, barcode/QR scanning, and shrinkage prevention.',
    icon: ClipboardList,
    category: 'Operations',
    features: [
      'Real-time Multi-Warehouse Stock Tracking',
      'Barcode, RFID & QR Code Scanning',
      'Automated Low-Stock & Reorder Point Alerts',
      'Batch Tracking, Expiry Management & FIFO/LIFO',
      'Comprehensive Stock Valuation & Audit Logs'
    ],
    benefits: [
      'Prevent over-stocking and stockout incidents',
      'Cut inventory holding costs by up to 25%',
      'Eliminate manual counting errors with instant barcode scans'
    ],
    schemaType: 'SoftwareApplication',
  },
  {
    id: 'school-erp',
    number: '05',
    name: 'School ERP',
    shortName: 'School ERP',
    tagline: 'Complete management solution for schools.',
    description: 'An all-in-one educational campus platform automating student admissions, digital fee collection, examinations, attendance, report cards, and parent portals.',
    icon: GraduationCap,
    category: 'Education',
    features: [
      'Online Admissions & Student Enrollment',
      'Automated Fee Collection & Receipt Management',
      'Timetable Scheduling & Teacher Workload Manager',
      'Examination Grading, Report Cards & Transcripts',
      'Dedicated Mobile App for Parents & Teachers'
    ],
    benefits: [
      'Reduce administrative paperwork by 80%',
      'Seamless transparency and communication with parents',
      'Real-time tracking of student attendance and academic growth'
    ],
    schemaType: 'SoftwareApplication',
  },
  {
    id: 'hotel-management',
    number: '06',
    name: 'Hotel Management System',
    shortName: 'Hotel Management',
    tagline: 'Simplify hotel operations and guest management.',
    description: 'Complete hospitality system covering front-desk check-in, real-time room reservations, housekeeping status, POS restaurant billing, and OTA channel syncing.',
    icon: Building2,
    category: 'Hospitality & Services',
    features: [
      'Front Desk Reservation & Room Allocation Grid',
      'Direct Booking Engine & Multi-channel OTA Sync',
      'Housekeeping Workflow & Maintenance Alerts',
      'Restaurant POS, Banquet & Room Service Billing',
      'Guest CRM, Loyalty Program & Feedback System'
    ],
    benefits: [
      'Maximize room occupancy rates with synchronized booking channels',
      'Speed up guest check-ins and check-outs with digital keys & POS',
      'Deliver premium guest experiences that boost ratings and reviews'
    ],
    schemaType: 'SoftwareApplication',
  },
  {
    id: 'gym-management',
    number: '07',
    name: 'Gym Management System',
    shortName: 'Gym Management',
    tagline: 'Manage members, plans and schedules efficiently.',
    description: 'Comprehensive fitness center software managing memberships, personal trainer schedules, biometric turnstile access, diet plans, and automated renewals.',
    icon: Dumbbell,
    category: 'Hospitality & Services',
    features: [
      'Member Registration, Plan Selection & Renewal Alerts',
      'Biometric & RFID Access Control Integration',
      'Trainer Scheduling, Classes & Slot Booking',
      'Workout Routines & Nutrition Diet Tracking',
      'Automated WhatsApp Membership Expiry Reminders'
    ],
    benefits: [
      'Automate membership renewal collections effortlessly',
      'Prevent unauthorized gym entry with biometric synchronization',
      'Keep members motivated with mobile workout tracking'
    ],
    schemaType: 'SoftwareApplication',
  },
  {
    id: 'library-management',
    number: '08',
    name: 'Library Management System',
    shortName: 'Library Management',
    tagline: 'Organize books, members and issuing seamlessly.',
    description: 'Digital cataloging, barcode book issue/return tracking, member subscriptions, fine calculation, and automated overdue book notifications.',
    icon: BookOpen,
    category: 'Education',
    features: [
      'OPAC Digital Book Catalog & Smart Search',
      'Fast Barcode & RFID Issue / Return Workflows',
      'Member Card Management & Lending Limits',
      'Automated Overdue Alerts & Fine Calculator',
      'E-Book & Digital Resource Repository Management'
    ],
    benefits: [
      'Zero lost books with precise tracking and barcode logs',
      'Empower readers to search and reserve titles online',
      'Simplify annual inventory and library audits'
    ],
    schemaType: 'SoftwareApplication',
  },
  {
    id: 'transport-management',
    number: '09',
    name: 'Transport Management System',
    shortName: 'Transport Management',
    tagline: 'Manage fleets, routes and operations in one place.',
    description: 'Enterprise fleet management with live GPS vehicle tracking, optimized route planning, fuel expense monitoring, driver performance, and maintenance scheduling.',
    icon: Bus,
    category: 'Operations',
    features: [
      'Live GPS Tracking & Geofencing Alerts',
      'Intelligent Route Optimization & Dispatch',
      'Fuel Consumption & Toll Expense Monitoring',
      'Driver Duty Logs, Performance & Compliance',
      'Automated Vehicle Service & Insurance Reminders'
    ],
    benefits: [
      'Reduce fuel expenses by 20% through optimized routes',
      'Real-time passenger and cargo security monitoring',
      'Maximize fleet vehicle longevity and minimize breakdown costs'
    ],
    schemaType: 'SoftwareApplication',
  },
  {
    id: 'scm-supply-chain',
    number: '10',
    name: 'SCM – Supply Chain Management',
    shortName: 'Supply Chain Management',
    tagline: 'Streamline your supply chain from end to end.',
    description: 'Complete supply chain visibility connecting vendor procurement, production milestones, transit logistics, demand forecasting, and warehouse networks.',
    icon: Truck,
    category: 'Operations',
    features: [
      'End-to-End Procurement & Supplier Portal',
      'AI-Powered Demand & Order Forecasting',
      'Multi-modal Logistics & Freight Tracking',
      'Quality Inspection & Compliance Verification',
      'Real-time Supply Chain Analytics & Bottleneck Alerts'
    ],
    benefits: [
      'Reduce supply chain lead times and delivery delays',
      'Gain full transparent visibility into vendor performance',
      'Optimize working capital with accurate demand forecasting'
    ],
    schemaType: 'SoftwareApplication',
  },
  {
    id: 'lms-learning-management',
    number: '11',
    name: 'LMS – Learning Management System',
    shortName: 'Learning Management System',
    tagline: 'Deliver, manage and track learning effectively.',
    description: 'A modern e-learning platform supporting structured video courses, interactive quizzes, student progress analytics, certificates, and live webinar integrations.',
    icon: MonitorPlay,
    category: 'Education',
    features: [
      'High-Definition Video Course Hosting & Streaming',
      'Interactive Quizzes, Assignments & Automated Grading',
      'Student Progress Tracking & Gamified Leaderboards',
      'Automated Verifiable Certificate Generation',
      'Zoom / Google Meet Live Class Integrations'
    ],
    benefits: [
      'Scale training to thousands of students without infrastructure strain',
      'Enhance completion rates with interactive learning paths',
      'Issue tamper-proof certificates verifiable instantly online'
    ],
    schemaType: 'SoftwareApplication',
  },
  {
    id: 'sms-student-management',
    number: '12',
    name: 'SMS – Student Management System',
    shortName: 'Student Management System',
    tagline: 'Manage student data and academic activities.',
    description: 'Centralized student record management encompassing academic performance, attendance, behavioral records, certificates, and alumni relations.',
    icon: UserCheck,
    category: 'Education',
    features: [
      'Centralized 360-Degree Student Profiles',
      'Semester-wise Gradebooks & Academic Transcripts',
      'Biometric / QR Student Attendance Tracking',
      'Disciplinary Records, Achievements & Extracurriculars',
      'Alumni Directory & Placement Tracking'
    ],
    benefits: [
      'Instant retrieval of any student academic record in seconds',
      'Secure, cloud-backed archival compliant with education boards',
      'Strengthen alumni network and institutional placement records'
    ],
    schemaType: 'SoftwareApplication',
  },
  {
    id: 'expense-management',
    number: '13',
    name: 'Expense Management System',
    shortName: 'Expense Management',
    tagline: 'Track and control expenses with ease.',
    description: 'Corporate spend management with OCR receipt scanning, multi-tier approval workflows, department budget enforcement, and corporate card reconciliations.',
    icon: PieChart,
    category: 'Finance',
    features: [
      'AI OCR Receipt Scanning & Auto-Categorization',
      'Multi-level Manager Approval Workflows',
      'Departmental Budget Caps & Over-spend Alerts',
      'Travel Expense & Mileage Reimbursement Tracker',
      'Seamless Export to Tally, Zoho Books & QuickBooks'
    ],
    benefits: [
      'Cut reimbursement turnaround time from weeks to minutes',
      'Prevent duplicate claims and fraudulent expense entries',
      'Maintain 100% audit-ready financial expense records'
    ],
    schemaType: 'SoftwareApplication',
  },
  {
    id: 'ecommerce-management',
    number: '14',
    name: 'E-Commerce Management System',
    shortName: 'E-Commerce Management',
    tagline: 'Manage your online store efficiently.',
    description: 'Robust digital commerce platform with catalog management, seamless checkout, automated shipping logistics, discount promo engines, and customer analytics.',
    icon: ShoppingCart,
    category: 'Commerce & Tech',
    features: [
      'Modern High-Conversion Storefront & Product Catalog',
      'Secure Multi-Currency Payment Gateway Checkout',
      'Automated Shipping Courier Aggregator Sync (Shiprocket/Delhivery)',
      'Dynamic Coupon Codes, Flash Sales & Abandoned Cart Recovery',
      'Customer Retention CRM & Order Analytics'
    ],
    benefits: [
      'Convert more visitors into paying customers with lightning-fast UX',
      'Automate fulfillment labels and courier dispatching',
      'Scale your online revenue across national and international markets'
    ],
    schemaType: 'SoftwareApplication',
  },
  {
    id: 'api-management',
    number: '15',
    name: 'API Management System',
    shortName: 'API Management',
    tagline: 'Secure, monitor and manage your APIs.',
    description: 'Enterprise API gateway infrastructure featuring rate limiting, OAuth/JWT token security, developer portal, real-time analytics, and high-availability routing.',
    icon: Cpu,
    category: 'Commerce & Tech',
    features: [
      'High-Throughput API Gateway & Load Balancing',
      'OAuth2, JWT & API Key Authentication',
      'Rate Limiting, IP Whitelisting & DDoS Mitigation',
      'Interactive Developer Portal & Swagger / OpenAPI Docs',
      'Real-time Uptime, Latency & Error Telemetry'
    ],
    benefits: [
      'Protect backend microservices from traffic surges and cyber threats',
      'Accelerate third-party developer integration speed',
      'Ensure 99.99% service reliability with automated health checks'
    ],
    schemaType: 'SoftwareApplication',
  },
  {
    id: 'chit-fund-management',
    number: '16',
    name: 'Chit Fund Management System',
    shortName: 'Chit Fund Management',
    tagline: 'Manage chit groups and transactions effortlessly.',
    description: 'Comprehensive chit fund software managing group formations, live auctions, dividend calculations, subscriber ledgers, and automated payment collection.',
    icon: Coins,
    category: 'Finance',
    features: [
      'Chit Group Creation, Ticket Allocation & Schemes',
      'Live & Online Auction Management System',
      'Automated Dividend & Commission Calculations',
      'Subscriber Passbook, Receipts & Outstanding Dues',
      'Regulatory Compliance & Government Chit Act Reports'
    ],
    benefits: [
      '100% calculation accuracy on auctions and dividends',
      'Build maximum subscriber trust with transparent mobile passbooks',
      'Automate daily/monthly collection reminders via SMS & WhatsApp'
    ],
    schemaType: 'SoftwareApplication',
  },
  {
    id: 'appointment-booking',
    number: '17',
    name: 'Appointment Booking System – For All Businesses',
    shortName: 'Appointment Booking',
    tagline: 'Simplify bookings and manage appointments with ease.',
    description: 'Self-service online booking engine with automatic Google / Outlook calendar sync, automated WhatsApp / SMS reminders, staff allocation, and advance deposits.',
    icon: CalendarCheck,
    category: 'Hospitality & Services',
    features: [
      'Embeddable Online Self-Service Booking Widget',
      'Two-Way Google Calendar & Outlook Synchronization',
      'Automated WhatsApp, SMS & Email Appointment Reminders',
      'Staff Slot Allocation & Multi-Location Support',
      'Online Advance Deposit & Full Payment Options'
    ],
    benefits: [
      'Eliminate no-shows with automated WhatsApp reminders',
      'Accept appointments 24/7 without manual telephone calls',
      'Organize staff schedules and optimize daily customer capacity'
    ],
    schemaType: 'SoftwareApplication',
  },
];

export const SOLUTION_VALUES = [
  { title: 'Streamline Operations', description: 'Eliminate manual bottlenecks with integrated workflows.' },
  { title: 'Improve Efficiency', description: 'Automate repetitive tasks and boost team output.' },
  { title: 'Drive Growth', description: 'Scale your revenue with intelligent digital systems.' },
  { title: 'Reliable & Secure', description: 'Enterprise architecture engineered with 99.9% uptime.' },
];

export const CTA_PILLARS = [
  { title: 'Custom Solutions', description: 'Tailored specifically for your workflows.' },
  { title: 'Expert Team', description: 'Senior engineers and domain specialists.' },
  { title: 'On-time Delivery', description: 'Agile sprints with transparent milestones.' },
  { title: 'Dedicated Support', description: 'Continuous maintenance and rapid SLA response.' },
];

export const OFFICIAL_CONTACT_INFO = {
  company: 'ATIDETO Technologies',
  tagline: 'INNOVATE • BUILD • TRANSFORM',
  ceo: {
    name: 'Vishnu R',
    title: 'Chief Executive Officer (CEO) & Founder',
    email: 'vishnurajan24766@gmail.com',
    phone: '+91 9087284053',
    linkedin: 'https://www.linkedin.com/in/vishnu-r-a41884300/',
    github: 'https://github.com/Vishnuat18',
  },
  phones: ['+91 9087284053', '+91 9363600534'],
  email: 'atidetotechnologies@gmail.com',
  alternateEmail: 'atideto.in@gmail.com',
  website: 'https://www.atideto.in',
  displayWebsite: 'atideto.in',
  location: {
    street: 'Ponnammapet',
    city: 'Salem',
    state: 'Tamil Nadu',
    country: 'India',
    postalCode: '636001',
    fullAddress: 'Ponnammapet, Salem, Tamil Nadu, India',
    geo: {
      latitude: 11.6643,
      longitude: 78.1460,
    }
  }
};
