import { MapPin, Mail, Phone, Send } from 'lucide-react';

export default function ContactFormSection() {
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
            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#64748B] text-xs font-bold tracking-widest uppercase">Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    className="bg-white rounded-lg px-4 py-3.5 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F2FE4] transition-all"
                  />
                </div>
                
                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#64748B] text-xs font-bold tracking-widest uppercase">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@company.com" 
                    className="bg-white rounded-lg px-4 py-3.5 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F2FE4] transition-all"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-2">
                <label className="text-[#64748B] text-xs font-bold tracking-widest uppercase">Subject</label>
                <input 
                  type="text" 
                  placeholder="Project Inquiry" 
                  className="bg-white rounded-lg px-4 py-3.5 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F2FE4] transition-all"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label className="text-[#64748B] text-xs font-bold tracking-widest uppercase">Message</label>
                <textarea 
                  placeholder="Detail your requirements..." 
                  rows={4}
                  className="bg-white border border-[#CBD5E1] rounded-lg px-4 py-3.5 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2F2FE4] transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                className="mt-4 bg-[#2F2FE4] hover:bg-[#4F46E5] text-white font-bold text-lg rounded-xl py-4 px-6 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(47,47,228,0.3)]"
              >
                Send Message <Send size={18} className="ml-1" />
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </section>
  );
}
