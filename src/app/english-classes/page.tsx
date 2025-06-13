'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/i18n/i18n-context';

export default function EnglishClassesPage() {
  const [activeTab, setActiveTab] = useState('classes');
  const { t } = useI18n();
  
  // Professional success stories
  const testimonials = [
    {
      id: 1,
      name: 'Maria Rodriguez',
      role: 'Marketing Manager - B2 Level Graduate',
      company: 'Tech Startup',
      content: 'Kirby\'s business-focused approach helped me transition from basic English to leading international marketing campaigns. The MBA perspective in teaching made all the difference.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      achievement: 'Promoted to Marketing Manager'
    },
    {
      id: 2,
      name: 'Carlos Mendez',
      role: 'Software Engineer - A2 to B2 Progress',
      company: 'Fortune 500',
      content: 'The combination of English instruction with technology focus was perfect for my career in software development. Now I lead international development teams.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      achievement: 'International Team Lead'
    },
    {
      id: 3,
      name: 'Ana Gutierrez',
      role: 'Educational Administrator - C1 Level',
      company: 'School District',
      content: 'Learning from an educator with MBA experience was invaluable. Kirby understands both language learning and professional advancement needs.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      achievement: 'District Leadership Role'
    }
  ];
  
  // Professional English program offerings
  const classes = [
    {
      id: 'business-foundation',
      level: 'Business Foundation (A1-A2)',
      description: 'Essential English for workplace communication, professional emails, and basic business interactions.',
      topics: [
        'Professional introductions and networking',
        'Business email writing and communication',
        'Basic presentation skills and meetings',
        'Workplace vocabulary and etiquette',
        'Career goal setting and planning'
      ],
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      outcomes: 'Confidently handle basic workplace interactions and professional communication'
    },
    {
      id: 'professional-advancement',
      level: 'Professional Advancement (B1)',
      description: 'Advanced business communication for career growth, leadership roles, and international business.',
      topics: [
        'Advanced presentation and public speaking',
        'Negotiation and persuasion techniques',
        'Leadership communication styles',
        'International business etiquette',
        'Strategic thinking in English'
      ],
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      outcomes: 'Lead meetings, give presentations, and advance to management positions'
    },
    {
      id: 'executive-communication',
      level: 'Executive Communication (B2)',
      description: 'C-suite level communication skills for senior professionals and business leaders.',
      topics: [
        'Executive presentation and boardroom skills',
        'Cross-cultural business communication',
        'Strategic communication and vision setting',
        'Media interviews and public speaking',
        'International partnership development'
      ],
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      outcomes: 'Communicate effectively at the highest levels of business leadership'
    },
    {
      id: 'industry-specific',
      level: 'Industry-Specific Programs',
      description: 'Specialized English for technology, education, healthcare, and other professional sectors.',
      topics: [
        'Technology and software development terminology',
        'Educational leadership and administration',
        'Healthcare and medical communication',
        'Financial services and consulting',
        'Manufacturing and engineering'
      ],
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      outcomes: 'Master industry-specific vocabulary and communication protocols'
    }
  ];
  
  // Professional investment options
  const pricingOptions = [
    {
      id: 'executive-coaching',
      title: 'Executive Coaching',
      price: '$85',
      unit: 'per session',
      features: [
        'One-on-one executive-level instruction',
        'Customized curriculum for your industry',
        'Flexible scheduling for busy professionals',
        'Career advancement strategy included',
        'Business communication assessments',
        'Presentation and public speaking coaching',
        'International business etiquette'
      ],
      popular: true,
      description: 'Premium coaching for C-suite and senior professionals'
    },
    {
      id: 'professional-group',
      title: 'Professional Group',
      price: '$45',
      unit: 'per session',
      features: [
        'Small groups of 2-4 professionals',
        'Industry-focused curriculum',
        'Peer learning and networking',
        'Regular progress assessments',
        'Business case study discussions',
        'Materials and resources included'
      ],
      popular: false,
      description: 'Collaborative learning with professional peers'
    },
    {
      id: 'corporate-training',
      title: 'Corporate Training',
      price: 'Custom',
      unit: 'pricing',
      features: [
        'On-site or virtual team training',
        'Customized for company needs',
        'Scalable for any team size',
        'ROI measurement and reporting',
        'Employee progress tracking',
        'Integration with HR systems',
        'Ongoing support and resources'
      ],
      popular: false,
      description: 'Comprehensive training solutions for organizations'
    }
  ];
  
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="hero-authority relative text-white section-padding-authority">
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
                className="btn-authority btn-primary-authority text-lg px-8 py-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {t('classes', 'hero.button')}
              </Link>
              <a 
                href="https://calendly.com/your-link" 
                target="_blank"
                rel="noopener noreferrer"
                className="btn-authority btn-secondary-authority text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Schedule Consultation
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Professional Value Proposition */}
      <section className="section-padding-authority bg-gray-50">
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
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 gradient-text-primary">{t('classes', 'classLevels.businessFirstTitle')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('classes', 'classLevels.businessFirstDesc')}
                </p>
              </div>
              
              <div className="authority-card text-center p-8">
                <div className="w-16 h-16 bg-gradient-warm rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 gradient-text-warm">{t('classes', 'classLevels.careerImpactTitle')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('classes', 'classLevels.careerImpactDesc')}
                </p>
              </div>
              
              <div className="authority-card text-center p-8">
                <div className="w-16 h-16 bg-gradient-accent rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 gradient-text-accent">{t('classes', 'classLevels.executiveInstructionTitle')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('classes', 'classLevels.executiveInstructionDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Tabs Navigation */}
      <section className="section-padding-authority bg-background">
        <div className="container-authority">
          <div className="flex justify-center border-b border-gray-200 mb-16">
            <button 
              className={`px-8 py-4 font-semibold text-lg transition-all duration-300 ${activeTab === 'classes' ? 'text-primary border-b-3 border-primary bg-primary/5' : 'text-gray-600 hover:text-primary'}`}
              onClick={() => setActiveTab('classes')}
            >
              {t('classes', 'tabs.classOfferings')}
            </button>
            <button 
              className={`px-8 py-4 font-semibold text-lg transition-all duration-300 ${activeTab === 'pricing' ? 'text-primary border-b-3 border-primary bg-primary/5' : 'text-gray-600 hover:text-primary'}`}
              onClick={() => setActiveTab('pricing')}
            >
              {t('classes', 'tabs.pricing')}
            </button>
            <button 
              className={`px-8 py-4 font-semibold text-lg transition-all duration-300 ${activeTab === 'testimonials' ? 'text-primary border-b-3 border-primary bg-primary/5' : 'text-gray-600 hover:text-primary'}`}
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
                <p className="text-xl text-gray-600 leading-relaxed">
                  {t('classes', 'classLevels.description')}
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8">
                {classes.map((classItem, index) => (
                  <div key={classItem.id} className="card-flip-authority animate-fade-in-up cursor-pointer" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="card-flip-inner-authority">
                      {/* Card Front */}
                      <div className="card-flip-front-authority authority-card bg-white overflow-hidden">
                        <div className="relative h-48">
                          <Image
                            src={classItem.image}
                            alt={classItem.level}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
                            <h3 className="text-white text-2xl font-bold p-6">{classItem.level}</h3>
                          </div>
                        </div>
                        <div className="p-8">
                          <p className="text-gray-600 mb-6 leading-relaxed">{classItem.description}</p>
                          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg">
                            <h5 className="font-semibold text-gray-900 mb-2">Professional Outcome:</h5>
                            <p className="text-gray-700 text-sm">{classItem.outcomes}</p>
                          </div>
                          <div className="mt-4 text-center">
                            <span className="text-primary font-medium text-sm">Hover for curriculum details</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Card Back */}
                      <div className="card-flip-back-authority p-8 flex flex-col justify-between text-white">
                        <div>
                          <h3 className="text-2xl font-bold mb-4">{classItem.level}</h3>
                          <h4 className="font-bold mb-4 opacity-90">{t('classes', 'classLevels.topicsInclude')}</h4>
                          <ul className="space-y-3 mb-6">
                            {classItem.topics.map((topic, i) => (
                              <li key={i} className="flex items-start">
                                <svg className="w-4 h-4 mr-3 text-white mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                <span className="text-white text-sm opacity-90">{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="text-center">
                          <Link 
                            href="/#contact" 
                            className="inline-block px-6 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                          >
                            Learn More
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="max-w-4xl mx-auto text-center mt-16">
                <div className="authority-card p-8">
                  <h3 className="text-2xl font-bold mb-4 gradient-text-authority">Professional Instruction</h3>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {t('classes', 'classLevels.teacherInfo')}
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <span className="px-4 py-2 bg-gradient-primary text-white rounded-full text-sm font-medium">
                      MBA Business Leadership
                    </span>
                    <span className="px-4 py-2 bg-gradient-warm text-white rounded-full text-sm font-medium">
                      5+ Years Educational Leadership
                    </span>
                    <span className="px-4 py-2 bg-gradient-accent text-white rounded-full text-sm font-medium">
                      Bilingual Professional
                    </span>
                  </div>
                  <div className="mt-8">
                    <Link 
                      href="/#contact" 
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
                {pricingOptions.map((option, index) => (
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
                        {option.features.map((feature, i) => (
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
                <p className="text-xl text-gray-600 leading-relaxed">
                  {t('classes', 'testimonials.description')}
                </p>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-8 mb-16">
                {testimonials.map((testimonial, index) => (
                  <div key={testimonial.id} className="authority-card p-8 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-center mb-6">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                        <p className="text-sm text-primary font-medium">{testimonial.role}</p>
                        <p className="text-xs text-gray-500">{testimonial.company}</p>
                      </div>
                    </div>
                    
                    <div className="relative mb-6">
                      <svg className="absolute top-0 left-0 w-8 h-8 text-primary/20 -translate-x-2 -translate-y-2" fill="currentColor" viewBox="0 0 32 32">
                        <path d="M10 8c-2.2 0-4 1.8-4 4v10h10V12h-6c0-1.1 0.9-2 2-2h2V8h-4zm12 0c-2.2 0-4 1.8-4 4v10h10V12h-6c0-1.1 0.9-2 2-2h2V8h-4z"></path>
                      </svg>
                      <p className="italic text-gray-700 leading-relaxed pl-6">{testimonial.content}</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-success/10 to-primary/10 p-4 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-success mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-sm font-semibold text-gray-900">Achievement: {testimonial.achievement}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <Link 
                  href="/#contact" 
                  className="btn-authority btn-primary-authority text-lg px-8 py-4"
                >
                  {t('classes', 'testimonials.startButton')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Professional CTA Section */}
      <section className="section-padding-authority bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-authority">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-section-title-authority mb-6 gradient-text-authority">
              {t('classes', 'cta.title')}
            </h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              {t('classes', 'cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/#contact" 
                className="btn-authority btn-primary-authority text-lg px-8 py-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {t('classes', 'cta.contactButton')}
              </Link>
              <a 
                href="https://wa.me/4358936006" 
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
      </section>
    </div>
  );
}