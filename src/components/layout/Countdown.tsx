import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import atidetoLogo from '@/assets/atideto-logo.png';

interface CountdownProps {
  targetDate: Date;
  onLaunch: () => void;
}

export default function Countdown({ targetDate, onLaunch }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(() => {
    return Math.max(0, targetDate.getTime() - new Date().getTime());
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, targetDate.getTime() - new Date().getTime());
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        onLaunch();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onLaunch]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05070B] overflow-hidden selection:bg-[#3B82F6] selection:text-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[#02040A]">
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }} />
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
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <motion.img 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          src={atidetoLogo} 
          alt="ATIDETO Logo" 
          className="h-16 md:h-24 w-auto object-contain mb-8 filter drop-shadow-[0_0_15px_rgba(46,168,255,0.4)]" 
        />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-block px-6 py-2 rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#3B82F6] text-sm font-bold tracking-[0.2em] uppercase mb-8"
        >
          Launching Soon
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-12 tracking-tight text-white drop-shadow-2xl text-center"
        >
          The Future Is <span className="text-[#3B82F6]">Loading</span>
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex space-x-4 md:space-x-8"
        >
          <TimeUnit value={days} label="Days" />
          <TimeUnit value={hours} label="Hours" />
          <TimeUnit value={minutes} label="Minutes" />
          <TimeUnit value={seconds} label="Seconds" />
        </motion.div>
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number, label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-20 h-24 md:w-32 md:h-36 bg-[#111111]/80 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center mb-3 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
        <span className="text-4xl md:text-6xl font-black text-white font-mono">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-[#AFAFAF] text-xs md:text-sm font-bold tracking-widest uppercase">{label}</span>
    </div>
  );
}
