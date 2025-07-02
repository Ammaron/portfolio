// i18n/translations/footer.ts
export interface FooterTranslations {
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
    professionalCredentials: string;
    mbaBusinessLeadership: string;
    educationalLeadership: string;
    technologyFocus: string;
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
}

export const footerTranslations: Record<'en' | 'es', FooterTranslations> = {
  en: {
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
      professionalCredentials: 'Professional Credentials',
      mbaBusinessLeadership: 'MBA - Business Leadership',
      educationalLeadership: '5+ Years Educational Leadership',
      technologyFocus: 'Technology Innovation Focus',
      newsletterFeatures: 'What you\'ll receive:',
      leadershipInsights: 'Educational leadership insights',
      businessTips: 'Business strategy tips',
      edTechTrends: 'EdTech trends and opportunities',
      locationTitle: 'Cedar City, Utah | Educational Leader | MBA | Technology Innovator',
      professionalWebsite: 'Professional website designed for educational leadership opportunities',
      managementAward: 'Award-Winning Business Communication',
      programGrowth: '20% Program Growth Achievement',
      bilingualExpertise: 'Bilingual Professional Expertise'
    }
  },
  es: {
    footer: {
      description: 'Líder Educativo, Maestria en Administracion de Negocios e Innovador Tecnológico con sede en Cedar City, Utah.',
      bilingual: 'Profesional bilingüe especializado en la intersección de educación, estrategia empresarial y tecnología emergente.',
      quickLinks: 'Enlaces Profesionales',
      newsletter: 'Actualizaciones Profesionales',
      subscribeText: 'Suscríbete para obtener perspectivas sobre liderazgo educativo, estrategia empresarial y tendencias tecnológicas',
      subscribeButton: 'Suscribirse',
      emailPlaceholder: 'Tu correo profesional',
      thankYou: '¡Gracias por suscribirte!',
      copyright: 'Todos los derechos reservados.',
      privacyPolicy: 'Política de Privacidad',
      termsOfService: 'Términos de Servicio',
      professionalNetwork: 'Red Profesional',
      professionalCredentials: 'Credenciales Profesionales',
      mbaBusinessLeadership: 'Maestria en Administracion de Negocios - Liderazgo Empresarial',
      educationalLeadership: '5+ Años Liderazgo Educativo',
      technologyFocus: 'Enfoque en Innovación Tecnológica',
      newsletterFeatures: 'Lo que recibirás:',
      leadershipInsights: 'Perspectivas de liderazgo educativo',
      businessTips: 'Consejos de estrategia empresarial',
      edTechTrends: 'Tendencias EdTech',
      locationTitle: 'Cedar City, Utah | Líder Educativo | Maestria en Administracion de Negocios | Innovador',
      professionalWebsite: 'Sitio web profesional',
      managementAward: 'Comunicación Empresarial Galardonada',
      programGrowth: '20% Crecimiento de Programas',
      bilingualExpertise: 'Experiencia Bilingüe Profesional'
    }
  }
};
