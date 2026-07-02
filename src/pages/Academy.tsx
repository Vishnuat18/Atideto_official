import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, Award, Briefcase, Clock, CheckCircle2, ChevronRight, Layers, Sparkles, Folder, Users, BarChart2 } from 'lucide-react';
import InternshipExplorer from '@/components/InternshipExplorer';
import RibbonBackground from './about/components/RibbonBackground';

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
    <div className="bg-[#05070B] min-h-screen pt-24 relative overflow-hidden text-white font-sans selection:bg-[#3B82F6]/30">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      {/* Background Ambience */}
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

      {/* Hero Section with Ribbon Background */}
      <div className="relative w-full overflow-hidden py-12 lg:py-20 border-b border-white/5">
        <RibbonBackground />
        
        <header className="relative z-10 max-w-[1400px] mx-auto px-6 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Our <span className="text-[#00A3FF] drop-shadow-[0_0_20px_rgba(0,163,255,0.4)]">Academy</span>
          </h1>
          <p className="text-lg text-white/50 max-w-2xl leading-relaxed relative">
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
        </header>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-12 pb-24">
        {/* Main Content Area */}
        <InternshipExplorer />
      </div>
    </div>
  );
}
