'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Building2, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  ShieldCheck, 
  Factory,
  Layers,
  Printer,
  Scissors
} from 'lucide-react';

interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  category: string;
  altText: string;
}

export default function FactoryGallerySection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    'All',
    'Factory Floor',
    'Cutting',
    'Stitching',
    'Printing',
    'Embroidery',
    'Quality Control',
    'Packaging',
    'Finished Goods',
    'Dispatch',
  ];

  const galleryItems: GalleryItem[] = [
    {
      id: 'fac-1',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000',
      caption: 'Main manufacturing facility exterior and raw material receiving bay in Mumbai.',
      category: 'Factory Floor',
      altText: 'LTS Bags Manufacturing Unit Exterior and Logistics Entry',
    },
    {
      id: 'fac-2',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1000',
      caption: 'Conveyorized assembly line for high-volume corporate backpack production.',
      category: 'Factory Floor',
      altText: 'Assembly Line Floor at LTS Bags Mumbai Factory',
    },
    {
      id: 'fac-3',
      imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=1000',
      caption: 'Automated CNC multi-layer laser cutting for millimeter-exact fabric pattern pieces.',
      category: 'Cutting',
      altText: 'Automated Fabric Cutting Table at LTS Bags Facility',
    },
    {
      id: 'fac-4',
      imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=1000',
      caption: 'Heavy-duty programmable bar-tack sewing stations for reinforced shoulder straps.',
      category: 'Stitching',
      altText: 'Heavy Duty Sewing Machines and Stitching Line',
    },
    {
      id: 'fac-5',
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000',
      caption: 'Automatic carousel screen printing unit with precision color registration.',
      category: 'Printing',
      altText: 'Precision Screen Printing Station for Custom Logos',
    },
    {
      id: 'fac-6',
      imageUrl: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&q=80&w=1000',
      caption: 'Multi-head computerized embroidery machines rendering high-density 3D thread branding.',
      category: 'Embroidery',
      altText: 'Computerized Multi-Head Embroidery Machines',
    },
    {
      id: 'fac-7',
      imageUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&q=80&w=1000',
      caption: 'Quality testing laboratory: Zipper cycle testing, load drop testing, and seam strength inspection.',
      category: 'Quality Control',
      altText: 'Quality Testing Laboratory and Inspection Workbench',
    },
    {
      id: 'fac-8',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000',
      caption: 'Individual dust-proof poly bagging, barcode labeling, and moisture-absorbing silica packaging.',
      category: 'Packaging',
      altText: 'Bulk Polybagging and Carton Packing Department',
    },
    {
      id: 'fac-9',
      imageUrl: 'https://images.unsplash.com/photo-1586528116493-a029325540fa?auto=format&fit=crop&q=80&w=1000',
      caption: 'Palletized finished corporate backpack and duffel orders staged for final client audit.',
      category: 'Finished Goods',
      altText: 'Finished Bags Boxed and Palletized in Warehouse',
    },
    {
      id: 'fac-10',
      imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1000',
      caption: 'Logistics dispatch bay with daily pickups for Pan-India and global air/sea cargo.',
      category: 'Dispatch',
      altText: 'Logistics Dispatch Dock and Transport Vehicles',
    },
  ];

  const filteredItems = selectedCategory === 'All' 
    ? galleryItems 
    : galleryItems.filter((item) => item.category === selectedCategory);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const prevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : filteredItems.length - 1));
  };

  const nextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! < filteredItems.length - 1 ? prev! + 1 : 0));
  };

  return (
    <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-[#72AFDB] font-bold text-xs uppercase tracking-widest font-mono bg-[#72AFDB]/10 px-3.5 py-1 rounded-full border border-[#72AFDB]/30">
            Manufacturing Infrastructure
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            Inside Our Manufacturing Facility
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Real visual proof of our production floors, automated cutting tables, heavy stitching lines, QC lab, and logistics hub in Mumbai.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#72AFDB] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="aspect-4/3 relative overflow-hidden bg-slate-200 dark:bg-slate-700">
                <Image
                  src={item.imageUrl}
                  alt={item.altText}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  referrerPolicy="no-referrer"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-2.5 rounded-full bg-white/90 text-slate-900 shadow-md">
                    <Maximize2 className="w-5 h-5" />
                  </span>
                </div>
                <span className="absolute top-3 left-3 bg-[#1E293B]/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md font-mono border border-white/10">
                  {item.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between bg-white dark:bg-slate-900">
                <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed font-medium">
                  {item.caption}
                </p>
                <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-[#72AFDB]">
                  <span className="font-bold">View High-Res</span>
                  <span className="text-slate-400">LTS Mumbai Plant</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-slate-300 hover:text-white p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors z-50 cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-slate-800/80 hover:bg-[#72AFDB] transition-colors z-50 cursor-pointer"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-slate-800/80 hover:bg-[#72AFDB] transition-colors z-50 cursor-pointer"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
            <div className="relative aspect-16/10 w-full bg-black">
              <Image
                src={filteredItems[lightboxIndex].imageUrl}
                alt={filteredItems[lightboxIndex].altText}
                fill
                sizes="100vw"
                referrerPolicy="no-referrer"
                className="object-contain"
              />
            </div>
            <div className="p-6 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[#72AFDB] text-xs font-mono font-bold uppercase tracking-wider">
                  {filteredItems[lightboxIndex].category}
                </span>
                <p className="text-white text-sm sm:text-base font-medium mt-1">
                  {filteredItems[lightboxIndex].caption}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {filteredItems[lightboxIndex].altText}
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono shrink-0">
                {lightboxIndex + 1} of {filteredItems.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
