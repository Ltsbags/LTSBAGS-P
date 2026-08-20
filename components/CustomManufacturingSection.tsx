'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  GraduationCap, 
  ShoppingBag, 
  Trophy, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Layers,
  Printer,
  ShieldCheck,
  Send
} from 'lucide-react';
import QuoteModal from './QuoteModal';

export default function CustomManufacturingSection() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const sectors = [
    {
      title: 'Corporate Gifting & IT Onboarding',
      description: 'Custom laptop backpacks, executive briefcases, and employee welcome kit bags branded with your corporate logo.',
      icon: Building2,
      badge: 'B2B Corporate',
      features: ['Padded 15.6" Laptop Cradle', '3D Metal/Rubber Logo Badges', 'TSA-Friendly Compartments', 'Custom Internal Linings'],
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Educational Institutions & Schools',
      description: 'Heavy-duty school bags, university backpacks, and student bookbags engineered for daily load and long durability.',
      icon: GraduationCap,
      badge: 'Institutional',
      features: ['Reinforced Bar-Tack Seams', 'Water-Repellent Polyester', 'Custom School Crest Embroidery', 'High-Density Sponge Backing'],
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Retail Brands & Private Labels',
      description: 'OEM & ODM bespoke bags produced to exact tech packs with custom hardware, woven labels, and retail packaging.',
      icon: ShoppingBag,
      badge: 'Retail OEM',
      features: ['Custom Fabric Weaving', 'Embossed Hardware & Pullers', 'Retail Hangtags & Barcodes', 'Pre-Production Golden Samples'],
      image: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Sports Academies & Travel Events',
      description: 'Athletic kit bags, ventilated gym duffels, and travel luggage holdalls engineered for teams, clubs, and tours.',
      icon: Trophy,
      badge: 'Sports & Travel',
      features: ['Isolated Shoe Compartment', 'Wet-Dry Separation Pocket', 'Heavy YKK Zip Pullers', 'Club Sublimation Printing'],
      image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=800',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-[#72AFDB] font-bold text-xs uppercase tracking-widest font-mono bg-[#72AFDB]/10 px-3.5 py-1 rounded-full border border-[#72AFDB]/30">
            Custom Manufacturing (OEM &amp; ODM)
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            Custom Bag Manufacturing for Diverse Sectors
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            From technical specifications and CAD drawings to sample development and bulk factory production, we engineer bags matched to your industry requirements.
          </p>
        </div>

        {/* Sectors 4-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          {sectors.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between hover:border-[#72AFDB] hover:shadow-lg transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#72AFDB]/10 flex items-center justify-center text-[#72AFDB] group-hover:bg-[#72AFDB] group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#72AFDB] bg-[#72AFDB]/10 px-2.5 py-1 rounded-md font-mono border border-[#72AFDB]/20">
                      {sec.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-sans group-hover:text-[#72AFDB] transition-colors">
                      {sec.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                      {sec.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Key Capabilities:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {sec.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setQuoteModalOpen(true)}
                    className="text-[#72AFDB] hover:text-[#5C9BC7] font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>Request Sector Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] text-slate-400 font-mono">MOQ: Configurable</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner with CTA */}
        <div className="bg-[#1E293B] text-white rounded-2xl p-8 sm:p-10 border border-slate-700/80 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[#72AFDB] text-xs font-bold font-mono uppercase tracking-wider">
              Have a Unique Bag Blueprint or Tech Pack?
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-sans">
              From Your CAD Design to Mass Production
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              We provide sample development, material formulation, strict QC inspection, and door-to-door bulk dispatch from our Mumbai manufacturing plant.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setQuoteModalOpen(true)}
              className="bg-[#72AFDB] hover:bg-[#5C9BC7] text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Discuss Custom Requirement</span>
            </button>
            <Link
              href="/customization"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold text-sm px-6 py-3.5 rounded-xl transition-all"
            >
              View Customization Guide
            </Link>
          </div>
        </div>

      </div>

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        preselectedProduct="Custom Bag Manufacturing"
      />
    </section>
  );
}
