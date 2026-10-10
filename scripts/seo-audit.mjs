import fs from 'fs';
import path from 'path';

// Load database directly
const dbModule = await import('../lib/db.ts');
const db = dbModule.db;

const progStorageModule = await import('../lib/programmatic-seo/storage.ts');
const seoStorage = progStorageModule.seoStorage;

const seoLandingModule = await import('../lib/seo-landing-pages.ts');
const getAllSeoLandingPageSlugs = seoLandingModule.getAllSeoLandingPageSlugs;

const locationsModule = await import('../lib/programmatic-seo/data/locations.ts');
const SEO_LOCATIONS = locationsModule.SEO_LOCATIONS;

const industriesModule = await import('../lib/programmatic-seo/data/industries.ts');
const SEO_INDUSTRIES = industriesModule.SEO_INDUSTRIES;

const materialsModule = await import('../lib/programmatic-seo/data/materials.ts');
const SEO_MATERIALS = materialsModule.SEO_MATERIALS;

console.log('=== 1. AUDITING KNOWN VALID CANONICAL ROUTES ===');

// Valid static pages
const validStaticRoutes = new Set([
  '/',
  '/about',
  '/products',
  '/categories',
  '/customization',
  '/manufacturing',
  '/factory-tour',
  '/clients',
  '/contact',
  '/request-a-quote',
  '/locations',
  '/industries',
  '/materials',
  '/privacy-policy',
  '/terms',
  '/blog',
  '/pay',
]);

// Valid dynamic routes
const validLocationRoutes = new Set(SEO_LOCATIONS.map(l => `/locations/${l.slug}`));
const validIndustryRoutes = new Set(SEO_INDUSTRIES.map(i => `/industries/${i.slug}`));
const validMaterialRoutes = new Set(SEO_MATERIALS.map(m => `/materials/${m.slug}`));

// Programmatic pages
const publishedProgPages = seoStorage.getAllPages().filter(p => p.status === 'PUBLISHED');
const validProgRoutes = new Set(publishedProgPages.map(p => `/${p.slug}`));

// Legacy SEO landing pages
const seoLandingSlugs = getAllSeoLandingPageSlugs();
const validSeoLandingRoutes = new Set(seoLandingSlugs.map(s => `/${s}`));

// Products
const products = db.getProducts().filter(p => p && p.slug && p.status !== 'INACTIVE');
const validProductRoutes = new Set(products.map(p => `/product/${p.slug}`));

// Blogs
const blogs = db.getBlogs().filter(b => b && b.slug);
const validBlogRoutes = new Set(blogs.map(b => `/blog/${b.slug}`));

// Categories & subcategories
const allCategories = db.getCategories();
const validCategoryRoutesRoot = new Set(allCategories.map(c => `/${c.slug}`));
const validCategoryRoutesProducts = new Set(allCategories.map(c => `/products/${c.slug}`));
const validCategoryRoutesCategory = new Set(allCategories.map(c => `/category/${c.slug}`));

// Also subcategories under /products/[parentSlug]/[subSlug]
const validSubcategoryRoutes = new Set();
for (const cat of allCategories) {
  if (cat.parentId) {
    const parent = db.getCategoryById(cat.parentId);
    if (parent) {
      validSubcategoryRoutes.add(`/products/${parent.slug}/${cat.slug}`);
    }
  }
}

console.log(`Static routes: ${validStaticRoutes.size}`);
console.log(`Location routes: ${validLocationRoutes.size}`);
console.log(`Industry routes: ${validIndustryRoutes.size}`);
console.log(`Material routes: ${validMaterialRoutes.size}`);
console.log(`Programmatic routes: ${validProgRoutes.size}`);
console.log(`SEO Landing routes: ${validSeoLandingRoutes.size}`);
console.log(`Product routes: ${validProductRoutes.size}`);
console.log(`Blog routes: ${validBlogRoutes.size}`);
console.log(`Categories count: ${allCategories.length}`);
console.log(`Subcategory nested routes: ${validSubcategoryRoutes.size}`);

// Combine all valid routes
const allValidRoutes = new Set([
  ...validStaticRoutes,
  ...validLocationRoutes,
  ...validIndustryRoutes,
  ...validMaterialRoutes,
  ...validProgRoutes,
  ...validSeoLandingRoutes,
  ...validProductRoutes,
  ...validBlogRoutes,
  ...validCategoryRoutesRoot,
  ...validCategoryRoutesProducts,
  ...validCategoryRoutesCategory,
  ...validSubcategoryRoutes,
]);

