import React from 'react';
import { notFound } from 'next/navigation';
import CategoryLandingView from '@/components/CategoryLandingView';
import { db } from '@/lib/db';
import { generatePageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;
  if (!categorySlug) return {};

  const category = db.getCategoryBySlug(categorySlug);
  if (!category) return {};

  const parent = category.parentId ? db.getCategoryById(category.parentId) : undefined;
  const canonicalPath = parent 
    ? `/products/${parent.slug}/${category.slug}`
    : `/products/${category.slug}`;

  return generatePageMetadata({
    title: category.metaTitle || `${category.name} Manufacturer in India | LTS Bags`,
    description: category.metaDescription || `Custom ${category.name} manufactured in India for businesses, corporate gifting and bulk orders. Explore designs and request a factory quote.`,
    keywords: category.metaKeywords || `${category.name}, wholesale ${category.name}, custom bag manufacturer India, LTS BAGS`,
    path: canonicalPath,
    image: category.image,
  });
}

export default async function ProductCategoryPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;

  if (!categorySlug) {
    notFound();
  }

  const category = db.getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const parent = category.parentId ? db.getCategoryById(category.parentId) : undefined;
  const subcategories = db.getSubcategories(category.id);
  const products = db.getProductsByCategoryOrSubcategory(category.id);
  const allCategories = db.getCategories();

  return (
    <CategoryLandingView
      category={category}
      parentCategory={parent}
      subcategories={subcategories}
      products={products}
      allCategories={allCategories}
    />
  );
}
