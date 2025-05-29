'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/i18n/i18n-context';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('experience');
  const { t } = useI18n();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>
        </div>
        <div className="container mx-auto px-4 z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                <span className="text-primary">{t('home', 'hero.title')}</span>
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">
                {t('home', 'hero.subtitle')}
              </h2>
              <p className="text-lg mb-8 max-w-lg">
                {t('home', 'hero.description')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/#contact" className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors">
                  {t('home', 'hero.contactButton')}
                </Link>
                <Link href="/english-classes" className="px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white rounded-md transition-colors">
                  {t('home', 'hero.classesButton')}
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary">
                <Image 
                  src="https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Kirby McDonald" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home', 'about.title')}</h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <p className="text-lg mb-6">
                {t('home', 'about.paragraph1')}
              </p>
              <p className="text-lg mb-6">
                {t('home', 'about.paragraph2')}
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">HTML</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">CSS</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">JavaScript</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">Python</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">Microsoft Office</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">Adobe Creative Suite</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">Curriculum Development</span>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gray-light p-6 rounded-lg shadow-lg">
                <div className="flex border-b border-gray">
                  <button 
                    className={`px-4 py-2 font-medium ${activeTab === 'experience' ? 'text-primary border-b-2 border-primary' : 'text-gray-dark hover:text-primary'}`}
                    onClick={() => setActiveTab('experience')}
                  >
                    {t('home', 'about.tabExperience')}
                  </button>
                  <button 
                    className={`px-4 py-2 font-medium ${activeTab === 'education' ? 'text-primary border-b-2 border-primary' : 'text-gray-dark hover:text-primary'}`}
                    onClick={() => setActiveTab('education')}
                  >
                    {t('home', 'about.tabEducation')}
                  </button>
                  <button 
                    className={`px-4 py-2 font-medium ${activeTab === 'certifications' ? 'text-primary border-b-2 border-primary' : 'text-gray-dark hover:text-primary'}`}
                    onClick={() => setActiveTab('certifications')}
                  >
                    {t('home', 'about.tabCertifications')}
                  </button>
                </div>
                <div className="py-4">
                  {activeTab === 'experience' && (
                    <div className="space-y-4 animate-fade-in">
                      <div>
                        <h3 className="text-lg font-semibold">ELL Tutoring and Teaching</h3>
                        <p className="text-sm text-gray-dark">Mentor Teacher and English Instructor | Sept 2023 - Present</p>
                        <ul className="mt-2 list-disc list-inside text-sm">
                          <li>Mentored and managed more than five teachers</li>
                          <li>Taught English (A1 to B2) to Spanish-speaking students aged 12 to 60</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Cedar City High School</h3>
                        <p className="text-sm text-gray-dark">Business and CTE Teacher | Oct 2022 - Aug 2023</p>
                        <ul className="mt-2 list-disc list-inside text-sm">
                          <li>Designed courses in Web Development, Programming, and Office Applications</li>
                          <li>Integrated real-world business simulations</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Colorado City Unified School District</h3>
                        <p className="text-sm text-gray-dark">Title IV Coordinator, Business Teacher | July 2021 - Oct 2022</p>
                        <ul className="mt-2 list-disc list-inside text-sm">
                          <li>Increased CTE program enrollment by 20 percent</li>
                          <li>Taught History, Spanish, Business, Adobe Design, Robotics, and more</li>
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'education' && (
                    <div className="space-y-4 animate-fade-in">
                      <div>
                        <h3 className="text-lg font-semibold">Brigham Young University</h3>
                        <p className="text-sm text-gray-dark">Bachelor of Software Development | Expected May 2027</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Western Governors University</h3>
                        <p className="text-sm text-gray-dark">Master of Business Administration | Graduated Aug 2024</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Southern Utah University</h3>
                        <p className="text-sm text-gray-dark">Bachelor of Business Education</p>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'certifications' && (
                    <div className="space-y-4 animate-fade-in">
                      <div>
                        <h3 className="text-lg font-semibold">Utah State Teaching License</h3>
                        <p className="text-sm text-gray-dark">Issued Aug 2023</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Microsoft Office Specialist</h3>
                        <p className="text-sm text-gray-dark">Word, Excel, PowerPoint | Dec 2022</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Award of Excellence in Management Communication</h3>
                        <p className="text-sm text-gray-dark">Microsoft | Oct 2023</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Award of Excellence in Managing Organizations</h3>
                        <p className="text-sm text-gray-dark">WGU | Aug 2023</p>
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
      <section id="contact" className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home', 'contact.title')}</h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
            <p className="mt-4 text-lg">{t('home', 'contact.subtitle')}</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <div className="bg-background p-6 rounded-lg shadow-md text-center h-full">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{t('home', 'contact.email')}</h3>
                  <p className="text-primary">ammaron99@gmail.com</p>
                </div>
              </div>
              
              <div className="md:w-1/3">
                <div className="bg-background p-6 rounded-lg shadow-md text-center h-full">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{t('home', 'contact.phone')}</h3>
                  <p className="text-primary">435-893-6006</p>
                </div>
              </div>
              
              <div className="md:w-1/3">
                <div className="bg-background p-6 rounded-lg shadow-md text-center h-full">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{t('home', 'contact.location')}</h3>
                  <p className="text-primary">Cedar City, Utah</p>
                </div>
              </div>
            </div>
            
            <form className="mt-12 bg-background p-8 rounded-lg shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">{t('home', 'contact.formName')}</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-4 py-2 border border-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t('home', 'contact.namePlaceholder')}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">{t('home', 'contact.formEmail')}</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-2 border border-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t('home', 'contact.emailPlaceholder')}
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium mb-2">{t('home', 'contact.formSubject')}</label>
                <input 
                  type="text" 
                  id="subject" 
                  className="w-full px-4 py-2 border border-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('home', 'contact.subjectPlaceholder')}
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium mb-2">{t('home', 'contact.formMessage')}</label>
                <textarea 
                  id="message" 
                  rows={5} 
                  className="w-full px-4 py-2 border border-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('home', 'contact.messagePlaceholder')}
                  required
                ></textarea>
              </div>
              <div className="text-center">
                <button 
                  type="submit" 
                  className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
                >
                  {t('home', 'contact.formSubmit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
