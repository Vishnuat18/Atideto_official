import React, { useState } from 'react';
import {
  Users, LayoutDashboard, CalendarClock, Edit3, ChevronDown, ChevronUp,
  FileText, Send, Check, AlertCircle,
} from 'lucide-react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface ReviewSubmitProps {
  formValues: any;
  goToStep: (stepIndex: number) => void;
  isSubmitting: boolean;
  submitError?: string;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  privacyAccepted: boolean;
}

const SECTIONS = [
  { id: 'contact', title: 'Contact Information', step: 0, icon: Users },
  { id: 'project', title: 'Project Requirements', step: 1, icon: LayoutDashboard },
  { id: 'budget', title: 'Budget & Meeting', step: 2, icon: CalendarClock },
];

export default function ReviewSubmit({
  formValues, goToStep, isSubmitting, submitError, register, errors, privacyAccepted,
}: ReviewSubmitProps) {
  const [openSection, setOpenSection] = useState<string | null>('contact');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const formatList = (arr: any) => {
    if (!arr || !Array.isArray(arr)) return 'None';
    return arr.length ? arr.join(', ') : 'None';
  };

  const renderHead = (id: string, title: string, stepIndex: number, icon: any) => {
    const isOpen = openSection === id;
    const Icon = icon;
    return (
      <div className="cc-review-head" onClick={() => toggleSection(id)}>
        <div className="t">
          <span className="ic"><Icon /></span>
          <b>{title}</b>
        </div>
        <div className="h-actions">
          <span
            role="button"
            tabIndex={0}
            className="cc-review-edit"
            title="Edit Section"
            onClick={(e) => {
              e.stopPropagation();
              goToStep(stepIndex);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                goToStep(stepIndex);
              }
            }}
          >
            <Edit3 />
          </span>
          <span className="cc-review-toggle">
            {isOpen ? <ChevronUp /> : <ChevronDown />}
          </span>
        </div>
      </div>
    );
  };

  const row = (label: string, value: any) => (
    <div className="cc-review-row">
      <b>{label}</b>
      <span>{value || '—'}</span>
    </div>
  );

  return (
    <div className="w-full space-y-8">
      <div className="cc-review">
        {/* Contact */}
        <div className="cc-review-sec">
          {renderHead('contact', 'Contact Information', 0, Users)}
          {openSection === 'contact' && (
            <div className="cc-review-body">
              {row('Name', formValues.name)}
              {row('Email', formValues.email)}
              {row('Phone', `${formValues.countryCode} ${formValues.phone}`)}
              {row('Company', formValues.company)}
              {row('Business Email', formValues.businessEmail)}
              {row('Website', formValues.website)}
            </div>
          )}
        </div>

        {/* Project */}
        <div className="cc-review-sec">
          {renderHead('project', 'Project Requirements', 1, LayoutDashboard)}
          {openSection === 'project' && (
            <div className="cc-review-body">
              <div className="cc-review-row">
                <b>Services</b>
                <div className="cc-review-tags">
                  {(formValues.services || []).map((s: string) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </div>
              {formValues.services?.includes('Other') && row('Other Details', formValues.otherServiceDetails)}
              <div className="cc-review-desc">{formValues.description || '—'}</div>
              {formValues.designStatus && row('Design Status', formValues.designStatus)}
              {formValues.aiIntegrations && row('AI Integrations', formValues.aiIntegrations)}
              <div className="cc-review-row">
                <b>Preferred Stack</b>
                <div className="cc-review-tags">
                  {((formValues.techStack || []).length ? formValues.techStack : ['Any']).map((t: string) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
              {formValues.attachments?.length > 0 && (
                <div className="cc-review-row" style={{ display: 'block' }}>
                  <b>Attachments</b>
                  {(formValues.attachments as File[]).map((file, i) => (
                    <div key={i} className="cc-review-file">
                      <FileText />
                      <span className="truncate">{file.name}</span>
                      <small style={{ marginLeft: 'auto', color: 'var(--cc-muted)' }}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Budget & Meeting */}
        <div className="cc-review-sec">
          {renderHead('budget', 'Budget & Meeting', 2, CalendarClock)}
          {openSection === 'budget' && (
            <div className="cc-review-body">
              {row('Budget', formValues.budget === 'Custom Budget' ? `Custom — ${formValues.customBudgetDetails}` : formValues.budget)}
              {row('Timeline', formValues.timeline === 'Custom Timeline' ? `Custom — ${formValues.customTimelineDetails}` : formValues.timeline)}
              {row('Meeting', formValues.meetingType)}
              {formValues.meetingType === 'Offline' && (
                <>
                  {row('Date', formValues.meetingDate)}
                  {row('Time', formValues.meetingTime)}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Privacy consent */}
      <div className="cc-privacy">
        <label className="cc-check">
          <input
            type="checkbox"
            {...register('privacyAccepted', { required: 'You must accept the privacy policy to submit' })}
          />
          <span className="box"><Check /></span>
          <span className="txt">
            I agree to the <a href="/privacy-policy" onClick={(e) => e.preventDefault()} title="Privacy policy coming soon">Privacy Policy</a> and
            consent to ATIDETO processing my information to respond to this inquiry.
          </span>
        </label>
        {errors.privacyAccepted && (
          <span className="cc-error">
            <AlertCircle /> {typeof errors.privacyAccepted.message === 'string' ? errors.privacyAccepted.message : 'Please accept the privacy policy'}
          </span>
        )}
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !privacyAccepted}
          className="cc-btn-primary w-full justify-center text-lg py-4 rounded-2xl"
          style={{ minHeight: '58px' }}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-3">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing Proposal...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send className="w-5 h-5" /> Submit Project Inquiry
            </span>
          )}
        </button>
        {submitError && (
          <p className="mt-4 text-red-300 text-sm text-center bg-red-500/10 border border-red-500/30 rounded-xl p-3">
            {submitError}
          </p>
        )}
      </div>
    </div>
  );
}
