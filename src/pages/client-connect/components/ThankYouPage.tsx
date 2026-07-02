import React from 'react';
import { motion } from 'framer-motion';
import { Check, Download, Home, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ThankYouProps {
  requestId: string;
  formValues: any;
  onReset: () => void;
}

export default function ThankYouPage({ requestId, formValues, onReset }: ThankYouProps) {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleDownloadSummary = () => {
    // Generate a simple text file summary for download
    const summary = `
=============================================
ATIDETO PROJECT INQUIRY SUMMARY
=============================================
Project ID: ${requestId}
Submitted: ${new Date().toLocaleString()}
---------------------------------------------
CLIENT INFORMATION
Name: ${formValues.name}
Email: ${formValues.email}
Phone: ${formValues.countryCode} ${formValues.phone}

BUSINESS INFORMATION
Company: ${formValues.company}
Business Email: ${formValues.businessEmail}
Website: ${formValues.website || 'N/A'}

SERVICES INTERESTED
Services: ${formValues.services?.join(', ')}
${formValues.services?.includes('Other') ? `Other details: ${formValues.otherServiceDetails}` : ''}

PROJECT SPECIFICS
Description: ${formValues.description}
Tech Stack: ${formValues.techStack?.join(', ')}
Design Status: ${formValues.designStatus || 'N/A'}
AI Integrations: ${formValues.aiIntegrations || 'N/A'}

BUDGET & TIMELINE
Budget: ${formValues.budget === 'Custom Budget' ? formValues.customBudgetDetails : formValues.budget}
Timeline: ${formValues.timeline === 'Custom Timeline' ? formValues.customTimelineDetails : formValues.timeline}

MEETING
Meeting Format: ${formValues.meetingType}
${formValues.meetingType === 'Offline' ? `Preferred Date/Time: ${formValues.meetingDate} at ${formValues.meetingTime}` : ''}
=============================================
Thank you for connecting with ATIDETO!
We will review your inquiry and get back to you within 24 hours.
    `;

    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ATIDETO-Inquiry-${requestId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-12 flex flex-col items-center justify-center text-center">
      {/* 1. Animated Success Checkmark */}
      <div className="relative mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-24 h-24 rounded-full bg-gradient-to-r from-[#5B5EFF] to-[#3A3DFF] flex items-center justify-center shadow-[0_0_30px_rgba(91,94,255,0.4)]"
        >
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Check className="w-12 h-12 text-white" strokeWidth={3} />
          </motion.div>
        </motion.div>
      </div>

      {/* 2. Heading & Subtitle */}
      <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
        Thank You!
      </h1>
      <p className="text-[#AFAFAF] text-lg md:text-xl max-w-lg leading-relaxed mb-10">
        Your project request has been submitted successfully.
      </p>

      {/* 3. Details Container */}
      <div className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-6 mb-10 text-left space-y-4 max-w-md mx-auto shadow-2xl">
        <div className="flex justify-between items-center pb-3 border-b border-white/5">
          <span className="text-white/40 text-sm font-semibold">Project ID</span>
          <span className="text-[#5B5EFF] font-mono font-bold text-[16px]">{requestId}</span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-white/5">
          <span className="text-white/40 text-sm font-semibold">Submitted Date</span>
          <span className="text-white text-sm font-medium">{currentDate}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/40 text-sm font-semibold">Estimated Response</span>
          <span className="text-white text-sm font-semibold text-right">Within 24 Hours</span>
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <button
          onClick={handleDownloadSummary}
          className="flex items-center justify-center gap-2 px-8 h-[58px] rounded-full border border-[#5B5EFF]/50 text-white font-bold hover:bg-[#5B5EFF]/10 hover:border-[#5B5EFF] transition-all duration-300 hover:scale-[1.02] cursor-pointer"
        >
          <Download className="w-5 h-5" /> Download Request Summary
        </button>

        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center gap-2 px-8 h-[58px] rounded-full border border-white/10 text-white font-bold hover:bg-white/5 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
        >
          <Home className="w-5 h-5" /> Return Home
        </button>

        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-8 h-[58px] rounded-full bg-gradient-to-r from-[#5B5EFF] to-[#3A3DFF] text-white font-bold hover:shadow-[0_0_25px_rgba(91,94,255,0.4)] transition-all duration-300 hover:scale-[1.02] cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" /> Book Another Project
        </button>
      </div>
    </div>
  );
}
