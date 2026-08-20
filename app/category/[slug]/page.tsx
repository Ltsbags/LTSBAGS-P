import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductCard from '@/components/ProductCard';
import SchemaScript from '@/components/SchemaScript';
import { db } from '@/lib/db';
import { generatePageMetadata, generateBreadcrumbSchema } from '@/lib/seo';
import { Layers, ShieldCheck, Award, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = db.getCategoryBySlug(slug);
  if (!category) return {};

  return generatePageMetadata({
    title: category.metaTitle || `${category.name} Wholesale Manufacturer`,
    description: category.metaDescription || category.description,
    keywords: category.metaKeywords,
    path: `/category/${category.slug}`,
    image: category.image,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = db.getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = db.getProductsByCategory(category.id);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Products', url: '/products' },
    { name: category.name, url: `/category/${category.slug}` },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <SchemaScript schema={breadcrumbSchema} />
      <Navbar />

      <main className="flex-1">
        
        {/* Banner */}
        <section className="bg-slate-900 text-white py-14 border-b border-slate-800 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Breadcrumbs
              items={[
                { name: 'Products', url: '/products' },
                { name: category.name, url: `/category/${category.slug}` },
              ]}
            />
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-3">
                <span className="text-amber-400 font-bold text-xs uppercase tracking-widest font-mono bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Specialized Bag Category
                </span>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-serif text-white">
                  {category.name}
                </h1>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {category.description}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-amber-300">
                  <span className="flex items-center gap-1 font-semibold bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Direct Factory Pricing
                  </span>
                  <span className="flex items-center gap-1 font-semibold bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
                    <Award className="w-3.5 h-3.5 text-amber-400" /> Custom Logo Printing & Embossing
                  </span>
                </div>
              </div>

              <div className="md:col-span-4">
                <div className="rounded-xl overflow-hidden border border-slate-700 aspect-16/10 shadow-lg">
                  <img
                    src={category.image}
                    alt={category.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 font-serif">
                Available Models in {category.name} ({products.length})
              </h2>
            </div>

            {products.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-600 font-medium">
                  No standard models listed under this category yet. We accept custom OEM orders based on your technical specs!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
