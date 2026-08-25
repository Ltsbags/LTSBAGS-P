'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, Image as ImageIcon, Check, Filter } from 'lucide-react';
import { MediaAsset } from '@/lib/types';

interface MediaLibraryPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: MediaAsset) => void;
  categoryFilter?: string;
  title?: string;
  subtitle?: string;
}

export default function MediaLibraryPickerModal({
  isOpen,
  onClose,
  onSelect,
  categoryFilter,
  title = 'Select from Media Library',
  subtitle = 'Pick previously optimized web-ready assets',
}: MediaLibraryPickerModalProps) {
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFilter || 'ALL');

  useEffect(() => {
    if (!isOpen) return;

    const fetchMedia = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'ALL') {
          params.set('category', selectedCategory);
        }
        if (search.trim()) {
          params.set('search', search.trim());
        }

        const res = await fetch(`/api/media?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setMediaList(data);
        }
      } catch (err) {
        console.error('Failed to load media library:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [isOpen, selectedCategory, search]);

  if (!isOpen) return null;

  const categories = [
    { id: 'ALL', label: 'All Media' },
    { id: 'PRODUCTS', label: 'Products' },
    { id: 'HERO', label: 'Hero Banners' },
    { id: 'CATEGORIES', label: 'Categories' },
    { id: 'BLOGS', label: 'Blogs' },
    { id: 'LOGOS', label: 'Logos' },
    { id: 'FACTORY', label: 'Factory' },
    { id: 'CERTIFICATES', label: 'Certificates' },
  ];

  return (
    <div
      id="media-library-picker-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters & Search */}
        <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, ALT text..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === c.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Media Grid */}
        <div className="p-6 overflow-y-auto flex-1 min-h-[300px]">
          {loading ? (
            <div className="h-48 flex items-center justify-center text-xs text-slate-500">
              Loading optimized assets...
            </div>
          ) : mediaList.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center text-slate-400">
              <ImageIcon className="w-12 h-12 stroke-[1.5] mb-2 opacity-50" />
              <p className="text-xs font-semibold">No media assets found</p>
              <p className="text-[11px]">Upload a new image to start building your library</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mediaList.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => {
                    onSelect(asset);
                    onClose();
                  }}
                  className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all flex flex-col"
                >
                  <div className="aspect-square w-full bg-slate-900/5 relative overflow-hidden flex items-center justify-center">
                    <img
                      src={asset.thumbnailUrl || asset.url}
                      alt={asset.altText || asset.title}
                      className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Select
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5 bg-white border-t border-slate-100 flex-1 flex flex-col justify-between">
                    <p className="text-xs font-bold text-slate-800 truncate" title={asset.title}>
                      {asset.title}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                      <span>{asset.dimensions || '1200x1200'}</span>
                      <span className="font-semibold text-emerald-600">{asset.fileSize || '350 KB'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>{mediaList.length} media item(s) found</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
