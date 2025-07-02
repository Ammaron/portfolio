// i18n/translations/home.ts
export interface HomeTranslations {
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
      contactFormHeader: string;
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
}

export const homeTranslations: Record<'en' | 'es', HomeTranslations> = {
  en: {
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
              'Strategic planning and resource allocation'
            ]
          }
        },
        education: {
          mba: {
            title: 'Master of Business Administration (MBA)',
            institution: 'Southern Utah University',
            period: '2023 - 2025 (In Progress)',
            description: 'Focus on Strategic Leadership, Operations Management, and Educational Technology Integration'
          },
          software: {
            title: 'Software Development',
            institution: 'Full-Stack Development',
            period: '2024 - Present',
            description: 'Modern web development technologies including React, Next.js, and database systems'
          },
          businessEd: {
            title: 'Business Education',
            institution: 'Southern Utah University',
            period: '2018 - 2022',
            description: 'Bachelor\'s degree with emphasis on curriculum development and educational leadership'
          }
        },
        certifications: {
          management: {
            title: 'Management & Communication Excellence',
            issuer: 'Utah CTE',
            period: '2023'
          },
          organizations: {
            title: 'Student Organizations Leadership',
            issuer: 'Southern Utah University',
            period: '2022'
          },
          teaching: {
            title: 'Licensed Educator',
            issuer: 'Utah State Board of Education',
            period: '2022 - Present'
          },
          microsoft: {
            title: 'Microsoft Office Specialist',
            issuer: 'Microsoft',
            period: '2021'
          }
        },
        skills: [
          'MBA Strategy',
          'Educational Leadership',
          'Curriculum Development',
          'Business Development',
          'Team Management',
          'Technology Integration',
          'Bilingual Communication',
          'Project Management',
          'Data Analysis',
          'Software Development'
        ],
        mbaCredential: 'MBA',
        businessLeadership: 'Business Leadership',
        yearsLeading: '5+',
        yearsLeadingLabel: 'Years Leading'
      },
      contact: {
        title: 'Ready to Connect?',
        subtitle: 'Whether you\'re seeking educational leadership, business expertise, or innovative thinking',
        email: 'Email',
        phone: 'Phone',
        location: 'Location',
        linkedin: 'LinkedIn',
        contactFormHeader: 'Contact Me Today - Responses Within 1 Business Day',
        formName: 'Name',
        formEmail: 'Email',
        formSubject: 'Subject',
        formMessage: 'Message',
        formSubmit: 'Send Message',
        namePlaceholder: 'Your Name',
        emailPlaceholder: 'Your Email',
        subjectPlaceholder: 'How can I help?',
        messagePlaceholder: 'Tell me about your interests or goals...',
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
    }
  },
  es: {
    home: {
      hero: {
        title: 'Kirby McDonald',
        subtitle: 'Líder Educativo | Maestria en Administracion de Negocios | Innovador Tecnológico',
        description: 'Líder educativo con Maestria en Administracion de Negocios, más de 5 años de experiencia en el aula, perspicacia empresarial comprobada y experiencia tecnológica emergente. Conectando educación, estrategia empresarial e innovación para impulsar resultados significativos.',
        contactButton: 'Conectemos',
        classesButton: 'Clases de Inglés',
        scrollHint: 'Desplázate para explorar',
        availableForLeadership: 'Disponible para Oportunidades de Liderazgo'
      },
      businessValue: {
        title: 'Propuesta de Valor Estratégico',
        subtitle: 'La intersección de experiencia educativa, perspicacia empresarial y visión tecnológica',
        uniqueValue: 'Esta rara combinación me hace invaluable para roles que abarcan liderazgo EdTech, administración educativa, capacitación corporativa y desarrollo empresarial en organizaciones enfocadas en la educación.',
        educationExpert: {
          title: 'Autoridad Educativa',
          description: 'Experiencia profunda en el aula con desarrollo curricular, gestión de maestros y resultados estudiantiles comprobados en demografías diversas.'
        },
        businessLeader: {
          title: 'Estrategia Impulsada por Maestria en Administracion de Negocios',
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
        paragraph1: 'Como líder educativo con Maestria en Administracion de Negocios, aporto una combinación única de experiencia en el aula, estrategia empresarial y visión tecnológica. Con más de cinco años de experiencia educativa práctica y resultados comprobados—incluyendo un aumento del 20% en la inscripción de programas—entiendo cómo escalar el impacto educativo a través del pensamiento estratégico.',
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
              'Experiencia multidisciplinaria: Negocios, Tecnología, Idiomas',
              'Planificación estratégica y asignación de recursos'
            ]
          }
        },
        education: {
          mba: {
            title: 'Maestría en Administración de Negocios',
            institution: 'Southern Utah University',
            period: '2023 - 2025 (En Progreso)',
            description: 'Enfoque en Liderazgo Estratégico, Gestión de Operaciones e Integración de Tecnología Educativa'
          },
          software: {
            title: 'Desarrollo de Software',
            institution: 'Desarrollo Full-Stack',
            period: '2024 - Presente',
            description: 'Tecnologías modernas de desarrollo web incluyendo React, Next.js y sistemas de bases de datos'
          },
          businessEd: {
            title: 'Educación Empresarial',
            institution: 'Southern Utah University',
            period: '2018 - 2022',
            description: 'Licenciatura con énfasis en desarrollo curricular y liderazgo educativo'
          }
        },
        certifications: {
          management: {
            title: 'Excelencia en Gestión y Comunicación',
            issuer: 'Utah CTE',
            period: '2023'
          },
          organizations: {
            title: 'Liderazgo de Organizaciones Estudiantiles',
            issuer: 'Southern Utah University',
            period: '2022'
          },
          teaching: {
            title: 'Educador Licenciado',
            issuer: 'Junta Estatal de Educación de Utah',
            period: '2022 - Presente'
          },
          microsoft: {
            title: 'Especialista en Microsoft Office',
            issuer: 'Microsoft',
            period: '2021'
          }
        },
        skills: [
          'Estrategia Maestria en Administracion de Negocios',
          'Liderazgo Educativo',
          'Desarrollo Curricular',
          'Desarrollo Empresarial',
          'Gestión de Equipos',
          'Integración Tecnológica',
          'Comunicación Bilingüe',
          'Gestión de Proyectos',
          'Análisis de Datos',
          'Desarrollo de Software'
        ],
        mbaCredential: 'Maestria en Administracion de Negocios',
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
        contactFormHeader: 'Contáctame Hoy - Respuestas Dentro de 1 Día Hábil',
        formName: 'Nombre',
        formEmail: 'Correo',
        formSubject: 'Asunto',
        formMessage: 'Mensaje',
        formSubmit: 'Enviar Mensaje',
        namePlaceholder: 'Tu Nombre',
        emailPlaceholder: 'Tu Correo',
        subjectPlaceholder: '¿Cómo puedo ayudar?',
        messagePlaceholder: 'Cuéntame sobre tus intereses u objetivos...',
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
    }
  }
};
