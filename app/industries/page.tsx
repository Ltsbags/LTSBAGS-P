import React from 'react';
import Link from 'next/link';
import { Briefcase, ArrowRight, ShieldCheck, Factory } from 'lucide-react';
import { SEO_INDUSTRIES } from '@/lib/programmatic-seo/data/industries';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'Industry-Specific Custom Bag Manufacturing | B2B OEM Solutions | LTS BAGS',
  description: 'Custom bag manufacturing tailored for IT enterprises, schools, colleges, medical pharma, sports fitness, hospitality, and corporate gifting in India.',
  path: '/industries',
});

export default function IndustriesHubPage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
            SECTOR-SPECIFIC OEM/ODM SOLUTIONS
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Custom Bag Manufacturing by Industry
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Every sector requires distinct tensile strengths, pocket partitions, and branding techniques. LTS BAGS designs and manufactures customized bags aligned with your industry&apos;s specific procurement requirements.
          </p>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SEO_INDUSTRIES.map((ind) => (
            <div
              key={ind.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    B2B OEM SOLUTION
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {ind.name}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {ind.overview}
                </p>

                <div className="pt-2 space-y-1 text-xs">
                  <div className="text-slate-500 dark:text-slate-400 font-semibold">Typical Applications:</div>
                  <div className="text-slate-700 dark:text-slate-300 line-clamp-2">
                    {ind.applications.join(', ')}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  Custom OEM Branding
                </span>
                <Link
                  href={`/industries/${ind.slug}`}
                  className="font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Explore Solutions</span>
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
