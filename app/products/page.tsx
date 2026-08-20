import React from 'react';
import ProductsCatalogClient from './ProductsCatalogClient';
import SchemaScript from '@/components/SchemaScript';
import { db } from '@/lib/db';
import { generatePageMetadata, generateBreadcrumbSchema } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata = generatePageMetadata({
  title: 'Custom Bag Manufacturing Catalog & B2B Wholesale Models | ApexBags',
  description: 'Browse wholesale corporate backpacks, executive laptop briefcases, travel duffel bags, and eco-friendly organic canvas tote bags for bulk manufacturing.',
  path: '/products',
});

export default function ProductsCatalogPage() {
  const allProducts = db.getProducts();
  const categories = db.getCategories();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Products', url: '/products' },
  ]);

  return (
    <>
      <SchemaScript schema={breadcrumbSchema} />
      <ProductsCatalogClient
        allProducts={allProducts}
        categories={categories}
      />
    </>
  );
}
