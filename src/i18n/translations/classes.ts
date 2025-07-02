// i18n/translations/classes.ts
export interface ClassesTranslations {
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
      funTitle: string;
      funDesc: string;
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
}

export const classesTranslations: Record<'en' | 'es', ClassesTranslations> = {
  en: {
    classes: {
      hero: {
        title: 'Professional English Instruction',
        description: 'Business-focused English language instruction from an MBA-educated, bilingual professional. Specialized programs for career advancement, business communication, and professional development.',
        button: 'Let\'s Connect'
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
        funTitle: 'Engaging & Enjoyable Learning',
        funDesc: 'Learning English doesn\'t have to be boring! Our interactive approach combines games, real-world scenarios, and personalized activities that make each lesson engaging and memorable. When you enjoy the process, you learn faster and retain more.',
        topicsInclude: 'Program includes',
        programIncludes: 'Program Includes',
        teacherInfo: 'All programs led by Kirby McDonald, MBA—a bilingual educational leader with extensive business and technology experience.',
        inquireButton: 'Discuss Your Goals',
        businessFocus: 'Business-Focused Curriculum',
        careerAdvancement: 'Career advancement and leadership development focus',
        professionalCommunication: 'Professional Communication',
        industrySpecific: 'Industry-specific training included',
        certification: 'Certification',
        certificationDescription: 'Certification upon course completion.',
        professionalOutcome: 'Professional Outcome:',
        hoverForDetails: 'Hover for details',
        clickForDetails: 'Click for details',
        connectButton: 'Connect',
        programDuration: 'Functional communicator in 90-100 hours!',
        mbaBadge: 'MBA',
        experienceBadge: '5+ Years',
        bilingualBadge: 'Bilingual',
        scheduleConsultation: 'Professional Success Stories',
        professionalInstructionTitle: 'Professional Instruction',
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
              'Extensive Vocabulary - Master 4,000+ words including nuanced expressions and academic language',
              'Native-Level Comprehension - Follow rapid speech, technical discussions, and literary works',
              'Persuasive Communication - Craft compelling arguments, influential presentations, and professional correspondence',
              'Official Certification - Receive internationally recognized CEFR B2 certificate upon completion'
            ],
            outcomes: 'Upon completion, you\'ll participate fluently in complex discussions, excel in professional environments, understand nuanced content, and communicate sophisticated ideas with precision and natural fluency.',
            programDetails: 'Upper-intermediate to near-native speaker in 150-200 guided hours and homework for learning outside of the classroom!'
          },
          {
            id: 'expert-proficiency',
            level: 'Expert English Proficiency (C1)',
            description: 'Achieve professional-level eloquence and precision',
            topics: [
              'Executive Communication - Lead board discussions, deliver keynote speeches, and influence senior stakeholders',
              'Academic Excellence - Conduct research, write dissertations, and engage in scholarly discourse',
              'Strategic Thinking - Analyze complex scenarios, synthesize information, and present strategic recommendations',
              'Cross-Cultural Leadership - Navigate international business environments and cultural sensitivities with expertise',
              'Masterful Grammar - Employ sophisticated structures with perfect accuracy and stylistic awareness',
              'Professional Vocabulary - Command 6,000+ words including specialized terminology and subtle distinctions',
              'Critical Analysis - Evaluate complex texts, media, and arguments with depth and insight',
              'Advanced Writing - Create publication-quality documents, proposals, and analytical reports',
              'Official Certification - Receive internationally recognized CEFR C1 certificate upon completion'
            ],
            outcomes: 'Upon completion, you\'ll communicate with near-native fluency, lead complex negotiations, analyze sophisticated texts, and express yourself with remarkable precision and natural style in any professional or academic context.',
            programDetails: 'Advanced speaker to near-native mastery in 200-300 guided hours and homework for learning outside of the classroom!'
          },
          {
            id: 'native-mastery',
            level: 'Native English Mastery (C2)',
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
            outcomes: 'Upon completion, you\'ll demonstrate mastery equivalent to an educated native speaker, excel in the most demanding professional and academic contexts, and use English as a tool for creative, intellectual, and professional distinction.',
            programDetails: 'Expert speaker to native-level mastery in 300-500 guided hours and homework for learning outside of the classroom!'
          }
        ]
      },
      pricing: {
        title: 'Professional Development Investment',
        description: 'Flexible options designed to fit your professional goals and schedule.',
        mostPopular: 'Most Popular',
        perHour: 'per session',
        selectPlan: 'Select Plan',
        additionalInfo: 'Professional Features',
        packageDiscounts: 'Corporate packages available',
        familyDiscounts: 'Family discounts available',
        classesAvailable: 'Available online or in-person',
        communication: 'Communication via LinkedIn, email, and WhatsApp',
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
        description: 'Hear from others who have advanced their English journey through our programs.',
        startButton: 'Start Your Professional Journey',
        list: [
          {
            id: 1,
            name: 'Even',
            role: 'A2',
            company: 'Tech Startup',
            content: 'Mr. McDonald helped me comprehend and understand the English language. I understand and can write in that language better than before. I like Mr. McDonald\'s classes.',
            achievement: 'Promoted to Marketing Manager',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
          },
          {
            id: 2,
            name: 'Daysi',
            role: 'A1',
            company: 'Fortune 500',
            content: 'I have to say that thanks to Mr. McDonald I have learned to have a much more positive view towards the language, since it has always been a barrier for me. Although I still have a lot of work ahead of me, I thank you for the ease with which you teach your English classes and above all, the professionalism with which you carry out your work. I 100% recommend Mr. McDonald.',
            achievement: 'International Team Lead',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
          },
          {
            id: 3,
            name: 'Ana Gutierrez',
            role: 'A2',
            company: 'School District',
            content: 'Thank you professor, with the lessons directed by you I learned English more easily.',
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
    }
  },
  es: {
    classes: {
      hero: {
        title: 'Instrucción Profesional de Inglés',
        description: 'Instrucción de inglés enfocada en negocios de un profesional bilingüe con Maestria en Administracion de Negocios.',
        button: 'Conectemos'
      },
      tabs: {
        classOfferings: 'Programas',
        pricing: 'Opciones de Inversión',
        testimonials: 'Historias de Éxito'
      },
      classLevels: {
        title: 'Programas Profesionales de Inglés',
        description: 'Programas comprensivos diseñados para avance profesional y éxito empresarial.',
        whyChooseTitle: '¿Por qué Elegir Instrucción Profesional?',
        whyChooseSubtitle: 'Enfoque Maestria en Administracion de Negocios para avance profesional.',
        businessFirstTitle: 'Enfoque de Aplicación Real',
        businessFirstDesc: 'Lecciones conectadas con situaciones prácticas.',
        careerImpactTitle: 'Resultados Medibles',
        careerImpactDesc: 'Mide tu progreso através de logros reales.',
        executiveInstructionTitle: 'Instrucción Ejecutiva',
        executiveInstructionDesc: 'Aprende de un educador con Maestria en Administracion de Negocios.',
        funTitle: 'Aprendizaje Atractivo',
        funDesc: 'Enfoque interactivo y personalizado.',
        topicsInclude: 'El programa incluye',
        programIncludes: 'El Programa Incluye',
        teacherInfo: 'Todos los programas dirigidos por Kirby McDonald, Maestria en Administracion de Negocios.',
        inquireButton: 'Discutir Objetivos',
        businessFocus: 'Currículo Empresarial',
        careerAdvancement: 'Enfoque en avance profesional',
        professionalCommunication: 'Comunicación Profesional',
        industrySpecific: 'Entrenamiento Específico',
        certification: 'Certificación',
        certificationDescription: 'Certificación al completar el curso.',
        professionalOutcome: 'Resultado Profesional:',
        hoverForDetails: 'Pasa el cursor para detalles',
        clickForDetails: 'Haz clic para detalles',
        connectButton: 'Conectar',
        programDuration: 'Comunicador funcional en 90-100 horas!',
        mbaBadge: 'Maestria en Administracion de Negocios',
        experienceBadge: '5+ Años',
        bilingualBadge: 'Bilingüe',
        scheduleConsultation: 'Historias de Éxito Profesional',
        professionalInstructionTitle: 'Instrucción Profesional',
        list: [
          {
            id: 'essential-foundations',
            level: 'Fundamentos Esenciales de Inglés (A1)',
            description: 'Domina los componentes básicos de la comunicación en inglés',
            topics: [
              'Comunicación Personal - Preséntate, comparte información básica y construye conexiones sociales',
              'Navegación de la Vida Diaria - Maneja situaciones rutinarias como compras, cenas y transporte',
              'Esenciales del Lugar de Trabajo - Preséntate profesionalmente y participa en conversaciones de trabajo sencillas',
              'Fundamentos de Gramática - Domina el tiempo presente, preguntas básicas y estructuras de oraciones esenciales',
              'Vocabulario Práctico - Aprende más de 800 palabras de alta frecuencia para uso inmediato en el mundo real',
              'Confianza al Hablar - Practica la pronunciación y fluidez a través de conversaciones guiadas',
              'Escritura Funcional - Completa formularios, escribe mensajes simples y correspondencia personal básica',
              'Conciencia Cultural - Comprende costumbres sociales básicas y estilos de comunicación',
              'Certificación Oficial - Recibe un certificado CEFR A1 reconocido internacionalmente al finalizar'
            ],
            outcomes: 'Al finalizar, te presentarás con confianza, manejarás conversaciones diarias básicas y navegarás situaciones esenciales como compras, pedir comida y pedir direcciones en entornos de habla inglesa.',
            programDetails: '¡De principiante completo a comunicador funcional en 90-100 horas guiadas y tareas para aprendizaje fuera del aula!'
          },
          {
            id: 'practical-communication',
            level: 'Comunicación Práctica en Inglés (A2)',
            description: 'Construye confianza para interacciones en el mundo real',
            topics: [
              'Compartir Experiencias - Describe eventos pasados, planes futuros y experiencias personales en detalle',
              'Dominio en Viajes - Navega aeropuertos, hoteles, restaurantes y atracciones turísticas de forma independiente',
              'Interacción Social - Participa en conversaciones más largas sobre pasatiempos, opiniones y eventos actuales',
              'Desarrollo Profesional - Participa en reuniones, haz presentaciones y establece contactos de manera efectiva',
              'Gramática Avanzada - Domina tiempos pasados, formas futuras y expresiones condicionales',
              'Vocabulario Ampliado - Adquiere más de 1,500 palabras incluyendo conceptos abstractos y términos especializados',
              'Habilidades de Escucha - Comprende películas, podcasts y patrones de habla natural',
              'Competencia en Escritura - Crea correos electrónicos, informes y narrativas personales con estructura adecuada',
              'Certificación Oficial - Recibe un certificado CEFR A2 reconocido internacionalmente al finalizar'
            ],
            outcomes: 'Al finalizar, discutirás cómodamente tus experiencias y planes, manejarás conversaciones extendidas sobre temas familiares y te comunicarás eficazmente en la mayoría de las situaciones de viaje y sociales con hablantes de inglés.',
            programDetails: '¡De elemental a comunicador seguro en 90-100 horas guiadas y tareas para aprendizaje fuera del aula!'
          },
          {
            id: 'independent-mastery',
            level: 'Dominio Independiente del Inglés (B1)',
            description: 'Exprésate claramente sobre cualquier tema familiar',
            topics: [
              'Expresión de Opiniones - Articula puntos de vista, justifica decisiones y participa en debates de manera efectiva',
              'Resolución de Problemas - Maneja quejas, negocia soluciones y gestiona situaciones inesperadas',
              'Habilidades Académicas - Escribe ensayos estructurados, analiza textos y presenta hallazgos de investigación',
              'Avance Profesional - Lidera reuniones, realiza presentaciones y entrevista con confianza',
              'Gramática Compleja - Domina el discurso indirecto, la voz pasiva y las formas condicionales avanzadas',
              'Vocabulario Especializado - Aprende más de 2,500 palabras incluyendo términos comerciales, académicos y técnicos',
              'Comprensión de Medios - Comprende noticias, documentales y materiales auténticos de forma independiente',
              'Escritura Creativa - Produce historias, cartas formales y textos persuasivos con estilo',
              'Certificación Oficial - Recibe un certificado CEFR B1 reconocido internacionalmente al finalizar'
            ],
            outcomes: 'Al finalizar, expresarás opiniones con confianza, manejarás situaciones inesperadas en el extranjero, participarás activamente en discusiones laborales y articularás ideas complejas sobre temas que te interesan.',
            programDetails: '¡De hablante intermedio a comunicador autónomo en 150-200 horas guiadas y tareas para aprendizaje fuera del aula!'
          },
          {
            id: 'advanced-fluency',
            level: 'Fluidez Avanzada en Inglés (B2)',
            description: 'Comunícate con confianza y precisión similares a las de un nativo',
            topics: [
              'Discurso Avanzado - Discute conceptos abstractos, analiza temas complejos y debate con sofisticación',
              'Excelencia Profesional - Lidera equipos internacionales, negocia contratos y presenta a ejecutivos senior',
              'Dominio Académico - Escribe trabajos de investigación, análisis críticos e informes completos',
              'Fluidez Cultural - Comprende el humor, los modismos y las referencias culturales sutiles de forma natural',
              'Gramática Sofisticada - Perfecciona estructuras avanzadas, variaciones estilísticas y conciencia de registro',
              'Vocabulario Extenso - Domina más de 4,000 palabras incluyendo expresiones matizadas y lenguaje académico',
              'Comprensión a Nivel Nativo - Sigue el habla rápida, discusiones técnicas y obras literarias',
              'Comunicación Persuasiva - Elabora argumentos convincentes, presentaciones influyentes y correspondencia profesional',
              'Certificación Oficial - Recibe un certificado CEFR B2 reconocido internacionalmente al finalizar'
            ],
            outcomes: 'Al finalizar, participarás con fluidez en discusiones complejas, destacarás en entornos profesionales, comprenderás contenido matizado y comunicarás ideas sofisticadas con precisión y fluidez natural.',
            programDetails: '¡De intermedio-alto a hablante casi nativo en 150-200 horas guiadas y tareas para aprendizaje fuera del aula!'
          },
          {
            id: 'expert-proficiency',
            level: 'Competencia Experta en Inglés (C1)',
            description: 'Alcanza elocuencia y precisión a nivel profesional',
            topics: [
              'Comunicación Ejecutiva - Lidera discusiones de junta, da discursos principales e influye en partes interesadas senior',
              'Excelencia Académica - Realiza investigaciones, escribe disertaciones y participa en discursos académicos',
              'Pensamiento Estratégico - Analiza escenarios complejos, sintetiza información y presenta recomendaciones estratégicas',
              'Liderazgo Intercultural - Navega entornos de negocios internacionales y sensibilidades culturales con pericia',
              'Gramática Magistral - Emplea estructuras sofisticadas con precisión perfecta y conciencia estilística',
              'Vocabulario Profesional - Domina más de 6,000 palabras incluyendo terminología especializada y distinciones sutiles',
              'Análisis Crítico - Evalúa textos complejos, medios y argumentos con profundidad y perspicacia',
              'Escritura Avanzada - Crea documentos de calidad de publicación, propuestas e informes analíticos',
              'Certificación Oficial - Recibe un certificado CEFR C1 reconocido internacionalmente al finalizar'
            ],
            outcomes: 'Al finalizar, te comunicarás con fluidez de hablante nativo, liderarás negociaciones complejas, analizarás textos sofisticados y te expresarás con notable precisión y estilo natural en cualquier contexto profesional o académico.',
            programDetails: '¡De hablante avanzado a dominio a nivel nativo en 200-300 horas guiadas y tareas para aprendizaje fuera del aula!'
          },
          {
            id: 'native-mastery',
            level: 'Dominio Nativo del Inglés (C2)',
            description: 'Alcanza la cima de la pericia en el idioma inglés',
            topics: [
              'Discurso Intelectual - Participa en debates filosóficos, crítica literaria y discusiones académicas de alto nivel',
              'Liderazgo Global - Navega las negociaciones internacionales más complejas y comunicaciones diplomáticas',
              'Maestría Creativa - Escribe con expresión artística, humor y técnicas estilísticas sofisticadas',
              'Distinción Profesional - Destaca en roles que requieren habilidades lingüísticas excepcionales: interpretación, traducción, edición',
              'Gramática Impecable - Demuestra dominio intuitivo de todas las sutilezas gramaticales y matices estilísticos',
              'Vocabulario Completo - Domina más de 8,000 palabras con comprensión completa de connotaciones y registro',
              'Apreciación Literaria - Analiza y aprecia literatura, poesía y textos culturales complejos',
              'Escritura Autoritativa - Produce contenido de nivel experto: trabajos académicos, publicaciones profesionales, obras creativas',
              'Certificación Oficial - Recibe un certificado CEFR C2 reconocido internacionalmente al finalizar'
            ],
            outcomes: 'Al finalizar, demostrarás maestría equivalente a la de un hablante nativo educado, destacarás en los contextos profesionales y académicos más exigentes y usarás el inglés como herramienta para la distinción creativa, intelectual y profesional.',
            programDetails: '¡De hablante experto a dominio a nivel nativo en 300-500 horas guiadas y tareas para aprendizaje fuera del aula!'
          }
        ]
      },
      pricing: {
        title: 'Inversión en Desarrollo Profesional',
        description: 'Opciones que se alinean con tus objetivos profesionales.',
        mostPopular: 'Más Popular',
        perHour: 'por sesión',
        selectPlan: 'Seleccionar',
        additionalInfo: 'Características Profesionales',
        packageDiscounts: 'Paquetes corporativos disponibles',
        familyDiscounts: 'Descuentos familiares disponibles',
        classesAvailable: 'Disponible en línea o en persona',
        communication: 'Comunicación vía LinkedIn, correo y WhatsApp',
        careerFocused: 'Enfoque en avance profesional',
        industryMaterials: 'Materiales específicos incluidos',
        options: [
          {
            id: 'executive-coaching',
            title: 'Coaching Ejecutivo',
            price: '$85',
            unit: 'por sesión',
            features: [
              'Instrucción ejecutiva uno a uno',
              'Currículo personalizado para tu industria',
              'Horarios flexibles para profesionales ocupados',
              'Estrategia de avance profesional incluida',
              'Evaluaciones de comunicación empresarial',
              'Coaching de presentación y oratoria',
              'Etiqueta de negocios internacional'
            ],
            popular: true,
            description: 'Coaching premium para ejecutivos y profesionales senior'
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
              'Evaluaciones de progreso regulares',
              'Discusiones de casos de estudio de negocios',
              'Materiales y recursos incluidos'
            ],
            popular: false,
            description: 'Aprendizaje colaborativo con colegas profesionales'
          },
          {
            id: 'corporate-training',
            title: 'Capacitación Corporativa',
            price: 'Personalizado',
            unit: 'precio',
            features: [
              'Capacitación de equipos en sitio o virtual',
              'Personalizado para las necesidades de la empresa',
              'Escalable para cualquier tamaño de equipo',
              'Medición e informes de ROI',
              'Seguimiento del progreso de los empleados',
              'Integración con sistemas de RRHH',
              'Soporte y recursos continuos'
            ],
            popular: false,
            description: 'Soluciones de capacitación integrales para organizaciones'
          }
        ]
      },
      testimonials: {
        title: 'Historias de Éxito',
        description: 'Escucha de otros que han avanzado su Ingles por medio de nuestra programas.',
        startButton: 'Comenzar Viaje',
        list: [
          {
            id: 1,
            name: 'Even',
            role: 'A2',
            company: 'Tech Startup',
            content: 'Mr. McDonald me ayudó comprender y entender este idioma del inglés, entiendo y puedo escribir a ese idioma mejor que antes. Me gusta las clases de Mr. McDonald.',
            achievement: 'Promovido a Gerente de Marketing',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
          },
          {
            id: 2,
            name: 'Daysi',
            role: 'A1',
            company: 'Fortune 500',
            content: 'Tengo que decir que gracias a Mr. McDonald he aprendido a tener una visión mucho más positiva frente al idioma, ya que siempre ha sido una barrera para mí. Aunque aún me queda mucho trabajo por delante, le agradezco la facilidad con la que imparte sus clases de inglés y sobre todo, la profesionalidad con la que desempeña su trabajo. Recomiendo al 100%.',
            achievement: 'Líder de Equipo Internacional',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
          },
          {
            id: 3,
            name: 'Ana Gutierrez',
            role: 'A2',
            company: 'Distrito Escolar',
            content: 'Gracias a Mr. McDonald a las lecciones dirigidas por usted aprendi mas facil el ingles',
            achievement: 'Puesto de Liderazgo de Distrito',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
          }
        ]
      },
      cta: {
        title: '¿Listo para Avanzar?',
        description: 'Programas Maestria en Administracion de Negocios para lograr objetivos profesionales.',
        contactButton: 'Consulta Profesional',
        whatsappButton: 'Conexión Rápida'
      }
    }
  }
};
