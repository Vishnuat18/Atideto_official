import { useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/seo/SEO';
import { TEAM_MEMBERS } from '@/constants';

import HeroSection from './about/components/HeroSection';
import CompanyStory from './about/components/CompanyStory';
import MeetTheTeam from './about/components/MeetTheTeam';
import TechStack from './about/components/TechStack';

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
          "name": "ATIDETO"
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
        title="About Us | ATIDETO"
        description="Learn about ATIDETO's journey, our mission, and the expert team behind our premium software solutions."
        url="https://atideto.in/about"
        schema={aboutSchema}
      />
      
      {/* Removed Background Ambience as requested */}

      {/* Main Content Area */}
      <main className="relative z-10 w-full">
        <HeroSection />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent" />
        <CompanyStory />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent" />
        <MeetTheTeam />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent" />
        <TechStack />

      </main>

    </div>
  );
}
