import React, { useState } from 'react';
import { UseFormSetValue, UseFormWatch, UseFormRegister, FieldErrors } from 'react-hook-form';

interface MeetingTypeProps {
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  onAutoAdvance?: () => void;
}

export default function MeetingType({ setValue, watch, register, errors, onAutoAdvance }: MeetingTypeProps) {
  const selectedType = watch('meetingType');
  const [showOfflineFields, setShowOfflineFields] = useState(selectedType === 'Offline');

  const handleTypeSelect = (type: 'Online' | 'Offline') => {
    setValue('meetingType', type);
    if (type === 'Offline') {
      setShowOfflineFields(true);
    } else {
      setShowOfflineFields(false);
      setValue('meetingDate', '');
      setValue('meetingTime', '');
      // Auto-advance since there are no additional fields
      if (onAutoAdvance) {
        onAutoAdvance();
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-12 py-6">
      <div className="flex flex-col space-y-6">
        <label className="text-[22px] font-medium text-[#CFCFCF] text-center">
          How would you like to connect with us?
        </label>
        
        <div className="flex justify-center gap-6">
          {['Online', 'Offline'].map((type) => {
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeSelect(type as 'Online' | 'Offline')}
                className={`px-12 h-[58px] rounded-full text-base font-semibold transition-all duration-300 flex items-center justify-center cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#5B5EFF] to-[#3A3DFF] border-transparent shadow-[0_0_20px_rgba(91,94,255,0.35)] text-white scale-[1.02]'
                    : 'bg-transparent border-[#5B5EFF]/40 text-white hover:border-[#5B5EFF] hover:shadow-[0_0_15px_rgba(91,94,255,0.2)] hover:scale-[1.03]'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {showOfflineFields && (
        <div className="space-y-8 animate-fadeIn max-w-md mx-auto pt-6">
          {/* Meeting Date */}
          <div className="flex flex-col space-y-4">
            <label className="text-[20px] font-medium text-[#CFCFCF]" htmlFor="meetingDate">
              Preferred Meeting Date
            </label>
            <div className="relative">
              <input
                id="meetingDate"
                type="date"
                className="w-full bg-transparent border-b border-white/15 pb-3 text-[20px] text-white focus:outline-none focus:border-[#5B5EFF] transition-all duration-300 cursor-pointer scheme-dark"
                {...register('meetingDate', { required: selectedType === 'Offline' ? 'Meeting date is required' : false })}
              />
            </div>
            {errors.meetingDate && (
              <span className="text-red-500 text-sm mt-1">{errors.meetingDate.message as string}</span>
            )}
          </div>

          {/* Meeting Time */}
          <div className="flex flex-col space-y-4">
            <label className="text-[20px] font-medium text-[#CFCFCF]" htmlFor="meetingTime">
              Preferred Meeting Time
            </label>
            <div className="relative">
              <input
                id="meetingTime"
                type="time"
                className="w-full bg-transparent border-b border-white/15 pb-3 text-[20px] text-white focus:outline-none focus:border-[#5B5EFF] transition-all duration-300 cursor-pointer scheme-dark"
                {...register('meetingTime', { required: selectedType === 'Offline' ? 'Meeting time is required' : false })}
              />
            </div>
            {errors.meetingTime && (
              <span className="text-red-500 text-sm mt-1">{errors.meetingTime.message as string}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
