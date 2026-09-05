import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, ShieldCheck, Factory, Truck } from 'lucide-react';
import { SEO_LOCATIONS } from '@/lib/programmatic-seo/data/locations';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'Custom Bag Manufacturing Locations Served | Direct from Mumbai Factory',
  description: 'LTS BAGS manufactures custom bags in Dharavi, Mumbai and serves corporate clients, institutions and brands across Mumbai, Delhi NCR, Bangalore, Pune, Hyderabad, and pan-India.',
  path: '/locations',
});

export default function LocationsHubPage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
              PRODUCTION & SUPPLY CORRIDORS
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Custom Bag Manufacturing & Delivery Hubs
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Headquartered in the historic manufacturing district of <b>Dharavi, Mumbai</b>, LTS BAGS PRIVATE LIMITED supplies corporate procurement teams, institutions, and lifestyle brands nationwide with direct factory pricing and express logistics.
          </p>
        </div>

        {/* Manufacturing Headquarters Feature Card */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Factory className="w-3.5 h-3.5" />
                CENTRAL PRODUCTION HEADQUARTERS
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Dharavi, Mumbai Manufacturing Facility & Sample Room
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Floor-G, A341/2/3, Ganesh Sai Kripa CHS, Sant Rohidas Marg, Mukund Nagar, Dharavi, Mumbai 400017. Housing 150+ master artisans, pattern cutting tables, sample development, and bulk export dispatch.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-emerald-400">
                <span>• In-person factory visits welcome</span>
                <span>• Same-day Mumbai sample collection</span>
                <span>• Direct factory wholesale pricing</span>
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link
                href="/custom-backpack-manufacturer-mumbai"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-lg"
              >
                <span>View Mumbai Factory Services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/factory-tour"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all"
              >
                <span>Explore Factory Tour</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Pan-India Delivery Corridors Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Pan-India Commercial Supply Hubs
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Direct Door-to-Door Insured Transport
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SEO_LOCATIONS.map((loc) => (
              <div
                key={loc.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {loc.city}, {loc.state}
                    </span>
                    {loc.is_factory_hq && (
                      <span className="text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                        FACTORY HQ
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Custom Bags for {loc.city}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {loc.local_intro}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 truncate max-w-[170px]">
                    {loc.is_factory_hq ? 'Direct local pickup' : '3-4 day express cargo'}
                  </span>
                  <Link
                    href={`/locations/${loc.slug}`}
                    className="font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>View Hub</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
