// src/app/robots.ts
import { MetadataRoute } from 'next';

export const dynamic = 'force-static';
export const revalidate = false;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://mrmcdonald.org/sitemap.xml',
    host: 'https://mrmcdonald.org',
  };
}
