'use client';

import React, { useState } from 'react';
import { 
  Palette, 
  Printer, 
  Ruler, 
  Sliders, 
  CheckCircle2, 
  Send,
  Sparkles,
  Award,
  Layers,
  FileCheck
} from 'lucide-react';
import QuoteModal from './QuoteModal';

export default function CustomizationSection() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const customizationOptions = [
    {
      icon: Sliders,
      title: 'Custom Design',
      description: 'Send us your technical drawings or reference images. Our pattern masters build bespoke prototypes.',
    },
    {
      icon: Printer,
      title: 'Logo Printing & Embroidery',
      description: '3D puff embroidery, HD screen printing, laser metal badges, debossed leatherette, and rubber patches.',
    },
    {
      icon: Palette,
      title: 'Custom Colors',
      description: 'Pantone-matched fabrics, custom dual-tone colorways, contrast zippers, and branded inner linings.',
    },
    {
      icon: Layers,
      title: 'Custom Materials',
      description: '1680D Ballistic Nylon, 600D Polyester, PU Vegan Leather, Organic Cotton Canvas, and Eco Jute.',
    },
    {
      icon: Ruler,
      title: 'Custom Sizes & Compartments',
      description: 'Tailored dimensions for specific laptops, medical devices, corporate gifts, and trade show samples.',
    },
    {
      icon: Award,
      title: 'Private Label & OEM/ODM',
      description: 'Complete white-label manufacturing with customized woven care labels, hangtags, and branded poly packaging.',
    },
  ];

  return (
    <>
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F2F8FC] dark:bg-slate-800 text-[#67B0DF] font-mono text-xs uppercase tracking-widest font-bold border border-[#67B0DF]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#67B0DF]" />
              TAILORED B2B MANUFACTURING
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#333333] dark:text-slate-100 font-sans">
              FULL CUSTOMIZATION & OEM/ODM SERVICES
            </h2>
            <p className="text-[#A7A7A7] dark:text-slate-400 text-sm leading-relaxed">
              Transform your brand vision into tangible high-quality bags. We customize every component from thread density to metal pullers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {customizationOptions.map((opt, i) => {
              const Icon = opt.icon;
              return (
                <div
                  key={i}
                  className="bg-[#F2F8FC] dark:bg-slate-800/80 p-8 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 hover:border-[#67B0DF] dark:hover:border-[#67B0DF] transition-all hover:shadow-lg group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-700 text-[#67B0DF] flex items-center justify-center shadow-xs border border-[#67B0DF]/20 group-hover:bg-[#67B0DF] group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-[#333333] dark:text-slate-100 font-sans">
                      {opt.title}
                    </h3>
                    <p className="text-xs text-[#A7A7A7] dark:text-slate-300 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1.5 text-xs font-semibold text-[#67B0DF]">
                    <CheckCircle2 className="w-4 h-4 text-[#67B0DF]" />
                    <span>Available for Bulk Orders</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Banner */}
          <div className="mt-14 p-8 sm:p-12 rounded-2xl bg-[#333333] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="space-y-2 text-center md:text-left z-10">
              <h3 className="text-2xl sm:text-3xl font-black font-sans">
                Have a Specific Bag Design or Spec Sheet?
              </h3>
              <p className="text-slate-300 text-sm max-w-xl">
                Send us your target logo artwork, fabric preference, dimensions, and quantity. Get a customized factory quote and sample quote within 24 hours.
              </p>
            </div>
            <button
              onClick={() => setQuoteModalOpen(true)}
              className="z-10 shrink-0 bg-[#67B0DF] hover:bg-[#529ecf] text-white font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>REQUEST CUSTOM QUOTE</span>
            </button>
          </div>
        </div>
      </section>

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        preselectedProduct="Custom Bag Order"
      />
    </>
  );
}
