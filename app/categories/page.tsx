import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SchemaScript from '@/components/SchemaScript';
import { db } from '@/lib/db';
import { generatePageMetadata } from '@/lib/seo';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = generatePageMetadata({
  title: 'Explore Bag Categories | LTS BAGS PRIVATE LIMITED',
  description: 'Browse complete B2B bag categories including Backpacks, Duffle Bags, Jute Bags, Laptop Bags, Tote Bags, Sling Bags, School Bags, Travel Bags, Office Bags, and Sports Bags.',
  path: '/categories',
});

export default function CategoriesPage() {
  const categories = db.getCategories();

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-slate-950 text-[#333333] dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-[#333333] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#67B0DF]/20 border border-[#67B0DF]/40 text-[#67B0DF] font-mono text-xs uppercase tracking-widest font-bold">
              <Layers className="w-4 h-4 text-[#67B0DF]" />
              OUR COLLECTION
            </span>
            <h1 className="text-3xl sm:text-5xl font-black font-sans tracking-tight">
              EXPLORE OUR BAG CATEGORIES
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Direct factory manufacturing across 10 specialized bag categories. Customized with your logo, colors, and material specifications for bulk wholesale orders.
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-[#67B0DF] dark:hover:border-[#67B0DF] transition-all duration-300 shadow-xs hover:shadow-xl flex flex-col overflow-hidden group"
              >
                <div className="aspect-16/10 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h2 className="text-xl font-bold font-sans group-hover:text-[#67B0DF] transition-colors">
                      {cat.name}
                    </h2>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-[#A7A7A7] dark:text-slate-400 text-xs leading-relaxed line-clamp-3">
                    {cat.description}
                  </p>

                  <Link
                    href={`/category/${cat.slug}`}
                    className="w-full bg-[#F2F8FC] dark:bg-slate-800 hover:bg-[#67B0DF] text-[#67B0DF] hover:text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:bg-[#67B0DF] group-hover:text-white"
                  >
                    <span>View Collection</span>
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
