import { useEffect } from 'react';
import SEO from '@/components/seo/SEO';
import ServiceHero from '@/components/services/ServiceHero';
import SolutionsGrid from '@/components/services/SolutionsGrid';
import HowWeWork from '@/components/services/HowWeWork';
import SignalCtaBanner from '@/components/services/SignalCtaBanner';
import { SOLUTIONS_DATA } from '@/constants/solutions';
export default function Services() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen font-sans selection:bg-[#00F0FF] selection:text-black overflow-x-hidden bg-black text-white">
      <SEO 
        title="Our Services & Solutions | Atideto"
        description="Innovative solutions to grow your business with technology and creativity. Explore Atideto's enterprise systems: CRM, ERP, Billing, SCM, LMS, and custom platforms."
        url="https://atideto.in/services"
        schema={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://atideto.in/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Services",
                  "item": "https://atideto.in/services"
                }
              ]
            },
            ...SOLUTIONS_DATA.map(s => ({
              "@type": "Service",
              "name": s.title,
              "description": s.subtitle,
              "provider": {
                "@type": "LocalBusiness",
                "@id": "https://atideto.in/#organization",
                "name": "Atideto"
              }
            }))
          ]
        }}
      />

      {/* ── NEW HERO SECTION (Matching Reference Design) ── */}
      <ServiceHero />

      {/* ── MAIN CONTENT (The 4 updated sections in cohesive theme) ── */}
      <main className="w-full relative z-10">
        {/* Section 1: Our Solutions (Category Filters + 17 Solutions Grid + Details Modal) */}
        <SolutionsGrid />

        {/* Section 2: How We Work (Step 01-04 Process with Blue Vertical Indicators) */}
        <HowWeWork />

        {/* Section 3: Start With The Signal (Call-to-Action Card Banner) */}
        <SignalCtaBanner />
      </main>
    </div>
  );
}
