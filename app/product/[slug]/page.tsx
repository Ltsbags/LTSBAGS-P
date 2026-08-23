import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductDetailClient from './ProductDetailClient';
import SchemaScript from '@/components/SchemaScript';
import { db } from '@/lib/db';
import { generatePageMetadata, generateProductSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) return {};
  const product = db.getProductBySlug(slug);
  if (!product) return {};

  return generatePageMetadata({
    title: product.metaTitle || `${product.name} | B2B Wholesale Manufacturer`,
    description: product.metaDescription || product.shortDesc,
    keywords: product.metaKeywords,
    path: `/product/${product.slug}`,
    image: product.images?.[0],
  });
}

export default async function SingleProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const product = db.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const category = db.getCategoryById(product.categoryId) || db.getCategoryBySlug(product.categoryId);
  const relatedProducts = db.getProductsByCategory(product.categoryId).filter((p) => p.id !== product.id).slice(0, 3);

  const productSchema = generateProductSchema(product);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Products', url: '/products' },
    { name: category ? category.name : 'Category', url: category ? `/category/${category.slug}` : '/products' },
    { name: product.name, url: `/product/${product.slug}` },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <SchemaScript schema={[productSchema, breadcrumbSchema]} />
      <Navbar />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { name: 'Products', url: '/products' },
              { name: category ? category.name : 'Category', url: category ? `/category/${category.slug}` : '/products' },
              { name: product.name, url: `/product/${product.slug}` },
            ]}
          />

          <ProductDetailClient
            product={product}
            relatedProducts={relatedProducts}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
