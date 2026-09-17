import React from 'react';
import { UseFormRegister } from 'react-hook-form';

interface ServiceSelectionProps {
  selectedServices: string[];
  onToggleService: (service: string) => void;
  register: UseFormRegister<any>;
}

const SERVICE_OPTIONS = [
  'Website',
  'Mobile App',
  'UI/UX Design',
  'Desktop Software',
  'AI Automation',
  'AI Agents',
  'Brand Identity',
  'Cloud Solutions',
  'API Development',
  'Maintenance',
  'Consultation',
  'Other'
];

export default function ServiceSelection({ selectedServices, onToggleService, register }: ServiceSelectionProps) {
  const isOtherSelected = selectedServices.includes('Other');

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 py-6">
      <div className="flex flex-col space-y-2 text-center">
        <span className="text-[14px] text-white/50 tracking-widest uppercase">Step 3 of 7</span>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {SERVICE_OPTIONS.map((service) => {
          const isSelected = selectedServices.includes(service);

          return (
            <button
              key={service}
              type="button"
              onClick={() => onToggleService(service)}
              className={`px-8 h-[58px] rounded-full text-base font-semibold transition-all duration-300 flex items-center justify-center cursor-pointer border ${
                isSelected
                  ? 'bg-gradient-to-r from-[#5B5EFF] to-[#3A3DFF] border-transparent shadow-[0_0_20px_rgba(91,94,255,0.35)] text-white scale-[1.02]'
                  : 'bg-transparent border-[#5B5EFF]/40 text-white hover:border-[#5B5EFF] hover:shadow-[0_0_15px_rgba(91,94,255,0.2)] hover:scale-[1.03]'
              }`}
            >
              {service}
            </button>
          );
        })}
      </div>

      {isOtherSelected && (
        <div className="flex flex-col space-y-4 max-w-2xl mx-auto pt-6 animate-fadeIn">
          <label className="text-[22px] font-medium text-[#CFCFCF]" htmlFor="otherDescription">
            Describe your requirement
          </label>
          <div className="relative">
            <input
              id="otherDescription"
              type="text"
              placeholder="Tell us what you have in mind..."
              className="w-full bg-transparent border-b border-white/15 pb-3 text-[20px] text-white placeholder-[#7D7D7D] focus:outline-none focus:border-[#5B5EFF] transition-all duration-300 focus:placeholder-transparent"
              {...register('otherServiceDetails')}
            />
          </div>
        </div>
      )}
    </div>
  );
}
