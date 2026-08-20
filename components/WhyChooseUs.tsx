'use client';

import React from 'react';
import { 
  Building2, 
  DollarSign, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Sparkles,
  Truck,
  Clock,
  CheckCircle2,
  Headphones,
  FileCheck
} from 'lucide-react';
import { HomepageFeature } from '@/lib/types';

interface WhyChooseUsProps {
  initialFeatures?: HomepageFeature[];
  title?: string;
  subtitle?: string;
}

export default function WhyChooseUs({ initialFeatures, title, subtitle }: WhyChooseUsProps) {
  const verifiedFeatures = [
    {
      title: 'Direct Factory Pricing',
      description: 'Transparent bulk pricing directly from our Mumbai manufacturing unit with zero middlemen commission.',
      icon: DollarSign,
    },
    {
      title: 'Custom Branding & OEM/ODM',
      description: 'Full customization: 3D embroidery, debossed leather patches, rubber badges, screen printing, and custom zipper pullers.',
      icon: Sparkles,
    },
    {
      title: 'Configurable MOQ Options',
      description: 'Order quantities configured per product requirement starting from 50 to 100 units for corporate programs.',
      icon: Zap,
    },
    {
      title: 'Tested Raw Materials',
      description: 'Sourcing 1680D ballistic nylon, organic canvas, PU leatherette, YKK zippers, and water-repellent coatings.',
      icon: Layers,
    },
    {
      title: 'In-House Quality Inspection',
      description: 'Thorough in-line and pre-dispatch inspection covering seam tensile strength, zipper pull stress, and load testing.',
      icon: ShieldCheck,
    },
    {
      title: 'Physical Sample Prototyping',
      description: 'Pre-production golden sample approval before full bulk manufacturing to guarantee exact specifications.',
      icon: FileCheck,
    },
    {
      title: 'Pan-India & Export Logistics',
      description: 'Safe carton packaging with door-to-door domestic transport across India and international freight forwarding.',
      icon: Truck,
    },
    {
      title: 'Dedicated B2B Support',
      description: 'Direct communication with production estimators for technical tech packs, artwork scaling, and delivery updates.',
      icon: Headphones,
    },
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-[#72AFDB] font-bold text-xs uppercase tracking-widest font-mono bg-[#72AFDB]/10 px-3.5 py-1 rounded-full border border-[#72AFDB]/30">
            Manufacturing Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            {title || 'Why Choose LTS Bags Factory?'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            {subtitle || 'Built on transparent B2B communication, proven raw material sourcing, and dedicated factory-floor quality assurance.'}
          </p>
        </div>

        {/* 8 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {verifiedFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-[#72AFDB] transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#72AFDB]/10 flex items-center justify-center text-[#72AFDB] group-hover:bg-[#72AFDB] group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base group-hover:text-[#72AFDB] transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs mt-2 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Factory Verified</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
