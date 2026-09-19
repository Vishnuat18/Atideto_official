import { motion } from 'framer-motion';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { SolutionItem } from '@/constants/solutions';

interface SolutionDetailModalProps {
  solution: SolutionItem | null;
  isOpen?: boolean;
  onClose: () => void;
}

export default function SolutionDetailModal({ solution, isOpen = true, onClose }: SolutionDetailModalProps) {
  const navigate = useNavigate();

  if (!solution || !isOpen) return null;

  const Icon = solution.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-auto">
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#050505]/85 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0A0F1D] rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(59,130,246,0.2)] border border-white/10 flex flex-col z-10 text-white"
      >
        {/* Top Header Bar */}
        <div className="p-6 md:p-8 bg-[#0D152A] border-b border-white/10 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${solution.badgeBg} text-white flex items-center justify-center shrink-0 shadow-lg`}>
              <Icon size={28} strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {solution.categories.map((cat) => (
                  <span
                    key={cat}
                    className="text-[11px] font-semibold uppercase tracking-wider text-[#3B82F6] bg-[#3B82F6]/10 border border-[#3B82F6]/20 px-2.5 py-0.5 rounded-full"
                  >
                    {cat}
                  </span>
                ))}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug font-montserrat">
                {solution.title}
              </h2>
              <p className="text-slate-400 text-sm md:text-base mt-0.5">
                {solution.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/10 shadow-sm cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-slate-300">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              System Overview
            </h3>
            <p className="text-base text-slate-300 leading-relaxed">
              {solution.overview}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Core Capabilities & Deliverables
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {solution.deliverables.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10"
                >
                  <CheckCircle2 size={18} className="text-[#3B82F6] shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Target Audience
            </h3>
            <p className="text-sm text-blue-200 bg-[#005DFF]/10 p-4 rounded-xl border border-[#005DFF]/20">
              {solution.targetAudience}
            </p>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-6 bg-[#0D152A] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-sm font-semibold text-white block">
              Ready to deploy {solution.title}?
            </span>
            <span className="text-xs text-slate-400">
              Connect with our senior engineering team to get started.
            </span>
          </div>
          <button
            onClick={() => {
              onClose();
              navigate(`/client-connect?service=${encodeURIComponent(solution.title)}`);
            }}
            className="w-fit mx-auto sm:mx-0 bg-[#005DFF] hover:bg-[#0048D6] text-white font-semibold text-xs sm:text-sm px-6 sm:px-7 py-2.5 sm:py-3 rounded-full inline-flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,93,255,0.4)] transition-all cursor-pointer"
          >
            <span>Talk to our team</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
