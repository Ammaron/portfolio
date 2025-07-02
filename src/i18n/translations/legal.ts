// i18n/translations/legal.ts
export interface LegalTranslations {
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

export const legalTranslations: Record<'en' | 'es', LegalTranslations> = {
  en: {
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
          'To respond to your inquiries and questions',
          'To send you updates about our services (only if you opt-in)',
          'To analyze website usage and trends'
        ]
      },
      whatWeDont: {
        title: 'What We Don\'t Do',
        items: [
          'We do not sell your personal information',
          'We do not use automated decision-making or profiling',
          'We do not collect sensitive personal information without explicit consent'
        ]
      },
      yourRights: {
        title: 'Your Rights',
        description: 'You have the right to access, correct, or delete your personal information. You also have the right to object to the processing of your data.',
        items: [
          'Access your personal data',
          'Correct inaccurate data',
          'Delete your personal data',
          'Object to data processing'
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
        email: 'Email: kirby@mrmcdonald.org',
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
    cookieConsent: {
      title: 'Política de Cookies',
      description: 'Este sitio usa Microsoft Clarity para mejorar la experiencia.',
      accept: 'Aceptar',
      decline: 'Rechazar',
      privacyPolicy: 'Política de Privacidad',
      feature1: 'Cookies esenciales',
      feature2: 'Análisis del sitio web',
      feature3: 'Sin cookies publicitarias',
      feature4: 'Cumple GDPR'
    },
    privacyPolicy: {
      title: 'Política de Privacidad',
      lastUpdated: 'Última Actualización: 16 de junio de 2025',
      introduction: {
        title: 'Introducción',
        content: 'Esta política explica cómo recopilamos y protegemos tu información.'
      },
      informationWeCollect: {
        title: 'Información que Recopilamos',
        websiteAnalytics: {
          title: 'Análisis del Sitio',
          description: 'Usamos Microsoft Clarity para mejorar el sitio.',
          items: ['Páginas visitadas', 'Tiempo en sitio', 'Enlaces clicados', 'Sitio de referencia']
        },
        contactInformation: {
          title: 'Información de Contacto',
          description: 'Recopilamos información que nos proporciones.',
          items: ['Nombre', 'Correo', 'Teléfono', 'Contenido del mensaje']
        }
      },
      howWeUse: {
        title: 'Cómo Usamos Tu Información',
        items: ['Mejorar servicios', 'Responder preguntas', 'Enviar actualizaciones', 'Analizar uso']
      },
      whatWeDont: {
        title: 'Lo Que No Hacemos',
        items: ['No vendemos información', 'No decisiones automatizadas', 'No información sensible']
      },
      yourRights: {
        title: 'Tus Derechos',
        description: 'Derechos de acceso, corrección y eliminación.',
        items: ['Acceso a datos', 'Corregir datos', 'Eliminar datos', 'Oponerte al procesamiento']
      },
      dataSecurity: {
        title: 'Seguridad de Datos',
        content: 'Medidas apropiadas para proteger información.'
      },
      thirdPartyServices: {
        title: 'Servicios de Terceros',
        description: 'Servicios que nos ayudan a operar.',
        items: ['Microsoft Clarity', 'Proveedores de correo', 'Procesadores de pago', 'Software CRM'],
        footer: 'Terceros cumplen con leyes de protección de datos.'
      },
      contactUs: {
        title: 'Contáctanos',
        description: 'Preguntas sobre esta política.',
        email: 'Correo: kirby@mrmcdonald.org',
        phone: 'Teléfono: (435) 893-6006',
        location: 'Ubicación: Cedar City, Utah'
      },
      changes: {
        title: 'Cambios a Esta Política',
        content: 'Podemos actualizar esta política ocasionalmente.'
      }
    }
  }
};
