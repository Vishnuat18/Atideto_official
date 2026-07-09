import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TEAM_MEMBERS } from '@/constants';
import { ArrowLeft, ChevronLeft, ChevronRight, Github, Linkedin, Twitter, Mail, Phone, MessageCircle, Instagram, Facebook } from 'lucide-react';

export default function MeetTheTeam() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  // Mobile Carousel State
  const [currentIndex, setCurrentIndex] = useState(0);

  const selectedMember = TEAM_MEMBERS.find(m => m.id === selectedId);

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
          {!selectedId ? (
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
                      onClick={() => setSelectedId(member.id)}
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
          ) : (
            <motion.div
              key="profile"
              className="relative w-full max-w-[1200px] mx-auto z-20 mt-8 md:mt-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <button 
                onClick={() => setSelectedId(null)}
                className="absolute -top-14 md:-top-12 left-0 flex items-center gap-2 text-[#94A3B8] hover:text-white transition-colors z-50 cursor-pointer bg-black/40 md:bg-transparent px-4 py-2 md:p-0 rounded-full md:rounded-none backdrop-blur-md md:backdrop-blur-none"
              >
                <ArrowLeft size={20} /> Back to Team
              </button>

              <div className="relative w-full min-h-[550px] md:min-h-[600px] rounded-[24px] md:rounded-[32px] overflow-hidden bg-[#0A0F1C] border border-[#0052FF]/30 shadow-[0_0_50px_rgba(0,82,255,0.15)] flex flex-col p-6 md:p-12">
                
                {/* Top Tags Bar - Pill Shape */}
                <div className="-mx-6 md:-mx-12 -mt-6 md:-mt-12 w-[calc(100%+3rem)] md:w-[calc(100%+6rem)] mb-6 md:mb-8 rounded-t-[24px] md:rounded-t-[32px] border-b border-[#0052FF]/30 flex flex-wrap items-center justify-center gap-2 md:gap-6 px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[11px] text-[#00A3FF]/80 font-bold tracking-[0.1em] md:tracking-[0.2em] uppercase bg-[#0052FF]/10 shadow-inner z-20 relative">
                  <span>Innovation</span> <span className="hidden md:inline">&bull;</span> <span>Leadership</span> <span className="hidden md:inline">&bull;</span> <span>Technology</span>
                </div>

                {/* Background Shadow Text */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0">
                  <h1 className="text-[5rem] sm:text-[10rem] md:text-[13rem] font-black text-[#0052FF]/10 leading-none tracking-tighter whitespace-nowrap px-4 w-full text-center truncate">
                    {selectedMember!.role.split(' ')[0].toUpperCase()}
                  </h1>
                </div>

                {/* Central Image overlay */}
                <div className="absolute inset-x-0 bottom-0 top-32 md:top-12 flex items-end justify-center pointer-events-none z-10 md:opacity-100">
                  <img
                    src={(selectedMember as any).detailImage || selectedMember!.image}
                    className="h-full object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] max-w-full scale-110 md:scale-[1.2] origin-bottom"
                  />
                </div>

                {/* Mobile Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-[#0A0F1C]/80 to-transparent z-10 md:hidden pointer-events-none" />

                {/* Top Section */}
                <div className="relative z-20 flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left gap-4 md:gap-4 mt-4 md:mt-0">
                  {/* Left: Name & Role */}
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider mb-1 drop-shadow-[0_0_15px_rgba(0,163,255,0.4)]">
                      {selectedMember!.name}
                    </h2>
                    <p className="text-[#00C6FF] font-bold text-sm md:text-base tracking-widest uppercase drop-shadow-md">{selectedMember!.role}</p>
                  </div>
                  
                  {/* Right: Quote / Tagline (Hidden on mobile for space) */}
                  <div className="hidden md:block text-right max-w-[250px]">
                    <p className="text-white/70 text-sm md:text-base leading-relaxed drop-shadow-md font-serif italic tracking-wide">
                      "Building solutions that scale. Visuals that convert. Driving digital excellence."
                    </p>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="relative z-20 mt-auto pt-32 md:pt-64 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 md:gap-8 text-center md:text-left">
                  
                  {/* Left Side: Socials and Bio */}
                  <div className="flex flex-col items-center md:items-start gap-4 md:gap-5 max-w-2xl">
                    {/* Social Icons Pill */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 bg-black/40 md:bg-[#0A0F1C]/80 border border-[#0052FF]/30 backdrop-blur-md rounded-full px-4 py-2 w-fit shadow-[0_0_20px_rgba(0,82,255,0.2)]">
                      {selectedMember!.social.linkedin && (
                        <a href={selectedMember!.social.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-2 py-1 text-white/80 hover:text-white transition-colors cursor-pointer">
                          <Linkedin size={18} />
                        </a>
                      )}
                      {selectedMember!.social.github && (
                        <a href={selectedMember!.social.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-2 py-1 text-white/80 hover:text-white transition-colors cursor-pointer">
                          <Github size={18} />
                        </a>
                      )}
                      {selectedMember!.social.instagram && (
                        <a href={selectedMember!.social.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-2 py-1 text-white/80 hover:text-[#E1306C] transition-colors cursor-pointer">
                          <Instagram size={18} />
                        </a>
                      )}
                      {selectedMember!.social.facebook && (
                        <a href={selectedMember!.social.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-2 py-1 text-white/80 hover:text-[#1877F2] transition-colors cursor-pointer">
                          <Facebook size={18} />
                        </a>
                      )}
                      {selectedMember!.social.whatsapp && (
                        <a href={selectedMember!.social.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-2 py-1 text-white/80 hover:text-[#25D366] transition-colors cursor-pointer">
                          <MessageCircle size={18} />
                        </a>
                      )}
                      {selectedMember!.social.email && (
                        <a href={selectedMember!.social.email} className="flex items-center gap-2 px-2 py-1 text-white/80 hover:text-[#00A3FF] transition-colors cursor-pointer">
                          <Mail size={18} />
                        </a>
                      )}
                    </div>

                    {/* Bio / Role & Responsibilities */}
                    <p className="text-white/80 md:text-white/70 text-sm leading-relaxed drop-shadow-lg">
                      {selectedMember!.bio}
                    </p>
                  </div>

                  {/* Right Side: Giant Role Text (Hidden on very small screens) */}
                  <h3 className="hidden sm:block text-3xl md:text-5xl lg:text-6xl font-black text-[#0052FF]/80 md:text-[#00A3FF] uppercase tracking-tighter md:text-right leading-none drop-shadow-[0_0_20px_rgba(0,163,255,0.3)] pb-2">
                    {selectedMember!.role.split(',')[0]}
                  </h3>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
