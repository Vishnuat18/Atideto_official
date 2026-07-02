import { useEffect, useRef, useState } from 'react';
import { SERVICES } from '@/constants';
import { AnimatePresence } from 'framer-motion';
import ServiceCard from '@/components/services/ServiceCard';
import ServiceModal from '@/components/services/ServiceModal';
import servicesBg from '@/assets/services_hero_bg.jpeg';

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedService, setSelectedService] = useState<any>(null);

  useEffect(() => {
    // Scroll behavior is now handled natively by CSS (overflow-x-auto)
    // allowing vertical scrolling to move the page up/down and
    // horizontal scrolling (trackpad/shift+scroll) to move cards left/right.
  }, []);

  return (
    <div ref={containerRef} className="bg-[#050505] min-h-screen pt-16 relative text-[#F8FAFC] overflow-x-hidden">
      
      {/* Global Ambient Background */}
      <div className="fixed inset-0 bg-[#050505] -z-10" />
      
      <section 
        className="relative w-full px-8 lg:px-16 py-24 mb-12 text-center z-10 flex flex-col items-center justify-center border-b border-[#3B82F6]/20"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(5,5,5,0.1) 0%, rgba(5,5,5,0.5) 60%, #050505 100%), url(${servicesBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white drop-shadow-2xl">
          Our <span className="text-[#3B82F6]">Services</span>
        </h1>
        <p className="text-[#AFAFAF] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
          Innovative solutions to grow your business<br className="hidden md:block" /> with technology and creativity.
        </p>
      </section>

      {/* Horizontal Scroll Area */}
      <div 
        ref={scrollRef}
        className="flex flex-nowrap overflow-x-auto overflow-y-hidden px-8 pb-32 pt-12 gap-8 relative z-10 w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ scrollBehavior: 'smooth' }}
      >
        {SERVICES.map((service, index) => (
          <ServiceCard
            key={service.id}
            index={index}
            service={service}
            onClick={() => setSelectedService(service)}
          />
        ))}
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {selectedService && (
          <ServiceModal 
            service={selectedService} 
            onClose={() => setSelectedService(null)} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}
