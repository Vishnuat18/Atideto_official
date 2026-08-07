import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TEAM_MEMBERS } from '@/constants';
import { ChevronLeft, ChevronRight, Github, Linkedin, MessageCircle, Instagram, Facebook, Mail } from 'lucide-react';

export default function MeetTheTeam() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  // Mobile Carousel State
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % TEAM_MEMBERS.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + TEAM_MEMBERS.length) % TEAM_MEMBERS.length);
  const currentMember = TEAM_MEMBERS[currentIndex];

  return (
    <section className="relative py-12 px-4 md:px-8 z-20 min-h-[700px]">
      <div className="max-w-[1400px] mx-auto text-center mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-1.5 rounded-full border border-[#00C6FF]/30 bg-[#00C6FF]/10 text-[#00C6FF] text-xs font-bold tracking-[0.2em] uppercase mb-6"
        >
          The People
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl font-black text-white"
        >
          MEET THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C6FF] to-[#3B82F6]">TEAM</span>
        </motion.h2>
      </div>

      <div className="relative w-full max-w-[1200px] mx-auto min-h-[500px] flex items-center justify-center mt-12">
        <AnimatePresence mode="wait">
          <motion.div
            key="team-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            {/* Desktop View (Accordion) */}
            <div 
              className="hidden md:flex w-full h-[600px] gap-4 items-center justify-center px-4"
              onMouseLeave={() => setHoveredId(null)}
            >
              {TEAM_MEMBERS.map((member, index) => {
                const isActive = hoveredId === member.id;
                const Y_OFFSETS = [0, -40, 30, 60, -80, 90, -120];
                
                return (
                  <motion.div
                    key={member.id}
                    onMouseEnter={() => setHoveredId(member.id)}
                    className="relative overflow-hidden cursor-pointer group rounded-none h-[400px] flex-1"
                    animate={{
                      filter: isActive ? 'grayscale(0%) brightness(1.1)' : 'grayscale(100%) brightness(0.5)',
                      y: Y_OFFSETS[index] || 0
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <img 
                      src={member.image}
                      alt={member.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <motion.div className="absolute inset-0 flex flex-col items-center justify-end pb-8 text-center">
                      <h3 className="text-white font-bold text-lg md:text-xl drop-shadow-[0_0_10px_rgba(0,0,0,1)] whitespace-nowrap">
                        {member.name}
                      </h3>
                      <p className="text-[#60A5FA] text-sm mt-1 font-medium drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]">
                        {member.role}
                      </p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile View (Carousel) */}
            <div className="md:hidden relative w-full h-[450px] flex items-center justify-center px-2">
              <button 
                onClick={handlePrev} 
                className="absolute left-0 z-30 p-2 md:p-3 rounded-full bg-black/50 text-white border border-white/20 hover:bg-[#00C6FF]/20 transition-colors cursor-pointer"
              >
                <ChevronLeft size={24} />
              </button>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMember.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-[80%] h-full rounded-3xl overflow-hidden border border-[#0052FF]/30 shadow-[0_0_30px_rgba(0,82,255,0.2)]"
                >
                  <motion.img 
                    layoutId={`team-img-${currentMember.id}`}
                    src={currentMember.image} 
                    alt={currentMember.name}
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 inset-x-0 p-6 text-center pointer-events-none">
                    <h3 className="text-white font-black text-2xl drop-shadow-md mb-1">{currentMember.name}</h3>
                    <p className="text-[#00C6FF] font-bold text-sm tracking-wide uppercase drop-shadow-md">{currentMember.role}</p>
                    
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-3 bg-black/60 border border-[#0052FF]/30 backdrop-blur-md rounded-full px-4 py-2 w-fit mx-auto shadow-[0_0_20px_rgba(0,82,255,0.2)] pointer-events-auto">
                      {currentMember.social.linkedin && (
                        <a href={currentMember.social.linkedin} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 px-1 py-1 text-white/80 hover:text-white transition-colors cursor-pointer">
                          <Linkedin size={18} />
                        </a>
                      )}
                      {currentMember.social.github && (
                        <a href={currentMember.social.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 px-1 py-1 text-white/80 hover:text-white transition-colors cursor-pointer">
                          <Github size={18} />
                        </a>
                      )}
                      {currentMember.social.instagram && (
                        <a href={currentMember.social.instagram} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 px-1 py-1 text-white/80 hover:text-[#E1306C] transition-colors cursor-pointer">
                          <Instagram size={18} />
                        </a>
                      )}
                      {currentMember.social.facebook && (
                        <a href={currentMember.social.facebook} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 px-1 py-1 text-white/80 hover:text-[#1877F2] transition-colors cursor-pointer">
                          <Facebook size={18} />
                        </a>
                      )}
                      {currentMember.social.whatsapp && (
                        <a href={currentMember.social.whatsapp} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 px-1 py-1 text-white/80 hover:text-[#25D366] transition-colors cursor-pointer">
                          <MessageCircle size={18} />
                        </a>
                      )}
                      {currentMember.social.email && (
                        <a href={currentMember.social.email} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 px-1 py-1 text-white/80 hover:text-[#00A3FF] transition-colors cursor-pointer">
                          <Mail size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <button 
                onClick={handleNext} 
                className="absolute right-0 z-30 p-2 md:p-3 rounded-full bg-black/50 text-white border border-white/20 hover:bg-[#00C6FF]/20 transition-colors cursor-pointer"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
