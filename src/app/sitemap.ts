import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://broxbournefoodcentre.com';

  // Fetch all products
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      updatedAt: true,
    },
  });

  const productUrls = products.map((product) => {
    const slug = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    return {
      url: `${baseUrl}/product/${slug}-${product.id}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  });

  const routes = [
    '',
    '/shop',
    '/contact',
    '/services',
    '/register',
    '/login'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.9,
  }));

  return [...routes, ...productUrls];
}
