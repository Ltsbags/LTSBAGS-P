import { Metadata } from 'next';
import { db } from './db';

function cleanSiteUrl(rawUrl?: string): string {
  if (!rawUrl) return 'https://ltsbags.com';
  let cleaned = rawUrl.trim();
  // Fix accidental duplicate typos or previous domain
  cleaned = cleaned.replace(/ltsbagsbags\.com/gi, 'ltsbags.com');
  cleaned = cleaned.replace(/mumbaibags\.com/gi, 'ltsbags.com');
  // Strip trailing slashes
  cleaned = cleaned.replace(/\/+$/, '');
  return cleaned || 'https://ltsbags.com';
}

const SITE_URL = 'https://ltsbags.com';
const INDEXING_ENABLED = true;
const SITE_NAME = 'LTS BAGS PRIVATE LIMITED | LTS Bags';
const DEFAULT_TITLE = 'Bag Manufacturer in Mumbai | Custom & Wholesale Bags';
const DEFAULT_DESC = 'Mumbai-based bag manufacturer offering custom backpacks, laptop bags, school bags, corporate bags, travel duffels, eco canvas totes and promotional bags for bulk orders with OEM/ODM customization and direct factory pricing.';

export function getBaseUrl(): string {
  return SITE_URL;
}

export function isIndexingEnabled(): boolean {
  return true;
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
  const fullTitle = title ? `${title} | LTS BAGS Mumbai` : `${DEFAULT_TITLE} | LTS BAGS Mumbai`;
  const fullDesc = description || DEFAULT_DESC;
  const langPrefix = lang && lang !== 'en' ? `?lang=${lang}` : '';
  const canonicalUrl = `${SITE_URL}${path}${langPrefix}`;

  // Generate hreflang tags for supported languages
  const languageCodes = ['en', 'hi', 'mr', 'gu', 'bn', 'ta', 'te', 'kn', 'ml', 'pa', 'ur', 'ar', 'fr', 'de', 'es'];
  const languageAlternates: Record<string, string> = {
    'x-default': `${SITE_URL}${path}`,
  };

  languageCodes.forEach((code) => {
    languageAlternates[code] = code === 'en' ? `${SITE_URL}${path}` : `${SITE_URL}${path}?lang=${code}`;
  });

  return {
    title: fullTitle,
    description: fullDesc,
    keywords: keywords || 'bag manufacturer in Mumbai, bag manufacturer in India, custom bag manufacturer, wholesale bag manufacturer, backpack manufacturer, corporate bag manufacturer, promotional bag manufacturer, school bag manufacturer, laptop bag manufacturer, custom bags manufacturer Mumbai, LTS BAGS PRIVATE LIMITED',
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
      locale: lang === 'en' ? 'en_IN' : lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDesc,
      images: [image],
    },
    metadataBase: (() => {
      try {
        return new URL(SITE_URL);
      } catch {
        return new URL('https://ltsbags.com');
      }
    })(),
    verification: {
      google: (() => {
        try {
          const dbVerification = db.getSettings()?.seoDefaults?.googleSiteVerification;
          if (dbVerification && dbVerification.trim()) return dbVerification.trim();
        } catch (e) {
          // ignore
        }
        return process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || process.env.GOOGLE_SITE_VERIFICATION || undefined;
      })(),
    },
    robots: INDEXING_ENABLED
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        }
      : {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        },
  };
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LTS BAGS PRIVATE LIMITED | LTS Bags',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/products?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LTS BAGS PRIVATE LIMITED',
    alternateName: 'LTS Bags',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: DEFAULT_DESC,
    telephone: '+91 98335 98338',
    email: 'info@ltsbags.com',
    hasMap: 'https://www.google.com/search?kgmid=%2Fg%2F11qpsqysys&hl=en-IN&q=LTS%20BAGS%20PRIVATE%20LIMITED',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'FLOOR- G, A341/2/3, GANESH SAI KRIPA CHS SANT ROHIDAS MARG, MUKUND NAGAR, DHARAVI',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400017',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://www.google.com/search?kgmid=%2Fg%2F11qpsqysys&hl=en-IN&q=LTS%20BAGS%20PRIVATE%20LIMITED',
      'https://ltsbags.com',
    ],
  };
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Manufacturer'],
    name: 'LTS BAGS PRIVATE LIMITED',
    alternateName: 'LTS Bags',
    image: `${SITE_URL}/logo.png`,
    url: SITE_URL,
    telephone: '+91 98335 98338',
    email: 'info@ltsbags.com',
    priceRange: '₹₹ - ₹₹₹',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'FLOOR- G, A341/2/3, GANESH SAI KRIPA CHS SANT ROHIDAS MARG, MUKUND NAGAR, DHARAVI',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400017',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '19.0402',
      longitude: '72.8509',
    },
    hasMap: 'https://www.google.com/search?kgmid=%2Fg%2F11qpsqysys&hl=en-IN&q=LTS%20BAGS%20PRIVATE%20LIMITED',
    taxID: '27AAGCL1568H1ZC',
    currenciesAccepted: 'INR, USD, EUR, GBP, AED',
    paymentAccepted: 'Bank Transfer, Cheque, NEFT, RTGS, Cash, UPI',
  };
}

export function generateProductSchema(product: {
  name: string;
  shortDesc?: string;
  images?: string[];
  slug: string;
  moq?: number;
  materials?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product?.name || 'Product',
    image: product?.images || [],
    description: product?.shortDesc || '',
    sku: `LTS-${(product?.slug || 'ITEM').toUpperCase()}`,
    mpn: `LTS-${(product?.slug || 'ITEM').toUpperCase()}`,
    brand: {
      '@type': 'Brand',
      name: 'LTS BAGS PRIVATE LIMITED',
    },
    material: product?.materials || 'Fabric / Polyester / Nylon',
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
  const safeItems = Array.isArray(items) ? items : [];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: safeItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item?.name || 'Page',
      item: item?.url?.startsWith('http') ? item.url : `${SITE_URL}${item?.url || ''}`,
    })),
  };
}

export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
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

