import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ServiceCardProps {
  index: number;
  service: {
    id: string;
    title: string;
    description: string;
    image?: string;
  };
  onClick: () => void;
}

export default function ServiceCard({ index, service, onClick }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      layoutId={`card-${service.id}`}
      className="group relative flex-shrink-0 w-[85vw] md:w-[calc((100vw-8rem)/2)] lg:w-[calc((100vw-10rem)/4)] h-[520px] md:h-[560px] rounded-[28px] overflow-hidden bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] transition-all duration-700 ease-out hover:border-[#60A5FA]/40 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] hover:-translate-y-2 backdrop-blur-md cursor-pointer"
      style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Premium Background */}
      {service.image ? (
        <img 
          src={service.image} 
          alt={service.title} 
          className="absolute inset-0 w-full h-full object-cover z-0 transition-all duration-1000 group-hover:scale-110 opacity-50 group-hover:opacity-80" 
        />
      ) : (
        <div className="absolute inset-0 w-full h-full z-0 transition-opacity duration-1000 group-hover:opacity-100 opacity-80 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_70%)]" />
      )}

      {/* Glass Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-[#050505]/20 to-[#050505]/95 pointer-events-none z-10 transition-opacity duration-500 group-hover:opacity-90" />

      {/* Animated Glow Border */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[28px] z-10"
           style={{ boxShadow: 'inset 0 0 0 1px rgba(96,165,250,0.5), inset 0 0 20px rgba(59,130,246,0.3)' }} />

      {/* Content Container */}
      <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none z-20">
        
        {/* Top: Title */}
        <div className="transform transition-transform duration-700 group-hover:translate-x-2">
          <div className="text-[#38BDF8] text-xs font-bold tracking-[0.2em] mb-3 uppercase opacity-90 drop-shadow-md">
            {String(index + 1).padStart(2, '0')} // SERVICE
          </div>
          <h3 className="text-2xl font-bold text-white leading-tight drop-shadow-lg" >
            {service.title}
          </h3>
        </div>

        {/* Bottom: Description & CTA */}
        <div className="flex flex-col justify-end mt-auto">
          <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-700 ease-out">
            <div className="overflow-hidden">
              <p className="text-[#94A3B8] text-[15px] leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                {service.description}
              </p>
            </div>
          </div>
          <div className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] group-hover:bg-[#3B82F6] group-hover:border-[#60A5FA] text-white py-4 rounded-xl font-semibold text-sm transition-all duration-500 flex items-center justify-center gap-2 backdrop-blur-md shadow-lg pointer-events-auto">
            Explore Service
            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>
    </motion.div>
  );
}
