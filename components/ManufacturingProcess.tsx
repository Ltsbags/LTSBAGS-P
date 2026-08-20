'use client';

import React from 'react';
import Link from 'next/link';
import { 
  PencilRuler, 
  Layers, 
  Scissors, 
  Printer, 
  ShieldCheck, 
  Package, 
  Truck, 
  Factory,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function ManufacturingProcess() {
  const steps = [
    {
      stepNumber: '01',
      title: 'Design & Tech Pack',
      description: 'Review dimensions, compartments, 2D/3D mockups, and CAD pattern specifications.',
      icon: PencilRuler,
    },
    {
      stepNumber: '02',
      title: 'Material Selection',
      description: 'Sourcing 1680D nylon, organic canvas, PU leatherette, YKK zips, and metal buckles.',
      icon: Layers,
    },
    {
      stepNumber: '03',
      title: 'Precision Cutting',
      description: 'Multi-layer CNC fabric laser cutting ensuring exact dimensional consistency across the batch.',
      icon: Scissors,
    },
    {
      stepNumber: '04',
      title: 'Heavy-Duty Stitching',
      description: 'Direct-drive sewing, high seam-density stitching, and computerized bar-tack reinforcement.',
      icon: Factory,
    },
    {
      stepNumber: '05',
      title: 'Branding & Printing',
      description: '3D high-density embroidery, silk screen printing, debossed leather patches, or rubber badges.',
      icon: Printer,
    },
    {
      stepNumber: '06',
      title: 'Quality Control',
      description: '100% in-line and pre-dispatch inspection for seam strength, zipper action, and load testing.',
      icon: ShieldCheck,
    },
    {
      stepNumber: '07',
      title: 'Packaging & Tagging',
      description: 'Polybag packaging, silica moisture absorbers, custom client hangtags, and master cartons.',
      icon: Package,
    },
    {
      stepNumber: '08',
      title: 'Dispatch & Logistics',
      description: 'Door-to-door domestic transport across India and air/sea global export freight.',
      icon: Truck,
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-[#72AFDB] font-bold text-xs uppercase tracking-widest font-mono bg-[#72AFDB]/10 px-3.5 py-1 rounded-full border border-[#72AFDB]/30">
            Production Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            Our 8-Step Bag Manufacturing Process
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            From technical design and raw material sourcing to automated cutting, heavy stitching, and final dispatch from our Mumbai plant.
          </p>
        </div>

        {/* 8 Step Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.stepNumber}
                className="relative bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 hover:border-[#72AFDB] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-black text-[#72AFDB] group-hover:scale-110 transition-transform">
                      {step.stepNumber}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-xs group-hover:bg-[#72AFDB] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base font-sans group-hover:text-[#72AFDB] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs mt-2 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-[#72AFDB] font-semibold flex items-center justify-between">
                  <span>Factory Stage {step.stepNumber}</span>
                  <span className="text-slate-400 font-mono">Mumbai Plant</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Link to Full Manufacturing Page */}
        <div className="mt-12 text-center">
          <Link
            href="/manufacturing"
            className="inline-flex items-center gap-2 text-[#72AFDB] hover:text-[#5C9BC7] font-bold text-sm hover:underline"
          >
            <span>Explore In-Depth Factory Quality Standards &amp; Technical Capabilities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
