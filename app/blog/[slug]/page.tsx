import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import SchemaScript from '@/components/SchemaScript';
import { db } from '@/lib/db';
import { generatePageMetadata, generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo';
import { Calendar, User, Send, ArrowRight, BookOpen } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = db.getBlogBySlug(slug);
  if (!blog) return {};

  return generatePageMetadata({
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.excerpt,
    keywords: blog.metaKeywords,
    path: `/blog/${blog.slug}`,
    image: blog.image,
  });
}

export default async function SingleBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = db.getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const articleSchema = generateArticleSchema(blog);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'B2B Blog', url: '/blog' },
    { name: blog.title, url: `/blog/${blog.slug}` },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <SchemaScript schema={[articleSchema, breadcrumbSchema]} />
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <Breadcrumbs
            items={[
              { name: 'B2B Blog', url: '/blog' },
              { name: blog.title, url: `/blog/${blog.slug}` },
            ]}
          />

          {/* Article Header */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded border border-amber-200">
              {blog.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif leading-tight">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-y border-slate-200 py-3">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <User className="w-4 h-4 text-amber-600" />
                {blog.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-600" />
                Published {new Date(blog.publishedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-16/9 bg-slate-100 shadow-md">
            <img
              src={blog.image}
              alt={blog.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content Body */}
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/90 shadow-sm leading-relaxed text-slate-700 space-y-4 text-sm sm:text-base font-sans whitespace-pre-line">
            {blog.content}
          </div>

          {/* Bottom Call to Action */}
          <div className="bg-slate-900 text-white rounded-2xl p-8 border border-slate-800 shadow-xl space-y-4 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-serif text-amber-400">
                Need Wholesale Custom Bags for Your Brand?
              </h3>
              <p className="text-xs text-slate-300">
                Consult with our factory engineers for material samples and custom logo unit pricing.
              </p>
            </div>
            <Link
              href="/contact"
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-colors inline-flex items-center gap-2 shrink-0 shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>Get Wholesale Quote</span>
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
