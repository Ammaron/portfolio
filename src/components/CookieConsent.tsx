'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/i18n-context';
import { usePathname } from 'next/navigation';

interface CookieConsentProps {
  onConsentChange?: (consented: boolean) => void;
}

export default function CookieConsent({ onConsentChange }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useI18n();
  const pathname = usePathname();
  
  // Extract locale from pathname (e.g., '/en/about' -> 'en')
  const locale = pathname.split('/')[1] || 'en';

  useEffect(() => {
    // Check if user has already made a choice
    const consentStatus = localStorage.getItem('cookie-consent');
    
    if (consentStatus === null) {
      // Show banner after a brief delay to avoid layout shift
      setTimeout(() => {
        setShowBanner(true);
        setTimeout(() => setIsVisible(true), 100);
      }, 2000);
    } else {
      // User has already made a choice, inform Clarity
      const hasConsented = consentStatus === 'accepted';
      informClarity(hasConsented);
      onConsentChange?.(hasConsented);
    }
  }, [onConsentChange]);

  const informClarity = (consented: boolean) => {
    // Inform Microsoft Clarity about consent status
    if (typeof window !== 'undefined') {
      const windowWithClarity = window as Window & { clarity?: (action: string, value: boolean) => void };
      if (windowWithClarity.clarity) {
        windowWithClarity.clarity('consent', consented);
      }
    }
  };

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    informClarity(true);
    onConsentChange?.(true);
    hideBanner();
    
    // Fire custom event for other components that might be listening
    window.dispatchEvent(new CustomEvent('consentGranted'));
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    informClarity(false);
    onConsentChange?.(false);
    hideBanner();
  };

  const hideBanner = () => {
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  if (!showBanner) return null;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Content */}
            <div className="flex-1">
              <div className="flex items-start gap-3">
                {/* Cookie Icon */}
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {t('cookieConsent', 'title') || 'Cookie Policy'}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    {t('cookieConsent', 'description') || 
                    'This website uses Microsoft Clarity to understand how visitors use our site and make improvements. We do not use advertising or social media tracking.'}
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-3 h-3 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      {t('cookieConsent', 'feature1') || 'Essential cookies for site functionality'}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-3 h-3 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      {t('cookieConsent', 'feature2') || 'Website usage insights to improve your experience'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 lg:flex-row lg:w-auto lg:flex-wrap lg:justify-end">
              <button
                onClick={handleAccept}
                className="btn-authority btn-primary-authority text-sm px-4 py-2 hover:scale-105 transition-all duration-200 whitespace-nowrap"
              >
                {t('cookieConsent', 'accept') || 'Got It'}
              </button>
              <button
                onClick={handleDecline}
                className="btn-authority btn-secondary-authority text-sm px-4 py-2 hover:scale-105 transition-all duration-200 whitespace-nowrap"
              >
                {t('cookieConsent', 'decline') || 'No Thanks'}
              </button>
              
              {/* Privacy Policy Link */}
              <div className="flex items-center justify-center sm:justify-start lg:w-full lg:justify-center lg:mt-2">
                <a 
                  href={`/${locale}/privacy-policy`}
                  className="text-xs text-gray-500 hover:text-primary transition-colors underline"
                >
                  {t('cookieConsent', 'privacyPolicy') || 'Privacy Policy'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}