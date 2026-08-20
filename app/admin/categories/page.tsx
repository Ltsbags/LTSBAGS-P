'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/AdminHeader';
import ImageUploader from '@/components/ImageUploader';
import { Category } from '@/lib/types';
import { 
  Layers, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  AlertCircle, 
  CheckCircle2,
  Globe
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Partial<Category> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setCategories(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const openNewModal = () => {
    setEditingCat({
      name: '',
      slug: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
    });
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCat({ ...cat });
    setError('');
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories(categories.filter((c) => c.id !== id));
        setSuccessMsg('Category deleted');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat?.name) {
      setError('Category Name is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const isEdit = Boolean(editingCat.id);
      const url = isEdit ? `/api/categories/${editingCat.id}` : '/api/categories';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCat),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save category');
      }

      setSuccessMsg(isEdit ? 'Category updated successfully' : 'Category created successfully');
      setModalOpen(false);
      loadCategories();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error saving category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      <AdminHeader />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 font-serif">Category Management</h1>
              <p className="text-slate-600 text-xs mt-1">
                Organize bag product lines and configure category SEO canonicals & meta tags.
              </p>
            </div>

            <button
              onClick={openNewModal}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Category</span>
            </button>
          </div>

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p className="text-xs text-slate-500">Loading categories...</p>
            ) : (
              categories.map((c) => (
                <div key={c.id} className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="aspect-16/9 rounded-xl overflow-hidden bg-slate-100">
                      <img src={c.image} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base font-serif">{c.name}</h3>
                      <p className="text-slate-500 font-mono text-[11px] mt-0.5">/category/{c.slug}</p>
                      <p className="text-slate-600 text-xs mt-2 line-clamp-2">{c.description}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded text-[10px]">
                      SEO Ready
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Category & SEO"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </main>

      {/* Category Modal */}
      {modalOpen && editingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h2 className="text-lg font-bold font-serif">
                {editingCat.id ? 'Edit Category & SEO' : 'Create Category'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCat.name || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <ImageUploader
                label="Category Banner Image"
                value={editingCat.image || ''}
                onChange={(url) => setEditingCat({ ...editingCat, image: url })}
                aspectRatio="video"
              />

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingCat.description || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* SEO FIELDS */}
              <div className="pt-3 border-t border-slate-200 space-y-3 bg-amber-50/50 p-4 rounded-xl border border-amber-200/60">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                  <Globe className="w-4 h-4 text-amber-700" />
                  <span>Category SEO Fields</span>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">SEO URL Slug</label>
                  <input
                    type="text"
                    value={editingCat.slug || ''}
                    onChange={(e) => setEditingCat({ ...editingCat, slug: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={editingCat.metaTitle || ''}
                    onChange={(e) => setEditingCat({ ...editingCat, metaTitle: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Meta Description</label>
                  <textarea
                    rows={2}
                    value={editingCat.metaDescription || ''}
                    onChange={(e) => setEditingCat({ ...editingCat, metaDescription: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Category'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
