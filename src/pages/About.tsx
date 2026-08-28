import { useEffect } from 'react';
import SEO from '@/components/seo/SEO';
import {
  generateLeadershipSchema,
  generateOrganizationSchema,
  generateBrandEntitySchema,
  generateBreadcrumbSchema,
} from '@/lib/schemaUtils';

import './about/about.css';

import HeroSection from './about/components/HeroSection';
import WhoWeServe from './about/components/WhoWeServe';
import ChallengesToChange from './about/components/ChallengesToChange';
import PrinciplesDriveUs from './about/components/PrinciplesDriveUs';
import JourneyTimeline from './about/components/JourneyTimeline';
import InsideAtideto from './about/components/InsideAtideto';
import MeetTheTeam from './about/components/MeetTheTeam';
import TechStack from './about/components/TechStack';
import VisionFuture from './about/components/VisionFuture';

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const aboutSchema = {
    "@context": "https://schema.org",
    "@graph": [
      generateBrandEntitySchema(),
      ...generateLeadershipSchema(),
      generateOrganizationSchema(),
      generateBreadcrumbSchema([
        { name: "Home", url: "https://www.atideto.in/" },
        { name: "About Us", url: "https://www.atideto.in/about" }
      ]),
      {
        "@type": "AboutPage",
        "@id": "https://www.atideto.in/about#webpage",
        "url": "https://www.atideto.in/about",
        "name": "About ATIDETO Technologies",
        "description": "Learn about ATIDETO Technologies: founded and led by CEO Vishnu R, Founder Neevas Nagil, and CPO Kiran Patil. Engineering enterprise software, AI, and digital transformation.",
        "isPartOf": { "@id": "https://www.atideto.in/#website" },
        "about": { "@id": "https://www.atideto.in/#organization" }
      }
    ]
  };

  return (
    <div className="about-page min-h-screen relative overflow-x-clip font-sans selection:bg-[var(--about-primary)] selection:text-white">
      <SEO
        title="About Us | ATIDETO Technologies – Executive Leadership & Engineering"
        description="Discover ATIDETO Technologies: led by CEO & Founder Vishnu R, Founder Neevas Nagil, and CPO Kiran Patil in Salem, Tamil Nadu. Learn about our engineering culture and business solutions."
        keywords="About ATIDETO Technologies, ATIDETO, Vishnu CEO, Vishnu R Atideto, Neevas Nagil Founder, Kiran CPO, software company Salem, executive leadership, IT solutions Tamil Nadu, India"
        url="https://www.atideto.in/about"
        author="Vishnu R, Chief Executive Officer (CEO) of ATIDETO Technologies"
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

        {/* Section 7: Meet The Team (Executive Leadership: Vishnu, Neevas, Kiran) */}
        <MeetTheTeam />

        {/* Section 8: Tech Stack */}
        <TechStack />

        {/* Section 9: Vision & Proof in the Work */}
        <VisionFuture />
      </main>
    </div>
  );
}
