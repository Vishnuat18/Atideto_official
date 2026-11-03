import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Layers,
  Smartphone,
  TrendingUp,
  Globe,
  Code2,
  Palette,
  ChevronDown,
  ArrowUpRight,
  ArrowRight,
  Sparkles
} from 'lucide-react';

// Direct ES6 imports guarantee 100% reliable bundling and zero broken images
import aiAutomationMockup from '@/assets/solutions/sol/ai_automation.png';
import businessSystemsMockup from '@/assets/solutions/sol/business_systems.png';
import appDevelopmentMockup from '@/assets/solutions/sol/app_development.png';
import digitalMarketingMockup from '@/assets/solutions/sol/digital_marketing.png';
import webDevelopmentMockup from '@/assets/solutions/sol/web_development.png';
import customSoftwareMockup from '@/assets/solutions/sol/custom_software.png';
import uiuxDesigningMockup from '@/assets/solutions/sol/uiux_designing.png';

function SolutionPillButton({ pill, onClick }: { pill: string; onClick: () => void }) {
  const isWhatsApp = pill.toLowerCase().includes('whatsapp');
  const accent = isWhatsApp ? '#25D366' : '#00F0FF';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full group flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-white/[0.025] hover:bg-white/[0.06] border border-white/[0.07] hover:-translate-y-0.5 transition-all duration-200 text-left cursor-pointer ${
        isWhatsApp
          ? 'hover:border-[#25D366]/50 hover:bg-[#25D366]/15 hover:shadow-[0_4px_16px_rgba(37,211,102,0.25)]'
          : 'hover:border-[#00F0FF]/40 hover:bg-[#0052FF]/15 hover:shadow-[0_4px_16px_rgba(0,82,255,0.25)]'
      }`}
    >
      <span className="text-xs font-medium text-slate-200 group-hover:text-white transition-colors flex items-center gap-1.5">
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: accent }}
        />
        <span>{pill}</span>
      </span>
      <span
        className={`w-5 h-5 rounded-full bg-white/[0.05] text-slate-400 group-hover:text-white flex items-center justify-center shrink-0 ml-2 transition-all ${
          isWhatsApp ? 'group-hover:bg-[#25D366] group-hover:text-black' : 'group-hover:bg-[#0052FF]'
        }`}
      >
        <ArrowUpRight size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </span>
    </button>
  );
}

interface SubServiceCategory {
  name: string;
  count: string;
  desc: string;
  pills: string[];
}

interface ServiceSectionData {
  id: string;
  num: string;
  title: string;
  subDay: string;
  lead: string;
  mockup: string;
  scope: string;
  groups: SubServiceCategory[];
}

const CORE_SERVICES: ServiceSectionData[] = [
  // ── 01. AI & AUTOMATION ────────────────────────────────────────────────
  {
    id: 'service-01',
    num: '01',
    title: 'AI & Automation',
    subDay: 'Intelligent Systems',
    lead: 'Spend less time on repetitive manual work and respond to customers with sub-second consistency through autonomous AI agents and automated multi-app pipelines.',
    mockup: aiAutomationMockup,
    scope: 'Conversational bots, business automation pipelines, and custom machine learning modules.',
    groups: [
      {
        name: 'Conversational & Client AI',
        count: '05',
        desc: 'Automate inbound customer inquiries, support auto-triaging, and booking appointments.',
        pills: [
          'AI Chatbots',
          'Appointment & Reminder Automation',
          'Customer Support Automation',
          'Website Chatbots',
          'WhatsApp Automation'
        ]
      },
      {
        name: 'Business & Media Workflows',
        count: '05',
        desc: 'Streamline repetitive tasks, automate CRM leads, and generate automated video and email channels.',
        pills: [
          'Business Process Automation',
          'CRM Pipelining Automation',
          'Custom AI Solutions',
          'Email Automation',
          'YouTube Automation'
        ]
      }
    ]
  },

  // ── 02. BUSINESS SYSTEMS ───────────────────────────────────────────────
  {
    id: 'service-02',
    num: '02',
    title: 'Business Systems',
    subDay: 'Enterprise Operations',
    lead: 'Unify finance, operations, stock, and personnel into one cohesive engine with enterprise role-based governance and audit trails.',
    mockup: businessSystemsMockup,
    scope: 'Departmental ERP workflows, CRM sales pipelines, and automated financial billing systems.',
    groups: [
      {
        name: 'Enterprise Resource & Supply Chain',
        count: '05',
        desc: 'Connect procurement, stock, route GPS, and telemetry in one unified dashboard.',
        pills: [
          'Enterprise ERP',
          'Executive Dashboards & BI',
          'Fleet Management & GPS',
          'Inventory & Warehouse Management',
          'Supply Chain Management'
        ]
      },
      {
        name: 'Revenue, Billing & Sector Portals',
        count: '06',
        desc: 'Automate invoicing, recurring collections, and specialized institutional administration.',
        pills: [
          'Billing & POS Systems',
          'Chit Fund Management',
          'CRM Systems',
          'Gym Management',
          'Hotel Management',
          'School & College ERP'
        ]
      }
    ]
  },

  // ── 03. APP DEVELOPMENT ────────────────────────────────────────────────
  {
    id: 'service-03',
    num: '03',
    title: 'App Development',
    subDay: 'Mobile Systems',
    lead: 'High-performance iOS and Android applications crafted for scale, offline sync, biometric security, and fluid 120Hz native interactions.',
    mockup: appDevelopmentMockup,
    scope: 'Cross-platform Flutter, native Swift & Kotlin development, and zero-latency backend APIs.',
    groups: [
      {
        name: 'Consumer & Commerce Mobile Apps',
        count: '05',
        desc: 'High-converting mobile storefronts, on-demand service bookings, and clinic platforms.',
        pills: [
          'Clinic & Healthcare Apps',
          'E-Commerce & Retail Apps',
          'Food & Restaurant Apps',
          'On-Demand Booking Apps',
          'Real Estate & Property Apps'
        ]
      },
      {
        name: 'Enterprise & Social Platforms',
        count: '06',
        desc: 'Bank-grade wallets, classroom portals, fitness trackers, and workforce telematics.',
        pills: [
          'EdTech & Learning Apps',
          'Field & Attendance Apps',
          'FinTech & Wallet Apps',
          'Fitness & Workout Apps',
          'Logistics & Delivery Apps',
          'Social & Community Apps'
        ]
      }
    ]
  },

  // ── 04. DIGITAL MARKETING ──────────────────────────────────────────────
  {
    id: 'service-04',
    num: '04',
    title: 'Digital Marketing',
    subDay: 'Growth Engine',
    lead: 'Reach people who are more likely to need what you offer through precision paid ad funnels, high-converting creatives, and end-to-end attribution tracking.',
    mockup: digitalMarketingMockup,
    scope: 'Paid advertising engines across Meta and Google, technical SEO audits, and creative ad production.',
    groups: [
      {
        name: 'Paid Acquisition & Search Media',
        count: '05',
        desc: 'Laser-focused media buying and funnel optimization that lowers acquisition costs.',
        pills: [
          'Conversion Rate Optimization (CRO)',
          'Google Search & Display Ads',
          'Lead Generation Funnels',
          'Meta Ads (Facebook & Instagram)',
          'Performance Social Media Ads'
        ]
      },
      {
        name: 'Creatives, Video & Content',
        count: '05',
        desc: 'High-impact copy, AI video ad variations, and long-term organic search authority.',
        pills: [
          'Ad Copywriting & Creatives',
          'AI Video Ad Production',
          'Content Marketing & Reels',
          'SEO & Local Search Optimization',
          'YouTube & Video Advertising'
        ]
      }
    ]
  },

  // ── 05. WEBSITE DEVELOPMENT ────────────────────────────────────────────
  {
    id: 'service-05',
    num: '05',
    title: 'Website Development',
    subDay: 'Modern Platforms',
    lead: 'High-speed web platforms built with React, Next.js, and TypeScript, engineered to convert visitors into loyal customers with sub-second load times.',
    mockup: webDevelopmentMockup,
    scope: 'Modern headless web platforms, custom CMS portals, and e-commerce architectures.',
    groups: [
      {
        name: 'Commercial & Platform Portals',
        count: '05',
        desc: 'High-speed headless commerce, corporate portfolios, SaaS frontends, and marketplace portals.',
        pills: [
          'Business Portfolio & Corporate Websites',
          'E-Commerce & Online Stores',
          'High-Converting Landing Pages',
          'Marketplace & Directory Portals',
          'SaaS & Web App Frontends'
        ]
      },
      {
        name: 'Industry & Sector Web Solutions',
        count: '05',
        desc: 'Specialized websites with integrated appointment, ordering, and student portals.',
        pills: [
          'Clinic & Healthcare Websites',
          'Educational & LMS Portals',
          'Hotel & Hospitality Websites',
          'Real Estate Property Portals',
          'Restaurant & Food Ordering Sites'
        ]
      }
    ]
  },

  // ── 06. CUSTOM SOFTWARE ────────────────────────────────────────────────
  {
    id: 'service-06',
    num: '06',
    title: 'Custom Software',
    subDay: 'Proprietary Architecture',
    lead: 'Organize the work that spreadsheets and disconnected tools make difficult with bespoke platforms built around your exact business processes.',
    mockup: customSoftwareMockup,
    scope: 'Bespoke platforms designed around your exact workflows with specialized ERP and POS engines.',
    groups: [
      {
        name: 'Operational Engines & Logistics',
        count: '05',
        desc: 'Automated billing, custom ERPs, fulfillment tracking, and warehouse logistics.',
        pills: [
          'Automated Billing & Invoicing Systems',
          'Custom ERP & Workflow Engines',
          'Order Processing & Fulfillment Systems',
          'Transport & Fleet Telematics Systems',
          'Warehouse & Inventory Control Systems'
        ]
      },
      {
        name: 'Management, BI & SaaS Portals',
        count: '05',
        desc: 'Self-service vendor portals, custom CRM pipelines, attendance, and executive BI dashboards.',
        pills: [
          'Client & Vendor Self-Service Portals',
          'Custom CRM Platforms',
          'Employee Attendance & Payroll Systems',
          'Executive BI & Reporting Dashboards',
          'Multi-Tenant SaaS Architecture'
        ]
      }
    ]
  },

  // ── 07. UI & UX DESIGN ─────────────────────────────────────────────────
  {
    id: 'service-07',
    num: '07',
    title: 'UI & UX Design',
    subDay: 'Product Experience',
    lead: 'Make digital products easier for real people to use through thorough user research, high-fidelity Figma prototypes, and comprehensive design systems.',
    mockup: uiuxDesigningMockup,
    scope: 'Enterprise design systems, interactive Figma prototypes, SaaS analytics dashboards, and 3D visual assets.',
    groups: [
      {
        name: 'Product & Interface Design',
        count: '05',
        desc: 'Modern interfaces crafted for iOS/Android native apps, SaaS web apps, and component kits.',
        pills: [
          'Clickable Figma Prototypes',
          'Design Systems & Component Libraries',
          'Enterprise Dashboard & Analytics UI',
          'Mobile App UI/UX (iOS & Android)',
          'SaaS Platform & Web App Interfaces'
        ]
      },
      {
        name: 'Brand & Conversion Ergonomics',
        count: '05',
        desc: 'Conversion landing pages, brand identity systems, and FinTech & Healthcare UX.',
        pills: [
          'Brand Identity & Visual Guidelines',
          'E-Commerce Storefront UI Design',
          'FinTech & Banking App UX',
          'Healthcare & Clinical Portal Design',
          'High-Converting Landing Page Design'
        ]
      }
    ]
  }
];

export default function SolutionsGrid({ isHome = false }: { isHome?: boolean }) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Accordion state: open group keys per service index (all closed by default)
  const [openAccordions, setOpenAccordions] = useState<Record<string, number | null>>({});

  const toggleAccordion = (serviceIdx: number, groupIdx: number) => {
    const key = String(serviceIdx);
    setOpenAccordions((prev) => {
      const current = prev[key];
      return {
        ...prev,
        [key]: current === groupIdx ? null : groupIdx
      };
    });
  };

  return (
    <section
      ref={containerRef}
      id="solutions-grid"
      className="relative w-full bg-[#050505] text-[#F1F5F9] pt-12 sm:pt-20 pb-28 font-sans selection:bg-[#00F0FF] selection:text-black"
    >
      {/* Ambient Radial Lighting Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[950px] h-[450px] bg-gradient-to-b from-[#0052FF]/14 to-transparent blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[550px] h-[450px] bg-[#00F0FF]/06 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[600px] h-[400px] bg-[#0052FF]/08 blur-[160px] pointer-events-none" />

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── TOP SECTION HEADER: (Image 2 Reference Design)                  ── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center mb-16 sm:mb-24">
        {/* Eyebrow: ── CORE SERVICES (Matching 2nd Reference Image, No Number) */}
        <div className="inline-flex items-center gap-3 mb-3.5 select-none justify-center">
          <span className="w-8 sm:w-10 h-[1.5px] bg-[#0052FF] shrink-0" />
          <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase font-heading text-[#2EA8FF]">
            CORE SERVICES
          </span>
        </div>

        {/* Main Title: Enterprise Services */}
        <h2
          className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight leading-[1.2] mb-4 font-heading"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Enterprise{' '}
          <span className="text-white">
            Services
          </span>
        </h2>

        {/* Subtitle in clean Inter */}
        <p
          className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          High-performance digital products engineered for operational efficiency, security, and measurable growth.
        </p>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── ALL 8 SERVICE BLOCKS (CATEGORIZED SHOWCASE DESIGN)              ── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-0 relative z-10">
        {CORE_SERVICES.map((service, serviceIdx) => {
          const currentOpenGroup = openAccordions[String(serviceIdx)];

          return (
            <div
              key={service.id}
              id={service.id}
              ref={(el) => (serviceRefs.current[serviceIdx] = el)}
              className="relative scroll-mt-24 service-section-block pt-2 sm:pt-4 pb-16 sm:pb-20"
            >
              {/* 1. STICKY SERVICE CATEGORY HEADER (Matches Reference Image 2: exactly 20px top margin above separator line) */}
              <div className="sticky top-0 z-30 bg-[#050505]/98 backdrop-blur-2xl -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-6 sm:mb-8 shadow-[0_12px_32px_rgba(0,0,0,0.85)]">
                {/* 20px margin above the separator line */}
                <div className="h-5 w-full pointer-events-none" />

                {/* Crisp horizontal separator line across header */}
                <div className="w-full h-px bg-white/10" />

                {/* Sticky title and action row */}
                <div className="pt-4 pb-4 sm:pt-5 sm:pb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3
                      onClick={() => navigate(`/services/${service.id}`)}
                      className="text-[24px] sm:text-[28px] font-bold text-white hover:text-[#2EA8FF] transition-colors cursor-pointer tracking-tight leading-none flex items-center gap-2.5 sm:gap-3 font-heading"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      title={`View ${service.title} details`}
                    >
                      <span className="text-[#38BDF8] font-bold text-2xl sm:text-3xl italic tracking-tight font-heading">{service.num}</span>
                      <span>{service.title}</span>
                    </h3>

                    <span className="text-white/20 text-2xl font-light select-none">/</span>
                    <span
                      className="text-xs sm:text-sm font-semibold text-[#94A3B8] tracking-tight font-heading"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {service.subDay}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/services/${service.id}`)}
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#38BDF8] hover:text-white transition-colors cursor-pointer font-heading"
                  >
                    <span>Explore Detail</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* 2. HERO PRESENTATION ROW: Info Left, Direct Mockup Right (NO DIV WRAPPER) */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] items-center gap-8 lg:gap-12 mb-8 sm:mb-10">
                {/* Left Info Column */}
                <div className="flex flex-col items-start">
                  <p
                    className="text-sm sm:text-base text-slate-300 max-w-lg mb-6 leading-relaxed font-sans font-normal"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {service.lead}
                  </p>

                  {/* Action Buttons: "Talk about this service" (opens specific service page) + Consultation button */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => navigate(`/services/${service.id}`)}
                      className="group relative inline-flex items-center justify-between gap-4 bg-[#0052FF] hover:bg-[#0042D0] text-white py-2 pl-5 pr-2 rounded-full font-semibold text-xs sm:text-sm tracking-wide border border-white/20 shadow-[0_4px_18px_rgba(0,82,255,0.38)] hover:shadow-[0_6px_26px_rgba(0,82,255,0.55),0_0_16px_rgba(0,240,255,0.25)] hover:border-cyan-400/50 transition-all duration-300 active:scale-95 cursor-pointer font-heading"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      title={`Open ${service.title} service page`}
                    >
                      <span>Talk about this service</span>
                      <span className="w-8 h-8 rounded-full bg-[#0036B8] group-hover:bg-[#00F0FF] group-hover:shadow-[0_0_10px_rgba(0,240,255,0.4)] flex items-center justify-center transition-all duration-300">
                        <ArrowUpRight
                          size={14}
                          className="text-white group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        />
                      </span>
                    </button>

                    <button
                      onClick={() => navigate(`/client-connect?service=${encodeURIComponent(service.title)}`)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#38BDF8]/40 transition-all duration-200 cursor-pointer font-sans"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      <span>Consult team</span>
                      <ArrowRight size={12} className="text-[#38BDF8]" />
                    </button>
                  </div>
                </div>

                {/* Right: Standalone Mockup Image (Clickable to detail page) */}
                <img
                  src={service.mockup}
                  alt={`${service.title} 3D Showcase Mockup`}
                  className="w-full max-w-[420px] h-auto max-h-[250px] object-contain justify-self-center transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 cursor-pointer select-none"
                  loading="lazy"
                  onClick={() => navigate(`/services/${service.id}`)}
                  title={`View ${service.title} details`}
                />
              </div>

              {/* 3. SPLIT FAQ LAYOUT: Left Sticky Box + Right Accordion Rows */}
              <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 lg:gap-12 pt-7 border-t border-white/[0.08] items-start pb-4">
                
                {/* Left Column: Title + Scope */}
                <div className="md:sticky md:top-24">
                  <h4
                    className="text-[20px] sm:text-[22px] font-semibold text-white mb-2 leading-tight tracking-tight font-heading"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Explore our capabilities
                  </h4>
                  <p
                    className="text-xs sm:text-sm text-slate-400 font-normal leading-relaxed font-sans"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {service.scope}
                  </p>
                </div>

                {/* Right Column: FAQ Accordion Groups (Click to toggle) */}
                <div className="space-y-2.5">
                  {service.groups.map((group, groupIdx) => {
                    const isOpen = currentOpenGroup === groupIdx;

                    return (
                      <div
                        key={group.name}
                        className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                          isOpen
                            ? 'bg-[#0A0E1A] border-[#0052FF]/40 shadow-[0_4px_24px_rgba(0,82,255,0.15)]'
                            : 'bg-[#070A14]/80 border-white/[0.08] hover:border-white/15'
                        }`}
                      >
                        {/* Accordion Trigger */}
                        <button
                          type="button"
                          onClick={() => toggleAccordion(serviceIdx, groupIdx)}
                          className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer transition-colors select-none"
                        >
                          <span
                            className="text-sm sm:text-base font-semibold text-white tracking-tight font-heading"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                          >
                            {group.name}
                          </span>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-mono text-xs font-bold text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/25 px-2.5 py-0.5 rounded-full">
                              {group.count}
                            </span>
                            <ChevronDown
                              size={18}
                              className={`text-slate-400 group-hover:text-white transition-transform duration-300 shrink-0 ${
                                isOpen ? 'rotate-180 text-[#00F0FF]' : ''
                              }`}
                            />
                          </div>
                        </button>

                        {/* Accordion Collapsible Content */}
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                            >
                              <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-white/[0.06]">
                                <p
                                  className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed font-normal"
                                  style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                  {group.desc}
                                </p>

                                {/* Subservice Pills Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {group.pills.map((pill) => (
                                    <SolutionPillButton
                                      key={pill}
                                      pill={pill}
                                      onClick={() => navigate(`/client-connect?service=${encodeURIComponent(pill)}`)}
                                    />
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
