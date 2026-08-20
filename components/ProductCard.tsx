'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { useLanguage } from '@/components/LanguageProvider';
import { Package, ArrowRight, ShieldCheck, Layers, SlidersHorizontal, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onEnquire?: (productName: string) => void;
  isCompared?: boolean;
  onToggleCompare?: (product: Product) => void;
  compareDisabled?: boolean;
}

export default function ProductCard({
  product,
  onEnquire,
  isCompared = false,
  onToggleCompare,
  compareDisabled = false,
}: ProductCardProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=800';

  const handleEnquireClick = () => {
    if (onEnquire) {
      onEnquire(product.name);
    } else {
      router.push(`/contact?product=${encodeURIComponent(product.name)}`);
    }
  };

  return (
    <div
      className={`group bg-white dark:bg-slate-900 rounded-xl border shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative ${
        isCompared
          ? 'border-sky-500 ring-2 ring-sky-500/80 dark:ring-sky-400/80'
          : 'border-slate-200/90 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500'
      }`}
    >
      
      {/* Featured Badge */}
      {product.isFeatured && (
        <span className="absolute top-3 left-3 z-10 bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-xs text-sky-400 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md border border-sky-500/30">
          {t('hero.badge', 'Featured B2B')}
        </span>
      )}

      {/* MOQ Badge */}
      <span className="absolute top-3 right-3 z-10 bg-sky-600 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
        {t('common.moq', 'MOQ')}: {product.moq} {t('common.units', 'Units')}
      </span>

      {/* Product Image Container */}
      <Link href={`/product/${product.slug}`} className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-800 block">
        <Image
          src={primaryImage}
          alt={product.imageAltText || product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          referrerPolicy="no-referrer"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <span className="text-white text-xs font-bold flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/20">
            {t('common.viewDetails', 'View Specifications')} <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
          </span>
        </div>
      </Link>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Top Bar: Category Name + Compare Button */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/80 px-2.5 py-0.5 rounded-md inline-block border border-sky-200/60 dark:border-sky-800/80 truncate">
              {product.categoryName || 'Custom Bags'}
            </span>

            {/* Compare Toggle Button */}
            {onToggleCompare && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleCompare(product);
                }}
                disabled={!isCompared && compareDisabled}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider transition-all shrink-0 ${
                  isCompared
                    ? 'bg-sky-600 text-white shadow-xs'
                    : compareDisabled
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {isCompared ? (
                  <>
                    <Check className="w-3 h-3 text-white" />
                    <span>{t('common.comparing', 'Comparing')}</span>
                  </>
                ) : (
                  <>
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>{t('common.addCompare', '+ Compare')}</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Short Desc */}
          <p className="text-slate-600 dark:text-slate-300 text-xs mt-2 line-clamp-2 leading-relaxed">
            {product.shortDesc}
          </p>
        </div>

        {/* Material Specs Bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <Layers className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
            <span className="truncate font-medium"><strong className="text-slate-700 dark:text-slate-200">{t('common.materials', 'Material')}:</strong> {product.materials}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 font-medium bg-emerald-50/80 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-100 dark:border-emerald-900/50">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{t('common.customBranding', 'Custom Branding & Logo')}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="flex-1 py-2 px-3 border border-slate-300 dark:border-slate-700 hover:border-slate-800 dark:hover:border-slate-300 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-lg text-center transition-colors"
          >
            {t('common.viewDetails', 'Specs & Details')}
          </Link>
          <button
            onClick={handleEnquireClick}
            className="flex-1 py-2 px-3 bg-slate-900 dark:bg-sky-600 hover:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1"
          >
            <Package className="w-3.5 h-3.5" />
            {t('common.requestBulkQuote', 'Enquire Now')}
          </button>
        </div>

      </div>
    </div>
  );
}
