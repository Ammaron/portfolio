// i18n/translations/index.ts
import { CommonTranslations, commonTranslations } from './common';
import { HomeTranslations, homeTranslations } from './home';
import { ClassesTranslations, classesTranslations } from './classes';
import { TptTranslations, tptTranslations } from './tpt';
import { CertificationsTranslations, certificationsTranslations } from './certifications';
import { LegalTranslations, legalTranslations } from './legal';
import { FooterTranslations, footerTranslations } from './footer';
import { blog } from './blog';
import { PlacementTestTranslations, placementTestTranslations } from './placement-test';

// Blog translations type
export type BlogTranslations = typeof blog.en;

// Combined interface for all translations
export interface TranslationStructure
  extends CommonTranslations,
          HomeTranslations,
          ClassesTranslations,
          TptTranslations,
          CertificationsTranslations,
          LegalTranslations,
          FooterTranslations,
          BlogTranslations,
          PlacementTestTranslations {}

// Function to merge all translation objects
function mergeTranslations(locale: 'en' | 'es'): TranslationStructure {
  return {
    ...commonTranslations[locale],
    ...homeTranslations[locale],
    ...classesTranslations[locale],
    ...tptTranslations[locale],
    ...certificationsTranslations[locale],
    ...legalTranslations[locale],
    ...footerTranslations[locale],
    ...blog[locale],
    ...placementTestTranslations[locale]
  };
}

// Export the combined translations
export const translations: Record<'en' | 'es', TranslationStructure> = {
  en: mergeTranslations('en'),
  es: mergeTranslations('es')
};

// Export individual translation modules for easier maintenance
export {
  commonTranslations,
  homeTranslations,
  classesTranslations,
  tptTranslations,
  certificationsTranslations,
  legalTranslations,
  footerTranslations,
  blog,
  placementTestTranslations
};
