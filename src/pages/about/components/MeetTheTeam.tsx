import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TEAM_MEMBERS } from '@/constants';
import { ArrowLeft, Github, Linkedin, Twitter } from 'lucide-react';

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
                    <div className="text-white font-bold text-3xl font-space">{selectedMember!.experience}</div>
                    <div className="text-[#94A3B8] text-sm uppercase tracking-widest">Experience</div>
                  </div>
                </div>

                <p className="text-[#AFAFAF] text-lg leading-relaxed mb-10 relative z-10 max-w-2xl">
                  {selectedMember!.bio}
                </p>

                <div className="mb-10 relative z-10">
                  <h4 className="text-white text-sm font-bold tracking-[0.2em] uppercase mb-4 opacity-70">Core Capabilities</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedMember!.skills.map((skill) => (
                      <span key={skill} className="px-5 py-2.5 rounded-full bg-[rgba(59,130,246,0.1)] border border-[#3B82F6]/30 text-[#60A5FA] font-medium text-sm shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
                  <div className="flex gap-4">
                    {selectedMember!.social.linkedin && (
                      <a href={selectedMember!.social.linkedin} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#3B82F6] hover:border-[#3B82F6] transition-all"><Linkedin size={20} /></a>
                    )}
                    {selectedMember!.social.twitter && (
                      <a href={selectedMember!.social.twitter} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#3B82F6] hover:border-[#3B82F6] transition-all"><Twitter size={20} /></a>
                    )}
                    {selectedMember!.social.github && (
                      <a href={selectedMember!.social.github} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#3B82F6] hover:border-[#3B82F6] transition-all"><Github size={20} /></a>
                    )}
                  </div>
                  
                  <button className="px-8 py-4 rounded-full bg-white text-black font-bold tracking-wide transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    Contact {selectedMember!.name.split(' ')[0]}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
