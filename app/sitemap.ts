import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { getAllSeoLandingPageSlugs } from '@/lib/seo-landing-pages';
import { seoStorage } from '@/lib/programmatic-seo/storage';
import { SEO_LOCATIONS } from '@/lib/programmatic-seo/data/locations';
import { SEO_INDUSTRIES } from '@/lib/programmatic-seo/data/industries';
import { SEO_MATERIALS } from '@/lib/programmatic-seo/data/materials';

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ltsbags.com';
  const now = new Date();

  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/request-a-quote', priority: 0.95, changeFrequency: 'daily' as const },
    { path: '/products', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/categories', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/locations', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/industries', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/materials', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/factory-tour', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/customization', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/manufacturing', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/clients', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.75, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  // Programmatic Hub entries
  const locationEntries: MetadataRoute.Sitemap = SEO_LOCATIONS.map((loc) => ({
    url: `${baseUrl}/locations/${loc.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const industryEntries: MetadataRoute.Sitemap = SEO_INDUSTRIES.map((ind) => ({
    url: `${baseUrl}/industries/${ind.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const materialEntries: MetadataRoute.Sitemap = SEO_MATERIALS.map((mat) => ({
    url: `${baseUrl}/materials/${mat.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Programmatic SEO Pages (STRICT QUALITY GATE: ONLY Published AND Indexable!)
  const programmaticPages = seoStorage.getAllPages().filter(
    (p) => p.status === 'PUBLISHED' && p.robots_index === true
  );
  const programmaticEntries: MetadataRoute.Sitemap = programmaticPages.map((page) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: page.updated_at ? new Date(page.updated_at) : now,
    changeFrequency: 'weekly' as const,
    priority: 0.95,
  }));

  // High-Intent Legacy SEO Landing Pages
  const seoLandingSlugs = getAllSeoLandingPageSlugs();
  const seoLandingEntries: MetadataRoute.Sitemap = seoLandingSlugs
    .filter((slug) => !programmaticPages.some((p) => p.slug === slug))
    .map((slug) => ({
      url: `${baseUrl}/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    }));

  const categories = db.getCategories().filter((c) => c && c.slug);
  const categoryEntries: MetadataRoute.Sitemap = [];
  
  categories.forEach((cat) => {
    categoryEntries.push({
      url: `${baseUrl}/${cat.slug}`,
      lastModified: cat.updatedAt ? new Date(cat.updatedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    });
  });

  const products = db.getProducts().filter((p) => p && p.slug && p.status !== 'INACTIVE');
  const productEntries: MetadataRoute.Sitemap = products.map((prod) => ({
    url: `${baseUrl}/product/${prod.slug}`,
    lastModified: prod.updatedAt ? new Date(prod.updatedAt) : now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const blogs = db.getBlogs().filter((b) => b && b.slug);
  const blogEntries: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: blog.updatedAt ? new Date(blog.updatedAt) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...staticEntries,
    ...locationEntries,
    ...industryEntries,
    ...materialEntries,
    ...programmaticEntries,
    ...seoLandingEntries,
    ...categoryEntries,
    ...productEntries,
    ...blogEntries,
  ];
}
