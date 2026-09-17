import { motion } from 'framer-motion';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ServiceModalProps {
  service: any;
  onClose: () => void;
}

export default function ServiceModal({ service, onClose }: ServiceModalProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 md:px-12 py-12 pointer-events-auto">
      
      {/* Backdrop overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        layoutId={`card-${service.id}`}
        className="relative w-full max-w-6xl h-[90vh] md:h-[80vh] bg-[#0a0a0a] rounded-[32px] overflow-hidden shadow-[0_0_80px_rgba(59,130,246,0.15)] border border-[rgba(255,255,255,0.08)] flex flex-col md:flex-row z-10"
        style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-30 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10 backdrop-blur-md"
        >
          <X size={24} />
        </button>

        {/* LEFT PANE (40%) - Original Visual Context */}
        <div className="w-full md:w-[40%] h-[30%] md:h-full relative flex flex-col justify-between p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/10 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.2),transparent_60%)]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505]/90 pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg" >
              {service.title}
            </h2>
            <div className="w-12 h-1 bg-[#3B82F6] mt-6 rounded-full shadow-[0_0_10px_#3B82F6]" />
          </div>

          <div className="relative z-10 hidden md:block">
            <p className="text-[#94A3B8] text-lg leading-relaxed mb-8">
              {service.description}
            </p>
          </div>
        </div>

        {/* RIGHT PANE (60%) - Details */}
        <div className="w-full md:w-[60%] h-[70%] md:h-full p-8 md:p-12 overflow-y-auto custom-scrollbar bg-[#050505]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Extended Description */}
            <h3 className="text-xl font-bold text-white mb-4">Overview</h3>
            <p className="text-[#94A3B8] leading-relaxed mb-10">
              Our {service.title} solutions are designed to scale your business operations and provide an unparalleled competitive advantage. We leverage industry-leading architectures, top-tier security standards, and rigorous testing methodologies to ensure every deployment exceeds enterprise expectations.
            </p>

            {/* How We Work */}
            <h3 className="text-xl font-bold text-white mb-6">How We Work</h3>
            <div className="space-y-6 mb-12">
              {[
                { step: '1', title: 'Discovery & Architecture', desc: 'We analyze your requirements and map out a robust technical architecture tailored to your goals.' },
                { step: '2', title: 'Agile Development', desc: 'Iterative sprints ensure transparent progress and early delivery of core functionality.' },
                { step: '3', title: 'Testing & QA', desc: 'Rigorous automated and manual testing guarantees performance and security.' },
                { step: '4', title: 'Deployment & Support', desc: 'Seamless integration into your ecosystem with ongoing maintenance and scaling support.' }
              ].map((process) => (
                <div key={process.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-sm">
                    {process.step}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{process.title}</h4>
                    <p className="text-[#94A3B8] text-sm">{process.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Key Deliverables */}
            <h3 className="text-xl font-bold text-white mb-4">Key Deliverables</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {['Scalable Architecture', 'Source Code Ownership', 'Security Compliance', 'Performance Optimization', 'Dedicated Project Manager', '24/7 Priority Support'].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-[#3B82F6]" />
                  <span className="text-[#E2E8F0] text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-900/40 to-blue-600/10 border border-blue-500/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-white font-bold text-lg mb-2">Ready to transform your vision?</h4>
                <p className="text-blue-200/60 text-sm">Get a comprehensive quote and technical consultation.</p>
              </div>
              <button 
                onClick={() => navigate(`/requirement-gathering?service=${service.id}`)}
                className="w-full md:w-auto bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 flex-shrink-0"
              >
                Start Project <ArrowRight size={18} />
              </button>
            </div>
            
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}
