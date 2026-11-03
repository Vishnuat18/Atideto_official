import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface CapabilityItem {
  name: string;
}

interface ServiceCategory {
  id: string;
  title: string;
  tagline: string;
  description: string;
  accentColor: string;
  capabilitiesCol1: CapabilityItem[];
  capabilitiesCol2: CapabilityItem[];
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
  // 1. App Development
  {
    id: 'app-development',
    title: 'App Development',
    tagline: 'High-performance iOS and Android applications crafted for scale, security, and fluid experience.',
    description: 'We architect production-grade native and cross-platform mobile apps using Flutter, React Native, Swift, and Kotlin, with offline sync and App Store readiness.',
    accentColor: '#0066FF',
    capabilitiesCol1: [
      { name: 'iOS App Development (Swift)' },
      { name: 'Android Development (Kotlin)' },
      { name: 'Flutter Cross-Platform Apps' },
      { name: 'React Native Mobile Systems' },
      { name: 'Mobile UI/UX & Motion Design' },
      { name: 'App Store & Play Store Deployment' },
    ],
    capabilitiesCol2: [
      { name: 'In-App Purchases & Stripe Subscriptions' },
      { name: 'Offline Data Sync & SQLite' },
      { name: 'Push Notification Pipelines' },
      { name: 'Real-Time Chat & Geolocation' },
      { name: 'Performance & Battery Optimization' },
      { name: 'Mobile Security & Biometrics' },
    ]
  },

  // 2. Web Development
  {
    id: 'web-development',
    title: 'Web Development',
    tagline: 'Blazing-fast, responsive web platforms engineered to convert visitors into loyal customers.',
    description: 'We develop modern web applications with Next.js 15, React 19, TypeScript, and Tailwind CSS that load in under 1 second and rank on page one of Google.',
    accentColor: '#0066FF',
    capabilitiesCol1: [
      { name: 'Next.js 15 & React 19 Platforms' },
      { name: 'Full Stack Web Engineering' },
      { name: 'Responsive & Accessible Web Design' },
      { name: 'E-Commerce (Custom & Headless)' },
      { name: 'High-Converting Landing Pages' },
      { name: 'Client & Customer Portals' },
    ],
    capabilitiesCol2: [
      { name: 'Progressive Web Apps (PWA)' },
      { name: 'Headless CMS Integration' },
      { name: 'API Development & Integration' },
      { name: 'Database Architecture (SQL/NoSQL)' },
      { name: 'Global CDN & Sub-Second Loads' },
      { name: 'SEO & Core Web Vitals (99+)' },
    ]
  },

  // 3. Ui&Ux Design and Branding
  {
    id: 'ui-ux-design-branding',
    title: 'Ui&Ux Design and Branding',
    tagline: 'Intuitive user experiences, clickable prototypes, and distinctive visual identities that inspire trust.',
    description: 'We turn complex workflows into delightful, effortless digital interfaces through thorough user research, high-fidelity Figma prototypes, and comprehensive design systems.',
    accentColor: '#0066FF',
    capabilitiesCol1: [
      { name: 'User Experience (UX) Research' },
      { name: 'Wireframing & Information Architecture' },
      { name: 'High-Fidelity UI Prototypes in Figma' },
      { name: 'Enterprise Design Systems & Tokens' },
      { name: 'Brand Identity & Visual Style Guides' },
      { name: 'Logo Design & Vector Typography' },
    ],
    capabilitiesCol2: [
      { name: 'Mobile App UI/UX (iOS & Android)' },
      { name: 'SaaS Dashboard & Portal Design' },
      { name: 'Micro-Interactions & Motion Design' },
      { name: 'Usability Testing & UX Audits' },
      { name: 'WCAG Accessibility Standards' },
      { name: 'Developer Handoff Specifications' },
    ]
  },

  // 4. Digital Marketing & Advertising
  {
    id: 'digital-marketing-advertising',
    title: 'Digital Marketing & Advertising',
    tagline: 'Targeted performance campaigns, SEO dominance, and high-converting customer acquisition funnels.',
    description: 'We build high-ROAS paid advertising engines across Meta and Google, combined with conversion rate optimization, automated lead nurturing, and technical SEO.',
    accentColor: '#0066FF',
    capabilitiesCol1: [
      { name: 'Meta & Instagram Paid Ad Campaigns' },
      { name: 'Google Search & Intent-Based Ads' },
      { name: 'Search Engine Optimization (SEO)' },
      { name: 'Conversion Rate Optimization (CRO)' },
      { name: 'High-Converting Sales Funnels' },
      { name: 'Social Media Strategy & Content' },
    ],
    capabilitiesCol2: [
      { name: 'Email & WhatsApp Drip Automations' },
      { name: 'Retargeting & Lookalike Audiences' },
      { name: 'Influencer & Creator Partnerships' },
      { name: 'YouTube Video Ad Production' },
      { name: 'Landing Page A/B Testing' },
      { name: 'Full Attribution & ROI Analytics' },
    ]
  },

