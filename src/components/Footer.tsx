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
  };
  
  return (
    <footer className="bg-gray-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold text-primary mb-4">Mr<span className="text-secondary">McDonald</span></h2>
            <p className="mb-4">{t('footer', 'description')}</p>
            <p className="mb-4">{t('footer', 'bilingual')}</p>
            <div className="flex space-x-4 mt-4">
              <a href="https://linkedin.com/in/ammaron" target="_blank" rel="noopener noreferrer" className="text-gray hover:text-primary transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="mailto:ammaron99@gmail.com" className="text-gray hover:text-primary transition-colors">
                <span className="sr-only">Email</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
              </a>
              <a href="https://wa.me/4358936006" target="_blank" rel="noopener noreferrer" className="text-gray hover:text-primary transition-colors">
                <span className="sr-only">WhatsApp</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer', 'quickLinks')}</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-primary transition-colors">{t('nav', 'home')}</Link></li>
              <li><Link href="/teachers-pay-teachers" className="hover:text-primary transition-colors">{t('nav', 'teachersPayTeachers')}</Link></li>
              <li><Link href="/english-classes" className="hover:text-primary transition-colors">{t('nav', 'englishClasses')}</Link></li>
              <li><Link href="/#contact" className="hover:text-primary transition-colors">{t('nav', 'contact')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer', 'newsletter')}</h3>
            {!subscribed ? (
              <form onSubmit={handleSubmit} className="space-y-2">
                <p className="text-sm">{t('footer', 'subscribeText')}</p>
                <div className="flex mt-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('footer', 'emailPlaceholder')}
                    required
                    className="px-3 py-2 bg-gray-dark border border-gray text-white rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-r-md transition-colors"
                  >
                    {t('footer', 'subscribeButton')}
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-accent">{t('footer', 'thankYou')}</p>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Kirby McDonald. {t('footer', 'copyright')}</p>
          <p className="mt-2">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">{t('footer', 'privacyPolicy')}</Link>
            {' • '}
            <Link href="/terms-of-service" className="hover:text-primary transition-colors">{t('footer', 'termsOfService')}</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
