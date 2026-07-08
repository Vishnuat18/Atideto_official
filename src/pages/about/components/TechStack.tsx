import { motion } from 'framer-motion';

// Import images
import aws from '@/assets/new stack/aws.png';
import csharp from '@/assets/new stack/csharp.png';
import eex from '@/assets/new stack/eex.png';
import figma from '@/assets/new stack/figma.png';
import java from '@/assets/new stack/java.png';
import javascript from '@/assets/new stack/javascript.png';
import mongodb from '@/assets/new stack/mongodb.png';
import mysql from '@/assets/new stack/mysql.png';
import nextjs from '@/assets/new stack/nextjs.png';
import nodejs from '@/assets/new stack/nodejs.png';
import postgres from '@/assets/new stack/postgres.png';
import python from '@/assets/new stack/python.png';
import react from '@/assets/new stack/react.png';
import tailwind from '@/assets/new stack/tailwind.png';
import typescript from '@/assets/new stack/typescript.png';

const STACK_LOGOS = [
  { src: aws, bw: false },
  { src: csharp, bw: false },
  { src: eex, bw: false },
  { src: java, bw: false },
  { src: mysql, bw: false },
  { src: nodejs, bw: false },
  { src: python, bw: false },
  { src: react, bw: false },
  { src: typescript, bw: false },
  { src: postgres, bw: true },
  { src: javascript, bw: true },
  { src: nextjs, bw: true },
  { src: figma, bw: true },
  { src: mongodb, bw: true },
  { src: tailwind, bw: true },
];

export default function TechStack() {
  return (
    <section className="relative py-24 overflow-hidden z-20">
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="max-w-[1200px] mx-auto px-6 mb-16 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-1.5 rounded-full border border-[#60A5FA]/30 bg-[#60A5FA]/10 text-[#60A5FA] text-xs font-bold tracking-[0.2em] uppercase mb-6"
        >
          Our Arsenal
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-black text-white"
        >
          TECHNOLOGY <span className="text-[#60A5FA]">STACK</span>
        </motion.h2>
      </div>

      <div className="relative w-full flex overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-[100px] before:bg-gradient-to-r before:from-[#05070B] before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-[100px] after:bg-gradient-to-l after:from-[#05070B] after:to-transparent">
        <div className="flex w-max animate-scroll items-center gap-16 md:gap-24 px-8">
          {/* Double the logos to create seamless loop */}
          {[...STACK_LOGOS, ...STACK_LOGOS].map((logo, index) => (
            <div key={index} className="flex-shrink-0 flex items-center justify-center w-20 h-20 md:w-28 md:h-28 transition-transform duration-300 hover:scale-110">
              <img 
                src={logo.src} 
                alt="Tech Logo" 
                className={`w-full h-full object-contain transition-all duration-300 ${
                  logo.bw 
                    ? 'grayscale brightness-0 invert opacity-70 hover:opacity-100' // B&W (white) with no glow
                    : 'opacity-90 hover:opacity-100 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]' // Full color
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
