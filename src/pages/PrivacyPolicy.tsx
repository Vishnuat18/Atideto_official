import SEO from '@/components/seo/SEO';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pt-28 pb-24 px-6 selection:bg-[#3B82F6]/30">
      <SEO
        title="Privacy Policy | Atideto"
        description="Read Atideto's privacy policy. Learn how we collect, use, and protect your personal data when you use our website and services."
        url="https://atideto.in/privacy-policy"
        noindex={false}
      />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-4 border border-[#2EA8FF]/30 bg-[#2EA8FF]/10 text-[#2EA8FF] shadow-[0_0_15px_rgba(46,168,255,0.2)]">
            LEGAL
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Privacy <span className="text-[#3B82F6]">Policy</span>
          </h1>
          <p className="text-[#A7B3C7] text-sm">
            Last updated: September 18, 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-[#C8CED8] leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
            <p>
              Atideto Technologies ("Atideto", "we", "us", or "our") is committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <a href="https://atideto.in" className="text-[#2EA8FF] hover:underline">atideto.in</a> and use our services.
            </p>
            <p>
              By using our website and services, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Information We Collect</h2>
            <h3 className="text-lg font-semibold text-white mb-2">2.1 Personal Information</h3>
            <p>When you interact with our website, we may collect:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Name and contact details (email, phone number)</li>
              <li>Company name and business email</li>
              <li>Project requirements and descriptions</li>
              <li>Account credentials (when you register or login)</li>
              <li>Payment information (processed securely via Stripe)</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mb-2 mt-4">2.2 Automatically Collected Information</h3>
            <p>We automatically collect certain information when you visit our website:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>IP address and browser type</li>
              <li>Device information and operating system</li>
              <li>Pages visited, time spent, and navigation patterns</li>
              <li>Referring URLs and search terms</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Provide, operate, and maintain our website and services</li>
              <li>Process your project inquiries and consultation requests</li>
              <li>Send you project updates, newsletters, and marketing communications (with your consent)</li>
              <li>Improve and personalize your experience on our website</li>
              <li>Analyze website usage to improve our services</li>
              <li>Detect, prevent, and address technical issues and fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Cookies & Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our website. Cookies are small data files stored on your device. We use:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong className="text-white">Essential Cookies:</strong> Required for the website to function properly (session management, security).</li>
              <li><strong className="text-white">Analytics Cookies:</strong> Help us understand how visitors interact with our website (Google Analytics, Microsoft Clarity).</li>
              <li><strong className="text-white">Marketing Cookies:</strong> Used to track visitors across websites for advertising purposes (Meta Pixel, LinkedIn Insight).</li>
            </ul>
            <p className="mt-3">
              You can manage your cookie preferences through our cookie consent banner. You can also set your browser to refuse cookies, though some features may not work properly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Third-Party Services</h2>
            <p>We use the following third-party services that may collect information:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong className="text-white">Google Firebase:</strong> Authentication, database, and cloud functions</li>
              <li><strong className="text-white">Google Analytics (GA4):</strong> Website traffic analytics</li>
              <li><strong className="text-white">Microsoft Clarity:</strong> Session recordings and heatmaps</li>
              <li><strong className="text-white">Stripe:</strong> Payment processing</li>
              <li><strong className="text-white">Vercel:</strong> Website hosting and deployment</li>
            </ul>
            <p className="mt-3">
              Each of these services has its own privacy policy governing the use of your information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information, including HTTPS encryption, secure authentication, access controls, and regular security audits. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Data Retention</h2>
            <p>
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law. Project inquiry data is retained for up to 3 years after the last interaction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Your Rights</h2>
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong className="text-white">Access:</strong> Request a copy of your personal data</li>
              <li><strong className="text-white">Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong className="text-white">Deletion:</strong> Request deletion of your personal data</li>
              <li><strong className="text-white">Objection:</strong> Object to processing of your personal data</li>
              <li><strong className="text-white">Portability:</strong> Request transfer of your data to another service</li>
              <li><strong className="text-white">Withdraw Consent:</strong> Withdraw consent at any time where processing is based on consent</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact us at <a href="mailto:atidetotechnologies@gmail.com" className="text-[#2EA8FF] hover:underline">atidetotechnologies@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Children's Privacy</h2>
            <p>
              Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">11. Governing Law</h2>
            <p>
              This Privacy Policy is governed by and construed in accordance with the laws of India, including the Information Technology Act, 2000, and the Digital Personal Data Protection Act, 2023. Any disputes shall be subject to the exclusive jurisdiction of the courts in Salem, Tamil Nadu, India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">12. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
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
          <Link to="/" className="text-[#2EA8FF] hover:text-white transition-colors text-sm font-medium">
            ← Back to Home
          </Link>
          <Link to="/terms-and-conditions" className="text-[#2EA8FF] hover:text-white transition-colors text-sm font-medium">
            Terms & Conditions →
          </Link>
        </div>
      </div>
    </div>
  );
}
