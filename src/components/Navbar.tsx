'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import LocalizedLink from './LocalizedLink';
import { usePathname, useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/i18n-context';
import { ChatCircleDotsIcon, TranslateIcon } from '@phosphor-icons/react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { locale, t, changeLocale } = useI18n();
  
  // Add smooth scroll functionality
  const smoothScrollTo = (targetY: number, duration: number = 1000) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();

    const easeInOutQuart = (t: number): number => {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    };

    const animateScroll = (currentTime: number) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      const ease = easeInOutQuart(progress);
      window.scrollTo(0, startY + distance * ease);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // If we're on the home page, scroll to contact section
    if (pathname === '/') {
      const contactElement = document.getElementById('contact');
      if (contactElement) {
        const offsetTop = contactElement.offsetTop - 80;
        smoothScrollTo(offsetTop, 1000);
      }
    } else {
      // If we're on another page, navigate to home page and then scroll
      router.push('/');
      
      // Wait for the page to load, then scroll to contact
      setTimeout(() => {
        const contactElement = document.getElementById('contact');
        if (contactElement) {
          const offsetTop = contactElement.offsetTop - 80;
          smoothScrollTo(offsetTop, 1200);
        } else {
          // If element not found immediately, try again after a short delay
          setTimeout(() => {
            const contactElement = document.getElementById('contact');
            if (contactElement) {
              const offsetTop = contactElement.offsetTop - 80;
              smoothScrollTo(offsetTop, 1200);
            }
          }, 500);
        }
      }, 100);
    }
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLanguageSwitch = () => {
    const newLocale = locale === 'en' ? 'es' : 'en';
    changeLocale(newLocale);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: t('nav', 'home'), href: '/' },
    // { name: t('nav', 'teachersPayTeachers'), href: '/teachers-pay-teachers' },
    { name: t('nav', 'englishClasses'), href: '/english-classes' },
  ];

  const alternateLocaleText = locale === 'en' ? 'Español' : 'English';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white shadow-sm border-b border-gray-100' 
        : 'bg-white backdrop-blur-md shadow-sm'
    }`}>
      <div className="container-authority">
        <div className="flex justify-between items-center py-4 lg:py-4">
          {/* Logo Section - Better Spacing */}
          <div className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="Mr. McDonald Logo" 
              width={48} 
              height={48} 
              className="w-12 h-12 mr-4"
              priority
              sizes="48px"
            />
            <LocalizedLink href="/" className="flex items-center group">
              <div className="flex flex-col">
                <span className="text-2xl lg:text-3xl font-black tracking-tight leading-none">
                  <span className="gradient-text-authority">Mr. </span>
                  <span className="gradient-text-warm">McDonald</span>
                </span>
                <div className="hidden sm:block mt-1">
                  <div className="text-xs font-semibold text-gray-600 leading-tight">
                    Educational Leader | MBA | Tech Innovator
                  </div>
                </div>
              </div>
            </LocalizedLink>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center space-x-8 mr-8">
              {navLinks.map((link) => (
                <LocalizedLink 
                  key={link.href} 
                  href={link.href}
                  className={`relative px-3 py-3 text-base font-semibold transition-all duration-300 group ${
                    pathname === link.href 
                      ? 'text-blue-600 bg-blue-50 rounded-lg' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg'
                  }`}
                >
                  {link.name}
                  {/* Active indicator */}
                  <span className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full transition-all duration-300 ${
                    pathname === link.href ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-70 group-hover:scale-x-100'
                  }`}></span>
                </LocalizedLink>
              ))}
            </div>
            
            {/* Right Side Actions*/}
            <div className="flex items-center space-x-3">
              {/* Professional CTA */}
              <a 
                href="#contact"
                onClick={handleContactClick}
                className="flex items-center px-4 py-2 bg-gradient-primary text-secondary-dark text-base font-semibold rounded-sm hover:shadow-sm hover:scale-103 transition-all duration-300"
              >
                <span className="mr-2">{t('nav', 'contact')}</span>
                <ChatCircleDotsIcon size={20}/> 
              </a>
              {/* Language Switcher */}
              <button 
                onClick={handleLanguageSwitch}
                className="cursor-pointer flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors duration-300 border border-gray-300 rounded-sm hover:border-primary/30"
                aria-label={`Switch to ${alternateLocaleText}`}
              >
                <TranslateIcon size={16} className="mr-1" />
                {alternateLocaleText}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu Section */}
          <div className="flex lg:hidden items-center space-x-2">
            {/* Mobile Language Switcher */}
            <button 
              onClick={handleLanguageSwitch}
              className="cursor-pointer flex items-center px-3 py-2 text-xs font-medium text-gray-600 hover:text-primary transition-colors border border-gray-300 rounded"
              aria-label={`Switch to ${alternateLocaleText}`}
            >
              <TranslateIcon size={16} className="mr-1" />
              {locale === 'en' ? 'ES' : 'EN'}
            </button>
            
            {/* Hamburger Menu */}
            <button
              onClick={toggleMenu}
              className="cursor-pointer flex items-center justify-center w-12 h-12 text-gray-700 hover:text-primary focus:outline-none transition-colors ml-2"
              aria-expanded={isMenuOpen}
              aria-label="Toggle main menu"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? 'rotate-45 translate-y-2.5' : 'translate-y-1'
                }`}></span>
                <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out translate-y-2.5 ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? '-rotate-45 translate-y-2.5' : 'translate-y-4'
                }`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Improved Layout */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${
        isMenuOpen 
          ? 'max-h-screen opacity-100' 
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
          <div className="container-authority py-6">
            <div className="space-y-2">
              {navLinks.map((link, index) => (
                <LocalizedLink
                  key={link.href}
                  href={link.href}
                  className={`block px-6 py-4 text-lg font-medium rounded-lg transition-all duration-300 ${
                    pathname === link.href 
                      ? 'text-primary bg-primary/5 border-l-4 border-primary' 
                      : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {link.name}
                </LocalizedLink>
              ))}
            </div>
            
            {/* Mobile Action Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-3">
                <a 
                  href="#contact"
                  onClick={(e) => {
                    handleContactClick(e);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-center w-full px-6 py-2 bg-gradient-primary text-primary font-semibold rounded-lg hover:shadow-sm transition-all duration-300"
                >
                  <ChatCircleDotsIcon size={24} className="mr-2" />
                  {t('nav', 'contact')}
                </a>
                
                <div className="text-center">
                  <button 
                    onClick={() => {
                      handleLanguageSwitch();
                      setIsMenuOpen(false);
                    }}
                    className="cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                  >
                    <TranslateIcon size={20} className="mr-1" />
                    Switch to {alternateLocaleText}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Professional Info in Mobile */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <div className="text-xs text-gray-500">
                Educational Leader | MBA | Technology Innovator
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Cedar City, Utah
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-white/20 backdrop-blur-sm -z-10"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  );
}