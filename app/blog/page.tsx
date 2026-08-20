import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { db } from '@/lib/db';
import { generatePageMetadata } from '@/lib/seo';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';

export const metadata = generatePageMetadata({
  title: 'B2B Custom Bag Manufacturing Blog & Guides | ApexBags',
  description: 'Expert guides on corporate bag sourcing, fabric durability (1680D vs 600D), quality control inspection standards, and custom branding trends.',
  path: '/blog',
});

export default function BlogListPage() {
  const blogs = db.getBlogs();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        
        {/* Banner */}
        <section className="bg-slate-900 text-white py-14 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={[{ name: 'B2B Blog', url: '/blog' }]} />
            <div className="mt-3 max-w-3xl space-y-2">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-widest font-mono bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Industry & Sourcing Knowledge
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-serif text-white">
                Bag Manufacturing & Sourcing Insights
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed">
                Technical articles, fabric breakdown guides, and factory quality control best practices written by our senior bag design engineers.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <article
                  key={blog.id}
                  className="bg-white rounded-xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <Link href={`/blog/${blog.slug}`} className="aspect-16/9 overflow-hidden bg-slate-100 relative group">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                        {blog.category}
                      </span>
                      <Link href={`/blog/${blog.slug}`}>
                        <h2 className="font-bold text-slate-900 text-lg hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
                          {blog.title}
                        </h2>
                      </Link>
                      <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                        {blog.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        {new Date(blog.publishedAt).toLocaleDateString()}
                      </span>
                      <Link
                        href={`/blog/${blog.slug}`}
                        className="text-amber-700 font-bold hover:underline flex items-center gap-1"
                      >
                        Read Post <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
