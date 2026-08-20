'use client';

import React, { useEffect, useState, useCallback } from 'react';
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
  FolderOpen
} from 'lucide-react';

export default function AdminGalleryPage() {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    category: 'PRODUCTS' as MediaAsset['category'],
    altText: '',
    fileSize: '1.2 MB',
    dimensions: '1920x1080',
  });

  const fetchMedia = useCallback(async () => {
    try {
      const res = await fetch('/api/media');
      if (res.ok) {
        const data = await res.json();
        setMedia(data);
      }
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const res = await fetch('/api/media');
        if (res.ok) {
          const data = await res.json();
          if (!ignore) {
            setMedia(data);
          }
        }
      } catch (err) {
        console.error('Failed to load media:', err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/media?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMedia((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete media:', err);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.url) return;

    try {
      setSaving(true);
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newAsset = await res.json();
        setMedia((prev) => [newAsset, ...prev]);
        setIsAddModalOpen(false);
        setFormData({
          title: '',
          url: '',
          category: 'PRODUCTS',
          altText: '',
          fileSize: '1.2 MB',
          dimensions: '1920x1080',
        });
      }
    } catch (err) {
      console.error('Failed to save media:', err);
    } finally {
      setSaving(false);
    }
  };

  const filteredMedia = media.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.altText && item.altText.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'ALL', label: 'All Media' },
    { id: 'PRODUCTS', label: 'Products' },
    { id: 'HERO', label: 'Hero Slides' },
    { id: 'FACTORY', label: 'Factory & Plant' },
    { id: 'CERTIFICATES', label: 'Certificates' },
    { id: 'LOGOS', label: 'Logos & Badges' },
    { id: 'GENERAL', label: 'General' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <AdminHeader activeTab="gallery" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <ImageIcon className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-black tracking-tight text-white">Gallery & Media Library</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Manage product images, hero banners, factory machinery photos, and certification media assets.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-sky-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Media Asset</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-sky-500 text-slate-950 font-black shadow-sm'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            <div className="animate-spin w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full mx-auto mb-3" />
            Loading media assets...
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/40 rounded-xl border border-slate-800/60 mt-6">
            <FolderOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-300">No media assets found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {search ? 'Try clearing your search query or selecting another category.' : 'Add your first image asset to start populating your gallery library.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {filteredMedia.map((asset) => (
              <div
                key={asset.id}
                className="bg-slate-900/80 rounded-xl border border-slate-800/80 overflow-hidden group hover:border-slate-700 transition-all flex flex-col"
              >
                {/* Image Box */}
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
                  <img
                    src={asset.url}
                    alt={asset.altText || asset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-slate-950/80 backdrop-blur-md text-sky-400 border border-slate-700 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                      {asset.category}
                    </span>
                  </div>

                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPreviewAsset(asset)}
                      title="Preview Image"
                      className="p-2 bg-slate-900/90 text-slate-200 hover:text-white hover:bg-sky-500 hover:text-slate-950 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopyUrl(asset.id, asset.url)}
                      title="Copy URL"
                      className="p-2 bg-slate-900/90 text-slate-200 hover:text-white hover:bg-amber-400 hover:text-slate-950 rounded-lg transition-colors"
                    >
                      {copiedId === asset.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(asset.id, asset.title)}
                      title="Delete Asset"
                      className="p-2 bg-slate-900/90 text-slate-200 hover:text-white hover:bg-red-500 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 line-clamp-1">{asset.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">{asset.url}</p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-800/60">
                    <span>{asset.dimensions || '1920x1080'}</span>
                    <button
                      onClick={() => handleCopyUrl(asset.id, asset.url)}
                      className="text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1"
                    >
                      {copiedId === asset.id ? 'Copied!' : 'Copy URL'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-sky-400" />
                  <span>Add New Media Asset</span>
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Asset Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Executive Backpack Studio Shot"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Image URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                    >
                      <option value="PRODUCTS">Products</option>
                      <option value="HERO">Hero Slides</option>
                      <option value="FACTORY">Factory & Plant</option>
                      <option value="CERTIFICATES">Certificates</option>
                      <option value="LOGOS">Logos & Badges</option>
                      <option value="GENERAL">General</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Alt Text</label>
                    <input
                      type="text"
                      placeholder="Image description"
                      value={formData.altText}
                      onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-sky-500 text-slate-950 hover:bg-sky-400 font-black shadow-lg shadow-sky-500/20"
                  >
                    {saving ? 'Saving...' : 'Add to Library'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {previewAsset && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-4 relative overflow-hidden">
              <button
                onClick={() => setPreviewAsset(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-slate-950/80 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden mb-4">
                <img
                  src={previewAsset.url}
                  alt={previewAsset.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 px-2">
                <div>
                  <h4 className="font-bold text-white text-sm">{previewAsset.title}</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">{previewAsset.url}</p>
                </div>
                <button
                  onClick={() => handleCopyUrl(previewAsset.id, previewAsset.url)}
                  className="flex items-center gap-1.5 bg-sky-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId === previewAsset.id ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
