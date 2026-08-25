'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { MediaAsset } from '@/lib/types';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Copy,
  Check,
  Search,
  ExternalLink,
  Eye,
  Tag,
  Maximize2,
  X,
  FolderOpen,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Layers,
  LayoutGrid,
  List,
  ShieldCheck,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import SmartImageStudio from '@/components/SmartImageStudio';
import { IMAGE_PRESETS, ImagePresetKey } from '@/lib/image-processing/presets';

export default function AdminGalleryPage() {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);

  // Upload & Smart Studio Modal
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [studioFile, setStudioFile] = useState<File | null>(null);
  const [studioPreset, setStudioPreset] = useState<ImagePresetKey>('product_main');
  const uploadInputRef = useRef<HTMLInputElement>(null);

  // Replace Asset Modal
  const [replacingAsset, setReplacingAsset] = useState<MediaAsset | null>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  // Batch Optimize State
  const [isBatchOptimizing, setIsBatchOptimizing] = useState(false);
  const [batchResult, setBatchResult] = useState<{
    processedCount: number;
    skippedCount: number;
    totalSavedFormatted: string;
  } | null>(null);

  // Delete Protection Warning Modal
  const [deleteWarning, setDeleteWarning] = useState<{
    asset: MediaAsset;
    usageCount: number;
    references: { type: string; id: string; name: string; link: string }[];
  } | null>(null);

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
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
        setMedia(data);
      }
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, search]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteClick = async (asset: MediaAsset) => {
    try {
      // First attempt delete without force to check references
      const res = await fetch(`/api/media?id=${asset.id}`, { method: 'DELETE' });
      if (res.status === 409) {
        const errData = await res.json();
        setDeleteWarning({
          asset,
          usageCount: errData.usageCount || 0,
          references: errData.references || [],
        });
        return;
      }

      if (res.ok) {
        setMedia((prev) => prev.filter((m) => m.id !== asset.id));
      } else {
        alert('Failed to delete media asset');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleForceDelete = async () => {
    if (!deleteWarning) return;
    try {
      const res = await fetch(`/api/media?id=${deleteWarning.asset.id}&force=true`, { method: 'DELETE' });
      if (res.ok) {
        setMedia((prev) => prev.filter((m) => m.id !== deleteWarning.asset.id));
        setDeleteWarning(null);
      }
    } catch (err) {
      console.error('Force delete error:', err);
    }
  };

  const handleBatchOptimize = async () => {
    setIsBatchOptimizing(true);
    setBatchResult(null);
    try {
      const res = await fetch('/api/images/batch-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: selectedCategory }),
      });
      if (res.ok) {
        const data = await res.json();
        setBatchResult({
          processedCount: data.processedCount,
          skippedCount: data.skippedCount,
          totalSavedFormatted: data.totalSavedFormatted,
        });
        fetchMedia();
      }
    } catch (err) {
      console.error('Batch optimize error:', err);
    } finally {
      setIsBatchOptimizing(false);
    }
  };

  const handleStudioUploadTrigger = (preset: ImagePresetKey = 'product_main') => {
    setStudioPreset(preset);
    uploadInputRef.current?.click();
  };

  const handleUploadFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStudioFile(file);
      setIsStudioOpen(true);
    }
    e.target.value = '';
  };

  const handleReplaceFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && replacingAsset) {
      setStudioFile(file);
      setStudioPreset((replacingAsset.preset as ImagePresetKey) || 'general');
      setIsStudioOpen(true);
    }
    e.target.value = '';
  };

  const categories = [
    { id: 'ALL', label: 'All Media' },
    { id: 'PRODUCTS', label: 'Products' },
    { id: 'HERO', label: 'Hero Banners' },
    { id: 'CATEGORIES', label: 'Categories' },
    { id: 'BLOGS', label: 'Blogs' },
    { id: 'LOGOS', label: 'Client Logos' },
    { id: 'FACTORY', label: 'Factory Machinery' },
    { id: 'CERTIFICATES', label: 'Certificates' },
    { id: 'GENERAL', label: 'General' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <AdminHeader activeTab="gallery" />

      {/* Hidden file inputs */}
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/*"
        onChange={handleUploadFileSelected}
        className="hidden"
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/*"
        onChange={handleReplaceFileSelected}
        className="hidden"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <ImageIcon className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Media Library & Auto-Optimizer
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Automatic preset resizing, WebP compression, focal crop, duplicate detection, and responsive variant management.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleBatchOptimize}
              disabled={isBatchOptimizing}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 text-blue-400 ${isBatchOptimizing ? 'animate-spin' : ''}`} />
              <span>{isBatchOptimizing ? 'Optimizing...' : 'Batch Optimize Existing'}</span>
            </button>

            <button
              onClick={() => handleStudioUploadTrigger('product_main')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Upload & Auto-Optimize</span>
            </button>
          </div>
        </div>

        {/* Batch result banner */}
        {batchResult && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                <strong>Batch Optimization Complete:</strong> {batchResult.processedCount} images converted to high-performance WebP ({batchResult.totalSavedFormatted} saved disk space).
              </span>
            </div>
            <button onClick={() => setBatchResult(null)} className="text-emerald-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filter, Search & View Controls */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800/80">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white font-black shadow-sm'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & View Mode */}
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search assets or ALT text..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Media Grid / List */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
            Loading media assets...
          </div>
        ) : media.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/40 rounded-xl border border-slate-800/60 mt-6">
            <FolderOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-300">No media assets found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Upload any image to test the automatic resizing, smart focal crop, and compression system.
            </p>
            <button
              onClick={() => handleStudioUploadTrigger('product_main')}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl"
            >
              Upload First Image
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {media.map((asset) => {
              const usageCount = (asset as any).usageCount || 0;
              return (
                <div
                  key={asset.id}
                  className="bg-slate-900/80 rounded-xl border border-slate-800/80 overflow-hidden group hover:border-slate-700 transition-all flex flex-col"
                >
                  {/* Image Box */}
                  <div className="relative aspect-square bg-slate-950 overflow-hidden flex items-center justify-center p-2">
                    <img
                      src={asset.thumbnailUrl || asset.url}
                      alt={asset.altText || asset.title}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <span className="bg-slate-950/80 backdrop-blur-md text-blue-400 border border-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                        {asset.category}
                      </span>
                      {asset.savingsPercent ? (
                        <span className="bg-emerald-950/90 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          -{asset.savingsPercent}%
                        </span>
                      ) : null}
                    </div>

                    {/* Usage status badge */}
                    <div className="absolute top-2 right-2">
                      {usageCount > 0 ? (
                        <span className="bg-blue-950/90 text-blue-300 border border-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          Used in {usageCount} place{usageCount > 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span className="bg-slate-800/80 text-slate-400 text-[10px] px-2 py-0.5 rounded-full">
                          Unused
                        </span>
                      )}
                    </div>

                    {/* Hover Actions Overlay */}
                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => setPreviewAsset(asset)}
                        title="Preview High-Res"
                        className="p-2 bg-slate-900 text-slate-200 hover:text-white hover:bg-blue-600 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setReplacingAsset(asset);
                          replaceInputRef.current?.click();
                        }}
                        title="Replace Image (Preserve References)"
                        className="p-2 bg-slate-900 text-slate-200 hover:text-white hover:bg-amber-600 rounded-lg transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleCopyUrl(asset.id, asset.url)}
                        title="Copy Optimized URL"
                        className="p-2 bg-slate-900 text-slate-200 hover:text-white hover:bg-emerald-600 rounded-lg transition-colors"
                      >
                        {copiedId === asset.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(asset)}
                        title="Delete Asset"
                        className="p-2 bg-slate-900 text-slate-200 hover:text-white hover:bg-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Details Footer */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-200 line-clamp-1" title={asset.title}>
                        {asset.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate" title={asset.altText}>
                        ALT: {asset.altText || 'Not specified'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-800/60">
                      <span>{asset.dimensions || '1200x1200'}</span>
                      <span className="font-semibold text-emerald-400">{asset.fileSize || '350 KB'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="mt-6 bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
            <div className="divide-y divide-slate-800">
              {media.map((asset) => {
                const usageCount = (asset as any).usageCount || 0;
                return (
                  <div key={asset.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-14 h-14 rounded-lg bg-slate-950 overflow-hidden flex-shrink-0 flex items-center justify-center p-1 border border-slate-800">
                        <img
                          src={asset.thumbnailUrl || asset.url}
                          alt={asset.title}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{asset.title}</h4>
                        <p className="text-[11px] text-slate-400 truncate">ALT: {asset.altText || 'None'}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                          <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">{asset.category}</span>
                          <span>{asset.dimensions}</span>
                          <span className="text-emerald-400 font-semibold">{asset.fileSize}</span>
                          {usageCount > 0 ? (
                            <span className="text-blue-400">Used in {usageCount} items</span>
                          ) : (
                            <span className="text-slate-600">Unused</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleCopyUrl(asset.id, asset.url)}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-lg flex items-center gap-1"
                      >
                        {copiedId === asset.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === asset.id ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setReplacingAsset(asset);
                          replaceInputRef.current?.click();
                        }}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                        title="Replace Image"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(asset)}
                        className="p-1.5 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Delete Protection Warning Modal */}
        {deleteWarning && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-amber-400">
                <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-white">Image is Actively Referenced</h3>
                  <p className="text-xs text-amber-300/80">
                    This media asset is currently referenced by {deleteWarning.usageCount} item(s) on your site.
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 max-h-48 overflow-y-auto space-y-1.5">
                {deleteWarning.references.map((ref, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-900/60">
                    <span className="font-semibold text-slate-300">{ref.type}:</span>
                    <span className="text-slate-400 truncate max-w-[200px]">{ref.name}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-400">
                Deleting this file may result in broken images on these pages. You can either replace the photo first or force delete.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteWarning(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleForceDelete}
                  className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow"
                >
                  Force Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* High-Res Image Preview Modal */}
        {previewAsset && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-4 relative overflow-hidden flex flex-col max-h-[90vh]">
              <button
                onClick={() => setPreviewAsset(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-slate-950/80 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex-1 bg-slate-950 rounded-xl overflow-hidden mb-4 flex items-center justify-center p-4 min-h-[350px]">
                <img
                  src={previewAsset.url}
                  alt={previewAsset.title}
                  className="max-w-full max-h-[60vh] object-contain"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 px-2">
                <div>
                  <h4 className="font-bold text-white text-sm">{previewAsset.title}</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {previewAsset.dimensions} • {previewAsset.fileSize} • {previewAsset.mimeType}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyUrl(previewAsset.id, previewAsset.url)}
                    className="flex items-center gap-1.5 bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedId === previewAsset.id ? 'Copied!' : 'Copy URL'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Smart Image Studio Modal */}
        <SmartImageStudio
          isOpen={isStudioOpen}
          onClose={() => {
            setIsStudioOpen(false);
            setStudioFile(null);
            setReplacingAsset(null);
          }}
          file={studioFile}
          initialPreset={studioPreset}
          contextName={replacingAsset?.title || ''}
          onSuccess={() => {
            fetchMedia();
            setIsStudioOpen(false);
            setStudioFile(null);
            setReplacingAsset(null);
          }}
        />
      </main>
    </div>
  );
}
