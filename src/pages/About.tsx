import { useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/seo/SEO';
import { TEAM_MEMBERS } from '@/constants';

import HeroSection from './about/components/HeroSection';
import OurVision from './about/components/OurVision';
import OurDNA from './about/components/OurDNA';
import OurValues from './about/components/OurValues';
import ProofInTheWork from '@/components/services/ProofInTheWork';

export default function About() {
  useEffect(() => {
    // Ensure smooth scrolling resets to top on mount
    window.scrollTo(0, 0);
  }, []);

  const aboutSchema = {
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
            "name": "About Us",
            "item": "https://atideto.in/about"
          }
        ]
      },
      ...TEAM_MEMBERS.map(member => ({
        "@type": "Person",
        "name": member.name,
        "jobTitle": member.role,
        "description": member.bio,
        "affiliation": {
          "@type": "LocalBusiness",
          "@id": "https://atideto.in/#organization",
          "name": "Atideto"
        },
        "sameAs": [
          member.social.linkedin,
          member.social.github
        ].filter(Boolean)
      }))
    ]
  };

  return (
    <div className="bg-[#05070B] min-h-screen relative overflow-hidden font-sans text-white selection:bg-[#3B82F6] selection:text-white">
      <SEO 
        title="About Us | Atideto"
        description="Learn about Atideto's journey, our mission, and the expert team behind our premium software solutions."
        url="https://atideto.in/about"
        schema={aboutSchema}
      />
      
      {/* Main Content Area */}
      <main className="relative z-10 w-full">
        <HeroSection />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent" />
        <OurVision />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent" />
        <OurDNA />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent" />
        <OurValues />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent" />
        <ProofInTheWork ctaText="Explore Our Services" ctaHref="/services" />
      </main>

    </div>
  );
}
