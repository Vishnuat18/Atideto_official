import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface BusinessInfoProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export default function BusinessInformation({ register, errors }: BusinessInfoProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-12 py-6">
      {/* Company Name */}
      <div className="flex flex-col space-y-4">
        <label className="text-[22px] font-medium text-[#CFCFCF]" htmlFor="company">
          What is your Company or Business Name?
        </label>
        <div className="relative">
          <input
            id="company"
            type="text"
            placeholder="Acme Corporation"
            className="w-full bg-transparent border-b border-white/15 pb-3 text-[20px] text-white placeholder-[#7D7D7D] focus:outline-none focus:border-[#5B5EFF] transition-all duration-300 focus:placeholder-transparent"
            {...register('company', { required: 'Company name is required' })}
          />
        </div>
        {errors.company && (
          <span className="text-red-500 text-sm mt-1">{errors.company.message as string}</span>
        )}
      </div>

      {/* Business Email */}
      <div className="flex flex-col space-y-4">
        <label className="text-[22px] font-medium text-[#CFCFCF]" htmlFor="businessEmail">
          Business Email Address
        </label>
        <div className="relative">
          <input
            id="businessEmail"
            type="email"
            placeholder="hello@acme.com"
            className="w-full bg-transparent border-b border-white/15 pb-3 text-[20px] text-white placeholder-[#7D7D7D] focus:outline-none focus:border-[#5B5EFF] transition-all duration-300 focus:placeholder-transparent"
            {...register('businessEmail', { 
              required: 'Business email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
        </div>
        {errors.businessEmail && (
          <span className="text-red-500 text-sm mt-1">{errors.businessEmail.message as string}</span>
        )}
      </div>

      {/* Website (Optional) */}
      <div className="flex flex-col space-y-4">
        <label className="text-[22px] font-medium text-[#CFCFCF]" htmlFor="website">
          Company Website (Optional)
        </label>
        <div className="relative">
          <input
            id="website"
            type="text"
            placeholder="https://acme.com"
            className="w-full bg-transparent border-b border-white/15 pb-3 text-[20px] text-white placeholder-[#7D7D7D] focus:outline-none focus:border-[#5B5EFF] transition-all duration-300 focus:placeholder-transparent"
            {...register('website')}
          />
        </div>
      </div>
    </div>
  );
}
