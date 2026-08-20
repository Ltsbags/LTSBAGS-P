'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { SlidersHorizontal, X, Trash2, ArrowRight } from 'lucide-react';

interface CompareDockProps {
  selectedProducts: Product[];
  onRemoveProduct: (productId: string) => void;
  onClearAll: () => void;
  onOpenModal: () => void;
}

export default function CompareDock({
  selectedProducts,
  onRemoveProduct,
  onClearAll,
  onOpenModal,
}: CompareDockProps) {
  if (selectedProducts.length === 0) return null;

  const maxCompare = 3;
  const emptySlotsCount = maxCompare - selectedProducts.length;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl bg-slate-900/95 dark:bg-slate-950/95 text-white backdrop-blur-md border border-slate-700 dark:border-slate-800 shadow-2xl rounded-2xl p-3 sm:p-4 transition-all animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        
        {/* Left Status & Previews */}
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <div className="shrink-0 flex items-center gap-2 pr-2 border-r border-slate-700/80">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center font-bold">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">
                Compare Bags
              </p>
              <p className="text-[10px] text-sky-400 font-mono font-bold">
                {selectedProducts.length} / {maxCompare} Selected
              </p>
            </div>
          </div>

          {/* Selected Product Thumbnails */}
          <div className="flex items-center gap-2">
            {selectedProducts.map((prod) => (
              <div
                key={prod.id}
                className="group relative flex items-center gap-2 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl p-1.5 pr-3 shrink-0 max-w-[180px] sm:max-w-[200px]"
              >
                <img
                  src={prod.images?.[0] || 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=200'}
                  alt={prod.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-lg object-cover bg-slate-700 shrink-0"
                />
                <span className="text-xs font-semibold text-slate-200 truncate leading-tight">
                  {prod.name}
                </span>
                <button
                  onClick={() => onRemoveProduct(prod.id)}
                  className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 transition-colors shrink-0 ml-auto"
                  title="Remove from comparison"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Empty Placeholders */}
            {Array.from({ length: emptySlotsCount }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="hidden md:flex items-center justify-center border border-dashed border-slate-700/80 rounded-xl p-2 h-11 w-28 text-[11px] text-slate-500 font-mono shrink-0"
              >
                + Add bag
              </div>
            ))}
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
          <button
            onClick={onClearAll}
            className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5 rounded-lg hover:bg-slate-800"
            title="Clear all selected bags"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <button
            onClick={onOpenModal}
            className="flex-1 sm:flex-initial bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>View Comparison Table</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
