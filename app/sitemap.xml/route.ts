import { db } from '@/lib/db';
import { getBaseUrl } from '@/lib/seo';

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatDate(dateInput?: string | Date): string {
  try {
    if (dateInput) {
      const d = new Date(dateInput);
      if (!isNaN(d.getTime())) {
        return d.toISOString().split('T')[0];
      }
    }
  } catch (e) {
    // fallback
  }
  return new Date().toISOString().split('T')[0];
}

export async function GET() {
  const baseUrl = (getBaseUrl() || 'https://ltsbags.com').replace(/\/+$/, '');
  const products = db.getProducts().filter((p) => p && p.slug && p.status !== 'INACTIVE');
  const categories = db.getCategories().filter((c) => c && c.slug);
  const blogs = db.getBlogs().filter((b) => b && b.slug);

  const staticPages = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: '/request-a-quote', priority: '0.9', changefreq: 'daily' },
    { path: '/products', priority: '0.9', changefreq: 'daily' },
    { path: '/categories', priority: '0.9', changefreq: 'weekly' },
    { path: '/factory-tour', priority: '0.9', changefreq: 'weekly' },
    { path: '/customization', priority: '0.8', changefreq: 'weekly' },
    { path: '/manufacturing', priority: '0.8', changefreq: 'monthly' },
    { path: '/clients', priority: '0.8', changefreq: 'monthly' },
    { path: '/about', priority: '0.7', changefreq: 'monthly' },
    { path: '/blog', priority: '0.8', changefreq: 'weekly' },
    { path: '/contact', priority: '0.7', changefreq: 'monthly' },
    { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
    { path: '/terms', priority: '0.3', changefreq: 'yearly' },
  ];

  const now = formatDate();

  const staticUrls = staticPages
    .map(
      (page) => `  <url>
    <loc>${escapeXml(`${baseUrl}${page.path}`)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('\n');

  const categoryUrls = categories
    .map((cat) => {
      const lastmod = formatDate(cat.updatedAt || cat.createdAt || now);
      let imgXml = '';
      if (cat.image) {
        imgXml = `\n    <image:image>\n      <image:loc>${escapeXml(cat.image)}</image:loc>\n      <image:title>${escapeXml(cat.name || 'LTS Bags Category')}</image:title>\n    </image:image>`;
      }
      return `  <url>
    <loc>${escapeXml(`${baseUrl}/${cat.slug}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>${imgXml}
  </url>
  <url>
    <loc>${escapeXml(`${baseUrl}/category/${cat.slug}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${imgXml}
  </url>`;
    })
    .join('\n');

  const productUrls = products
    .map((prod) => {
      const lastmod = formatDate(prod.updatedAt || prod.createdAt || now);
      let imgXml = '';
      if (Array.isArray(prod.images) && prod.images.length > 0 && prod.images[0]) {
        imgXml = `\n    <image:image>\n      <image:loc>${escapeXml(prod.images[0])}</image:loc>\n      <image:title>${escapeXml(prod.name || 'LTS Custom Bag')}</image:title>\n    </image:image>`;
      }
      return `  <url>
    <loc>${escapeXml(`${baseUrl}/product/${prod.slug}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>${imgXml}
  </url>`;
    })
    .join('\n');

  const blogUrls = blogs
    .map((blog) => {
      const lastmod = formatDate(blog.updatedAt || blog.publishedAt || blog.createdAt || now);
      let imgXml = '';
      if (blog.image) {
        imgXml = `\n    <image:image>\n      <image:loc>${escapeXml(blog.image)}</image:loc>\n      <image:title>${escapeXml(blog.title || 'LTS Bags Article')}</image:title>\n    </image:image>`;
      }
      return `  <url>
    <loc>${escapeXml(`${baseUrl}/blog/${blog.slug}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${imgXml}
  </url>`;
    })
    .join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${staticUrls}
${categoryUrls}
${productUrls}
${blogUrls}
</urlset>`;

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate',
    },
  });
}
