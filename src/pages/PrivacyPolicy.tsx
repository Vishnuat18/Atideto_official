import SEO from '@/components/seo/SEO';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#050505] min-h-screen text-[#0F172A] dark:text-white pt-28 pb-20 font-sans transition-colors duration-300">
      <SEO 
        title="Privacy Policy | ATIDETO Technologies"
        description="Official Privacy Policy of ATIDETO Technologies. Understand how we collect, protect, and handle client and student personal information."
        url="https://www.atideto.in/privacy-policy"
      />

      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#2F2FE4]/30 bg-[#2F2FE4]/10 text-[#2F2FE4] text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck size={14} /> Official Policy
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-4">Privacy Policy</h1>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-sm md:text-base">
            Last Updated: August 2026 · ATIDETO Technologies (Ponnammapet, Salem, Tamil Nadu)
          </p>
        </div>

        <div className="bg-white dark:bg-[#0A0F1D] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-6 md:p-10 space-y-8 text-sm md:text-base leading-relaxed text-[#334155] dark:text-[#CBD5E1]">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#2F2FE4]" /> 1. Overview & Entity Commitment
            </h2>
            <p>
              ATIDETO Technologies (&quot;ATIDETO&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the official website <a href="https://www.atideto.in" className="text-[#2F2FE4] hover:underline font-semibold">https://www.atideto.in</a>. We are committed to protecting your privacy, personal data, and business intellectual property. This Privacy Policy details our practices concerning the collection, storage, and processing of data received through client project intake forms, academy enrollment, and certificate verification portals.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#2F2FE4]" /> 2. Information We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Client Inquiries:</strong> Full name, business email, phone number, company name, project specifications, technical requirements, and budget parameters.</li>
              <li><strong>Academy & Internship Applicants:</strong> Student name, register number, college/university affiliation, graduation year, degree, and contact details.</li>
              <li><strong>Technical Metadata:</strong> Browser type, device characteristics, IP address, and anonymized usage metrics.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#2F2FE4]" /> 3. How We Use & Protect Your Data
            </h2>
            <p>
              We use collected information solely to deliver customized software proposals, manage active engineering projects, administer internship certificates, and provide customer support. We do not sell, trade, or monetize user data. Non-Disclosure Agreements (NDAs) are executed for enterprise projects to safeguard proprietary business logic.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-[#E2E8F0] dark:border-[#1E293B]">
            <h2 className="text-xl font-bold text-[#0F172A] dark:text-white">4. Official Contact & Data Inquiries</h2>
            <p>
              For privacy requests or data inquiries, contact ATIDETO Technologies at:
            </p>
            <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#050505] border border-[#E2E8F0] dark:border-[#1E293B] space-y-1 text-sm font-medium">
              <p><strong>ATIDETO Technologies</strong></p>
              <p>Ponnammapet, Salem, Tamil Nadu, India — PIN: 636001</p>
              <p>Email: <a href="mailto:atideto.in@gmail.com" className="text-[#2F2FE4]">atideto.in@gmail.com</a></p>
              <p>Phone: <a href="tel:+919087284053" className="text-[#2F2FE4]">+91 9087284053</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
