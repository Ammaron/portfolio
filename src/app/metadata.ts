import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kirby McDonald - Portfolio | Educator, Business Professional, Software Developer',
  description: 'Professional portfolio of Kirby McDonald - Innovative educator with experience in business education, software development, and English language instruction.',
  keywords: 'Kirby McDonald, teacher, educator, business education, software development, English classes, Teachers Pay Teachers, Cedar City, Utah',
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
    title: 'Kirby McDonald - Professional Portfolio',
    description: 'Educator, Business Professional, and Software Developer based in Cedar City, Utah. Bilingual in English and Spanish.',
    siteName: 'Kirby McDonald Portfolio',
    images: [
      {
        url: 'https://mrmcdonald.org/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kirby McDonald - Professional Portfolio'
      }
    ],
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kirby McDonald - Professional Portfolio',
    description: 'Educator, Business Professional, and Software Developer based in Cedar City, Utah. Bilingual in English and Spanish.',
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
