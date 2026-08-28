import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

interface ServiceCardProps {
  index: number;
  service: {
    id: string;
    title: string;
    description: string;
    image?: string;
    imageLight?: string;
  };
  onClick: () => void;
}

export default function ServiceCard({ index, service, onClick }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <motion.div 
      layoutId={`card-${service.id}`}
      className="group relative flex-shrink-0 w-[85vw] md:w-[calc((100vw-8rem)/2)] lg:w-[calc((100vw-10rem)/4)] h-[min(560px,calc(100svh-6rem))] rounded-[28px] overflow-hidden bg-white border border-[#E2E8F0] transition-all duration-700 ease-out hover:border-[#A5B4FC] hover:shadow-[0_10px_40px_rgba(47,47,228,0.12)] hover:-translate-y-2 backdrop-blur-md cursor-pointer"
      style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Premium Background */}
      {service.image ? (
        <img 
          src={isDark ? service.image : (service.imageLight || service.image)} 
          alt={service.title} 
          className="absolute inset-0 w-full h-full object-cover z-0 transition-all duration-1000 group-hover:scale-110 opacity-40 group-hover:opacity-60" 
        />
      ) : (
        <div className="absolute inset-0 w-full h-full z-0 transition-opacity duration-1000 group-hover:opacity-100 opacity-80 bg-[radial-gradient(ellipse_at_top_right,rgba(47,47,228,0.08),transparent_70%)]" />
      )}

      {/* Overlay for Text Readability */}
      <div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500 group-hover:opacity-90"
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(to bottom, rgba(5,5,5,0.6) 0%, rgba(5,5,5,0.2) 50%, rgba(5,5,5,0.95) 100%)'
            : 'linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,1) 100%)'
        }}
      />

      {/* Animated Glow Border */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[28px] z-10"
           style={{ boxShadow: 'inset 0 0 0 1px rgba(165,180,252,0.8), inset 0 0 20px rgba(47,47,228,0.15)' }} />

      {/* Content Container */}
      <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none z-20">
        
        {/* Top: Title */}
        <div className="transform transition-transform duration-700 group-hover:translate-x-2">
          <div className="text-[#2F2FE4] text-xs font-bold tracking-[0.2em] mb-3 uppercase opacity-90">
            {String(index + 1).padStart(2, '0')} // SERVICE
          </div>
          <h3 className="text-2xl font-bold text-[#0F172A] leading-tight">
            {service.title}
          </h3>
        </div>

        {/* Bottom: Description & CTA */}
        <div className="flex flex-col justify-end mt-auto">
          <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-700 ease-out">
            <div className="overflow-hidden">
              <p className="text-[#475569] text-[15px] leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                {service.description}
              </p>
            </div>
          </div>
          <div className="w-full bg-[#2F2FE4] border border-transparent group-hover:bg-[#4F46E5] text-white py-4 rounded-xl font-semibold text-sm transition-all duration-500 flex items-center justify-center gap-2 shadow-lg pointer-events-auto">
            Explore Service
            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>
    </motion.div>
  );
}
