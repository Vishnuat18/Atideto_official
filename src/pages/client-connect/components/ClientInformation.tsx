import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { User, Mail, Phone, Globe, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ClientInfoProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  values: any;
}

const EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const PHONE_RE = /^\d{10,15}$/;

export default function ClientInformation({ register, errors, values }: ClientInfoProps) {
  const ok = {
    name: !!(values?.name && !errors.name),
    email: !!(values?.email && EMAIL_RE.test(values.email) && !errors.email),
    phone: !!(values?.phone && PHONE_RE.test(values.phone) && !errors.phone),
  };

  return (
    <div className="w-full space-y-7">
      <div className="cc-grid-2">
        {/* Name Field */}
        <div className="cc-field">
          <div className={`cc-input-wrap ${ok.name ? 'valid' : ''}`}>
            <span className="lead"><User /></span>
            <input
              id="name"
              type="text"
              placeholder=" "
              className={`cc-input ${errors.name ? 'error' : ''}`}
              {...register('name', { required: 'Name is required' })}
            />
            <label className="cc-float" htmlFor="name">What is your name?</label>
            {ok.name && <span className="cc-input-ok"><CheckCircle2 /></span>}
          </div>
          {errors.name && (
            <span className="cc-error"><AlertCircle /> {errors.name.message as string}</span>
          )}
        </div>

        {/* Email Field */}
        <div className="cc-field">
          <div className={`cc-input-wrap ${ok.email ? 'valid' : ''}`}>
            <span className="lead"><Mail /></span>
            <input
              id="email"
              type="email"
              placeholder=" "
              className={`cc-input ${errors.email ? 'error' : ''}`}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: EMAIL_RE,
                  message: 'Invalid email address'
                }
              })}
            />
            <label className="cc-float" htmlFor="email">Your email address</label>
            {ok.email && <span className="cc-input-ok"><CheckCircle2 /></span>}
          </div>
          {errors.email && (
            <span className="cc-error"><AlertCircle /> {errors.email.message as string}</span>
          )}
        </div>
      </div>

      {/* Contact Info (Country Code + Phone) */}
      <div className="cc-field">
        <div className="flex gap-4 items-start">
          {/* Country Code */}
          <div className="w-[130px] relative">
            <div className="cc-input-wrap">
              <span className="lead"><Globe /></span>
              <select
                id="countryCode"
                aria-label="Country Code"
                className="cc-input cc-select"
                {...register('countryCode')}
                defaultValue="+91"
              >
                <option value="+91">+91 (IN)</option>
                <option value="+1">+1 (US)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+61">+61 (AU)</option>
                <option value="+971">+971 (AE)</option>
                <option value="+81">+81 (JP)</option>
                <option value="+49">+49 (DE)</option>
              </select>
              <span className="cc-select-arrow"><ChevronDownIcon /></span>
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex-1 relative">
            <div className={`cc-input-wrap ${ok.phone ? 'valid' : ''}`}>
              <span className="lead"><Phone /></span>
              <input
                id="phone"
                type="tel"
                placeholder=" "
                className={`cc-input ${errors.phone ? 'error' : ''}`}
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: PHONE_RE,
                    message: 'Enter a valid phone number (10-15 digits)'
                  }
                })}
              />
              <label className="cc-float" htmlFor="phone">Phone number</label>
              {ok.phone && <span className="cc-input-ok"><CheckCircle2 /></span>}
            </div>
          </div>
        </div>
        {errors.phone && (
          <span className="cc-error"><AlertCircle /> {errors.phone.message as string}</span>
        )}
      </div>
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
