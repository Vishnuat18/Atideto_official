import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  Gem,
  Layers,
  Rocket,
  Sparkles,
  Target,
  Users,
  Wrench,
} from 'lucide-react';
import SEO from '@/components/seo/SEO';
import { TEAM_MEMBERS } from '@/constants';

import heroImage from '@/assets/aboutimg/abouthero.png';
import storyImage from '@/assets/aboutimg/image.png';
import valuesDesign from '@/assets/aboutimg/aboutdesign.png';
import collabPivilis from '@/assets/collab/p.jpeg';
import collabZyrflow from '@/assets/collab/image.png';
import collabPatora from '@/assets/collab/patora-ai-logo.jpg';

const PILLARS = [
  {
    icon: Target,
    title: 'Our Mission',
    description:
      'To make dependable, well-engineered technology accessible to every growing business — turning complex problems into simple, practical solutions.',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description:
      'To be the engineering partner of choice for ambitious teams, known for products that are built right and built to last.',
  },
  {
    icon: Gem,
    title: 'Our Values',
    description:
      'Integrity, accountability and craftsmanship guide every decision we make, from the first conversation to long after launch.',
  },
];

const COLLABORATORS = [
  { name: 'Pivilis', logo: collabPivilis },
  { name: 'Zyrflow', logo: collabZyrflow },
  { name: 'Patora AI', logo: collabPatora },
];

const STATS = [
  { icon: Users, value: '15+', label: 'Team Members' },
  { icon: Layers, value: '6+', label: 'Core Domains' },
  { icon: Wrench, value: '10+', label: 'Technologies' },
  { icon: Rocket, value: '100+', label: 'Projects Delivered' },
];

