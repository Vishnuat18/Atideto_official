import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { NAV_ITEMS } from '@/constants';
import atidetoLogo from '@/assets/atideto-logo.png';

export default function PullMenu() {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const controls = useAnimation();
  const [isOpen, setIsOpen] = useState(false);
  const MENU_HEIGHT = 120; // Concise height for single row

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // scrolling down
      } else {
        setIsVisible(true); // scrolling up
      }
      
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Initialize closed
    controls.set({ y: -MENU_HEIGHT });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controls, lastScrollY]);

  const handleDragEnd = (e: any, info: any) => {
    const threshold = MENU_HEIGHT / 3;
    if (!isOpen && (info.offset.y > threshold || info.velocity.y > 200)) {
      controls.start({ y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } });
      setIsOpen(true);
    } else if (isOpen && (info.offset.y < -threshold || info.velocity.y < -200)) {
      controls.start({ y: -MENU_HEIGHT, transition: { type: 'spring', stiffness: 200, damping: 20 } });
      setIsOpen(false);
    } else {
      controls.start({ y: isOpen ? 0 : -MENU_HEIGHT, transition: { type: 'spring', stiffness: 300, damping: 25 } });
    }
  };

  const toggleMenu = () => {
    if (isOpen) {
      controls.start({ y: -MENU_HEIGHT, transition: { type: 'spring', stiffness: 200, damping: 20 } });
      setIsOpen(false);
    } else {
      controls.start({ y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } });
      setIsOpen(true);
    }
  };

  return (
    <>
      {/* Draggable Pull-Chain Menu */}
      <motion.div
        drag="y"
        dragConstraints={{ top: -MENU_HEIGHT, bottom: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={controls}
        initial={{ y: -MENU_HEIGHT }}
        className="fixed top-0 left-0 right-0 z-50 flex flex-col items-end pointer-events-none"
      >
        {/* Menu Body */}
        <div 
          className="w-full bg-[#050505]/95 backdrop-blur-3xl border-b border-[#3B82F6]/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] pointer-events-auto flex items-center justify-center relative overflow-hidden" 
          style={{ height: MENU_HEIGHT }}
        >
          {/* Subtle Grid Background in Menu */}
          <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
          
          <div className="flex flex-wrap justify-center items-center gap-x-12 p-8 w-full max-w-7xl z-10">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => {
                  controls.start({ y: -MENU_HEIGHT });
                  setIsOpen(false);
                }}
                className={`text-xl font-bold tracking-wide transition-all duration-300 hover:text-[#60A5FA] hover:scale-105 flex items-center gap-3 ${
                  location.pathname === item.href ? 'text-[#3B82F6]' : 'text-white'
                }`}
                
              >
                <div className={`w-2 h-2 rounded-full ${location.pathname === item.href ? 'bg-[#3B82F6] shadow-[0_0_10px_#3B82F6]' : 'bg-transparent'}`} />
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Chain Handle */}
        <motion.div 
          animate={{ rotate: [-4, 4, -4], y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          style={{ transformOrigin: "top center" }}
          onClick={toggleMenu}
          className="mr-8 md:mr-24 relative pointer-events-auto cursor-pointer active:cursor-grabbing group pt-0"
        >
          {/* Chain string */}
          <div className="w-[4px] h-24 bg-gradient-to-b from-[#E2E8F0] via-[#94A3B8] to-transparent mx-auto absolute top-0 left-1/2 transform -translate-x-1/2 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
          
          {/* Logo Handle - Removed background circle and border */}
          <div className="relative mt-20 transition-all duration-300 group-hover:scale-110 group-active:scale-95">
            <img 
              src={atidetoLogo} 
              alt="Pull Menu" 
              className="w-20 h-20 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] pointer-events-none"
              draggable="false"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Main Static Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 pointer-events-none ${
          scrolled ? 'py-4' : 'py-6'
        } ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        {/* Glass fade background */}
        <div 
          className={`absolute inset-0 transition-opacity duration-300 pointer-events-none -z-10 ${scrolled ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
            background: 'linear-gradient(to bottom, rgba(5,5,5,0.1) 0%, transparent 100%)'
          }}
        />
        
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-start pointer-events-auto">
          {/* Left Aligned Logo */}
          <Link to="/" className="flex flex-col items-center group">
            <div className="flex items-center">
              <img src={atidetoLogo} alt="ATIDETO Logo" className="h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-110 filter drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
            </div>
          </Link>
        </div>
      </nav>
    </>
  );
}
