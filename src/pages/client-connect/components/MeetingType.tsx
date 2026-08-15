import React, { useState } from 'react';
import { UseFormSetValue, UseFormWatch, UseFormRegister, FieldErrors } from 'react-hook-form';
import { Check, AlertCircle, Video, MapPin } from 'lucide-react';

interface MeetingTypeProps {
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  onAutoAdvance?: () => void;
}

const MEETING_CHOICES = [
  {
    type: 'Online',
    icon: Video,
    title: 'Online Meeting',
    desc: 'Video call on Google Meet or Zoom — we connect within 24–48 hours.',
  },
  {
    type: 'Offline',
    icon: MapPin,
    title: 'In-Person Meeting',
    desc: 'Meet us at our office. Pick a preferred date and time below.',
  },
];

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
      if (onAutoAdvance) {
        onAutoAdvance();
      }
    }
  };

  return (
    <div className="w-full space-y-9">
      <div className="cc-field">
        <label className="cc-label">
          How would you like to connect with us?
        </label>
        <div className="cc-choice">
          {MEETING_CHOICES.map(({ type, icon: Icon, title, desc }) => {
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeSelect(type as 'Online' | 'Offline')}
                className={`cc-choice-card ${isSelected ? 'selected' : ''}`}
              >
                <span className="co-ic"><Icon /></span>
                <b>{title}</b>
                <small>{desc}</small>
                <span className="co-check"><Check /></span>
              </button>
            );
          })}
        </div>
      </div>

      {showOfflineFields && (
        <div className="cc-grid-2">
          {/* Meeting Date */}
          <div className="cc-field">
            <label className="cc-label" htmlFor="meetingDate">
              Preferred Meeting Date
            </label>
            <div className="cc-input-wrap">
              <input
                id="meetingDate"
                type="date"
                className={`cc-input ${errors.meetingDate ? 'error' : ''}`}
                {...register('meetingDate', { required: selectedType === 'Offline' ? 'Meeting date is required' : false })}
              />
            </div>
            {errors.meetingDate && (
              <span className="cc-error"><AlertCircle /> {errors.meetingDate.message as string}</span>
            )}
          </div>

          {/* Meeting Time */}
          <div className="cc-field">
            <label className="cc-label" htmlFor="meetingTime">
              Preferred Meeting Time
            </label>
            <div className="cc-input-wrap">
              <input
                id="meetingTime"
                type="time"
                className={`cc-input ${errors.meetingTime ? 'error' : ''}`}
                {...register('meetingTime', { required: selectedType === 'Offline' ? 'Meeting time is required' : false })}
              />
            </div>
            {errors.meetingTime && (
              <span className="cc-error"><AlertCircle /> {errors.meetingTime.message as string}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
