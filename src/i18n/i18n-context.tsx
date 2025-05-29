'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from './translations';

type Locale = 'en' | 'es';
type TranslationKey = keyof typeof translations.en | keyof typeof translations.es;

interface I18nContextType {
  locale: Locale;
  t: (section: string, key: string) => string;
  changeLocale: (newLocale: Locale) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    // Detect browser language on client side
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'es') {
      setLocale('es');
    }
    
    // Check for stored preference
    const storedLocale = localStorage.getItem('locale');
    if (storedLocale === 'en' || storedLocale === 'es') {
      setLocale(storedLocale);
    }
  }, []);

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
    document.documentElement.lang = newLocale;
  };

  const t = (section: string, key: string): string => {
    try {
      // @ts-ignore - Dynamic access
      return translations[locale][section][key] || `${section}.${key}`;
    } catch (error) {
      console.error(`Translation missing: ${locale}.${section}.${key}`);
      return `${section}.${key}`;
    }
  };

  return (
    <I18nContext.Provider value={{ locale, t, changeLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
