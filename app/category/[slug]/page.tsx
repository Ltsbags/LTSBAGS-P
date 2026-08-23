import React from 'react';
import { notFound } from 'next/navigation';
import CategoryLandingView from '@/components/CategoryLandingView';
import { db } from '@/lib/db';
import { generatePageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) return {};
  const category = db.getCategoryBySlug(slug);
  if (!category) return {};

  return generatePageMetadata({
    title: category.metaTitle || `${category.name} Manufacturer in Mumbai | Custom & Wholesale`,
    description: category.metaDescription || `Custom bulk manufacturer of ${category.name} in Mumbai, India. Low MOQ, direct factory wholesale pricing, fast sampling and pan-India delivery.`,
    keywords: category.metaKeywords || `${category.name} manufacturer in Mumbai, ${category.name} wholesale Mumbai, custom ${category.name} India, LTS BAGS PRIVATE LIMITED`,
    path: `/category/${category.slug}`,
    image: category.image,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const category = db.getCategoryBySlug(slug);

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

