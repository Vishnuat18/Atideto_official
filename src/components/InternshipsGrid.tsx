import { useState, useRef, MouseEvent } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { INTERNSHIP_PROGRAMS, INTERNSHIP_CATEGORIES } from '@/constants';
import { ArrowRight, Sparkles } from 'lucide-react';

const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative ${className || ''}`}
    >
      {children}
    </motion.div>
  );
};

export default function InternshipsGrid() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredInternships = activeCategory === 'All'
    ? INTERNSHIP_PROGRAMS
    : INTERNSHIP_PROGRAMS.filter(p => p.category === activeCategory);

  return (
    <div className="w-full relative z-10 text-[#0F172A] font-sans">
      
      {/* Background Animated Beams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ x: [-100, 100, -100], opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#2F2FE4] rounded-full blur-[150px]"
        />
        <motion.div 
          animate={{ y: [-50, 50, -50], opacity: [0.02, 0.06, 0.02] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#6366F1] rounded-full blur-[150px]"
        />
      </div>

      <div className="relative z-10 pt-16">
        {/* Premium Header */}
        <div className="text-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] mb-6 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#2F2FE4]" />
              <span className="text-sm font-medium text-[#334155]">Career Launcher</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Internship <span className="text-[#2F2FE4] drop-shadow-[0_0_20px_rgba(47,47,228,0.25)]">Programs</span>
            </h2>
            <p className="text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
              Build Industry-Ready Skills Through Hands-on Training, Live Projects & Expert Mentorship.
            </p>
          </motion.div>
        </div>

        {/* Animated Filter Chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {INTERNSHIP_CATEGORIES.map((cat, idx) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-md relative overflow-hidden ${
                activeCategory === cat
                  ? 'text-[#2F2FE4] shadow-[0_0_15px_rgba(47,47,228,0.12)] border border-[#2F2FE4]/50'
                  : 'text-[#475569] bg-[#F8FAFC] border border-[#EEF2F7] hover:border-[#CBD5E1] hover:text-[#2F2FE4]'
              }`}
            >
              {activeCategory === cat && (
                <motion.div 
                  layoutId="activeFilterBg" 
                  className="absolute inset-0 bg-[#2F2FE4]/10 z-0" 
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </motion.button>
          ))}
        </div>

        {/* 3-Column Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1400px] mx-auto px-6 mb-24"
        >
          <AnimatePresence mode="popLayout">
            {filteredInternships.map((internship, index) => (
              <motion.div
                layout
                key={internship.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.4 }}
              >
                <TiltCard className="h-full">
                  <motion.div 
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 6 + (index % 3), repeat: Infinity, ease: "easeInOut" }}
                    className="group relative h-full flex flex-col bg-[#F8FAFC] backdrop-blur-xl border border-[#E2E8F0] hover:border-[#2F2FE4]/30 rounded-[24px] p-8 overflow-hidden transition-all duration-500"
                  >
                    {/* Subtle Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2F2FE4]/0 to-[#2F2FE4]/0 group-hover:from-[#2F2FE4]/5 group-hover:to-transparent transition-all duration-500 rounded-[24px]" />
                    
                    <div className="relative z-10 flex flex-col h-full">
                      {/* Header: Icon & Duration */}
                      <div className="flex justify-between items-start mb-6">
                        <div className="text-4xl filter drop-shadow-[0_0_10px_rgba(47,47,228,0.15)]">
                          {internship.icon}
                        </div>
                        <div className="px-3 py-1 bg-[#2F2FE4]/10 border border-[#2F2FE4]/20 rounded-full shadow-[0_0_15px_rgba(47,47,228,0.15)]">
                          <span className="text-[#2F2FE4] text-xs font-bold tracking-wide">
                            {internship.duration}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl font-bold text-[#0F172A] mb-3 group-hover:text-[#2F2FE4] transition-colors duration-300">
                        {internship.title}
                      </h3>
                      <p className="text-[#475569] text-sm leading-relaxed mb-8 flex-1">
                        {internship.description}
                      </p>

                      {/* Skill Chips */}
                      <div className="flex flex-wrap gap-2 mb-8">
                        {internship.skills.map(skill => (
                          <span 
                            key={skill} 
                            className="px-3 py-1 bg-[#F1F5F9] border border-[#E2E8F0] rounded-md text-[11px] font-medium text-[#475569]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center text-[#2F2FE4] font-semibold text-sm group-hover:gap-2 transition-all duration-300">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                  </motion.div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Premium CTA Section */}
        <div className="relative max-w-[1200px] mx-auto px-6 pb-24">
          {/* Glow behind CTA */}
          <div className="absolute inset-0 bg-[#2F2FE4]/5 blur-[100px] rounded-[40px] pointer-events-none" />
          
          <div className="relative bg-white border border-[#E2E8F0] backdrop-blur-2xl rounded-[32px] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#2F2FE4]/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            
            <div className="md:w-2/3 mb-10 md:mb-0 relative z-10 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-bold text-[#0F172A] mb-6 leading-tight">
                Ready to Launch Your Career?
              </h2>
              <p className="text-lg text-[#475569] leading-relaxed max-w-2xl">
                Join Atideto Academy and gain real-world experience through industry-focused internships, live projects, mentorship, certificates, and placement support.
              </p>
            </div>
            
            <div className="md:w-1/3 flex flex-col sm:flex-row md:flex-col gap-4 relative z-10">
              <button 
                onClick={() => {
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="w-full px-8 py-4 bg-[#2F2FE4] hover:bg-[#4F46E5] text-white font-bold rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(47,47,228,0.25)] hover:shadow-[0_0_40px_rgba(47,47,228,0.4)] hover:-translate-y-1 cursor-pointer"
              >
                Apply Now
              </button>
              <button className="w-full px-8 py-4 bg-transparent border border-[#CBD5E1] hover:border-[#2F2FE4] hover:bg-[#F1F5F9] text-[#0F172A] font-semibold rounded-full transition-all duration-300">
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
