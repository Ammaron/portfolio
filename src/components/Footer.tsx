'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n/i18n-context';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { t } = useI18n();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would connect to a newsletter service
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };
  
  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-primary rounded-full blur-3xl max-w-[calc(100vw-80px)]"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-warm rounded-full blur-3xl max-w-[calc(100vw-80px)]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-accent rounded-full blur-3xl max-w-[calc(100vw-40px)]"></div>
      </div>
      
      <div className="container-authority relative z-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Brand & Description */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Link href="/" className="inline-block group">
                <span className="text-4xl font-black tracking-tight break-words">
                  <span className="gradient-text-authority">Mr. </span>
                  <span className="gradient-text-warm">McDonald</span>
                </span>
              </Link>
              <div className="mt-2 text-gray-300 font-medium">
                Educational Leader | MBA | Technology Innovator
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-8 max-w-lg">
              {t('footer', 'description')}
            </p>
            
            <p className="text-gray-400 mb-8 max-w-lg">
              {t('footer', 'bilingual')}
            </p>
            
            {/* Professional Social Links */}
            <div className="flex flex-wrap gap-4 mb-8">
              <a 
                href="https://linkedin.com/in/ammaron" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
                aria-label="LinkedIn Professional Profile"
              >
                <svg className="h-6 w-6 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              
              <a 
                href="mailto:kirby@mrmcdonald.org" 
                className="group w-12 h-12 bg-gradient-warm rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-warm/25"
                aria-label="Professional Email Contact"
              >
                <svg className="h-6 w-6 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
              </a>
              
              <a 
                href="https://wa.me/51904975329" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-accent/25"
                aria-label="WhatsApp Professional Contact"
              >
                <svg className="h-6 w-6 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              
              <a 
                href="/resume.pdf" 
                className="group w-12 h-12 bg-gradient-authority rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
                aria-label="Download Professional Resume"
              >
                <svg className="h-6 w-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </a>
            </div>
            
            {/* LinkedIn Profile Badge - Official or Fallback */}
            <div className="mb-6">
              {process.env.NODE_ENV === 'production' ? (
                // Official LinkedIn Badge (Production)
                <div className="text-center">
                  <div 
                    className="badge-base LI-profile-badge inline-block" 
                    data-locale="en_US" 
                    data-size="medium" 
                    data-theme="dark" 
                    data-type="VERTICAL" 
                    data-vanity="ammaron" 
                    data-version="v1"
                  >
                    <a 
                      className="badge-base__link LI-simple-link text-blue-400 hover:text-blue-300 transition-colors" 
                      href="https://www.linkedin.com/in/ammaron?trk=profile-badge"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Kirby M.
                    </a>
                  </div>
                </div>
              ) : (
                // Custom LinkedIn Card (Development)
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">Kirby McDonald</h4>
                      <p className="text-blue-100 text-sm">Educational Leader, MBA</p>
                      <p className="text-blue-200 text-xs">Cedar City, Utah</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-blue-500/30">
                    <a 
                      href="https://www.linkedin.com/in/ammaron"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 text-white hover:text-blue-100 transition-colors duration-300"
                    >
                      <span className="text-sm font-medium">Connect on LinkedIn</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 gradient-text-authority">{t('footer', 'quickLinks')}</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <svg className="w-4 h-4 mr-2 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {t('nav', 'home')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/teachers-pay-teachers" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <svg className="w-4 h-4 mr-2 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {t('nav', 'teachersPayTeachers')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/english-classes" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <svg className="w-4 h-4 mr-2 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  {t('nav', 'englishClasses')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/#contact" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <svg className="w-4 h-4 mr-2 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {t('nav', 'contact')}
                </Link>
              </li>
            </ul>
            
            {/* Professional Credentials */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h4 className="text-sm font-semibold text-gray-400 mb-3">{t('footer', 'professionalCredentials')}</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                  {t('footer', 'mbaBusinessLeadership')}
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-warm rounded-full mr-2"></span>
                  {t('footer', 'educationalLeadership')}
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  {t('footer', 'technologyFocus')}
                </div>
              </div>
            </div>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-6 gradient-text-warm">{t('footer', 'newsletter')}</h3>
            
            {!subscribed ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {t('footer', 'subscribeText')}
                </p>
                
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('footer', 'emailPlaceholder')}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 pr-12"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full btn-authority btn-primary-authority"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  {t('footer', 'subscribeButton')}
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-success to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-success font-medium">{t('footer', 'thankYou')}</p>
              </div>
            )}
            
            {/* Professional Features */}
            <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <h4 className="text-sm font-semibold text-gray-300 mb-3">{t('footer', 'newsletterFeatures')}</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex items-center">
                  <svg className="w-3 h-3 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {t('footer', 'leadershipInsights')}
                </li>
                <li className="flex items-center">
                  <svg className="w-3 h-3 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {t('footer', 'businessTips')}
                </li>
                <li className="flex items-center">
                  <svg className="w-3 h-3 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {t('footer', 'edTechTrends')}
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="text-center lg:text-left">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Kirby McDonald. {t('footer', 'copyright')}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {t('footer', 'locationTitle')}
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-6 text-sm">
              <Link 
                href="/privacy-policy" 
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                {t('footer', 'privacyPolicy')}
              </Link>
              <Link 
                href="/terms-of-service" 
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                {t('footer', 'termsOfService')}
              </Link>
              <div className="text-gray-500">•</div>
              <div className="text-gray-500 text-xs">
                {t('footer', 'professionalWebsite')}
              </div>
            </div>
          </div>
          
          {/* Professional Recognition */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 text-xs text-gray-500">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-gradient-primary rounded-full mr-2"></span>
                {t('footer', 'managementAward')}
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-gradient-warm rounded-full mr-2"></span>
                {t('footer', 'programGrowth')}
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-gradient-accent rounded-full mr-2"></span>
                {t('footer', 'bilingualExpertise')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}