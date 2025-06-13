import { I18nProvider } from '@/i18n/i18n-context';
import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

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
      'en-US': 'https://mrmcdonald.org',
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
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Professional Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
        
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
                "https://wa.me/4358936006"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Cedar City",
                "addressRegion": "Utah",
                "addressCountry": "United States"
              },
              "email": "ammaron99@gmail.com",
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
      <body className="antialiased">
        <I18nProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          
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
          <div className="fixed bottom-6 right-6 z-40 no-print">
            <div className="flex flex-col gap-3">
              {/* WhatsApp Professional Contact */}
              <a
                href="https://wa.me/4358936006"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 hover:shadow-xl group"
                style={{ background: 'var(--gradient-accent)' }}
                aria-label="Professional WhatsApp Contact"
                title="Connect via WhatsApp"
              >
                <svg className="w-7 h-7 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              
              {/* LinkedIn Professional Network */}
              <a
                href="https://linkedin.com/in/ammaron"
                target="_blank" 
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 hover:shadow-xl group"
                style={{ background: 'var(--gradient-primary)' }}
                aria-label="LinkedIn Professional Profile"
                title="Connect on LinkedIn"
              >
                <svg className="w-7 h-7 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}