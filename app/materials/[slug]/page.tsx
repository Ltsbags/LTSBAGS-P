import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Layers, CheckCircle2, ArrowRight, MessageCircle, FileText, Factory } from 'lucide-react';
import { getSeoMaterial } from '@/lib/programmatic-seo/data/materials';
import { SEO_PRODUCTS } from '@/lib/programmatic-seo/data/products';
import { seoStorage } from '@/lib/programmatic-seo/storage';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const material = getSeoMaterial(slug);
  if (!material) return {};

  return generatePageMetadata({
    title: `Custom ${material.name} Bag Manufacturer in India | Direct Factory | LTS BAGS`,
    description: `Manufacturer of custom ${material.name.toLowerCase()} bags in India. Heavy-duty stitching, custom branding, and direct factory pricing from our Mumbai plant.`,
    path: `/materials/${material.slug}`,
  });
}

export default async function MaterialDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const material = getSeoMaterial(slug);

  if (!material) {
    notFound();
  }

  const allPages = seoStorage.getAllPages();
  const materialPages = allPages.filter(
    (p) => p.material_id === material.id && p.status === 'PUBLISHED'
  );

  const whatsappMessage = encodeURIComponent(
    `Hello LTS BAGS, I am looking for custom bags manufactured in ${material.name}. Please share fabric swatches, pricing, and MOQ.`
  );
  const whatsappUrl = `https://wa.me/919167198755?text=${whatsappMessage}`;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/materials" className="hover:text-primary">Materials</Link>
          <span>/</span>
          <span className="font-semibold text-slate-900 dark:text-white">{material.name}</span>
        </nav>

        {/* Hero Banner */}
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Layers className="w-3.5 h-3.5" />
              <span>FABRIC SPECIFICATION</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <Factory className="w-3.5 h-3.5" />
              <span>IN-HOUSE CUT & SEW</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Custom {material.name} Bag Manufacturing
          </h1>

          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl">
            {material.material_characteristics}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl pt-2 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 font-semibold block">Durability Rating:</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{material.durability}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 font-semibold block">Manufacturing Location:</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">Dharavi, Mumbai Facility</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire for {material.name}</span>
            </a>
            <Link
              href="/request-a-quote"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Request Swatch & Quote</span>
            </Link>
          </div>
        </div>

        {/* Customization Options with this Material */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Branding & Customization Techniques
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {material.customization_options.map((opt, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{opt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Typical Finished Bag Applications
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {material.typical_bag_applications.map((app, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{app}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
