'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { CatalogueItem } from '@/lib/types';
import { 
  FileText, 
  Plus, 
  Download, 
  Eye, 
  Trash2, 
  Edit, 
  ExternalLink, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle,
  X,
  Upload
} from 'lucide-react';
import { useAdminAuth } from '@/lib/useAdminAuth';

export default function CataloguesAdminPage() {
  const { user } = useAdminAuth({ requireAuth: true });
  const [catalogues, setCatalogues] = useState<CatalogueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogueItem | null>(null);
  const [formData, setFormData] = useState<Partial<CatalogueItem>>({
    title: '',
    description: '',
    coverImageUrl: '',
    pdfUrl: '',
    category: 'Corporate Backpacks',
    version: 'v2026.1',
    fileSize: '5.0 MB',
    isActive: true,
    displayOrder: 1,
  });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchCatalogues = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/catalogues');
      if (res.ok) {
        const data = await res.json();
        setCatalogues(data.catalogues || []);
      }
    } catch (err) {
      console.error('Failed to load catalogues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogues();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      coverImageUrl: 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=600',
      pdfUrl: '/catalogues/LTS-Brochure-2026.pdf',
      category: 'Corporate Backpacks',
      version: 'v2026.1',
      fileSize: '6.5 MB',
      isActive: true,
      displayOrder: catalogues.length + 1,
    });
    setErrorMsg('');
    setSuccessMsg('');
    setShowModal(true);
  };

  const handleOpenEdit = (item: CatalogueItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setErrorMsg('');
    setSuccessMsg('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.pdfUrl) {
      setErrorMsg('Title and PDF URL are required');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/catalogues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: editingItem?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save catalogue');
      }

      setSuccessMsg(`Catalogue ${editingItem ? 'updated' : 'created'} successfully!`);
      setTimeout(() => {
        setShowModal(false);
        fetchCatalogues();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete catalogue "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/catalogues/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCatalogues((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert('Failed to delete catalogue');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete catalogue');
    }
  };

  const copyShareLink = (pdfUrl: string, id: string) => {
    const fullUrl = pdfUrl.startsWith('http') ? pdfUrl : `${window.location.origin}${pdfUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <AdminHeader activeTab="catalogues" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4" />
              <span>Digital Assets & Brochures</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-serif">Product Catalogues & Lookbooks</h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage downloadable PDF catalogues, corporate gift lookbooks, track download conversions, and copy direct links for clients.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreate}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Catalogue</span>
            </button>
          </div>
        </div>

        {/* Catalogues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full p-12 text-center text-slate-500 text-xs">Loading catalogues...</div>
          ) : catalogues.length === 0 ? (
            <div className="col-span-full p-12 text-center space-y-3 bg-slate-900 border border-slate-800 rounded-2xl">
              <FileText className="w-12 h-12 mx-auto text-slate-600" />
              <div className="text-slate-300 font-bold text-sm">No catalogues published yet</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Upload your first master B2B PDF catalogue or seasonal lookbook for clients.
              </p>
            </div>
          ) : (
            catalogues.map((cat) => (
              <div key={cat.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col group hover:border-slate-700 transition-all">
                
                {/* Cover Image & Category Badge */}
                <div className="relative h-44 bg-slate-950 overflow-hidden">
                  <img
                    src={cat.coverImageUrl}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-amber-400 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md uppercase">
                      {cat.category || 'General'}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${cat.isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
                      {cat.isActive ? 'ACTIVE' : 'DRAFT'}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 font-mono">
                    <span>{cat.version || 'v2026.1'}</span>
                    <span>{cat.fileSize || 'PDF'}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-white text-base leading-snug line-clamp-2">{cat.title}</h3>
                    {cat.description && (
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{cat.description}</p>
                    )}
                  </div>

                  {/* Metrics & Action Bar */}
                  <div className="space-y-3 pt-3 border-t border-slate-800/80">
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                        <div className="text-slate-400 text-[10px] uppercase font-mono flex items-center justify-center gap-1">
                          <Eye className="w-3 h-3 text-sky-400" />
                          <span>Views</span>
                        </div>
                        <div className="text-white font-bold text-sm mt-0.5">{cat.viewsCount || 0}</div>
                      </div>
                      <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                        <div className="text-slate-400 text-[10px] uppercase font-mono flex items-center justify-center gap-1">
                          <Download className="w-3 h-3 text-emerald-400" />
                          <span>Downloads</span>
                        </div>
                        <div className="text-white font-bold text-sm mt-0.5">{cat.downloadsCount || 0}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        onClick={() => copyShareLink(cat.pdfUrl, cat.id)}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                      >
                        {copiedId === cat.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>

                      <a
                        href={cat.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
                        title="View PDF"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
                        title="Edit Catalogue"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(cat.id, cat.title)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all"
                        title="Delete Catalogue"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-white font-serif mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>{editingItem ? 'Edit Catalogue Details' : 'Add New PDF Catalogue'}</span>
              </h2>

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Catalogue Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. LTS Corporate Backpacks 2026 Master Catalogue"
                    className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief highlights about this collection..."
                    className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">PDF File URL *</label>
                  <input
                    type="text"
                    required
                    value={formData.pdfUrl || ''}
                    onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                    placeholder="/catalogues/LTS-Corporate-Backpacks-2026.pdf or https://..."
                    className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Cover Thumbnail Image URL</label>
                  <input
                    type="text"
                    value={formData.coverImageUrl || ''}
                    onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Category / Segment</label>
                    <input
                      type="text"
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Corporate Backpacks / Duffels"
                      className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Version & File Size</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={formData.version || ''}
                        onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                        placeholder="v2026.1"
                        className="w-full bg-slate-950 border border-slate-700 px-2 py-2 rounded-lg text-white focus:outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        value={formData.fileSize || ''}
                        onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                        placeholder="6.5 MB"
                        className="w-full bg-slate-950 border border-slate-700 px-2 py-2 rounded-lg text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive !== false}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-500"
                  />
                  <label htmlFor="isActive" className="text-slate-300 font-bold cursor-pointer">
                    Active (Visible on public catalogue download section)
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : editingItem ? 'Update Catalogue' : 'Publish Catalogue'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
