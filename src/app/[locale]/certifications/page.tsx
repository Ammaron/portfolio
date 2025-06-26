'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/i18n/i18n-context';
import { Certificate, ShieldCheckIcon, Globe, GraduationCap } from '@phosphor-icons/react';

export default function CertificationsPage() {
  const [searchCode, setSearchCode] = useState('');
  const { t } = useI18n();

  const handleVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCode.trim()) {
      window.open(`/certifications/verify?code=${searchCode.trim().toUpperCase()}`, '_blank');
    }
  };

  const certificationTypes = [
    {
      id: 'cefr',
      title: 'CEFR English Certifications',
      levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
      description: 'Internationally recognized Common European Framework of Reference for Languages (CEFR) certifications.',
      features: [
        'Globally recognized standard',
        'Employer-trusted credentials',
        'University admission qualified',
        'Clear skill progression pathway'
      ],
      icon: Globe,
      color: 'primary'
    },
    {
      id: 'business',
      title: 'Professional Business Communication',
      levels: ['Professional'],
      description: 'Specialized certification for business English and professional communication skills.',
      features: [
        'Industry-specific terminology',
        'Executive communication skills',
        'Presentation and negotiation focus',
        'MBA-designed curriculum'
      ],
      icon: GraduationCap,
      color: 'warm'
    },
    {
      id: 'custom',
      title: 'Corporate & Custom Programs',
      levels: ['Customized'],
      description: 'Tailored certification programs designed for specific organizational needs.',
      features: [
        'Company-specific content',
        'Industry alignment',
        'Scalable team training',
        'ROI measurement included'
      ],
      icon: ShieldCheckIcon,
      color: 'accent'
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="hero-authority relative text-white section-padding-authority">
        <div className="floating-element floating-element-1"></div>
        <div className="floating-element floating-element-2"></div>
        
        <div className="container-authority relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium mb-6 animate-fade-in-up">
              <Certificate size={16} className="mr-2 text-warm" />
              Internationally Recognized Credentials
            </div>
            
            <h1 className="text-hero-authority mb-8 animate-fade-in-up animate-stagger-2">
              <span className="gradient-text-authority">Professional Certifications</span>
            </h1>
            
            <p className="text-xl lg:text-2xl mb-10 opacity-90 leading-relaxed animate-fade-in-up animate-stagger-3 max-w-3xl mx-auto">
              Validate your English language proficiency and professional communication skills with our MBA-designed, internationally recognized certification programs.
            </p>
            
            {/* Quick Verification */}
            <div className="glass-authority p-6 rounded-2xl max-w-md mx-auto animate-fade-in-up animate-stagger-4">
              <h3 className="text-lg font-bold mb-4">Verify a Certificate</h3>
              <form onSubmit={handleVerification} className="space-y-4">
                <input
                  type="text"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  placeholder="Enter certificate code (e.g., KMI-4D72-25-X9K2)"
                  className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  className="btn-authority btn-primary-authority w-full bg-white text-primary hover:bg-gray-100"
                >
                  <ShieldCheckIcon size={20} className="mr-2" />
                  Verify Certificate
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Certification Value Section */}
      <section className="section-padding-authority bg-gray-50">
        <div className="container-authority">
          <div className="text-center mb-16">
            <h2 className="text-section-title-authority mb-6 gradient-text-authority">
              Why Our Certifications Matter
            </h2>
            <div className="w-24 h-1 bg-gradient-primary mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Our certifications are backed by MBA-level educational design, international standards compliance, and proven business outcomes. Each certificate represents measurable achievement and professional competency.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="authority-card text-center p-8">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Globe size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 gradient-text-primary">International Recognition</h3>
              <p className="text-gray-600">CEFR-aligned certifications recognized by universities and employers worldwide</p>
            </div>
            
            <div className="authority-card text-center p-8">
              <div className="w-16 h-16 bg-gradient-warm rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <GraduationCap size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 gradient-text-warm">MBA-Designed Quality</h3>
              <p className="text-gray-600">Curriculum designed with business education expertise and professional outcomes focus</p>
            </div>
            
            <div className="authority-card text-center p-8">
              <div className="w-16 h-16 bg-gradient-accent rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <ShieldCheckIcon size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 gradient-text-accent">Verified Authenticity</h3>
              <p className="text-gray-600">Secure verification system with unique codes and tamper-proof digital records</p>
            </div>
            
            <div className="authority-card text-center p-8">
              <div className="w-16 h-16 bg-gradient-authority rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Certificate size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 gradient-text-authority">Career Impact</h3>
              <p className="text-gray-600">Proven track record of career advancement and professional opportunities for graduates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Certification Types */}
      <section className="section-padding-authority bg-background">
        <div className="container-authority">
          <div className="text-center mb-16">
            <h2 className="text-section-title-authority mb-6 gradient-text-authority">
              Certification Programs
            </h2>
            <div className="w-24 h-1 bg-gradient-primary mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our range of professional certification programs designed for career advancement and international recognition.
            </p>
          </div>
          
          <div className="space-y-8">
            {certificationTypes.map((cert, index) => (
              <div key={cert.id} className="authority-card p-8 lg:p-12 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex flex-col lg:flex-row items-start gap-8">
                  <div className="lg:w-2/3">
                    <div className="flex items-center mb-6">
                      <div className={`w-16 h-16 bg-gradient-${cert.color} rounded-2xl mr-6 flex items-center justify-center`}>
                        <cert.icon size={32} className="text-white" />
                      </div>
                      <div>
                        <h3 className={`text-2xl font-bold gradient-text-${cert.color}`}>{cert.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {cert.levels.map(level => (
                            <span key={level} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                              Level {level}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">{cert.description}</p>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {cert.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <svg className="w-5 h-5 mr-3 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="lg:w-1/3 text-center">
                    <Link href="/english-classes" className="btn-authority btn-primary-authority mb-4 w-full justify-center">
                      Learn More
                    </Link>
                    <Link href="/certifications/verify" className="btn-authority btn-secondary-authority w-full justify-center">
                      Verify Certificate
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification Section */}
      <section className="section-padding-authority bg-gradient-to-br from-gray-50 to-white">
        <div className="container-authority">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-section-title-authority mb-6 gradient-text-authority">
                Certificate Verification
              </h2>
              <div className="w-24 h-1 bg-gradient-primary mx-auto mb-6"></div>
              <p className="text-xl text-gray-600">
                Verify the authenticity of any certificate issued by our programs using our secure verification system.
              </p>
            </div>
            
            <div className="authority-card p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-6 gradient-text-authority">How Verification Works</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-gradient-primary text-white rounded-full flex items-center justify-center mr-4 flex-shrink-0 font-bold text-sm">1</div>
                      <p className="text-gray-700">Enter the unique certificate code found on the official certificate</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-gradient-warm text-white rounded-full flex items-center justify-center mr-4 flex-shrink-0 font-bold text-sm">2</div>
                      <p className="text-gray-700">Our system validates the code against our secure database</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-gradient-accent text-white rounded-full flex items-center justify-center mr-4 flex-shrink-0 font-bold text-sm">3</div>
                      <p className="text-gray-700">View complete certification details including dates, levels, and authenticity status</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-2xl">
                  <h4 className="text-xl font-bold mb-6 text-center">Verify Certificate</h4>
                  <form onSubmit={handleVerification} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Certificate Code</label>
                      <input
                        type="text"
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                        placeholder="KMI-4D72-25-X9K2"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn-authority btn-primary-authority w-full justify-center"
                    >
                      <ShieldCheckIcon size={20} className="mr-2" />
                      Verify Now
                    </button>
                  </form>
                  
                  <div className="mt-6 text-center">
                    <Link href="/certifications/verify" className="text-primary hover:text-primary-dark transition-colors text-sm">
                      Advanced verification options →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding-authority bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-authority">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-section-title-authority mb-6 gradient-text-authority">
              Ready to Earn Your Certification?
            </h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Join hundreds of professionals who have advanced their careers with our internationally recognized certifications. Start your journey to professional English mastery today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/english-classes" className="btn-authority btn-primary-authority text-lg px-8 py-4">
                <GraduationCap size={24} className="mr-2" />
                View Programs
              </Link>
              <Link href="/#contact" className="btn-authority btn-secondary-authority text-lg px-8 py-4">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}