import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Building2, Mail, Globe, AlertCircle, CheckCircle2 } from 'lucide-react';

interface BusinessInfoProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  values: any;
}

const EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export default function BusinessInformation({ register, errors, values }: BusinessInfoProps) {
  const ok = {
    company: !!(values?.company && !errors.company),
    businessEmail: !!(values?.businessEmail && EMAIL_RE.test(values.businessEmail) && !errors.businessEmail),
  };

  return (
    <div className="w-full space-y-7">
      <div className="cc-grid-2">
        {/* Company Name */}
        <div className="cc-field">
          <div className={`cc-input-wrap ${ok.company ? 'valid' : ''}`}>
            <span className="lead"><Building2 /></span>
            <input
              id="company"
              type="text"
              placeholder=" "
              className={`cc-input ${errors.company ? 'error' : ''}`}
              {...register('company', { required: 'Company name is required' })}
            />
            <label className="cc-float" htmlFor="company">What is your Company or Business Name?</label>
            {ok.company && <span className="cc-input-ok"><CheckCircle2 /></span>}
          </div>
          {errors.company && (
            <span className="cc-error"><AlertCircle /> {errors.company.message as string}</span>
          )}
        </div>

        {/* Business Email */}
        <div className="cc-field">
          <div className={`cc-input-wrap ${ok.businessEmail ? 'valid' : ''}`}>
            <span className="lead"><Mail /></span>
            <input
              id="businessEmail"
              type="email"
              placeholder=" "
              className={`cc-input ${errors.businessEmail ? 'error' : ''}`}
              {...register('businessEmail', {
                required: 'Business email is required',
                pattern: {
                  value: EMAIL_RE,
                  message: 'Invalid email address'
                }
              })}
            />
            <label className="cc-float" htmlFor="businessEmail">Business email address</label>
            {ok.businessEmail && <span className="cc-input-ok"><CheckCircle2 /></span>}
          </div>
          {errors.businessEmail && (
            <span className="cc-error"><AlertCircle /> {errors.businessEmail.message as string}</span>
          )}
        </div>
      </div>

      {/* Website (Optional) */}
      <div className="cc-field">
        <div className="cc-input-wrap has-opt">
          <span className="lead"><Globe /></span>
          <input
            id="website"
            type="text"
            placeholder=" "
            className="cc-input"
            {...register('website')}
          />
          <label className="cc-float" htmlFor="website">Company website</label>
          <span className="cc-opt-badge">Optional</span>
        </div>
      </div>
    </div>
  );
}
