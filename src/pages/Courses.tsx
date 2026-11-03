import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Bell, Mail, ArrowUpRight, Linkedin, Twitter, Facebook, Youtube } from 'lucide-react';
import { toast } from 'sonner';
import SEO from '@/components/seo/SEO';
import CursorRingField from '@/components/ui/CursorRingField';

export default function Courses() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    try {
      const existing = JSON.parse(localStorage.getItem('atideto_courses_waitlist') || '[]');
      existing.push({ email, timestamp: new Date().toISOString() });
      localStorage.setItem('atideto_courses_waitlist', JSON.stringify(existing));
    } catch {
      // fallback
    }

    setIsSubmitted(true);
    toast.success('You have been added to the priority waitlist! We will notify you first.');
  };

  return (
    <div className="min-h-screen bg-[#04050a] text-white relative flex flex-col justify-center overflow-hidden selection:bg-[#0052FF]/30">
      <SEO 
        title="Courses & Curricula — Coming Soon | Atideto Academy"
        description="Atideto Engineering Courses are launching soon. Deep-dive, production-grade curricula across Generative AI, Cloud DevOps, Full Stack Systems, and Cyber Security."
        url="https://atideto.in/courses"
        keywords="engineering courses, tech tracks coming soon, generative ai curricula, full stack, kubernetes, atideto courses"
      />

      {/* ── 1. Interactive Cursor Ring Field WebGL Background (Preserved) ── */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <CursorRingField
          background="#04050a"
          colors={["#7189ff", "#3074f9", "#0052ff", "#38bdf8", "#0b0b18"]}
          density={280}
          dotSize={32}
          speed={4.8}
          cameraDistance={180}
          ring={{ push: 32, width: 7, radius: 10, turbulence: 60 }}
          style={{ width: '100%', height: '100%' }}
        />
        {/* Subtle radial depth gradients to keep typography exceptionally crisp */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#04050a]/60 to-[#04050a]/90 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#04050a] to-transparent pointer-events-none" />
      </div>

      {/* ── 2. Hero & Coming Soon Content (Minimalist & Clean matching Reference Image) ── */}
      <main className="relative z-10 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-36 sm:pt-44 pb-24 flex-1 flex flex-col items-center justify-center text-center my-auto">
        
        {/* Top Kicker - "Hello we are" style */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg sm:text-2xl md:text-3xl font-light text-slate-300 tracking-wide font-sans mb-3 sm:mb-4"
        >
          Hello, we are
        </motion.p>

        {/* Main Title - Pure White, Massive & Impactful "Coming soon" */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-white leading-none font-heading"
        >
          Coming soon
        </motion.h1>

        {/* Description - Tailored to Engineering Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 sm:mt-8 space-y-1 sm:space-y-1.5 text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl font-normal leading-relaxed"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <p className="m-0">We are preparing something amazing and exciting for your tech career.</p>
          <p className="m-0 text-slate-400 text-xs sm:text-sm md:text-base">Special curriculum preview & priority cohort access for our subscribers only.</p>
        </motion.div>

        {/* ── 3. High-Conversion CTA & Priority Waitlist ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 sm:mt-10 w-full max-w-lg"
        >
          {!isSubmitted ? (
            <form
              onSubmit={handleWaitlistSubmit}
              className="p-2 sm:p-2.5 rounded-2xl sm:rounded-full bg-white/[0.07] border border-white/20 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col sm:flex-row items-center gap-2.5 transition-all hover:border-[#0066FF]/60"
            >
              <div className="flex items-center gap-2.5 pl-4 w-full sm:flex-1 py-1 sm:py-0">
                <Mail className="size-4 text-slate-400 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email to get notified first..."
                  required
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-full bg-gradient-to-r from-[#0052FF] to-[#0066FF] hover:from-[#0066FF] hover:to-[#38BDF8] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-[0_4px_20px_rgba(0,102,255,0.4)] flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Bell className="size-3.5" />
                <span>Notify Me First</span>
                <ArrowRight className="size-3.5" />
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 backdrop-blur-xl text-center space-y-1 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 size={16} />
                <span>You're on the Priority Waitlist!</span>
              </div>
              <p className="text-xs text-slate-300">
                We'll email <span className="font-mono text-white font-semibold">{email}</span> as soon as syllabus & batch registrations open.
              </p>
            </div>
          )}
        </motion.div>

        {/* ── 4. Social Circular Icons matching Reference Image ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 sm:mt-12 flex items-center justify-center gap-3.5"
        >
          <a
            href="https://linkedin.com/company/atideto"
            target="_blank"
            rel="noopener noreferrer"
            className="size-10 sm:size-11 rounded-full bg-white text-black hover:bg-slate-200 hover:scale-105 transition-all flex items-center justify-center shadow-md cursor-pointer"
            title="LinkedIn"
            aria-label="LinkedIn"
          >
            <Linkedin className="size-4 sm:size-5 fill-current" />
          </a>
          <a
            href="https://x.com/atideto"
            target="_blank"
            rel="noopener noreferrer"
            className="size-10 sm:size-11 rounded-full bg-white text-black hover:bg-slate-200 hover:scale-105 transition-all flex items-center justify-center shadow-md cursor-pointer"
            title="Twitter / X"
            aria-label="Twitter"
          >
            <Twitter className="size-4 sm:size-5 fill-current" />
          </a>
          <a
            href="https://facebook.com/atideto"
            target="_blank"
            rel="noopener noreferrer"
            className="size-10 sm:size-11 rounded-full bg-white text-black hover:bg-slate-200 hover:scale-105 transition-all flex items-center justify-center shadow-md cursor-pointer"
            title="Facebook"
            aria-label="Facebook"
          >
            <Facebook className="size-4 sm:size-5 fill-current" />
          </a>
          <a
            href="https://youtube.com/@atideto"
            target="_blank"
            rel="noopener noreferrer"
            className="size-10 sm:size-11 rounded-full bg-white text-black hover:bg-slate-200 hover:scale-105 transition-all flex items-center justify-center shadow-md cursor-pointer"
            title="YouTube"
            aria-label="YouTube"
          >
            <Youtube className="size-4 sm:size-5" />
          </a>
        </motion.div>

        {/* ── 5. Secondary Action Links (Upskill Internships) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-slate-400"
        >
          <Link
            to="/upskill"
            className="hover:text-white transition flex items-center gap-1.5 underline decoration-slate-600 underline-offset-4"
          >
            <span>Explore Active Upskill Internships</span>
            <ArrowUpRight className="size-3.5 text-[#38BDF8]" />
          </Link>
          <span className="text-slate-600">•</span>
          <Link
            to="/client-connect"
            className="hover:text-white transition"
          >
            <span>Talk to an Academic Advisor</span>
          </Link>
        </motion.div>

      </main>
    </div>
  );
}
