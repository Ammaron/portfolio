// i18n/translations/common.ts
export interface CommonTranslations {
  nav: {
    home: string;
    teachersPayTeachers: string;
    englishClasses: string;
    certifications: string;
    contact: string;
  };
}

export const commonTranslations: Record<'en' | 'es', CommonTranslations> = {
  en: {
    nav: {
      home: 'Home',
      teachersPayTeachers: 'Educational Resources',
      englishClasses: 'English Classes',
      certifications: 'Certifications',
      contact: 'Connect'
    }
  },
  es: {
    nav: {
      home: 'Inicio',
      teachersPayTeachers: 'Recursos Educativos',
      englishClasses: 'Clases de Inglés',
      certifications: 'Certificaciones',
      contact: 'Conectar'
    }
  }
};
