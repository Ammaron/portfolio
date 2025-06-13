'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Function to detect user's preferred language
    const detectLocale = (): string => {
      // 1. Check localStorage for saved preference
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('locale');
        if (saved === 'en' || saved === 'es') {
          return saved;
        }
      }

      // 2. Check browser language
      if (typeof navigator !== 'undefined') {
        const browserLang = navigator.language.split('-')[0];
        if (browserLang === 'es') {
          return 'es';
        }
      }

      // 3. Default to English
      return 'en';
    };

    const locale = detectLocale();
    router.replace(`/${locale}`);
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}