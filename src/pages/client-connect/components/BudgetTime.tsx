import React, { useState } from 'react';
import { UseFormSetValue, UseFormWatch, UseFormRegister } from 'react-hook-form';

interface BudgetTimeProps {
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  register: UseFormRegister<any>;
  onAutoAdvance?: () => void;
}

const BUDGET_OPTIONS = ['₹5,000', '₹10,000', '₹25,000', '₹50,000', '₹75,000', '₹1,00,000+', 'Custom Budget'];
const TIMELINE_OPTIONS = ['5–7 Days', '10–15 Days', '15–30 Days', '30–45 Days', '45–60 Days', '60+ Days', 'Custom Timeline'];

export default function BudgetTime({ setValue, watch, register, onAutoAdvance }: BudgetTimeProps) {
  const selectedBudget = watch('budget');
  const selectedTimeline = watch('timeline');

  const [showCustomBudget, setShowCustomBudget] = useState(selectedBudget === 'Custom Budget');
  const [showCustomTimeline, setShowCustomTimeline] = useState(selectedTimeline === 'Custom Timeline');

  const handleBudgetSelect = (option: string) => {
    setValue('budget', option);
    const isCustom = option === 'Custom Budget';
    setShowCustomBudget(isCustom);
    if (isCustom) {
      setValue('customBudgetDetails', '');
    } else {
      setValue('customBudgetDetails', '');
      // Auto-advance if timeline is also selected and not custom
      const currentTimeline = watch('timeline');
      if (currentTimeline && currentTimeline !== 'Custom Timeline' && onAutoAdvance) {
        onAutoAdvance();
      }
    }
  };

  const handleTimelineSelect = (option: string) => {
    setValue('timeline', option);
    const isCustom = option === 'Custom Timeline';
    setShowCustomTimeline(isCustom);
    if (isCustom) {
      setValue('customTimelineDetails', '');
    } else {
      setValue('customTimelineDetails', '');
      // Auto-advance if budget is also selected and not custom
      const currentBudget = watch('budget');
      if (currentBudget && currentBudget !== 'Custom Budget' && onAutoAdvance) {
        onAutoAdvance();
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 py-6">
      {/* Budget Selection */}
      <div className="flex flex-col space-y-6">
        <label className="text-[22px] font-medium text-[#CFCFCF] text-center">
          What is your estimated budget for this project?
        </label>
        
        <div className="flex flex-wrap justify-center gap-4">
          {BUDGET_OPTIONS.map((option) => {
            const isSelected = selectedBudget === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleBudgetSelect(option)}
                className={`px-8 h-[58px] rounded-full text-base font-semibold transition-all duration-300 flex items-center justify-center cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#5B5EFF] to-[#3A3DFF] border-transparent shadow-[0_0_20px_rgba(91,94,255,0.35)] text-white scale-[1.02]'
                    : 'bg-transparent border-[#5B5EFF]/40 text-white hover:border-[#5B5EFF] hover:shadow-[0_0_15px_rgba(91,94,255,0.2)] hover:scale-[1.03]'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {showCustomBudget && (
          <div className="flex flex-col space-y-4 max-w-2xl mx-auto pt-4 w-full animate-fadeIn">
            <label className="text-[20px] font-medium text-[#CFCFCF]" htmlFor="customBudget">
              Enter your custom budget
            </label>
            <div className="relative">
              <input
                id="customBudget"
                type="text"
                placeholder="e.g. ₹2,50,000 or $3,000 USD"
                className="w-full bg-transparent border-b border-white/15 pb-3 text-[20px] text-white placeholder-[#7D7D7D] focus:outline-none focus:border-[#5B5EFF] transition-all duration-300 focus:placeholder-transparent"
                {...register('customBudgetDetails')}
              />
            </div>
          </div>
        )}
      </div>

      {/* Timeline Selection */}
      <div className="flex flex-col space-y-6 pt-6">
        <label className="text-[22px] font-medium text-[#CFCFCF] text-center">
          What is your expected timeline?
        </label>
        
        <div className="flex flex-wrap justify-center gap-4">
          {TIMELINE_OPTIONS.map((option) => {
            const isSelected = selectedTimeline === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleTimelineSelect(option)}
                className={`px-8 h-[58px] rounded-full text-base font-semibold transition-all duration-300 flex items-center justify-center cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#5B5EFF] to-[#3A3DFF] border-transparent shadow-[0_0_20px_rgba(91,94,255,0.35)] text-white scale-[1.02]'
                    : 'bg-transparent border-[#5B5EFF]/40 text-white hover:border-[#5B5EFF] hover:shadow-[0_0_15px_rgba(91,94,255,0.2)] hover:scale-[1.03]'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {showCustomTimeline && (
          <div className="flex flex-col space-y-4 max-w-2xl mx-auto pt-4 w-full animate-fadeIn">
            <label className="text-[20px] font-medium text-[#CFCFCF]" htmlFor="customTimeline">
              Enter your custom timeline
            </label>
            <div className="relative">
              <input
                id="customTimeline"
                type="text"
                placeholder="e.g. Needs to go live by October 1st..."
                className="w-full bg-transparent border-b border-white/15 pb-3 text-[20px] text-white placeholder-[#7D7D7D] focus:outline-none focus:border-[#5B5EFF] transition-all duration-300 focus:placeholder-transparent"
                {...register('customTimelineDetails')}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
