import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const letters = 'ATIDETO'.split('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500); // 3.5 seconds
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05070B] overflow-hidden"
    >
      {/* Background glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.15, scale: 1.5 }}
        transition={{ duration: 3, ease: 'easeOut' }}
        className="absolute w-[600px] h-[600px] bg-[#3B82F6] rounded-full blur-[150px] -z-10"
      />
      
      <div className="flex space-x-2 md:space-x-4" style={{ perspective: 1000 }}>
        {letters.map((letter, index) => (
          <motion.div
            key={index}
            initial={{ rotateY: -180, opacity: 0, y: 50 }}
            animate={{ rotateY: 0, opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: index * 0.15,
              type: 'spring',
              bounce: 0.4
            }}
            className="w-12 h-16 md:w-20 md:h-28 bg-[#111827] border border-[#3B82F6]/30 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)]"
            style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
          >
            <span 
              className="text-white text-3xl md:text-5xl font-black tracking-tight" 
              style={{ transform: 'translateZ(20px)' }}
            >
              {letter}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
