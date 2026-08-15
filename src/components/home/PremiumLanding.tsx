import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  Braces,
  Layers3,
  LineChart,
  Orbit,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
import './premium-landing.css';
import ServicesSection from './ServicesSection';
import SolutionFinder from './SolutionFinder';

const outcomes = [
  { value: '250+', label: 'projects delivered' },
  { value: '98%', label: 'client satisfaction' },
  { value: '15+', label: 'countries served' },
  { value: '2K+', label: 'students trained' },
];

const process = [
  ['01', 'Find the signal', 'We clarify the business goal, the people it serves, and the one outcome worth optimizing first.'],
  ['02', 'Shape the system', 'We turn the opportunity into a practical product plan, visual language, and delivery roadmap.'],
  ['03', 'Build in momentum', 'Small, visible releases keep decisions grounded and give your team a useful product sooner.'],
  ['04', 'Scale what works', 'After launch, we improve the experience, automation, and architecture with real usage in view.'],
];

const technologies = ['React', 'TypeScript', 'Python', 'AWS', 'Node.js', 'Figma', 'PostgreSQL', 'Docker'];

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0 : 0.42, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export default function PremiumLanding() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-grid-pattern" aria-hidden="true" />
        <div className="home-hero-orb home-hero-orb--primary" aria-hidden="true" />
        <div className="home-hero-orb home-hero-orb--secondary" aria-hidden="true" />

        <div className="home-shell home-hero-layout">
          <div className="home-hero-copy">
            <motion.p
              className="home-eyebrow"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.42, delay: 0, ease: 'easeOut' }}
            >
              <Sparkles size={14} /> Digital solutions for ambitious businesses
            </motion.p>
            <motion.h1
              id="home-title"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.42, delay: 0.06, ease: 'easeOut' }}
            >
              Your Business Has <em>Problems</em>.<br />
              We Build the <span>Technology</span><br />
              <span>to Solve Them.</span>
            </motion.h1>
            <motion.p
              className="home-hero-description"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.42, delay: 0.12, ease: 'easeOut' }}
            >
              From websites and mobile apps to AI automation, cloud solutions, and custom software — we turn real business challenges into simple, scalable digital solutions.
            </motion.p>
            <motion.div
              className="home-actions"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.42, delay: 0.18, ease: 'easeOut' }}
            >
              <Link to="/client-connect" className="home-button home-button--primary">Solve a Problem <ArrowRight size={17} /></Link>
              <Link to="/services" className="home-button home-button--secondary">Explore Our Solutions</Link>
            </motion.div>
            <motion.div
              className="home-hero-capabilities"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.42, delay: 0.24, ease: 'easeOut' }}
            >
              <span>Custom Software</span><i aria-hidden="true">•</i>
              <span>AI Automation</span><i aria-hidden="true">•</i>
              <span>Web &amp; Mobile</span><i aria-hidden="true">•</i>
              <span>Cloud</span><i aria-hidden="true">•</i>
              <span>Digital Transformation</span>
            </motion.div>
          </div>

          <motion.div
            className="home-product-window"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96, x: 24 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.1, ease: 'easeOut' }}
            aria-label="Illustration of an ATIDETO project workspace"
          >
            <div className="home-window-topbar">
              <div className="home-window-dots" aria-hidden="true"><i /><i /><i /></div>
              <div className="home-window-search">atideto / project signal</div>
              <span className="home-live-dot"><i /> Live</span>
            </div>
            <div className="home-product-content">
              <aside className="home-product-rail" aria-hidden="true">
                <span className="home-rail-mark"><Orbit size={19} /></span>
                <span className="home-rail-item home-rail-item--active"><Layers3 size={17} /></span>
                <span className="home-rail-item"><LineChart size={17} /></span>
                <span className="home-rail-item"><Workflow size={17} /></span>
                <span className="home-rail-item"><ShieldCheck size={17} /></span>
              </aside>
              <div className="home-product-main">
                <div className="home-product-heading">
                  <div><span>Delivery overview</span><strong>Building with purpose</strong></div>
                  <button type="button" className="home-icon-button" aria-label="Open project options"><Braces size={17} /></button>
                </div>
                <div className="home-metric-grid">
                  <div className="home-metric-card"><span>Velocity</span><strong>+42%</strong><em>this sprint</em></div>
                  <div className="home-metric-card"><span>Automation</span><strong>18h</strong><em>saved weekly</em></div>
                  <div className="home-metric-card home-metric-card--chart">
                    <div><span>Experience score</span><strong>92</strong></div>
                    <svg viewBox="0 0 150 44" role="img" aria-label="An upward-trending project score chart"><path d="M2 36C16 36 17 24 31 26S49 14 62 20s18-9 34-9 22-9 34-7 13-5 18-5" /></svg>
                  </div>
                </div>
                <div className="home-activity-card">
                  <div className="home-activity-heading"><span>Release pulse</span><small>Updated now</small></div>
                  <div className="home-activity-row"><i className="home-status home-status--done" /><span>Architecture ready</span><b>Completed</b></div>
                  <div className="home-activity-row"><i className="home-status home-status--active" /><span>Experience system</span><b>In progress</b></div>
                  <div className="home-activity-row"><i className="home-status" /><span>Smart workflows</span><b>Queued</b></div>
                </div>
              </div>
            </div>
            <div className="home-float-note home-float-note--top"><Bot size={16} /><span>AI workflow<br /><strong>connected</strong></span></div>
            <div className="home-float-note home-float-note--bottom"><span className="home-avatar-stack"><i>A</i><i>T</i><i>+</i></span><span>Teams move<br /><strong>better together</strong></span></div>
          </motion.div>
        </div>

        {/* Fluent across your stack section — anchored at bottom of Hero */}
        <div className="home-trust-rail" aria-label="Technology expertise">
          <div className="home-shell home-trust-inner">
            <span className="home-trust-label">Fluent across your stack</span>
            <div className="home-marquee" tabIndex={0} aria-label="React, TypeScript, Python, AWS, Node.js, Figma, PostgreSQL, and Docker">
              <div className="home-marquee-track">{[...technologies, ...technologies].map((technology, index) => <span className="home-tech-chip" key={`${technology}-${index}`}>{technology}</span>)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Discovery section */}
      <SolutionFinder />

      <section className="home-section home-outcomes" aria-labelledby="outcomes-title">
        <div className="home-shell home-outcomes-layout">
          <Reveal className="home-outcomes-copy">
            <p className="home-eyebrow">Proof in the work</p>
            <h2 id="outcomes-title">Big enough to deliver.<br />Close enough to care.</h2>
            <p>We bring a focused senior team to every engagement, so the work stays accountable, collaborative, and moving forward.</p>
            <Link to="/about" className="home-text-link">Meet ATIDETO <ArrowRight size={16} /></Link>
          </Reveal>
          <Reveal className="home-outcome-grid" delay={0.08}>
            {outcomes.map((outcome) => <div className="home-outcome" key={outcome.label}><strong>{outcome.value}</strong><span>{outcome.label}</span></div>)}
          </Reveal>
        </div>
      </section>

      <section className="home-section home-process" aria-labelledby="process-title">
        <div className="home-shell">
          <Reveal className="home-process-heading"><p className="home-eyebrow">How we work</p><h2 id="process-title">A clear path from good idea to useful reality.</h2></Reveal>
          <div className="home-process-list">
            {process.map(([number, title, description], index) => (
              <Reveal className="home-process-step" delay={index * 0.05} key={number}>
                <span className="home-process-number">{number}</span><div><h3>{title}</h3><p>{description}</p></div><span className="home-process-line" aria-hidden="true" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-closing" aria-labelledby="closing-title">
        <div className="home-shell"><Reveal className="home-closing-card"><div className="home-closing-glow" aria-hidden="true" /><div><p className="home-eyebrow">Start with the signal</p><h2 id="closing-title">You have the ambition.<br /><span>Let’s build the advantage.</span></h2></div><div className="home-closing-action"><p>Tell us where you’re headed. We’ll help define the fastest, most valuable way forward.</p><Link to="/client-connect" className="home-button home-button--light">Talk to our team <ArrowRight size={17} /></Link></div></Reveal></div>
      </section>
    </main>
  );
}
