// i18n/translations.ts

// Type definitions for translations structure
export interface TranslationStructure {
  nav: {
    home: string;
    teachersPayTeachers: string;
    englishClasses: string;
    contact: string;
  };
  home: {
    hero: {
      title: string;
      subtitle: string;
      description: string;
      contactButton: string;
      classesButton: string;
      scrollHint: string;
      availableForLeadership: string;
    };
    businessValue: {
      title: string;
      subtitle: string;
      uniqueValue: string;
      educationExpert: {
        title: string;
        description: string;
      };
      businessLeader: {
        title: string;
        description: string;
      };
      techInnovator: {
        title: string;
        description: string;
      };
    };
    about: {
      title: string;
      subtitle: string;
      paragraph1: string;
      paragraph2: string;
      tabExperience: string;
      tabEducation: string;
      tabCertifications: string;
      businessImpact: string;
      enrollmentIncrease: string;
      teachersManaged: string;
      curriculumDeveloped: string;
      bilingualAdvantage: string;
      viewFullResume: string;
      experience: {
        education: {
          title: string;
          position: string;
          period: string;
          achievements: string[];
        };
        business: {
          title: string;
          position: string;
          period: string;
          achievements: string[];
        };
        growth: {
          title: string;
          position: string;
          period: string;
          achievements: string[];
        };
      };
      education: {
        mba: {
          title: string;
          institution: string;
          period: string;
          description: string;
        };
        software: {
          title: string;
          institution: string;
          period: string;
          description: string;
        };
        businessEd: {
          title: string;
          institution: string;
          period: string;
          description: string;
        };
      };
      certifications: {
        management: {
          title: string;
          issuer: string;
          period: string;
        };
        organizations: {
          title: string;
          issuer: string;
          period: string;
        };
        teaching: {
          title: string;
          issuer: string;
          period: string;
        };
        microsoft: {
          title: string;
          issuer: string;
          period: string;
        };
      };
      skills: string[];
      mbaCredential: string;
      businessLeadership: string;
      yearsLeading: string;
      yearsLeadingLabel: string;
    };
    contact: {
      title: string;
      subtitle: string;
      email: string;
      phone: string;
      location: string;
      linkedin: string;
      formName: string;
      formEmail: string;
      formSubject: string;
      formMessage: string;
      formSubmit: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      subjectPlaceholder: string;
      messagePlaceholder: string;
      quickConnect: string;
      scheduleCall: string;
      downloadResume: string;
      phoneHelper: string;
      phoneHelperMobile: string;
      professionalConsultation: string;
      contactMeToSchedule: string;
      completeExperience: string;
      downloadPdf: string;
    };
  };
  tpt: {
    hero: {
      title: string;
      description: string;
      button: string;
    };
    products: {
      title: string;
      professionalGradeDesc: string;
      allResources: string;
      businessEducation: string;
      technologyEducation: string;
      languageLearning: string;
      leadershipDevelopment: string;
      hoverForDetails: string;
      viewOnTPT: string;
      grades: string;
      interactive: string;
      roiDriven: string;
      businessAligned: string;
      list: Array<{
        title: string;
        description: string;
        price: string;
        category: string;
        grade: string;
        hasInteractive: boolean;
        features: string[];
      }>;
    };
    interactive: {
      title: string;
      description: string;
      howToTitle: string;
      step1: string;
      step2: string;
      step3: string;
      step4: string;
      contactButton: string;
    };
    background: {
      title: string;
      description: string;
      businessTitle: string;
      businessBullets: string[];
      techTitle: string;
      techBullets: string[];
      resultsTitle: string;
      resultsDesc: string;
    };
  };
  classes: {
    hero: {
      title: string;
      description: string;
      button: string;
    };
    tabs: {
      classOfferings: string;
      pricing: string;
      testimonials: string;
    };
    classLevels: {
      title: string;
      description: string;
      whyChooseTitle: string;
      whyChooseSubtitle: string;
      businessFirstTitle: string;
      businessFirstDesc: string;
      careerImpactTitle: string;
      careerImpactDesc: string;
      executiveInstructionTitle: string;
      executiveInstructionDesc: string;
      topicsInclude: string;
      programIncludes: string;
      teacherInfo: string;
      inquireButton: string;
      businessFocus: string;
      careerAdvancement: string;
      professionalCommunication: string;
      industrySpecific: string;
      certification: string;
      certificationDescription: string;
      professionalOutcome: string;
      hoverForDetails: string;
      clickForDetails: string;
      connectButton: string;
      programDuration: string;
      // Professional credentials badges
      mbaBadge: string;
      experienceBadge: string;
      bilingualBadge: string;
      scheduleConsultation: string;
      professionalInstructionTitle: string;
      list: Array<{
        id: string;
        level: string;
        description: string;
        topics: string[];
        outcomes: string;
        programDetails?: string;
      }>;
    };
    pricing: {
      title: string;
      description: string;
      mostPopular: string;
      perHour: string;
      selectPlan: string;
      additionalInfo: string;
      packageDiscounts: string;
      familyDiscounts: string;
      classesAvailable: string;
      communication: string;
      careerFocused: string;
      industryMaterials: string;
      options: Array<{
        id: string;
        title: string;
        price: string;
        unit: string;
        features: string[];
        popular: boolean;
        description: string;
      }>;
    };
    testimonials: {
      title: string;
      description: string;
      startButton: string;
      list: Array<{
        id: number;
        name: string;
        role: string;
        company: string;
        content: string;
        achievement: string;
        image?: string;
      }>;
    };
    cta: {
      title: string;
      description: string;
      contactButton: string;
      whatsappButton: string;
    };
  };
  footer: {
    description: string;
    bilingual: string;
    quickLinks: string;
    newsletter: string;
    subscribeText: string;
    subscribeButton: string;
    emailPlaceholder: string;
    thankYou: string;
    copyright: string;
    privacyPolicy: string;
    termsOfService: string;
    professionalNetwork: string;
    // Professional Credentials section
    professionalCredentials: string;
    mbaBusinessLeadership: string;
    educationalLeadership: string;
    technologyFocus: string;
    // Newsletter features
    newsletterFeatures: string;
    leadershipInsights: string;
    businessTips: string;
    edTechTrends: string;
    locationTitle: string;
    professionalWebsite: string;
    managementAward: string;
    programGrowth: string;
    bilingualExpertise: string;
  };
  cookieConsent: {
    title: string;
    description: string;
    accept: string;
    decline: string;
    privacyPolicy: string;
    feature1: string;
    feature2: string;
    feature3: string;
    feature4: string;
  };
  privacyPolicy: {
    title: string;
    lastUpdated: string;
    introduction: {
      title: string;
      content: string;
    };
    informationWeCollect: {
      title: string;
      websiteAnalytics: {
        title: string;
        description: string;
        items: string[];
      };
      contactInformation: {
        title: string;
        description: string;
        items: string[];
      };
    };
    howWeUse: {
      title: string;
      items: string[];
    };
    whatWeDont: {
      title: string;
      items: string[];
    };
    yourRights: {
      title: string;
      description: string;
      items: string[];
    };
    dataSecurity: {
      title: string;
      content: string;
    };
    thirdPartyServices: {
      title: string;
      description: string;
      items: string[];
      footer: string;
    };
    contactUs: {
      title: string;
      description: string;
      email: string;
      phone: string;
      location: string;
    };
    changes: {
      title: string;
      content: string;
    };
  };
}

