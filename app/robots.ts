// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'], // adjust to your private routes
    },
    sitemap: 'https://www.incometaxcalculation.pk/sitemap.xml',
    host: 'https://www.incometaxcalculation.pk',
  }
}
