import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import ClarityProvider from '@/components/Clarity';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kirby McDonald - Educational Leader | MBA | Technology Innovator',
  description: 'MBA-equipped educational leader with 5+ years of classroom experience, proven business acumen, and emerging technology expertise. Specializing in EdTech leadership, educational administration, and professional English instruction.',
  keywords: [
    'Kirby McDonald',
    'Educational Leader',
    'MBA',
    'Technology Innovator',
    'EdTech Leadership', 
    'Educational Administration',
    'Business Education',
    'Professional English',
    'Curriculum Development',
    'Teacher Management',
    'Bilingual Education',
    'Cedar City Utah',
    'Educational Consultant',
    'Business Strategy',
    'Software Development'
  ],
  authors: [{ name: 'Kirby McDonald', url: 'https://mrmcdonald.org' }],
  creator: 'Kirby McDonald',
  publisher: 'Kirby McDonald',
  alternates: {
    canonical: 'https://mrmcdonald.org',
    languages: {
      'en-US': 'https://mrmcdonald.org/en',
      'es-ES': 'https://mrmcdonald.org/es'
    }
  },
  openGraph: {
    type: 'website',
    url: 'https://mrmcdonald.org',
    title: 'Kirby McDonald - Educational Leader | MBA | Technology Innovator',
    description: 'MBA-equipped educational leader bridging education, business strategy, and technology innovation. 5+ years of proven results in educational leadership and business development.',
    siteName: 'Kirby McDonald - Professional Portfolio',
    images: [
      {
        url: 'https://mrmcdonald.org/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kirby McDonald - Educational Leader, MBA, Technology Innovator',
        type: 'image/jpeg'
      }
    ],
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kirby McDonald - Educational Leader | MBA | Technology Innovator',
    description: 'MBA-equipped educational leader with proven results in education, business strategy, and technology innovation.',
    images: ['https://mrmcdonald.org/twitter-image.jpg'],
    creator: '@mrmcdonald'
  },
  verification: {
    google: 'google-site-verification-code', // Replace with actual verification code
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  },
  category: 'Education',
  classification: 'Professional Portfolio',
  other: {
    'linkedin:creator': 'ammaron',
    'professional-focus': 'Educational Leadership, Business Strategy, Technology Innovation',
    'location': 'Cedar City, Utah',
    'expertise': 'MBA, Educational Administration, Bilingual Instruction'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Favicon and App Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        
        {/* LinkedIn Profile Badge Script - Only load in production */}
        {process.env.NODE_ENV === 'production' && (
          <script 
            src="https://platform.linkedin.com/badges/js/profile.js" 
            async 
            defer 
            type="text/javascript"
          />
        )}
        
        {/* Professional Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Kirby McDonald",
              "jobTitle": "Educational Leader, MBA, Technology Innovator",
              "description": "MBA-equipped educational leader with 5+ years of classroom experience, proven business acumen, and emerging technology expertise.",
              "url": "https://mrmcdonald.org",
              "sameAs": [
                "https://linkedin.com/in/ammaron",
                "https://wa.me/51904975329"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Cedar City",
                "addressRegion": "Utah",
                "addressCountry": "United States"
              },
              "email": "kirby@mrmcdonald.org",
              "telephone": "+1-435-893-6006",
              "knowsLanguage": ["English", "Spanish"],
              "alumniOf": [
                {
                  "@type": "EducationalOrganization",
                  "name": "Western Governors University",
                  "degree": "Master of Business Administration"
                },
                {
                  "@type": "EducationalOrganization", 
                  "name": "Brigham Young University",
                  "degree": "Bachelor of Software Development (In Progress)"
                },
                {
                  "@type": "EducationalOrganization",
                  "name": "Southern Utah University", 
                  "degree": "Bachelor of Business Education"
                }
              ],
              "hasCredential": [
                "Utah State Teaching License",
                "Microsoft Office Specialist",
                "Award of Excellence in Management Communication",
                "Award of Excellence in Managing Organizations"
              ],
              "expertise": [
                "Educational Leadership",
                "Business Strategy", 
                "Technology Innovation",
                "Curriculum Development",
                "Teacher Management",
                "Bilingual Education",
                "Professional English Instruction"
              ],
              "offers": [
                {
                  "@type": "Service",
                  "name": "Educational Leadership Consulting",
                  "description": "Strategic consulting for educational institutions and EdTech companies"
                },
                {
                  "@type": "Service", 
                  "name": "Professional English Instruction",
                  "description": "Business-focused English language instruction for career advancement"
                },
                {
                  "@type": "Service",
                  "name": "Educational Resource Development", 
                  "description": "Professional teaching materials and curriculum development"
                }
              ]
            })
          }}
        />
        
        {/* Professional Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "Kirby McDonald Educational Services",
              "description": "Professional educational leadership, business strategy, and English instruction services",
              "provider": {
                "@type": "Person",
                "name": "Kirby McDonald"
              },
              "serviceType": [
                "Educational Leadership",
                "Business Consulting", 
                "Professional English Instruction",
                "Curriculum Development"
              ],
              "areaServed": {
                "@type": "Place",
                "name": "Global (Online) and Cedar City, Utah (In-Person)"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Google Analytics using Next.js Script component */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EVSFDMJ2WZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EVSFDMJ2WZ');
          `}
        </Script>
        
        <ClarityProvider />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}