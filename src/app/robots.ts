import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/profile/', '/checkout/', '/login', '/register', '/order-tracking'],
    },
    sitemap: 'https://broxbournefoodcentre.com/sitemap.xml',
  };
}
