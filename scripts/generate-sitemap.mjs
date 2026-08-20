import fs from 'fs';
import path from 'path';

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatDate(dateInput) {
  try {
    const d = new Date(dateInput);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch (e) {
    // fallback
  }
  return new Date().toISOString().split('T')[0];
}

async function generateSitemap() {
  console.log('🚀 Starting sitemap.xml generation for LTS BAGS PRIVATE LIMITED...');

  const cwd = process.cwd();
  const dbFile = path.join(cwd, '.data', 'db.json');
  const publicDir = path.join(cwd, 'public');
  const sitemapFile = path.join(publicDir, 'sitemap.xml');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  let dbData = {
    products: [],
    categories: [],
    blogs: [],
    settings: {},
  };

  if (fs.existsSync(dbFile)) {
    try {
      const raw = fs.readFileSync(dbFile, 'utf-8');
      dbData = JSON.parse(raw);
    } catch (err) {
      console.error('⚠️ Could not parse db.json, using default empty structure:', err.message);
    }
  } else {
    console.warn('⚠️ db.json not found at', dbFile);
  }

  const baseUrl = (process.env.APP_URL || 'https://ltsbags.com').replace(/\/+$/, '');
  const now = formatDate(new Date());

  // 1. Static Key Pages with priorities and change frequencies
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

  let urlEntries = [];

  // Add static URLs
  staticPages.forEach((page) => {
    urlEntries.push(`  <url>
    <loc>${escapeXml(`${baseUrl}${page.path}`)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
  });

  // 2. Categories
  const categories = (dbData.categories || []).filter((c) => c && c.slug);
  categories.forEach((cat) => {
    const lastmod = formatDate(cat.updatedAt || cat.createdAt || now);
    let imageXml = '';
    if (cat.image) {
      imageXml = `
    <image:image>
      <image:loc>${escapeXml(cat.image)}</image:loc>
      <image:title>${escapeXml(cat.name || 'LTS Bags Category')}</image:title>
    </image:image>`;
    }

    urlEntries.push(`  <url>
    <loc>${escapeXml(`${baseUrl}/category/${cat.slug}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${imageXml}
  </url>`);
  });

  // 3. Products
  const products = (dbData.products || []).filter((p) => p && p.slug && p.status !== 'inactive');
  products.forEach((prod) => {
    const lastmod = formatDate(prod.updatedAt || prod.createdAt || now);
    let imageXml = '';
    if (Array.isArray(prod.images) && prod.images.length > 0) {
      const mainImg = prod.images[0];
      if (mainImg) {
        imageXml = `
    <image:image>
      <image:loc>${escapeXml(mainImg)}</image:loc>
      <image:title>${escapeXml(prod.name || 'LTS Custom Bag')}</image:title>
    </image:image>`;
      }
    }

    urlEntries.push(`  <url>
    <loc>${escapeXml(`${baseUrl}/product/${prod.slug}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>${imageXml}
  </url>`);
  });

  // 4. Blogs
  const blogs = (dbData.blogs || []).filter((b) => b && b.slug);
  blogs.forEach((blog) => {
    const lastmod = formatDate(blog.updatedAt || blog.publishedAt || blog.createdAt || now);
    let imageXml = '';
    if (blog.image) {
      imageXml = `
    <image:image>
      <image:loc>${escapeXml(blog.image)}</image:loc>
      <image:title>${escapeXml(blog.title || 'LTS Bags Article')}</image:title>
    </image:image>`;
    }

    urlEntries.push(`  <url>
    <loc>${escapeXml(`${baseUrl}/blog/${blog.slug}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${imageXml}
  </url>`);
  });

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries.join('\n')}
</urlset>
`;

  fs.writeFileSync(sitemapFile, xmlContent, 'utf-8');

  console.log(`✅ sitemap.xml generated successfully at: ${sitemapFile}`);
  console.log(`📊 Summary:`);
  console.log(`   - Static Pages: ${staticPages.length}`);
  console.log(`   - Category Pages: ${categories.length}`);
  console.log(`   - Product Pages: ${products.length}`);
  console.log(`   - Blog Articles: ${blogs.length}`);
  console.log(`   - Total URLs indexed: ${urlEntries.length}`);

  return {
    success: true,
    totalUrls: urlEntries.length,
    counts: {
      staticPages: staticPages.length,
      categories: categories.length,
      products: products.length,
      blogs: blogs.length,
    },
    generatedAt: new Date().toISOString(),
  };
}

// Run if called directly
if (process.argv[1] && process.argv[1].endsWith('generate-sitemap.mjs')) {
  generateSitemap().catch((err) => {
    console.error('❌ Error generating sitemap:', err);
    process.exit(1);
  });
}

export { generateSitemap };