// Helper to check if a route can be resolved
function canResolveRoute(cleanUrl) {
  if (allValidRoutes.has(cleanUrl)) return true;
  
  // Strip trailing slash
  const noSlash = cleanUrl.endsWith('/') ? cleanUrl.slice(0, -1) : cleanUrl;
  if (allValidRoutes.has(noSlash)) return true;
  
  // Check category alias
  if (noSlash.startsWith('/products/')) {
    const slug = noSlash.replace('/products/', '');
    const cat = db.getCategoryBySlug(slug);
    if (cat) return true;
  }
  if (noSlash.startsWith('/category/')) {
    const slug = noSlash.replace('/category/', '');
    const cat = db.getCategoryBySlug(slug);
    if (cat) return true;
  }
  if (noSlash.startsWith('/')) {
    const slug = noSlash.replace('/', '');
    const cat = db.getCategoryBySlug(slug);
    if (cat) return true;
  }
  
  return false;
}

console.log('\n=== 2. SCANNING CODEBASE FOR INTERNAL LINKS ===');
const scannedDirs = ['app', 'components', 'lib'];
const extractedLinks = [];

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        scanDir(fullPath);
      }
    } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      // Skip admin pages and test scripts
      if (fullPath.includes('/admin/') || fullPath.includes('scripts/')) continue;
      
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Match href="/..." or href={'/...'} or router.push('/...')
      const hrefRegex = /href=["'](\/[^"']*)["']|href=\{["'](\/[^"']*)["']\}|router\.push\(["'](\/[^"']*)["']\)/g;
      let match;
      while ((match = hrefRegex.exec(content)) !== null) {
        const link = match[1] || match[2] || match[3];
        if (link && !link.startsWith('/_next') && !link.startsWith('/api') && !link.startsWith('/admin')) {
          // Exclude template strings or variable interpolations like /product/${...}
          if (!link.includes('${') && !link.includes('+')) {
            extractedLinks.push({
              sourceFile: fullPath,
              url: link,
            });
          }
        }
      }
    }
  }
}

for (const d of scannedDirs) {
  if (fs.existsSync(d)) scanDir(d);
}

console.log(`Found ${extractedLinks.length} static/hardcoded internal link instances.`);

// Analyze broken links
const brokenLinks = [];
const redirectableLinks = [];
const validLinks = [];

for (const item of extractedLinks) {
  const url = item.url.split('?')[0].split('#')[0]; // strip query/hash
  const normalized = url.endsWith('/') && url.length > 1 ? url.slice(0, -1) : url;
  
  if (canResolveRoute(url) || canResolveRoute(normalized)) {
    validLinks.push(item);
  } else {
    brokenLinks.push(item);
  }
}

console.log(`Valid links: ${validLinks.length}`);
console.log(`Potentially Broken links: ${brokenLinks.length}`);

if (brokenLinks.length > 0) {
  console.log('\n--- BROKEN LINKS FOUND ---');
  for (const b of brokenLinks) {
    console.log(`Source: ${b.sourceFile} -> Broken URL: ${b.url}`);
  }
} else {
  console.log('No broken links found in static scan!');
}

console.log('\n=== 3. CHECKING SPECIFIC CATEGORY LINKS FROM USER PROMPT ===');
const specialCheckSlugs = [
  'backpacks',
  'laptop-office-bags',
  'travel-bags',
  'sports-gym-bags',
  'tote-shopping-bags',
  'jute-eco-bags',
  'sling-shoulder-bags',
  'custom-manufacturing',
  'custom-bags',
  'laptop-bags',
  'school-college-bags',
];

for (const slug of specialCheckSlugs) {
  const pUrl = `/products/${slug}`;
  const pUrlSlash = `/products/${slug}/`;
  const resolves = canResolveRoute(pUrl);
  const cat = db.getCategoryBySlug(slug);
  console.log(`Slug: ${slug} -> ${pUrl} Resolves: ${resolves} (Matched Category: ${cat ? cat.name + ' [' + cat.slug + ']' : 'NONE'})`);
}
