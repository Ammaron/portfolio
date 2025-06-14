'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/i18n/i18n-context';

export default function TeachersPayTeachersPage() {
  const [filter, setFilter] = useState('all');
  const { t, tRaw } = useI18n();
  
  const categories = [
    { id: 'all', name: t('tpt', 'products.allResources') },
    { id: 'business', name: t('tpt', 'products.businessEducation') },
    { id: 'tech', name: t('tpt', 'products.technologyEducation') },
    { id: 'language', name: t('tpt', 'products.languageLearning') },
    { id: 'leadership', name: t('tpt', 'products.leadershipDevelopment') }
  ];
  
  // Get products from translations using tRaw for non-string values
  const products = (tRaw('tpt', 'products.list') as Array<{
    title: string;
    description: string;
    price: string;
    category: string;
    grade: string;
    hasInteractive: boolean;
    features: string[];
  }>) || [];
  
  // Static image URLs (these would typically be in a CMS or database)
  const productImages = [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ];
  
  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(product => product.category === filter);
  
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
              {t('tpt', 'products.businessAligned')}
            </div>
            
            <h1 className="text-hero-authority mb-8 animate-fade-in-up animate-stagger-2">
              <span className="gradient-text-authority">{t('tpt', 'hero.title')}</span>
            </h1>
            
            <p className="text-xl lg:text-2xl mb-10 opacity-90 leading-relaxed animate-fade-in-up animate-stagger-3 max-w-3xl mx-auto">
              {t('tpt', 'hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-stagger-4">
              <a 
                href="https://www.teacherspayteachers.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-authority btn-primary-authority text-lg px-8 py-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {t('tpt', 'hero.button')}
              </a>
              <Link 
                href="/#contact" 
                className="btn-authority btn-secondary-authority text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {t('tpt', 'interactive.contactButton')}
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Products Section */}
      <section className="section-padding-authority bg-gray-50">
        <div className="container-authority">
          <div className="text-center mb-16">
            <h2 className="text-section-title-authority mb-6 gradient-text-authority">
              {t('tpt', 'products.title')}
            </h2>
            <div className="w-24 h-1 bg-gradient-primary mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('tpt', 'products.professionalGradeDesc')}
            </p>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`cursor-pointer px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                  filter === category.id 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-blue-600 hover:text-white border border-gray-200 hover:border-blue-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <div key={index} className="card-flip-authority animate-fade-in-up cursor-pointer" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="card-flip-inner-authority">
                  {/* Card Front */}
                  <div className="card-flip-front-authority authority-card bg-white flex flex-col">
                    <div className="relative h-48 overflow-hidden rounded-t-xl">
                      <Image
                        src={productImages[index] || productImages[0]}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute top-3 right-3 bg-gradient-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                        {product.price}
                      </div>
                      <div className="absolute top-3 left-3 flex gap-2">
                        {product.hasInteractive && (
                          <div className="bg-gradient-warm text-white px-2 py-1 rounded-full text-xs font-medium">
                            {t('tpt', 'products.interactive')}
                          </div>
                        )}
                        <div className="bg-gradient-accent text-white px-2 py-1 rounded-full text-xs font-medium">
                          {t('tpt', 'products.roiDriven')}
                        </div>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold mb-3 text-gray-900">{product.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 flex-1">{product.description}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-medium">
                          {t('tpt', 'products.grades')}: {product.grade}
                        </span>
                        <span className="text-primary font-medium">{t('tpt', 'products.hoverForDetails')}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Back */}
                  <div className="card-flip-back-authority p-6 flex flex-col justify-between text-white">
                    <div>
                      <h3 className="text-xl font-bold mb-4">{product.title}</h3>
                      <p className="mb-6 opacity-90">{product.description}</p>
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                          {t('tpt', 'products.grades')}: {product.grade}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                          {product.price}
                        </div>
                        {product.hasInteractive && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            {t('tpt', 'products.interactive')}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        {product.features.map((feature, i) => (
                          <div key={i} className="flex items-center text-sm opacity-90">
                            <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-center">
                      <a 
                        href="#" 
                        className="cursor-pointer inline-block px-6 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                      >
                        {t('tpt', 'products.viewOnTPT')}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Interactive Resources Section */}
      <section className="section-padding-authority bg-background">
        <div className="container-authority">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-section-title-authority mb-6 gradient-text-authority">
                {t('tpt', 'interactive.title')}
              </h2>
              <div className="w-24 h-1 bg-gradient-primary mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 leading-relaxed">
                {t('tpt', 'interactive.description')}
              </p>
            </div>
            
            <div className="authority-card p-8 lg:p-12">
              <h3 className="text-2xl font-bold mb-8 text-center gradient-text-warm">
                {t('tpt', 'interactive.howToTitle')}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-gradient-primary text-white rounded-xl flex items-center justify-center mr-4 flex-shrink-0 font-bold">1</div>
                    <p className="text-gray-700 leading-relaxed">{t('tpt', 'interactive.step1')}</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-gradient-warm text-white rounded-xl flex items-center justify-center mr-4 flex-shrink-0 font-bold">2</div>
                    <p className="text-gray-700 leading-relaxed">{t('tpt', 'interactive.step2')}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-gradient-accent text-white rounded-xl flex items-center justify-center mr-4 flex-shrink-0 font-bold">3</div>
                    <p className="text-gray-700 leading-relaxed">{t('tpt', 'interactive.step3')}</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-gradient-authority text-white rounded-xl flex items-center justify-center mr-4 flex-shrink-0 font-bold">4</div>
                    <p className="text-gray-700 leading-relaxed">{t('tpt', 'interactive.step4')}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-10">
                <Link 
                  href="/#contact" 
                  className="btn-authority btn-primary-authority text-lg px-8 py-4"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {t('tpt', 'interactive.contactButton')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Professional Background */}
      <section className="section-padding-authority bg-gradient-to-br from-gray-50 to-white">
        <div className="container-authority">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-section-title-authority mb-6 gradient-text-authority">
                {t('tpt', 'background.title')}
              </h2>
              <div className="w-24 h-1 bg-gradient-primary mx-auto mb-6"></div>
              <p className="text-xl text-gray-600">
                {t('tpt', 'background.description')}
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="authority-card p-8 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 gradient-text-primary">
                  {t('tpt', 'background.businessTitle')}
                </h3>
                <ul className="space-y-3 text-left">
                  {(tRaw('tpt', 'background.businessBullets') as string[]).map((item) => (
                    <li key={item} className="flex items-start">
                      <svg className="w-5 h-5 mr-2 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="authority-card p-8 text-center">
                <div className="w-16 h-16 bg-gradient-warm rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 gradient-text-warm">
                  {t('tpt', 'background.techTitle')}
                </h3>
                <ul className="space-y-3 text-left">
                  {(tRaw('tpt', 'background.techBullets') as string[]).map((item) => (
                    <li key={item} className="flex items-start">
                      <svg className="w-5 h-5 mr-2 text-warm mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="authority-card p-8 text-center">
                <div className="w-16 h-16 bg-gradient-accent rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 gradient-text-accent">
                  {t('tpt', 'background.resultsTitle')}
                </h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text-authority mb-1">20%</div>
                    <div className="text-sm text-gray-600">{t('home', 'about.enrollmentIncrease')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text-warm mb-1">5+</div>
                    <div className="text-sm text-gray-600">{t('home', 'about.teachersManaged')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text-accent mb-1">100%</div>
                    <div className="text-sm text-gray-600">{t('home', 'about.curriculumDeveloped')}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  {t('tpt', 'background.resultsDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}