const STORY_POINTS = [
  'A team of engineers, designers and problem-solvers under one roof.',
  'Practical delivery over buzzwords — every solution ships and works.',
  'Long-term partnerships built on transparency and support.',
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: 'easeOut' },
} as const;

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://atideto.in/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'About Us',
            item: 'https://atideto.in/about',
          },
        ],
      },
      ...TEAM_MEMBERS.map((member) => ({
        '@type': 'Person',
        name: member.name,
        jobTitle: member.role,
        description: member.bio,
        affiliation: {
          '@type': 'LocalBusiness',
          '@id': 'https://atideto.in/#organization',
          name: 'Atideto',
        },
        sameAs: [member.social.linkedin, member.social.github].filter(Boolean),
      })),
    ],
  };

  return (
    <div className="bg-[#05070B] min-h-screen relative overflow-hidden font-sans text-white selection:bg-[#3B82F6] selection:text-white">
      <SEO
        title="About Us | Atideto"
        description="Learn about Atideto's journey, our mission, and the expert team behind our premium software solutions."
        url="https://atideto.in/about"
        schema={aboutSchema}
      />

      <main className="relative z-10 w-full">
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden border-b border-white/5">
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 75% 20%, rgba(59,130,246,0.18), transparent 60%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(14,165,233,0.10), transparent 60%)',
            }}
          />
          <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-32 pb-20 lg:pt-40 lg:pb-28 grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
            <div>
              <motion.span
                {...fadeUp}
                className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-300"
              >
                <Sparkles className="w-3.5 h-3.5" />
                About Us
              </motion.span>

              <motion.h1
                {...fadeUp}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
                className="mt-6 font-heading text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.1] tracking-tight text-white"
              >
                Building Practical{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                  Technology Solutions
                </span>
              </motion.h1>

              <motion.p
                {...fadeUp}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-slate-300/90"
              >
                Atideto is a software engineering studio and technology academy. We partner
                with founders and teams to design, build and support digital products that
                solve real business problems — reliably, and for the long run.
              </motion.p>

              <motion.div
                {...fadeUp}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
                className="mt-9 flex flex-wrap items-center gap-4"
              >
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 rounded-full bg-[#2F6BFF] hover:bg-[#2559e0] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(47,107,255,0.9)] transition-colors"
                >
                  Explore Our Services
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/careers"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors"
                >
                  Meet Our Team
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="relative"
            >
              <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-blue-600/20 via-sky-400/10 to-transparent blur-2xl" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-2xl">
                <img
                  src={heroImage}
                  alt="Atideto team building practical technology solutions"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070B]/60 via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= OUR STORY ================= */}
        <section className="relative border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 lg:py-28 grid lg:grid-cols-2 gap-14 items-center">
            <motion.div {...fadeUp} className="order-2 lg:order-1">
              <div className="flex items-center gap-3 mb-5">
                <span className="h-[2px] w-8 bg-sky-400" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-300">
                  Our Story
                </span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-bold leading-tight text-white">
                From an Idea to a{' '}
                <span className="text-sky-400">Growing Tech Company</span>
              </h2>
              <p className="mt-6 text-slate-300/90 leading-relaxed">
                What started as a small group of engineers experimenting with ideas has grown
                into a full technology studio. Along the way we learned that the best software
                isn't the most complex — it's the software that quietly does its job, every day.
              </p>
              <p className="mt-4 text-slate-400 leading-relaxed">
                Today we build products, platforms and internal systems for teams across
                industries, while mentoring the next generation of developers through our
                academy.
              </p>

              <ul className="mt-8 space-y-3">
                {STORY_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-sky-400" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="relative order-1 lg:order-2"
            >
              <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-sky-500/15 via-blue-600/10 to-transparent blur-2xl" />
              <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 shadow-2xl">
                <img
                  src={storyImage}
                  alt="Inside the Atideto office"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= PILLARS ================= */}
        <section className="relative border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 lg:py-24">
            <div className="grid md:grid-cols-3 gap-6">
              {PILLARS.map((pillar, index) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, ease: 'easeOut', delay: index * 0.08 }}
                  className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-7 transition-colors hover:border-sky-400/40"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 ring-1 ring-inset ring-sky-400/20">
                    <pillar.icon className="w-6 h-6" />
                  </div>
                  <h3 className="mt-6 font-heading text-xl font-semibold text-white">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {pillar.description}
                  </p>
                  <div className="mt-6 h-px w-full bg-gradient-to-r from-sky-400/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= OUR VALUES ================= */}
        <section className="relative overflow-hidden border-b border-white/5 bg-[#05070B]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
            {/* Mobile: split the artwork into two readable panels */}
            <div className="grid gap-4 sm:hidden">
              <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10">
                <img
                  src={valuesDesign}
                  alt="Driven by Principles. Built for Impact. — Atideto's approach to every solution."
                  className="absolute inset-0 h-full w-full object-cover object-left"
                  loading="lazy"
                />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10">
                <img
                  src={valuesDesign}
                  alt="Atideto core values: integrity, accountability, fast delivery, long-term support, collaborative and growth."
                  className="absolute inset-0 h-full w-full object-cover object-right"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Tablet and up: full artwork */}
            <div className="hidden overflow-hidden rounded-2xl border border-white/10 shadow-[0_40px_120px_-60px_rgba(46,155,255,0.55)] sm:block">
              <img
                src={valuesDesign}
                alt="Atideto core values — driven by principles, built for impact."
                className="block h-auto w-full"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* ================= COLLABORATORS ================= */}
        <section className="relative border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 lg:py-24">
            <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-5">
                <span className="h-[2px] w-8 bg-sky-400" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-300">
                  Our Collaborators
                </span>
                <span className="h-[2px] w-8 bg-sky-400" />
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
                Stronger Together
              </h2>
              <p className="mt-4 text-slate-400 leading-relaxed">
                We work alongside partners who share our standards for quality, reliability and
                long-term thinking.
              </p>
            </motion.div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {COLLABORATORS.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition-colors hover:border-sky-400/40"
                >
                  <div className="flex h-24 w-full items-center justify-center rounded-xl bg-white p-4">
                    <img
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-200">{partner.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="relative border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 lg:py-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 sm:px-10">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center text-center border-white/10 lg:border-l lg:first:border-l-0"
                >
                  <stat.icon className="w-6 h-6 text-sky-400" />
                  <span className="mt-4 font-heading text-3xl sm:text-4xl font-bold text-white">
                    {stat.value}
                  </span>
                  <span className="mt-2 text-xs sm:text-sm text-slate-400">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="relative">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 lg:py-28">
            <motion.div
              {...fadeUp}
              className="relative overflow-hidden rounded-3xl border border-sky-400/20 bg-gradient-to-br from-[#0B1526] via-[#0A1020] to-[#05070B] px-6 py-14 sm:px-12 lg:px-16 text-center"
            >
              <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
                style={{
                  background:
                    'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(56,189,248,0.18), transparent 65%)',
                }}
              />
              <div className="relative">
                <h2 className="mx-auto max-w-2xl font-heading text-3xl sm:text-4xl lg:text-[44px] font-bold leading-tight text-white">
                  Let's Build Something{' '}
                  <span className="text-sky-400">Meaningful Together</span>
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-slate-300/90 leading-relaxed">
                  Have an idea, a bottleneck, or a product that needs a stronger foundation?
                  Let's talk about how we can help.
                </p>
                <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                  <Link
                    to="/client-connect"
                    className="inline-flex items-center gap-2 rounded-full bg-[#2F6BFF] hover:bg-[#2559e0] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(47,107,255,0.9)] transition-colors"
                  >
                    Start a Conversation
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition-colors"
                  >
                    View Our Work
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
