import { useEffect } from 'react';
import SEO from '@/components/seo/SEO';
import { TEAM_MEMBERS } from '@/constants';

import './about/about.css';

import HeroSection from './about/components/HeroSection';
import WhoWeServe from './about/components/WhoWeServe';
import ChallengesToChange from './about/components/ChallengesToChange';
import PrinciplesDriveUs from './about/components/PrinciplesDriveUs';
import JourneyTimeline from './about/components/JourneyTimeline';
import InsideAtideto from './about/components/InsideAtideto';
import TechStack from './about/components/TechStack';
import VisionFuture from './about/components/VisionFuture';

export default function About() {
  useEffect(() => {
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
            "item": "https://www.atideto.in/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "About Us",
            "item": "https://www.atideto.in/about"
          }
        ]
      },
      ...TEAM_MEMBERS.map(member => ({
        "@type": "Person",
        "name": member.name,
        "jobTitle": member.role,
        "description": member.bio,
        "affiliation": {
          "@type": "Organization",
          "@id": "https://www.atideto.in/#organization",
          "name": "ATIDETO Technologies"
        },
        "sameAs": [
          member.social.linkedin,
          member.social.github
        ].filter(Boolean)
      }))
    ]
  };

  return (
    <div className="about-page min-h-screen relative overflow-x-clip font-sans selection:bg-[var(--about-primary)] selection:text-white">
      <SEO
        title="About Us | ATIDETO Technologies - Software & AI Innovation"
        description="Discover ATIDETO Technologies: our vision, leadership team, engineering culture, and commitment to delivering transformative software and AI solutions from Salem, Tamil Nadu."
        url="https://www.atideto.in/about"
        schema={aboutSchema}
      />

      <main className="relative z-10 w-full">
        {/* Section 1: Hero */}
        <HeroSection />

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--about-primary)]/30 to-transparent" />

        {/* Section 2: Who We Serve */}
        <WhoWeServe />

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--about-primary)]/30 to-transparent" />

        {/* Section 3: Challenges to Change */}
        <ChallengesToChange />

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--about-primary)]/30 to-transparent" />

        {/* Section 4: Principles */}
        <PrinciplesDriveUs />

        {/* Section 5: Timeline */}
        <JourneyTimeline />

        {/* Section 6: Inside Atideto */}
        <InsideAtideto />

        {/* Section 7: Tech Stack */}
        <TechStack />

        {/* Section 8: Vision & Proof in the Work */}
        <VisionFuture />
      </main>
    </div>
  );
}
