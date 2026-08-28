import { useState } from 'react';
import { MapPin, Mail, Phone, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const generatedId = `ATD-MSG-${Date.now().toString().slice(-6)}`;
      await addDoc(collection(db, 'contact_messages'), {
        messageId: generatedId,
        createdAt: serverTimestamp(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || 'General Inquiry',
        message: formData.message.trim(),
        status: 'new',
      });

      // Queue mail notification
      try {
        await addDoc(collection(db, 'mail'), {
          to: ['kiranbalasopatil33@gmail.com', 'vishnurajan24766@gmail.com', 'yogeshbrf2006@gmail.com'],
          message: {
            subject: `Contact Form: ${formData.subject || 'New Message'} from ${formData.name}`,
            text: `New contact message received:\nName: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\nMessage: ${formData.message}\nMessage ID: ${generatedId}`,
          },
        });
      } catch (mailErr) {
        console.warn('Mail queue warning:', mailErr);
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Contact form submission error:', err);
      setErrorMsg('Failed to send message. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-[#F8FAFC]">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2F2FE4]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#2F2FE4]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Contact Info */}
          <div className="flex flex-col gap-8 text-left">
            <div>
              <p className="text-[#2F2FE4] font-bold tracking-[0.2em] uppercase text-sm mb-4">
                GET IN TOUCH
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-[56px] font-black text-[#0F172A] leading-[1.1] mb-6">
                Ready to Start Your
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2F2FE4] to-[#4F46E5]">Next Project?</span>
              </h2>
              <p className="text-[#64748B] text-lg leading-relaxed max-w-lg">
                Let's bring your ideas to life. Our team is ready to help you build something amazing.
              </p>
            </div>

            <div className="flex flex-col gap-8 mt-4">
              {/* Location */}
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center shrink-0">
                  <MapPin size={24} className="text-[#0F172A]" />
                </div>
                <div>
                  <h4 className="text-[#0F172A] font-bold text-lg">Our Office</h4>
                  <p className="text-[#64748B]">Salem, Tamil Nadu, India</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center shrink-0">
                  <Mail size={24} className="text-[#0F172A]" />
                </div>
                <div>
                  <h4 className="text-[#0F172A] font-bold text-lg">Email Us</h4>
                  <p className="text-[#64748B]">atideto.in@gmail.com</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center shrink-0">
                  <Phone size={24} className="text-[#0F172A]" />
                </div>
                <div>
                  <h4 className="text-[#0F172A] font-bold text-lg">Call Us</h4>
                  <p className="text-[#2F2FE4] font-medium">+91 9087284053</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white/90 backdrop-blur-md rounded-[32px] p-8 md:p-12 border border-[#E2E8F0] shadow-2xl relative">
            {submitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#00D26A]/20 flex items-center justify-center text-[#00D26A] mb-4">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Message Sent!</h3>
                <p className="text-[#64748B] text-sm max-w-sm mb-6">
                  Thank you for getting in touch. Our team will get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-[#2F2FE4] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#4F46E5] transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#64748B] text-xs font-bold tracking-widest uppercase">Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="John Doe" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white border border-[#CBD5E1] rounded-lg px-4 py-3.5 text-[#0F172A] placeholder:text-gray-400 focus:outline-none focus:border-[#2F2FE4] transition-all"
                    />
                  </div>
                  
                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#64748B] text-xs font-bold tracking-widest uppercase">Email Address *</label>
                    <input 
                      type="email" 
                      required
                      placeholder="john@company.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-white border border-[#CBD5E1] rounded-lg px-4 py-3.5 text-[#0F172A] placeholder:text-gray-400 focus:outline-none focus:border-[#2F2FE4] transition-all"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#64748B] text-xs font-bold tracking-widest uppercase">Subject</label>
                  <input 
                    type="text" 
                    placeholder="Project Inquiry" 
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-white border border-[#CBD5E1] rounded-lg px-4 py-3.5 text-[#0F172A] placeholder:text-gray-400 focus:outline-none focus:border-[#2F2FE4] transition-all"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#64748B] text-xs font-bold tracking-widest uppercase">Message *</label>
                  <textarea 
                    required
                    placeholder="Detail your requirements..." 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-white border border-[#CBD5E1] rounded-lg px-4 py-3.5 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2F2FE4] transition-all resize-none"
                  />
                </div>

                {errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-600">
                    {errorMsg}
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 bg-[#2F2FE4] hover:bg-[#4F46E5] text-white font-bold text-lg rounded-xl py-4 px-6 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(47,47,228,0.3)] disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <Send size={18} className="ml-1" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
}
