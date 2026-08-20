'use client';

import React from 'react';
import { Factory, ShieldCheck, Palette, PackageCheck, Globe2 } from 'lucide-react';

export default function FeatureStrip() {
  const features = [
    {
      icon: Factory,
      title: 'Manufacturer & Exporter',
      subtitle: 'Premium Quality Bags',
    },
    {
      icon: ShieldCheck,
      title: 'Quality Assurance',
      subtitle: 'Best Quality Materials',
    },
    {
      icon: Palette,
      title: 'Customization',
      subtitle: 'Your Design, Our Creation',
    },
    {
      icon: PackageCheck,
      title: 'Bulk Orders',
      subtitle: 'Low MOQ, Best Prices',
    },
    {
      icon: Globe2,
      title: 'Worldwide Shipping',
      subtitle: 'Fast & Safe Delivery',
    },
  ];

  return (
    <section className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 py-6 sm:py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-[#F0F7FC] dark:hover:bg-slate-800/60 transition-colors group"
              >
                <div className="p-3 rounded-xl bg-[#F0F7FC] dark:bg-slate-800 text-[#72AFDB] border border-[#72AFDB]/25 group-hover:scale-105 transition-transform shrink-0">
                  <Icon className="w-6 h-6 text-[#72AFDB]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1E293B] dark:text-slate-100 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#A5A5A5] dark:text-slate-400 mt-0.5 leading-snug">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
