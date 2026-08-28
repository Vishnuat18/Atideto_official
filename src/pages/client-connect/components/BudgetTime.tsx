import React, { useState } from 'react';
import { UseFormSetValue, UseFormWatch, UseFormRegister } from 'react-hook-form';
import { Check } from 'lucide-react';

interface BudgetTimeProps {
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  register: UseFormRegister<any>;
  onAutoAdvance?: () => void;
}

const BUDGET_OPTIONS = ['₹5K–10K', '₹10K–25K', '₹25K–50K', '₹50K–1L', '₹1L+', 'Custom Budget'];
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
    setValue('customBudgetDetails', '');
    if (!isCustom) {
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
    setValue('customTimelineDetails', '');
    if (!isCustom) {
      const currentBudget = watch('budget');
      if (currentBudget && currentBudget !== 'Custom Budget' && onAutoAdvance) {
        onAutoAdvance();
      }
    }
  };

  return (
    <div className="w-full space-y-9">
      {/* Budget Selection */}
      <div className="cc-field">
        <label className="cc-label">
          What is your estimated budget for this project?
        </label>
        <div className="cc-chips-grid">
          {BUDGET_OPTIONS.map((option) => {
            const isSelected = selectedBudget === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleBudgetSelect(option)}
                className={`cc-chip ${isSelected ? 'selected' : ''}`}
              >
                <Check className="check" />
                {option}
              </button>
            );
          })}
        </div>

        {showCustomBudget && (
          <div className="cc-field pt-4">
            <div className="cc-input-wrap">
              <input
                id="customBudget"
                type="text"
                placeholder=" "
                className="cc-input code"
                {...register('customBudgetDetails')}
              />
              <label className="cc-float" style={{ left: '1rem' }} htmlFor="customBudget">
                Enter your custom budget
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Timeline Selection */}
      <div className="cc-field">
        <label className="cc-label">
          What is your expected timeline?
        </label>
        <div className="cc-chips-grid">
          {TIMELINE_OPTIONS.map((option) => {
            const isSelected = selectedTimeline === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleTimelineSelect(option)}
                className={`cc-chip ${isSelected ? 'selected' : ''}`}
              >
                <Check className="check" />
                {option}
              </button>
            );
          })}
        </div>

        {showCustomTimeline && (
          <div className="cc-field pt-4">
            <div className="cc-input-wrap">
              <input
                id="customTimeline"
                type="text"
                placeholder=" "
                className="cc-input code"
                {...register('customTimelineDetails')}
              />
              <label className="cc-float" style={{ left: '1rem' }} htmlFor="customTimeline">
                Enter your custom timeline
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
