'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function EnglishClassesPage() {
  const [activeTab, setActiveTab] = useState('classes');
  
  // Sample testimonials - in a real implementation, these would be loaded from a database
  const testimonials = [
    {
      id: 1,
      name: 'Maria Rodriguez',
      role: 'Student - B1 Level',
      content: 'Kirby is an excellent teacher who makes learning English enjoyable. His methods are effective and I have seen significant improvement in my speaking skills.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      name: 'Carlos Mendez',
      role: 'Student - A2 Level',
      content: 'I started with very basic English and now I can have conversations with confidence. The classes are interactive and tailored to my needs.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      name: 'Ana Gutierrez',
      role: 'Student - B2 Level',
      content: 'Kirby\'s teaching style is engaging and effective. He understands the challenges Spanish speakers face and provides targeted practice.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ];
  
  // Class offerings
  const classes = [
    {
      id: 'beginner',
      level: 'Beginner (A1)',
      description: 'Introduction to basic English vocabulary, simple phrases, and elementary grammar. Ideal for absolute beginners.',
      topics: ['Basic greetings and introductions', 'Simple present tense', 'Numbers and colors', 'Everyday vocabulary'],
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'elementary',
      level: 'Elementary (A2)',
      description: 'Build on basic knowledge with expanded vocabulary and grammar. Focus on simple conversations and daily situations.',
      topics: ['Past and future tenses', 'Asking and answering questions', 'Daily routines and activities', 'Basic reading comprehension'],
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'intermediate',
      level: 'Intermediate (B1)',
      description: 'Develop more complex language skills with emphasis on fluency and accuracy in various contexts.',
      topics: ['Complex grammar structures', 'Conversational fluency', 'Writing emails and short texts', 'Discussing opinions and ideas'],
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'upper',
      level: 'Upper Intermediate (B2)',
      description: 'Refine language skills with advanced vocabulary and grammar. Focus on professional and academic contexts.',
      topics: ['Advanced grammar and vocabulary', 'Business English', 'Academic writing', 'Presentation skills'],
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ];
  
  // Pricing options
  const pricingOptions = [
    {
      id: 'private',
      title: 'Private Classes',
      price: '$30',
      unit: 'per hour',
      features: [
        'One-on-one instruction',
        'Customized learning plan',
        'Flexible scheduling',
        'Personalized feedback',
        'Materials included'
      ],
      popular: true
    },
    {
      id: 'small',
      title: 'Small Group',
      price: '$20',
      unit: 'per hour',
      features: [
        '2-3 students',
        'Semi-customized curriculum',
        'Fixed schedule options',
        'Regular progress reports',
        'Materials included'
      ],
      popular: false
    },
    {
      id: 'large',
      title: 'Large Group',
      price: '$15',
      unit: 'per hour',
      features: [
        '4-6 students',
        'Standard curriculum',
        'Fixed schedule',
        'Monthly progress reports',
        'Materials included'
      ],
      popular: false
    }
  ];
  
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-secondary/20 to-primary/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">English Classes</h1>
            <p className="text-lg mb-8">
              Learn English with a bilingual teacher experienced in helping Spanish speakers of all ages achieve fluency.
              From beginner to advanced levels, classes are tailored to your specific needs and goals.
            </p>
            <Link 
              href="/#contact" 
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors inline-block"
            >
              Contact for Information
            </Link>
          </div>
        </div>
      </section>
      
      {/* Tabs Navigation */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-center border-b border-gray mb-8">
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'classes' ? 'text-primary border-b-2 border-primary' : 'text-gray-dark hover:text-primary'}`}
              onClick={() => setActiveTab('classes')}
            >
              Class Offerings
            </button>
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'pricing' ? 'text-primary border-b-2 border-primary' : 'text-gray-dark hover:text-primary'}`}
              onClick={() => setActiveTab('pricing')}
            >
              Pricing
            </button>
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'testimonials' ? 'text-primary border-b-2 border-primary' : 'text-gray-dark hover:text-primary'}`}
              onClick={() => setActiveTab('testimonials')}
            >
              Testimonials
            </button>
          </div>
          
          {/* Classes Content */}
          {activeTab === 'classes' && (
            <div className="animate-fade-in">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Class Levels</h2>
                <p className="text-lg">
                  Classes are available for all proficiency levels, from complete beginners to advanced students.
                  Each level focuses on developing key language skills appropriate to your current abilities.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {classes.map((classItem) => (
                  <div key={classItem.id} className="bg-background rounded-lg shadow-lg overflow-hidden">
                    <div className="relative h-48">
                      <Image
                        src={classItem.image}
                        alt={classItem.level}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                        <h3 className="text-white text-xl font-semibold p-4">{classItem.level}</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="mb-4">{classItem.description}</p>
                      <h4 className="font-semibold mb-2">Topics include:</h4>
                      <ul className="space-y-1">
                        {classItem.topics.map((topic, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-5 h-5 mr-2 text-primary mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="max-w-3xl mx-auto text-center mt-12">
                <p className="text-lg mb-6">
                  All classes are taught by Kirby McDonald, a bilingual educator with experience teaching English to Spanish speakers of all ages.
                </p>
                <Link 
                  href="/#contact" 
                  className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors inline-block"
                >
                  Inquire About Classes
                </Link>
              </div>
            </div>
          )}
          
          {/* Pricing Content */}
          {activeTab === 'pricing' && (
            <div className="animate-fade-in">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Pricing Options</h2>
                <p className="text-lg">
                  Choose the class format that best fits your learning style and budget.
                  All options include quality instruction and learning materials.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {pricingOptions.map((option) => (
                  <div 
                    key={option.id} 
                    className={`bg-background rounded-lg shadow-lg overflow-hidden border ${
                      option.popular ? 'border-primary' : 'border-gray'
                    } relative`}
                  >
                    {option.popular && (
                      <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-medium">
                        Most Popular
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                      <div className="mb-4">
                        <span className="text-3xl font-bold">{option.price}</span>
                        <span className="text-gray-dark"> {option.unit}</span>
                      </div>
                      <ul className="space-y-3 mb-6">
                        {option.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-5 h-5 mr-2 text-primary mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link 
                        href="/#contact" 
                        className={`block text-center px-6 py-3 rounded-md transition-colors ${
                          option.popular 
                            ? 'bg-primary hover:bg-primary-dark text-white' 
                            : 'border border-primary text-primary hover:bg-primary hover:text-white'
                        }`}
                      >
                        Select Plan
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="max-w-3xl mx-auto mt-12 bg-gray-light p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-center">Additional Information</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 text-primary mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>Package discounts available for multiple sessions purchased in advance</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 text-primary mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>Family discounts available for multiple family members enrolled</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 text-primary mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>Classes available online via video conferencing or in-person in Cedar City, Utah</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 text-primary mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>Primary communication through WhatsApp for scheduling and questions</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
          
          {/* Testimonials Content */}
          {activeTab === 'testimonials' && (
            <div className="animate-fade-in">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Student Testimonials</h2>
                <p className="text-lg">
                  Hear from students who have improved their English skills through my classes.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-background rounded-lg shadow-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <p className="text-sm text-gray-dark">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <svg className="absolute top-0 left-0 w-8 h-8 text-primary/20 -translate-x-4 -translate-y-4" fill="currentColor" viewBox="0 0 32 32">
                        <path d="M10 8c-2.2 0-4 1.8-4 4v10h10V12h-6c0-1.1 0.9-2 2-2h2V8h-4zm12 0c-2.2 0-4 1.8-4 4v10h10V12h-6c0-1.1 0.9-2 2-2h2V8h-4z"></path>
                      </svg>
                      <p className="italic">{testimonial.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="max-w-3xl mx-auto text-center mt-12">
                <Link 
                  href="/#contact" 
                  className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors inline-block"
                >
                  Start Your English Journey
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Improve Your English?</h2>
            <p className="text-lg mb-8">
              Whether you're a beginner or looking to advance your skills, I'm here to help you achieve your language goals.
              Contact me today to schedule a free consultation and placement assessment.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/#contact" 
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
              >
                Contact Me
              </Link>
              <a 
                href="https://wa.me/4358936006" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-secondary hover:bg-secondary-dark text-white rounded-md transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
