'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { 
  X, 
  Trash2, 
  Layers, 
  ShieldCheck, 
  Package, 
  Check, 
  Printer, 
  Copy, 
  SlidersHorizontal,
  ExternalLink,
  Plus
} from 'lucide-react';

interface ProductCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRemoveProduct: (productId: string) => void;
  onClearAll: () => void;
  onEnquire: (productName: string) => void;
}

export default function ProductCompareModal({
  isOpen,
  onClose,
  products,
  onRemoveProduct,
  onClearAll,
  onEnquire,
}: ProductCompareModalProps) {
  const [highlightDifferences, setHighlightDifferences] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Extract all unique specification keys across all selected products
  const specKeys = useMemo(() => {
    const keysSet = new Set<string>();
    products.forEach((p) => {
      p.specifications?.forEach((spec) => {
        if (spec.label) {
          keysSet.add(spec.label.trim());
        }
      });
    });
    return Array.from(keysSet);
  }, [products]);

  // Map product specs for easy key lookup
  const getSpecValue = (product: Product, labelKey: string): string => {
    const found = product.specifications?.find(
      (s) => s.label.trim().toLowerCase() === labelKey.toLowerCase()
    );
    return found ? found.value : '—';
  };

  // Helper to check if row values differ across selected products
  const isRowDifferent = (getValueFn: (p: Product) => string): boolean => {
    if (products.length <= 1) return false;
    const firstVal = getValueFn(products[0]).toLowerCase().trim();
    return products.some((p) => getValueFn(p).toLowerCase().trim() !== firstVal);
  };

  const handleCopySummary = () => {
    if (products.length === 0) return;
    const summaryText = products
      .map(
        (p) =>
          `*${p.name}*\n` +
          `- Category: ${p.categoryName || 'Custom Bags'}\n` +
          `- MOQ: ${p.moq} Units\n` +
          `- Material: ${p.materials}\n` +
          p.specifications.map((s) => `- ${s.label}: ${s.value}`).join('\n')
      )
      .join('\n\n---\n\n');

    navigator.clipboard.writeText(`LTS BAGS PRIVATE LIMITED - Product Specification Comparison:\n\n${summaryText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="bg-white dark:bg-slate-900 w-full max-w-6xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden text-slate-800 dark:text-slate-100 my-auto">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <SlidersHorizontal className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-serif tracking-tight">
                Side-by-Side Product Comparison
              </h2>
              <span className="bg-sky-600 text-white font-bold text-xs px-2.5 py-0.5 rounded-full font-mono">
                {products.length} / 3 Bags
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Compare materials, MOQs, capacity, dimensions, and custom branding specifications for corporate wholesale sourcing.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {products.length > 0 && (
              <>
                <button
                  onClick={handleCopySummary}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                  title="Copy comparison summary text"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors hidden sm:flex"
                  title="Print specifications table"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <button
                  onClick={onClearAll}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 text-xs font-semibold flex items-center gap-1.5 border border-rose-800/80 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors ml-auto sm:ml-0"
              aria-label="Close comparison modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Highlight Differences Control Bar */}
        {products.length > 1 && (
          <div className="px-6 py-2.5 bg-slate-100 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-medium shrink-0">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={highlightDifferences}
                onChange={(e) => setHighlightDifferences(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300 dark:border-slate-700"
              />
              <span className="text-slate-700 dark:text-slate-200 font-semibold">
                Highlight Differing Specifications
              </span>
            </label>
            <span className="text-slate-500 text-[11px]">
              {highlightDifferences ? 'Differences highlighted in subtle blue' : 'Standard view'}
            </span>
          </div>
        )}

        {/* Modal Body: Comparison Table */}
        <div className="p-4 sm:p-6 overflow-x-auto overflow-y-auto flex-1">
          {products.length === 0 ? (
            <div className="py-16 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-serif">
                No Bags Selected for Comparison
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Browse our product catalog and click <strong>&quot;+ Compare&quot;</strong> on up to 3 bags to view their technical specifications side-by-side.
              </p>
              <button
                onClick={onClose}
                className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors inline-flex items-center gap-2"
              >
                <span>Browse Products</span>
              </button>
            </div>
          ) : (
            <table className="w-full border-collapse text-left text-xs min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  {/* Sticky Spec Header Column */}
                  <th className="p-3 w-40 sm:w-52 bg-slate-50 dark:bg-slate-950 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                    Model Overview
                  </th>

                  {/* Product Columns */}
                  {products.map((p) => (
                    <th key={p.id} className="p-3 align-top min-w-[220px] max-w-[280px]">
                      <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-3 relative group">
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => onRemoveProduct(p.id)}
                          className="absolute top-2 right-2 p-1 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-500 hover:text-white transition-colors"
                          title="Remove from comparison"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        {/* Image */}
                        <div className="aspect-4/3 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 relative">
                          <img
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=600'}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Title & Link */}
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800 inline-block mb-1">
                            {p.categoryName || 'Custom Bags'}
                          </span>
                          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug line-clamp-2">
                            {p.name}
                          </h4>
                        </div>

                        {/* Quick Quote CTA */}
                        <div className="pt-2 flex flex-col gap-1.5">
                          <button
                            onClick={() => {
                              onClose();
                              onEnquire(p.name);
                            }}
                            className="w-full py-2 px-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <Package className="w-3.5 h-3.5" />
                            <span>Enquire Bulk Quote</span>
                          </button>

                          <Link
                            href={`/product/${p.slug}`}
                            onClick={onClose}
                            className="w-full py-1.5 text-center text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 text-[11px] font-semibold flex items-center justify-center gap-1 hover:underline"
                          >
                            <span>Full Details Page</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>

                      </div>
                    </th>
                  ))}

                  {/* Empty Column Placeholder if < 3 */}
                  {products.length < 3 && (
                    <th className="p-3 align-top min-w-[200px]">
                      <div className="h-full min-h-[260px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2 text-slate-400 dark:text-slate-600">
                        <Plus className="w-8 h-8 opacity-60" />
                        <span className="text-xs font-semibold">Select 1 More Bag</span>
                        <p className="text-[10px] text-slate-400">
                          Add another bag model from catalog to compare specifications side-by-side.
                        </p>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-normal">
                
                {/* ROW: MOQ */}
                <tr className={highlightDifferences && isRowDifferent((p) => String(p.moq)) ? 'bg-amber-50 dark:bg-sky-950/40' : ''}>
                  <td className="p-3 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/80 dark:bg-slate-950/60 border-r border-slate-200 dark:border-slate-800">
                    Minimum Order Quantity (MOQ)
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="p-3 align-middle font-bold text-slate-900 dark:text-slate-100">
                      <span className="inline-block bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200 px-2.5 py-1 rounded-md text-xs border border-sky-300/80 dark:border-sky-700/80">
                        {p.moq} Units Batch
                      </span>
                    </td>
                  ))}
                  {products.length < 3 && <td className="p-3 text-slate-400">—</td>}
                </tr>

                {/* ROW: Materials */}
                <tr className={highlightDifferences && isRowDifferent((p) => p.materials) ? 'bg-amber-50 dark:bg-sky-950/40' : ''}>
                  <td className="p-3 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/80 dark:bg-slate-950/60 border-r border-slate-200 dark:border-slate-800">
                    Primary Materials & Fabric
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="p-3 align-top leading-relaxed text-slate-700 dark:text-slate-300">
                      <div className="flex items-start gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                        <span>{p.materials}</span>
                      </div>
                    </td>
                  ))}
                  {products.length < 3 && <td className="p-3 text-slate-400">—</td>}
                </tr>

                {/* ROW: Short Description */}
                <tr>
                  <td className="p-3 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/80 dark:bg-slate-950/60 border-r border-slate-200 dark:border-slate-800">
                    Model Summary
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="p-3 align-top leading-relaxed text-slate-600 dark:text-slate-300">
                      {p.shortDesc}
                    </td>
                  ))}
                  {products.length < 3 && <td className="p-3 text-slate-400">—</td>}
                </tr>

                {/* DYNAMIC TECHNICAL SPECIFICATIONS ROWS */}
                {specKeys.length > 0 && (
                  <tr>
                    <td
                      colSpan={products.length + (products.length < 3 ? 2 : 1)}
                      className="p-3 bg-slate-900 text-white font-bold text-xs font-serif uppercase tracking-wider"
                    >
                      Technical & Dimensional Specifications
                    </td>
                  </tr>
                )}

                {specKeys.map((key) => {
                  const differs = isRowDifferent((p) => getSpecValue(p, key));
                  return (
                    <tr
                      key={key}
                      className={highlightDifferences && differs ? 'bg-amber-50 dark:bg-sky-950/40' : ''}
                    >
                      <td className="p-3 font-semibold text-slate-700 dark:text-slate-300 bg-slate-50/80 dark:bg-slate-950/60 border-r border-slate-200 dark:border-slate-800">
                        {key}
                      </td>
                      {products.map((p) => {
                        const val = getSpecValue(p, key);
                        return (
                          <td key={p.id} className="p-3 align-top font-medium text-slate-800 dark:text-slate-200">
                            {val}
                          </td>
                        );
                      })}
                      {products.length < 3 && <td className="p-3 text-slate-400">—</td>}
                    </tr>
                  );
                })}

                {/* ROW: Features */}
                <tr>
                  <td className="p-3 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/80 dark:bg-slate-950/60 border-r border-slate-200 dark:border-slate-800 align-top">
                    Key Features
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="p-3 align-top space-y-1.5">
                      {p.features?.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </td>
                  ))}
                  {products.length < 3 && <td className="p-3 text-slate-400">—</td>}
                </tr>

                {/* ROW: Bottom Quote CTA */}
                <tr>
                  <td className="p-3 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/80 dark:bg-slate-950/60 border-r border-slate-200 dark:border-slate-800">
                    Bulk Factory Order
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="p-3 align-middle">
                      <button
                        onClick={() => {
                          onClose();
                          onEnquire(p.name);
                        }}
                        className="w-full py-2 px-3 bg-slate-900 dark:bg-sky-600 hover:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Request Bulk Quote</span>
                      </button>
                    </td>
                  ))}
                  {products.length < 3 && <td className="p-3 text-slate-400">—</td>}
                </tr>

              </tbody>
            </table>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>
            Need custom factory modifications? We support OEM/ODM technical drawings and custom branding badges.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 text-white hover:bg-slate-700 font-bold rounded-lg transition-colors"
          >
            Close Table
          </button>
        </div>

      </div>
    </div>
  );
}
