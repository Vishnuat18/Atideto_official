import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CallToAction() {
  const navigate = useNavigate();

  return (
    <section className="relative py-16 px-8 lg:px-16 z-20 overflow-hidden border-t border-white/5 bg-gradient-to-b from-transparent to-[#040608]">
      <div className="absolute inset-0 bg-[#3B82F6] opacity-[0.03] blur-[100px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight"
        >
          READY TO BUILD <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C6FF] to-[#3B82F6]">SOMETHING EXTRAORDINARY?</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-[#94A3B8] text-xl mb-12 max-w-2xl mx-auto"
        >
          Join ATIDETO as a partner to scale your business, or as a student to scale your career.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-6"
        >
          <button 
            onClick={() => navigate('/client-connect')}
            className="group relative px-10 py-5 rounded-full bg-white text-black font-bold text-lg tracking-wide overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#00C6FF] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10 group-hover:text-white transition-colors flex items-center gap-3">
              Start a Project <ArrowRight size={20} />
            </span>
          </button>
          
          <button 
            onClick={() => navigate('/academy')}
            className="group px-10 py-5 rounded-full bg-transparent border border-white/20 text-white font-bold text-lg tracking-wide hover:border-white hover:bg-white/5 transition-all flex items-center gap-3"
          >
            Join the Academy
          </button>
        </motion.div>
      </div>
    </section>
  );
}