  // 5. Customer Software Development
  {
    id: 'custom-software-development',
    title: 'Customer Software Development',
    tagline: 'Enterprise-grade custom software, ERPs, CRMs, and management platforms engineered for your operations.',
    description: 'We develop custom enterprise software platforms, unified ERP systems, billing portals, inventory managers, and multi-tenant SaaS products that streamline complex workflows.',
    accentColor: '#0066FF',
    capabilitiesCol1: [
      { name: 'Enterprise ERP Systems' },
      { name: 'Custom CRM Platforms' },
      { name: 'Billing & Invoice Automation Engines' },
      { name: 'Supply Chain & Inventory Management' },
      { name: 'School & University Portals' },
      { name: 'Hospital & Healthcare Software' },
    ],
    capabilitiesCol2: [
      { name: 'Hotel & Hospitality Management' },
      { name: 'Multi-Tenant SaaS Architectures' },
      { name: 'Role-Based Access Control (RBAC)' },
      { name: 'Microservices & API Integrations' },
      { name: 'Real-Time Telemetry & Reports' },
      { name: 'Legacy System Modernization' },
    ]
  },

  // 6. Automation your Business
  {
    id: 'automation-your-business',
    title: 'Automation your Business',
    tagline: 'Eliminate repetitive manual tasks, accelerate response times, and scale operations 24/7.',
    description: 'We build autonomous AI agents, WhatsApp bots, multi-app Zapier/Make pipelines, customer support auto-triaging, and automated invoice processors that run on autopilot.',
    accentColor: '#0066FF',
    capabilitiesCol1: [
      { name: 'WhatsApp Business API Automation' },
      { name: 'Autonomous AI Chatbots & Agents' },
      { name: 'CRM & Lead Sync Automations' },
      { name: 'Customer Support Auto-Triaging' },
      { name: 'Billing & Invoice Processing' },
      { name: 'Calendar & Appointment Booking Bots' },
    ],
    capabilitiesCol2: [
      { name: 'Email Sequence & Drip Automations' },
      { name: 'Business Process Automation (BPA)' },
      { name: 'Social Media Auto-Publishing' },
      { name: 'Web Scraping & Data Pipelines' },
      { name: 'Zapier, Make & n8n Workflows' },
      { name: 'Custom Predictive AI Solutions' },
    ]
  }
];

