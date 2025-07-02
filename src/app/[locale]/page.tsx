'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/i18n/i18n-context';
import { BuildingsIcon, ChalkboardTeacherIcon, DesktopIcon, LinkedinLogoIcon, MailboxIcon, MapPinAreaIcon, PhoneIcon } from "@phosphor-icons/react";
import toast from 'react-hot-toast';
import { sendEmail, initEmailJS, isValidEmail, checkRateLimit, type EmailParams } from '@/lib/emailjs';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('experience');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // Add state for mobile detection
  const { t, tRaw } = useI18n();

  // Initialize EmailJS when component mounts
  useEffect(() => {
    initEmailJS();
    // Safe mobile detection after hydration
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Rate limiting check
    if (!checkRateLimit()) {
      toast.error('Please wait a moment before sending another message');
      return;
    }

    setIsSubmitting(true);

    try {
      const emailParams: EmailParams = {
        from_name: formData.name.trim(),
        from_email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      };

      const result = await sendEmail(emailParams);

      if (result.success) {
        toast.success('Message sent successfully! I\'ll get back to you soon.');
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Something went wrong. Please try again or contact me directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailClick = () => {
    window.open('mailto:kirby@mrmcdonald.org', '_blank');
  };

  const handlePhoneClick = () => {
    const phoneNumber = '435-893-6006';
    
    // Check if device supports tel: links (mobile)
    if (isMobile) {
      window.open(`tel:${phoneNumber}`, '_self');
    } else {
      // Desktop: copy to clipboard
      navigator.clipboard.writeText(phoneNumber).then(() => {
        toast.success('Phone number copied to clipboard!');
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = phoneNumber;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('Phone number copied to clipboard!');
      });
    }
  };

  // Add a more robust smooth scroll implementation
  const smoothScrollTo = (targetY: number, duration: number = 800) => {
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

  const handleScrollToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const valueSection = document.getElementById('value');
    if (valueSection) {
      const offsetTop = valueSection.offsetTop - 80;
      smoothScrollTo(offsetTop, 1000);
    }
  };

  // Updated smooth scroll handler for anchor links
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    
    const targetElement = document.getElementById(targetId.replace('#', ''));
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 80;
      smoothScrollTo(offsetTop, 1000);
    }
  };

  // Get translated data
  const experienceData = tRaw('home', 'about.experience');
  const educationData = tRaw('home', 'about.education');
  const certificationsData = tRaw('home', 'about.certifications');
  const skillsData = tRaw('home', 'about.skills');

  // Type guards to ensure data has expected structure
  const skills = Array.isArray(skillsData) ? skillsData : [];
  
  // Helper function to safely access nested properties
  const getNestedProperty = (obj: unknown, path: string): string => {
    if (!obj || typeof obj !== 'object') return '';
    
    const keys = path.split('.');
    let current: unknown = obj;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = (current as Record<string, unknown>)[key];
      } else {
        return '';
      }
    }
    
    return typeof current === 'string' ? current : '';
  };
  
  // Helper function to safely access arrays
  const getNestedArray = (obj: unknown, path: string): string[] => {
    if (!obj || typeof obj !== 'object') return [];
    
    const keys = path.split('.');
    let current: unknown = obj;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = (current as Record<string, unknown>)[key];
      } else {
        return [];
      }
    }
    
    return Array.isArray(current) ? current : [];
  };
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-authority relative flex items-center justify-center text-white">
        {/* Floating Elements */}
        <div className="floating-element floating-element-1"></div>
        <div className="floating-element floating-element-2"></div>
        <div className="floating-element floating-element-3"></div>
        <div className="floating-element floating-element-4"></div>
        
        <div className="container-authority relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 min-h-screen pt-20">
            {/* Content */}
            <div className="lg:w-3/5 text-center lg:text-left animate-fade-in-up">
              <div className="mb-6">
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium mb-6 animate-fade-in-up animate-stagger-1">
                  <svg className="w-4 h-4 mr-2 text-warm" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {t('home', 'hero.availableForLeadership')}
                </div>
              </div>
              
              <h1 className="text-hero-authority mb-6 animate-fade-in-up animate-stagger-2">
                <span className="gradient-text-authority">{t('home', 'hero.title')}</span>
              </h1>
              
              <h2 className="text-subtitle-authority mb-8 opacity-90 animate-fade-in-up animate-stagger-3">
                {t('home', 'hero.subtitle')}
              </h2>
              
              <p className="text-xl lg:text-2xl mb-10 max-w-3xl opacity-85 leading-relaxed animate-fade-in-up animate-stagger-4">
                {t('home', 'hero.description')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up animate-stagger-5">
                <a 
                  href="#contact" 
                  onClick={(e) => handleAnchorClick(e, 'contact')}
                  className="btn-authority btn-primary-authority text-lg px-8 py-4"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {t('home', 'hero.contactButton')}
                </a>
                <Link href="/english-classes" className="btn-authority btn-secondary-authority text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {t('home', 'hero.classesButton')}
                </Link>
              </div>
            </div>
            <div className="lg:w-2/5 flex justify-center animate-scale-in-bounce animate-stagger-6">
              <div className="relative">
                <div className="glass-authority w-80 h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden animate-gentle-glow relative">
                  <Image 
                    src="/images/profile1.jpg" 
                    alt="Kirby McDonald - Educational Leader with MBA"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 320px, 384px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
                </div>
                
                {/* Floating credential badges */}
                <div className="absolute -top-4 -right-4 glass-warm rounded-2xl p-4 animate-ambient-float">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warm-dark">{t('home', 'about.mbaCredential')}</div>
                    <div className="text-xs text-warm-dark/80">{t('home', 'about.businessLeadership')}</div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 glass-authority rounded-2xl p-4 animate-ambient-float" style={{ animationDelay: '2s' }}>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{t('home', 'about.yearsLeading')}</div>
                    <div className="text-xs text-primary/80">{t('home', 'about.yearsLeadingLabel')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="scroll-indicator-authority">
          <div 
            className="flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-110 group"
            onClick={handleScrollToNext}
          >
            <span className="text-sm mb-3 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
              {t('home', 'hero.scrollHint')}
            </span>
            <div className="scroll-bounce-animation">
              <svg className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Value Section */}
      <section id="value" className="section-padding-authority bg-gray-50">
        <div className="container-authority">
          <div className="text-center mb-16">
            <h2 className="text-section-title-authority mb-6 gradient-text-authority animate-fade-in-up">
              {t('home', 'businessValue.title')}
            </h2>
            <div className="w-24 h-1 bg-gradient-primary mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto animate-fade-in-up animate-stagger-2">
              {t('home', 'businessValue.subtitle')}
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Educational Authority */}
            <div className="authority-card text-center p-8 animate-fade-in-up animate-stagger-3">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <ChalkboardTeacherIcon size={64} className="text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4 gradient-text-authority">
                {t('home', 'businessValue.educationExpert.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('home', 'businessValue.educationExpert.description')}
              </p>
            </div>
            
            {/* MBA Strategy */}
            <div className="authority-card text-center p-8 animate-fade-in-up animate-stagger-4">
              <div className="w-16 h-16 bg-gradient-warm rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <BuildingsIcon size={64} className="text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4 gradient-text-warm">
                {t('home', 'businessValue.businessLeader.title')}
              </h3>
              <p className="!text-gray-600 leading-relaxed">
                {t('home', 'businessValue.businessLeader.description')}
              </p>
            </div>
            
            {/* Technology Vision */}
            <div className="authority-card text-center p-8 animate-fade-in-up animate-stagger-5">
              <div className="w-16 h-16 bg-gradient-accent rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <DesktopIcon size={64} className="text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4 gradient-text-accent">
                {t('home', 'businessValue.techInnovator.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('home', 'businessValue.techInnovator.description')}
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <div className="glass-authority p-8 rounded-3xl max-w-4xl mx-auto animate-fade-in-up animate-stagger-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                <strong className="gradient-text-authority">Unique Value:</strong> {t('home', 'businessValue.uniqueValue')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About/Experience Section */}
      <section id="about" className="section-padding-authority bg-gradient-to-br from-slate-900 via-gray-900 to-blue-700 text-white">
        <div className="container-authority">
          <div className="text-center mb-16">
            <h2 className="text-section-title-authority mb-6 gradient-text-authority">
              {t('home', 'about.title')}
            </h2>
            <div className="w-24 h-1 bg-gradient-primary mx-auto mb-6"></div>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              {t('home', 'about.subtitle')}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-12 items-start">
            {/* Content */}
            <div className="md:w-3/5">
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  {t('home', 'about.paragraph1')}
                </p>
                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                  {t('home', 'about.paragraph2')}
                </p>
              </div>
              
              {/* Business Impact Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text-authority mb-2">20%</div>
                  <div className="text-sm text-gray-100">{t('home', 'about.enrollmentIncrease')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text-warm mb-2">5+</div>
                  <div className="text-sm text-gray-100">{t('home', 'about.teachersManaged')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text-accent mb-2">100%</div>
                  <div className="text-sm text-gray-100">{t('home', 'about.curriculumDeveloped')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text-authority mb-2">2</div>
                  <div className="text-sm text-gray-100">{t('home', 'about.bilingualAdvantage')}</div>
                </div>
              </div>
              
              {/* Skills */}
              <div className="flex flex-wrap gap-3">
                {skills.map((skill: string) => (
                  <span key={skill} className="cursor-none px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-gray-400 rounded-full text-sm font-medium">  
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Experience Tabs */}
            <div className="md:w-2/5">
              <div className="authority-card p-8">
                <div className="flex border-b border-gray-200 mb-6">
                  <button 
                    className={`cursor-pointer px-4 py-3 font-semibold text-sm transition-colors ${activeTab === 'experience' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-primary'}`}
                    onClick={() => setActiveTab('experience')}
                  >
                    {t('home', 'about.tabExperience')}
                  </button>
                  <button 
                    className={`cursor-pointer px-4 py-3 font-semibold text-sm transition-colors ${activeTab === 'education' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-primary'}`}
                    onClick={() => setActiveTab('education')}
                  >
                    {t('home', 'about.tabEducation')}
                  </button>
                  <button 
                    className={`cursor-pointer px-4 py-3 font-semibold text-sm transition-colors ${activeTab === 'certifications' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-primary'}`}
                    onClick={() => setActiveTab('certifications')}
                  >
                    {t('home', 'about.tabCertifications')}
                  </button>
                </div>
                
                <div className="min-h-[300px]">
                  {activeTab === 'experience' && (
                    <div className="space-y-6 animate-fade-in-up">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{getNestedProperty(experienceData, 'education.title')}</h3>
                        <p className="text-sm text-primary font-medium">{getNestedProperty(experienceData, 'education.position')} | {getNestedProperty(experienceData, 'education.period')}</p>
                        <ul className="mt-3 list-disc list-inside text-sm text-gray-600 space-y-1">
                          {getNestedArray(experienceData, 'education.achievements').map((achievement: string, index: number) => (
                            <li key={index}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{getNestedProperty(experienceData, 'business.title')}</h3>
                        <p className="text-sm text-primary font-medium">{getNestedProperty(experienceData, 'business.position')} | {getNestedProperty(experienceData, 'business.period')}</p>
                        <ul className="mt-3 list-disc list-inside text-sm text-gray-600 space-y-1">
                          {getNestedArray(experienceData, 'business.achievements').map((achievement: string, index: number) => (
                            <li key={index}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{getNestedProperty(experienceData, 'growth.title')}</h3>
                        <p className="text-sm text-primary font-medium">{getNestedProperty(experienceData, 'growth.position')} | {getNestedProperty(experienceData, 'growth.period')}</p>
                        <ul className="mt-3 list-disc list-inside text-sm text-gray-600 space-y-1">
                          {getNestedArray(experienceData, 'growth.achievements').map((achievement: string, index: number) => (
                            <li key={index}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'education' && (
                    <div className="space-y-6 animate-fade-in-up">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{getNestedProperty(educationData, 'mba.title')}</h3>
                        <p className="text-sm text-primary font-medium">{getNestedProperty(educationData, 'mba.institution')} | {getNestedProperty(educationData, 'mba.period')}</p>
                        <p className="text-sm text-gray-600 mt-2">{getNestedProperty(educationData, 'mba.description')}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{getNestedProperty(educationData, 'software.title')}</h3>
                        <p className="text-sm text-primary font-medium">{getNestedProperty(educationData, 'software.institution')} | {getNestedProperty(educationData, 'software.period')}</p>
                        <p className="text-sm text-gray-600 mt-2">{getNestedProperty(educationData, 'software.description')}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{getNestedProperty(educationData, 'businessEd.title')}</h3>
                        <p className="text-sm text-primary font-medium">{getNestedProperty(educationData, 'businessEd.institution')}</p>
                        <p className="text-sm text-gray-600 mt-2">{getNestedProperty(educationData, 'businessEd.description')}</p>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'certifications' && (
                    <div className="space-y-6 animate-fade-in-up">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{getNestedProperty(certificationsData, 'management.title')}</h3>
                        <p className="text-sm text-primary font-medium">{getNestedProperty(certificationsData, 'management.issuer')} | {getNestedProperty(certificationsData, 'management.period')}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{getNestedProperty(certificationsData, 'organizations.title')}</h3>
                        <p className="text-sm text-primary font-medium">{getNestedProperty(certificationsData, 'organizations.issuer')} | {getNestedProperty(certificationsData, 'organizations.period')}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{getNestedProperty(certificationsData, 'teaching.title')}</h3>
                        <p className="text-sm text-primary font-medium">{getNestedProperty(certificationsData, 'teaching.issuer')}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{getNestedProperty(certificationsData, 'microsoft.title')}</h3>
                        <p className="text-sm text-primary font-medium">{getNestedProperty(certificationsData, 'microsoft.issuer')} | {getNestedProperty(certificationsData, 'microsoft.period')}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding-authority bg-gradient-to-br from-gray-50 to-white">
        <div className="container-authority">
          <div className="text-center mb-16">
            <h2 className="text-section-title-authority mb-6 gradient-text-authority">
              {t('home', 'contact.title')}
            </h2>
            <div className="w-24 h-1 bg-gradient-primary mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home', 'contact.subtitle')}
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            {/* Contact Options */}
            <div className="grid md:grid-cols-4 gap-6 mb-16">
              <div
                onClick={handleEmailClick}
                className="authority-card text-center p-6 block cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MailboxIcon size={40} className="text-black" />
                </div>
                <h3 className="text-lg font-bold mb-2">{t('home', 'contact.email')}</h3>
                <p className="text-primary font-medium">kirby@mrmcdonald.org</p>
              </div>
              
              <div
                onClick={handlePhoneClick}
                className="authority-card text-center p-6 cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 bg-gradient-warm rounded-xl flex items-center justify-center mx-auto mb-4">
                  <PhoneIcon size={40} />
                </div>
                <h3 className="text-lg font-bold mb-2">{t('home', 'contact.phone')}</h3>
                <p className="text-warm font-medium">435-893-6006</p>
                <p className="text-xs text-gray-500 mt-1">
                  {isMobile ? t('home', 'contact.phoneHelperMobile') : t('home', 'contact.phoneHelper')}
                </p>
              </div>
              
              <div className="authority-card text-center p-6">
                <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPinAreaIcon size={40} className="text-black" />

                </div>
                <h3 className="text-lg font-bold mb-2">{t('home', 'contact.location')}</h3>
                <p className="text-accent font-medium">Cedar City, Utah</p>
              </div>
              
              <Link 
                href="https://www.linkedin.com/in/ammaron" 
                target="_blank" 
                rel="noopener noreferrer"
                className="authority-card text-center p-6 block hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 bg-gradient-authority rounded-xl flex items-center justify-center mx-auto mb-4">
                <LinkedinLogoIcon size={40} />
                </div>
                <h3 className="text-lg font-bold mb-2">{t('home', 'contact.linkedin')}</h3>
                <p className="text-secondary font-medium">Professional Network</p>
              </Link>
            </div>
            
            {/* Contact Form */}
            <div className="authority-card p-8 lg:p-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold gradient-text-authority mb-2">
                  {t('home', 'contact.contactFormHeader')}
                </h3>
                <div className="w-16 h-0.5 bg-gradient-primary mx-auto"></div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('home', 'contact.formName')}
                    </label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder={t('home', 'contact.namePlaceholder')}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('home', 'contact.formEmail')}
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder={t('home', 'contact.emailPlaceholder')}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('home', 'contact.formSubject')}
                  </label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder={t('home', 'contact.subjectPlaceholder')}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('home', 'contact.formMessage')}
                  </label>
                  <textarea 
                    id="message" 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                    placeholder={t('home', 'contact.messagePlaceholder')}
                    required
                  ></textarea>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    type="submit" 
                    className={`btn-authority btn-primary-authority text-lg px-8 py-4 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                          <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        {t('home', 'contact.formSubmit')}
                      </>
                    )}
                  </button>
                  <Link 
                    href="https://linkedin.com/in/ammaron" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-authority btn-secondary-authority text-lg px-8 py-4"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </Link>
                </div>
              </form>
            </div>
            
            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="glass-authority p-6 rounded-2xl text-center">
                <h3 className="text-lg font-bold mb-3">{t('home', 'contact.scheduleCall')}</h3>
                <p className="text-gray-600 text-sm mb-4">{t('home', 'contact.professionalConsultation')}</p>
                <a 
                  href="#contact" 
                  onClick={(e) => handleAnchorClick(e, 'contact')}
                  className="btn-authority btn-warm-authority"
                >
                  {t('home', 'contact.contactMeToSchedule')}
                </a>
              </div>
              
              <div className="glass-authority p-6 rounded-2xl text-center">
                <h3 className="text-lg font-bold mb-3">{t('home', 'contact.downloadResume')}</h3>
                <p className="text-gray-600 text-sm mb-4">{t('home', 'contact.completeExperience')}</p>
                <Link href="/resume.pdf" className="btn-authority btn-secondary-authority" target="_blank" rel="noopener noreferrer">
                  {t('home', 'contact.downloadPdf')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}