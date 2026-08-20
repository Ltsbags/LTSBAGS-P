'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, ArrowRight, Package, Layers } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ products: any[]; categories: any[] }>({ products: [], categories: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((res) => {
          if (!res.ok) return { products: [], categories: [] };
          return res.json();
        })
        .then((data) => {
          setResults({
            products: data.products || [],
            categories: data.categories || [],
          });
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const currentProducts = query.trim() ? results.products : [];
  const currentCategories = query.trim() ? results.categories : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <Search className="w-5 h-5 text-[#72AFDB] shrink-0 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search custom bags, categories, materials, laptop briefcases..."
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 text-base focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults({ products: [], categories: [] });
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {loading && (
            <div className="py-8 text-center text-slate-500 text-sm">
              Searching LTS BAGS product catalog...
            </div>
          )}

          {!loading && query && currentProducts.length === 0 && currentCategories.length === 0 && (
            <div className="py-8 text-center text-slate-500 text-sm space-y-2">
              <p className="font-semibold text-slate-700 dark:text-slate-300">No matching bag models found for &quot;{query}&quot;</p>
              <p className="text-xs">Try searching for &quot;laptop&quot;, &quot;backpack&quot;, &quot;duffle&quot;, &quot;jute&quot;, or &quot;corporate&quot;</p>
            </div>
          )}

          {/* Category Matches */}
          {currentCategories.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#72AFDB]">
                <Layers className="w-4 h-4" />
                <span>Categories</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-[#F0F7FC] dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 group transition-colors"
                  >
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[#F0F7FC] dark:bg-slate-700 flex items-center justify-center shrink-0">
                        <Layers className="w-5 h-5 text-[#72AFDB]" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#72AFDB] transition-colors truncate">
                        {cat.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{cat.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Product Matches */}
          {currentProducts.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#72AFDB]">
                <Package className="w-4 h-4" />
                <span>Products</span>
              </div>
              <div className="space-y-2">
                {currentProducts.map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/product/${prod.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-[#F0F7FC] dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 group transition-colors"
                  >
                    <img src={prod.featuredImage || prod.images?.[0]} alt={prod.name} className="w-12 h-12 object-cover rounded-lg shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#72AFDB] transition-colors truncate">
                        {prod.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{prod.shortDesc || prod.categoryName}</p>
                    </div>
                    <div className="shrink-0 text-xs font-semibold text-[#72AFDB] flex items-center gap-1">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!query && (
            <div className="py-6 text-center text-slate-400 text-xs space-y-2">
              <p className="font-semibold text-slate-500">Popular B2B Searches:</p>
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                {['Laptop Backpacks', 'Duffle Bags', 'Eco Jute Totes', 'Executive Briefcases', 'School Bags', 'Custom Logo Printing'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-[#F0F7FC] hover:text-[#72AFDB] transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
