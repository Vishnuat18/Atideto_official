import SEO from '@/components/seo/SEO';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function TermsAndConditions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pt-28 pb-24 px-6 selection:bg-[#3B82F6]/30">
      <SEO
        title="Terms & Conditions | Atideto"
        description="Read Atideto's terms and conditions governing the use of our website and software development services."
        url="https://atideto.in/terms-and-conditions"
        noindex={false}
      />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-4 border border-[#2EA8FF]/30 bg-[#2EA8FF]/10 text-[#2EA8FF] shadow-[0_0_15px_rgba(46,168,255,0.2)]">
            LEGAL
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Terms & <span className="text-[#3B82F6]">Conditions</span>
          </h1>
          <p className="text-[#A7B3C7] text-sm">
            Last updated: September 18, 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-[#C8CED8] leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing or using the website <a href="https://atideto.in" className="text-[#2EA8FF] hover:underline">atideto.in</a> ("Website") operated by Atideto Technologies ("Atideto", "we", "us", or "our"), you agree to be bound by these Terms and Conditions ("Terms"). If you disagree with any part of these Terms, you may not access the Website or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Services</h2>
            <p>Atideto provides software development, web and mobile application development, AI and automation solutions, cloud infrastructure services, and technology education through our Academy program. Our services include but are not limited to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Custom software development and engineering</li>
              <li>Web application and website development</li>
              <li>Mobile application development (iOS and Android)</li>
              <li>AI/ML integration and automation solutions</li>
              <li>Cloud architecture and DevOps</li>
              <li>Enterprise solutions (CRM, ERP, LMS, etc.)</li>
              <li>Technology internship and training programs (Atideto Academy)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. User Accounts</h2>
            <p>
              When you create an account on our Website, you are responsible for maintaining the security of your account and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
            </p>
            <p>
              We reserve the right to suspend or terminate your account if we believe your conduct violates these Terms, is harmful to other users, or is harmful to us or third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Project Engagements</h2>
            <p>
              Project engagements initiated through the Client Connect portal are subject to a separate Statement of Work (SOW) or service agreement. Submission of a project inquiry through our Website does not constitute a binding contract. A formal engagement begins only upon mutual agreement and signing of the relevant service agreement.
            </p>
            <p className="mt-2">
              Project timelines, deliverables, and costs discussed during the inquiry phase are estimates and subject to change upon detailed scope analysis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Intellectual Property</h2>
            <h3 className="text-lg font-semibold text-white mb-2">5.1 Our Content</h3>
            <p>
              The Website and its original content, features, and functionality are owned by Atideto Technologies and are protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit any of our content without prior written permission.
            </p>
            <h3 className="text-lg font-semibold text-white mb-2 mt-4">5.2 Client Work</h3>
            <p>
              Intellectual property rights for custom software developed under a service agreement are governed by the terms of that specific agreement. Unless otherwise stated in the SOW, upon full payment, the client receives full ownership of the custom code developed specifically for their project.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Atideto Academy</h2>
            <p>
              Participation in Atideto Academy programs (internships, courses, and training) is subject to the following:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Acceptance is at our sole discretion based on application review</li>
              <li>Course materials and training content are proprietary and may not be shared, reproduced, or distributed</li>
              <li>Certificates are issued upon successful completion and are non-transferable</li>
              <li>We reserve the right to modify program content, schedules, and pricing at any time</li>
              <li>Refund policies are outlined at the time of enrollment</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Acceptable Use</h2>
            <p>You agree not to use the Website to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Transmit any viruses, malware, or harmful code</li>
              <li>Attempt to gain unauthorized access to our systems or user accounts</li>
              <li>Interfere with or disrupt the Website or its servers</li>
              <li>Scrape, data mine, or harvest any content from the Website</li>
              <li>Use automated tools to access the Website without our permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Payment Terms</h2>
            <p>
              Payments for services and academy programs are processed securely through Stripe. All prices are listed in the applicable currency and are exclusive of taxes unless stated otherwise. Payment terms for custom projects are defined in the respective service agreement.
            </p>
            <p className="mt-2">
              We reserve the right to suspend services for accounts with outstanding payments beyond the agreed payment terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, Atideto Technologies shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Your access to or use of (or inability to access or use) the Website</li>
              <li>Any conduct or content of any third party on the Website</li>
              <li>Any content obtained from the Website</li>
              <li>Unauthorized access, use, or alteration of your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Disclaimer of Warranties</h2>
            <p>
              The Website is provided on an "AS IS" and "AS AVAILABLE" basis. Atideto makes no warranties, expressed or implied, regarding the operation of the Website, the information, content, or materials included on the Website. We do not warrant that the Website will be uninterrupted, error-free, or free of viruses or other harmful components.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">11. Third-Party Links</h2>
            <p>
              Our Website may contain links to third-party websites or services that are not owned or controlled by Atideto. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">12. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless Atideto Technologies, its officers, directors, employees, and agents, from any claims, damages, obligations, losses, liabilities, costs, or expenses arising from your use of the Website or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">13. Modifications to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. Your continued use of the Website after any changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">14. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">15. Governing Law & Jurisdiction</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of India. Any disputes arising from or relating to these Terms or the use of the Website shall be subject to the exclusive jurisdiction of the courts in Salem, Tamil Nadu, India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">16. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us:</p>
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mt-3 space-y-2">
              <p><strong className="text-white">Atideto Technologies</strong></p>
              <p>Salem, Tamil Nadu, India</p>
              <p>Email: <a href="mailto:atidetotechnologies@gmail.com" className="text-[#2EA8FF] hover:underline">atidetotechnologies@gmail.com</a></p>
              <p>Phone: <a href="tel:+919087284053" className="text-[#2EA8FF] hover:underline">+91 9087284053</a></p>
            </div>
          </section>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap gap-4 justify-between items-center">
          <Link to="/privacy-policy" className="text-[#2EA8FF] hover:text-white transition-colors text-sm font-medium">
            ← Privacy Policy
          </Link>
          <Link to="/" className="text-[#2EA8FF] hover:text-white transition-colors text-sm font-medium">
            Back to Home →
          </Link>
        </div>
      </div>
    </div>
  );
}
