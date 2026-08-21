import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  Boxes,
  Check,
  Cloud,
  Code2,
  Database,
  Laptop,
  Layers3,
  Sparkles,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import { SERVICES } from '@/constants';
import ServiceModal from './ServiceModal';
import './premium-services.css';

type Service = (typeof SERVICES)[number];
type ServiceGroup = 'All' | 'Build' | 'Intelligence' | 'Foundation';

const groups: Record<ServiceGroup, string[]> = {
  All: SERVICES.map((service) => service.id),
  Build: ['custom-software', 'web-dev', 'mobile-dev', 'ui-ux', 'desktop-apps'],
  Intelligence: ['ai-automation', 'ai-agents', 'digital-transformation'],
  Foundation: ['cloud-solutions', 'api-dev', 'database-solutions', 'devops'],
};

const icons: Record<string, LucideIcon> = {
  'custom-software': Boxes,
  'web-dev': Code2,
  'mobile-dev': Laptop,
  'ui-ux': Sparkles,
  'ai-automation': Workflow,
  'ai-agents': Bot,
  'cloud-solutions': Cloud,
  'desktop-apps': Laptop,
  'api-dev': Layers3,
  'database-solutions': Database,
  devops: Cloud,
  'digital-transformation': Sparkles,
};

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reduceMotion ? 0 : 0.38, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function ServiceCard({ service, index, onSelect, targeted = false }: { service: Service; index: number; onSelect: () => void; targeted?: boolean }) {
  const Icon = icons[service.id] ?? Code2;
  const isFeatured = index < 2;

  return (
    <motion.button
      type="button"
      layout
      onClick={onSelect}
      className={`services-card ${isFeatured ? 'services-card--featured' : ''}${targeted ? ' services-card--targeted' : ''}`}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <span className="services-card-number">{String(index + 1).padStart(2, '0')}</span>
      <span className="services-card-icon"><Icon size={22} /></span>
      <div className="services-card-copy">
        <p>{service.id.replace(/-/g, ' ')}</p>
        <h3>{service.title}</h3>
        <span>{service.description}</span>
      </div>
      <span className="services-card-link">View service <ArrowRight size={16} /></span>
      <span className="services-card-orbit" aria-hidden="true"><i /><i /><i /></span>
    </motion.button>
  );
}