export default function ServicesCapabilitiesShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const currentService = SERVICE_CATEGORIES[activeIdx] || SERVICE_CATEGORIES[0];

  return (
    <section className={`relative w-full py-16 lg:py-24 transition-colors duration-300 ${
      isLight ? 'bg-[#FAF9F5] text-zinc-900' : 'bg-[#06080E] text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Showcase Container */}
        <div className={`relative rounded-3xl overflow-hidden border transition-all duration-300 shadow-xl ${
          isLight
            ? 'bg-white border-zinc-200/90 shadow-zinc-200/60'
            : 'bg-[#0B0F19]/90 border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]'
        }`}>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
            
            {/* ── LEFT PANEL: Services Menu List (NO NUMBERS) ── */}
            <div className={`lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r relative overflow-hidden ${
              isLight ? 'border-zinc-200/80 bg-[#FCFBF8]' : 'border-white/10 bg-[#080C14]'
            }`}>
              
              {/* Subtle Watermark on Left Background */}
              <div 
                aria-hidden
                className={`absolute bottom-6 left-6 text-2xl sm:text-3xl font-extrabold select-none pointer-events-none tracking-tight leading-[1.15] max-w-sm opacity-[0.06] font-heading ${
                  isLight ? 'text-black' : 'text-white'
                }`}
              >
                Let&apos;s make your next move count.
                <p className="text-xs sm:text-sm mt-3 font-normal opacity-70">
                  Tell us what you want to improve. We will start there.
                </p>
              </div>

              <div>
                {/* Category Header Tag without numbers */}
                <div className="inline-flex items-center gap-3 mb-6 select-none">
                  <span className="w-8 sm:w-10 h-[1.5px] bg-[#0052FF] shrink-0" />
                  <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase font-heading text-[#2EA8FF]">
                    CORE CAPABILITIES & SOLUTIONS
                  </span>
                </div>

                {/* Vertical Interactive Service Navigation (Clean, NO NUMBERS) */}
                <div className="space-y-2 relative z-10">
                  {SERVICE_CATEGORIES.map((cat, idx) => {
                    const isActive = activeIdx === idx;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveIdx(idx)}
                        className={`w-full text-left px-4 sm:px-5 py-3.5 rounded-2xl flex items-center justify-between transition-all duration-200 group cursor-pointer ${
                          isActive
                            ? isLight
                              ? 'bg-blue-50 text-[#0066FF] shadow-sm font-bold'
                              : 'bg-[#0066FF]/20 text-[#38BDF8] border border-[#0066FF]/40 font-bold shadow-[0_0_20px_rgba(0,102,255,0.25)]'
                            : isLight
                              ? 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/70 font-medium'
                              : 'text-slate-400 hover:text-white hover:bg-white/[0.04] font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isActive ? 'bg-[#0066FF] dark:bg-[#38BDF8]' : 'bg-transparent group-hover:bg-slate-500'
                          }`} />
                          
                          <span className="text-sm sm:text-[15px] tracking-tight truncate font-semibold font-heading">
                            {cat.title}
                          </span>
                        </div>

                        {/* Arrow indicator */}
                        <ArrowRight 
                          size={15} 
                          className={`transition-all duration-200 shrink-0 ${
                            isActive
                              ? 'opacity-100 translate-x-0 text-[#2EA8FF]'
                              : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-slate-400'
                          }`} 
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Quick Callout */}
              <div className="pt-8 mt-6 border-t border-zinc-200/80 dark:border-white/10 relative z-10 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Ready to explore technical specs?</span>
                <button
                  onClick={() => navigate('/client-connect')}
                  className="text-xs font-bold text-[#0066FF] dark:text-[#38BDF8] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Book Consultation</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>

            </div>

            {/* ── RIGHT PANEL: Active Service Capabilities ── */}
            <div className={`lg:col-span-7 p-6 sm:p-8 lg:p-12 flex flex-col justify-between ${
              isLight ? 'bg-white' : 'bg-[#0B0F19]'
            }`}>
              
              <div>
                {/* Active Category Header */}
                <div className="pb-6 mb-8 border-b border-zinc-200/80 dark:border-white/10">
                  <div className="inline-flex items-center gap-3 mb-3 select-none">
                    <span className="w-6 sm:w-8 h-[1.5px] bg-[#0052FF] shrink-0" />
                    <span className="text-xs font-bold tracking-[0.2em] uppercase font-heading text-[#0052FF] dark:text-[#38BDF8]">
                      SPECIALIZATION
                    </span>
                  </div>
                  <h3 className="text-[24px] sm:text-[28px] font-bold tracking-tight mb-3 text-black dark:text-white font-heading">
                    {currentService.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {currentService.tagline}
                  </p>
                </div>

                {/* 2-Column Capabilities Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Column 1 */}
                  <div className="space-y-2.5">
                    {currentService.capabilitiesCol1.map((cap, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border transition-all duration-150 flex items-center justify-between ${
                          isLight
                            ? 'bg-zinc-50 border-zinc-200/70 hover:border-[#0066FF]/40 text-zinc-900'
                            : 'bg-white/[0.02] border-white/[0.06] hover:border-[#0066FF]/40 text-slate-200'
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-semibold tracking-tight">{cap.name}</span>
                        <ArrowRight size={12} className="text-[#38BDF8] opacity-70 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-2.5">
                    {currentService.capabilitiesCol2.map((cap, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border transition-all duration-150 flex items-center justify-between ${
                          isLight
                            ? 'bg-zinc-50 border-zinc-200/70 hover:border-[#0066FF]/40 text-zinc-900'
                            : 'bg-white/[0.02] border-white/[0.06] hover:border-[#0066FF]/40 text-slate-200'
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-semibold tracking-tight">{cap.name}</span>
                        <ArrowRight size={12} className="text-[#38BDF8] opacity-70 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Banner */}
              <div className="pt-8 mt-8 border-t border-zinc-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Detailed technical architecture, timeline estimates, and case studies available.
                </p>
                <button
                  onClick={() => navigate(`/services/${currentService.id}`)}
                  className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#0052FF] to-[#0066FF] hover:from-[#0047E0] hover:to-[#005AEB] shadow-[0_4px_16px_rgba(0,102,255,0.4)] border border-[#38BDF8]/30 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <span>Explore {currentService.title}</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
