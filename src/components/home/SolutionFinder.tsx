import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  Boxes,
  Cloud,
  Code2,
  Database,
  Layers3,
  Monitor,
  Rocket,
  Smartphone,
  Sparkles,
  Wand2,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

type SolutionItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const TOP_ROW: SolutionItem[] = [
  { id: 'custom-software', label: 'Custom Software', icon: Boxes },
  { id: 'web-dev', label: 'Web Development', icon: Code2 },
  { id: 'mobile-dev', label: 'Mobile Apps', icon: Smartphone },
  { id: 'ui-ux', label: 'UI / UX Design', icon: Sparkles },
  { id: 'ai-automation', label: 'AI Automation', icon: Workflow },
  { id: 'ai-agents', label: 'AI Agents', icon: Bot },
];

const BOTTOM_ROW: SolutionItem[] = [
  { id: 'cloud-solutions', label: 'Cloud Solutions', icon: Cloud },
  { id: 'desktop-apps', label: 'Desktop Applications', icon: Monitor },
  { id: 'api-dev', label: 'API Development', icon: Layers3 },
  { id: 'database-solutions', label: 'Database Solutions', icon: Database },
  { id: 'devops', label: 'DevOps & Deployment', icon: Rocket },
  { id: 'digital-transformation', label: 'Digital Transformation', icon: Wand2 },
];

function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function Pill({ item, hidden = false }: { item: SolutionItem; hidden?: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      to={`/services#${item.id}`}
      className="home-solution-pill"
      tabIndex={hidden ? -1 : undefined}
      aria-hidden={hidden || undefined}
    >
      <span className="home-solution-pill-icon"><Icon size={16} /></span>
      <span className="home-solution-pill-label">{item.label}</span>
      <ArrowRight className="home-solution-pill-arrow" size={14} />
    </Link>
  );
}

export default function SolutionFinder() {
  const reduceMotion = useReducedMotion();
  const topItems = reduceMotion ? TOP_ROW : [...TOP_ROW, ...TOP_ROW, ...TOP_ROW, ...TOP_ROW];
  const bottomItems = reduceMotion ? BOTTOM_ROW : [...BOTTOM_ROW, ...BOTTOM_ROW, ...BOTTOM_ROW, ...BOTTOM_ROW];

  return (
    <section className="home-section home-solution" aria-labelledby="solution-title">
      <div className="home-solution-glow" aria-hidden="true" />
      <div className="home-solution-grid" aria-hidden="true" />

      {/* Header & Primary CTA Block */}
      <div className="home-shell home-solution-header">
        <Reveal>
          <p className="home-eyebrow">WHAT CAN WE SOLVE FOR YOU?</p>
          <h2 id="solution-title">
            Your Next Challenge<br />
            <span>Has a Digital Solution.</span>
          </h2>
          <p className="home-solution-sub">
            Build what’s missing. Automate what’s slowing you down. Modernize what’s holding you back. Find the right technology to move your business forward.
          </p>
          <div className="home-solution-cta-wrapper">
            <Link to="/services" className="home-solution-primary-cta">
              <span>Explore Our Solutions</span>
              <ArrowRight size={18} className="home-solution-cta-icon" />
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Top marquee train track (LTR) */}
      <div className="home-solution-track home-solution-track--ltr" aria-label="Build and intelligence solutions">
        <div className="home-solution-rail">
          {topItems.map((item, index) => (
            <Pill key={`${item.id}-${index}`} item={item} hidden={index >= TOP_ROW.length} />
          ))}
        </div>
      </div>

      {/* Bottom marquee train track (RTL) */}
      <div className="home-solution-track home-solution-track--rtl" aria-label="Cloud, data and transformation solutions">
        <div className="home-solution-rail">
          {bottomItems.map((item, index) => (
            <Pill key={`${item.id}-${index}`} item={item} hidden={index >= BOTTOM_ROW.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
