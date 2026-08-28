import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { AnimatePresence, motion } from 'framer-motion';
import SEO from '@/components/seo/SEO';
import InternshipExplorer from '@/components/InternshipExplorer';
import { COURSES, INTERNSHIP_PROGRAMS } from '@/constants';
import { generateBrandEntitySchema, generateBreadcrumbSchema } from '@/lib/schemaUtils';
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
      generateBrandEntitySchema(),
      generateBreadcrumbSchema([
        { name: "Home", url: "https://www.atideto.in/" },
        { name: "ATIDETO Academy & Internships", url: "https://www.atideto.in/academy" }
      ]),
      {
        "@type": "EducationalOrganization",
        "@id": "https://www.atideto.in/academy#organization",
        "name": "ATIDETO Academy",
        "alternateName": ["ATIDETO Tech Training", "Atideto Internships", "Atideto Academy Salem"],
        "url": "https://www.atideto.in/academy",
        "parentOrganization": {
          "@type": "Organization",
          "@id": "https://www.atideto.in/#organization",
          "name": "ATIDETO Technologies"
        },
        "description": "ATIDETO Academy provides industry-grade tech internships, professional programming courses, and verified certifications in Tamil Nadu.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Ponnammapet",
          "addressLocality": "Salem",
          "addressRegion": "Tamil Nadu",
          "postalCode": "636001",
          "addressCountry": "IN"
        },
        "telephone": "+919087284053",
        "email": "atidetotechnologies@gmail.com"
      },
      ...COURSES.map(course => ({
        "@type": "Course",
        "name": course.title,
        "description": course.description,
        "provider": {
          "@type": "EducationalOrganization",
          "@id": "https://www.atideto.in/academy#organization",
          "name": "ATIDETO Academy",
          "url": "https://www.atideto.in/academy"
        }
      })),
      ...INTERNSHIP_PROGRAMS.map(prog => ({
        "@type": "Course",
        "name": `${prog.title} Internship Program`,
        "description": `Hands-on industry software internship in ${prog.title} at ATIDETO Academy with live project experience, mentorship, and verified certificates.`,
        "provider": {
          "@type": "EducationalOrganization",
          "@id": "https://www.atideto.in/academy#organization",
          "name": "ATIDETO Academy",
          "url": "https://www.atideto.in/academy"
        }
      }))
    ]
  };

  return (
    <div className="academy-page bg-[#F8FAFC] min-h-screen relative overflow-hidden text-[#0F172A] font-sans selection:bg-[#2F2FE4]/30">
      <SEO 
        title="IT Internships, Tech Training & Certifications | ATIDETO Academy"
        description="Join ATIDETO Academy in Salem, Tamil Nadu for professional software internships (Full Stack, Python, Java, AI, Data Science, Cloud, MERN), live production projects, and verified digital certificates."
        url="https://www.atideto.in/academy"
        keywords="ATIDETO Academy, ATIDETO internships, IT internships Salem, tech internships Tamil Nadu, software development courses, Full Stack Java internship, Python data science internship, MERN stack training Salem, college project internship Tamil Nadu, ATIDETO certificate verify"
        schema={academySchema}
      />
      <style>{`
        /* Hero visual background styles */
        .academy-hero-bg {
          position: absolute;
          inset: 0;
          background-image: url(${academyBg});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0.12;
          pointer-events: none;
        }
        :root:not(.dark) .academy-hero-bg {
          background-image: url(${academyLightBg});
          opacity: 0.25;
        }
        .academy-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.9rem;
          border-radius: 9999px;
          background: rgba(47, 47, 228, 0.08);
          border: 1px solid rgba(47, 47, 228, 0.2);
          color: #2F2FE4;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .dark .academy-pill-badge {
          background: rgba(46, 168, 255, 0.12);
          border-color: rgba(46, 168, 255, 0.3);
          color: #2EA8FF;
        }
      `}</style>

      {/* Hero Visual Background */}
      <div className="academy-hero-bg" aria-hidden="true" />

      {/* Main Internship Explorer & Programs */}
      <main className="relative z-10">
        <InternshipExplorer />
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white border border-slate-700 shadow-2xl flex items-center gap-3 text-sm font-semibold"
          >
            <span>Course admissions are currently open! Check the internship programs above.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
