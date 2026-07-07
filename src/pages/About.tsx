import { useEffect } from 'react';
import { motion } from 'framer-motion';

import HeroSection from './about/components/HeroSection';
import CompanyStory from './about/components/CompanyStory';
import MeetTheTeam from './about/components/MeetTheTeam';
import TechStack from './about/components/TechStack';
import CallToAction from './about/components/CallToAction';

export default function About() {
  useEffect(() => {
    // Ensure smooth scrolling resets to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#05070B] min-h-screen relative overflow-hidden font-sans text-white selection:bg-[#3B82F6] selection:text-white">
      
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
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent" />
        <CallToAction />
      </main>

    </div>
  );
}
