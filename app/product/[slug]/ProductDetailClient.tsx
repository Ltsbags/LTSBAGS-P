'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import QuoteModal from '@/components/QuoteModal';
import { 
  Package, 
  Send, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  Award, 
  Ruler, 
  Printer, 
  Truck,
  Building2,
  ChevronRight
} from 'lucide-react';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'branding'>('specs');

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=1000'];

  return (
    <div className="space-y-12">
      
      {/* Product Primary Details */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
            <img
              src={images[activeImageIndex]}
              alt={product.imageAltText || product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all duration-300"
            />
            <span className="absolute top-3 right-3 bg-amber-600 text-white font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-md shadow-xs">
              MOQ: {product.moq} Units
            </span>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx ? 'border-amber-600 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Technical Overview & Quote Trigger */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Category */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
                {product.categoryName || 'B2B Custom Bags'}
              </span>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Sample Ready
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif leading-snug">
              {product.name}
            </h1>

            {/* Short Description */}
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {product.shortDesc}
            </p>

            {/* Material & MOQ bar */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600 shrink-0" />
                <span><strong className="text-slate-800">Primary Material:</strong> {product.materials}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-600 shrink-0" />
                <span><strong className="text-slate-800">Minimum Order Quantity (MOQ):</strong> {product.moq} Units (Lower MOQ available for samples)</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600 shrink-0" />
                <span><strong className="text-slate-800">Factory Warranty:</strong> 1 Year Manufacturing Defect Protection</span>
              </div>
            </div>

          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <button
              onClick={() => setQuoteModalOpen(true)}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Send className="w-4 h-4" />
              <span>Request Wholesale Quote & Sample Batch</span>
            </button>
            <p className="text-[11px] text-slate-500 text-center">
              ⚡ Receive official PDF price quote within 24 hours. Factory direct prices.
            </p>
          </div>

        </div>

      </div>

      {/* Tabs: Full Specifications, Features, Branding */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setActiveTab('specs')}
            className={`py-4 px-6 text-xs sm:text-sm font-bold transition-colors border-b-2 ${
              activeTab === 'specs'
                ? 'border-amber-600 text-amber-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`py-4 px-6 text-xs sm:text-sm font-bold transition-colors border-b-2 ${
              activeTab === 'features'
                ? 'border-amber-600 text-amber-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Product Features & Full Description
          </button>
          <button
            onClick={() => setActiveTab('branding')}
            className={`py-4 px-6 text-xs sm:text-sm font-bold transition-colors border-b-2 ${
              activeTab === 'branding'
                ? 'border-amber-600 text-amber-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Custom Branding Options
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8">
          {activeTab === 'specs' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 font-serif">Factory Technical Specifications Table</h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200">
                {product.specifications?.map((spec, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs">
                    <span className="font-bold text-slate-700">{spec.label}</span>
                    <span className="sm:col-span-2 text-slate-600">{spec.value}</span>
                  </div>
                ))}
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs bg-slate-50">
                  <span className="font-bold text-slate-700">Primary Material</span>
                  <span className="sm:col-span-2 text-slate-600">{product.materials}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs">
                  <span className="font-bold text-slate-700">MOQ</span>
                  <span className="sm:col-span-2 text-slate-600">{product.moq} Units</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 font-serif">Full Description</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {product.fullDesc || product.shortDesc}
                </p>
              </div>

              {product.features && product.features.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 font-serif">Key Engineered Features</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 font-serif">Available Custom Branding Solutions</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We offer multiple custom branding techniques depending on your corporate guidelines and target fabric:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <Printer className="w-6 h-6 text-amber-600" />
                  <h4 className="font-bold text-slate-900 text-xs font-serif">High-Density 3D Embroidery</h4>
                  <p className="text-[11px] text-slate-600">Durable stitch embroidery for corporate backpacks and canvas totes.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <Award className="w-6 h-6 text-amber-600" />
                  <h4 className="font-bold text-slate-900 text-xs font-serif">Debossed PU Leather Patch</h4>
                  <p className="text-[11px] text-slate-600">Elegant subtle heat-debossed leather tags for executive briefcases.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <Layers className="w-6 h-6 text-amber-600" />
                  <h4 className="font-bold text-slate-900 text-xs font-serif">Molded Rubber / Silicone Badge</h4>
                  <p className="text-[11px] text-slate-600">3D raised waterproof rubber badge sewn directly onto front panel.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <ShieldCheck className="w-6 h-6 text-amber-600" />
                  <h4 className="font-bold text-slate-900 text-xs font-serif">Silk Screen & Sublimation</h4>
                  <p className="text-[11px] text-slate-600">High precision multi-color screen printing for large promotional runs.</p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <h2 className="text-2xl font-black text-slate-900 font-serif">
            Related Custom Bag Models
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onEnquire={() => {
                  setQuoteModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quote Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        preselectedProduct={product.name}
      />
    </div>
  );
}
