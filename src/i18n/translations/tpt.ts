// i18n/translations/tpt.ts
export interface TptTranslations {
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
}

export const tptTranslations: Record<'en' | 'es', TptTranslations> = {
  en: {
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
    }
  },
  es: {
    tpt: {
      hero: {
        title: 'Recursos y Soluciones Educativas',
        description: 'Materiales educativos profesionales creados a partir de experiencia real en el aula y perspectivas empresariales.',
        button: 'Explorar Recursos'
      },
      products: {
        title: 'Recursos Profesionales de Enseñanza',
        professionalGradeDesc: 'Materiales educativos premium diseñados con calidad de grado empresarial.',
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
            grade: '9-12, Ed. Adultos',
            hasInteractive: true,
            features: ['Métricas de ROI', 'Casos de Negocio', 'Enfoque en Liderazgo', 'Herramientas de Evaluación']
          },
          {
            title: 'Integración Tecnológica para Educadores',
            description: 'Marco estratégico para implementar tecnología en entornos educativos con medición de impacto empresarial',
            price: '$29.99',
            category: 'tech',
            grade: 'Desarrollo Profesional',
            hasInteractive: true,
            features: ['Guía de Implementación', 'Pila Tecnológica', 'Calculadora de ROI', 'Materiales de Capacitación']
          },
          {
            title: 'Inglés Profesional para el Avance Profesional',
            description: 'Currículo de inglés enfocado en negocios diseñado para el crecimiento profesional y desarrollo profesional',
            price: '$19.99',
            category: 'language',
            grade: 'Profesional Adulto',
            hasInteractive: false,
            features: ['Enfoque Profesional', 'Preparación para Entrevistas', 'Vocabulario de Negocios', 'Habilidades de Networking']
          },
          {
            title: 'Kit de Herramientas de Liderazgo Educativo',
            description: 'Estrategias informadas por MBA para líderes educativos con herramientas prácticas para la gestión de equipos y el crecimiento',
            price: '$34.99',
            category: 'leadership',
            grade: 'Liderazgo/Admin',
            hasInteractive: true,
            features: ['Gestión de Equipos', 'Estrategias de Crecimiento', 'Planificación Presupuestaria', 'Métricas de Desempeño']
          },
          {
            title: 'Estrategia e Implementación de EdTech',
            description: 'Guía completa para integrar tecnología en la educación con desarrollo de casos de negocio y análisis de ROI',
            price: '$27.99',
            category: 'tech',
            grade: 'Liderazgo K-12',
            hasInteractive: true,
            features: ['Planificación Estratégica', 'Selección de Proveedores', 'Programas de Capacitación', 'Métricas de Éxito']
          },
          {
            title: 'Habilidades Empresariales para Educadores',
            description: 'Currículo de desarrollo profesional que ayuda a los educadores a desarrollar perspicacia empresarial y habilidades de liderazgo',
            price: '$22.99',
            category: 'business',
            grade: 'Desarrollo Profesional',
            hasInteractive: false,
            features: ['Gestión Presupuestaria', 'Pensamiento Estratégico', 'Desarrollo de Liderazgo', 'Planificación de Carrera']
          }
        ]
      },
      interactive: {
        title: 'Aprendizaje Mejorado por Tecnología',
        description: 'Recursos que combinan las mejores prácticas educativas con resultados empresariales modernos.',
        howToTitle: 'Acceder a Recursos Premium',
        step1: 'Compra el recurso educativo',
        step2: 'Recibe guías de implementación',
        step3: 'Accede a componentes interactivos',
        step4: 'Mide resultados e impacto',
        contactButton: 'Discutir Soluciones Personalizadas'
      },
      background: {
        title: 'Antecedentes de Liderazgo Educativo',
        description: 'Recursos basados en experiencia real de liderazgo:',
        businessTitle: 'Educación Empresarial y de Liderazgo',
        businessBullets: ['Estrategia MBA', 'Resultados ROI', 'Desarrollo de Liderazgo'],
        techTitle: 'Integración Tecnológica',
        techBullets: ['Implementación EdTech', 'Transformación Digital', 'Innovación'],
        resultsTitle: 'Resultados Medibles',
        resultsDesc: 'Recursos con métricas claras de ROI.'
      }
    }
  }
};
