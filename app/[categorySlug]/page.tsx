import React from 'react';
import { notFound } from 'next/navigation';
import CategoryLandingView from '@/components/CategoryLandingView';
import SeoLandingPageView from '@/components/SeoLandingPageView';
import ProgrammaticPageView from '@/components/programmatic-seo/ProgrammaticPageView';
import { db } from '@/lib/db';
import { generatePageMetadata } from '@/lib/seo';
import { getSeoLandingPage } from '@/lib/seo-landing-pages';
import { seoStorage } from '@/lib/programmatic-seo/storage';

export const dynamic = 'force-dynamic';

const KNOWN_STATIC_ROUTES = new Set([
  'about',
  'admin',
  'api',
  'blog',
  'categories',
  'category',
  'clients',
  'contact',
  'customization',
  'factory-tour',
  'industries',
  'locations',
  'manufacturing',
  'materials',
  'privacy-policy',
  'product',
  'products',
  'request-a-quote',
  'robots.txt',
  'sitemap.xml',
  'terms',
]);

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;
  if (!categorySlug || KNOWN_STATIC_ROUTES.has(categorySlug)) return {};

  // 1. Check Programmatic SEO Engine database first
  const programmaticPage = seoStorage.getPageBySlug(categorySlug);
  if (programmaticPage && programmaticPage.status !== 'ARCHIVED') {
    return generatePageMetadata({
      title: programmaticPage.seo_title,
      description: programmaticPage.meta_description,
      path: `/${programmaticPage.slug}`,
      image: programmaticPage.featured_image,
      noIndex: !programmaticPage.robots_index || programmaticPage.status !== 'PUBLISHED',
    });
  }

  // 2. Check if it's a dedicated high-intent SEO Landing Page (legacy fallback)
  const seoLandingPage = getSeoLandingPage(categorySlug);
  if (seoLandingPage) {
    return generatePageMetadata({
      title: seoLandingPage.metaTitle,
      description: seoLandingPage.metaDescription,
      keywords: seoLandingPage.keywords,
      path: `/${seoLandingPage.slug}`,
    });
  }

  // 3. Check if it's a product category
  const category = db.getCategoryBySlug(categorySlug);
  if (!category) return {};

  return generatePageMetadata({
    title: category.metaTitle || `${category.name} Manufacturer in Mumbai | Custom & Wholesale`,
    description: category.metaDescription || `Custom bulk manufacturer of ${category.name} in Mumbai, India. Low MOQ, direct factory wholesale pricing, fast sampling and pan-India delivery.`,
    keywords: category.metaKeywords || `${category.name} manufacturer in Mumbai, ${category.name} wholesale Mumbai, custom ${category.name} India, LTS BAGS PRIVATE LIMITED`,
    path: `/${category.slug}`,
    image: category.image,
  });
}

export default async function TopLevelCategoryPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;

  if (!categorySlug || KNOWN_STATIC_ROUTES.has(categorySlug)) {
    notFound();
  }

  // 1. Check Programmatic SEO Engine database first
  const programmaticPage = seoStorage.getPageBySlug(categorySlug);
  if (programmaticPage && programmaticPage.status !== 'ARCHIVED') {
    return <ProgrammaticPageView page={programmaticPage} />;
  }

  // 2. Check if it's a dedicated high-intent SEO Landing Page (legacy fallback)
  const seoLandingPage = getSeoLandingPage(categorySlug);
  if (seoLandingPage) {
    return <SeoLandingPageView page={seoLandingPage} />;
  }

  // 3. Check if it's a product category
  const category = db.getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const products = db.getProductsByCategory(category.id);
  const allCategories = db.getCategories();

  return (
    <CategoryLandingView
      category={category}
      products={products}
      allCategories={allCategories}
    />
  );
}
