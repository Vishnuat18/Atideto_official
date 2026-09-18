import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

type ConsentState = {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
};

const CONSENT_KEY = 'atideto_cookie_consent';
const CONSENT_TIMESTAMP_KEY = 'atideto_cookie_consent_at';

function getStoredConsent(): ConsentState | null {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return null;
}

function storeConsent(consent: ConsentState) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  localStorage.setItem(CONSENT_TIMESTAMP_KEY, new Date().toISOString());
}

/**
 * Call this from analytics scripts to check if consent was given.
 * Usage: if (hasAnalyticsConsent()) { loadGA4(); }
 */
export function hasAnalyticsConsent(): boolean {
  const consent = getStoredConsent();
  return consent?.analytics ?? false;
}

export function hasMarketingConsent(): boolean {
  const consent = getStoredConsent();
  return consent?.marketing ?? false;
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allConsent: ConsentState = { essential: true, analytics: true, marketing: true };
    storeConsent(allConsent);
    setConsent(allConsent);
    setVisible(false);
    // Reload to activate analytics scripts
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: allConsent }));
  };

  const handleRejectAll = () => {
    const minimalConsent: ConsentState = { essential: true, analytics: false, marketing: false };
    storeConsent(minimalConsent);
    setConsent(minimalConsent);
    setVisible(false);
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: minimalConsent }));
  };

  const handleSavePreferences = () => {
    storeConsent(consent);
    setVisible(false);
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: consent }));
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6"
        >
          <div className="max-w-3xl mx-auto bg-[#0A0E1A]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_-8px_40px_rgba(0,0,0,0.5)] p-5 sm:p-6">
            {/* Header Row */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2EA8FF]/15 border border-[#2EA8FF]/30 flex items-center justify-center shrink-0">
                  <Cookie size={18} className="text-[#2EA8FF]" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm sm:text-base">Cookie Preferences</h3>
                  <p className="text-[#A7B3C7] text-xs sm:text-sm mt-0.5">
                    We use cookies to enhance your experience and analyze site traffic.{' '}
                    <Link to="/privacy-policy" className="text-[#2EA8FF] hover:underline">
                      Learn more
                    </Link>
                  </p>
                </div>
              </div>
              <button
                onClick={handleRejectAll}
                className="text-white/40 hover:text-white transition-colors shrink-0 p-1"
                aria-label="Close cookie banner"
              >
                <X size={18} />
              </button>
            </div>

            {/* Manage Preferences Toggle */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1.5 text-[#2EA8FF] text-xs font-medium hover:text-white transition-colors mb-4"
            >
              {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {showDetails ? 'Hide' : 'Manage'} Preferences
            </button>

            {/* Expandable Preferences */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 mb-5 pb-4 border-b border-white/5">
                    {/* Essential — always on */}
                    <label className="flex items-center justify-between cursor-not-allowed">
                      <div>
                        <span className="text-white text-sm font-medium">Essential</span>
                        <p className="text-[#A7B3C7] text-xs">Required for the website to function</p>
                      </div>
                      <div className="w-10 h-5 rounded-full bg-[#2EA8FF] flex items-center px-0.5 opacity-60">
                        <div className="w-4 h-4 rounded-full bg-white ml-auto" />
                      </div>
                    </label>

                    {/* Analytics */}
                    <label className="flex items-center justify-between cursor-pointer group">
                      <div>
                        <span className="text-white text-sm font-medium group-hover:text-[#2EA8FF] transition-colors">Analytics</span>
                        <p className="text-[#A7B3C7] text-xs">Google Analytics, Microsoft Clarity</p>
                      </div>
                      <button
                        onClick={() => setConsent(c => ({ ...c, analytics: !c.analytics }))}
                        className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors duration-200 ${
                          consent.analytics ? 'bg-[#2EA8FF]' : 'bg-white/20'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                          consent.analytics ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </label>

                    {/* Marketing */}
                    <label className="flex items-center justify-between cursor-pointer group">
                      <div>
                        <span className="text-white text-sm font-medium group-hover:text-[#2EA8FF] transition-colors">Marketing</span>
                        <p className="text-[#A7B3C7] text-xs">Meta Pixel, LinkedIn Insight Tag</p>
                      </div>
                      <button
                        onClick={() => setConsent(c => ({ ...c, marketing: !c.marketing }))}
                        className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors duration-200 ${
                          consent.marketing ? 'bg-[#2EA8FF]' : 'bg-white/20'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                          consent.marketing ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {showDetails ? (
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 px-5 py-2.5 rounded-xl bg-[#2EA8FF] hover:bg-[#1A8FE8] text-white font-bold text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(46,168,255,0.4)]"
                >
                  Save Preferences
                </button>
              ) : (
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 px-5 py-2.5 rounded-xl bg-[#2EA8FF] hover:bg-[#1A8FE8] text-white font-bold text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(46,168,255,0.4)]"
                >
                  Accept All
                </button>
              )}
              <button
                onClick={handleRejectAll}
                className="flex-1 px-5 py-2.5 rounded-xl border border-white/15 text-white/80 hover:text-white hover:border-white/30 font-medium text-sm transition-all duration-200"
              >
                Reject Non-Essential
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
