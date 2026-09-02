'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Printer, 
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  ChevronLeft,
  RotateCcw,
  ExternalLink,
  Download,
  Info
} from 'lucide-react';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'branding'>('specs');

  // Lightbox modal state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=1200'];

  const currentMainImage = images[activeImageIndex] || images[0];

  const handleOpenLightbox = (index?: number) => {
    if (typeof index === 'number') {
      setActiveImageIndex(index);
    }
    setLightboxZoom(1);
    setPanPosition({ x: 0, y: 0 });
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    setLightboxZoom(1);
    setPanPosition({ x: 0, y: 0 });
  }, []);

  const handleNextImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
    setLightboxZoom(1);
    setPanPosition({ x: 0, y: 0 });
  }, [images.length]);

  const handlePrevImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setLightboxZoom(1);
    setPanPosition({ x: 0, y: 0 });
  }, [images.length]);

  const handleZoomIn = () => {
    setLightboxZoom((prev) => Math.min(prev + 0.5, 3.5));
  };

  const handleZoomOut = () => {
    setLightboxZoom((prev) => {
      const nextZoom = Math.max(prev - 0.5, 1);
      if (nextZoom === 1) setPanPosition({ x: 0, y: 0 });
      return nextZoom;
    });
  };

  const handleResetZoom = () => {
    setLightboxZoom(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleToggleZoom = () => {
    if (lightboxZoom > 1) {
      handleResetZoom();
    } else {
      setLightboxZoom(2);
    }
  };

  // Pan handlers when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (lightboxZoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && lightboxZoom > 1) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseLightbox();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key === '0' || e.key.toLowerCase() === 'r') {
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, handleCloseLightbox, handleNextImage, handlePrevImage]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen]);

  return (
    <div className="space-y-12">
      
      {/* Product Primary Details Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        
        {/* Left Column: Product Main Image & Gallery */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Main Image Viewport with object-fit: contain and neutral background */}
          <div 
            className="product-main-image-container rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-950/80 relative group h-[340px] sm:h-[440px] md:h-[480px] lg:h-[520px] w-full p-4 sm:p-6 flex items-center justify-center select-none shadow-inner"
            style={{ width: '100%' }}
          >
            {/* Subtle background canvas texture for clean visual balance */}
            <div 
              className="absolute inset-0 opacity-25 dark:opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* Complete Uncropped Main Product Image */}
            <img
              src={currentMainImage}
              alt={product.imageAltText || `${product.name} wholesale manufacturer - LTS Bags`}
              referrerPolicy="no-referrer"
              onClick={() => handleOpenLightbox(activeImageIndex)}
              className="product-main-image max-h-full max-w-full relative z-10 cursor-zoom-in transition-transform duration-300 hover:scale-[1.01]"
              style={{
                objectFit: 'contain',
                objectPosition: 'center',
                width: '100%',
                height: '100%',
                maxWidth: '100%',
                maxHeight: '100%',
                display: 'block'
              }}
            />

            {/* MOQ Badge */}
            <span className="absolute top-3 right-3 z-20 bg-amber-600 text-white font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-md shadow-md">
              MOQ: {product.moq} Units
            </span>

            {/* Click to Enlarge / Lightbox Trigger Button */}
            <button
              type="button"
              onClick={() => handleOpenLightbox(activeImageIndex)}
              className="absolute bottom-3 right-3 z-20 bg-slate-900/85 hover:bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20 backdrop-blur-xs flex items-center gap-1.5 shadow-md transition-all group-hover:scale-105 cursor-pointer"
              title="Click to open uncropped high-resolution view"
            >
              <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Click to Enlarge</span>
              <span className="sm:hidden">Full View</span>
            </button>

            {/* Image index counter badge if multiple photos */}
            {images.length > 1 && (
              <span className="absolute bottom-3 left-3 z-20 bg-slate-900/80 backdrop-blur-xs text-slate-200 text-[11px] font-mono font-bold px-2.5 py-1 rounded-md border border-slate-700">
                {activeImageIndex + 1} / {images.length}
              </span>
            )}
          </div>

          {/* Gallery Thumbnails Strip */}
          {images.length > 1 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 pt-0.5 px-0.5 scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-18 w-20 sm:h-20 sm:w-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 p-1 border-2 transition-all shrink-0 flex items-center justify-center cursor-pointer ${
                      activeImageIndex === idx 
                        ? 'border-amber-500 ring-2 ring-amber-500/40 bg-amber-50/50 dark:bg-amber-950/30' 
                        : 'border-slate-200 dark:border-slate-700 opacity-75 hover:opacity-100 hover:border-slate-400'
                    }`}
                    title={`View angle #${idx + 1}`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} angle ${idx + 1}`} 
                      referrerPolicy="no-referrer" 
                      className="product-thumb-image max-w-full max-h-full"
                      style={{ objectFit: 'contain', objectPosition: 'center' }}
                    />
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                💡 Tip: Click any photo above to inspect high-resolution fabric details and full uncropped dimensions.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Technical Overview & Quote Trigger */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Category & Status */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 px-3 py-1 rounded-md border border-amber-200 dark:border-amber-800">
                {product.categoryName || 'B2B Custom Bags'}
              </span>
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Sample Ready
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 font-serif leading-snug">
              {product.name}
            </h1>

            {/* Short Description */}
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              {product.shortDesc}
            </p>

            {/* Material & MOQ bar */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span><strong className="text-slate-900 dark:text-slate-100">Primary Material:</strong> {product.materials}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span><strong className="text-slate-900 dark:text-slate-100">Minimum Order Quantity (MOQ):</strong> {product.moq} Units (Sample orders supported)</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span><strong className="text-slate-900 dark:text-slate-100">Factory Warranty:</strong> 1 Year Manufacturing Defect Protection</span>
              </div>
            </div>

          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => setQuoteModalOpen(true)}
                className="flex-1 w-full bg-[#72AFDB] hover:bg-[#5C9BC7] text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Request Wholesale Quote</span>
              </button>

              <a
                href={`https://wa.me/919833598338?text=${encodeURIComponent(
                  `Hello LTS Bags, I want to enquire about bulk manufacturing for ${product.name} (MOQ: ${product.moq} units).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-sm text-center"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
              ⚡ Receive official PDF price quote within 24 hours. Factory direct pricing. Note: MOQ may vary depending on material and customization requirements.
            </p>
          </div>

        </div>

      </div>

      {/* Tabs: Full Specifications, Features, Branding */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
        
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`py-4 px-6 text-xs sm:text-sm font-bold transition-colors border-b-2 cursor-pointer ${
              activeTab === 'specs'
                ? 'border-amber-600 text-amber-700 dark:text-amber-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Technical Specifications
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('features')}
            className={`py-4 px-6 text-xs sm:text-sm font-bold transition-colors border-b-2 cursor-pointer ${
              activeTab === 'features'
                ? 'border-amber-600 text-amber-700 dark:text-amber-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Product Features & Full Description
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('branding')}
            className={`py-4 px-6 text-xs sm:text-sm font-bold transition-colors border-b-2 cursor-pointer ${
              activeTab === 'branding'
                ? 'border-amber-600 text-amber-700 dark:text-amber-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Custom Branding Options
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8">
          {activeTab === 'specs' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-serif">Factory Technical Specifications Table</h3>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-200 dark:divide-slate-800">
                {product.specifications?.map((spec, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{spec.label}</span>
                    <span className="sm:col-span-2 text-slate-600 dark:text-slate-400">{spec.value}</span>
                  </div>
                ))}
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs bg-slate-50 dark:bg-slate-950/50">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Primary Material</span>
                  <span className="sm:col-span-2 text-slate-600 dark:text-slate-400">{product.materials}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">MOQ</span>
                  <span className="sm:col-span-2 text-slate-600 dark:text-slate-400">{product.moq} Units</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-serif">Full Description</h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {product.fullDesc || product.shortDesc}
                </p>
              </div>

              {product.features && product.features.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif">Key Engineered Features</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-serif">Available Custom Branding Solutions</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                We offer multiple custom branding techniques depending on your corporate guidelines and target fabric:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <Printer className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs font-serif">High-Density 3D Embroidery</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">Durable stitch embroidery for corporate backpacks and canvas totes.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs font-serif">Debossed PU Leather Patch</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">Elegant subtle heat-debossed leather tags for executive briefcases.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <Layers className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs font-serif">Molded Rubber / Silicone Badge</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">3D raised waterproof rubber badge sewn directly onto front panel.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <ShieldCheck className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs font-serif">Silk Screen & Sublimation</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">High precision multi-color screen printing for large promotional runs.</p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 font-serif">
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

      {/* Interactive High-Resolution Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 animate-in fade-in duration-200 select-none"
          role="dialog"
          aria-modal="true"
          aria-label="High resolution product image lightbox"
        >
          {/* Lightbox Top Control Bar */}
          <div className="flex items-center justify-between text-white shrink-0 pb-3 border-b border-slate-800 gap-2">
            <div className="flex items-center gap-3">
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm sm:text-base text-slate-100 truncate max-w-[200px] sm:max-w-md">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>Photo {activeImageIndex + 1} of {images.length}</span>
                  <span>•</span>
                  <span className="text-amber-400 font-medium">Uncropped Complete View</span>
                </div>
              </div>
            </div>

            {/* Zoom, Reset & Close Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="hidden sm:flex items-center bg-slate-900 rounded-lg border border-slate-800 p-0.5">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={lightboxZoom <= 1}
                  className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Zoom Out (-)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono px-2 text-amber-400 font-bold">
                  {Math.round(lightboxZoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={lightboxZoom >= 3.5}
                  className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Zoom In (+)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                {lightboxZoom > 1 && (
                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="p-1.5 text-slate-300 hover:text-amber-400 rounded hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
                    title="Reset Zoom (R)"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <a
                href={currentMainImage}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Open original raw image file in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={handleCloseLightbox}
                className="p-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold transition-colors cursor-pointer"
                title="Close lightbox (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Center Viewport */}
          <div 
            ref={imageContainerRef}
            className="flex-1 relative flex items-center justify-center overflow-hidden my-auto w-full max-h-[78vh]"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: lightboxZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleToggleZoom();
              }
            }}
          >
            {/* Previous Arrow Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-2 sm:left-6 z-30 p-2 sm:p-3 rounded-full bg-slate-900/80 hover:bg-amber-600 text-white border border-slate-700 shadow-xl transition-all hover:scale-110 cursor-pointer"
                title="Previous image (Left Arrow)"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            {/* Uncropped Complete Image inside Lightbox */}
            <div 
              className="w-full h-full flex items-center justify-center p-2 sm:p-4"
              style={{
                transform: `scale(${lightboxZoom}) translate(${panPosition.x / lightboxZoom}px, ${panPosition.y / lightboxZoom}px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
              }}
            >
              <img
                src={currentMainImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                draggable={false}
                onDoubleClick={handleToggleZoom}
                className="max-w-full max-h-[72vh] sm:max-h-[76vh] object-contain object-center rounded-lg drop-shadow-2xl select-none"
                style={{
                  objectFit: 'contain',
                  objectPosition: 'center',
                }}
              />
            </div>

            {/* Next Arrow Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-2 sm:right-6 z-30 p-2 sm:p-3 rounded-full bg-slate-900/80 hover:bg-amber-600 text-white border border-slate-700 shadow-xl transition-all hover:scale-110 cursor-pointer"
                title="Next image (Right Arrow)"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Bottom Thumbnail Bar */}
          {images.length > 1 && (
            <div className="shrink-0 pt-3 border-t border-slate-800 flex items-center justify-center gap-2 overflow-x-auto pb-1 max-w-2xl mx-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setLightboxZoom(1);
                    setPanPosition({ x: 0, y: 0 });
                  }}
                  className={`h-14 w-14 sm:h-16 sm:w-16 rounded-lg overflow-hidden bg-slate-900 p-0.5 border-2 transition-all shrink-0 flex items-center justify-center cursor-pointer ${
                    activeImageIndex === idx 
                      ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105' 
                      : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Thumb ${idx + 1}`} 
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-full object-contain"
                    style={{ objectFit: 'contain', objectPosition: 'center' }}
                  />
                </button>
              ))}
            </div>
          )}
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

