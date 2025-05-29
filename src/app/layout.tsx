import { I18nProvider } from '@/i18n/i18n-context';
import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Kirby McDonald - Portfolio',
  description: 'Professional portfolio of Kirby McDonald - Educator, Business Professional, and Software Developer',
  keywords: 'Kirby McDonald, teacher, educator, business education, software development, English classes, Teachers Pay Teachers',
  alternates: {
    languages: {
      'en-US': '/en',
      'es-ES': '/es'
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <I18nProvider>
          <Navbar />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
