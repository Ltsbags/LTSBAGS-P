import React from 'react';
import { notFound } from 'next/navigation';
import CategoryLandingView from '@/components/CategoryLandingView';
import { db } from '@/lib/db';
import { generatePageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string; subSlug: string }> }) {
  const { categorySlug, subSlug } = await params;
  if (!categorySlug || !subSlug) return {};

  const { parent, subcategory } = db.getCategoryByParentAndSubSlug(categorySlug, subSlug);
  const targetCategory = subcategory || db.getCategoryBySlug(subSlug);
  if (!targetCategory) return {};

  const parentCat = parent || (targetCategory.parentId ? db.getCategoryById(targetCategory.parentId) : undefined);
  const canonicalPath = parentCat
    ? `/products/${parentCat.slug}/${targetCategory.slug}`
    : `/products/${targetCategory.slug}`;

  return generatePageMetadata({
    title: targetCategory.metaTitle || `${targetCategory.name} Manufacturer in India | LTS Bags`,
    description: targetCategory.metaDescription || `Custom ${targetCategory.name} manufactured in India for schools, businesses and bulk orders. Explore designs and request a factory quote.`,
    keywords: targetCategory.metaKeywords || `${targetCategory.name}, wholesale ${targetCategory.name}, custom bag manufacturer India, LTS BAGS`,
    path: canonicalPath,
    image: targetCategory.image,
  });
}

export default async function ProductSubcategoryPage({ params }: { params: Promise<{ categorySlug: string; subSlug: string }> }) {
  const { categorySlug, subSlug } = await params;

  if (!categorySlug || !subSlug) {
    notFound();
  }

  const { parent, subcategory } = db.getCategoryByParentAndSubSlug(categorySlug, subSlug);
  const targetCategory = subcategory || db.getCategoryBySlug(subSlug);

  if (!targetCategory) {
    notFound();
  }

  const parentCat = parent || (targetCategory.parentId ? db.getCategoryById(targetCategory.parentId) : undefined);
  const siblingSubcategories = parentCat ? db.getSubcategories(parentCat.id) : [];
  const products = db.getProductsByCategoryOrSubcategory(targetCategory.id);
  const allCategories = db.getCategories();

  return (
    <CategoryLandingView
      category={targetCategory}
      parentCategory={parentCat}
      subcategories={siblingSubcategories}
      products={products}
      allCategories={allCategories}
    />
  );
}
