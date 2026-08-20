import { Metadata } from 'next';

const SITE_URL = process.env.APP_URL || 'https://ltsbags.com';
const SITE_NAME = 'LTS BAGS PRIVATE LIMITED';
const DEFAULT_TITLE = 'LTS BAGS PRIVATE LIMITED - Premier Custom B2B Bag Manufacturer & Wholesale Supplier';
const DEFAULT_DESC = 'LTS BAGS PRIVATE LIMITED is a leading OEM & ODM manufacturer of corporate backpacks, executive laptop bags, travel duffels, and eco canvas bags with custom logo printing and direct factory pricing.';

export function getBaseUrl(): string {
  return SITE_URL;
}

export function generatePageMetadata({
  title,
  description,
  keywords,
  path = '',
  lang = 'en',
  image = 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=1200',
}: {
  title?: string;
  description?: string;
  keywords?: string;
  path?: string;
  lang?: string;
  image?: string;
}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const fullDesc = description || DEFAULT_DESC;
  const langPrefix = lang && lang !== 'en' ? `?lang=${lang}` : '';
  const canonicalUrl = `${SITE_URL}${path}${langPrefix}`;

  // Generate hreflang tags for all initial supported languages
  const languageCodes = ['en', 'hi', 'ar', 'bn', 'mr', 'gu', 'ta', 'te', 'kn', 'ml', 'pa', 'ur', 'fr', 'de', 'es', 'pt', 'it', 'nl', 'ru', 'tr', 'zh', 'ja', 'ko'];
  const languageAlternates: Record<string, string> = {
    'x-default': `${SITE_URL}${path}`,
  };

  languageCodes.forEach((code) => {
    languageAlternates[code] = code === 'en' ? `${SITE_URL}${path}` : `${SITE_URL}${path}?lang=${code}`;
  });

  return {
    title: fullTitle,
    description: fullDesc,
    keywords: keywords || 'LTS BAGS PRIVATE LIMITED, bag manufacturer, B2B custom bags, wholesale corporate backpacks, OEM bag supplier, laptop bag factory',
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    openGraph: {
      title: fullTitle,
      description: fullDesc,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: lang === 'en' ? 'en_US' : lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDesc,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LTS BAGS PRIVATE LIMITED',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: DEFAULT_DESC,
    telephone: '+91 98335 98338',
    email: 'info@ltsbags.com',
    hasMap: 'https://www.google.com/search?kgmid=%2Fg%2F11qpsqysys&hl=en-IN&q=LTS%20BAGS%20PRIVATE%20LIMITED&shem=epsd1%2Cltae%2Crimspwouoe&shndl=30&source=sh%2Fx%2Floc%2Fosrp%2Fm1%2F4&kgs=20657782bd1aa7a9',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Industrial Manufacturing Hub',
      addressLocality: 'Mumbai',
      addressRegion: 'MH',
      postalCode: '400001',
      addressCountry: 'IN',
    },
  };
}


export function generateProductSchema(product: {
  name: string;
  shortDesc: string;
  images: string[];
  slug: string;
  moq: number;
  materials: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.shortDesc,
    sku: `LTS-${product.slug.toUpperCase()}`,
    mpn: `LTS-${product.slug.toUpperCase()}`,
    brand: {
      '@type': 'Brand',
      name: 'LTS BAGS PRIVATE LIMITED',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: '150.00',
      highPrice: '2500.00',
      offerCount: '1000',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'LTS BAGS PRIVATE LIMITED',
      },
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateArticleSchema(blog: {
  title: string;
  excerpt: string;
  image: string;
  publishedAt: string;
  author: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.image,
    datePublished: blog.publishedAt,
    author: {
      '@type': 'Organization',
      name: blog.author || 'LTS Bags Editorial Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'LTS BAGS PRIVATE LIMITED',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${blog.slug}`,
    },
  };
}
