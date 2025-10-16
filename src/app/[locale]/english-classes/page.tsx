'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useI18n } from '@/i18n/i18n-context';
import { AirplaneTakeoffIcon, BriefcaseIcon, UserSoundIcon, QuotesIcon } from "@phosphor-icons/react";

interface ClassLevel {
  id: string;
  level: string;
  description: string;
  topics: string[];
  outcomes: string;
  programDetails?: string;
  image: string; // Remove the optional ? to make it required
}

interface PricingOption {
  id: string;
  title: string;
  price: string;
  unit: string;
  features: string[];
  popular: boolean;
  description: string;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  achievement: string;
  image?: string;
}

export default function EnglishClassesPage() {
  const [activeTab, setActiveTab] = useState('classes');
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const { t, tRaw } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  
  // Add smooth scroll functionality (same as Navbar)
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

  // Handle navigation to contact section (same as Navbar)
  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // If we're on the home page, scroll to contact section
    if (pathname === '/' || pathname === '/en' || pathname === '/es') {
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
  
  // Handle navigation to testimonials/success stories section
  const handleSuccessStoriesClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // Set active tab to testimonials
    setActiveTab('testimonials');
    
    // Scroll to the tabs section after a brief delay to allow tab switch
    setTimeout(() => {
      const tabsSection = document.querySelector('.section-padding-authority.bg-gradient-to-br.from-slate-900');
      if (tabsSection) {
        const offsetTop = (tabsSection as HTMLElement).offsetTop - 100;
        smoothScrollTo(offsetTop, 1000);
      }
    }, 100);
  };
  
  // Handle card flip toggle for mobile with better touch support
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, cardId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  // Separate touch handler for mobile devices
  const handleCardTouch = (e: React.TouchEvent<HTMLDivElement>, cardId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only handle single touch and ensure it's a tap, not a scroll
    if (e.changedTouches.length === 1) {
      setFlippedCards(prev => {
        const newSet = new Set(prev);
        if (newSet.has(cardId)) {
          newSet.delete(cardId);
        } else {
          newSet.add(cardId);
        }
        return newSet;
      });
    }
  };
  
  // Handle keyboard interaction for accessibility
  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, cardId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setFlippedCards(prev => {
        const newSet = new Set(prev);
        if (newSet.has(cardId)) {
          newSet.delete(cardId);
        } else {
          newSet.add(cardId);
        }
        return newSet;
      });
    }
  };

