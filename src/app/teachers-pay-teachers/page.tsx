'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function TeachersPayTeachersPage() {
  const [filter, setFilter] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Resources' },
    { id: 'business', name: 'Business Education' },
    { id: 'tech', name: 'Technology Education' },
    { id: 'language', name: 'Language Learning' }
  ];
  
  // Sample products - in a real implementation, these would be loaded from a database
  const products = [
    {
      id: 1,
      title: 'Business Communication Module',
      description: 'Complete lesson plans for teaching effective business communication',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      price: '$12.99',
      category: 'business',
      grade: '9-12',
      hasInteractive: true
    },
    {
      id: 2,
      title: 'Web Development Basics',
      description: 'Introduction to HTML, CSS, and JavaScript for beginners',
      image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      price: '$15.99',
      category: 'tech',
      grade: '8-12',
      hasInteractive: true
    },
    {
      id: 3,
      title: 'Spanish Vocabulary Builder',
      description: 'Comprehensive vocabulary exercises for Spanish learners',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      price: '$9.99',
      category: 'language',
      grade: '6-12',
      hasInteractive: false
    },
    {
      id: 4,
      title: 'Entrepreneurship Project',
      description: 'Project-based learning module for teaching entrepreneurship',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      price: '$18.99',
      category: 'business',
      grade: '9-12',
      hasInteractive: false
    },
    {
      id: 5,
      title: 'Adobe Design Fundamentals',
      description: 'Introduction to Adobe Creative Suite for classroom use',
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      price: '$14.99',
      category: 'tech',
      grade: '7-12',
      hasInteractive: true
    },
    {
      id: 6,
      title: 'ESL Conversation Starters',
      description: 'Engaging conversation prompts for English language learners',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      price: '$7.99',
      category: 'language',
      grade: 'All levels',
      hasInteractive: false
    }
  ];
  
  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(product => product.category === filter);
  
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/20 to-secondary/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Teachers Pay Teachers Store</h1>
            <p className="text-lg mb-8">
              Discover educational resources and interactive teaching materials created by Kirby McDonald. 
              From business education to language learning, find resources to enhance your classroom experience.
            </p>
            <a 
              href="https://www.teacherspayteachers.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors inline-block"
            >
              Visit TPT Store
            </a>
          </div>
        </div>
      </section>
      
      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Educational Resources</h2>
            
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setFilter(category.id)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    filter === category.id 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-light hover:bg-gray text-foreground'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <div key={product.id} className="card-flip h-96">
                  <div className="card-flip-inner h-full">
                    {/* Card Front */}
                    <div className="card-flip-front bg-background shadow-lg rounded-lg overflow-hidden h-full flex flex-col">
                      <div className="relative h-48">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-sm font-medium">
                          {product.price}
                        </div>
                        {product.hasInteractive && (
                          <div className="absolute bottom-2 left-2 bg-secondary text-white px-2 py-1 rounded text-xs">
                            Interactive
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                        <p className="text-sm mb-3 flex-1">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs bg-gray-light px-2 py-1 rounded">
                            Grades: {product.grade}
                          </span>
                          <span className="text-xs text-primary">Hover for details</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Card Back */}
                    <div className="card-flip-back bg-primary text-white p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">{product.title}</h3>
                        <p className="mb-4">{product.description}</p>
                        <ul className="space-y-2 mb-4">
                          <li className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            Grade Level: {product.grade}
                          </li>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            Price: {product.price}
                          </li>
                          {product.hasInteractive && (
                            <li className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                              </svg>
                              Includes interactive website
                            </li>
                          )}
                        </ul>
                      </div>
                      <div className="text-center">
                        <a 
                          href="#" 
                          className="inline-block px-4 py-2 bg-white text-primary rounded hover:bg-gray-light transition-colors"
                        >
                          View on TPT
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Interactive Resources Section */}
      <section className="py-16 bg-gradient-to-br from-secondary/10 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Interactive Resources</h2>
            <p className="text-lg mb-8">
              Some of my Teachers Pay Teachers products include access to interactive websites that enhance the learning experience. 
              These password-protected resources are available exclusively to customers who purchase the corresponding TPT products.
            </p>
            <div className="bg-background p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">How to Access Interactive Resources</h3>
              <ol className="text-left space-y-4 mb-6">
                <li className="flex">
                  <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">1</span>
                  <p>Purchase the product from my Teachers Pay Teachers store</p>
                </li>
                <li className="flex">
                  <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">2</span>
                  <p>Look for the access instructions in the downloaded materials</p>
                </li>
                <li className="flex">
                  <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">3</span>
                  <p>Visit the specific resource page and enter your access code</p>
                </li>
                <li className="flex">
                  <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">4</span>
                  <p>Enjoy the interactive content designed to complement the TPT resource</p>
                </li>
              </ol>
              <div className="mt-6">
                <Link 
                  href="/contact" 
                  className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors inline-block"
                >
                  Questions? Contact Me
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Teaching Background */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Teaching Background</h2>
            <div className="bg-background p-8 rounded-lg shadow-lg">
              <p className="mb-6">
                My resources are informed by my extensive teaching experience across various subjects and grade levels:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-primary">Business Education</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 mr-2 text-primary mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Business Communication
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 mr-2 text-primary mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Business Management
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 mr-2 text-primary mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Entrepreneurship
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 mr-2 text-primary mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Marketing
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 mr-2 text-primary mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Accounting
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-secondary">Technology Education</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 mr-2 text-secondary mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Web Development
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 mr-2 text-secondary mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Programming
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 mr-2 text-secondary mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Office Applications
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 mr-2 text-secondary mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Adobe Design
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 mr-2 text-secondary mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Digital Media
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
