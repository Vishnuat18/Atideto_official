import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Check } from 'lucide-react';

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
    <div className="w-full space-y-7">
      <div className="cc-chips-grid">
        {SERVICE_OPTIONS.map((service) => {
          const isSelected = selectedServices.includes(service);
          return (
            <button
              key={service}
              type="button"
              onClick={() => onToggleService(service)}
              className={`cc-chip ${isSelected ? 'selected' : ''}`}
            >
              <Check className="check" />
              {service}
            </button>
          );
        })}
      </div>

      {isOtherSelected && (
        <div className="cc-field pt-2">
          <label className="cc-label" htmlFor="otherDescription">
            Describe your requirement
          </label>
          <div className="cc-input-wrap">
            <input
              id="otherDescription"
              type="text"
              placeholder="Tell us what you have in mind..."
              className="cc-input"
              {...register('otherServiceDetails')}
            />
          </div>
        </div>
      )}
    </div>
  );
}
