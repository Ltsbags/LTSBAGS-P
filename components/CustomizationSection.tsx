'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Palette, 
  Sparkles, 
  Layers, 
  Printer, 
  Ruler, 
  Award, 
  ShieldCheck, 
  Tag, 
  Package, 
  Send,
  ArrowRight,
  Sliders,
  Scissors,
  CheckCircle2
} from 'lucide-react';
import QuoteModal from './QuoteModal';

export default function CustomizationSection() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const options = [
    {
      title: 'Custom Bag Silhouette & Design',
      description: 'Bespoke pattern drafting tailored to your brand blueprint, CAD drawings, or reference samples.',
      icon: Scissors,
    },
    {
      title: 'Custom Dimensions & Capacity',
      description: 'Engineered volume (15L to 55L) with specific laptop cradle sizing (14", 15.6", 17") and organizer pockets.',
      icon: Ruler,
    },
    {
      title: 'Specialized Material Sourcing',
      description: 'Heavy 1680D nylon, 1000D Cordura, organic cotton canvas, jute, ripstop, and premium PU vegan leather.',
      icon: Layers,
    },
    {
      title: 'Pantone Color Matching',
      description: 'Exact Pantone fabric dye matching for outer panels, internal lining, trims, and webbing straps.',
      icon: Palette,
    },
    {
      title: 'High-Definition Screen Printing',
      description: 'Crisp multi-color silk screen printing using durable, non-cracking plastisol or water-based eco inks.',
      icon: Printer,
    },
    {
      title: '3D High-Density Embroidery',
      description: 'Multi-head computerized embroidery delivering raised 3D thread branding for corporate logos.',
      icon: Sparkles,
    },
    {
      title: 'Molded Rubber / Silicone Badges',
      description: 'Waterproof 3D raised silicone patches with perimeter stitch grooves sewn onto the exterior.',
      icon: Award,
    },
    {
      title: 'Debossed Leather Patches',
      description: 'Heat-pressed debossing on genuine or vegan leatherette for executive and premium bag lines.',
      icon: Tag,
    },
    {
      title: 'Woven & Satin Brand Labels',
      description: 'High-thread count woven side tags, satin inner care labels, and customized origin flags.',
      icon: Sliders,
    },
    {
      title: 'Custom Heavy-Duty Zippers',
      description: 'Waterproof PU-coated reverse coil zippers, heavy nylon coil #8/#10, and genuine YKK metal zips.',
      icon: ShieldCheck,
    },
    {
      title: 'Branded Metal & Rubber Pullers',
      description: 'Laser-engraved metal alloy sliders and custom molded rubber pullers with your logo.',
      icon: Tag,
    },
    {
      title: 'B2B Retail & Gift Packaging',
      description: 'Custom branded polybags, full-color presentation boxes, retail hangtags, and barcode stickers.',
      icon: Package,
    },
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-[#72AFDB] font-bold text-xs uppercase tracking-widest font-mono bg-[#72AFDB]/10 px-3.5 py-1 rounded-full border border-[#72AFDB]/30">
            Customization Spectrum
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            12 Customization Options for Your Bags
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Customize every millimeter: fabric, hardware, zippers, logo execution, interior organization, and retail packaging.
          </p>
        </div>

        {/* 12 Customization Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-14">
          {options.map((opt, idx) => {
            const Icon = opt.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-[#72AFDB] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-[#72AFDB]/10 flex items-center justify-center text-[#72AFDB] group-hover:bg-[#72AFDB] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      Option {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base group-hover:text-[#72AFDB] transition-colors">
                      {opt.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs mt-2 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1 text-[11px] text-[#72AFDB] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Factory In-House</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Bar */}
        <div className="bg-[#1E293B] text-white rounded-2xl p-8 sm:p-10 border border-slate-700/80 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[#72AFDB] text-xs font-bold font-mono uppercase tracking-wider">
              Need a Custom Bag Prototype?
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-sans">
              Discuss Your Custom Bag Requirement
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Send us your logo artwork and preferred bag specifications to receive a direct factory quotation and pre-production sample timeline.
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
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold text-sm px-6 py-3.5 rounded-xl transition-all flex items-center gap-1.5"
            >
              <span>Full Customization Page</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        preselectedProduct="Custom Bag Branding & Design"
      />
    </section>
  );
}
