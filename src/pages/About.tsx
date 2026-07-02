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
    <div className="bg-[#05070B] min-h-screen pt-16 relative overflow-hidden font-sans text-white selection:bg-[#3B82F6] selection:text-white">
      
      {/* Background Ambience (Same as Academy/Home) */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[#02040A]">
        {/* Deep Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }} />
        
        {/* Moving Gradient Beams */}
        <motion.div 
          animate={{ x: [-200, 200, -200], opacity: [0.02, 0.05, 0.02] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] left-[-10%] w-[50%] h-[30%] bg-[#00A3FF] rounded-full blur-[150px] rotate-45"
        />
        <motion.div 
          animate={{ x: [200, -200, 200], opacity: [0.02, 0.04, 0.02] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[20%] right-[-10%] w-[50%] h-[30%] bg-[#8B5CF6] rounded-full blur-[150px] -rotate-45"
        />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '64px 64px' }}
        />
      </div>

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