// Helper function to get appropriate image for each class
function getClassImage(classId: string): string {
  const imageMap: Record<string, string> = {
    // Actual class IDs from translations
    'essential-foundations': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'practical-communication': 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'independent-mastery': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'advanced-fluency': 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'expert-proficiency': 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'native-mastery': 'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  };
  
  // Default fallback image
  const defaultImage = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  
  return imageMap[classId] || defaultImage;
}
  
  // Professional English program offerings - use tRaw for array data
  const classesData = tRaw('classes', 'classLevels.list') as ClassLevel[] || [];
  const classes = classesData.map((classItem: ClassLevel) => {
    const imageUrl = getClassImage(classItem.id);
    
    return {
      ...classItem,
      image: imageUrl // This will always be a string now
    };
  });
  
  // Professional investment options - use tRaw for array data
  const pricingOptions = tRaw('classes', 'pricing.options') as PricingOption[] || [];
  
  // Professional success stories - use tRaw for array data
  const testimonials = tRaw('classes', 'testimonials.list') as Testimonial[] || [];
  
  return (
    <div className="min-h-screen pt-20 english-classes-page">
      {/* Hero Section */}
      <section 
        className="hero-authority relative text-white section-padding-authority"
      >
        {/* Floating Elements */}
        <div className="floating-element floating-element-1"></div>
        <div className="floating-element floating-element-2"></div>
        <div className="floating-element floating-element-3"></div>
        
        <div className="container-authority relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium mb-6 animate-fade-in-up">
              <svg className="w-4 h-4 mr-2 text-warm" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {t('classes', 'classLevels.businessFocus')}
            </div>
            
            <h1 className="text-hero-authority mb-8 animate-fade-in-up animate-stagger-2">
              <span className="gradient-text-authority">{t('classes', 'hero.title')}</span>
            </h1>
            
            <p className="text-xl lg:text-2xl mb-10 opacity-90 leading-relaxed animate-fade-in-up animate-stagger-3 max-w-3xl mx-auto">
              {t('classes', 'hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-stagger-4">
              <Link 
                href="/#contact" 
                onClick={handleContactClick}
                className="btn-authority btn-primary-authority text-lg px-8 py-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {t('classes', 'hero.button')}
              </Link>
              <button 
                onClick={handleSuccessStoriesClick}
                className="btn-authority btn-secondary-authority text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('classes', 'classLevels.scheduleConsultation')}
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Professional Value Proposition */}
      <section 
        className="section-padding-authority bg-gray-50 english-classes-value-section"
      >
        <div className="container-authority">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-section-title-authority mb-6 gradient-text-authority">
                {t('classes', 'classLevels.whyChooseTitle')}
              </h2>
              <div className="w-24 h-1 bg-gradient-primary mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('classes', 'classLevels.whyChooseSubtitle')}
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="authority-card text-center p-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <AirplaneTakeoffIcon size={64} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 gradient-text-primary">{t('classes', 'classLevels.businessFirstTitle')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('classes', 'classLevels.businessFirstDesc')}
                </p>
              </div>
              
              <div className="authority-card text-center p-8">
                <div className="w-16 h-16 bg-gradient-warm rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <UserSoundIcon size={64} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 gradient-text-warm">{t('classes', 'classLevels.careerImpactTitle')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('classes', 'classLevels.careerImpactDesc')}
                </p>
              </div>
              
              <div className="authority-card text-center p-8">
                <div className="w-16 h-16 bg-gradient-accent rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <BriefcaseIcon size={64} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 gradient-text-accent">{t('classes', 'classLevels.executiveInstructionTitle')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('classes', 'classLevels.executiveInstructionDesc')}
                </p>
              </div>
            </div>
            
            {/* Fun - Wide Card */}
            <div className="mt-12">
              <div className="authority-card text-center p-8 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-100">
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-3xl font-bold mb-4 gradient-text-authority">{t('classes', 'classLevels.funTitle')}</h3>
                    <p className="text-gray-700 leading-relaxed text-lg max-w-4xl">
                      {t('classes', 'classLevels.funDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Tabs Navigation */}
      <section className="section-padding-authority bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 text-gray-900 dark:text-white">
        <div className="container-authority">
          <div className="flex justify-center border-b border-gray-200 mb-16">
            <button 
              className={`cursor-pointer  px-8 py-4 font-semibold text-lg transition-all duration-300 ${activeTab === 'classes' ? 'text-gray-300 border-b-3 border-primary bg-primary/5' : 'text-gray-400 hover:text-primary'}`}
              onClick={() => setActiveTab('classes')}
            >
              {t('classes', 'tabs.classOfferings')}
            </button>
            {/* <button 
              className={`px-8 py-4 font-semibold text-lg transition-all duration-300 ${activeTab === 'pricing' ? 'text-primary border-b-3 border-primary bg-primary/5' : 'text-gray-600 hover:text-primary'}`}
              onClick={() => setActiveTab('pricing')}
            >
              {t('classes', 'tabs.pricing')}
            </button> */}
            <button 
              className={`cursor-pointer px-8 py-4 font-semibold text-lg transition-all duration-300 ${activeTab === 'testimonials' ? 'text-gray-300 border-b-3 border-primary bg-primary/5' : 'text-gray-400 hover:text-primary'}`}
              onClick={() => setActiveTab('testimonials')}
            >
              {t('classes', 'tabs.testimonials')}
            </button>
          </div>
          
          {/* Program Offerings Content */}
          {activeTab === 'classes' && (
            <div className="animate-fade-in-up">
              <div className="max-w-4xl mx-auto text-center mb-16">
                <h2 className="text-section-title-authority mb-6 gradient-text-authority">
                  {t('classes', 'classLevels.title')}
                </h2>
                <p className="text-xl text-gray-200 leading-relaxed">
                  {t('classes', 'classLevels.description')}
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8">
                {classes.map((classItem: ClassLevel, index: number) => (
                  <div 
                    key={classItem.id} 
                    className="card-flip-authority animate-fade-in-up cursor-pointer" 
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'transparent'
                    }} 
                    onClick={(e) => handleCardClick(e, classItem.id)}
                    onTouchEnd={(e) => handleCardTouch(e, classItem.id)}
                    onKeyDown={(e) => handleCardKeyDown(e, classItem.id)} // Add keyboard handler
                    tabIndex={0}
                    role="button"
                    aria-label={`Click to view details for ${classItem.level}`}
                  >
                    <div className={`card-flip-inner-authority ${flippedCards.has(classItem.id) ? 'flipped' : ''}`}>
                      {/* Card Front */}
                      <div className="card-flip-front-authority authority-card bg-white overflow-hidden">
                        <div className="relative h-48">
                          <Image
                            src={classItem.image}
                            alt={classItem.level}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
                            <h3 className="text-white text-2xl font-bold p-6">{classItem.level}</h3>
                          </div>
                        </div>
                        <div className="p-8">
                          <p className="text-gray-600 mb-6 leading-relaxed">{classItem.description}</p>
                          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg">
                            <h5 className="font-semibold text-gray-900 mb-2">{t('classes', 'classLevels.professionalOutcome')}</h5>
                            <p className="text-gray-700 text-sm">{classItem.outcomes}</p>
                          </div>
                          <div className="mt-4 text-center">
                            <span className="text-primary font-medium text-sm hidden md:inline">
                              {t('classes', 'classLevels.hoverForDetails')}
                            </span>
                            <span className="text-primary font-medium text-sm md:hidden">
                              {t('classes', 'classLevels.clickForDetails')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Card Back */}
                      <div className="card-flip-back-authority p-8 flex flex-col justify-between text-white">
                        <div>
                          <h3 className="text-2xl font-bold mb-4">{classItem.level}</h3>
                          {/* Add program duration for Essential English Foundations */}
                          {classItem.id === 'essential-foundations' && (
                            <p className="text-sm opacity-90 mb-4 bg-white/10 p-3 rounded-lg">
                              {t('classes', 'classLevels.programDuration')}
                            </p>
                          )}
                          <h4 className="font-bold mb-4 opacity-90">{t('classes', 'classLevels.topicsInclude')}</h4>
                          <ul className="space-y-3 mb-6">
                            {classItem.topics.map((topic: string, i: number) => (
                              <li key={i} className="flex items-start">
                                <svg className="w-4 h-4 mr-3 text-white mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                <span className="text-white text-sm opacity-90">{topic}</span>
                              </li>
                            ))}
                          </ul>
                          
                          {/* Certification Section */}
                          <div className="mb-6 pb-4 border-t border-white/20 pt-4">
                            <h4 className="font-bold mb-2 opacity-90">{t('classes', 'classLevels.certification')}</h4>
                            <p className="text-sm opacity-90">{t('classes', 'classLevels.certificationDescription')}</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <Link 
                            href="/#contact" 
                            onClick={handleContactClick}
                            className="inline-block px-6 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                          >
                            {t('classes', 'classLevels.connectButton')}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="max-w-4xl mx-auto text-center mt-16">
                <div className="authority-card p-8">
                  <h3 className="text-2xl font-bold mb-4 gradient-text-authority">{t('classes', 'classLevels.professionalInstructionTitle')}</h3>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {t('classes', 'classLevels.teacherInfo')}
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <span className="px-4 py-2 bg-gradient-primary text-muted rounded-full text-sm font-medium">
                      {t('classes', 'classLevels.mbaBadge')}
                    </span>
                    <span className="px-4 py-2 bg-gradient-warm text-muted rounded-full text-sm font-medium">
                      {t('classes', 'classLevels.experienceBadge')}
                    </span>
                    <span className="px-4 py-2 bg-gradient-accent text-muted rounded-full text-sm font-medium">
                      {t('classes', 'classLevels.bilingualBadge')}
                    </span>
                  </div>
                  <div className="mt-8">
                    <Link 
                      href="/#contact" 
                      onClick={handleContactClick}
                      className="btn-authority btn-primary-authority"
                    >
                      {t('classes', 'classLevels.inquireButton')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Pricing Content */}
          {activeTab === 'pricing' && (
            <div className="animate-fade-in-up">
              <div className="max-w-4xl mx-auto text-center mb-16">
                <h2 className="text-section-title-authority mb-6 gradient-text-authority">
                  {t('classes', 'pricing.title')}
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {t('classes', 'pricing.description')}
                </p>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-8 mb-16">
                {pricingOptions.map((option: PricingOption, index: number) => (
                  <div 
                    key={option.id} 
                    className={`authority-card overflow-hidden relative ${
                      option.popular ? 'ring-2 ring-primary shadow-lg' : ''
                    } animate-fade-in-up`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {option.popular && (
                      <div className="absolute top-0 right-0 bg-gradient-primary text-white px-4 py-2 text-sm font-bold rounded-bl-lg">
                        {t('classes', 'pricing.mostPopular')}
                      </div>
                    )}
                    <div className="p-8">
                      <h3 className="text-2xl font-bold mb-2">{option.title}</h3>
                      <p className="text-gray-600 text-sm mb-6">{option.description}</p>
                      <div className="mb-6">
                        <span className="text-4xl font-bold gradient-text-authority">{option.price}</span>
                        <span className="text-gray-500 ml-2">{option.unit}</span>
                      </div>
                      <ul className="space-y-4 mb-8">
                        {option.features.map((feature: string, i: number) => (
                          <li key={i} className="flex items-start">
                            <svg className="w-5 h-5 mr-3 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Link 
                        href="/#contact" 
                        className={`btn-authority w-full justify-center ${
                          option.popular 
                            ? 'btn-primary-authority' 
                            : 'btn-secondary-authority'
                        }`}
                      >
                        {t('classes', 'pricing.selectPlan')}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="max-w-4xl mx-auto">
                <div className="authority-card p-8">
                  <h3 className="text-2xl font-bold mb-6 text-center gradient-text-authority">
                    {t('classes', 'pricing.additionalInfo')}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <svg className="w-5 h-5 mr-3 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-gray-700">{t('classes', 'pricing.packageDiscounts')}</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 mr-3 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-gray-700">{t('classes', 'pricing.familyDiscounts')}</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 mr-3 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-gray-700">{t('classes', 'pricing.careerFocused')}</span>
                      </li>
                    </ul>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <svg className="w-5 h-5 mr-3 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-gray-700">{t('classes', 'pricing.classesAvailable')}</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 mr-3 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-gray-700">{t('classes', 'pricing.communication')}</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 mr-3 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-gray-700">{t('classes', 'pricing.industryMaterials')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Testimonials Content */}
          {activeTab === 'testimonials' && (
            <div className="animate-fade-in-up">
              <div className="max-w-4xl mx-auto text-center mb-16">
                <h2 className="text-section-title-authority mb-6 gradient-text-authority">
                  {t('classes', 'testimonials.title')}
                </h2>
                <p className="text-xl text-gray-200 leading-relaxed">
                  {t('classes', 'testimonials.description')}
                </p>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-8 mb-16">
                {testimonials.map((testimonial: Testimonial, index: number) => (
                  <div key={testimonial.id} className="authority-card p-8 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-center mb-6">
                      {/* <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                        <Image
                          src={testimonial.image || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div> */}
                      <div>
                        <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                        <p className="text-sm text-gray-800 font-medium">{testimonial.role}</p>
                      </div>
                    </div>
                    
                    <div className="relative mb-6">
                      <QuotesIcon className="absolute top-0 left-0 w-8 h-8 text-gray-600 -translate-x-2 -translate-y-2" />
                      <p className="italic text-gray-700 leading-relaxed pl-6">{testimonial.content}</p>
                    </div>
                    
                    {/* <div className="bg-gradient-to-r from-success/10 to-primary/10 p-4 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-success mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-sm font-semibold text-gray-900">Achievement: {testimonial.achievement}</span>
                      </div>
                    </div> */}
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <Link 
                  href="/#contact" 
                  onClick={handleContactClick}
                  className="btn-authority btn-primary-authority text-lg px-8 py-4"
                >
                  {t('classes', 'testimonials.startButton')}
                </Link>
              </div>
            </div>
          )}
        </div>
      
      {/* Professional CTA Section */}
      {/* <section className="section-padding-authority bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-authority">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-section-title-authority mb-6 gradient-text-authority">
              {t('classes', 'cta.title')}
            </h2>
            <p className="text-xl text-gray-200 mb-10 leading-relaxed">
              {t('classes', 'cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/#contact" 
                onClick={handleContactClick}
                className="btn-authority btn-primary-authority text-lg px-8 py-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {t('classes', 'cta.contactButton')}
              </Link>
              <a 
                href="https://wa.me/+51904975329" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-authority btn-warm-authority text-lg px-8 py-4"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t('classes', 'cta.whatsappButton')}
              </a>
            </div>
          </div>
        </div>
      </section> */}
            </section>

    </div>
  );
}