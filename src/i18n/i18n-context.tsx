'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { translations } from './translations';

type Locale = 'en' | 'es';

interface I18nContextType {
  locale: Locale;
  t: (section: string, key: string) => string;
  tRaw: (section: string, key: string) => any;
  changeLocale: (newLocale: Locale) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const [isHydrated, setIsHydrated] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
    
    // Check URL for locale parameter first
    const urlLang = searchParams.get('lang');
    if (urlLang === 'es' || urlLang === 'en') {
      setLocale(urlLang);
      if (typeof window !== 'undefined') {
        localStorage.setItem('locale', urlLang);
        document.documentElement.lang = urlLang;
      }
      return;
    }

    // Check pathname for locale prefix
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments[0] === 'es' || pathSegments[0] === 'en') {
      setLocale(pathSegments[0] as Locale);
      if (typeof window !== 'undefined') {
        localStorage.setItem('locale', pathSegments[0]);
        document.documentElement.lang = pathSegments[0];
      }
      return;
    }
    
    // Check localStorage
    const storedLocale = localStorage.getItem('locale');
    if (storedLocale === 'en' || storedLocale === 'es') {
      setLocale(storedLocale);
      return;
    }
    
    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'es') {
      setLocale('es');
    }
  }, [searchParams, pathname]);

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
      document.documentElement.lang = newLocale;
      
      // Update URL with new locale
      const currentPath = pathname;
      const segments = currentPath.split('/').filter(Boolean);
      
      // Remove existing locale if present
      if (segments[0] === 'en' || segments[0] === 'es') {
        segments.shift();
      }
      
      // Add new locale
      const newPath = `/${newLocale}${segments.length > 0 ? '/' + segments.join('/') : ''}`;
      router.push(newPath);
    }
  };

  // Use the effective locale consistently throughout
  const effectiveLocale = isHydrated ? locale : 'en';

  const getNestedValue = (section: string, key: string): any => {
    try {
      const sectionData = translations[effectiveLocale][section as keyof typeof translations[typeof effectiveLocale]];
      if (!sectionData) {
        console.warn(`Translation section missing: ${effectiveLocale}.${section}`);
        return null;
      }

      const keys = key.split('.');
      let value: any = sectionData;
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          console.warn(`Translation key missing: ${effectiveLocale}.${section}.${key}`);
          return null;
        }
      }

      return value;
    } catch (error) {
      console.error(`Translation error: ${effectiveLocale}.${section}.${key}`, error);
      return null;
    }
  };

  const t = (section: string, key: string): string => {
    const value = getNestedValue(section, key);
    
    if (typeof value === 'string') {
      return value;
    } else {
      console.warn(`Translation value is not a string: ${effectiveLocale}.${section}.${key}`);
      return `${section}.${key}`;
    }
  };

  const tRaw = (section: string, key: string): any => {
    return getNestedValue(section, key);
  };

  return (
    <I18nContext.Provider value={{ 
      locale: effectiveLocale, 
      t, 
      tRaw, 
      changeLocale 
    }}>
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