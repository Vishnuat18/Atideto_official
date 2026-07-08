import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TEAM_MEMBERS } from '@/constants';
import { ArrowLeft, Github, Linkedin, Twitter, Mail, Phone, MessageCircle, Instagram, Facebook } from 'lucide-react';

export default function MeetTheTeam() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const selectedMember = TEAM_MEMBERS.find(m => m.id === selectedId);

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

      <div className="relative w-full max-w-[1200px] mx-auto min-h-[600px] flex items-center justify-center mt-12">
        <AnimatePresence mode="wait">
          {!selectedId ? (
            <motion.div
              key="accordion"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-full h-[600px] gap-4 items-center justify-center px-4"
              onMouseLeave={() => setHoveredId(null)}
            >
              {TEAM_MEMBERS.map((member, index) => {
                const isActive = hoveredId === member.id;
                
                // Exact staggered offsets matching the user's sketch
                const Y_OFFSETS = [0, -40, 30, 60, -80, 90, -120];
                
                return (
                  <motion.div
                    key={member.id}
                    layoutId={`team-card-${member.id}`}
                    onMouseEnter={() => setHoveredId(member.id)}
                    onClick={() => setSelectedId(member.id)}
                    className="relative overflow-hidden cursor-pointer group rounded-none h-[400px] flex-1"
                    animate={{
                      filter: isActive ? 'grayscale(0%) brightness(1.1)' : 'grayscale(100%) brightness(0.5)',
                      y: Y_OFFSETS[index] || 0
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <motion.img 
                      layoutId={`team-img-${member.id}`}
                      src={member.image}
                      alt={member.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    
                    {/* Dark gradient for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <motion.div 
                      className="absolute inset-0 flex flex-col items-center justify-end pb-8 text-center"
                    >
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
            </motion.div>
          ) : (
            <motion.div
              key="profile"
              className="absolute inset-0 flex flex-col lg:flex-row items-stretch gap-8 max-w-[1200px] mx-auto w-full z-50"
            >
              {/* Selected Profile View */}
              <motion.div 
                className="lg:w-[400px] flex-shrink-0 flex flex-col gap-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <button 
                  onClick={() => setSelectedId(null)}
                  className="flex items-center gap-2 text-[#94A3B8] hover:text-white transition-colors"
                >
                  <ArrowLeft size={20} /> Back to Team
                </button>

                <motion.div 
                  layoutId={`team-card-${selectedId}`}
                  className="w-full h-[500px] rounded-[32px] overflow-hidden relative shadow-[0_0_40px_rgba(59,130,246,0.3)] border border-white/10"
                >
                  <div className="absolute inset-0 bg-[#3B82F6] opacity-20 blur-3xl z-0 mix-blend-screen" />
                  <motion.img 
                    layoutId={`team-img-${selectedId}`}
                    src={selectedMember!.image} 
                    className="w-full h-full object-cover relative z-10"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040608] via-transparent to-transparent z-10" />
                </motion.div>
              </motion.div>

              {/* Profile Details Container */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-1 bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-white/5 rounded-[32px] p-10 flex flex-col relative overflow-hidden"
              >
                {/* Decorative particle background */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#00C6FF]/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-2">{selectedMember!.name}</h2>
                    <h3 className="text-2xl text-[#60A5FA] font-medium">{selectedMember!.role}</h3>
                  </div>
                  <div className="text-right hidden sm:block">
                  </div>
                </div>

                <p className="text-[#AFAFAF] text-lg leading-relaxed mb-10 relative z-10 max-w-2xl">
                  {selectedMember!.bio}
                </p>

                <div className="mt-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
                  <div className="flex flex-wrap gap-4">
                    {selectedMember!.social.email && (
                      <a href={selectedMember!.social.email} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#EA4335] hover:border-[#EA4335] transition-all"><Mail size={20} /></a>
                    )}
                    {selectedMember!.social.phone && (
                      <a href={selectedMember!.social.phone} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#34A853] hover:border-[#34A853] transition-all"><Phone size={20} /></a>
                    )}
                    {selectedMember!.social.whatsapp && (
                      <a href={selectedMember!.social.whatsapp} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#25D366] hover:border-[#25D366] transition-all"><MessageCircle size={20} /></a>
                    )}
                    {selectedMember!.social.linkedin && (
                      <a href={selectedMember!.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] transition-all"><Linkedin size={20} /></a>
                    )}
                    {selectedMember!.social.github && (
                      <a href={selectedMember!.social.github} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#333333] hover:border-[#333333] transition-all"><Github size={20} /></a>
                    )}
                    {selectedMember!.social.twitter && (
                      <a href={selectedMember!.social.twitter} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#1DA1F2] hover:border-[#1DA1F2] transition-all"><Twitter size={20} /></a>
                    )}
                    {selectedMember!.social.instagram && (
                      <a href={selectedMember!.social.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent transition-all"><Instagram size={20} /></a>
                    )}
                    {selectedMember!.social.facebook && (
                      <a href={selectedMember!.social.facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#1877F2] hover:border-[#1877F2] transition-all"><Facebook size={20} /></a>
                    )}
                  </div>
                  
                  {selectedMember!.social.email && (
                    <a href={selectedMember!.social.email} className="px-8 py-4 rounded-full bg-white text-black font-bold tracking-wide transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)] whitespace-nowrap inline-flex items-center justify-center">
                      Contact {selectedMember!.name.split(' ')[0]}
                    </a>
                  )}
                  {!selectedMember!.social.email && selectedMember!.social.phone && (
                    <a href={selectedMember!.social.phone} className="px-8 py-4 rounded-full bg-white text-black font-bold tracking-wide transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)] whitespace-nowrap inline-flex items-center justify-center">
                      Contact {selectedMember!.name.split(' ')[0]}
                    </a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
