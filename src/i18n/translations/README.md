# i18n Translation Structure

This folder contains the modular translation system for the portfolio website. The translations have been organized into multiple files for better maintainability.

## File Structure

```
src/i18n/translations/
├── index.ts              # Main export file that combines all translations
├── common.ts             # Navigation and common UI elements
├── home.ts              # Home page content (hero, about, contact)
├── classes.ts           # English classes/instruction content
├── certifications.ts    # Certification-related content
├── tpt.ts              # Teachers Pay Teachers content
├── legal.ts            # Privacy policy and cookie consent
└── footer.ts           # Footer content
```

## Benefits of This Structure

1. **Maintainability**: Each major section has its own file, making it easier to find and update specific content
2. **Collaboration**: Multiple team members can work on different sections without conflicts
3. **Type Safety**: Each file exports its own TypeScript interface for better type checking
4. **Modularity**: You can easily add, remove, or modify sections without affecting others
5. **Performance**: Easier to implement lazy loading or code splitting if needed in the future

## How to Use

### Adding New Translations

1. **For existing sections**: Edit the appropriate file (e.g., `home.ts` for home page content)
2. **For new sections**: 
   - Create a new file (e.g., `blog.ts`)
   - Define the interface and translations
   - Import and add to `index.ts`

### Example: Adding a new section

```typescript
// src/i18n/translations/blog.ts
export interface BlogTranslations {
  blog: {
    title: string;
    subtitle: string;
    // ... more fields
  };
}

export const blogTranslations: Record<'en' | 'es', BlogTranslations> = {
  en: {
    blog: {
      title: 'Blog',
      subtitle: 'Latest thoughts on education and technology'
    }
  },
  es: {
    blog: {
      title: 'Blog',
      subtitle: 'Últimos pensamientos sobre educación y tecnología'
    }
  }
};
```

Then add to `index.ts`:
```typescript
import { BlogTranslations, blogTranslations } from './blog';

export interface TranslationStructure 
  extends CommonTranslations,
          HomeTranslations,
          // ... other interfaces
          BlogTranslations {}

function mergeTranslations(locale: 'en' | 'es'): TranslationStructure {
  return {
    // ... other translations
    ...blogTranslations[locale]
  };
}
```

## Migration from Old System

The old `translations.ts` file has been replaced with this modular system. The API remains the same - you still use the `useI18n()` hook and `t()` function exactly as before. The only difference is that the translations are now organized into multiple files for better maintainability.

## File Responsibilities

- **common.ts**: Navigation menu, common buttons, shared UI text
- **home.ts**: Hero section, about section, contact form, experience/education details
- **classes.ts**: All English class program descriptions, pricing, testimonials
- **certifications.ts**: Certification programs, verification system, certification details
- **tpt.ts**: Teachers Pay Teachers resources, educational materials
- **legal.ts**: Privacy policy, cookie consent, legal notices
- **footer.ts**: Footer links, newsletter signup, professional credentials

This structure makes it much easier to maintain and update your translations!
