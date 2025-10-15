import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kirby McDonald - English Classes, Business Education & MBA Leadership | Cedar City, Utah',
  description: 'Professional English classes for Spanish speakers in Peru & Latin America. MBA-educated teacher offering business English, career advancement, and bilingual education. Experienced educator and software developer in Cedar City, Utah.',
  keywords: 'English classes Peru, English teacher Cedar City Utah, business English Latin America, clases de inglés profesional, English for Spanish speakers, bilingual education, MBA teacher, TEFL certification, online English classes, professional development English, career English courses, Kirby McDonald teacher, Utah English instructor, English classes for adults, business communication English',
  authors: [{ name: 'Kirby McDonald' }],
  creator: 'Kirby McDonald',
  publisher: 'Kirby McDonald',
  alternates: {
    canonical: 'https://mrmcdonald.org',
    languages: {
      'en-US': 'https://mrmcdonald.org',
      'es-ES': 'https://mrmcdonald.org/es'
    }
  },
  openGraph: {
    type: 'website',
    url: 'https://mrmcdonald.org',
    title: 'Professional English Classes by MBA-Educated Teacher | Kirby McDonald',
    description: 'Learn business English with an MBA-educated, bilingual teacher. Specialized classes for Spanish speakers focusing on career advancement and professional communication.',
    siteName: 'Kirby McDonald - English Classes & Professional Education',
    images: [
      {
        url: 'https://mrmcdonald.org/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kirby McDonald - Professional English Classes for Career Success'
      }
    ],
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional English Classes | MBA Teacher | Kirby McDonald',
    description: 'Business English classes for Spanish speakers. MBA-educated teacher specializing in career advancement and professional communication.',
    images: ['https://mrmcdonald.org/twitter-image.jpg']
  },
  verification: {
    google: 'google-site-verification-code', // Replace with actual verification code when available
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  }
};
