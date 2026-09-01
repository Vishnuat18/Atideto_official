import { useEffect } from 'react';
import SEO from '@/components/seo/SEO';
import {
  generateLeadershipSchema,
  generateOrganizationSchema,
  generateBrandEntitySchema,
  generateBreadcrumbSchema,
<<<<<<< HEAD
=======
  generateFAQSchema,
  generateLocalBusinessSchema,
>>>>>>> 9afa06a (2.3)
} from '@/lib/schemaUtils';

import './about/about.css';

import HeroSection from './about/components/HeroSection';
import WhoWeServe from './about/components/WhoWeServe';
import ChallengesToChange from './about/components/ChallengesToChange';
import PrinciplesDriveUs from './about/components/PrinciplesDriveUs';
import JourneyTimeline from './about/components/JourneyTimeline';
import InsideAtideto from './about/components/InsideAtideto';
<<<<<<< HEAD
import MeetTheTeam from './about/components/MeetTheTeam';
import TechStack from './about/components/TechStack';
=======
import TechStack from './about/components/TechStack';
import AboutSEOSection from './about/components/AboutSEOSection';
>>>>>>> 9afa06a (2.3)
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
<<<<<<< HEAD
=======
      generateLocalBusinessSchema('Salem'),
>>>>>>> 9afa06a (2.3)
      generateBreadcrumbSchema([
        { name: "Home", url: "https://www.atideto.in/" },
        { name: "About Us", url: "https://www.atideto.in/about" }
      ]),
<<<<<<< HEAD
=======
      generateFAQSchema([
        {
          question: "What enterprise software services does ATIDETO Technologies provide in Salem and globally?",
          answer: "ATIDETO Technologies is a full-spectrum software engineering and digital transformation company based in Salem, Tamil Nadu. We specialize in custom web applications, mobile apps, ERP, GST billing systems, CRM portals, supply chain management, and AI workflow automation."
        },
        {
          question: "How does ATIDETO Technologies integrate Artificial Intelligence into business software?",
          answer: "We engineer bespoke AI automation systems using LLMs, computer vision, predictive analytics, OCR invoice extraction, intelligent support agents, and dynamic anomaly detection for enterprise operations."
        },
        {
          question: "Why choose ATIDETO Technologies over off-the-shelf software packages?",
          answer: "ATIDETO builds tailored, modular software designed around your specific operating model with 100% source code ownership, zero restrictive per-user recurring fees, dedicated cloud deployment, and continuous ongoing support."
        },
        {
          question: "What is the typical development lifecycle for custom software projects?",
          answer: "Our agile sprint-driven framework delivers mid-sized software solutions in 6 to 12 weeks, with phased milestones, continuous testing, and zero disruption to daily business operations."
        },
        {
          question: "Does ATIDETO Technologies serve clients globally?",
          answer: "Yes, headquartered in Salem, Tamil Nadu, ATIDETO serves enterprise clients across India (Chennai, Bangalore, Hyderabad, Mumbai, Delhi) and internationally across North America, the UK, UAE, and Southeast Asia."
        }
      ]),
>>>>>>> 9afa06a (2.3)
      {
        "@type": "AboutPage",
        "@id": "https://www.atideto.in/about#webpage",
        "url": "https://www.atideto.in/about",
<<<<<<< HEAD
        "name": "About ATIDETO Technologies",
        "description": "Learn about ATIDETO Technologies: founded and led by CEO Vishnu R, Founder Neevas Nagil, and CPO Kiran Patil. Engineering enterprise software, AI, and digital transformation.",
        "isPartOf": { "@id": "https://www.atideto.in/#website" },
        "about": { "@id": "https://www.atideto.in/#organization" }
=======
        "name": "About ATIDETO Technologies – Enterprise Software & AI Engineering",
        "description": "Learn about ATIDETO Technologies: founded and led by CEO & Founder Vishnu R and CPO Kiran Patil. Engineering custom enterprise software, CRM, ERP, and AI systems in Salem, Tamil Nadu.",
        "isPartOf": { "@id": "https://www.atideto.in/#website" },
        "about": { "@id": "https://www.atideto.in/#organization" },
        "mainEntity": { "@id": "https://www.atideto.in/#organization" }
>>>>>>> 9afa06a (2.3)
      }
    ]
  };

  return (
    <div className="about-page min-h-screen relative overflow-x-clip font-sans selection:bg-[var(--about-primary)] selection:text-white">
      <SEO
        title="About Us | ATIDETO Technologies – Executive Leadership & Engineering"
<<<<<<< HEAD
        description="Discover ATIDETO Technologies: led by CEO & Founder Vishnu R, Founder Neevas Nagil, and CPO Kiran Patil in Salem, Tamil Nadu. Learn about our engineering culture and business solutions."
        keywords="About ATIDETO Technologies, ATIDETO, Vishnu CEO, Vishnu R Atideto, Neevas Nagil Founder, Kiran CPO, software company Salem, executive leadership, IT solutions Tamil Nadu, India"
=======
        description="Discover ATIDETO Technologies: led by CEO & Founder Vishnu R and CPO Kiran Patil in Salem, Tamil Nadu. Learn about our enterprise engineering culture, digital transformation, and business solutions."
        keywords="About ATIDETO Technologies, ATIDETO, Vishnu CEO, Vishnu R Atideto, Kiran CPO, software company Salem, custom software Salem, enterprise software Tamil Nadu, IT solutions India, CRM, ERP, AI automation"
>>>>>>> 9afa06a (2.3)
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

<<<<<<< HEAD
        {/* Section 7: Meet The Team (Executive Leadership: Vishnu, Neevas, Kiran) */}
        <MeetTheTeam />

        {/* Section 8: Tech Stack */}
        <TechStack />

=======
        {/* Section 7: Tech Stack */}
        <TechStack />

        {/* Section 8: In-Depth SEO & Semantic Knowledge (1000+ Words, Technical Architecture & FAQ) */}
        <AboutSEOSection />

>>>>>>> 9afa06a (2.3)
        {/* Section 9: Vision & Proof in the Work */}
        <VisionFuture />
      </main>
    </div>
  );
}
