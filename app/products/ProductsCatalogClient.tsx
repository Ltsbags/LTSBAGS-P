'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductCard from '@/components/ProductCard';
import QuoteModal from '@/components/QuoteModal';
import CompareDock from '@/components/CompareDock';
import ProductCompareModal from '@/components/ProductCompareModal';
import { Product, Category } from '@/lib/types';
import { Search, Filter, Package, RefreshCw, SlidersHorizontal } from 'lucide-react';

interface ProductsCatalogClientProps {
  allProducts: Product[];
  categories: Category[];
}

export default function ProductsCatalogClient({ allProducts, categories }: ProductsCatalogClientProps) {
  const [productsList, setProductsList] = useState<Product[]>(allProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [moqFilter, setMoqFilter] = useState<string>('ALL');

  useEffect(() => {
    let active = true;
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (active && Array.isArray(data) && data.length > 0) {
          setProductsList(data);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState('');

  // Comparison state with lazy initializer from localStorage
  const [comparedProducts, setComparedProducts] = useState<Product[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const savedIds = localStorage.getItem('lts_compared_bags');
      if (savedIds) {
        const parsedIds: string[] = JSON.parse(savedIds);
        return allProducts.filter((p) => parsedIds.includes(p.id)).slice(0, 3);
      }
    } catch {
      return [];
    }
    return [];
  });
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [compareLimitNotice, setCompareLimitNotice] = useState<boolean>(false);

  // Sync compare list to localStorage
  const updateComparedProducts = (newList: Product[]) => {
    setComparedProducts(newList);
    try {
      const ids = newList.map((p) => p.id);
      localStorage.setItem('lts_compared_bags', JSON.stringify(ids));
    } catch {
      // Ignore localStorage write errors
    }
  };

  const handleToggleCompare = (product: Product) => {
    const exists = comparedProducts.some((p) => p.id === product.id);
    if (exists) {
      updateComparedProducts(comparedProducts.filter((p) => p.id !== product.id));
    } else {
      if (comparedProducts.length >= 3) {
        setCompareLimitNotice(true);
        setTimeout(() => setCompareLimitNotice(false), 3000);
        return;
      }
      updateComparedProducts([...comparedProducts, product]);
    }
  };

  const handleRemoveCompared = (productId: string) => {
    updateComparedProducts(comparedProducts.filter((p) => p.id !== productId));
  };

  const handleClearCompared = () => {
    updateComparedProducts([]);
  };

  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      const matchesCategory = selectedCategory === 'ALL' || product.categoryId === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.materials.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesMoq = true;
      if (moqFilter === 'LOW') {
        matchesMoq = product.moq <= 100;
      } else if (moqFilter === 'MID') {
        matchesMoq = product.moq > 100 && product.moq <= 300;
      } else if (moqFilter === 'HIGH') {
        matchesMoq = product.moq > 300;
      }

      return matchesCategory && matchesSearch && matchesMoq;
    });
  }, [productsList, selectedCategory, searchQuery, moqFilter]);

  const handleEnquire = (productName: string) => {
    setSelectedProductName(productName);
    setQuoteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 pb-24">
        
        {/* Banner */}
        <section className="bg-slate-900 text-white py-12 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={[{ name: 'Products', url: '/products' }]} />
            <div className="mt-3 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="max-w-3xl space-y-2">
                <span className="text-sky-400 font-bold text-xs uppercase tracking-widest font-mono bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
                  Direct Factory Catalog
                </span>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-serif text-white">
                  B2B Custom Bag Manufacturing Models
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Filter through our range of corporate backpacks, executive briefcases, travel duffels, and eco totes. Select up to 3 bags to compare specifications side-by-side.
                </p>
              </div>

              {/* Comparison Trigger Banner Button */}
              {comparedProducts.length > 0 && (
                <button
                  onClick={() => setIsCompareModalOpen(true)}
                  className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-sky-400/40 shadow-lg flex items-center gap-2 shrink-0 transition-all self-start md:self-auto"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Compare ({comparedProducts.length}/3) Side-by-Side</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-20 z-30 shadow-xs transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              
              {/* Search Field */}
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search bags by model, fabric (e.g. 1680D, canvas), specs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>

              {/* Category Select Mobile / Desktop tabs */}
              <div className="md:col-span-5 flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                    selectedCategory === 'ALL'
                      ? 'bg-slate-900 dark:bg-sky-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  All Categories ({allProducts.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                      selectedCategory === cat.id
                        ? 'bg-slate-900 dark:bg-sky-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* MOQ Filter */}
              <div className="md:col-span-2 flex items-center justify-end gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={moqFilter}
                  onChange={(e) => setMoqFilter(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold py-2 px-2.5 outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-slate-100"
                >
                  <option value="ALL">All MOQ</option>
                  <option value="LOW">Low MOQ (≤100)</option>
                  <option value="MID">Mid MOQ (101-300)</option>
                  <option value="HIGH">High Volume (&gt;300)</option>
                </select>
              </div>

            </div>

            {/* Compare Notification Toast if user attempts 4th bag */}
            {compareLimitNotice && (
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-lg flex items-center justify-between animate-in fade-in duration-200">
                <span>Maximum 3 bags can be compared at once. Please remove a bag from comparison to add another.</span>
                <button
                  onClick={() => setIsCompareModalOpen(true)}
                  className="underline font-bold hover:text-amber-700 dark:hover:text-amber-300 ml-2"
                >
                  View Table →
                </button>
              </div>
            )}

          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-w-lg mx-auto">
                <Package className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-serif">No Bag Models Match Your Filters</h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed px-6">
                  We offer 100% custom bag manufacturing from your technical drawings or reference photos even if not listed in this preview.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSearchQuery('');
                    setMoqFilter('ALL');
                  }}
                  className="bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 text-white font-bold py-2 px-5 rounded-lg text-xs transition-colors inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => {
                  const isCompared = comparedProducts.some((p) => p.id === product.id);
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEnquire={handleEnquire}
                      isCompared={isCompared}
                      onToggleCompare={handleToggleCompare}
                      compareDisabled={comparedProducts.length >= 3 && !isCompared}
                    />
                  );
                })}
              </div>
            )}

          </div>
        </section>

      </main>

      {/* Floating Comparison Bottom Dock */}
      <CompareDock
        selectedProducts={comparedProducts}
        onRemoveProduct={handleRemoveCompared}
        onClearAll={handleClearCompared}
        onOpenModal={() => setIsCompareModalOpen(true)}
      />

      {/* Comparison Modal */}
      <ProductCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        products={comparedProducts}
        onRemoveProduct={handleRemoveCompared}
        onClearAll={handleClearCompared}
        onEnquire={handleEnquire}
      />

      {/* Quote Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        preselectedProduct={selectedProductName}
      />

      <Footer />
    </div>
  );
}