export const translations: Record<'en' | 'es', TranslationStructure> = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      teachersPayTeachers: 'Educational Resources',
      englishClasses: 'English Classes',
      contact: 'Connect'
    },
    // Home page
    home: {
      hero: {
        title: 'Kirby McDonald',
        subtitle: 'Educational Leader | MBA | Technology Innovator',
        description: 'MBA-equipped educational leader with 5+ years of classroom experience, proven business acumen, and emerging technology expertise. Bridging education, business strategy, and innovation to drive meaningful results.',
        contactButton: 'Let\'s Connect',
        classesButton: 'English Classes',
        scrollHint: 'Scroll to explore',
        availableForLeadership: 'Available for Leadership Opportunities'
      },
      businessValue: {
        title: 'Strategic Value Proposition',
        subtitle: 'The intersection of education expertise, business acumen, and technology vision',
        uniqueValue: 'This rare combination makes me invaluable for roles spanning EdTech leadership, educational administration, corporate training, and business development in education-focused organizations.',
        educationExpert: {
          title: 'Educational Authority',
          description: 'Deep classroom experience with curriculum development, teacher management, and proven student outcomes across diverse demographics.'
        },
        businessLeader: {
          title: 'MBA-Driven Strategy',
          description: 'Advanced business education with focus on operations, leadership, and strategic growth. Award-winning performance in management and communication.'
        },
        techInnovator: {
          title: 'Technology Vision',
          description: 'Currently pursuing software development to understand and anticipate how technology will transform educational delivery and business operations.'
        }
      },
      about: {
        title: 'Leadership Through Innovation',
        subtitle: 'Where Education Meets Business Strategy',
        paragraph1: 'As an MBA-equipped educational leader, I bring a unique combination of classroom expertise, business strategy, and technology vision. With over five years of hands-on educational experience and proven results—including a 20% increase in program enrollment—I understand how to scale educational impact through strategic thinking.',
        paragraph2: 'Currently pursuing software development to stay ahead of educational technology trends, I bridge the gap between traditional education and innovative business solutions. My bilingual expertise (English/Spanish) and leadership experience managing teachers and developing curricula positions me uniquely in the evolving EdTech landscape.',
        tabExperience: 'Leadership Experience',
        tabEducation: 'Education & Credentials',
        tabCertifications: 'Awards & Recognition',
        businessImpact: 'Business Impact',
        enrollmentIncrease: '20% Program Enrollment Increase',
        teachersManaged: '5+ Teachers Managed',
        curriculumDeveloped: 'Complete Curriculum Development',
        bilingualAdvantage: 'Bilingual English/Spanish',
        viewFullResume: 'View Full Experience',
        // Experience tab content
        experience: {
          education: {
            title: 'Educational Leadership & English Instruction',
            position: 'Mentor Teacher & Business Developer',
            period: 'Sept 2023 - Present',
            achievements: [
              'Mentored and managed 5+ teachers in educational best practices',
              'Developed business-focused English curriculum (A1 to B2 levels)',
              'Served students aged 12-60 with measurable language outcomes'
            ]
          },
          business: {
            title: 'Business & Technology Education',
            position: 'CTE Department Leader',
            period: 'Oct 2022 - Aug 2023',
            achievements: [
              'Designed comprehensive business education curriculum',
              'Integrated real-world business simulations and technology',
              'Led cross-functional curriculum development initiatives'
            ]
          },
          growth: {
            title: 'Program Growth & Leadership',
            position: 'Title IV Coordinator',
            period: 'July 2021 - Oct 2022',
            achievements: [
              'Achieved 20% increase in CTE program enrollment',
              'Multi-subject expertise: Business, Technology, Languages',
              'Coordinated federal compliance and program optimization'
            ]
          }
        },
        // Education tab content
        education: {
          mba: {
            title: 'Master of Business Administration',
            institution: 'Western Governors University',
            period: 'Graduated Aug 2024',
            description: 'Focus: Business Operations, Strategic Leadership, Management Excellence'
          },
          software: {
            title: 'Bachelor of Software Development',
            institution: 'Brigham Young University',
            period: 'Expected May 2027',
            description: 'Technology innovation to stay ahead of EdTech trends'
          },
          businessEd: {
            title: 'Bachelor of Business Education',
            institution: 'Southern Utah University',
            period: '',
            description: 'Foundation in educational methodology and business principles'
          }
        },
        // Certifications tab content
        certifications: {
          management: {
            title: 'Award of Excellence in Management Communication',
            issuer: 'Microsoft',
            period: 'Oct 2023'
          },
          organizations: {
            title: 'Award of Excellence in Managing Organizations',
            issuer: 'Western Governors University',
            period: 'Aug 2023'
          },
          teaching: {
            title: 'Utah State Teaching License',
            issuer: 'Issued Aug 2023',
            period: ''
          },
          microsoft: {
            title: 'Microsoft Office Specialist',
            issuer: 'Word, Excel, PowerPoint',
            period: 'Dec 2022'
          }
        },
        // Skills list
        skills: [
          'Educational Leadership',
          'Business Strategy', 
          'Curriculum Development',
          'Team Management',
          'Technology Integration',
          'Bilingual Communication',
          'Project Management',
          'Data Analysis',
          'Software Development'
        ],
        // Floating badges
        mbaCredential: 'MBA',
        businessLeadership: 'Business Leadership',
        yearsLeading: '5+',
        yearsLeadingLabel: 'Years Leading'
      },
      contact: {
        title: 'Ready to Connect?',
        subtitle: 'Whether you\'re looking for educational leadership, business expertise, or innovative thinking',
        email: 'Email',
        phone: 'Phone',
        location: 'Location',
        linkedin: 'LinkedIn',
        formName: 'Name',
        formEmail: 'Email',
        formSubject: 'Subject',
        formMessage: 'Message',
        formSubmit: 'Send Message',
        namePlaceholder: 'Your Name',
        emailPlaceholder: 'Your Email',
        subjectPlaceholder: 'How can I help?',
        messagePlaceholder: 'Tell me about your project or opportunity...',
        quickConnect: 'Quick Connect Options',
        scheduleCall: 'Schedule a Call',
        downloadResume: 'Download Resume',
        phoneHelper: 'Click to copy',
        phoneHelperMobile: 'Tap to call',
        professionalConsultation: 'Professional consultation via video conference',
        contactMeToSchedule: 'Contact Me to Schedule',
        completeExperience: 'Complete professional experience overview',
        downloadPdf: 'Download PDF'
      }
    },
    // Teachers Pay Teachers page
    tpt: {
      hero: {
        title: 'Educational Resources & Solutions',
        description: 'Professional educational materials created from real classroom experience and business insights. From curriculum development to interactive learning tools, discover resources that drive measurable educational outcomes.',
        button: 'Explore Resources'
      },
      products: {
        title: 'Professional Teaching Resources',
        professionalGradeDesc: 'Premium educational materials designed with business-grade quality and measurable outcomes for professional learning environments.',
        allResources: 'All Resources',
        businessEducation: 'Business Education',
        technologyEducation: 'Technology Integration',
        languageLearning: 'Language Learning',
        leadershipDevelopment: 'Leadership Development',
        hoverForDetails: 'Hover for details',
        viewOnTPT: 'View Resource',
        grades: 'Grades',
        interactive: 'Interactive',
        roiDriven: 'ROI-Focused',
        businessAligned: 'Business-Aligned',
        list: [
          {
            title: 'Business Communication Excellence',
            description: 'MBA-designed curriculum for professional communication skills with ROI tracking and real-world applications',
            price: '$24.99',
            category: 'business',
            grade: '9-12, Adult Ed',
            hasInteractive: true,
            features: ['ROI Metrics', 'Business Cases', 'Leadership Focus', 'Assessment Tools']
          },
          {
            title: 'Technology Integration for Educators',
            description: 'Strategic framework for implementing technology in educational settings with business impact measurement',
            price: '$29.99',
            category: 'tech',
            grade: 'Professional Development',
            hasInteractive: true,
            features: ['Implementation Guide', 'Tech Stack', 'ROI Calculator', 'Training Materials']
          },
          {
            title: 'Professional English for Career Advancement',
            description: 'Business-focused English curriculum designed for career growth and professional development',
            price: '$19.99',
            category: 'language',
            grade: 'Adult Professional',
            hasInteractive: false,
            features: ['Career Focus', 'Interview Prep', 'Business Vocabulary', 'Networking Skills']
          },
          {
            title: 'Educational Leadership Toolkit',
            description: 'MBA-informed strategies for educational leaders with practical tools for team management and growth',
            price: '$34.99',
            category: 'leadership',
            grade: 'Leadership/Admin',
            hasInteractive: true,
            features: ['Team Management', 'Growth Strategies', 'Budget Planning', 'Performance Metrics']
          },
          {
            title: 'EdTech Strategy & Implementation',
            description: 'Complete guide for integrating technology in education with business case development and ROI analysis',
            price: '$27.99',
            category: 'tech',
            grade: 'K-12 Leadership',
            hasInteractive: true,
            features: ['Strategic Planning', 'Vendor Selection', 'Training Programs', 'Success Metrics']
          },
          {
            title: 'Business Skills for Educators',
            description: 'Professional development curriculum helping educators develop business acumen and leadership skills',
            price: '$22.99',
            category: 'business',
            grade: 'Professional Development',
            hasInteractive: false,
            features: ['Budget Management', 'Strategic Thinking', 'Leadership Development', 'Career Planning']
          }
        ]
      },
      interactive: {
        title: 'Technology-Enhanced Learning',
        description: 'My educational resources leverage technology to create engaging, measurable learning experiences. These premium resources combine traditional educational best practices with modern business-driven outcomes.',
        howToTitle: 'Access Premium Resources',
        step1: 'Purchase the educational resource from my professional store',
        step2: 'Receive detailed implementation guides and ROI tracking tools',
        step3: 'Access exclusive online components and interactive elements',
        step4: 'Measure and report on educational outcomes and business impact',
        contactButton: 'Discuss Custom Solutions'
      },
      background: {
        title: 'Educational Leadership Background',
        description: 'My resources are informed by real leadership experience and business outcomes in education:',
        businessTitle: 'Business & Leadership Education',
        businessBullets: [
          'MBA-Informed Strategy',
          'ROI-Focused Outcomes', 
          'Leadership Development',
          'Professional Communication',
          'Strategic Planning'
        ],
        techTitle: 'Technology Integration & Innovation',
        techBullets: [
          'EdTech Implementation',
          'Digital Transformation',
          'Software Development',
          'Technology Integration',
          'Innovation Strategy'
        ],
        resultsTitle: 'Measurable Results',
        resultsDesc: 'All resources designed with clear ROI metrics and outcome measurement capabilities.'
      }
    },
    // English Classes page
    classes: {
      hero: {
        title: 'Professional English Instruction',
        description: 'Business-focused English language instruction from an MBA-educated, bilingual professional. Specialized programs for career advancement, business communication, and professional development.',
        button: 'Explore Programs'
      },
      tabs: {
        classOfferings: 'Program Offerings',
        pricing: 'Investment Options',
        testimonials: 'Success Stories'
      },
      classLevels: {
        title: 'Professional English Programs',
        description: 'Comprehensive English language programs designed for career advancement and business success. Each program combines language acquisition with practical business applications.',
        whyChooseTitle: 'Why Choose Professional English Instruction?',
        whyChooseSubtitle: 'MBA-informed teaching approach designed specifically for career advancement and business success.',
        businessFirstTitle: 'Real-World Application Focus',
        businessFirstDesc: 'Every lesson connects to practical situations you\'ll actually encounter in daily life, travel, and professional settings.',
        careerImpactTitle: 'Trackable Life Results',
        careerImpactDesc: 'Measure your progress through real achievements: confident conversations, successful interviews, and expanded opportunities.',
        executiveInstructionTitle: 'Executive-Level Instruction',
        executiveInstructionDesc: 'Learn from a licensed educator with an MBA and years of proven classroom experience in both business and English instruction.',
        topicsInclude: 'Program includes',
        programIncludes: 'Program Includes',
        teacherInfo: 'All programs led by Kirby McDonald, MBA—a bilingual educational leader with extensive business and technology experience.',
        inquireButton: 'Discuss Your Goals',
        businessFocus: 'Business-Focused Curriculum',
        careerAdvancement: 'Career Advancement Track',
        professionalCommunication: 'Professional Communication',
        industrySpecific: 'Industry-Specific Training',
        certification: 'Certification',
        certificationDescription: 'Upon completion a certification will be given showing completion of course and backed by Mr. McDonald. Find out more on our certification page.',
        professionalOutcome: 'Professional Outcome:',
        hoverForDetails: 'Pasa el cursor para detalles del currículo',
        clickForDetails: 'Haz clic para detalles del currículo',
        connectButton: 'Conectar',
        programDuration: '¡De principiante completo a comunicador funcional en 90-100 horas guiadas y tareas para aprendizaje fuera del aula!',
        // Professional credentials badges
        mbaBadge: 'Liderazgo Empresarial MBA',
        experienceBadge: '5+ Años de Liderazgo Educativo', 
        bilingualBadge: 'Profesional Bilingüe',
        scheduleConsultation: 'Programar Consulta',
        professionalInstructionTitle: 'Instrucción Profesional',
        list: [
          {
            id: 'essential-foundations',
            level: 'Essential English Foundations (A1)',
            description: 'Master the building blocks of English communication',
            topics: [
              'Personal Communication - Introduce yourself, share basic information, and build social connections',
              'Daily Life Navigation - Handle routine situations like shopping, dining, and transportation',
              'Workplace Essentials - Present yourself professionally and engage in simple work conversations',
              'Grammar Foundations - Master present tense, basic questions, and essential sentence structures',
              'Practical Vocabulary - Learn 800+ high-frequency words for immediate real-world use',
              'Speaking Confidence - Practice pronunciation and fluency through guided conversations',
              'Functional Writing - Complete forms, write simple messages, and basic personal correspondence',
              'Cultural Awareness - Understand basic social customs and communication styles',
              'Official Certification - Receive internationally recognized CEFR A1 certificate upon completion'
            ],
            outcomes: 'Upon completion, you\'ll confidently introduce yourself, handle basic daily conversations, and navigate essential situations like shopping, ordering food, and asking for directions in English-speaking environments.',
            programDetails: 'Complete beginner to functional communicator in 90-100 guided hours and homework for learning outside of the classroom!'
          },
          {
            id: 'practical-communication',
            level: 'Practical English Communication (A2)',
            description: 'Build confidence for real-world interactions',
            topics: [
              'Experience Sharing - Describe past events, future plans, and personal experiences in detail',
              'Travel Mastery - Navigate airports, hotels, restaurants, and tourist attractions independently',
              'Social Interaction - Engage in longer conversations about hobbies, opinions, and current events',
              'Professional Development - Participate in meetings, make presentations, and network effectively',
              'Advanced Grammar - Master past tenses, future forms, and conditional expressions',
              'Expanded Vocabulary - Acquire 1,500+ words including abstract concepts and specialized terms',
              'Listening Skills - Understand movies, podcasts, and natural speech patterns',
              'Writing Proficiency - Create emails, reports, and personal narratives with proper structure',
              'Official Certification - Receive internationally recognized CEFR A2 certificate upon completion'
            ],
            outcomes: 'Upon completion, you\'ll comfortably discuss your experiences and plans, handle extended conversations about familiar topics, and effectively communicate in most travel and social situations with English speakers.',
            programDetails: 'Elementary to confident communicator in 90-100 guided hours and homework for learning outside of the classroom!'
          },
          {
            id: 'independent-mastery',
            level: 'Independent English Mastery (B1)',
            description: 'Express yourself clearly on any familiar topic',
            topics: [
              'Opinion Expression - Articulate viewpoints, justify decisions, and engage in debates effectively',
              'Problem-Solving - Handle complaints, negotiate solutions, and manage unexpected situations',
              'Academic Skills - Write structured essays, analyze texts, and present research findings',
              'Career Advancement - Lead meetings, deliver presentations, and interview confidently',
              'Complex Grammar - Master reported speech, passive voice, and advanced conditional forms',
              'Specialized Vocabulary - Learn 2,500+ words including business, academic, and technical terms',
              'Media Comprehension - Understand news, documentaries, and authentic materials independently',
              'Creative Writing - Produce stories, formal letters, and persuasive texts with style',
              'Official Certification - Receive internationally recognized CEFR B1 certificate upon completion'
            ],
            outcomes: 'Upon completion, you\'ll express opinions confidently, handle unexpected situations abroad, participate actively in workplace discussions, and articulate complex ideas about topics that interest you.',
            programDetails: 'Intermediate speaker to autonomous communicator in 150-200 guided hours and homework for learning outside of the classroom!'
          },
          {
            id: 'advanced-fluency',
            level: 'Advanced English Fluency (B2)',
            description: 'Communicate with native-like confidence and precision',
            topics: [
              'Advanced Discourse - Discuss abstract concepts, analyze complex issues, and debate with sophistication',
              'Professional Excellence - Lead international teams, negotiate contracts, and present to senior executives',
              'Academic Mastery - Write research papers, critical analyses, and comprehensive reports',
              'Cultural Fluency - Understand humor, idioms, and subtle cultural references naturally',
              'Sophisticated Grammar - Perfect advanced structures, stylistic variations, and register awareness',
              'Extensive Vocabulary - Command 4,000+ words including nuanced expressions and academic language',
              'Native-Level Comprehension - Follow rapid speech, technical discussions, and literary works',
              'Persuasive Communication - Craft compelling arguments, influential presentations, and professional correspondence',
              'Official Certification - Receive internationally recognized CEFR B2 certificate upon completion'
            ],
            outcomes: 'Upon completion, you\'ll engage fluently in complex discussions, excel in professional environments, understand nuanced content, and communicate sophisticated ideas with accuracy and natural flow.',
            programDetails: 'Upper-intermediate to near-native speaker in 150-200 guided hours and homework for learning outside of the classroom!'
          },
          {
            id: 'expert-proficiency',
            level: 'Expert English Proficiency (C1)',
            description: 'Achieve professional-level eloquence and precision',
            topics: [
              'Executive Communication - Lead boardroom discussions, deliver keynote speeches, and influence senior stakeholders',
              'Academic Excellence - Conduct research, write dissertations, and participate in scholarly discourse',
              'Strategic Thinking - Analyze complex scenarios, synthesize information, and present strategic recommendations',
              'Cross-Cultural Leadership - Navigate international business environments and cultural sensitivities expertly',
              'Masterful Grammar - Employ sophisticated structures with perfect accuracy and stylistic awareness',
              'Professional Vocabulary - Master 6,000+ words including specialized terminology and subtle distinctions',
              'Critical Analysis - Evaluate complex texts, media, and arguments with depth and insight',
              'Advanced Writing - Create publication-quality documents, proposals, and analytical reports',
              'Official Certification - Receive internationally recognized CEFR C1 certificate upon completion'
            ],
            outcomes: 'Upon completion, you\'ll communicate with native-speaker fluency, lead complex negotiations, analyze sophisticated texts, and express yourself with remarkable accuracy and natural style in any professional or academic context.',
            programDetails: 'Advanced speaker to expert communicator in 200-300 guided hours and homework for learning outside of the classroom!'
          },
          {
            id: 'native-mastery',
            level: 'Native-Level English Mastery (C2)',
            description: 'Reach the pinnacle of English language expertise',
            topics: [
              'Intellectual Discourse - Engage in philosophical debates, literary criticism, and high-level academic discussions',
              'Global Leadership - Navigate the most complex international negotiations and diplomatic communications',
              'Creative Mastery - Write with artistic expression, humor, and sophisticated stylistic techniques',
              'Professional Distinction - Excel in roles requiring exceptional language skills: interpretation, translation, editing',
              'Flawless Grammar - Demonstrate intuitive command of all grammatical subtleties and stylistic nuances',
              'Complete Vocabulary - Command 8,000+ words with full understanding of connotations and register',
              'Literary Appreciation - Analyze and appreciate literature, poetry, and complex cultural texts',
              'Authoritative Writing - Produce expert-level content: academic papers, professional publications, creative works',
              'Official Certification - Receive internationally recognized CEFR C2 certificate upon completion'
            ],
            outcomes: 'Upon completion, you\'ll possess native-speaker competence, excel in the most demanding professional situations, create original content with artistic flair, and demonstrate complete mastery of English in all its forms and registers.',
            programDetails: 'Expert speaker to native-level mastery in 300-500 guided hours and homework for learning outside of the classroom!'
          }
        ]
      },
      pricing: {
        title: 'Professional Development Investment',
        description: 'Choose the program structure that aligns with your career goals and professional development budget. All options include comprehensive materials and business-focused content.',
        mostPopular: 'Most Popular',
        perHour: 'per session',
        selectPlan: 'Select Program',
        additionalInfo: 'Professional Development Features',
        packageDiscounts: 'Corporate packages available for team training and professional development',
        familyDiscounts: 'Family discounts available for multiple family members in professional programs',
        classesAvailable: 'Programs available online via professional video conferencing or in-person in Cedar City, Utah',
        communication: 'Professional communication via LinkedIn, email, and WhatsApp for scheduling',
        careerFocused: 'Career advancement and business communication focus',
        industryMaterials: 'Industry-specific materials and case studies included',
        options: [
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
        ]
      },
      testimonials: {
        title: 'Professional Success Stories',
        description: 'Hear from professionals who have advanced their careers through our business-focused English programs.',
        startButton: 'Start Your Professional Journey',
        list: [
          {
            id: 1,
            name: 'Maria Rodriguez',
            role: 'Marketing Manager - B2 Level Graduate',
            company: 'Tech Startup',
            content: 'Kirby\'s business-focused approach helped me transition from basic English to leading international marketing campaigns. The MBA perspective in teaching made all the difference.',
            achievement: 'Promoted to Marketing Manager',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
          },
          {
            id: 2,
            name: 'Carlos Mendez',
            role: 'Software Engineer - A2 to B2 Progress',
            company: 'Fortune 500',
            content: 'The combination of English instruction with technology focus was perfect for my career in software development. Now I lead international development teams.',
            achievement: 'International Team Lead',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
          },
          {
            id: 3,
            name: 'Ana Gutierrez',
            role: 'Educational Administrator - C1 Level',
            company: 'School District',
            content: 'Learning from an educator with MBA experience was invaluable. Kirby understands both language learning and professional advancement needs.',
            achievement: 'District Leadership Role',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
          }
        ]
      },
      cta: {
        title: 'Ready to Advance Your Career?',
        description: 'Whether you\'re seeking promotion, changing industries, or expanding your professional network, our MBA-designed English programs will help you achieve your career goals. Contact me for a professional consultation and career assessment.',
        contactButton: 'Professional Consultation',
        whatsappButton: 'Quick Connect'
      }
    },
    // Footer
    footer: {
      description: 'Educational Leader, MBA, and Technology Innovator based in Cedar City, Utah.',
      bilingual: 'Bilingual professional specializing in the intersection of education, business strategy, and emerging technology.',
      quickLinks: 'Professional Links',
      newsletter: 'Professional Updates',
      subscribeText: 'Subscribe for insights on educational leadership, business strategy, and technology trends',
      subscribeButton: 'Subscribe',
      emailPlaceholder: 'Your professional email',
      thankYou: 'Thank you for subscribing to professional updates!',
      copyright: 'All rights reserved.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      professionalNetwork: 'Professional Network',
      // Professional Credentials section
      professionalCredentials: 'Professional Credentials',
      mbaBusinessLeadership: 'MBA - Business Leadership',
      educationalLeadership: '5+ Years Educational Leadership',
      technologyFocus: 'Technology Innovation Focus',
      // Newsletter features
      newsletterFeatures: 'What you\'ll receive:',
      leadershipInsights: 'Educational leadership insights',
      businessTips: 'Business strategy tips',
      edTechTrends: 'EdTech trends and opportunities',
      // Bottom section
      locationTitle: 'Cedar City, Utah | Educational Leader | MBA | Technology Innovator',
      professionalWebsite: 'Professional website designed for educational leadership opportunities',
      // Professional Recognition
      managementAward: 'Award-Winning Business Communication',
      programGrowth: '20% Program Growth Achievement',
      bilingualExpertise: 'Bilingual Professional Expertise'
    },
    // Cookie Consent
    cookieConsent: {
      title: 'Cookie Policy',
      description: 'This website uses Microsoft Clarity to understand how visitors use our site and make improvements. We do not currently use advertising or marketing cookies, but may add analytics for marketing insights in the future.',
      accept: 'Got It',
      decline: 'No Thanks',
      privacyPolicy: 'Privacy Policy',
      feature1: 'Essential cookies for site functionality',
      feature2: 'Website analytics to improve your experience',
      feature3: 'Optional: Future marketing insights (anonymized)',
      feature4: 'GDPR compliant'
    },
    // Privacy Policy
    privacyPolicy: {
      title: 'Privacy Policy',
      lastUpdated: 'Last Updated: June 16, 2025',
      introduction: {
        title: 'Introduction',
        content: 'This privacy policy explains how we collect, use, and protect your information when you visit our website or use our services.'
      },
      informationWeCollect: {
        title: 'Information We Collect',
        websiteAnalytics: {
          title: 'Website Analytics',
          description: 'We use Microsoft Clarity to collect data on how visitors use our site. This helps us improve our website and services.',
          items: [
            'Pages visited',
            'Time spent on site',
            'Links clicked',
            'Referring website'
          ]
        },
        contactInformation: {
          title: 'Contact Information',
          description: 'If you contact us, we collect your name, email address, and any other information you provide.',
          items: [
            'Name',
            'Email address',
            'Phone number',
            'Message content'
          ]
        }
      },
      howWeUse: {
        title: 'How We Use Your Information',
        items: [
          'To improve our website and services',
          'To respond to your comments and questions',
          'To send you updates and promotional materials',
          'To analyze website usage and trends'
        ]
      },
      whatWeDont: {
        title: 'What We Don\'t Do with Your Information',
        items: [
          'We don\'t sell or rent your personal information to third parties',
          'We don\'t use your information for automated decision-making',
          'We don\'t collect sensitive information like race, religion, or health data'
        ]
      },
      yourRights: {
        title: 'Your Rights',
        description: 'You have the right to access, correct, or delete your personal information. You can also object to or restrict certain processing of your data.',
        items: [
          'Right to access your data',
          'Right to correct your data',
          'Right to delete your data',
          'Right to object to processing'
        ]
      },
      dataSecurity: {
        title: 'Data Security',
        content: 'We take data security seriously and use appropriate measures to protect your information from unauthorized access, disclosure, or misuse.'
      },
      thirdPartyServices: {
        title: 'Third Party Services',
        description: 'We may use third party services to help us operate our business and the website or provide services to you.',
        items: [
          'Microsoft Clarity (analytics)',
          'Email service providers',
          'Payment processors',
          'Customer relationship management (CRM) software'
        ],
        footer: 'We ensure that these third parties comply with data protection laws and have appropriate security measures in place.'
      },
      contactUs: {
        title: 'Contact Us',
        description: 'If you have any questions or concerns about this privacy policy or our data practices, please contact us.',
        email: 'Email: ammaron99@gmail.com',
        phone: 'Phone: (435) 893-6006',
        location: 'Location: Cedar City, Utah'
      },
      changes: {
        title: 'Changes to This Policy',
        content: 'We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on our website with a new effective date.'
      }
    }
  },
  es: {
    // Navigation
    nav: {
      home: 'Inicio',
      teachersPayTeachers: 'Recursos Educativos',
      englishClasses: 'Clases de Inglés',
      contact: 'Conectar'
    },
    // Home page
    home: {
      hero: {
        title: 'Kirby McDonald',
        subtitle: 'Líder Educativo | MBA | Innovador Tecnológico',
        description: 'Líder educativo con MBA, más de 5 años de experiencia en el aula, perspicacia empresarial comprobada y experiencia tecnológica emergente. Conectando educación, estrategia empresarial e innovación para impulsar resultados significativos.',
        contactButton: 'Conectemos',
        classesButton: 'Clases de Inglés',
        scrollHint: 'Desplázate para explorar',
        availableForLeadership: 'Disponible para Oportunidades de Liderazgo'
      },
      businessValue: {
        title: 'Propuesta de Valor Estratégico',
        subtitle: 'La intersección de experiencia educativa, perspicacia empresarial y visión tecnológica',
        uniqueValue: 'Esta rara combinación me hace invaluable para roles que abarcan liderazgo EdTech, administración educativa, capacitación corporativa y desarrollo empresarial en organizaciones enfocadas en educación.',
        educationExpert: {
          title: 'Autoridad Educativa',
          description: 'Experiencia profunda en el aula con desarrollo curricular, gestión de maestros y resultados estudiantiles comprobados en diversas demografías.'
        },
        businessLeader: {
          title: 'Estrategia Impulsada por MBA',
          description: 'Educación empresarial avanzada con enfoque en operaciones, liderazgo y crecimiento estratégico. Rendimiento galardonado en gestión y comunicación.'
        },
        techInnovator: {
          title: 'Visión Tecnológica',
          description: 'Actualmente estudiando desarrollo de software para entender y anticipar cómo la tecnología transformará la entrega educativa y las operaciones empresariales.'
        }
      },
      about: {
        title: 'Liderazgo a Través de la Innovación',
        subtitle: 'Donde la Educación se Encuentra con la Estrategia Empresarial',
        paragraph1: 'Como líder educativo con MBA, aporto una combinación única de experiencia en el aula, estrategia empresarial y visión tecnológica. Con más de cinco años de experiencia educativa práctica y resultados comprobados—incluyendo un aumento del 20% en la inscripción de programas—entiendo cómo escalar el impacto educativo a través del pensamiento estratégico.',
        paragraph2: 'Actualmente estudiando desarrollo de software para mantenerme a la vanguardia de las tendencias de tecnología educativa, soy el puente entre la educación tradicional y las soluciones empresariales innovadoras. Mi experiencia bilingüe (inglés/español) y experiencia en liderazgo gestionando maestros y desarrollando currículos me posiciona de manera única en el panorama EdTech en evolución.',
        tabExperience: 'Experiencia de Liderazgo',
        tabEducation: 'Educación y Credenciales',
        tabCertifications: 'Premios y Reconocimientos',
        businessImpact: 'Impacto Empresarial',
        enrollmentIncrease: '20% Aumento en Inscripción de Programas',
        teachersManaged: '5+ Maestros Gestionados',
        curriculumDeveloped: 'Desarrollo Completo de Currículo',
        bilingualAdvantage: 'Bilingüe Inglés/Español',
        viewFullResume: 'Ver Experiencia Completa',
        // Experience tab content
        experience: {
          education: {
            title: 'Liderazgo Educativo e Instrucción de Inglés',
            position: 'Maestro Mentor y Desarrollador de Negocios',
            period: 'Sept 2023 - Presente',
            achievements: [
              'Mentoreé y gestioné a más de 5 maestros en las mejores prácticas educativas',
              'Desarrollé un currículo de inglés enfocado en negocios (niveles A1 a B2)',
              'Atendí a estudiantes de 12 a 60 años con resultados medibles en el aprendizaje de idiomas'
            ]
          },
          business: {
            title: 'Educación en Negocios y Tecnología',
            position: 'Líder del Departamento CTE',
            period: 'Oct 2022 - Ago 2023',
            achievements: [
              'Diseñé un currículo integral de educación empresarial',
              'Integré simulaciones empresariales del mundo real y tecnología',
              'Lideré iniciativas de desarrollo curricular interdisciplinario'
            ]
          },
          growth: {
            title: 'Crecimiento de Programas y Liderazgo',
            position: 'Coordinador del Título IV',
            period: 'Jul 2021 - Oct 2022',
            achievements: [
              'Logré un aumento del 20% en la inscripción de programas CTE',
              'Experiencia en múltiples materias: Negocios, Tecnología, Idiomas',
              'Coordiné el cumplimiento federal y la optimización del programa'
            ]
          }
        },
        // Education tab content
        education: {
          mba: {
            title: 'Maestría en Administración de Empresas',
            institution: 'Western Governors University',
            period: 'Graduado Ago 2024',
            description: 'Enfoque: Operaciones Empresariales, Liderazgo Estratégico, Excelencia en Gestión'
          },
          software: {
            title: 'Licenciatura en Desarrollo de Software',
            institution: 'Brigham Young University',
            period: 'Esperado May 2027',
            description: 'Innovación tecnológica para mantenerse a la vanguardia de las tendencias EdTech'
          },
          businessEd: {
            title: 'Licenciatura en Educación Empresarial',
            institution: 'Southern Utah University',
            period: '',
            description: 'Fundamento en metodología educativa y principios empresariales'
          }
        },
        // Certifications tab content
        certifications: {
          management: {
            title: 'Premio a la Excelencia en Comunicación Empresarial',
            issuer: 'Microsoft',
            period: 'Oct 2023'
          },
          organizations: {
            title: 'Premio a la Excelencia en Gestión de Organizaciones',
            issuer: 'Western Governors University',
            period: 'Ago 2023'
          },
          teaching: {
            title: 'Licencia de Enseñanza del Estado de Utah',
            issuer: 'Emitida Ago 2023',
            period: ''
          },
          microsoft: {
            title: 'Especialista en Microsoft Office',
            issuer: 'Word, Excel, PowerPoint',
            period: 'Dic 2022'
          }
        },
        // Skills list
        skills: [
          'Liderazgo Educativo',
          'Estrategia Empresarial', 
          'Desarrollo Curricular',
          'Gestión de Equipos',
          'Integración Tecnológica',
          'Comunicación Bilingüe',
          'Gestión de Proyectos',
          'Análisis de Datos',
          'Desarrollo de Software'
        ],
        // Floating badges
        mbaCredential: 'MBA',
        businessLeadership: 'Liderazgo Empresarial',
        yearsLeading: '5+',
        yearsLeadingLabel: 'Años Liderando'
      },
      contact: {
        title: '¿Listo para Conectar?',
        subtitle: 'Ya sea que busques liderazgo educativo, experiencia empresarial o pensamiento innovador',
        email: 'Correo',
        phone: 'Teléfono',
        location: 'Ubicación',
        linkedin: 'LinkedIn',
        formName: 'Nombre',
        formEmail: 'Correo',
        formSubject: 'Asunto',
        formMessage: 'Mensaje',
        formSubmit: 'Enviar Mensaje',
        namePlaceholder: 'Tu Nombre',
        emailPlaceholder: 'Tu Correo',
        subjectPlaceholder: '¿Cómo puedo ayudar?',
        messagePlaceholder: 'Cuéntame sobre tu proyecto u oportunidad...',
        quickConnect: 'Opciones de Conexión Rápida',
        scheduleCall: 'Programar una Llamada',
        downloadResume: 'Descargar CV',
        phoneHelper: 'Clic para copiar',
        phoneHelperMobile: 'Toca para llamar',
        professionalConsultation: 'Consulta profesional vía videoconferencia',
        contactMeToSchedule: 'Contáctame para programar',
        completeExperience: 'Resumen completo de la experiencia profesional',
        downloadPdf: 'Descargar PDF'
      }
    },
    // Teachers Pay Teachers page
    tpt: {
      hero: {
        title: 'Recursos y Soluciones Educativas',
        description: 'Materiales educativos profesionales creados a partir de experiencia real en el aula y perspectivas empresariales. Desde desarrollo curricular hasta herramientas de aprendizaje interactivo, descubre recursos que impulsan resultados educativos medibles.',
        button: 'Explorar Recursos'
      },
      products: {
        title: 'Recursos Profesionales de Enseñanza',
        professionalGradeDesc: 'Materiales educativos premium diseñados con calidad de grado empresarial y resultados medibles para entornos de aprendizaje profesional.',
        allResources: 'Todos los Recursos',
        businessEducation: 'Educación Empresarial',
        technologyEducation: 'Integración Tecnológica',
        languageLearning: 'Aprendizaje de Idiomas',
        leadershipDevelopment: 'Desarrollo de Liderazgo',
        hoverForDetails: 'Pasa el cursor para detalles',
        viewOnTPT: 'Ver Recurso',
        grades: 'Grados',
        interactive: 'Interactivo',
        roiDriven: 'Enfocado en ROI',
        businessAligned: 'Alineado con Negocios',
        list: [
          {
            title: 'Excelencia en Comunicación Empresarial',
            description: 'Currículo diseñado por MBA para habilidades de comunicación profesional con seguimiento de ROI y aplicaciones del mundo real',
            price: '$24.99',
            category: 'business',
            grade: '9-12, Educación de Adultos',
            hasInteractive: true,
            features: ['Métricas de ROI', 'Casos Empresariales', 'Enfoque de Liderazgo', 'Herramientas de Evaluación']
          },
          {
            title: 'Integración Tecnológica para Educadores',
            description: 'Marco estratégico para implementar tecnología en entornos educativos con medición de impacto empresarial',
            price: '$29.99',
            category: 'tech',
            grade: 'Desarrollo Profesional',
            hasInteractive: true,
            features: ['Guía de Implementación', 'Stack Tecnológico', 'Calculadora de ROI', 'Materiales de Entrenamiento']
          },
          {
            title: 'Inglés Profesional para Avance Profesional',
            description: 'Currículo de inglés enfocado en negocios diseñado para crecimiento profesional y desarrollo profesional',
            price: '$19.99',
            category: 'language',
            grade: 'Profesional Adulto',
            hasInteractive: false,
            features: ['Enfoque Profesional', 'Preparación de Entrevistas', 'Vocabulario Empresarial', 'Habilidades de Networking']
          },
          {
            title: 'Kit de Herramientas de Liderazgo Educativo',
            description: 'Estrategias informadas por MBA para líderes educativos con herramientas prácticas para gestión de equipos y crecimiento',
            price: '$34.99',
            category: 'leadership',
            grade: 'Liderazgo/Administración',
            hasInteractive: true,
            features: ['Gestión de Equipos', 'Estrategias de Crecimiento', 'Planificación de Presupuesto', 'Métricas de Rendimiento']
          },
          {
            title: 'Estrategia e Implementación EdTech',
            description: 'Guía completa para integrar tecnología en educación con desarrollo de casos empresariales y análisis de ROI',
            price: '$27.99',
            category: 'tech',
            grade: 'Liderazgo K-12',
            hasInteractive: true,
            features: ['Planificación Estratégica', 'Selección de Proveedores', 'Programas de Entrenamiento', 'Métricas de Éxito']
          },
          {
            title: 'Habilidades Empresariales para Educadores',
            description: 'Currículo de desarrollo profesional que ayuda a educadores a desarrollar perspicacia empresarial y habilidades de liderazgo',
            price: '$22.99',
            category: 'business',
            grade: 'Desarrollo Profesional',
            hasInteractive: false,
            features: ['Gestión de Presupuestos', 'Pensamiento Estratégico', 'Desarrollo de Liderazgo', 'Planificación de Carrera']
          }
        ]
      },
      interactive: {
        title: 'Aprendizaje Mejorado por Tecnología',
        description: 'Mis recursos educativos aprovechan la tecnología para crear experiencias de aprendizaje atractivas y medibles. Estos recursos premium combinan las mejores prácticas educativas tradicionales con resultados impulsados por negocios modernos.',
        howToTitle: 'Acceder a Recursos Premium',
        step1: 'Compra el recurso educativo de mi tienda profesional',
        step2: 'Recibe guías detalladas de implementación y herramientas de seguimiento de ROI',
        step3: 'Accede a componentes en línea exclusivos y elementos interactivos',
        step4: 'Mide e informa sobre resultados educativos e impacto empresarial',
        contactButton: 'Discutir Soluciones Personalizadas'
      },
      background: {
        title: 'Antecedentes de Liderazgo Educativo',
        description: 'Mis recursos se basan en experiencia real de liderazgo y resultados empresariales en educación:',
        businessTitle: 'Educación Empresarial y de Liderazgo',
        businessBullets: [
          'Estrategia Informada por MBA',
          'Resultados Enfocados en ROI',
          'Desarrollo de Liderazgo',
          'Comunicación Profesional',
          'Planificación Estratégica'
        ],
        techTitle: 'Integración Tecnológica e Innovación',
        techBullets: [
          'Implementación de EdTech',
          'Transformación Digital',
          'Desarrollo de Software',
          'Integración Tecnológica',
          'Estrategia de Innovación'
        ],
        resultsTitle: 'Resultados Medibles',
        resultsDesc: 'Todos los recursos diseñados con métricas claras de ROI y capacidades de medición de resultados.'
      }
    },
    // English Classes page
    classes: {
      hero: {
        title: 'Instrucción Profesional de Inglés',
        description: 'Instrucción de inglés enfocada en negocios de un profesional bilingüe con MBA. Programas especializados para avance profesional, comunicación empresarial y desarrollo profesional.',
        button: 'Explorar Programas'
      },
      tabs: {
        classOfferings: 'Ofertas de Programas',
        pricing: 'Opciones de Inversión',
        testimonials: 'Historias de Éxito'
      },
      classLevels: {
        title: 'Programas Profesionales de Inglés',
        description: 'Programas comprensivos de inglés diseñados para avance profesional y éxito empresarial. Cada programa combina adquisición de idioma con aplicaciones prácticas de negocios.',
        whyChooseTitle: '¿Por qué Elegir Instrucción Profesional de Inglés?',
        whyChooseSubtitle: 'Enfoque de enseñanza informado por MBA diseñado específicamente para avance profesional y éxito empresarial.',
        businessFirstTitle: 'Enfoque de Aplicación del Mundo Real',
        businessFirstDesc: 'Cada lección se conecta con situaciones prácticas que realmente encontrarás en la vida diaria, viajes y entornos profesionales.',
        careerImpactTitle: 'Resultados de Vida Rastreables',
        careerImpactDesc: 'Mide tu progreso a través de logros reales: conversaciones confiadas, entrevistas exitosas y oportunidades expandidas.',
        executiveInstructionTitle: 'Instrucción de Nivel Ejecutivo',
        executiveInstructionDesc: 'Aprende de un educador licenciado con un MBA y años de experiencia comprobada en el aula tanto en negocios como en instrucción de inglés.',
        topicsInclude: 'El programa incluye',
        programIncludes: 'El programa incluye',
        teacherInfo: 'Todos los programas dirigidos por Kirby McDonald, MBA—un líder educativo bilingüe con amplia experiencia empresarial y tecnológica.',
        inquireButton: 'Discutir Tus Objetivos',
        businessFocus: 'Currículo Enfocado en Negocios',
        careerAdvancement: 'Pista de Avance Profesional',
        professionalCommunication: 'Comunicación Profesional',
        industrySpecific: 'Entrenamiento Específico de Industria',
        certification: 'Certificación',
        certificationDescription: 'Al completar, se otorgará una certificación que muestra la finalización del curso y respaldada por el Sr. McDonald. Descubre más en nuestra página de certificación.',
        professionalOutcome: 'Resultado Profesional:',
        hoverForDetails: 'Pasa el cursor para detalles del currículo',
        clickForDetails: 'Haz clic para detalles del currículo',
        connectButton: 'Conectar',
        programDuration: '¡De principiante completo a comunicador funcional en 90-100 horas guiadas y tareas para aprendizaje fuera del aula!',
        // Professional credentials badges
        mbaBadge: 'Liderazgo Empresarial MBA',
        experienceBadge: '5+ Años de Liderazgo Educativo', 
        bilingualBadge: 'Profesional Bilingüe',
        scheduleConsultation: 'Programar Consulta',
        professionalInstructionTitle: 'Instrucción Profesional',
        list: [
          {
            id: 'essential-foundations',
            level: 'Essential English Foundations (A1)',
            description: 'Master the building blocks of English communication',
            topics: [
              'Personal Communication - Introduce yourself, share basic information, and build social connections',
              'Daily Life Navigation - Handle routine situations like shopping, dining, and transportation',
              'Workplace Essentials - Present yourself professionally and engage in simple work conversations',
              'Grammar Foundations - Master present tense, basic questions, and essential sentence structures',
              'Practical Vocabulary - Learn 800+ high-frequency words for immediate real-world use',
              'Speaking Confidence - Practice pronunciation and fluency through guided conversations',
              'Functional Writing - Complete forms, write simple messages, and basic personal correspondence',
              'Cultural Awareness - Understand basic social customs and communication styles',
              'Official Certification - Receive internationally recognized CEFR A1 certificate upon completion'
            ],
            outcomes: 'Upon completion, you\'ll confidently introduce yourself, handle basic daily conversations, and navigate essential situations like shopping, ordering food, and asking for directions in English-speaking environments.',
            programDetails: 'Complete beginner to functional communicator in 90-100 guided hours and homework for learning outside of the classroom!'
          },
          {
            id: 'practical-communication',
            level: 'Practical English Communication (A2)',
            description: 'Build confidence for real-world interactions',
            topics: [
              'Experience Sharing - Describe past events, future plans, and personal experiences in detail',
              'Travel Mastery - Navigate airports, hotels, restaurants, and tourist attractions independently',
              'Social Interaction - Engage in longer conversations about hobbies, opinions, and current events',
              'Professional Development - Participate in meetings, make presentations, and network effectively',
              'Advanced Grammar - Master past tenses, future forms, and conditional expressions',
              'Expanded Vocabulary - Acquire 1,500+ words including abstract concepts and specialized terms',
              'Listening Skills - Understand movies, podcasts, and natural speech patterns',
              'Writing Proficiency - Create emails, reports, and personal narratives with proper structure',
              'Official Certification - Receive internationally recognized CEFR A2 certificate upon completion'
            ],
            outcomes: 'Upon completion, you\'ll comfortably discuss your experiences and plans, handle extended conversations about familiar topics, and effectively communicate in most travel and social situations with English speakers.',
            programDetails: 'Elementary to confident communicator in 90-100 guided hours and homework for learning outside of the classroom!'
          },
          {
            id: 'independent-mastery',
            level: 'Independent English Mastery (B1)',
            description: 'Express yourself clearly on any familiar topic',
            topics: [
              'Opinion Expression - Articulate viewpoints, justify decisions, and engage in debates effectively',
              'Problem-Solving - Handle complaints, negotiate solutions, and manage unexpected situations',
              'Academic Skills - Write structured essays, analyze texts, and present research findings',
              'Career Advancement - Lead meetings, deliver presentations, and interview confidently',
              'Complex Grammar - Master reported speech, passive voice, and advanced conditional forms',
              'Specialized Vocabulary - Learn 2,500+ words including business, academic, and technical terms',
              'Media Comprehension - Understand news, documentaries, and authentic materials independently',
              'Creative Writing - Produce stories, formal letters, and persuasive texts with style',
              'Official Certification - Receive internationally recognized CEFR B1 certificate upon completion'
            ],
            outcomes: 'Upon completion, you\'ll express opinions confidently, handle unexpected situations abroad, participate actively in workplace discussions, and articulate complex ideas about topics that interest you.',
            programDetails: 'Intermediate speaker to autonomous communicator in 150-200 guided hours and homework for learning outside of the classroom!'
          },
          {
            id: 'advanced-fluency',
            level: 'Advanced English Fluency (B2)',
            description: 'Communicate with native-like confidence and precision',
            topics: [
              'Advanced Discourse - Discuss abstract concepts, analyze complex issues, and debate with sophistication',
              'Professional Excellence - Lead international teams, negotiate contracts, and present to senior executives',
              'Academic Mastery - Write research papers, critical analyses, and comprehensive reports',
              'Cultural Fluency - Understand humor, idioms, and subtle cultural references naturally',
              'Sophisticated Grammar - Perfect advanced structures, stylistic variations, and register awareness',
              'Extensive Vocabulary - Command 4,000+ words including nuanced expressions and academic language',
              'Native-Level Comprehension - Follow rapid speech, technical discussions, and literary works',
              'Persuasive Communication - Craft compelling arguments, influential presentations, and professional correspondence',
              'Official Certification - Receive internationally recognized CEFR B2 certificate upon completion'
            ],
            outcomes: 'Upon completion, you\'ll engage fluently in complex discussions, excel in professional environments, understand nuanced content, and communicate sophisticated ideas with accuracy and natural flow.',
            programDetails: 'Upper-intermediate to near-native speaker in 150-200 guided hours and homework for learning outside of the classroom!'
          },
          {
            id: 'expert-proficiency',
            level: 'Expert English Proficiency (C1)',
            description: 'Achieve professional-level eloquence and precision',
            topics: [
              'Executive Communication - Lead boardroom discussions, deliver keynote speeches, and influence senior stakeholders',
              'Academic Excellence - Conduct research, write dissertations, and participate in scholarly discourse',
              'Strategic Thinking - Analyze complex scenarios, synthesize information, and present strategic recommendations',
              'Cross-Cultural Leadership - Navigate international business environments and cultural sensitivities expertly',
              'Masterful Grammar - Employ sophisticated structures with perfect accuracy and stylistic awareness',
              'Professional Vocabulary - Master 6,000+ words including specialized terminology and subtle distinctions',
              'Critical Analysis - Evaluate complex texts, media, and arguments with depth and insight',
              'Advanced Writing - Create publication-quality documents, proposals, and analytical reports',
              'Official Certification - Receive internationally recognized CEFR C1 certificate upon completion'
            ],
            outcomes: 'Upon completion, you\'ll communicate with native-speaker fluency, lead complex negotiations, analyze sophisticated texts, and express yourself with remarkable accuracy and natural style in any professional or academic context.',
            programDetails: 'Advanced speaker to expert communicator in 200-300 guided hours and homework for learning outside of the classroom!'
          },
          {
            id: 'native-mastery',
            level: 'Native-Level English Mastery (C2)',
            description: 'Reach the pinnacle of English language expertise',
            topics: [
              'Intellectual Discourse - Engage in philosophical debates, literary criticism, and high-level academic discussions',
              'Global Leadership - Navigate the most complex international negotiations and diplomatic communications',
              'Creative Mastery - Write with artistic expression, humor, and sophisticated stylistic techniques',
              'Professional Distinction - Excel in roles requiring exceptional language skills: interpretation, translation, editing',
              'Flawless Grammar - Demonstrate intuitive command of all grammatical subtleties and stylistic nuances',
              'Complete Vocabulary - Command 8,000+ words with full understanding of connotations and register',
              'Literary Appreciation - Analyze and appreciate literature, poetry, and complex cultural texts',
              'Authoritative Writing - Produce expert-level content: academic papers, professional publications, creative works',
              'Official Certification - Receive internationally recognized CEFR C2 certificate upon completion'
            ],
            outcomes: 'Upon completion, you\'ll possess native-speaker competence, excel in the most demanding professional situations, create original content with artistic flair, and demonstrate complete mastery of English in all its forms and registers.',
            programDetails: 'Expert speaker to native-level mastery in 300-500 guided hours and homework for learning outside of the classroom!'
          }
        ]
      },
      pricing: {
        title: 'Inversión en Desarrollo Profesional',
        description: 'Elige la estructura de programa que se alinee con tus objetivos profesionales y presupuesto de desarrollo profesional. Todas las opciones incluyen materiales comprensivos y contenido enfocado en negocios.',
        mostPopular: 'Más Popular',
        perHour: 'por sesión',
        selectPlan: 'Seleccionar Programa',
        additionalInfo: 'Características de Desarrollo Profesional',
        packageDiscounts: 'Paquetes corporativos disponibles para entrenamiento de equipos y desarrollo profesional',
        familyDiscounts: 'Descuentos familiares disponibles para múltiples miembros de la familia en programas profesionales',
        classesAvailable: 'Programas disponibles en línea vía videoconferencia profesional o en persona en Cedar City, Utah',
        communication: 'Comunicación profesional vía LinkedIn, correo y WhatsApp para programación',
        careerFocused: 'Enfoque en avance profesional y comunicación empresarial',
        industryMaterials: 'Materiales específicos de industria y estudios de caso incluidos',
        options: [
          {
            id: 'executive-coaching',
            title: 'Coaching Ejecutivo',
            price: '$85',
            unit: 'por sesión',
            features: [
              'Instrucción individual de nivel ejecutivo',
              'Currículo personalizado para tu industria',
              'Horarios flexibles para profesionales ocupados',
              'Estrategia de avance profesional incluida',
              'Evaluaciones de comunicación empresarial',
              'Coaching de presentaciones y hablar en público',
              'Etiqueta empresarial internacional'
            ],
            popular: true,
            description: 'Coaching premium para C-suite y profesionales senior'
          },
          {
            id: 'professional-group',
            title: 'Grupo Profesional',
            price: '$45',
            unit: 'por sesión',
            features: [
              'Grupos pequeños de 2-4 profesionales',
              'Currículo enfocado en la industria',
              'Aprendizaje entre pares y networking',
              'Evaluaciones regulares de progreso',
              'Discusiones de casos empresariales',
              'Materiales y recursos incluidos'
            ],
            popular: false,
            description: 'Aprendizaje colaborativo con pares profesionales'
          },
          {
            id: 'corporate-training',
            title: 'Entrenamiento Corporativo',
            price: 'Personalizado',
            unit: 'precios',
            features: [
              'Entrenamiento en sitio o virtual para equipos',
              'Personalizado para necesidades de la empresa',
              'Escalable para cualquier tamaño de equipo',
              'Medición e informes de ROI',
              'Seguimiento del progreso de empleados',
              'Integración con sistemas de RRHH',
              'Soporte continuo y recursos'
            ],
            popular: false,
            description: 'Soluciones de entrenamiento integral para organizaciones'
          }
        ]
      },
      testimonials: {
        title: 'Historias de Éxito Profesional',
        description: 'Escucha a profesionales que han avanzado sus carreras a través de nuestros programas de inglés enfocados en negocios.',
        startButton: 'Comenzar Tu Viaje Profesional',
        list: [
          {
            id: 1,
            name: 'Maria Rodriguez',
            role: 'Gerente de Marketing - Graduada Nivel B2',
            company: 'Startup Tecnológica',
            content: 'El enfoque empresarial de Kirby me ayudó a hacer la transición del inglés básico a liderar campañas de marketing internacional. La perspectiva MBA en la enseñanza marcó toda la diferencia.',
            achievement: 'Promovida a Gerente de Marketing',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
          },
          {
            id: 2,
            name: 'Carlos Mendez',
            role: 'Ingeniero de Software - Progreso A2 a B2',
            company: 'Fortune 500',
            content: 'La combinación de instrucción de inglés con enfoque tecnológico fue perfecta para mi carrera en desarrollo de software. Ahora lidero equipos de desarrollo internacional.',
            achievement: 'Líder de Equipo Internacional',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
          },
          {
            id: 3,
            name: 'Ana Gutierrez',
            role: 'Administradora Educativa - Nivel C1',
            company: 'Distrito Escolar',
            content: 'Aprender de un educador con experiencia MBA fue invaluable. Kirby entiende tanto el aprendizaje de idiomas como las necesidades de avance profesional.',
            achievement: 'Rol de Liderazgo Distrital',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
          }
        ]
      },
      cta: {
        title: '¿Listo para Avanzar Tu Carrera?',
        description: 'Ya sea que busques una promoción, cambies de industria o expandas tu red profesional, nuestros programas de inglés diseñados por MBA te ayudarán a lograr tus objetivos profesionales. Contáctame para una consulta profesional y evaluación de carrera.',
        contactButton: 'Consulta Profesional',
        whatsappButton: 'Conexión Rápida'
      }
    },
    // Footer
    footer: {
      description: 'Líder Educativo, MBA e Innovador Tecnológico basado en Cedar City, Utah.',
      bilingual: 'Profesional bilingüe especializado en la intersección de educación, estrategia empresarial y tecnología emergente.',
      quickLinks: 'Enlaces Profesionales',
      newsletter: 'Actualizaciones Profesionales',
      subscribeText: 'Suscríbete para obtener perspectivas sobre liderazgo educativo, estrategia empresarial y tendencias tecnológicas',
      subscribeButton: 'Suscribirse',
      emailPlaceholder: 'Tu correo profesional',
      thankYou: '¡Gracias por suscribirte a las actualizaciones profesionales!',
      copyright: 'Todos los derechos reservados.',
      privacyPolicy: 'Política de Privacidad',
      termsOfService: 'Términos de Servicio',
      professionalNetwork: 'Red Profesional',
      // Professional Credentials section
      professionalCredentials: 'Credenciales Profesionales',
      mbaBusinessLeadership: 'MBA - Liderazgo Empresarial',
      educationalLeadership: '5+ Años de Liderazgo Educativo',
      technologyFocus: 'Enfoque en Innovación Tecnológica',
      // Newsletter features
      newsletterFeatures: 'Lo que recibirás:',
      leadershipInsights: 'Perspectivas sobre liderazgo educativo',
      businessTips: 'Consejos de estrategia empresarial',
      edTechTrends: 'Tendencias y oportunidades EdTech',
      // Bottom section
      locationTitle: 'Cedar City, Utah | Líder Educativo | MBA | Innovador Tecnológico',
      professionalWebsite: 'Sitio web profesional diseñado para oportunidades de liderazgo educativo',
      // Professional Recognition
      managementAward: 'Comunicación Empresarial Galardonada',
      programGrowth: '20% Logro de Crecimiento de Programas',
      bilingualExpertise: 'Experiencia Profesional Bilingüe'
    },
    // Cookie Consent
    cookieConsent: {
      title: 'Política de Cookies',
      description: 'Este sitio web utiliza cookies de análisis de Microsoft Clarity para entender cómo interactúas con nuestro sitio y mejorar tu experiencia. No utilizamos cookies de publicidad o seguimiento en redes sociales.',
      accept: 'Aceptar Análisis',
      decline: 'Rechazar',
      privacyPolicy: 'Leer nuestra Política de Privacidad',
      feature1: 'Cookies esenciales para la funcionalidad del sitio',
      feature2: 'Cookies de análisis para el rendimiento del sitio web',
      feature3: 'Sin cookies de publicidad',
      feature4: 'Cumple con GDPR'
    },
    // Privacy Policy
    privacyPolicy: {
      title: 'Política de Privacidad',
      lastUpdated: 'Última Actualización: 16 de junio de 2025',
      introduction: {
        title: 'Introducción',
        content: 'Esta política de privacidad explica cómo recopilamos, usamos, y protegemos tu información cuando visitas nuestro sitio web o utilizas nuestros servicios.'
      },
      informationWeCollect: {
        title: 'Información que Recopilamos',
        websiteAnalytics: {
          title: 'Análisis del Sitio Web',
          description: 'Utilizamos Microsoft Clarity para recopilar datos sobre cómo los visitantes usan nuestro sitio. Esto nos ayuda a mejorar nuestro sitio web y servicios.',
          items: [
            'Páginas visitadas',
            'Tiempo pasado en el sitio',
            'Enlaces clicados',
            'Sitio web de referencia'
          ]
        },
        contactInformation: {
          title: 'Información de Contacto',
          description: 'Si nos contactas, recopilamos tu nombre, dirección de correo electrónico, y cualquier otra información que proporciones.',
          items: [
            'Nombre',
            'Dirección de correo electrónico',
            'Número de teléfono',
            'Contenido del mensaje'
          ]
        }
      },
      howWeUse: {
        title: 'Cómo Usamos Tu Información',
        items: [
          'Para mejorar nuestro sitio web y servicios',
          'Para responder a tus comentarios y preguntas',
          'Para enviarte actualizaciones y materiales promocionales',
          'Para analizar el uso y las tendencias del sitio web'
        ]
      },
      whatWeDont: {
        title: 'Lo Que No Hacemos Con Tu Información',
        items: [
          'No vendemos ni alquilamos tu información personal a terceros',
          'No usamos tu información para la toma de decisiones automatizada',
          'No recopilamos información sensible como raza, religión o datos de salud'
        ]
      },
      yourRights: {
        title: 'Tus Derechos',
        description: 'Tienes el derecho de acceder, corregir, o eliminar tu información personal. También puedes oponerte a o restringir ciertos tratamientos de tus datos.',
        items: [
          'Derecho a acceder a tus datos',
          'Derecho a corregir tus datos',
          'Derecho a eliminar tus datos',
          'Derecho a oponerte al tratamiento'
        ]
      },
      dataSecurity: {
        title: 'Seguridad de los Datos',
        content: 'Tomamos en serio la seguridad de los datos y usamos medidas apropiadas para proteger tu información contra el acceso no autorizado, divulgación o uso indebido.'
      },
      thirdPartyServices: {
        title: 'Servicios de Terceros',
        description: 'Podemos usar servicios de terceros para ayudarnos a operar nuestro negocio y el sitio web o proporcionar servicios a ti.',
        items: [
          'Microsoft Clarity (análisis)',
          'Proveedores de servicios de correo electrónico',
          'Procesadores de pagos',
          'Software de gestión de relaciones con clientes (CRM)'
        ],
        footer: 'Nos aseguramos de que estos terceros cumplan con las leyes de protección de datos y tengan medidas de seguridad apropiadas.'
      },
      contactUs: {
        title: 'Contáctanos',
        description: 'Si tienes alguna pregunta o inquietud sobre esta política de privacidad o nuestras prácticas de datos, por favor contáctanos.',
        email: 'Correo electrónico: ammaron99@gmail.com',
        phone: 'Teléfono: (435) 893-6006',
        location: 'Ubicación: Cedar City, Utah'
      },
      changes: {
        title: 'Cambios a Esta Política',
        content: 'Podemos actualizar esta política de privacidad de vez en cuando. Te notificaremos sobre cualquier cambio publicando la nueva política en nuestro sitio web con una nueva fecha de entrada en vigor.'
      }
    }
  }
};