export default function PremiumServices() {
  const [activeGroup, setActiveGroup] = useState<ServiceGroup>('All');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [targetService, setTargetService] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const location = useLocation();
  const visibleServices = useMemo(
    () => SERVICES.filter((service) => groups[activeGroup].includes(service.id)),
    [activeGroup],
  );

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!hash || !SERVICES.some((service) => service.id === hash)) return;
    const group = (Object.keys(groups) as ServiceGroup[]).find((g) => g !== 'All' && groups[g].includes(hash));
    setActiveGroup(group ?? 'All');
    setTargetService(hash);
    const timer = window.setTimeout(() => {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.setTimeout(() => setTargetService(null), 3200);
      }
    }, 480);
    return () => window.clearTimeout(timer);
  }, [location.hash]);

  return (
    <main className="services-page">
      <section className="services-hero" aria-labelledby="services-title">
        <div className="services-grid-pattern" aria-hidden="true" />
        <div className="services-hero-glow services-hero-glow--one" aria-hidden="true" />
        <div className="services-hero-glow services-hero-glow--two" aria-hidden="true" />
        <div className="services-shell services-hero-layout">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.45, ease: 'easeOut' }}
          >
            <p className="services-eyebrow"><Sparkles size={14} /> Technology &amp; Digital Solutions · ATIDETO</p>
            <h1 id="services-title">Custom Software, Web, Mobile &amp; <span>AI Solutions.</span></h1>
            <p className="services-hero-copy">From enterprise custom software and responsive web applications to mobile apps and generative AI automation — ATIDETO Technologies engineers high-performing digital systems designed to solve business problems and scale operations.</p>
            <div className="services-hero-actions">
              <a href="#service-library" className="services-button services-button--primary">Explore the services <ArrowRight size={17} /></a>
              <Link to="/client-connect" className="services-button services-button--secondary">Talk to an expert</Link>
            </div>
            <div className="services-hero-proof"><span><Check size={15} /> Strategy to launch</span><span><Check size={15} /> One accountable team</span></div>
          </motion.div>

          <motion.div
            className="services-system-visual"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96, x: 24 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.1, ease: 'easeOut' }}
            aria-label="Illustration of connected product, data, cloud, and AI systems"
          >
            <div className="services-visual-grid" aria-hidden="true" />
            <div className="services-core-node"><Sparkles size={25} /><span>ATIDETO<br /><strong>systems</strong></span></div>
            <div className="services-node services-node--product"><Code2 size={20} /><span>Product</span></div>
            <div className="services-node services-node--ai"><Bot size={20} /><span>Intelligence</span></div>
            <div className="services-node services-node--cloud"><Cloud size={20} /><span>Foundation</span></div>
            <div className="services-node services-node--data"><Database size={20} /><span>Insight</span></div>
            <svg className="services-connectors" viewBox="0 0 520 400" aria-hidden="true">
              <path d="M260 200 115 105M260 200 405 105M260 200 110 300M260 200 407 300" />
              <path className="services-connectors-dash" d="M260 200 115 105M260 200 405 105M260 200 110 300M260 200 407 300" />
            </svg>
            <div className="services-visual-note"><i /><span>Designed to connect<br /><strong>without friction</strong></span></div>
          </motion.div>
        </div>

        {/* Delivery principles strip anchored at bottom of Hero */}
        <div className="services-strip" aria-label="ATIDETO delivery principles">
          <div className="services-shell services-strip-inner">
            <span>Clear strategy</span><i /><span>Thoughtful design</span><i /><span>Reliable engineering</span><i /><span>Built to scale</span>
          </div>
        </div>
      </section>

      <section id="service-library" className="services-library" aria-labelledby="service-library-title">
        <div className="services-shell">
          <Reveal className="services-library-header">
            <div><p className="services-eyebrow">Service library</p><h2 id="service-library-title">Built around the work that matters.</h2></div>
            <p>Choose a focused capability or combine them into the system your business actually needs.</p>
          </Reveal>
          <div className="services-filter" role="tablist" aria-label="Filter services">
            {(Object.keys(groups) as ServiceGroup[]).map((group) => (
              <button key={group} type="button" role="tab" aria-selected={activeGroup === group} className={activeGroup === group ? 'is-active' : ''} onClick={() => setActiveGroup(group)}>{group}</button>
            ))}
          </div>
          <motion.div layout className="services-card-grid">
            <AnimatePresence mode="popLayout">
              {visibleServices.map((service, index) => (
                <motion.div key={service.id} id={service.id} className="services-card-anchor" layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: reduceMotion ? 0 : 0.22 }}>
                  <ServiceCard service={service} index={SERVICES.indexOf(service)} onSelect={() => setSelectedService(service)} targeted={targetService === service.id} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <section className="services-path" aria-labelledby="services-path-title">
        <div className="services-shell services-path-layout">
          <Reveal><p className="services-eyebrow">One team, end to end</p><h2 id="services-path-title">What progress looks like with us.</h2></Reveal>
          <div className="services-path-steps">
            {[
              ['01', 'Clarify the opportunity', 'We uncover the actual constraint before choosing a solution.'],
              ['02', 'Make the useful thing', 'Design and engineering work in one tightly connected loop.'],
              ['03', 'Keep the momentum', 'We launch, learn, and strengthen the system as your business grows.'],
            ].map(([number, title, description], index) => (
              <Reveal className="services-path-step" delay={index * 0.06} key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="services-closing" aria-labelledby="services-closing-title">
        <div className="services-shell"><Reveal className="services-closing-card"><div className="services-closing-art" aria-hidden="true" /><div><p className="services-eyebrow">Start with a conversation</p><h2 id="services-closing-title">A stronger digital business starts with one useful next step.</h2></div><Link to="/client-connect" className="services-button services-button--light">Plan your project <ArrowRight size={17} /></Link></Reveal></div>
      </section>

      <AnimatePresence>{selectedService && <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />}</AnimatePresence>
    </main>
  );
}
