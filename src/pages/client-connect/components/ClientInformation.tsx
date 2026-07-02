import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface ClientInfoProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export default function ClientInformation({ register, errors }: ClientInfoProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-12 py-6">
      {/* Name Field */}
      <div className="flex flex-col space-y-4">
        <label className="text-[22px] font-medium text-[#CFCFCF]" htmlFor="name">
          What is your name?
        </label>
        <div className="relative">
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            className="w-full bg-transparent border-b border-white/15 pb-3 text-[20px] text-white placeholder-[#7D7D7D] focus:outline-none focus:border-[#5B5EFF] transition-all duration-300 focus:placeholder-transparent"
            {...register('name', { required: 'Name is required' })}
          />
          <div className="absolute bottom-0 left-0 h-[2px] bg-[#5B5EFF] w-0 transition-all duration-300 focus-within:w-full" />
        </div>
        {errors.name && (
          <span className="text-red-500 text-sm mt-1">{errors.name.message as string}</span>
        )}
      </div>

      {/* Email Field */}
      <div className="flex flex-col space-y-4">
        <label className="text-[22px] font-medium text-[#CFCFCF]" htmlFor="email">
          Your email address
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            placeholder="john@company.com"
            className="w-full bg-transparent border-b border-white/15 pb-3 text-[20px] text-white placeholder-[#7D7D7D] focus:outline-none focus:border-[#5B5EFF] transition-all duration-300 focus:placeholder-transparent"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
        </div>
        {errors.email && (
          <span className="text-red-500 text-sm mt-1">{errors.email.message as string}</span>
        )}
      </div>

      {/* Contact Info (Country Code + Phone) */}
      <div className="flex flex-col space-y-4">
        <label className="text-[22px] font-medium text-[#CFCFCF]" htmlFor="phone">
          Contact Number
        </label>
        <div className="flex gap-4 items-end">
          {/* Country Code */}
          <div className="w-[120px] relative">
            <select
              className="w-full bg-transparent border-b border-white/15 pb-3 text-[20px] text-white focus:outline-none focus:border-[#5B5EFF] transition-all duration-300 cursor-pointer"
              {...register('countryCode')}
              defaultValue="+91"
            >
              <option value="+91" className="bg-[#050505] text-white">+91 (IN)</option>
              <option value="+1" className="bg-[#050505] text-white">+1 (US)</option>
              <option value="+44" className="bg-[#050505] text-white">+44 (UK)</option>
              <option value="+61" className="bg-[#050505] text-white">+61 (AU)</option>
              <option value="+971" className="bg-[#050505] text-white">+971 (AE)</option>
              <option value="+81" className="bg-[#050505] text-white">+81 (JP)</option>
              <option value="+49" className="bg-[#050505] text-white">+49 (DE)</option>
            </select>
          </div>

          {/* Phone Number */}
          <div className="flex-1 relative">
            <input
              id="phone"
              type="tel"
              placeholder="9876543210"
              className="w-full bg-transparent border-b border-white/15 pb-3 text-[20px] text-white placeholder-[#7D7D7D] focus:outline-none focus:border-[#5B5EFF] transition-all duration-300 focus:placeholder-transparent"
              {...register('phone', { 
                required: 'Phone number is required',
                pattern: {
                  value: /^\d{10,15}$/,
                  message: 'Enter a valid phone number (10-15 digits)'
                }
              })}
            />
          </div>
        </div>
        {errors.phone && (
          <span className="text-red-500 text-sm mt-1">{errors.phone.message as string}</span>
        )}
      </div>
    </div>
  );
}
