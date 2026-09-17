import React, { useState } from 'react';
import { Mail, Database, Shield, Edit3, ChevronDown, ChevronUp, FileText } from 'lucide-react';

interface ReviewSubmitProps {
  formValues: any;
  goToStep: (stepIndex: number) => void;
  isSubmitting: boolean;
}

export default function ReviewSubmit({ formValues, goToStep, isSubmitting }: ReviewSubmitProps) {
  const [openSection, setOpenSection] = useState<string | null>('client');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const formatList = (arr: any) => {
    if (!arr || !Array.isArray(arr)) return 'None';
    return arr.join(', ');
  };

  const renderSectionHeader = (id: string, title: string, stepIndex: number) => {
    const isOpen = openSection === id;
    return (
      <div className="flex items-center justify-between py-4 border-b border-white/10 cursor-pointer group" onClick={() => toggleSection(id)}>
        <h3 className="text-[20px] font-bold text-white group-hover:text-[#5B5EFF] transition-colors duration-200">
          {title}
        </h3>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToStep(stepIndex);
            }}
            className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all"
            title="Edit Section"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          {isOpen ? <ChevronUp className="w-5 h-5 text-white/40" /> : <ChevronDown className="w-5 h-5 text-white/40" />}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 py-6">
      <div className="space-y-2">
        {/* Step 1: Client Info */}
        <div className="border-t border-white/10">
          {renderSectionHeader('client', 'Client Information', 0)}
          {openSection === 'client' && (
            <div className="py-4 px-2 space-y-3 text-[#AFAFAF] text-[16px] animate-fadeIn">
              <div><span className="text-white/40 mr-2 font-semibold">Name:</span> {formValues.name || '—'}</div>
              <div><span className="text-white/40 mr-2 font-semibold">Email:</span> {formValues.email || '—'}</div>
              <div><span className="text-white/40 mr-2 font-semibold">Phone:</span> {formValues.countryCode} {formValues.phone || '—'}</div>
            </div>
          )}
        </div>

        {/* Step 2: Business Info */}
        <div>
          {renderSectionHeader('business', 'Business Information', 1)}
          {openSection === 'business' && (
            <div className="py-4 px-2 space-y-3 text-[#AFAFAF] text-[16px] animate-fadeIn">
              <div><span className="text-white/40 mr-2 font-semibold">Company Name:</span> {formValues.company || '—'}</div>
              <div><span className="text-white/40 mr-2 font-semibold">Business Email:</span> {formValues.businessEmail || '—'}</div>
              <div><span className="text-white/40 mr-2 font-semibold">Website:</span> {formValues.website || '—'}</div>
            </div>
          )}
        </div>

        {/* Step 3: Service Selection */}
        <div>
          {renderSectionHeader('services', 'Service Selection', 2)}
          {openSection === 'services' && (
            <div className="py-4 px-2 space-y-3 text-[#AFAFAF] text-[16px] animate-fadeIn">
              <div><span className="text-white/40 mr-2 font-semibold">Services:</span> {formatList(formValues.services)}</div>
              {formValues.services?.includes('Other') && (
                <div><span className="text-white/40 mr-2 font-semibold">Other Requirements:</span> {formValues.otherServiceDetails || '—'}</div>
              )}
            </div>
          )}
        </div>

        {/* Step 4: Project Information */}
        <div>
          {renderSectionHeader('project', 'Project Information', 3)}
          {openSection === 'project' && (
            <div className="py-4 px-2 space-y-4 text-[#AFAFAF] text-[16px] animate-fadeIn">
              <div>
                <span className="text-white/40 block mb-1 font-semibold">Description:</span>
                <p className="whitespace-pre-line bg-white/[0.01] border border-white/5 rounded-xl p-4">{formValues.description || '—'}</p>
              </div>
              {formValues.designStatus && (
                <div><span className="text-white/40 mr-2 font-semibold">Design Status:</span> {formValues.designStatus}</div>
              )}
              {formValues.aiIntegrations && (
                <div><span className="text-white/40 mr-2 font-semibold">Integrations:</span> {formValues.aiIntegrations}</div>
              )}
              <div><span className="text-white/40 mr-2 font-semibold">Preferred Stack:</span> {formatList(formValues.techStack)}</div>
              {formValues.attachments?.length > 0 && (
                <div>
                  <span className="text-white/40 block mb-2 font-semibold">Attachments:</span>
                  <div className="space-y-1.5">
                    {formValues.attachments.map((file: File, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-white/80 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                        <FileText className="w-4 h-4 text-[#5B5EFF]" />
                        <span className="truncate max-w-[250px]">{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 5: Budget & Time */}
        <div>
          {renderSectionHeader('budget', 'Budget & Time', 4)}
          {openSection === 'budget' && (
            <div className="py-4 px-2 space-y-3 text-[#AFAFAF] text-[16px] animate-fadeIn">
              <div>
                <span className="text-white/40 mr-2 font-semibold">Budget:</span> 
                {formValues.budget === 'Custom Budget' ? `Custom: ${formValues.customBudgetDetails}` : formValues.budget || '—'}
              </div>
              <div>
                <span className="text-white/40 mr-2 font-semibold">Timeline:</span> 
                {formValues.timeline === 'Custom Timeline' ? `Custom: ${formValues.customTimelineDetails}` : formValues.timeline || '—'}
              </div>
            </div>
          )}
        </div>

        {/* Step 6: Meeting Type */}
        <div className="border-b border-white/10">
          {renderSectionHeader('meeting', 'Meeting Type', 5)}
          {openSection === 'meeting' && (
            <div className="py-4 px-2 space-y-3 text-[#AFAFAF] text-[16px] animate-fadeIn">
              <div><span className="text-white/40 mr-2 font-semibold">Format:</span> {formValues.meetingType || '—'}</div>
              {formValues.meetingType === 'Offline' && (
                <>
                  <div><span className="text-white/40 mr-2 font-semibold">Date:</span> {formValues.meetingDate || '—'}</div>
                  <div><span className="text-white/40 mr-2 font-semibold">Time:</span> {formValues.meetingTime || '—'}</div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Trust Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {[
          { icon: Mail, text: 'A copy of this request will be sent to your email.' },
          { icon: Database, text: 'Your request will be securely stored in our database.' },
          { icon: Shield, text: 'Your information remains private and secure.' }
        ].map((card, i) => (
          <div key={i} className="flex flex-col items-center text-center p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.03]">
            <card.icon className="w-6 h-6 text-[#5B5EFF] mb-3" />
            <p className="text-[13px] text-white/50 leading-relaxed">{card.text}</p>
          </div>
        ))}
      </div>

      {/* Large Premium Submit Button */}
      <div className="pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-[58px] rounded-full bg-gradient-to-r from-[#5B5EFF] to-[#3A3DFF] text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(91,94,255,0.45)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(91,94,255,0.3)]"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing Proposal...
            </div>
          ) : (
            'Submit Project Inquiry'
          )}
        </button>
      </div>
    </div>
  );
}
