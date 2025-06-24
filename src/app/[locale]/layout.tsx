import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { I18nProvider } from '@/i18n/i18n-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import ContactWidget from '@/components/ContactWidget';
import { Toaster } from 'react-hot-toast';

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;

}

// This function validates that the locale is supported
function isValidLocale(locale: string): locale is 'en' | 'es' {
  return ['en', 'es'].includes(locale);
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  // Await the params before using its properties
  const { locale } = await params;
  
  // Validate the locale parameter
  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <I18nProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
      
      {/* Cookie Consent Banner */}
      <CookieConsent />
      
      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      
      {/* Professional Contact Widget */}
      <ContactWidget />
    </I18nProvider>
  );
}

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'es' }
  ];
}