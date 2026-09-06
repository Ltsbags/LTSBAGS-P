'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/AdminHeader';
import ImageUploader from '@/components/ImageUploader';
import { Category } from '@/lib/types';
import { sanitizeImageUrl } from '@/lib/image-processing/presets';
import { 
  Layers, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  AlertCircle, 
  CheckCircle2,
  Globe,
  ExternalLink,
  ChevronRight,
  FolderTree,
  ListFilter,
  Sparkles,
  Check
} from 'lucide-react';

// Helper to auto-generate high-ranking SEO fields for categories
function buildCategorySeo(name: string, parentName?: string, description?: string) {
  const cleanName = (name || '').trim();
  if (!cleanName) {
    return {
      slug: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
    };
  }

  // 1. URL Slug
  const slug = cleanName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // 2. Meta Title (Optimal: 45-60 characters, Google limits to ~60 chars)
  let metaTitle = '';
  if (parentName && parentName.trim()) {
    metaTitle = `${cleanName} Manufacturer in India | LTS Bags`;
    if (metaTitle.length > 60) {
      metaTitle = `${cleanName} | LTS Bags India`;
    }
  } else {
    metaTitle = `${cleanName} Manufacturer in India | LTS Bags`;
    if (metaTitle.length < 42) {
      metaTitle = `${cleanName} Manufacturer & Wholesale | LTS Bags`;
    }
  }

  // 3. Meta Description (Optimal: 130-155 characters)
  let metaDescription = '';
  if (description && description.trim().length > 30) {
    const trimmed = description.trim();
    if (trimmed.length <= 150) {
      metaDescription = trimmed.endsWith('.')
        ? `${trimmed} Custom wholesale orders by LTS Bags.`
        : `${trimmed}. Custom wholesale orders by LTS Bags.`;
    } else {
      metaDescription = trimmed.slice(0, 147) + '...';
    }
  } else {
    metaDescription = `Wholesale manufacturer of custom ${cleanName.toLowerCase()} in India. Direct factory bulk pricing, premium materials, logo printing & fast samples by LTS Bags.`;
  }
  if (metaDescription.length > 160) {
    metaDescription = metaDescription.slice(0, 157) + '...';
  }

  // 4. Meta Keywords
  const baseKeywords = [
    cleanName.toLowerCase(),
    `${cleanName.toLowerCase()} manufacturer`,
    `custom ${cleanName.toLowerCase()}`,
    `wholesale ${cleanName.toLowerCase()} india`,
    `bulk ${cleanName.toLowerCase()} supplier`,
    parentName ? `${parentName.toLowerCase()} factory` : '',
    'lts bags mumbai',
    'b2b bag manufacturer india'
  ].filter(Boolean);

  const metaKeywords = Array.from(new Set(baseKeywords)).join(', ');

  return {
    slug,
    metaTitle,
    metaDescription,
    metaKeywords,
  };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<'all' | 'main' | 'sub'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Partial<Category> | null>(null);
  const [autoSyncSeo, setAutoSyncSeo] = useState<boolean>(true);
  const [isGeneratingSeo, setIsGeneratingSeo] = useState<boolean>(false);
  const [seoGeneratedNotice, setSeoGeneratedNotice] = useState<string>('');
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

  const mainCategories = categories.filter((c) => !c.parentId);

  const openNewModal = (preselectedParentId?: string) => {
    const parent = preselectedParentId ? categories.find((c) => c.id === preselectedParentId) : undefined;
    setAutoSyncSeo(true);
    setSeoGeneratedNotice('');
    setEditingCat({
      name: '',
      slug: '',
      parentId: preselectedParentId || '',
      parentSlug: parent ? parent.slug : '',
      level: preselectedParentId ? 'SUB' : 'MAIN',
      description: '',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=max&q=80&w=800',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
    });
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCat({ ...cat });
    // If existing category has missing or empty SEO fields, prompt or enable auto-sync
    const hasMissingSeo = !cat.metaTitle || !cat.metaDescription || !cat.metaKeywords;
    setAutoSyncSeo(hasMissingSeo);
    setSeoGeneratedNotice('');
    setError('');
    setModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    const hasChildren = categories.some((c) => c.parentId === id);
    const confirmMsg = hasChildren
      ? `"${name}" has subcategories. Are you sure you want to delete it?`
      : `Are you sure you want to delete "${name}"?`;
      
    if (!confirm(confirmMsg)) return;
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

  const handleNameChange = (name: string) => {
    if (!editingCat) return;
    const parent = categories.find((c) => c.id === editingCat.parentId);
    const parentName = parent?.name;

    if (autoSyncSeo) {
      const seo = buildCategorySeo(name, parentName, editingCat.description);
      setEditingCat({
        ...editingCat,
        name,
        slug: seo.slug,
        metaTitle: seo.metaTitle,
        metaDescription: seo.metaDescription,
        metaKeywords: seo.metaKeywords,
      });
    } else {
      const generatedSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setEditingCat({
        ...editingCat,
        name,
        slug: editingCat.slug ? editingCat.slug : generatedSlug,
      });
    }
  };

  const handleDescriptionChange = (description: string) => {
    if (!editingCat) return;
    if (autoSyncSeo && editingCat.name) {
      const parent = categories.find((c) => c.id === editingCat.parentId);
      const seo = buildCategorySeo(editingCat.name, parent?.name, description);
      setEditingCat({
        ...editingCat,
        description,
        metaDescription: seo.metaDescription,
      });
    } else {
      setEditingCat({
        ...editingCat,
        description,
      });
    }
  };

  const handleParentChange = (parentId: string) => {
    if (!editingCat) return;
    const parent = categories.find((c) => c.id === parentId);
    const parentSlug = parent?.slug || '';
    const level = parentId ? 'SUB' : 'MAIN';

    if (autoSyncSeo && editingCat.name) {
      const seo = buildCategorySeo(editingCat.name, parent?.name, editingCat.description);
      setEditingCat({
        ...editingCat,
        parentId: parentId || '',
        parentSlug,
        level,
        metaTitle: seo.metaTitle,
        metaKeywords: seo.metaKeywords,
      });
    } else {
      setEditingCat({
        ...editingCat,
        parentId: parentId || '',
        parentSlug,
        level,
      });
    }
  };

  const handleAutoGenerateSeo = async (useAi: boolean = false) => {
    if (!editingCat) return;
    if (!editingCat.name) {
      setError('Please enter a Category Name first to auto-generate SEO fields.');
      return;
    }
    setIsGeneratingSeo(true);
    setError('');

    try {
      const parent = categories.find((c) => c.id === editingCat.parentId);
      const res = await fetch('/api/admin/seo/auto-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'category',
          name: editingCat.name,
          parentName: parent?.name,
          description: editingCat.description,
          useAi,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setEditingCat((prev) =>
          prev
            ? {
                ...prev,
                slug: data.slug || prev.slug,
                metaTitle: data.metaTitle || prev.metaTitle,
                metaDescription: data.metaDescription || prev.metaDescription,
                metaKeywords: data.metaKeywords || prev.metaKeywords,
                imageAlt: data.imageAlt || prev.imageAlt,
              }
            : null
        );
        setAutoSyncSeo(true);
        setSeoGeneratedNotice(
          data.aiEnhanced
            ? '✨ AI-Powered B2B SEO metadata generated!'
            : '⚡ B2B Category SEO fields auto-generated successfully!'
        );
        setTimeout(() => setSeoGeneratedNotice(''), 4000);
      } else {
        // Local fallback
        const parent = categories.find((c) => c.id === editingCat.parentId);
        const seo = buildCategorySeo(editingCat.name, parent?.name, editingCat.description);
        setEditingCat((prev) =>
          prev
            ? {
                ...prev,
                slug: seo.slug,
                metaTitle: seo.metaTitle,
                metaDescription: seo.metaDescription,
                metaKeywords: seo.metaKeywords,
                imageAlt: `Custom ${editingCat.name} manufactured in bulk by LTS Bags Mumbai India`,
              }
            : null
        );
        setAutoSyncSeo(true);
        setSeoGeneratedNotice('⚡ Category SEO fields auto-generated successfully!');
        setTimeout(() => setSeoGeneratedNotice(''), 4000);
      }
    } catch (err) {
      const parent = categories.find((c) => c.id === editingCat.parentId);
      const seo = buildCategorySeo(editingCat.name, parent?.name, editingCat.description);
      setEditingCat((prev) =>
        prev
          ? {
              ...prev,
              slug: seo.slug,
              metaTitle: seo.metaTitle,
              metaDescription: seo.metaDescription,
              metaKeywords: seo.metaKeywords,
              imageAlt: `Custom ${editingCat.name} manufactured in bulk by LTS Bags Mumbai India`,
            }
          : null
      );
      setAutoSyncSeo(true);
      setSeoGeneratedNotice('⚡ Category SEO fields auto-generated successfully!');
      setTimeout(() => setSeoGeneratedNotice(''), 4000);
    } finally {
      setIsGeneratingSeo(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat?.name) {
      setError('Category Name is required');
      return;
    }

    // Check duplicate slug
    const normalizedSlug = (editingCat.slug || editingCat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    const isDuplicate = categories.some(
      (c) => c.id !== editingCat.id && c.slug.toLowerCase() === normalizedSlug.toLowerCase()
    );
    if (isDuplicate) {
      setError(`Slug "${normalizedSlug}" is already in use by another category.`);
      return;
    }

    // Circular parent check
    if (editingCat.id && editingCat.parentId === editingCat.id) {
      setError('A category cannot be its own parent.');
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

  const filteredCategories = categories.filter((c) => {
    if (filterMode === 'main' && c.parentId) return false;
    if (filterMode === 'sub' && !c.parentId) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      <AdminHeader />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 font-serif">Category Hierarchy &amp; SEO Management</h1>
              <p className="text-slate-600 text-xs mt-1">
                Manage 11 Main Categories and their Subcategories with canonical paths, breadcrumbs, and meta tags.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => openNewModal()}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>
          </div>

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <ListFilter className="w-3.5 h-3.5" /> Filter:
              </span>
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterMode === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                All ({categories.length})
              </button>
              <button
                onClick={() => setFilterMode('main')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterMode === 'main'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Main ({mainCategories.length})
              </button>
              <button
                onClick={() => setFilterMode('sub')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterMode === 'sub'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Subcategories ({categories.length - mainCategories.length})
              </button>
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Search category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p className="text-xs text-slate-500">Loading categories...</p>
            ) : filteredCategories.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500 text-xs bg-white rounded-2xl border border-slate-200">
                No categories found matching your filter.
              </div>
            ) : (
              filteredCategories.map((c) => {
                const parent = c.parentId ? categories.find((p) => p.id === c.parentId) : undefined;
                const subCount = categories.filter((sub) => sub.parentId === c.id).length;
                const publicUrl = parent 
                  ? `/products/${parent.slug}/${c.slug}`
                  : `/products/${c.slug}`;

                return (
                  <div key={c.id} className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="aspect-16/9 rounded-xl overflow-hidden bg-slate-50 relative flex items-center justify-center p-2 border border-slate-200/60">
                        <img src={sanitizeImageUrl(c.image)} alt={c.imageAlt || c.name} referrerPolicy="no-referrer" className="max-w-full max-h-full object-contain object-center" />
                        <div className="absolute top-2 left-2">
                          {parent ? (
                            <span className="bg-indigo-900/90 backdrop-blur-xs text-indigo-100 text-[10px] font-bold px-2 py-0.5 rounded-md border border-indigo-700">
                              Sub of {parent.name}
                            </span>
                          ) : (
                            <span className="bg-slate-900/90 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-700">
                              Main Category ({subCount} subs)
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-slate-900 text-base font-serif">{c.name}</h3>
                          <Link
                            href={publicUrl}
                            target="_blank"
                            className="text-slate-400 hover:text-amber-600 p-1"
                            title="View Public Category URL"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                        <p className="text-slate-500 font-mono text-[11px] mt-0.5">{publicUrl}</p>
                        <p className="text-slate-600 text-xs mt-2 line-clamp-2">{c.description}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                          SEO Optimized
                        </span>
                        {!c.parentId && (
                          <button
                            onClick={() => openNewModal(c.id)}
                            className="text-[10px] text-indigo-600 hover:underline font-semibold"
                            title="Add subcategory directly under this parent"
                          >
                            + Subcategory
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Category & SEO"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
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
                <label className="block font-bold text-slate-700 mb-1">Category Hierarchy / Parent *</label>
                <select
                  value={editingCat.parentId || ''}
                  onChange={(e) => handleParentChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 bg-white font-medium"
                >
                  <option value="">None (Top-Level Main Category)</option>
                  {mainCategories
                    .filter((m) => m.id !== editingCat.id)
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        Child of: {m.name}
                      </option>
                    ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Select a main category to create a subcategory (URL: /products/parent/sub), or None for a main category (URL: /products/category).
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">Category Name *</label>
                  <button
                    type="button"
                    onClick={() => handleAutoGenerateSeo(false)}
                    disabled={isGeneratingSeo}
                    className="text-[11px] font-bold text-amber-800 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer border border-amber-300 shadow-xs"
                    title="Generate SEO Title, Description, Keywords & Image Alt in 1 click"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>⚡ 1-Click Auto SEO</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={editingCat.name || ''}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <ImageUploader
                label="Category Banner Image (Full 100% Uncropped View)"
                value={editingCat.image || ''}
                onChange={(url) => setEditingCat({ ...editingCat, image: url })}
                preset="category_banner"
                contextName={editingCat.name || 'Category Banner'}
                categoryName={editingCat.name || ''}
                aspectRatio="auto"
                altText={editingCat.imageAlt || ''}
                onAltTextChange={(alt) => setEditingCat({ ...editingCat, imageAlt: alt })}
                showAltInput={true}
                helperText="Upload any image size/shape. Automatically displayed in 100% full view without cropping or cutting off edges."
              />

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingCat.description || ''}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  placeholder="e.g. Slim, protective padded laptop sleeves and slipcases customizable with debossed or printed logos."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              {/* SEO FIELDS - Auto-generated and Synchronized */}
              <div className="pt-3 border-t border-slate-200 space-y-3 bg-gradient-to-b from-amber-50/80 to-amber-50/40 p-4 rounded-xl border border-amber-200/80">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950 text-xs">
                    <Globe className="w-4 h-4 text-amber-700" />
                    <span>Category SEO Fields</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded-full border border-emerald-300">
                      Auto-Generated
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={autoSyncSeo}
                        onChange={(e) => setAutoSyncSeo(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
                      />
                      <span>Auto-Sync from Name</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleAutoGenerateSeo(false)}
                      disabled={isGeneratingSeo}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-[11px] rounded-lg shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
                      title="Regenerate all SEO fields from Category Name & Description"
                    >
                      <Sparkles className="w-3 h-3 text-amber-200" />
                      <span>{isGeneratingSeo ? 'Generating...' : '⚡ Auto-Fill SEO'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAutoGenerateSeo(true)}
                      disabled={isGeneratingSeo}
                      className="px-2.5 py-1 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-[11px] rounded-lg shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
                      title="Enhance SEO metadata with Google Gemini AI"
                    >
                      <span>✨ AI SEO</span>
                    </button>
                  </div>
                </div>

                {seoGeneratedNotice && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold rounded-md flex items-center gap-1.5 animate-fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{seoGeneratedNotice}</span>
                  </div>
                )}

                {/* Google Search Result Live Preview Snippet */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                    Google Search Result Live Preview
                  </span>
                  <div className="text-[11px] text-emerald-700 font-mono truncate">
                    https://ltsbags.com/products/{editingCat.parentId ? `${editingCat.parentSlug || 'parent'}/` : ''}{editingCat.slug || 'category-slug'}
                  </div>
                  <div className="text-xs font-bold text-blue-700 hover:underline truncate">
                    {editingCat.metaTitle || `${editingCat.name || 'Category'} Manufacturer in India | LTS Bags`}
                  </div>
                  <div className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {editingCat.metaDescription || `Wholesale manufacturer of custom ${editingCat.name?.toLowerCase() || 'bags'} in India. Direct factory bulk pricing & fast samples.`}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-semibold">SEO URL Slug *</label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      /products/{editingCat.parentId ? `${editingCat.parentSlug || 'parent'}/` : ''}{editingCat.slug || ''}
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={editingCat.slug || ''}
                    onChange={(e) => {
                      setAutoSyncSeo(false);
                      setEditingCat({ ...editingCat, slug: e.target.value });
                    }}
                    placeholder="e.g. laptop-sleeves-cases"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-semibold">Meta Title</label>
                    <span className={`text-[10px] font-medium ${
                      (editingCat.metaTitle?.length || 0) >= 42 && (editingCat.metaTitle?.length || 0) <= 60 
                        ? 'text-emerald-600 font-bold' 
                        : (editingCat.metaTitle?.length || 0) > 65 
                          ? 'text-red-600 font-bold' 
                          : 'text-slate-400'
                    }`}>
                      {editingCat.metaTitle?.length || 0}/65 chars {(editingCat.metaTitle?.length || 0) >= 42 && (editingCat.metaTitle?.length || 0) <= 60 ? '• Optimal' : ''}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={editingCat.metaTitle || ''}
                    onChange={(e) => {
                      setAutoSyncSeo(false);
                      setEditingCat({ ...editingCat, metaTitle: e.target.value });
                    }}
                    placeholder="e.g. Laptop Sleeve Manufacturer in India | LTS Bags"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-semibold">Meta Description</label>
                    <span className={`text-[10px] font-medium ${
                      (editingCat.metaDescription?.length || 0) >= 120 && (editingCat.metaDescription?.length || 0) <= 160 
                        ? 'text-emerald-600 font-bold' 
                        : (editingCat.metaDescription?.length || 0) > 165 
                          ? 'text-red-600 font-bold' 
                          : 'text-slate-400'
                    }`}>
                      {editingCat.metaDescription?.length || 0}/165 chars {(editingCat.metaDescription?.length || 0) >= 120 && (editingCat.metaDescription?.length || 0) <= 160 ? '• Optimal' : ''}
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={editingCat.metaDescription || ''}
                    onChange={(e) => {
                      setAutoSyncSeo(false);
                      setEditingCat({ ...editingCat, metaDescription: e.target.value });
                    }}
                    placeholder="e.g. Custom branded laptop sleeves and protective cases manufactured in bulk. Request factory pricing."
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Meta Keywords</label>
                  <input
                    type="text"
                    value={editingCat.metaKeywords || ''}
                    onChange={(e) => {
                      setAutoSyncSeo(false);
                      setEditingCat({ ...editingCat, metaKeywords: e.target.value });
                    }}
                    placeholder="laptop sleeve manufacturer, neoprene laptop cases wholesale, custom branded laptop sleeves"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 outline-none"
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
