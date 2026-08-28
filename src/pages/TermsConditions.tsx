import SEO from '@/components/seo/SEO';
import { FileCheck, Shield, CheckCircle, HelpCircle } from 'lucide-react';

export default function TermsConditions() {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#050505] min-h-screen text-[#0F172A] dark:text-white pt-28 pb-20 font-sans transition-colors duration-300">
      <SEO 
        title="Terms & Conditions | ATIDETO Technologies"
        description="Official Terms and Conditions for software engineering services, web/mobile development contracts, and academy programs by ATIDETO Technologies."
        url="https://www.atideto.in/terms-and-conditions"
      />

      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#2F2FE4]/30 bg-[#2F2FE4]/10 text-[#2F2FE4] text-xs font-bold uppercase tracking-wider mb-4">
            <FileCheck size={14} /> Service Terms
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-4">Terms & Conditions</h1>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-sm md:text-base">
            Effective Date: August 2026 · ATIDETO Technologies (Ponnammapet, Salem, Tamil Nadu)
          </p>
        </div>

        <div className="bg-white dark:bg-[#0A0F1D] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-6 md:p-10 space-y-8 text-sm md:text-base leading-relaxed text-[#334155] dark:text-[#CBD5E1]">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#2F2FE4]" /> 1. Agreement to Terms
            </h2>
            <p>
              By accessing or using the website <a href="https://www.atideto.in" className="text-[#2F2FE4] hover:underline font-semibold">https://www.atideto.in</a>, engaging our custom software development services, or enrolling in ATIDETO Academy internships, you agree to be bound by these Terms and Conditions established by ATIDETO Technologies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#2F2FE4]" /> 2. Software Development & Client Engagements
            </h2>
            <p>
              All software development, UI/UX design, cloud architecture, and AI automation deliverables are governed by individual Statement of Work (SOW) agreements. Intellectual property rights for custom-developed codebases transfer to the client upon full payment according to contract milestones.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#2F2FE4]" /> 3. Academy & Certification Integrity
            </h2>
            <p>
              Internship completion certificates issued by ATIDETO Technologies contain cryptographically verifiable IDs. Any fraudulent reproduction, unauthorized alteration, or misrepresentation of ATIDETO credentials is strictly prohibited and subject to immediate revocation.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-[#E2E8F0] dark:border-[#1E293B]">
            <h2 className="text-xl font-bold text-[#0F172A] dark:text-white">4. Governing Law & Contact</h2>
            <p>
              These terms are governed by the laws of India and the jurisdiction of courts in Salem, Tamil Nadu. For inquiries:
            </p>
            <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#050505] border border-[#E2E8F0] dark:border-[#1E293B] space-y-1 text-sm font-medium">
              <p><strong>ATIDETO Technologies</strong></p>
              <p>Ponnammapet, Salem, Tamil Nadu, India — PIN: 636001</p>
              <p>Email: <a href="mailto:atideto.in@gmail.com" className="text-[#2F2FE4]">atideto.in@gmail.com</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
