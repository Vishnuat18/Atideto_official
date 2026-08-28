import { useState, useId, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Headphones,
  Puzzle,
  UserCheck,
  Truck,
  ShieldCheck,
  TrendingUp,
  SlidersHorizontal,
  Target,
  Sparkles,
  Phone,
  Globe,
  Mail,
  MapPin,
  X,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import {
  BUSINESS_SOLUTIONS,
  OFFICIAL_CONTACT_INFO,
  type BusinessSolution,
} from '@/data/businessSolutions';
import './business-solutions.css';

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reduceMotion ? 0 : 0.4, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export default function BusinessSolutionsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSolution, setActiveSolution] = useState<BusinessSolution | null>(null);
  const reduceMotion = useReducedMotion();
  const searchInputId = useId();

  const categories = [
    'All',
    'Enterprise',
    'Operations',
    'Finance',
    'Education',
    'Hospitality & Services',
    'Commerce & Tech',
  ];

  const filteredSolutions = selectedCategory === 'All'
    ? BUSINESS_SOLUTIONS
    : BUSINESS_SOLUTIONS.filter((s) => s.category === selectedCategory);

  return (
    <section id="business-solutions" className="biz-solutions-section" aria-labelledby="biz-solutions-title">
      <div className="biz-ambient-glow" aria-hidden="true" />
      <div className="biz-ambient-glow-left" aria-hidden="true" />

      <div className="biz-container">
        {/* Top Hero Grid */}
        <div className="biz-hero-grid">
          <div>
            <Reveal>
              <span className="biz-eyebrow">
                <Sparkles size={13} /> BUSINESS SOLUTIONS
              </span>
            </Reveal>

            <Reveal delay={0.06}>
              <h2 id="biz-solutions-title" className="biz-hero-title">
                Smarter Systems. <br />
                <span className="highlight">Stronger</span> Business.
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="biz-hero-sub">
                Comprehensive business solution systems to streamline operations, boost productivity, and drive your business forward.
              </p>
            </Reveal>

            {/* 4 Value Proposition Badges */}
            <Reveal delay={0.18}>
              <div className="biz-value-props">
                <div className="biz-value-badge">
                  <span className="biz-value-icon"><SlidersHorizontal size={15} /></span>
                  <span>Streamline Operations</span>
                </div>
                <div className="biz-value-badge">
                  <span className="biz-value-icon"><TrendingUp size={15} /></span>
                  <span>Improve Efficiency</span>
                </div>
                <div className="biz-value-badge">
                  <span className="biz-value-icon"><Target size={15} /></span>
                  <span>Drive Growth</span>
                </div>
                <div className="biz-value-badge">
                  <span className="biz-value-icon"><ShieldCheck size={15} /></span>
                  <span>Reliable &amp; Secure</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Interactive Hero Visual Showcase Card */}
          <Reveal delay={0.15}>
            <div className="biz-hero-visual">
              <div className="biz-visual-header">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--biz-primary)]">System Architecture</span>
                  <h4 className="text-sm font-bold text-[var(--biz-text)]">Live Enterprise Platform</h4>
                </div>
                <span className="biz-visual-tag">Operational</span>
              </div>

              <div className="biz-metric-row">
                <div className="biz-metric-box">
                  <div className="biz-metric-val">17+</div>
                  <div className="biz-metric-lbl">Solutions</div>
                </div>
                <div className="biz-metric-box">
                  <div className="biz-metric-val">99.9%</div>
                  <div className="biz-metric-lbl">Uptime SLA</div>
                </div>
                <div className="biz-metric-box">
                  <div className="biz-metric-val">3x</div>
                  <div className="biz-metric-lbl">Efficiency</div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[var(--biz-muted)]">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--biz-primary-soft)]">
                  <span className="font-semibold text-[var(--biz-text)]">Cloud &amp; Mobile Ready</span>
                  <span className="text-[var(--biz-primary)] font-bold">100% Scalable</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-[var(--biz-card-border)]">
                  <span>Custom Workflows &amp; API Integrations</span>
                  <span className="text-emerald-500 font-bold">Enabled</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Section Divider: OUR SOLUTIONS */}
        <div className="biz-divider" aria-hidden="true">
          <div className="biz-divider-line" />
          <span className="biz-divider-title">OUR SOLUTIONS</span>
          <div className="biz-divider-line" />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[var(--biz-primary)] text-white shadow-md shadow-blue-500/20'
                  : 'bg-[var(--biz-card-bg)] text-[var(--biz-muted)] border border-[var(--biz-card-border)] hover:text-[var(--biz-primary)] hover:border-blue-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* The 17 Business Solutions Grid */}
        <div className="biz-solutions-grid">
          {filteredSolutions.map((sol, index) => {
            const Icon = sol.icon;
            // Special span classes for balanced layout on large screens if needed
            const isChitFund = sol.id === 'chit-fund-management';
            const isAppointment = sol.id === 'appointment-booking';
            const spanClass = isChitFund || isAppointment ? 'biz-card-span-2' : '';

            return (
              <motion.div
                key={sol.id}
                layout
                initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.3) }}
                className={spanClass}
              >
                <div
                  className="biz-card"
                  onClick={() => setActiveSolution(sol)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setActiveSolution(sol)}
                  aria-label={`View details for ${sol.name}`}
                >
                  <div className="biz-card-icon-wrap">
                    <Icon size={26} strokeWidth={1.75} />
                  </div>
                  <h3 className="biz-card-title">{sol.name}</h3>
                  <p className="biz-card-desc">{sol.tagline}</p>
                  <span className="biz-card-action">
                    Explore Solution <ArrowRight size={13} />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Card: Let's Build Solutions That Work for You */}
        <Reveal delay={0.1}>
          <div className="biz-cta-card">
            <div className="biz-cta-left">
              <div className="biz-cta-headphone">
                <Headphones size={28} />
              </div>
              <div>
                <h3 className="biz-cta-title">Let's Build Solutions That Work for You.</h3>
                <p className="biz-cta-sub">Tell us your needs. We'll handle the rest.</p>
              </div>
            </div>

            <div className="biz-cta-pillars">
              <div className="biz-pillar-item">
                <div className="biz-pillar-icon"><Puzzle size={18} /></div>
                <span className="biz-pillar-lbl">Custom Solutions</span>
              </div>
              <div className="biz-pillar-item">
                <div className="biz-pillar-icon"><UserCheck size={18} /></div>
                <span className="biz-pillar-lbl">Expert Team</span>
              </div>
              <div className="biz-pillar-item">
                <div className="biz-pillar-icon"><Truck size={18} /></div>
                <span className="biz-pillar-lbl">On-time Delivery</span>
              </div>
              <div className="biz-pillar-item">
                <div className="biz-pillar-icon"><ShieldCheck size={18} /></div>
                <span className="biz-pillar-lbl">Dedicated Support</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Official Contact Info Bar */}
        <Reveal delay={0.15}>
          <div className="biz-contact-bar">
            {/* Phone */}
            <div className="biz-contact-item">
              <div className="biz-contact-icon">
                <Phone size={18} />
              </div>
              <div>
                <div className="biz-contact-lbl">Phone</div>
                <div className="biz-contact-val">
                  <a href={`tel:${OFFICIAL_CONTACT_INFO.phones[0].replace(/\s+/g, '')}`}>{OFFICIAL_CONTACT_INFO.phones[0]}</a>
                  <br />
                  <a href={`tel:${OFFICIAL_CONTACT_INFO.phones[1].replace(/\s+/g, '')}`}>{OFFICIAL_CONTACT_INFO.phones[1]}</a>
                </div>
              </div>
            </div>

            {/* Website */}
            <div className="biz-contact-item">
              <div className="biz-contact-icon">
                <Globe size={18} />
              </div>
              <div>
                <div className="biz-contact-lbl">Website</div>
                <div className="biz-contact-val">
                  <a href={OFFICIAL_CONTACT_INFO.website} target="_blank" rel="noopener noreferrer">
                    {OFFICIAL_CONTACT_INFO.displayWebsite}
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="biz-contact-item">
              <div className="biz-contact-icon">
                <Mail size={18} />
              </div>
              <div>
                <div className="biz-contact-lbl">Email</div>
                <div className="biz-contact-val">
                  <a href={`mailto:${OFFICIAL_CONTACT_INFO.email}`} className="break-all">
                    {OFFICIAL_CONTACT_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="biz-contact-item">
              <div className="biz-contact-icon">
                <MapPin size={18} />
              </div>
              <div>
                <div className="biz-contact-lbl">Location</div>
                <div className="biz-contact-val">
                  <span>{OFFICIAL_CONTACT_INFO.location.fullAddress}</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Tagline */}
        <div className="biz-brand-tagline">
          {OFFICIAL_CONTACT_INFO.tagline}
        </div>
      </div>

      {/* Interactive Solution Modal */}
      <AnimatePresence>
        {activeSolution && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="biz-modal-overlay"
            onClick={() => setActiveSolution(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="biz-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="biz-modal-close"
                onClick={() => setActiveSolution(null)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="biz-card-icon-wrap !mb-0 !w-12 !h-12">
                  <activeSolution.icon size={24} />
                </div>
                <div>
                  <span className="text-[11px] font-bold tracking-widest text-[var(--biz-primary)] uppercase">
                    {activeSolution.category}
                  </span>
                  <h3 className="text-xl font-black text-[var(--biz-text)]">{activeSolution.name}</h3>
                </div>
              </div>

              <p className="text-sm text-[var(--biz-muted)] leading-relaxed mb-6">
                {activeSolution.description}
              </p>

              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--biz-text)] mb-3 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-[var(--biz-primary)]" /> Key Capabilities
                </h4>
                <ul className="space-y-2">
                  {activeSolution.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-[var(--biz-text)] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--biz-primary)] mt-1.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6 p-3.5 rounded-xl bg-[var(--biz-primary-soft)] border border-blue-200/50 dark:border-blue-900/40">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--biz-primary)] mb-2">
                  Business Impact
                </h4>
                <ul className="space-y-1.5">
                  {activeSolution.benefits.map((benefit, i) => (
                    <li key={i} className="text-xs text-[var(--biz-text)] font-semibold flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  to={`/client-connect?solution=${encodeURIComponent(activeSolution.name)}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--biz-primary)] text-white text-sm font-bold shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-colors"
                >
                  Deploy {activeSolution.shortName} <ArrowRight size={15} />
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveSolution(null)}
                  className="px-5 py-3 rounded-xl border border-[var(--biz-card-border)] text-xs font-bold text-[var(--biz-muted)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
