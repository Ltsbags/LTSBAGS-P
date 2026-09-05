import React from 'react';
import Link from 'next/link';
import { Layers, ArrowRight, ShieldCheck } from 'lucide-react';
import { SEO_MATERIALS } from '@/lib/programmatic-seo/data/materials';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'Custom Bag Materials & Fabrics Guide | Manufacturing Specifications | LTS BAGS',
  description: 'Explore industrial bag fabrics: 1680D Ballistic Nylon, 900D Cordura, heavy cotton canvas, vegan PU leatherette, eco-jute, and ripstop polyester.',
  path: '/materials',
});

export default function MaterialsHubPage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
            TECHNICAL FABRIC SOURCING
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Custom Bag Fabrics & Raw Materials
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            From high-tensile ballistic ballistic nylon for enterprise tech gear to natural biodegradable cotton canvas for retail brands, we source certified grade-A textiles for custom bag manufacturing.
          </p>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SEO_MATERIALS.map((mat) => (
            <div
              key={mat.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    CERTIFIED TEXTILE
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {mat.name}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {mat.material_characteristics}
                </p>

                <div className="pt-2 space-y-1 text-xs">
                  <div className="text-slate-500 dark:text-slate-400 font-semibold">Durability Rating:</div>
                  <div className="text-slate-800 dark:text-slate-200 font-medium">
                    {mat.durability}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  Custom Dyeing & Specs
                </span>
                <Link
                  href={`/materials/${mat.slug}`}
                  className="font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <span>View Material Specs</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
