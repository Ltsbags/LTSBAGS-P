'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { 
  Building2, 
  DollarSign, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Sparkles,
} from 'lucide-react';
import { HomepageFeature } from '@/lib/types';

interface WhyChooseUsProps {
  initialFeatures?: HomepageFeature[];
  title?: string;
  subtitle?: string;
}

export default function WhyChooseUs({ initialFeatures, title: customTitle, subtitle: customSubtitle }: WhyChooseUsProps) {
  const { t } = useLanguage();
  const [features, setFeatures] = useState<HomepageFeature[]>(initialFeatures || [
    {
      title: 'Direct Factory Pricing',
      description: 'No middlemen or trading margins. Sourced directly from our state-of-the-art bag manufacturing facility for maximum cost efficiency.',
      iconName: 'DollarSign',
    },
    {
      title: 'Custom Branding & OEM/ODM',
      description: 'Full customization: 3D embroidered logos, debossed leather patches, rubber badges, screen printing, custom lining & zipper pullers.',
      iconName: 'Sparkles',
    },
    {
      title: 'Low MOQ Flexibility',
      description: 'Flexible order quantities starting from as low as 50 to 100 units per batch for corporate onboarding and boutique launches.',
      iconName: 'Zap',
    },
    {
      title: 'Premium Raw Materials',
      description: 'Heavyweight 1680D Ballistic Nylon, YKK Zippers, Eco-Friendly Organic Canvas, and vegan leatherette with water-repellent coatings.',
      iconName: 'Layers',
    },
    {
      title: 'Strict Quality Assurance',
      description: '100% in-line and post-production AQL 2.5 inspection covering stitching strength, zip pull stress tests, and load testing.',
      iconName: 'ShieldCheck',
    },
    {
      title: 'Global Export & Freight',
      description: 'Timely sea and air freight door-to-door delivery with complete export documentation and customs clearance support.',
      iconName: 'Building2',
    },
  ]);

  const [title, setTitle] = useState(customTitle || '');
  const [subtitle, setSubtitle] = useState(customSubtitle || '');

  useEffect(() => {
    if (!initialFeatures) {
      fetch('/api/settings')
        .then((res) => {
          if (!res.ok) return null;
          return res.json();
        })
        .then((data) => {
          if (data?.homepage?.features && data.homepage.features.length > 0) {
            setFeatures(data.homepage.features);
          }
          if (data?.homepage?.featuresTitle) {
            setTitle(data.homepage.featuresTitle);
          }
          if (data?.homepage?.featuresSubtitle) {
            setSubtitle(data.homepage.featuresSubtitle);
          }
        })
        .catch(() => {
          // Silently retain defaults
        });
    }
  }, [initialFeatures]);

  const displayTitle = title || t('home.whyChooseTitle', 'Built for Corporate Excellence & Wholesale Scalability');
  const displaySubtitle = subtitle || t('home.whyChooseSubtitle', 'We empower corporate buyers, event managers, educational institutions, and brand distributors with high-spec custom bags manufactured to exacting international standards.');

  const getIcon = (iconName?: string, index: number = 0) => {
    const icons = [DollarSign, Sparkles, Zap, Layers, ShieldCheck, Building2];
    if (iconName === 'DollarSign') return DollarSign;
    if (iconName === 'Sparkles') return Sparkles;
    if (iconName === 'Zap') return Zap;
    if (iconName === 'Layers') return Layers;
    if (iconName === 'ShieldCheck') return ShieldCheck;
    if (iconName === 'Building2') return Building2;
    return icons[index % icons.length];
  };

  const getIconColor = (index: number) => {
    const colors = [
      'bg-[#72AFDB]/10 text-[#72AFDB] border-[#72AFDB]/30',
      'bg-[#72AFDB]/15 text-[#5C9BC7] border-[#72AFDB]/40',
      'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700',
      'bg-[#72AFDB]/10 text-[#72AFDB] border-[#72AFDB]/30',
      'bg-[#72AFDB]/15 text-[#5C9BC7] border-[#72AFDB]/40',
      'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700',
    ];
    return colors[index % colors.length];
  };

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 border-y border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-[#72AFDB] font-bold text-xs uppercase tracking-widest font-mono bg-[#72AFDB]/10 px-3.5 py-1 rounded-full border border-[#72AFDB]/30">
            {t('home.whyChooseBadge', 'Why LTS BAGS PRIVATE LIMITED')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            {displayTitle}
          </h2>
          <p className="text-[#A5A5A5] text-sm sm:text-base leading-relaxed">
            {displaySubtitle}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = getIcon(f.iconName, i);
            const colorClass = getIconColor(i);
            return (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-[#72AFDB]/50 transition-all duration-300 space-y-4 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorClass} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-sans group-hover:text-[#72AFDB] transition-colors">
                  {f.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

