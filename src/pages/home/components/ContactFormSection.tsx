import { useState } from 'react';
import { MapPin, Mail, Phone, Send, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

export default function ContactFormSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in your name, email, and message.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'project_inquiries'), {
        name,
        email,
        subject: subject || 'General Website Inquiry',
        description: message,
        source: 'home_contact_form',
        status: 'new',
        createdAt: serverTimestamp(),
      });
      toast.success('Thank you! Your message has been sent successfully. Our team will get back to you shortly.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error('Error submitting contact form:', err);
      toast.error('Failed to send message. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-[#050505]">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00C6FF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#3B82F6]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Contact Info */}
          <div className="flex flex-col gap-8 text-left">
            <div>
              <p className="text-[#00C6FF] font-bold tracking-[0.2em] uppercase text-sm mb-4">
                GET IN TOUCH
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-[56px] font-black text-white leading-[1.1] mb-6">
                Ready to Start Your
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C6FF] to-[#3B82F6]">Next Project?</span>
              </h2>
              <p className="text-[#A7B3C7] text-lg leading-relaxed max-w-lg">
                Let's bring your ideas to life. Our team is ready to help you build something amazing.
              </p>
            </div>

            <div className="flex flex-col gap-8 mt-4">
              {/* Location */}
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-[#1A1A24] border border-white/5 flex items-center justify-center shrink-0">
                  <MapPin size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Our Office</h4>
                  <p className="text-[#A7B3C7]">Salem, Tamil Nadu, India</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-[#1A1A24] border border-white/5 flex items-center justify-center shrink-0">
                  <Mail size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Email Us</h4>
                  <p className="text-[#A7B3C7]">atideto.in@gmail.com</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-[#1A1A24] border border-white/5 flex items-center justify-center shrink-0">
                  <Phone size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Call Us</h4>
                  <p className="text-[#00C6FF] font-medium">+91 9087284053</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-[#101018]/80 backdrop-blur-md rounded-[32px] p-8 md:p-12 border border-white/5 shadow-2xl relative">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-white/60 text-xs font-bold tracking-widest uppercase">Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-white rounded-lg px-4 py-3.5 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00C6FF] transition-all"
                  />
                </div>
                
                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-white/60 text-xs font-bold tracking-widest uppercase">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@company.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white rounded-lg px-4 py-3.5 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00C6FF] transition-all"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-2">
                <label className="text-white/60 text-xs font-bold tracking-widest uppercase">Subject</label>
                <input 
                  type="text" 
                  placeholder="Project Inquiry" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-white rounded-lg px-4 py-3.5 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00C6FF] transition-all"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label className="text-white/60 text-xs font-bold tracking-widest uppercase">Message</label>
                <textarea 
                  placeholder="Detail your requirements..." 
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="bg-transparent border border-white/10 rounded-lg px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#00C6FF] transition-all resize-none"
                />
              </div>

              {/* Submit Button with Rich Animation */}
              <button 
                type="submit"
                disabled={isSubmitting}
                className="group/btn relative overflow-hidden mt-4 w-full bg-gradient-to-r from-[#00C6FF] via-[#0094FF] to-[#0066FF] hover:from-[#00D4FF] hover:via-[#00A3FF] hover:to-[#0077FF] border border-white/25 text-white font-extrabold text-base sm:text-lg rounded-xl py-4 px-6 flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] shadow-[0_0_25px_rgba(0,198,255,0.45)] hover:shadow-[0_0_35px_rgba(0,198,255,0.75),0_0_55px_rgba(0,102,255,0.3)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {/* Light Sweep Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />

                {/* Subtle Top Radial Highlight */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/25 via-transparent to-transparent pointer-events-none" />

                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>Sending... <Loader2 size={18} className="animate-spin" /></>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send 
                        size={18} 
                        className="transition-transform duration-300 ease-out group-hover/btn:translate-x-1.5 group-hover/btn:-translate-y-1 group-hover/btn:rotate-12 shrink-0 drop-shadow" 
                      />
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </section>
  );
}
