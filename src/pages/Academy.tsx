import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import SEO from '@/components/seo/SEO';
import { motion } from 'framer-motion';
import InternshipExplorer from '@/components/InternshipExplorer';
import academyBg from '@/assets/hero/academy.png';

export default function Academy() {
  const [mounted, setMounted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCoursesClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="bg-[#05070B] min-h-screen relative overflow-hidden text-white font-sans selection:bg-[#3B82F6]/30">
      <SEO 
        title="ATIDETO Academy | Tech Internships & Courses"
        description="Join ATIDETO Academy for premium industry-aligned courses and internships. Build real-world projects and launch your tech career."
        url="https://atideto.onspace.app/academy"
        keywords="tech academy, internships, software engineering, learn to code, ATIDETO courses"
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
      <div className="absolute inset-0 z-0 pointer-events-none bg-[#050505]" />

      {/* Hero Section with Background Image */}
      <section 
        className="relative min-h-screen w-full px-8 lg:px-16 pt-32 pb-8 mb-12 text-center z-10 flex flex-col items-center justify-center border-b border-[#3B82F6]/20"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(5,5,5,0.1) 0%, rgba(5,5,5,0.8) 80%, #050505 100%), url(${academyBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white drop-shadow-2xl">
          Our <span className="text-[#3B82F6]">Academy</span>
        </h1>
        <p className="text-[#AFAFAF] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium relative">
          Premium industry-aligned courses designed to take you from beginner to engineering leader. Build real-world projects and launch your career.
          
          {/* Custom Toast */}
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute left-1/2 -translate-x-1/2 -top-16 bg-[#1EA1F2] text-white px-6 py-2 rounded-full font-medium shadow-[0_0_20px_rgba(30,161,242,0.4)] whitespace-nowrap"
              >
                Courses will be available soon!
              </motion.div>
            )}
          </AnimatePresence>
        </p>

          {/* Toggle Switch */}
          <div className="mt-10 relative flex w-full max-w-[420px] bg-white/[0.02] border border-white/5 rounded-full h-[56px] overflow-hidden backdrop-blur-md">
            <div 
              className="absolute top-0 left-0 h-full bg-[#1EA1F2]"
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
              className="flex-1 relative z-10 flex items-center justify-center text-[#8892B0] hover:text-white font-semibold text-[15px] tracking-wide transition-colors"
            >
              Courses
            </button>
          </div>
      </section>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-12 pb-24">
        {/* Main Content Area */}
        <InternshipExplorer />
      </div>
    </div>
  );
}
