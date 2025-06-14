'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, Suspense } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { translations, TranslationStructure } from './translations';

type Locale = 'en' | 'es';

interface I18nContextType {
  locale: Locale;
  t: (namespace: string, key: string) => string;
  tRaw: (namespace: string, key: string) => unknown;
  changeLocale: (newLocale: Locale) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Helper function to safely access nested object properties
function getNestedValue(obj: Record<string, unknown>, path: string[]): unknown {
  return path.reduce((current: unknown, key: string) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function I18nProviderInner({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  
  // Always call hooks - never conditionally
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Handle cases where hooks might return null during SSG
    if (!searchParams || !pathname) {
      // During static generation, try to extract locale from pathname if available
      if (pathname) {
        const pathSegments = pathname.split('/').filter(Boolean);
        if (pathSegments[0] === 'es' || pathSegments[0] === 'en') {
          setLocale(pathSegments[0] as Locale);
        }
      }
      return;
    }
    
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
    if (typeof window !== 'undefined') {
      const storedLocale = localStorage.getItem('locale');
      if (storedLocale === 'en' || storedLocale === 'es') {
        setLocale(storedLocale);
        return;
      }
    }
    
    // Check browser language
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'es') {
        setLocale('es');
      }
    }
  }, [searchParams, pathname]);

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
      document.documentElement.lang = newLocale;
      
      // Update URL with new locale only if router and pathname are available
      if (router && pathname) {
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
    }
  };

  const t = (namespace: string, key: string): string => {
    // Always provide translations, even during static generation
    const keys = key.split('.');
    const localeTranslations = translations[locale] as TranslationStructure;
    
    // Get the namespace
    const namespaceData = localeTranslations[namespace as keyof TranslationStructure];
    if (!namespaceData) return key;
    
    // Navigate through the nested keys
    const result = getNestedValue(namespaceData as Record<string, unknown>, keys);
    
    return typeof result === 'string' ? result : key;
  };

  const tRaw = (namespace: string, key: string): unknown => {
    // Always provide translations, even during static generation
    const keys = key.split('.');
    const localeTranslations = translations[locale] as TranslationStructure;
    
    // Get the namespace
    const namespaceData = localeTranslations[namespace as keyof TranslationStructure];
    if (!namespaceData) return null;
    
    // Navigate through the nested keys
    return getNestedValue(namespaceData as Record<string, unknown>, keys);
  };

  const value = {
    locale,
    t,
    tRaw,
    changeLocale,
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function I18nProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <I18nProviderInner>{children}</I18nProviderInner>
    </Suspense>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}