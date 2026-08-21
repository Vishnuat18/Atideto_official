import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { AnimatePresence, motion } from 'framer-motion';
import SEO from '@/components/seo/SEO';
import InternshipExplorer from '@/components/InternshipExplorer';
import { COURSES, INTERNSHIP_PROGRAMS } from '@/constants';
import academyBg from '@/assets/hero/academy.png';
import academyLightBg from '@/assets/hero/academy-light.png';
import './academy.css';

export default function Academy() {
  const [mounted, setMounted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCoursesClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const academySchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.atideto.in/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Academy",
            "item": "https://www.atideto.in/academy"
          }
        ]
      },
      ...COURSES.map(course => ({
        "@type": "Course",
        "name": course.title,
        "description": course.description,
        "provider": {
          "@type": "EducationalOrganization",
          "@id": "https://www.atideto.in/#organization",
          "name": "ATIDETO Academy",
          "url": "https://www.atideto.in/academy"
        }
      })),
      ...INTERNSHIP_PROGRAMS.map(prog => ({
        "@type": "Course",
        "name": `${prog.title} Internship`,
        "description": `Industry-aligned tech internship in ${prog.title} at ATIDETO Academy.`,
        "provider": {
          "@type": "EducationalOrganization",
          "@id": "https://www.atideto.in/#organization",
          "name": "ATIDETO Academy",
          "url": "https://www.atideto.in/academy"
        }
      }))
    ]
  };

  return (
    <div className="academy-page bg-[#F8FAFC] min-h-screen relative overflow-hidden text-[#0F172A] font-sans selection:bg-[#2F2FE4]/30">
      <SEO 
        title="IT Internships & Professional Tech Certification | ATIDETO Academy"
        description="Join ATIDETO Academy for hands-on software development internships, AI courses, real-world industry projects, verified certifications, and placement guidance in Tamil Nadu."
        url="https://www.atideto.in/academy"
        keywords="tech academy, IT internships, software engineering, learn to code, ATIDETO courses, Salem Tamil Nadu"
        schema={academySchema}
      />
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      {/* Static Background */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[#F8FAFC]" />

      {/* Hero Section with Background Image */}
      <section 
        className="academy-hero relative min-h-screen w-full px-8 lg:px-16 pt-32 pb-8 mb-12 text-center z-10 flex flex-col items-center justify-center border-b border-[#2F2FE4]/20"
        style={{
          backgroundImage: isDark
            ? `linear-gradient(to bottom, rgba(5,5,5,0.1) 0%, rgba(5,5,5,0.8) 80%, #050505 100%), url(${academyBg})`
            : `linear-gradient(to bottom, rgba(248,250,252,0.35) 0%, rgba(255,255,255,0.6) 100%), url(${academyLightBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="academy-hero-grid">
          <div className="academy-hero-copy">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="academy-eyebrow"
            >
              ATIDETO / LEARNING LAB
            </motion.div>
            <h1 className="academy-hero-title text-[#0F172A] dark:text-white drop-shadow-2xl">
              Our <span className="bg-gradient-to-r from-[#2F2FE4] to-[#2EA8FF] bg-clip-text text-transparent">Academy</span>
            </h1>
            <p className="academy-hero-copy text-[#64748B] dark:text-[#94A3B8] font-medium relative mx-auto">
              Premium industry-aligned courses designed to take you from beginner to engineering leader. Build real-world projects and launch your career.
              <AnimatePresence>
                {showToast && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute left-1/2 -translate-x-1/2 -top-16 bg-[#2F2FE4] text-white px-6 py-2 rounded-full font-medium shadow-[0_0_20px_rgba(47,47,228,0.3)] whitespace-nowrap"
                  >
                    Courses will be available soon!
                  </motion.div>
                )}
              </AnimatePresence>
            </p>

            <div className="academy-toggle mt-10 relative flex w-full max-w-[420px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-full h-[56px] overflow-hidden backdrop-blur-md">
              <div
                className="absolute top-0 left-0 h-full bg-[#2F2FE4]"
                style={{
                  width: '52%',
                  clipPath: 'polygon(0 0, 100% 0, calc(100% - 25px) 100%, 0 100%)'
                }}
              />
              <button className="flex-1 relative z-10 flex items-center justify-center text-white font-semibold text-[15px] tracking-wide">
                Internships
              </button>
              <button
                onClick={handleCoursesClick}
                className="flex-1 relative z-10 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] font-semibold text-[15px] tracking-wide transition-colors"
              >
                Courses
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="academy-hero-console"
          >
            <div className="academy-console-topline">
              <span>BUILD CYCLE</span>
              <span className="academy-console-status"><i /> LIVE PATH</span>
            </div>
            <div className="academy-console-orbit" aria-hidden="true">
              <div className="academy-orbit-ring academy-orbit-ring-one" />
              <div className="academy-orbit-ring academy-orbit-ring-two" />
              <div className="academy-orbit-core">ATD</div>
              <span className="academy-orbit-node academy-orbit-node-one">01</span>
              <span className="academy-orbit-node academy-orbit-node-two">02</span>
              <span className="academy-orbit-node academy-orbit-node-three">03</span>
            </div>
            <div className="academy-console-steps">
              <div><span>01</span><strong>Learn the system</strong><small>Foundations</small></div>
              <div><span>02</span><strong>Build the proof</strong><small>Live projects</small></div>
              <div><span>03</span><strong>Ship the signal</strong><small>Career ready</small></div>
            </div>
            <div className="academy-console-metrics">
              <div><strong>{INTERNSHIP_PROGRAMS.length}+</strong><span>paths</span></div>
              <div><strong>{COURSES.length}+</strong><span>courses</span></div>
              <div><strong>01:01</strong><span>mindset</span></div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="academy-content relative z-10 max-w-[1400px] mx-auto px-6 py-12 pb-24">
        {/* Main Content Area */}
        <InternshipExplorer />
      </div>
    </div>
  );
}
