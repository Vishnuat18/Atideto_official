import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlurFade } from '@/components/ui/blur-fade';
import { 
  Building2, Cpu, ShieldCheck, Database, Globe2, 
  CheckCircle2, ChevronDown, Sparkles, Layers,
  Server, ArrowRight, Zap, Code2, LineChart
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQ {
  q: string;
  a: string;
}

const FAQS: FAQ[] = [
  {
    q: 'What enterprise software services does ATIDETO Technologies provide in Salem and globally?',
    a: 'ATIDETO Technologies is a full-spectrum software engineering and digital transformation company based in Salem, Tamil Nadu. We specialize in developing custom enterprise web applications, mobile applications for Android and iOS, scalable ERP systems, GST-compliant billing software, customer relationship management (CRM) portals, supply chain management systems, learning management platforms (LMS), and intelligent AI workflow automation pipelines. Our solutions are architected for seamless multi-tenant scalability, real-time data sync, and high security compliance.'
  },
  {
    q: 'How does ATIDETO Technologies integrate Artificial Intelligence into business software?',
    a: 'We engineer bespoke AI automation systems using state-of-the-art Large Language Models (LLMs), computer vision, predictive analytics, and autonomous agent workflows. Our AI capabilities include automated document and invoice extraction via OCR, intelligent customer support chatbots, sales pipeline forecasting, automated inventory restocking recommendations, dynamic anomaly detection in financial transactions, and natural language business intelligence reporting for executive leadership.'
  },
  {
    q: 'Why should businesses choose ATIDETO over off-the-shelf software packages?',
    a: 'Off-the-shelf software packages force your business into rigid workflows with recurring per-seat licensing fees and limited customization. ATIDETO builds tailored, modular software designed around your specific operating model, supply chain, and regulatory requirements. Our clients receive 100% source code ownership, zero restrictive per-user recurring fees, dedicated on-premise or cloud hosting deployment, custom third-party API integrations, and continuous ongoing support.'
  },
  {
    q: 'What is the standard development lifecycle and timeline for custom ERP or CRM projects?',
    a: 'Our engineering process follows an agile sprint-driven framework divided into discovery & architecture design (weeks 1-2), iterative development & UI/UX prototyping (weeks 3-8), integration & security testing (weeks 9-10), and cloud deployment with staff training (weeks 11-12). Typical mid-size business solutions launch within 6 to 12 weeks, while enterprise multi-module ERP systems are deployed in phased milestone releases to ensure zero disruption to ongoing daily operations.'
  },
  {
    q: 'Does ATIDETO Technologies support clients outside Salem and Tamil Nadu?',
    a: 'Yes, ATIDETO Technologies operates as a global technology partner. While our primary engineering headquarters and innovation center are located in Salem, Tamil Nadu, our distributed cloud-first operations serve enterprises, growing startups, and educational institutions across Chennai, Coimbatore, Bangalore, Hyderabad, Mumbai, Delhi, and internationally across North America, the United Kingdom, the Middle East (UAE), and Southeast Asia.'
  },
  {
    q: 'What cloud security and compliance protocols does ATIDETO implement?',
    a: 'Security is embedded into every layer of our software architecture. We enforce end-to-end TLS 1.3 encryption, AES-256 data encryption at rest, role-based access control (RBAC), multi-factor authentication (MFA), automated database snapshots with disaster recovery failover, API rate limiting, OWASP Top 10 mitigation, and architectural compliance aligned with SOC 2, GDPR, and Indian Digital Personal Data Protection (DPDP) standards.'
  }
];

export default function AboutSEOSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="relative py-24 md:py-32 px-6 lg:px-16 overflow-hidden border-t border-[var(--about-border)] bg-[var(--about-bg)]">
      {/* Background Decorative Glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[var(--about-primary)]/5 blur-[140px]" />

      <div className="max-w-[1300px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <BlurFade delay={0} inView>
            <span className="about-eyebrow">Enterprise Overview & Technical Authority</span>
          </BlurFade>
          <BlurFade delay={0.1} inView>
            <h2 className="about-section-title mt-3">
              Engineering Digital Excellence:{' '}
              <span className="about-heading-grad">The ATIDETO Advantage</span>
            </h2>
          </BlurFade>
          <BlurFade delay={0.2} inView>
            <p className="text-[var(--about-muted)] text-base md:text-lg leading-relaxed mt-4">
              Explore how ATIDETO Technologies combines enterprise-grade system architecture, custom software development, and artificial intelligence to drive digital transformation for modern organizations across India and international markets.
            </p>
          </BlurFade>
        </div>

        {/* 4 Deep-Dive Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Pillar 1: Architecture & Engineering */}
          <BlurFade delay={0.1} inView>
            <div className="about-card p-8 md:p-10 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="about-icon-chip h-12 w-12 text-[var(--about-primary)]">
                    <Server className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--about-primary)]">System Architecture</span>
                    <h3 className="text-xl font-bold text-[var(--about-text)]">Enterprise Scalability & Clean Code</h3>
                  </div>
                </div>
                <p className="text-sm text-[var(--about-muted)] leading-relaxed mb-4">
                  At ATIDETO Technologies, our engineering principles are rooted in high-performance computing, clean domain-driven architecture, and zero-compromise security. We build enterprise applications using distributed microservices and optimized monolithic frameworks capable of handling high transaction throughput, concurrent multi-user load, and automated elasticity.
                </p>
                <p className="text-sm text-[var(--about-muted)] leading-relaxed">
                  Every software build utilizes battle-tested technologies including React, TypeScript, Node.js, Next.js, Python, PostgreSQL, MongoDB, Redis caching layers, and Docker/Kubernetes container orchestration. We design clean RESTful and GraphQL APIs with comprehensive documentation, automated Swagger specifications, and micro-frontend modularity that allows rapid feature expansion without system regressions.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-[var(--about-border)] flex flex-wrap gap-2 text-xs font-medium text-[var(--about-text)]">
                <span className="px-3 py-1 rounded-full bg-[var(--about-surface)] border border-[var(--about-border)]">99.99% Availability</span>
                <span className="px-3 py-1 rounded-full bg-[var(--about-surface)] border border-[var(--about-border)]">Sub-100ms Latency</span>
                <span className="px-3 py-1 rounded-full bg-[var(--about-surface)] border border-[var(--about-border)]">Multi-Tenant Isolation</span>
              </div>
            </div>
          </BlurFade>

          {/* Pillar 2: 17 Business Solutions Suite */}
          <BlurFade delay={0.15} inView>
            <div className="about-card p-8 md:p-10 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="about-icon-chip h-12 w-12 text-[var(--about-cyan)]">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--about-cyan)]">Business Solutions</span>
                    <h3 className="text-xl font-bold text-[var(--about-text)]">17 Integrated Industry Platforms</h3>
                  </div>
                </div>
                <p className="text-sm text-[var(--about-muted)] leading-relaxed mb-4">
                  Modern organizations require unified systems that break data silos between sales, inventory, finance, logistics, and human resources. ATIDETO delivers 17 specialized software systems designed to run turnkey or deeply customized to your organization's precise operating requirements.
                </p>
                <p className="text-sm text-[var(--about-muted)] leading-relaxed">
                  Our suite includes Custom CRM, Invoicing & GST Billing Engines, Full Enterprise Resource Planning (ERP), Barcode & RFID Inventory Management, Multi-Campus School ERP, Hotel Reservation Systems, Gym Membership & Biometric Access Management, Library Management, Fleet GPS Transport Management, Supply Chain SCM, LMS Portals, SMS Student Management, OCR Expense Tracking, Omnichannel E-Commerce, API Management, Chit Fund Platforms, and Real-Time Appointment Booking Systems.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-[var(--about-border)] flex flex-wrap gap-2 text-xs font-medium text-[var(--about-text)]">
                <span className="px-3 py-1 rounded-full bg-[var(--about-surface)] border border-[var(--about-border)]">17+ Vertical Solutions</span>
                <span className="px-3 py-1 rounded-full bg-[var(--about-surface)] border border-[var(--about-border)]">GST Invoicing Engine</span>
                <span className="px-3 py-1 rounded-full bg-[var(--about-surface)] border border-[var(--about-border)]">Real-Time Telemetry</span>
              </div>
            </div>
          </BlurFade>

          {/* Pillar 3: AI Systems & Autonomous Workflows */}
          <BlurFade delay={0.2} inView>
            <div className="about-card p-8 md:p-10 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="about-icon-chip h-12 w-12 text-[var(--about-primary)]">
                    <Cpu className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--about-primary)]">Artificial Intelligence</span>
                    <h3 className="text-xl font-bold text-[var(--about-text)]">Next-Gen AI Automation & Agentic Pipelines</h3>
                  </div>
                </div>
                <p className="text-sm text-[var(--about-muted)] leading-relaxed mb-4">
                  Artificial intelligence is transforming business from passive software tracking into active, predictive automation. ATIDETO Technologies develops bespoke AI agents and machine learning models that integrate directly into your core business applications to remove operational bottlenecks and eliminate repetitive manual data entry.
                </p>
                <p className="text-sm text-[var(--about-muted)] leading-relaxed">
                  We deploy automated optical character recognition (OCR) pipelines that extract and reconcile invoices in seconds, intelligent customer support agents trained on proprietary enterprise knowledge bases, predictive demand forecasting for supply chain inventory, and automated decision-making engines for credit approvals, student grading, and appointment routing.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-[var(--about-border)] flex flex-wrap gap-2 text-xs font-medium text-[var(--about-text)]">
                <span className="px-3 py-1 rounded-full bg-[var(--about-surface)] border border-[var(--about-border)]">LLM & GenAI Agents</span>
                <span className="px-3 py-1 rounded-full bg-[var(--about-surface)] border border-[var(--about-border)]">Automated OCR Extraction</span>
                <span className="px-3 py-1 rounded-full bg-[var(--about-surface)] border border-[var(--about-border)]">Predictive Analytics</span>
              </div>
            </div>
          </BlurFade>

          {/* Pillar 4: Salem Tech Hub & Global Delivery */}
          <BlurFade delay={0.25} inView>
            <div className="about-card p-8 md:p-10 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="about-icon-chip h-12 w-12 text-[var(--about-cyan)]">
                    <Globe2 className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--about-cyan)]">Global Delivery Model</span>
                    <h3 className="text-xl font-bold text-[var(--about-text)]">Salem's Premier Software Innovation Hub</h3>
                  </div>
                </div>
                <p className="text-sm text-[var(--about-muted)] leading-relaxed mb-4">
                  Headquartered in Salem, Tamil Nadu, ATIDETO Technologies represents the forefront of regional software engineering excellence. We combine the cost advantages and intense engineering dedication of a tier-2 tech hub with tier-1 global software craftsmanship and high-touch executive communication.
                </p>
                <p className="text-sm text-[var(--about-muted)] leading-relaxed">
                  Our cross-functional teams engineer end-to-end software solutions for enterprise clients across Tamil Nadu (Salem, Chennai, Coimbatore, Madurai, Erode, Tirupur, Trichy) and worldwide. With strict SLA compliance, 24/7 server monitoring, structured sprint updates, and direct founder-level architecture oversight, our clients enjoy unmatched agility and project transparency.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-[var(--about-border)] flex flex-wrap gap-2 text-xs font-medium text-[var(--about-text)]">
                <span className="px-3 py-1 rounded-full bg-[var(--about-surface)] border border-[var(--about-border)]">Salem, Tamil Nadu HQ</span>
                <span className="px-3 py-1 rounded-full bg-[var(--about-surface)] border border-[var(--about-border)]">Worldwide Delivery</span>
                <span className="px-3 py-1 rounded-full bg-[var(--about-surface)] border border-[var(--about-border)]">Direct Architect Support</span>
              </div>
            </div>
          </BlurFade>
        </div>

        {/* Detailed Solutions Knowledge Matrix */}
        <div className="about-card p-8 md:p-12 mb-20">
          <BlurFade delay={0.1} inView>
            <div className="max-w-3xl mb-8">
              <span className="about-eyebrow">Complete Software Portfolio</span>
              <h3 className="text-2xl md:text-3xl font-bold text-[var(--about-text)] mt-2">
                Turnkey & Custom Solutions for Every Business Vertical
              </h3>
              <p className="text-sm text-[var(--about-muted)] mt-3 leading-relaxed">
                Whether you run an educational institution, manufacturing factory, healthcare clinic, retail chain, or logistics fleet, ATIDETO engineers robust software tailored to your specific workflow.
              </p>
            </div>
          </BlurFade>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="text-base font-bold text-[var(--about-text)] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--about-primary)]" />
                Enterprise Operations
              </h4>
              <ul className="space-y-2 text-xs text-[var(--about-muted)] leading-relaxed">
                <li><strong className="text-[var(--about-text)]">ERP Systems:</strong> Multi-branch financials, payroll, procurement, and asset auditing.</li>
                <li><strong className="text-[var(--about-text)]">Billing & GST:</strong> Fast POS checkout, automated GST calculation, e-way bills, and PDF invoice generation.</li>
                <li><strong className="text-[var(--about-text)]">CRM Portals:</strong> Lead capture, deal pipelines, customer communication history, and automated WhatsApp triggers.</li>
                <li><strong className="text-[var(--about-text)]">Expense Management:</strong> Optical receipt scanning, employee reimbursement approvals, and budget tracking.</li>
                <li><strong className="text-[var(--about-text)]">Chit Fund Software:</strong> Group management, live bidding auctions, dividend calculations, and passbooks.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-base font-bold text-[var(--about-text)] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--about-primary)]" />
                Education & Healthcare
              </h4>
              <ul className="space-y-2 text-xs text-[var(--about-muted)] leading-relaxed">
                <li><strong className="text-[var(--about-text)]">School & College ERP:</strong> Student admissions, fees collections, timetable generation, and exams.</li>
                <li><strong className="text-[var(--about-text)]">SMS Management:</strong> Complete student academic records, attendance biometric sync, and report cards.</li>
                <li><strong className="text-[var(--about-text)]">LMS Platforms:</strong> Video lecture hosting, online quizzes, certificates, and student progress dashboards.</li>
                <li><strong className="text-[var(--about-text)]">Appointment Booking:</strong> Real-time calendar booking for doctors, consultants, clinics, and service professionals.</li>
                <li><strong className="text-[var(--about-text)]">Gym Management:</strong> Member subscriptions, trainer schedules, biometric check-in, and renewal reminders.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-base font-bold text-[var(--about-text)] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--about-primary)]" />
                Supply Chain & Retail
              </h4>
              <ul className="space-y-2 text-xs text-[var(--about-muted)] leading-relaxed">
                <li><strong className="text-[var(--about-text)]">Inventory Systems:</strong> Real-time stock levels, multi-warehouse transfers, and low-stock alerts.</li>
                <li><strong className="text-[var(--about-text)]">Transport Logistics:</strong> Vehicle GPS tracking, driver dispatch, route fuel optimization, and trip logs.</li>
                <li><strong className="text-[var(--about-text)]">SCM Portals:</strong> Vendor bidding, purchase order workflows, and shipment tracking.</li>
                <li><strong className="text-[var(--about-text)]">Hotel Systems:</strong> Room inventory, guest reservations, housekeeping schedules, and restaurant billing.</li>
                <li><strong className="text-[var(--about-text)]">E-Commerce & APIs:</strong> High-speed headless storefronts, payment gateways, and API developer portals.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Interactive FAQ Accordion Section for SEO Rich Snippets */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <BlurFade delay={0} inView>
              <span className="about-eyebrow">Frequently Asked Questions</span>
            </BlurFade>
            <BlurFade delay={0.1} inView>
              <h3 className="text-2xl md:text-3xl font-bold text-[var(--about-text)] mt-2">
                Everything You Need to Know About Partnering with ATIDETO
              </h3>
            </BlurFade>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <BlurFade key={index} delay={0.05 * index} inView>
                  <div className="about-card transition-all duration-200 overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span className="text-base md:text-lg font-bold text-[var(--about-text)]">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-[var(--about-primary)] transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          <div className="px-6 pb-6 pt-0 text-sm text-[var(--about-muted)] leading-relaxed border-t border-[var(--about-border)]/60 mt-1 pt-4">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </BlurFade>
              );
            })}
          </div>

          {/* Bottom Consultation Callout */}
          <div className="text-center mt-12">
            <Link
              to="/client-connect"
              className="inline-flex items-center gap-2 text-sm font-bold text-[var(--about-primary)] hover:text-[var(--about-cyan)] transition-colors"
            >
              Have specific architecture requirements? Discuss your project with our engineering team
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
