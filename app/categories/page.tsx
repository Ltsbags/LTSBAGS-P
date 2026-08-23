import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SchemaScript from '@/components/SchemaScript';
import { db } from '@/lib/db';
import { generatePageMetadata, generateBreadcrumbSchema } from '@/lib/seo';
import { ArrowRight, Layers, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = generatePageMetadata({
  title: 'Explore Bag Categories | LTS BAGS PRIVATE LIMITED',
  description: 'Browse complete B2B bag categories including Backpacks, Laptop & Office Bags, School & College Bags, Travel Bags, Sports & Gym Bags, Corporate & Promotional Bags, Tote & Shopping Bags, Jute & Eco Bags, Sling & Shoulder Bags, Lunch & Utility Bags, and Custom Manufacturing.',
  path: '/categories',
});

export default function CategoriesPage() {
  const categoryHierarchy = db.getCategoryHierarchy();

  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Categories', url: '/categories' },
  ]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-slate-950 text-[#333333] dark:text-slate-100 flex flex-col font-sans transition-colors">
      <SchemaScript schema={breadcrumbs} />
      <Navbar />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#72AFDB]/20 border border-[#72AFDB]/40 text-[#72AFDB] font-mono text-xs uppercase tracking-widest font-bold">
              <Layers className="w-4 h-4 text-[#72AFDB]" />
              OUR COMPLETE HIERARCHY
            </span>
            <h1 className="text-3xl sm:text-5xl font-black font-sans tracking-tight">
              EXPLORE OUR BAG CATEGORIES
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Direct factory manufacturing across 11 specialized bag categories and 50+ subcategories. Custom branding, OEM/ODM solutions, and wholesale rates for schools, corporates, and global exports.
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryHierarchy.map((cat) => (
              <div
                key={cat.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-[#72AFDB] dark:hover:border-[#72AFDB] transition-all duration-300 shadow-xs hover:shadow-xl flex flex-col overflow-hidden group"
              >
                <div className="aspect-16/10 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    referrerPolicy="no-referrer"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h2 className="text-xl font-bold font-sans group-hover:text-[#72AFDB] transition-colors">
                      {cat.name}
                    </h2>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed line-clamp-3">
                    {cat.description}
                  </p>

                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                        Subcategories ({cat.subcategories.length}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/products/${cat.slug}/${sub.slug}`}
                            className="text-[11px] font-medium bg-slate-50 dark:bg-slate-800 hover:bg-[#72AFDB] hover:text-white dark:hover:bg-[#72AFDB] text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md border border-slate-200/80 dark:border-slate-700 transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/products/${cat.slug}`}
                    className="w-full bg-[#F2F8FC] dark:bg-slate-800 hover:bg-[#72AFDB] text-[#72AFDB] hover:text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:bg-[#72AFDB] group-hover:text-white mt-auto"
                  >
                    <span>View Full {cat.name}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
